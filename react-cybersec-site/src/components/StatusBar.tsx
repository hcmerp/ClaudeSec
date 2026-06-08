import React from 'react';
import { useApp } from '../context/AppContext';

export const StatusBar: React.FC = () => {
  const { apiKeyState } = useApp();

  return (
    <div
      className="status-badge"
      style={{
        background: apiKeyState.isReady ? '#1a3a1a' : 'transparent',
        color: apiKeyState.isReady ? '#3fb950' : '#8b949e',
        border: apiKeyState.isReady ? '1px solid #238636' : '1px solid #30363d',
      }}
    >
      {apiKeyState.isReady ? '● READY' : '○ NO KEY'}
    </div>
  );
};


