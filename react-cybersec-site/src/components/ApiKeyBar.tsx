import React from 'react';
import { useApp } from '../context/AppContext';
import { MODEL_OPTIONS } from '../utils/systemPrompts';

export const ApiKeyBar: React.FC = () => {
  const { apiKeyState, setApiKeyState, saveApiKey } = useApp();
  const [tempKey, setTempKey] = React.useState(apiKeyState.apiKey);

  React.useEffect(() => {
    setTempKey(apiKeyState.apiKey);
  }, [apiKeyState.apiKey]);

  const handleSave = () => {
    const trimmed = tempKey.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      alert("That doesn't look like a valid Anthropic API key (should start with sk-ant-)");
      return;
    }
    saveApiKey(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="api-bar">
      <label>API KEY</label>
      <input
        type="password"
        value={tempKey}
        onChange={(e) => setTempKey(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="sk-ant-api03-..."
        autoComplete="off"
        spellCheck={false}
      />
      <button className="api-save" onClick={handleSave}>
        Save
      </button>

      <select
        value={apiKeyState.model}
        onChange={(e) => setApiKeyState(prev => ({ ...prev, model: e.target.value }))}
        className="model-select"
      >
        {MODEL_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
