import React from 'react';

interface QuickChipsProps {
  prompts: string[];
  onPrompt: (prompt: string) => void;
}

export const QuickChips: React.FC<QuickChipsProps> = ({ prompts, onPrompt }) => {
  return (
    <div className="quick-chips">
      {prompts.map((prompt, index) => (
        <div key={index} className="chip" onClick={() => onPrompt(prompt)}>
          {prompt}
        </div>
      ))}
    </div>
  );
};
