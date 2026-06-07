import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { RedTeamLogo } from '../components/AsciiLogo';

export const RedTeam: React.FC = () => {
  return (
    <ChatInterface
      moduleId="redteam"
      title="redteam-ops"
      logo={<RedTeamLogo />}
    />
  );
};
