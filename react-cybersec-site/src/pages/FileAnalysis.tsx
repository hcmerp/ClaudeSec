import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { WebAnalysisLogo } from '../components/AsciiLogo';

export const FileAnalysis: React.FC = () => {
  return (
    <ChatInterface
      moduleId="file-analysis"
      title="file-analysis"
      logo={<WebAnalysisLogo />}
    />
  );
};
