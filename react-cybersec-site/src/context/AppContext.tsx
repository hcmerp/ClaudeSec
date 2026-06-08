import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ApiKeyState, ChatState, Message } from '../types';

interface AppContextType {
  apiKeyState: ApiKeyState;
  setApiKeyState: React.Dispatch<React.SetStateAction<ApiKeyState>>;
  saveApiKey: (key: string) => void;
  chatStates: Record<string, ChatState>;
  updateChatState: (module: string, updates: Partial<ChatState>) => void;
  addMessage: (module: string, message: Message) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'cybersec_api_key';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKeyState, setApiKeyState] = useState<ApiKeyState>({
    apiKey: '',
    model: 'claude-sonnet-4-20250514',
    isReady: false,
  });

  const [chatStates, setChatStates] = useState<Record<string, ChatState>>({
    terminal: { messages: [], isLoading: false, error: null },
    redteam: { messages: [], isLoading: false, error: null },
    blueteam: { messages: [], isLoading: false, error: null },
    'web-analysis': { messages: [], isLoading: false, error: null },
    'malware-analysis': { messages: [], isLoading: false, error: null },
  });

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKeyState(prev => ({
        ...prev,
        apiKey: savedKey,
        isReady: true,
      }));
    }
  }, []);

  const saveApiKey = (key: string) => {
    if (key.startsWith('sk-ant-')) {
      localStorage.setItem(STORAGE_KEY, key);
      setApiKeyState(prev => ({
        ...prev,
        apiKey: key,
        isReady: true,
      }));
    }
  };

  const updateChatState = (module: string, updates: Partial<ChatState>) => {
    setChatStates(prev => {
      const currentState = prev[module] || { messages: [], isLoading: false, error: null };
      return {
        ...prev,
        [module]: { ...currentState, ...updates },
      };
    });
  };

  const addMessage = (module: string, message: Message) => {
    setChatStates(prev => {
      const currentState = prev[module] || { messages: [], isLoading: false, error: null };
      return {
        ...prev,
        [module]: {
          ...currentState,
          messages: [...currentState.messages, message],
        },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        apiKeyState,
        setApiKeyState,
        saveApiKey,
        chatStates,
        updateChatState,
        addMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
