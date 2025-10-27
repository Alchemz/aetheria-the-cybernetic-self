// Backend API server for secure OpenAI integration
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

// Initialize OpenAI client (server-side only - API key never exposed to client)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Supabase client using environment variables (secure)
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in Replit Secrets');
  process.exit(1);
}

// Clean up environment variables (fix Replit Secrets formatting issues)
const SUPABASE_URL = process.env.SUPABASE_URL.replace(/^=+/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY.replace(/^=+/, '');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', openai: !!process.env.OPENAI_API_KEY });
});

// Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  const { messages, workflow } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000
    });

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Send completion signal
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('OpenAI streaming error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Non-streaming chat endpoint (fallback)
app.post('/api/chat', async (req, res) => {
  const { messages, workflow } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    res.json({ 
      content: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('OpenAI error:', error);
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
    
    // Check if briefing already exists for today
    const { data: existingBriefing, error: fetchError } = await supabase
      .from('cosmic_briefings')
      .select('*')
      .eq('date', today)
      .single();

    if (existingBriefing && !fetchError) {
      console.log('📖 Returning cached cosmic briefing for', today);
      return res.json({
        success: true,
        briefing: existingBriefing,
        cached: true
      });
    }

    console.log('✨ Generating new cosmic briefing for', today);

    // Generate new briefing using OpenAI
    const todayFormatted = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const briefingPrompt = `You are a master astrologer and cosmic energy interpreter. Generate a detailed daily cosmic briefing for ${todayFormatted}.

IMPORTANT INSTRUCTIONS:
1. Analyze the current planetary transits and their meaning
2. Consider the moon phase and its influence
3. Note any significant astrological events (retrogrades, eclipses, planetary ingresses)
4. Explain the collective energy available to humanity today
5. Provide practical guidance for working with today's cosmic currents
6. Include any powerful aspects between planets
7. Mention which zodiac signs are most activated today
8. Keep it empowering, insightful, and non-dogmatic

Write in a tone that blends ancient cosmic wisdom with modern understanding. Be specific about planetary positions when relevant. Make it approximately 300-400 words.

Format:
- Start with the date and a captivating title
- Main briefing text (flowing paragraphs)
- End with a "Cosmic Invitation" - one practical action for today

DO NOT make it personalized. This is a collective briefing for all of humanity.`;

    const briefingCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: briefingPrompt }],
      temperature: 0.8,
      max_tokens: 800
    });

    const briefingText = briefingCompletion.choices[0].message.content;

    // Extract themes using JSON mode
    const themesPrompt = `Based on this cosmic briefing, extract 3-4 key cosmic themes as short phrases (3-5 words each):

${briefingText}

Return a JSON object with a "themes" key containing an array of strings. Example: {"themes": ["Emotional clarity", "Creative awakening", "Spiritual alignment"]}`;

    const themesCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: themesPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5
    });

    let cosmicThemes = [];
    try {
      const themesData = JSON.parse(themesCompletion.choices[0].message.content);
      cosmicThemes = themesData.themes || Object.values(themesData)[0] || [];
    } catch (e) {
      console.error('Failed to parse themes:', e);
      cosmicThemes = ['Cosmic Alignment', 'Universal Flow', 'Inner Wisdom'];
    }

    // Store the briefing in Supabase
    const { data: newBriefing, error: insertError } = await supabase
      .from('cosmic_briefings')
      .insert({
        date: today,
        briefing_text: briefingText,
        cosmic_themes: cosmicThemes
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to store briefing:', insertError);
      // Return the briefing anyway even if storage failed
      return res.json({
        success: true,
        briefing: {
          date: today,
          briefing_text: briefingText,
          cosmic_themes: cosmicThemes
        },
        cached: false
      });
    }

    res.json({
      success: true,
      briefing: newBriefing,
      cached: false
    });

  } catch (error) {
    console.error('Cosmic briefing generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate cosmic briefing',
      details: error.message 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend API server running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`✅ Ready to accept requests from Vite proxy`);
});
