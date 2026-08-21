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
          <strong>Emulation vs Native Recompilation:</strong> This web app runs compiled N64 machine code via WebAssembly (Mupen64Plus core). By contrast, native recompiled projects like <a href="https://github.com/chrissotraidis/goldenpad" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>GoldenPad</a> statically recompile GoldenEye 007 into native Apple ARM64 code with Metal GPU rendering—achieving true native performance with zero runtime JIT or N64 interpretation.
        </p>
      </div>
    </div>
  );
}
