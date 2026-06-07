export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiKeyState {
  apiKey: string;
  model: string;
  isReady: boolean;
}

export interface AnalysisResult {
  platform: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  url?: string;
}

export type ChatModule = 'terminal' | 'redteam' | 'blueteam' | 'web-analysis' | 'malware-analysis';

export interface NavigationItem {
  id: ChatModule | 'file-analysis';
  label: string;
  icon: string;
  path: string;
}
