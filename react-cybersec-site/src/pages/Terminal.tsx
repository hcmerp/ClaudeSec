import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { TerminalLogo } from '../components/AsciiLogo';

export const Terminal: React.FC = () => {
  return (
    <ChatInterface
      moduleId="terminal"
      title="cybersec-ai"
      logo={<TerminalLogo />}
    />
  );
};
