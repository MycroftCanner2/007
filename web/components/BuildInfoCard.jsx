import React from 'react';
import { Terminal } from 'lucide-react';

export default function BuildInfoCard() {
  return (
    <div className="card">
      <h2>
        <Terminal size={20} color="#f59e0b" />
        Build Specifications
      </h2>
      <div className="info-list">
        <p><span>Decompile Target:</span> <strong>NTSC-U GoldenEye 007</strong></p>
        <p><span>ROM Artifact:</span> <code>build/u/ge007.u.z64</code></p>
        <p><span>SHA1 Checksum:</span> <code>abe01e4aeb033b6c...</code></p>
        <p><span>Toolchain:</span> <strong>SGI IDO 5.3 + GCC MIPS</strong></p>
        <p><span>Core Engine:</span> <strong>Mupen64Plus-Next (WASM)</strong></p>
      </div>
    </div>
  );
}
