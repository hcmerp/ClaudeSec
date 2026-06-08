import type { Message } from '../types';

export interface ApiResponse {
  content: string;
  stopReason: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function sendMessageToAnthropic(
  messages: Message[],
  apiKey: string,
  model: string,
  systemPrompt: string,
  onStream?: (chunk: string) => void,
  signal?: AbortSignal
): Promise<ApiResponse> {
  const apiMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

  try {
    console.log('[API] Sending request to Anthropic API');
    console.log('[API] API Key present:', !!apiKey);
    console.log('[API] API Key format:', apiKey?.substring(0, 10) + '...');
    console.log('[API] Model:', model);
    console.log('[API] Number of messages:', apiMessages.length);

    const requestBody = {
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: apiMessages,
      stream: !!onStream,
    };
    console.log('[API] Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      signal,
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: apiMessages,
        stream: !!onStream,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[API] Error response:', errorData);
      console.error('[API] Status:', response.status);
      console.error('[API] StatusText:', response.statusText);
      console.error('[API] Error message:', errorData.error?.message);
      console.error('[API] Error type:', errorData.error?.type);
      throw new Error(
        errorData.error?.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    if (onStream) {
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) {
        throw new Error('No reader available for streaming');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                fullContent += parsed.delta.text;
                onStream(parsed.delta.text);
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      return {
        content: fullContent,
        stopReason: 'stop',
      };
    }

    // Handle non-streaming response
    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      stopReason: data.stop_reason,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}
