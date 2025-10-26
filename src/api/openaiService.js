// OpenAI Service for Dream Assistant and Athena
// Supports streaming responses with gpt-4o-mini

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Workflow IDs
const WORKFLOWS = {
  DREAM_ASSISTANT: 'wf_68e61b27f9288190b15bf8ee1289fa580c52641aed33ca62',
  ATHENA: 'wf_68f0bd6c0efc8190a01a6b8f81ea19030dc679f4080c2874'
};

/**
 * Call OpenAI Chat Completions API with streaming support
 * @param {Object} options
 * @param {string} options.prompt - The user's message or system prompt
 * @param {string} options.workflow - Which workflow to use ('dream' or 'athena')
 * @param {Object} options.context - Additional context (user data, bio-mods, etc.)
 * @param {Function} options.onChunk - Callback for each streamed chunk
 * @returns {Promise<string>} The complete response
 */
export async function invokeAIWithStreaming({ 
  prompt, 
  workflow = 'athena',
  context = {},
  onChunk = null,
  messages = []
}) {
  try {
    // Build the messages array for the API
    const apiMessages = [];
    
    // Add context as a system message if provided
    if (context && Object.keys(context).length > 0) {
      apiMessages.push({
        role: 'system',
        content: `CONTEXT:\n${JSON.stringify(context, null, 2)}\n\nUse this context to personalize your responses.`
      });
    }
    
    // Add user messages
    if (messages.length > 0) {
      apiMessages.push(...messages);
    } else {
      apiMessages.push({
        role: 'user',
        content: prompt
      });
    }

    const workflowId = workflow === 'dream' ? WORKFLOWS.DREAM_ASSISTANT : WORKFLOWS.ATHENA;
    
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    // Handle streaming response
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
          
          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              fullResponse += content;
              
              // Call the onChunk callback if provided
              if (onChunk && typeof onChunk === 'function') {
                onChunk(content);
              }
            }
          } catch (e) {
            // Skip malformed JSON
            console.warn('Failed to parse SSE data:', e);
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    throw error;
  }
}

/**
 * Non-streaming version for backward compatibility
 */
export async function invokeAI({ prompt, workflow = 'athena', context = {} }) {
  try {
    // Build the messages array
    const apiMessages = [];
    
    // Add context as a system message if provided
    if (context && Object.keys(context).length > 0) {
      apiMessages.push({
        role: 'system',
        content: `CONTEXT:\n${JSON.stringify(context, null, 2)}\n\nUse this context to personalize your responses.`
      });
    }
    
    // Add user message
    apiMessages.push({
      role: 'user',
      content: prompt
    });
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Helper to build context for Dream Assistant
 */
export function buildDreamContext(user, dreamJournalEntries = []) {
  return {
    user_profile: {
      name: user?.full_name,
      birth_date: user?.birth_date,
      birth_time: user?.birth_time,
      birth_location: user?.birth_location
    },
    recent_dreams: dreamJournalEntries.slice(-5).map(entry => ({
      date: entry.date,
      dream: entry.dream,
      interpretation: entry.interpretation
    })),
    sleep_context: {
      // Add sleep tracking data when available
    }
  };
}

/**
 * Helper to build context for Athena
 */
export function buildAthenaContext(user, bioModsData) {
  const activeBioMods = user?.active_bio_mods || [];
  
  return {
    user_profile: {
      name: user?.full_name,
      goals: user?.goals || []
    },
    active_bio_mods: activeBioMods.map(modId => {
      const mod = bioModsData[modId];
      return mod ? {
        id: modId,
        name: mod.name,
        explanation: mod.simpleExplanation,
        habits: mod.habits
      } : null;
    }).filter(Boolean)
  };
}
