import React, { useEffect, useRef, useState } from 'react';
import { Play, FolderOpen, RefreshCw, AlertCircle, FileUp, Trash2 } from 'lucide-react';

const DB_NAME = 'GoldenEyeROMCache';
const STORE_NAME = 'roms';
const ROM_KEY = 'cached_ge007_rom';

function openRomDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStoredRom() {
  try {
    const db = await openRomDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(ROM_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveRomToDB(blob, name) {
  try {
    const db = await openRomDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ blob, name, date: Date.now() }, ROM_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

async function clearStoredRomDB() {
  try {
    const db = await openRomDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(ROM_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export default function GamePlayer({ customRomUrl }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingRom, setLoadingRom] = useState(true);
  const [romError, setRomError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('Default (ge007.u.z64)');
  const [hasCachedRom, setHasCachedRom] = useState(false);

  const initEmulator = async (romUrl) => {
    let targetUrl = romUrl || '/build/u/ge007.u.z64';
    setLoadingRom(true);
    setRomError(null);

    // Check if local cache has a stored ROM
    const cachedData = await getStoredRom();
    if (cachedData) {
      setHasCachedRom(true);
    } else {
      setHasCachedRom(false);
    }

    // If target URL is not a Blob URL, check if the server ROM actually exists and is binary data
    if (!targetUrl.startsWith('blob:')) {
      let serverRomValid = false;
      try {
        const response = await fetch(targetUrl, { method: 'GET', headers: { Range: 'bytes=0-3' } });
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('text/html')) {
            const buffer = await response.arrayBuffer();
            if (buffer.byteLength >= 4) {
              const view = new DataView(buffer);
              const magic = view.getUint32(0);
              if ([0x80371240, 0x37804012, 0x12408037, 0x40123780].includes(magic)) {
                serverRomValid = true;
              }
            }
          }
        }
      } catch {
        serverRomValid = false;
      }

      // If server ROM is missing/invalid, try auto-loading from local IndexedDB cache
      if (!serverRomValid) {
        if (cachedData && cachedData.blob) {
          targetUrl = URL.createObjectURL(cachedData.blob);
          setSelectedFileName(`${cachedData.name} (Auto-Loaded Local Cache)`);
        } else {
          setRomError(`ROM artifact at '/build/u/ge007.u.z64' was not found. Copyrighted game assets are not pre-hosted on public servers. Please load a GoldenEye 007 ROM file (.z64, .n64, .v64) or compile the ROM locally with 'make'.`);
          setLoadingRom(false);
          return;
        }
      }
    }

    setLoadingRom(false);
    window.EJS_player = '#game';
    window.EJS_core = 'n64';
    window.EJS_gameUrl = targetUrl;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_color = '#f59e0b';
    window.EJS_mouse = true;
    window.EJS_pointerLock = true;
    window.EJS_language = 'en-US';
    window.EJS_defaultControls = {
      0: {
        0: { value: 88 },  // A button -> Key 'X'
        1: { value: 67 },  // B button -> Key 'C'
        3: { value: 13 },  // Start -> Enter
        4: { value: 38 },  // D-pad Up
        5: { value: 40 },  // D-pad Down
        6: { value: 37 },  // D-pad Left
        7: { value: 39 },  // D-pad Right
        10: { value: 65 }, // L Shoulder -> Key 'A'
        11: { value: 83 }, // R Shoulder -> Key 'S'
        12: { value: 90 }, // Z Trigger -> Key 'Z'
        16: { value: 68 }, // Analog Stick Right -> Key 'D'
        17: { value: 65 }, // Analog Stick Left -> Key 'A'
        18: { value: 83 }, // Analog Stick Down -> Key 'S'
        19: { value: 87 }, // Analog Stick Up -> Key 'W'
        20: { value: 76 }, // C-Right -> Key 'L'
        21: { value: 74 }, // C-Left -> Key 'J'
        22: { value: 75 }, // C-Down -> Key 'K'
        23: { value: 73 }  // C-Up -> Key 'I'
      },
      1: {},
      2: {},
      3: {}
    };

    const loaderId = 'emulatorjs-loader-script';
    if (!document.getElementById(loaderId)) {
      const script = document.createElement('script');
      script.id = loaderId;
      script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
      script.async = true;
      document.body.appendChild(script);
    }

    setLoaded(true);
  };

  useEffect(() => {
    initEmulator(customRomUrl);

    // Event listeners for WASD / Mouse Click routing
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'e', 'q'].includes(key)) {
        let targetCode = null;
        if (key === 'w') targetCode = 'ArrowUp';
        if (key === 's') targetCode = 'ArrowDown';
        if (key === 'a') targetCode = 'ArrowLeft';
        if (key === 'd') targetCode = 'ArrowRight';
        if (key === 'e') targetCode = 'KeyX';
        if (key === 'q') targetCode = 'KeyC';

        if (targetCode) {
          window.dispatchEvent(new KeyboardEvent('keydown', { code: targetCode, key: targetCode }));
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'e', 'q'].includes(key)) {
        let targetCode = null;
        if (key === 'w') targetCode = 'ArrowUp';
        if (key === 's') targetCode = 'ArrowDown';
        if (key === 'a') targetCode = 'ArrowLeft';
        if (key === 'd') targetCode = 'ArrowRight';
        if (key === 'e') targetCode = 'KeyX';
        if (key === 'q') targetCode = 'KeyC';

        if (targetCode) {
          window.dispatchEvent(new KeyboardEvent('keyup', { code: targetCode, key: targetCode }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [customRomUrl]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFileName(file.name);
      await saveRomToDB(file, file.name);
      setHasCachedRom(true);
      initEmulator(url);
    }
  };

  const handleClearCache = async () => {
    await clearStoredRomDB();
    setHasCachedRom(false);
    setSelectedFileName('Default (ge007.u.z64)');
    window.location.reload();
  };

  return (
    <div className="game-container" ref={containerRef}>
      <div className="rom-bar">
        <div className="rom-info">
          <Play size={16} color="#10b981" />
          <span>Active ROM: <strong>{selectedFileName}</strong></span>
        </div>
        <div className="rom-actions">
          <label className="btn btn-primary">
            <FolderOpen size={14} />
            Load ROM
            <input
              type="file"
              accept=".z64,.n64,.v64"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          {hasCachedRom && (
            <button className="btn btn-danger" onClick={handleClearCache} title="Clear cached ROM from browser storage">
              <Trash2 size={14} /> Clear Cache
            </button>
          )}
          <button className="btn" onClick={() => window.location.reload()}>
            <RefreshCw size={14} /> Reload
          </button>
        </div>
      </div>
      {romError ? (
        <div className="rom-error-container">
          <AlertCircle size={48} color="#f59e0b" />
          <h3>ROM Required to Run Game</h3>
          <p>{romError}</p>
          <label className="btn btn-primary rom-upload-btn">
            <FileUp size={16} /> Select & Load N64 ROM File (.z64, .n64)
            <input
              type="file"
              accept=".z64,.n64,.v64"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          <div className="architecture-note">
            <h4>Decompilation & Web Architecture</h4>
            <p>
              This repository contains a C decompilation of GoldenEye 007 that compiles into a 1:1 matching N64 ROM image (<code>ge007.u.z64</code>). The React web interface wraps a WebAssembly runner (Mupen64Plus core) to play the ROM in modern browsers. Uploaded ROMs are cached locally in browser IndexedDB.
            </p>
            <p style={{ marginTop: '8px' }}>
              <em>Looking for a native static recompile without runtime interpretation?</em> Projects like <a href="https://github.com/chrissotraidis/goldenpad" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>GoldenPad</a> statically recompile GoldenEye source code into native machine code (ARM64/Metal or WebAssembly/WebGPU) with zero N64 hardware emulation at runtime.
            </p>
          </div>
        </div>
      ) : (
        <div id="game"></div>
      )}
    </div>
  );
}
