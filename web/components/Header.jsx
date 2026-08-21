import React from 'react';
import { Gamepad2, ShieldCheck, Cpu } from 'lucide-react';

export default function Header({ statusInfo }) {
  return (
    <header className="app-header">
      <div className="logo-group">
        <Gamepad2 className="text-amber-500" size={28} color="#f59e0b" />
        <h1 className="logo-title">GoldenEye 007</h1>
        <span className="badge">C Decompilation (N64 ROM)</span>
      </div>

      <div className="status-bar">
        <div className="status-item">
          <ShieldCheck size={16} color="#10b981" />
          <span>ROM: <span className="highlight">ge007.u.z64</span></span>
        </div>
        <div className="status-item">
          <Cpu size={16} color="#38bdf8" />
          <span>Build: <span className="highlight-green">VERIFIED OK</span></span>
        </div>
      </div>
    </header>
  );
}
