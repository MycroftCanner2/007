import React, { useEffect, useRef, useState } from 'react';
import { Play, FolderOpen, RefreshCw } from 'lucide-react';

export default function GamePlayer({ customRomUrl }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('Default (ge007.u.z64)');

  const initEmulator = (romUrl) => {
    window.EJS_player = '#game';
    window.EJS_core = 'n64';
    window.EJS_gameUrl = romUrl || '/build/u/ge007.u.z64';
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_color = '#f59e0b';
    window.EJS_mouse = true;
    window.EJS_pointerLock = true;
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFileName(file.name);
      window.EJS_gameUrl = url;
      if (window.EJS_emulator) {
        window.location.reload();
      }
    }
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
          <button className="btn" onClick={() => window.location.reload()}>
            <RefreshCw size={14} /> Reload
          </button>
        </div>
      </div>
      <div id="game"></div>
    </div>
  );
}
