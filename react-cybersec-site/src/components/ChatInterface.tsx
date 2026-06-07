import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SYSTEM_PROMPTS, QUICK_CHIPS } from '../utils/systemPrompts';
import { sendMessageToAnthropic } from '../utils/api';
import { generateId, getCurrentTimestamp, formatMarkdown } from '../utils/format';
import { Message } from '../types';
import { StatusBar } from './StatusBar';
import { QuickChips } from './QuickChips';

interface ChatInterfaceProps {
  moduleId: string;
  title: string;
  logo?: React.ReactNode;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ moduleId, title, logo }) => {
  const { apiKeyState, chatStates, updateChatState, addMessage } = useApp();
  const [inputValue, setInputValue] = React.useState('');
  const [streamingContent, setStreamingContent] = React.useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentState = chatStates[moduleId] || { messages: [], isLoading: false, error: null };
  const systemPrompt = SYSTEM_PROMPTS[moduleId] || SYSTEM_PROMPTS.terminal;
  const quickPrompts = QUICK_CHIPS[moduleId] || QUICK_CHIPS.terminal;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentState.messages, streamingContent]);

  const handleSubmit = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent || currentState.isLoading || !apiKeyState.isReady) {
      return;
    }

    setInputValue('');
    updateChatState(moduleId, { isLoading: true, error: null });

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: messageContent,
      timestamp: getCurrentTimestamp(),
    };
    addMessage(moduleId, userMessage);

    try {
      setStreamingContent('');
      const response = await sendMessageToAnthropic(
        [...currentState.messages, userMessage],
        apiKeyState.apiKey,
        apiKeyState.model,
        systemPrompt,
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.content,
        timestamp: getCurrentTimestamp(),
      };
      addMessage(moduleId, assistantMessage);
      setStreamingContent('');
    } catch (error) {
      updateChatState(moduleId, {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      updateChatState(moduleId, { isLoading: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="content-area">
      <div className="terminal-root">
        <div className="term-titlebar">
          <div className="dot dot-red" />
          <div className="dot dot-yellow" />
          <div className="dot dot-green" />
          <div className="term-title">{title} — bash</div>
          <StatusBar />
        </div>

        <QuickChips prompts={quickPrompts} onPrompt={handleSubmit} />

        <div className="output-area" ref={outputRef}>
          {logo && <div className="ascii-logo">{logo}</div>}

          {currentState.messages.length === 0 && (
            <div className="welcome-msg">
              <span style={{ color: '#3fb950' }}>CyberSec AI v1.0</span> — Elite security consultant, powered by Claude
              <hr className="divider" />
              <div className="system-msg">
                // Enter your Anthropic API key above to get started
                <br />
                // Type your questions below or click a quick chip
                <br />
                // All conversations stay local—nothing is stored on servers
              </div>
            </div>
          )}

          {currentState.messages.map((message) => (
            <div
              key={message.id}
              className={`msg-${message.role === 'system' ? 'system' : message.role === 'user' ? 'user' : 'assistant'}`}
            >
              {message.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
              ) : (
                message.content
              )}
            </div>
          ))}

          {currentState.isLoading && streamingContent && (
            <div className="msg-assistant fade-in">
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(streamingContent) }} />
            </div>
          )}

          {currentState.isLoading && !streamingContent && (
            <div className="thinking">
              <span className="thinking-dot" />
              <span className="thinking-dot" />
              <span className="thinking-dot" />
            </div>
          )}

          {currentState.error && (
            <div className="error-msg">
              <strong>Error:</strong> {currentState.error}
            </div>
          )}
        </div>

        <div className="input-area">
          <span className="prompt-symbol">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about cybersecurity..."
            disabled={currentState.isLoading || !apiKeyState.isReady}
            className="chat-input"
          />
        </div>
      </div>
    </div>
  );
};
