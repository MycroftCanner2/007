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
          <strong>Emulation vs Native Recompilation:</strong> This web app provides a React UI shell around WebAssembly (Mupen64Plus core) to run the compiled N64 machine code. React manages the UI controls and DOM layout, while native C game logic runs inside WebAssembly. True native recompilation (like <a href="https://github.com/chrissotraidis/goldenpad" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>GoldenPad</a> for ARM64/Metal or WebGPU static recompilation) translates C/MIPS source directly into target GPU/CPU code—bypassing N64 emulation entirely.
        </p>
      </div>
    </div>
  );
}
