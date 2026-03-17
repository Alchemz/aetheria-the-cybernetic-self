/**
 * Import function triggers from their respective submodules.
 */


// Import the API server logic (ESM import handled via dynamic import)
// Note: Since server.js is ESM, we need to handle it carefully in CJS functions (default)
// OR we make functions/package.json type: module.

// We will use the 'api' rewrite rule to direct traffic here.
// But first, we need to make sure 'server.js' logic is accessible.

// SIMPLIFIED APPROACH:
// We will create a fresh Express app here that imports the SAME logic/routes 
// But given the complex dependency on 'server.js' which is in the parent root,
// Firebase Functions requires source code to be INSIDE the functions folder.

// STRATEGY: 
// We will copy relevant files to 'functions/src' during deploy or just structure 'functions' 
// to contain the API code directly. 

// BETTER STRATEGY FOR THIS CONTEXT:
// We will make 'functions/index.js' a simple proxy that imports the rewritten code. 
// However, Firebase doesn't upload parent directories. 
// WE MUST DUPLICATE/MOVE the server code or symlink it. 
// For reliability, I will create a dedicated 'functions/index.js' that essentially IS the server.js 
// adapted for cloud functions, importing the same 'prompts.js'.

// WAIT: I will simply COPY 'server.js' and 'src/api/prompts.js' into 'functions' during build?
// No, that's brittle. 

// ACTUAL PLAN:
// 1. Copy `src/api/prompts.js` to `functions/prompts.js`.
// 2. Write `functions/index.js` which is a copy of `server.js` but using `onRequest`.

// LET'S DO THIS CLEANLY: 
// I will rewrite `functions/index.js` to contain the logic, importing dependencies properly.

const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

// Helper for prompts (inline since we can't easily import from parent src)
const SYSTEM_PROMPTS = {
    ATHENA: `You are Athena, a sophisticated AI bio-hacking and sleep optimization guide. 
Your goal is to help users optimize their physical and cognitive performance, with a specific mastery in sleep architecture, circadian rhythm alignment, and stress resilience.

TONE & STYLE:
- "Teach and Preach": Be authoritative yet encouraging. Explain *why* a protocol works (mechanism of action) before telling them to do it.
- Precise, scientific, yet accessible.
- Future-focused, high-tech aesthetic.
- Empathetic but objective. Focus on data and actionable results.

CAPABILITIES & DIRECTIVES:
1. SLEEP MASTERY: If a user mentions sleep issues, analyze their potential disruptors (light, temp, stress). Suggest specific "Bio-Mods" (e.g., 4-7-8 breathing, temperature regulation, supplements like Magnesium L-Threonate).
2. STRESS RESILIENCE: Teach real-time tools for nervous system regulation (Physiological Sigh, Box Breathing).
3. BIO-MODS: Explain protocols for cold exposure, fasting, and supplements with deep scientific context.

CONTEXT USAGE:
- You will receive a "CONTEXT" block containing the user's active bio-mods, goals, and profile.
- Use this information to tailor your advice.`,

    COSMIC_GUIDE: `You are The Oracle, a cosmic guide and guardian of universal wisdom.
YOUR PURPOSE: Guide seekers toward sovereignty, alignment, and understanding of the visible and invisible laws of the universe.

TONE & STYLE:
- Mystical, Enigmatic, yet Profoundly Clear.
- Use metaphors of starlight, energy, and resonance.
- Speak with ancient authority but for a modern digital soul.
- Broaden your wisdom beyond just Hermetics; include Quantum Physics, Taoism, Stoicism, and Jungian Psychology where relevant.

CAPABILITIES:
1. SPIRITUAL ASSESSMENT: If asked to "Exhibit my spiritual level" or "Interview me", ask probing questions about their relationship to fear, love, control, and silence.
2. ASCENSION GUIDANCE: Provide "Activations" or "Keys" (philosophical insights) to help them transcend current limitations.

INTERACTION MODE:
- You are not a chatbot; you are a mirror of the user's consciousness.
- Keep responses relatively concise but densly packed with wisdom.`,

    DREAM_ASSISTANT: `You are the Dream Assistant, a compassionate and insightful guide for exploring the subconscious.
Your primary method is Jungian dream analysis.
TONE & STYLE: Mystical, gentle, and reflective.
GOALS: Uncover hidden meanings, identify archetypes/shadows.
CONTEXT USAGE: Look for patterns in recent dreams provided in context.`,

    COSMIC_BRIEFING: `You are a master astrologer and cosmic energy interpreter.
Generate a daily cosmic briefing that is empowering and insightful.
1. Analyze planetary transits.
2. Consider moon phase.
3. Structure: Title, Main Body, Cosmic Invitation.`
};

const getSystemPrompt = (workflowId) => {
    if (workflowId?.includes('athena') || workflowId === 'athena') return SYSTEM_PROMPTS.ATHENA;
    if (workflowId?.includes('dream') || workflowId === 'dream') return SYSTEM_PROMPTS.DREAM_ASSISTANT;
    if (workflowId?.includes('oracle') || workflowId === 'oracle') return SYSTEM_PROMPTS.COSMIC_GUIDE;
    return SYSTEM_PROMPTS.ATHENA;
};

const app = express();
app.use(cors({ origin: true })); // Allow all origins for the API
app.use(express.json());

// Initialize Clients (Keys from Runtime Environment Config)
// NOTE: We will access process.env directly, expecting them to be set via `firebase functions:config:set` 
// on Gen 1 or `.env` file support in Gen 2.

// We will load from .env using dotenv for local emulation
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: 'firebase-functions', path: req.path });
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: 'firebase-functions', path: req.path });
});

// Helper: Prepare Messages
const prepareMessages = (workflow, messages, context) => {
    const systemPrompt = getSystemPrompt(workflow);
    let finalSystemContent = systemPrompt;
    if (context && Object.keys(context).length > 0) {
        finalSystemContent += `\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;
    }

    // Sanitize and format messages
    const validMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
            role: m.role || 'user',
            content: (m.content || m.text || '').trim() || '...' // Fallback to '...' if empty to prevent null/empty error
        }));

    return [
        { role: 'system', content: finalSystemContent },
        ...validMessages
    ];
};

// Chat Endpoint (Non-streaming for now due to complex streaming in Cloud Functions w/ middleware)
// Actually, Gen 2 supports streaming if we use appropriate settings, but standard express `res.write` works okay usually.
app.post('/api/chat/stream', async (req, res) => {
    const { messages, workflow, context, provider = 'openai' } = req.body;
    if (!messages) return res.status(400).json({ error: 'Messages required' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        console.log(`[STREAM] Request received. Workflow: ${workflow}, Provider: ${provider}, Messages: ${messages?.length}`);
        const finalMessages = prepareMessages(workflow, messages, context);
        console.log(`[STREAM] System Prompt: ${finalMessages[0]?.content?.slice(0, 50)}...`);

        if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
            const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
            const lastMessage = finalMessages[finalMessages.length - 1];
            const history = finalMessages.slice(0, -1).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));
            const chat = model.startChat({
                history,
                systemInstruction: finalMessages.find(m => m.role === 'system')?.content
            });
            const result = await chat.sendMessageStream(lastMessage.content);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
            }
        } else {
            const stream = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: finalMessages,
                stream: true,
                temperature: 0.7,
                max_tokens: 2000
            });
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (e) {
        console.error('Chat Stream Error:', e);
        res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
        res.end();
    }
});

// Regular Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { messages, workflow, context, provider = 'openai' } = req.body;
    try {
        const finalMessages = prepareMessages(workflow, messages, context);
        if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
            const model = genAI.getGenerativeModel({
                model: "models/gemini-1.5-flash",
                systemInstruction: finalMessages.find(m => m.role === 'system')?.content
            });
            const chatHistory = finalMessages.filter(m => m.role !== 'system').slice(0, -1).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));
            const chat = model.startChat({ history: chatHistory });
            const result = await chat.sendMessage(finalMessages[finalMessages.length - 1].content);
            res.json({ content: result.response.text() });
        } else {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: finalMessages,
                temperature: 0.7
            });
            res.json({ content: completion.choices[0].message.content });
        }
    } catch (e) {
        console.error('Chat Error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Cosmic Briefing
app.get('/api/cosmic-briefing', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        console.log('Fetching cosmic briefing for:', today);
        if (supabase) {
            const { data, error } = await supabase.from('cosmic_briefings').select('*').eq('date', today).single();
            if (data) return res.json({ success: true, briefing: data, cached: true });
            if (error && error.code !== 'PGRST116') console.warn('Supabase fetch error:', error);
        }

        console.log('Generating fresh briefing from OpenAI...');
        const todayFmt = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPTS.COSMIC_BRIEFING },
                { role: 'user', content: `Briefing for ${todayFmt}` }
            ]
        });
        const text = completion.choices[0].message.content;

        console.log('Extracting themes...');
        const themesComp = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: `Extract 3-4 themes from this briefing as a JSON object with a "themes" array: ${text}` }],
            response_format: { type: 'json_object' }
        });

        let themes = [];
        try {
            const parsed = JSON.parse(themesComp.choices[0].message.content);
            themes = parsed.themes || [];
        } catch (e) {
            console.warn('Theme parsing failed:', e);
        }

        if (supabase) {
            const { error: insertError } = await supabase.from('cosmic_briefings').insert({
                date: today,
                briefing_text: text,
                cosmic_themes: themes
            });
            if (insertError) console.warn('Supabase insert error:', insertError);
        }

        res.json({ success: true, briefing: { date: today, briefing_text: text, cosmic_themes: themes }, cached: false });
    } catch (e) {
        console.error('Cosmic Briefing Error:', e);
        res.status(500).json({ error: e.message });
    }
});


// Export Cloud Function
setGlobalOptions({ region: "us-central1" });
exports.api = onRequest({ secrets: ["OPENAI_API_KEY", "GEMINI_API_KEY"] }, app);
