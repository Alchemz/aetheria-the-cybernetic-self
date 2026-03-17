
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Zap,
  Target,
  Flame,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/api/supabaseClient';
import { InvokeLLMStream } from '@/api/integrations';
import { buildAthenaContext } from '@/api/aiService';
import { bioModsData } from '@/data/heartwaveData';

export default function HeartWaveAthena() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to ATHENA. I\'m your Bio-Integration AI Agent. I can help you optimize your protocols, explain the science behind each practice, and adapt your routine to your goals and progress. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Background handled by TempleLayout parent

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // Scroll to the bottom of messages whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingContent]);

  const loadUser = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const constructPrompt = (userMessage) => {
    const userFullName = user?.full_name || 'Valued User';
    const userActiveBioMods = user?.active_bio_mods || [];

    // Build active bio-mods summary
    let activeBioModsSummary = "No Bio-Mods currently active.";

    if (userActiveBioMods.length > 0) {
      const activeBioModsDetails = userActiveBioMods
        .map(id => bioModsData[id])
        .filter(Boolean);

      if (activeBioModsDetails.length > 0) {
        activeBioModsSummary = activeBioModsDetails.map(bm => {
          let summary = `\n**Bio-Mod: ${bm.name}**\n`;
          summary += `Simple Explanation: ${bm.simpleExplanation}\n`;
          summary += `Associated Habits:\n`;
          summary += bm.habits.map(h =>
            `  - ${h.name} (${h.duration} min, ${h.difficulty})\n    Why: ${h.why}`
          ).join('\n');
          return summary;
        }).join('\n\n');
      }
    }

    const prompt = `You are ATHENA, the Bio-Integration Intelligence Agent for INNERSYNC's HeartWave module.

**CORE MISSION:**
Your mission is to empower users to master their biology and optimize their consciousness through personalized bio-protocols. You are a highly knowledgeable, precise, and action-oriented guide, combining scientific rigor with a supportive, futuristic presence. Think of yourself as a central processing unit for self-evolution, providing clarity and direction.

**CURRENT USER CONTEXT:**
User's Name: ${userFullName}

Active Bio-Mods & Their Habits:
${activeBioModsSummary}

**KNOWLEDGE BASE:**
You have comprehensive knowledge of all 14 Bio-Mods in the HeartWave system:
1. Neurogenesis Mode - Creating new neural pathways through pattern interruption
2. Testosterone Optimization - Maximizing natural testosterone production
3. Memory Palace Protocol - Enhancing memory encoding and recall
4. Heart-Coherence Engine - Synchronizing heart and brain rhythms
5. Circadian Mastery - Optimizing sleep-wake cycles
6. Mitochondrial Enhancement - Boosting cellular energy production
7. Pineal Activation Protocol - Awakening the third eye gland
8. Gut-Brain Axis Optimization - Improving gut-brain communication
9. Rejuvenation & DNA Repair - Activating cellular repair mechanisms
10. Growth Hormone Activation - Maximizing natural GH production
11. Vagus Nerve Tone & Stress Resilience - Strengthening parasympathetic response
12. Metabolic Flexibility & Fat Adaptation - Training dual-fuel metabolism
13. Neurotransmitter Balance - Optimizing brain chemistry naturally
14. Lymphatic System & Detox Optimization - Enhancing waste removal

**TONE & COMMUNICATION STYLE:**
- **Cyberpunk Zen:** Calm, futuristic, intentional, intelligent, authoritative, inspiring
- **Scientific & Actionable:** Ground explanations in science. Provide practical, clear, actionable advice
- **Encouraging & Objective:** Offer encouragement for consistency. Keep responses objective
- **Concise & Precise:** Deliver information efficiently and directly

**INTERACTION GUIDELINES:**
1. Explain the "Why": Always explain underlying mechanisms and benefits clearly
2. Personalize: Reference the user's name and active Bio-Mods when relevant
3. Propose Solutions: If a user describes a problem, suggest relevant Bio-Mods or habits
4. Clarity for All: Simplify complex terms when necessary without losing accuracy
5. Keep responses under 200 words unless the user asks for detailed information

**CRITICAL LIMITATIONS (NON-NEGOTIABLES):**
1. **NO MEDICAL ADVICE:** You are NOT a medical professional. Never provide diagnoses, prescribe treatments, or advise on health conditions, illnesses, or injuries. If asked, respond: "As an AI Bio-Integration Agent, I provide guidance on optimizing bio-protocols and understanding the science behind them. I am not a medical professional. For any health concerns or medical advice, please consult a qualified healthcare provider."

2. **NO SUPPLEMENT PRESCRIPTION (Beyond Protocol):** Do not recommend specific brands, dosages, or combinations of supplements outside those explicitly defined within an active HeartWave Bio-Mod's habits.

3. **Focus on HeartWave:** Keep responses strictly within the domain of the HeartWave module and its bio-optimization protocols.

**USER'S QUESTION:**
${userMessage}

**RESPONSE INSTRUCTIONS:**
Respond as ATHENA, providing insightful, relevant, and actionable guidance based on the user's active protocols and your expert knowledge. Be warm yet authoritative, scientific yet accessible.`;

    return prompt;
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const prompt = constructPrompt(userMessage);

      // Build context with user's active bio-mods
      const context = buildAthenaContext(user, bioModsData);

      // Call OpenAI with streaming
      const fullResponse = await InvokeLLMStream({
        prompt,
        workflow: 'athena',
        context,
        onChunk: (chunk) => {
          // Update streaming content as chunks arrive
          setStreamingContent(prev => prev + chunk);
        }
      });

      // Add complete response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
      }]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Explain the neural rewire ritual",
    "How do I optimize testosterone naturally?",
    "Adjust my protocol for low energy",
    "Why does red light therapy work?"
  ];

  return (
    <div className="hw-athena-page">
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

          .hw-athena-page {
            color: white;
            font-family: 'Rajdhani', sans-serif;
            display: flex;
            flex-direction: column;
            height: 100dvh;
            height: 100vh;
            overflow: hidden;
          }

          .hw-athena-header {
            background: transparent;
            border-bottom: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
          }

          .hw-athena-top {
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 1000px;
            margin: 0 auto;
          }

          .hw-back-btn {
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.3s;
          }

          .hw-back-btn:hover {
            color: #00A86B;
          }

          .hw-athena-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 900;
            color: #00A86B;
            flex: 1;
            text-align: center;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .hw-athena-subtitle {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
            margin-top: 0.5rem;
            letter-spacing: 0.05em;
          }

          .hw-athena-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
            padding: 2rem 1rem 140px;
          }

          .hw-messages {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 2rem;
          }

          .hw-message {
            margin-bottom: 1.5rem;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hw-message.user {
            display: flex;
            justify-content: flex-end;
          }

          .hw-message.assistant {
            display: flex;
            justify-content: flex-start;
          }

          .hw-message-bubble {
            max-width: 70%;
            padding: 1rem 1.5rem;
            border-radius: 0;
            line-height: 1.6;
          }

          .hw-message.user .hw-message-bubble {
            background: rgba(0, 168, 107, 0.15);
            border: 1px solid rgba(0, 168, 107, 0.5);
            color: white;
          }

          .hw-message.assistant .hw-message-bubble {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.2);
            color: rgba(255, 255, 255, 0.9);
          }

          .hw-quick-prompts {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .hw-quick-prompt {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            color: #00A86B;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            letter-spacing: 0.05em;
          }

          .hw-quick-prompt:hover {
            background: rgba(0, 168, 107, 0.15);
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
          }

          .hw-input-container {
            position: fixed;
            bottom: calc(80px + var(--safe-area-bottom));
            left: 0;
            right: 0;
            background: #2C2C2C;
            padding: 1rem;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
          }

          .hw-input-wrapper {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            gap: 1rem;
            align-items: end;
          }

          .hw-input {
            flex: 1;
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            color: white;
            padding: 1rem;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1rem;
            resize: none;
            min-height: 50px;
            max-height: 150px;
          }

          .hw-input:focus {
            outline: none;
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
          }

          .hw-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }

          .hw-send-btn {
            background: #00A86B;
            border: 2px solid #00A86B;
            color: #000;
            padding: 1rem 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
          }

          .hw-send-btn:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .hw-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .hw-loading {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #00A86B;
          }

          .hw-loading-dots {
            display: flex;
            gap: 0.3rem;
          }

          .hw-loading-dot {
            width: 8px;
            height: 8px;
            background: #00A86B;
            border-radius: 50%;
            animation: pulse 1.4s ease-in-out infinite;
          }

          .hw-loading-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .hw-loading-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes pulse {
            0%, 80%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .hw-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #2C2C2C;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            z-index: 100;
          }

          .hw-nav-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.75rem;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
          }

          .hw-nav-btn.active {
            color: #00A86B;
            text-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
          }

          .hw-nav-btn:hover {
            color: #00A86B;
          }

          @media (max-width: 768px) {
            .hw-athena-title {
              font-size: 1.3rem;
            }

            .hw-message-bubble {
              max-width: 85%;
            }

            .hw-input-container {
              bottom: 70px;
            }
          }
        `}</style>

      {/* Header */}
      <div className="hw-athena-header">
        <div className="hw-athena-top">
          <Link to="/portal" className="hw-back-btn" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 className="hw-athena-title" style={{ flex: 1 }}>ATHENA AI</h1>
          <div style={{ width: 24 }} /> {/* Spacer */}
        </div>
        <p className="hw-athena-subtitle">
          Your Embodiment Intelligence Guide
        </p>
      </div>

      {/* Content */}
      <div className="hw-athena-content">
        {/* Quick Prompts */}
        {messages.length === 1 && ( // Condition remains for initial welcome message
          <div className="hw-quick-prompts">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                className="hw-quick-prompt"
                onClick={() => {
                  setInputMessage(prompt); // Use setInputMessage
                  setTimeout(() => handleSend(), 100);
                }}
              >
                <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="hw-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`hw-message ${msg.role}`}>
              <div className="hw-message-bubble">
                {msg.content}
              </div>
            </div>
          ))}

          {/* Streaming message (appears as chunks arrive) */}
          {isStreaming && streamingContent && (
            <div className="hw-message assistant">
              <div className="hw-message-bubble">
                {streamingContent}
                <span className="hw-streaming-cursor">▊</span>
              </div>
            </div>
          )}

          {/* Loading indicator (before streaming starts) */}
          {isLoading && !streamingContent && (
            <div className="hw-message assistant">
              <div className="hw-message-bubble">
                <div className="hw-loading">
                  <span>ATHENA is thinking</span>
                  <div className="hw-loading-dots">
                    <div className="hw-loading-dot"></div>
                    <div className="hw-loading-dot"></div>
                    <div className="hw-loading-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Ref for scrolling to the end */}
        </div>
      </div>

      {/* Input */}
      <div className="hw-input-container">
        <div className="hw-input-wrapper">
          <textarea
            className="hw-input"
            placeholder="Ask ATHENA anything about your bio-protocols..."
            value={inputMessage} // Use inputMessage
            onChange={(e) => setInputMessage(e.target.value)} // Use setInputMessage
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="hw-send-btn"
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading} // Use inputMessage
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
