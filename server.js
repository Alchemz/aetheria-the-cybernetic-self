// Backend API server for secure AI integration
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SYSTEM_PROMPTS, getSystemPrompt } from './src/api/prompts.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use port 5000 in production, port 3000 in development
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

// Initialize Supabase client (optional - used for caching only)
let supabase = null;
let supabaseAvailable = false;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseAvailable = true;
    console.log('✅ Supabase connected (caching enabled)');
  } else {
    console.warn('⚠️  Supabase credentials not found - cosmic briefing caching disabled');
  }
} catch (error) {
  console.error('⚠️  Failed to initialize Supabase - cosmic briefing caching disabled');
  console.error('   Error:', error.message);
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Serve static files from 'dist' folder in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  console.log('📦 Serving static files from:', distPath);
  app.use(express.static(distPath));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY
  });
});

// Helper to determine system prompt and messages
const prepareMessages = (workflow, messages, context) => {
  const systemPrompt = getSystemPrompt(workflow, context);

  // Inject context into system prompt if provided
  let finalSystemContent = systemPrompt;
  if (context && Object.keys(context).length > 0) {
    finalSystemContent += `\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;
  }

  const finalMessages = [
    { role: 'system', content: finalSystemContent },
    ...messages.filter(m => m.role !== 'system') // Filter out existing system messages to avoid duplication
  ];

  return finalMessages;
};

// Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  const { messages, workflow, context, provider = 'openai' } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const finalMessages = prepareMessages(workflow, messages, context);

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      // GEMINI STREAMING
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const lastMessage = finalMessages[finalMessages.length - 1];
      const history = finalMessages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({
        history: history,
        systemInstruction: finalMessages.find(m => m.role === 'system')?.content
      });

      const result = await chat.sendMessageStream(lastMessage.content);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

    } else {
      // OPENAI STREAMING (Default)
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: finalMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    }

    // Send completion signal
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

// Non-streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, workflow, context, provider = 'openai' } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const finalMessages = prepareMessages(workflow, messages, context);

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: finalMessages.find(m => m.role === 'system')?.content
      });

      const chatHistory = finalMessages.filter(m => m.role !== 'system').slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({ history: chatHistory });
      const lastMessage = finalMessages[finalMessages.length - 1];

      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;

      res.json({ content: response.text() });

    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: finalMessages,
        temperature: 0.7,
        max_tokens: 2000
      });

      res.json({
        content: completion.choices[0].message.content
      });
    }

  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Cosmic Briefing endpoint
app.get('/api/cosmic-briefing', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Check Supabase cache if available
    if (supabaseAvailable && supabase) {
      try {
        const { data: existingBriefing } = await supabase
          .from('cosmic_briefings')
          .select('*')
          .eq('date', today)
          .single();

        if (existingBriefing) {
          return res.json({ success: true, briefing: existingBriefing, cached: true });
        }
      } catch (e) {
        console.warn('⚠️ Cache lookup failed');
      }
    }

    console.log('✨ Generating new cosmic briefing for', today);

    // Reuse OpenAI for briefing generation (could also use Gemini here easily)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.COSMIC_BRIEFING },
        { role: 'user', content: `Generate the cosmic briefing for ${todayFormatted}.` }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const briefingText = completion.choices[0].message.content;

    // Extract themes
    const themesCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: `Extract 3-4 key cosmic themes from this text as a JSON object with a "themes" array: \n\n${briefingText}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5
    });

    let cosmicThemes = [];
    try {
      const themesData = JSON.parse(themesCompletion.choices[0].message.content);
      cosmicThemes = themesData.themes || [];
    } catch (e) {
      cosmicThemes = ['Cosmic Alignment', 'Universal Flow'];
    }

    // Cache result
    if (supabaseAvailable && supabase) {
      await supabase.from('cosmic_briefings').insert({
        date: today,
        briefing_text: briefingText,
        cosmic_themes: cosmicThemes
      });
    }

    res.json({
      success: true,
      briefing: {
        date: today,
        briefing_text: briefingText,
        cosmic_themes: cosmicThemes
      },
      cached: false
    });

  } catch (error) {
    console.error('Cosmic briefing error:', error);
    res.status(500).json({ error: 'Failed to generate cosmic briefing', details: error.message });
  }
});

// Serve index.html for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Export app for Cloud Functions
export { app };

// Only listen if running directly (not imported as a library/function)
if (process.env.NODE_ENV !== 'production' || process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend API server running on http://0.0.0.0:${PORT}`);
    console.log(`🔑 OpenAI: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
    console.log(`💎 Gemini: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
  });
}
