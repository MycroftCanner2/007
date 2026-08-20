import React, { useEffect, useRef, useState } from 'react';
import { Play, FolderOpen, RefreshCw } from 'lucide-react';

export default function GamePlayer({ customRomUrl }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('Default (ge007.u.z64)');

  const initEmulator = (romUrl) => {
    if (!window.EJS_player) {
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
          '0': '90',  // Z - Trigger (Shoot) -> Key 'Z'
          '1': '88',  // A - Action -> Key 'X' or 'E'
          '2': '67',  // B - Weapon -> Key 'C' or 'Q'
          '3': '13',  // Start -> Enter
          '4': '38',  // D-pad Up
          '5': '40',  // D-pad Down
          '6': '37',  // D-pad Left
          '7': '39',  // D-pad Right
          '10': '65', // L Shoulder
          '11': '83', // R Shoulder -> Key 'S' (Aim)
          '12': '73', // C-Up
          '13': '75', // C-Down
          '14': '74', // C-Left
          '15': '76', // C-Right
          '16': '87', // Analog Up -> Key 'W'
          '17': '83', // Analog Down -> Key 'S'
          '18': '65', // Analog Left -> Key 'A'
          '19': '68'  // Analog Right -> Key 'D'
        }
      };
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
