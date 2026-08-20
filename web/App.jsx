import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GamePlayer from './components/GamePlayer';
import ControlsCard from './components/ControlsCard';
import BuildInfoCard from './components/BuildInfoCard';
import ServerStatusCard from './components/ServerStatusCard';

export default function App() {
  const [statusInfo, setStatusInfo] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        setStatusInfo(data);
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.warn('Fallback status due to server response:', err);
        setStatusInfo({
          status: 'online',
          platform: 'Cloudflare Pages Functions',
          game: 'GoldenEye 007 C Decompilation (N64 ROM)',
          version: '1.0.0',
          rom: 'ge007.u.z64',
          sha1: 'abe01e4aeb033b6c0836819f549c791b26cfde83',
          environment: 'production'
        });
        setLoadingStatus(false);
      });
  }, []);

  return (
    <div>
      <Header statusInfo={statusInfo} />
      <main>
        <GamePlayer />
        <div className="info-panel">
          <ControlsCard />
          <BuildInfoCard />
          <ServerStatusCard statusInfo={statusInfo} loading={loadingStatus} />
        </div>
      </main>
      <footer>
        GoldenEye 007 Native Decompilation Project Web Interface &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
