import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { WebAnalysisLogo } from '../components/AsciiLogo';

export const WebAnalysis: React.FC = () => {
  return (
    <ChatInterface
      moduleId="web-analysis"
      title="web-analysis"
      logo={<WebAnalysisLogo />}
    />
  );
};
