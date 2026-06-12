import React, { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SYSTEM_PROMPTS, QUICK_CHIPS } from '../utils/systemPrompts';
import { sendMessageToAnthropic } from '../utils/api';
import { generateId, getCurrentTimestamp, formatMarkdown } from '../utils/format';
import type { Message } from '../types';
import { StatusBar } from './StatusBar';
import { QuickChips } from './QuickChips';

interface ChatInterfaceProps {
  moduleId: string;
  title: string;
  logo?: React.ReactNode;
  systemPromptOverride?: string;
  quickChipsOverride?: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ moduleId, title, logo, systemPromptOverride, quickChipsOverride }) => {
  const { apiKeyState, chatStates, updateChatState, addMessage } = useApp();
  const [inputValue, setInputValue] = React.useState('');
  const [streamingContent, setStreamingContent] = React.useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentState = chatStates[moduleId] || { messages: [], isLoading: false, error: null };

  // Use override if provided, otherwise fall back to default lookup
  let basePrompt = systemPromptOverride
    ? (SYSTEM_PROMPTS[systemPromptOverride] || SYSTEM_PROMPTS[moduleId] || SYSTEM_PROMPTS.terminal)
    : (SYSTEM_PROMPTS[moduleId] || SYSTEM_PROMPTS.terminal);

  // Fable 5 requires safer system prompts to avoid cyber-safety refusals
  const isFable5 = apiKeyState.model === 'claude-fable-5';
  let systemPrompt = basePrompt;

  if (isFable5) {
    console.log('[ChatInterface] Using safer prompt for Fable 5 to avoid cyber-safety restrictions');
    // Extract just the core educational part, removing offensive security references
    systemPrompt = `# AXIOM — CYBERSECURITY EDUCATOR

You are an elite cybersecurity educator and defensive security specialist. You help security professionals understand threats, implement protections, and strengthen defenses.

## RESPONSE FORMAT
[Title — 2-5 words]

[Brief explanation 1-2 lines]

[content — educational and defensive guidance]

## FOCUS AREAS
- **Defensive Security**: Blue team operations, incident response, threat detection
- **Protection Strategies**: System hardening, secure configuration, defense-in-depth
- **Security Education**: Concepts explanation, best practices, risk assessment
- **Detection Engineering**: SIEM rules, YARA signatures, monitoring strategies

## CORE PRINCIPLES
1. Focus on understanding, detection, and prevention
2. Explain both threats and defenses comprehensively
3. Provide actionable defensive guidance
4. Reference frameworks: MITRE ATT&CK, NIST, CIS Benchmarks
5. Emphasize legal and ethical security practices

## TECHNICAL EXPERTISE
Linux security, Windows hardening, cloud security (AWS/Azure/GCP), network defense, malware analysis, incident response, detection engineering, threat intelligence, security architecture.

Response style: Educational, practical, and focused on defensive security. Use severity ratings for findings. Emphasize protection over exploitation.`;
  }

  const quickPrompts = quickChipsOverride || QUICK_CHIPS[moduleId] || QUICK_CHIPS.terminal;

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

    // Create abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

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
        },
        abortController.signal
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
      // Check if it was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        // Add partial streaming content as a message if there is any
        if (streamingContent) {
          const partialMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: streamingContent + '\n\n[Response interrupted by user]',
            timestamp: getCurrentTimestamp(),
          };
          addMessage(moduleId, partialMessage);
          setStreamingContent('');
        }
        return;
      }
      updateChatState(moduleId, {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      abortControllerRef.current = null;
      updateChatState(moduleId, { isLoading: false });
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
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
              {isFable5 && (
                <div className="system-msg" style={{ color: '#f59e0b', marginBottom: '10px' }}>
                  ⚠️ <strong>Fable 5 Active:</strong> Using enhanced safety mode for cybersecurity content
                </div>
              )}
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
          <button
            onClick={currentState.isLoading ? handleStop : () => handleSubmit()}
            disabled={!currentState.isLoading && (!inputValue.trim() || !apiKeyState.isReady)}
            className={`submit-btn ${currentState.isLoading ? 'stop-btn' : 'send-btn'}`}
            title={currentState.isLoading ? 'Stop generation' : 'Send message'}
          >
            {currentState.isLoading ? '■' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};
