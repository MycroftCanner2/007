import React from 'react';
import { Terminal, Info } from 'lucide-react';

export default function BuildInfoCard() {
  return (
    <div className="card">
      <h2>
        <Terminal size={20} color="#f59e0b" />
        Build & Execution Architecture
      </h2>
      <div className="info-list">
        <p><span>Decompile Target:</span> <strong>NTSC-U GoldenEye 007</strong></p>
        <p><span>Output ROM:</span> <code>build/u/ge007.u.z64</code></p>
        <p><span>SHA1 Checksum:</span> <code>abe01e4aeb033b6c...</code></p>
        <p><span>Toolchain:</span> <strong>SGI IDO 5.3 + GCC MIPS</strong></p>
        <p><span>Web Runner:</span> <strong>Mupen64Plus-Next (WASM)</strong></p>
      </div>
      <div className="arch-explain">
        <p>
          <Info size={14} color="#38bdf8" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          <strong>Emulation vs Native Port:</strong> This repo decompiles N64 machine code back into C source code, which compiles into a matching N64 ROM. The web interface runs this compiled ROM using WebAssembly N64 emulation.
        </p>
      </div>
    </div>
  );
}
