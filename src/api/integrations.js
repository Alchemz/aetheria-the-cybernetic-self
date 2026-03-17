// AI Integration using custom workflows
// Replaces Base44 integrations with OpenAI gpt-4o-mini

import { invokeAI, invokeAIWithStreaming } from './aiService';

// Core integration object that matches Base44 API structure
export const Core = {
  // Main LLM invocation function (non-streaming)
  InvokeLLM: async ({ prompt, workflow = 'athena', context = {}, add_context_from_internet = false }) => {
    // Pass workflow through directly, fallback to athena only if undefined
    const workflowId = workflow || 'athena';

    const response = await invokeAI({
      prompt,
      workflow: workflowId,
      context
    });
    return response;
  },

  // Streaming version for real-time responses
  InvokeLLMStream: async ({ prompt, workflow = 'athena', context = {}, onChunk, messages = [] }) => {
    const workflowId = workflow || 'athena';

    const response = await invokeAIWithStreaming({
      prompt,
      workflow: workflowId,
      context,
      onChunk,
      messages
    });
    return response;
  }
};

// Shorthand exports
export const InvokeLLM = Core.InvokeLLM;
export const InvokeLLMStream = Core.InvokeLLMStream;

// Placeholder exports for future integrations
export const SendEmail = null;
export const UploadFile = null;
export const GenerateImage = null;
export const ExtractDataFromUploadedFile = null;
export const CreateFileSignedUrl = null;
export const UploadPrivateFile = null;
