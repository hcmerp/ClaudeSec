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

    // For Claude Fable 5, ensure no thinking parameter is sent
    // Fable 5 has adaptive thinking enabled by default
    if (model === 'claude-fable-5') {
      console.log('[API] Using Claude Fable 5 with adaptive thinking enabled');
    }

    // Add request timeout for Fable 5
    const timeout = model === 'claude-fable-5' ? 120000 : undefined; // 2 minutes for Fable 5

    console.log('[API] Request body:', JSON.stringify(requestBody, null, 2));

    // Create timeout for Fable 5 if no signal provided
    let timeoutController: AbortController | undefined;
    let fetchSignal = signal;
    if (model === 'claude-fable-5' && !signal) {
      timeoutController = new AbortController();
      fetchSignal = timeoutController.signal;
      setTimeout(() => {
        console.log('[API] Fable 5 timeout reached');
        timeoutController?.abort();
      }, 120000); // 2 minute timeout
    }

    const response = await fetch('/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      signal: fetchSignal,
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

      console.log('[API] Starting to read streaming response...');
      let eventCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('[API] Stream completed. Total events:', eventCount);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              console.log('[API] Received [DONE] signal');
              continue;
            }
            let stopReason = 'stop';

            try {
              const parsed = JSON.parse(data);
              eventCount++;
              if (parsed.type === 'message_delta' && parsed.delta?.stop_reason){
                stopReason = parsed.delta.stop_reason;
              }

              return { content: fullContent, stopReason };
              // Log all event types for debugging
              if (eventCount <= 5 || parsed.type !== 'content_block_delta') {
                console.log('[API] Stream event type:', parsed.type, 'Event:', parsed);
              }

              // Handle content_block_delta events (standard text content)
              if (parsed.type === 'content_block_delta' && parsed.delta?.text === 'text_delta') {
                fullContent += parsed.delta.text;
                onStream(parsed.delta.text);
                console.log('[API] Content delta received, total length:', fullContent.length);
              }
              // Handle thinking_delta events (Fable 5 adaptive thinking)
              if (parsed.type == 'content_block_delta' && parsed.delta?.type === 'thinking_delta'){
                console.log('[API] Thinking delta received (internal)');
              }
              // Handle other event types
              else if (parsed.type === 'message_start' || parsed.type === 'message_delta' ||
                       parsed.type === 'content_block_start' || parsed.type === 'content_block_stop') {
                console.log('[API] Control event:', parsed.type);
              }
            } catch (e) {
              console.error('[API] Error parsing stream data:', e, 'Raw data:', data);
            }
          }
        }
      }

      console.log('[API] Final content length:', fullContent.length);
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
