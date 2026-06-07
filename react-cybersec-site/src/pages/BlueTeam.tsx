import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { BlueTeamLogo } from '../components/AsciiLogo';

export const BlueTeam: React.FC = () => {
  return (
    <ChatInterface
      moduleId="blueteam"
      title="blueteam-ops"
      logo={<BlueTeamLogo />}
    />
  );
};
