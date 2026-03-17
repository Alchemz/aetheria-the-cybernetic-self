// AI Service for Dream & Athena (OpenAI + Gemini)
import { API_BASE_URL } from './config';

/**
 * Call AI Chat Completions API with streaming support
 * @param {Object} options
 * @param {string} options.prompt - The user's message
 * @param {string} options.workflow - 'dream', 'athena'
 * @param {string} options.provider - 'openai' (default) or 'gemini'
 * @param {Object} options.context - Additional context
 * @param {Function} options.onChunk - Callback for each streamed chunk
 * @param {Array} options.messages - Full history (optional)
 */
export async function invokeAIWithStreaming({
  prompt,
  workflow = 'athena',
  provider = 'openai',
  context = {},
  onChunk = null,
  messages = []
}) {
  try {
    const apiMessages = [...messages];

    // If no history, add initial prompt
    if (apiMessages.length === 0) {
      apiMessages.push({ role: 'user', content: prompt });
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        workflow,
        provider,
        context
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`API error: ${error.error || error.details || response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);

            const content = parsed.content;
            if (content) {
              fullResponse += content;
              if (onChunk) onChunk(content);
            }
          } catch (e) {
            console.warn('SSE Parse Error:', e);
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('AI Stream Error:', error);
    throw error;
  }
}

/**
 * Non-streaming version
 */
export async function invokeAI({
  prompt,
  workflow = 'athena',
  provider = 'openai',
  context = {}
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        workflow,
        provider,
        context
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI Error:', error);
    throw error;
  }
}

export function buildDreamContext(user, dreamJournalEntries = []) {
  return {
    user_profile: {
      name: user?.full_name,
      birth_date: user?.birth_date
    },
    recent_dreams: dreamJournalEntries.slice(-5).map(e => ({
      date: e.date,
      dream: e.dream,
      interpretation: e.interpretation
    }))
  };
}

export function buildAthenaContext(user, bioModsData) {
  const activeBioMods = user?.active_bio_mods || [];
  return {
    user_profile: {
      name: user?.full_name,
      goals: user?.goals || []
    },
    active_bio_mods: activeBioMods.map(modId => {
      const mod = bioModsData[modId];
      return mod ? { name: mod.name, explanation: mod.simpleExplanation } : null;
    }).filter(Boolean)
  };
}
