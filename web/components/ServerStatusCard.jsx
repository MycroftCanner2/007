import React from 'react';
import { Cloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function ServerStatusCard({ statusInfo, loading }) {
  return (
    <div className="card">
      <h2>
        <Cloud size={20} color="#f59e0b" />
        Cloudflare Pages Functions
      </h2>
      <div className="info-list">
        <p>
          <span>Server Status:</span>
          <strong>
            {loading ? (
              'Checking...'
            ) : statusInfo?.status === 'online' ? (
              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> Online
              </span>
            ) : (
              <span style={{ color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} /> Offline
              </span>
            )}
          </strong>
        </p>
        <p><span>Deployment:</span> <strong>{statusInfo?.platform || 'Cloudflare Pages'}</strong></p>
        <p><span>WASM Acceleration:</span> <strong>COOP/COEP Enabled</strong></p>
        <p><span>API Endpoint:</span> <code>/api/status</code></p>
        <p><span>Environment:</span> <strong>{statusInfo?.environment || 'Production'}</strong></p>
      </div>
    </div>
  );
}
