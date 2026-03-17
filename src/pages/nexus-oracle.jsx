
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Mic, Key, Play, Eye } from 'lucide-react';
import { Core } from '../api/integrations';

export default function NexusOracle() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome, seeker. I am The Oracle. The invisible laws of the universe are listening. What is it that you seek to understand?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !textOverride) return;

    // Add user message
    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Stream response from Oracle
      let assistantMsg = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      await Core.InvokeLLMStream({
        workflow: 'oracle',
        prompt: textToSend,
        messages: [...messages, { role: 'user', content: textToSend }],
        onChunk: (chunk) => {
          assistantMsg.content += chunk;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { ...assistantMsg };
            return newMsgs;
          });
        }
      });
    } catch (error) {
      console.error("Oracle Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "The connection to the ether is faint. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const PresetButtons = [
    { label: "Reveal new wisdom", icon: Sparkles, prompt: "Entertain me with new cosmic wisdom or an obscure universal fact." },
    { label: "I want to ascend", icon: Key, prompt: "I desire ascension and spiritual growth. Give me a key to unlock my next level of consciousness." },
    { label: "Analyze my energy", icon: Eye, prompt: "Interview me. Ask me probing questions to determine my current spiritual level and alignment." }
  ];

  return (
    <div className="oracle-interface">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Exo+2:wght@300;400&display=swap');

        .oracle-interface {
          min-height: 100dvh;
          min-height: 100vh;
          background: radial-gradient(circle at center, #1a0b2e 0%, #000000 100%);
          color: #e0d0ff;
          font-family: 'Exo 2', sans-serif;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .oracle-interface::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          box-shadow: 0 0 15px #FFD700;
          opacity: 0.5;
        }

        .oracle-header {
          padding: calc(15px + var(--safe-area-top)) 20px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
          background: rgba(3, 3, 3, 0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .oracle-back {
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }
        .oracle-back:hover { 
          color: #FFD700; 
          transform: translateX(-2px);
          filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
        }

        .oracle-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: linear-gradient(to right, #fff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          overflow-y: auto;
          scroll-behavior: smooth;
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .message {
          max-width: 85%;
          padding: 16px 20px;
          position: relative;
          line-height: 1.6;
          font-size: 1.05rem;
          font-weight: 500;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }

        .message.assistant {
          align-self: flex-start;
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 2px solid #FFD700;
          color: #E0E0E0;
          font-family: 'Rajdhani', sans-serif; /* TECH FONT UPDATE */
          letter-spacing: 0.02em;
        }

        .message.user {
          align-self: flex-end;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-right: 2px solid #FFD700;
          color: #FFFFFF;
          text-align: right;
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 8px 12px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            background: rgba(255, 215, 0, 0.05) !important;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.05);
            max-width: 180px;
            clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
        }

        .computing-text {
            font-family: 'Orbitron', monospace;
            font-size: 0.55rem;
            letter-spacing: 0.1em;
            color: #FFD700;
            animation: pulse-text 1.5s infinite;
        }

        .computing-bar {
            width: 100%;
            height: 1px;
            background: rgba(255, 215, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .computing-progress {
            width: 40%;
            background: #FFD700;
            box-shadow: 0 0 5px #FFD700;
        }

        .computing-matrix {
            font-family: 'Rajdhani', monospace;
            font-size: 0.5rem;
            color: rgba(255, 215, 0, 0.5);
            display: flex;
            gap: 6px;
            height: 10px;
            overflow: hidden;
        }

        .input-area {
          padding: 20px;
          background: rgba(3, 3, 3, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          bottom: 0;
        }

        .input-wrapper {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px; /* Hard corners for tech feel */
          padding: 16px 20px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.1rem;
          color: #fff;
          resize: none;
          max-height: 150px;
          min-height: 56px;
          transition: all 0.3s;
        }

        .chat-input:focus {
          outline: none;
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.02);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 10px;
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 4px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preset-btn:hover {
          background: rgba(255, 215, 0, 0.05);
          border-color: #FFD700;
          transform: translateY(-2px);
        }

        .preset-icon { 
            color: #555; 
            transition: color 0.3s;
        }
        .preset-btn:hover .preset-icon { color: #FFD700; }

        .preset-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.7);
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.2); }
        ::-webkit-scrollbar-thumb:hover { background: #FFD700; }

        @media (max-width: 768px) {
          .oracle-header {
            padding: calc(10px + var(--safe-area-top)) 15px 10px;
          }
          
          .oracle-title {
            font-size: 0.9rem;
            letter-spacing: 0.15em;
          }

          .chat-container {
            padding: 24px 10px 15px; /* Added top padding */
            gap: 15px;
          }

          .message {
            max-width: 90%;
            padding: 12px 16px;
            font-size: 0.95rem;
          }

          .input-area {
            padding: 15px 10px;
          }

          .chat-input {
            font-size: 1rem;
            padding: 12px 15px;
          }
          
          .preset-btn {
            padding: 12px;
            font-size: 0.75rem;
          }
          
          .preset-buttons {
            padding-bottom: 10px;
          }
        }
      `}</style>
      <div className="oracle-header">
        <Link to="/nexus" className="oracle-back">
          <ArrowLeft size={24} />
        </Link>
        <div className="oracle-title">THE ORACLE</div>
        <div style={{ width: 24 }} />
      </div>

      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))
        }
        {
          isLoading && (
            <div className="message assistant loading-container">
              <div className="computing-text">ACCESSING COSMIC MATRIX...</div>
              <div className="computing-bar">
                <div className="computing-progress"></div>
              </div>
              <div className="computing-matrix">
                <span>01</span><span>10</span><span>11</span>
              </div>
            </div>
          )
        } <div ref={messagesEndRef} />
      </div >

      <div className="input-area">
        <div className="preset-buttons">
          {PresetButtons.map((btn, idx) => (
            <button
              key={idx}
              className="preset-btn"
              onClick={() => handleSend(btn.prompt)}
              disabled={isLoading}
            >
              <btn.icon size={14} />
              {btn.label}
            </button>
          ))}
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask the invisible..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className={`p-4 rounded-xl border transition-all duration-300 ${isLoading || !input.trim()
              ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/20 hover:shadow-[0_0_15px_#FFD700]/30'
              }`}
          >
            {isLoading ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div >
  );
}
