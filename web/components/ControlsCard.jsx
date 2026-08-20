import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function ControlsCard() {
  const controls = [
    { name: 'Move / Strafe', key: 'WASD / Arrows' },
    { name: 'Shoot / Fire (Z)', key: 'Left Click / Z' },
    { name: 'Aim / Lock-on (R)', key: 'Right Click / S' },
    { name: 'Action / Open (A)', key: 'E / X' },
    { name: 'Weapon Swap (B)', key: 'Q / C' },
    { name: 'Start / Pause', key: 'Enter' },
    { name: 'Look Around', key: 'Mouse / I J K L' }
  ];

  return (
    <div className="card">
      <h2>
        <Gamepad2 size={20} color="#f59e0b" />
        Player Controls (FPS & Standard)
      </h2>
      <div className="controls-grid">
        {controls.map((ctrl, idx) => (
          <div key={idx} className="control-item">
            <span>{ctrl.name}</span>
            <span className="key">{ctrl.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
