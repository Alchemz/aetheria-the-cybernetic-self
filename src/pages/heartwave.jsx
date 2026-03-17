
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  Flame,
  X,
  ChevronRight,
  Info,
  Beaker,
  Clock,
  Dumbbell,
  Bot
} from 'lucide-react';
import { auth } from '@/api/supabaseClient';
import { bioModsData } from '@/data/heartwaveData';

export default function TheTemple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBioMods, setActiveBioMods] = useState([]);
  const [selectedMod, setSelectedMod] = useState(null); // For detail view
  const [user, setUser] = useState(null);

  // Background and Three.js animation handled by TempleLayout parent

  useEffect(() => {
    loadUserBioMods();
  }, []);

  const loadUserBioMods = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
      const userBioMods = currentUser.active_bio_mods || [];
      setActiveBioMods(userBioMods);
    } catch (error) {
      console.error('Error loading bio-mods:', error);
    }
  };

  const bioMods = Object.values(bioModsData);

  const toggleBioMod = async (bioModId) => {
    const newActiveBioMods = activeBioMods.includes(bioModId)
      ? activeBioMods.filter(id => id !== bioModId)
      : [...activeBioMods, bioModId];

    setActiveBioMods(newActiveBioMods);

    try {
      await auth.updateMe({
        active_bio_mods: newActiveBioMods
      });
    } catch (error) {
      console.error('Error saving bio-mods:', error);
    }
  };

  const filteredBioMods = bioMods.filter(mod =>
    mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.simpleExplanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="heartwave-biomods-page">
      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

            .heartwave-biomods-page {
              color: white;
              font-family: 'Rajdhani', sans-serif;
              padding: 1rem;
              padding-bottom: 120px;
            }

            .heartwave-header {
              margin-bottom: 2rem;
              margin-top: 0.5rem;
            }

            .heartwave-header-top {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1.5rem;
            }

            .heartwave-back {
              color: rgba(255, 255, 255, 0.7);
              transition: color 0.3s;
              text-decoration: none;
            }

            .heartwave-back:hover {
              color: #00A86B;
            }

            .heartwave-title {
              font-family: 'Orbitron', monospace;
              font-size: 2rem;
              font-weight: 900;
              color: #00A86B;
              flex: 1;
              text-align: center;
              letter-spacing: 0.15em;
              text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
            }

            .heartwave-subtitle {
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.95rem;
              margin-bottom: 1.5rem;
              line-height: 1.5;
            }

            .heartwave-search-box {
              background: rgba(0, 168, 107, 0.05);
              border: 1px solid rgba(0, 168, 107, 0.3);
              padding: 1rem;
              display: flex;
              gap: 1rem;
              align-items: center;
              margin-bottom: 2rem;
              border-radius: 12px;
            }

            .heartwave-search-box input {
              background: transparent;
              border: none;
              color: white;
              flex: 1;
              font-size: 1rem;
              outline: none;
            }

            .heartwave-search-box input::placeholder {
              color: rgba(255, 255, 255, 0.3);
            }

            /* --- GRID STYLES --- */
            .heartwave-biomods-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
              gap: 1.5rem;
            }

            .heartwave-biomod-card {
              background: rgba(0, 168, 107, 0.03);
              border: 1px solid rgba(0, 168, 107, 0.2);
              padding: 2rem;
              position: relative;
              transition: all 0.3s ease;
              cursor: pointer;
              border-radius: 16px;
              overflow: hidden;
            }

            .heartwave-biomod-card:hover {
              border-color: #00A86B;
              background: rgba(0, 168, 107, 0.08);
              box-shadow: 0 0 30px rgba(0, 168, 107, 0.15);
              transform: translateY(-2px);
            }

            .heartwave-biomod-card.active {
              background: linear-gradient(145deg, rgba(0, 168, 107, 0.1), rgba(0,0,0,0));
              border-color: #00A86B;
              box-shadow: 0 0 20px rgba(0, 168, 107, 0.2);
            }

            .heartwave-biomod-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 1.5rem;
            }

            .heartwave-biomod-icon-wrapper {
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 168, 107, 0.1);
              border-radius: 12px;
              border: 1px solid rgba(0, 168, 107, 0.2);
              color: #00A86B;
            }

            .heartwave-biomod-card.active .heartwave-biomod-icon-wrapper {
              background: #00A86B;
              color: black;
              box-shadow: 0 0 15px rgba(0, 168, 107, 0.6);
            }

            .heartwave-biomod-name {
              font-family: 'Orbitron', monospace;
              font-size: 1.1rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
              color: white;
              letter-spacing: 0.05em;
            }

            .heartwave-biomod-desc-short {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.85rem;
                line-height: 1.5;
                margin-bottom: 1rem;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .heartwave-status-badge {
                /* Positioned within flex header now */
            }

            /* --- FLOATING AI WIDGET --- */
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            
            .detail-overlay {
                position: fixed;
                inset: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85); /* Darker dim for focus */
                backdrop-filter: blur(8px);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center; /* Enforce center */
                padding: 20px;
                animation: fadeIn 0.2s ease;
            }

            .detail-card {
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 168, 107, 0.5);
                width: 100%;
                max-width: 500px;
                border-radius: 24px;
                position: relative;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(0, 168, 107, 0.2);
                animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                max-height: 80vh; 
                margin: auto; /* Safety centering */
            }

            .detail-header {
                padding: 1.5rem;
                background: linear-gradient(90deg, rgba(0,168,107,0.1) 0%, rgba(0,0,0,0) 100%);
                border-bottom: 1px solid rgba(0, 168, 107, 0.3);
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .ai-avatar {
                width: 48px;
                height: 48px;
                background: black;
                border: 2px solid #00A86B;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #00A86B;
                box-shadow: 0 0 15px rgba(0, 168, 107, 0.6);
                animation: pulse-glow 3s infinite;
            }

            @keyframes pulse-glow { 0% { box-shadow: 0 0 20px rgba(0, 168, 107, 0.2); } 50% { box-shadow: 0 0 40px rgba(0, 168, 107, 0.5); } 100% { box-shadow: 0 0 20px rgba(0, 168, 107, 0.2); } }

            .ai-header-text {
                flex: 1;
            }

            .ai-label {
                font-family: 'Orbitron', monospace;
                color: #00A86B;
                font-size: 0.7rem;
                letter-spacing: 0.2em;
                margin-bottom: 4px;
            }

            .detail-title {
                font-family: 'Orbitron', monospace;
                font-size: 1.1rem;
                color: white;
                line-height: 1.2;
                font-weight: 700;
            }

            .detail-content {
                padding: 1.5rem;
                overflow-y: auto;
            }

            .detail-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                z-index: 10;
            }
            .detail-close:hover { background: #00A86B; color: black; border-color: #00A86B; }

            .section-label {
                font-family: 'Orbitron', monospace;
                font-size: 0.75rem;
                letter-spacing: 0.1em;
                color: #00A86B;
                margin-bottom: 0.8rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                opacity: 0.9;
                padding-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.05);
            }
            .section-label:first-child { border-top: none; padding-top: 0; }

            .chat-bubble {
                background: rgba(0, 168, 107, 0.05);
                border-left: 3px solid #00A86B;
                padding: 1rem;
                border-radius: 4px 12px 12px 4px;
                margin-bottom: 1rem;
            }

            .chat-text {
                font-size: 1rem; /* Big enough to read */
                line-height: 1.6;
                color: rgba(255,255,255,0.9);
                font-weight: 400;
            }

            .habit-item-row {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 0.8rem 0;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 0.5rem;
            }

            .habit-time {
                font-family: 'Orbitron', monospace;
                color: #00A86B;
                font-size: 0.8rem;
                white-space: nowrap;
                background: rgba(0, 168, 107, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
            }

            .habit-detail h4 {
                color: white;
                font-weight: 600;
                margin-bottom: 0.2rem;
                font-size: 0.95rem;
            }
            
            .habit-detail p {
                color: rgba(255,255,255,0.6);
                font-size: 0.85rem;
                line-height: 1.4;
            }

            .activate-btn {
                margin: 1.5rem;
                margin-top: 0;
                background: #00A86B;
                color: black;
                font-family: 'Orbitron', monospace;
                font-weight: 900;
                font-size: 0.9rem;
                padding: 1.2rem;
                border: none;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0, 168, 107, 0.3);
            }
            
            .activate-btn:hover {
                background: #00DE8D;
                box-shadow: 0 0 40px rgba(0, 222, 141, 0.6);
                transform: scale(1.02);
            }

            .activate-btn.is-active {
                background: transparent;
                border: 2px solid #333;
                color: rgba(255,255,255,0.4);
                box-shadow: none;
            }
            .activate-btn.is-active:hover {
                background: rgba(255,50,50,0.1);
                border-color: rgba(255,50,50,0.5);
                color: #ff5555;
            }
          `}</style>

      {/* HEADER */}
      <div className="heartwave-header">
        <div className="heartwave-header-top">
          <Link to="/portal" className="heartwave-back">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="heartwave-title">THE TEMPLE</h1>
          <div style={{ width: 24 }} />
        </div>

        <p className="heartwave-subtitle">
          Activate bio-modules to upgrade your physical vessel.
        </p>

        {activeBioMods.length > 0 && (
          <div className="heartwave-active-count">
            <div className="heartwave-active-count-number">{activeBioMods.length}</div>
            <div className="heartwave-active-count-label">Active Bio-Mods</div>
          </div>
        )}

        <div className="heartwave-search-box">
          <Search size={20} color="#00A86B" />
          <input
            type="text"
            placeholder="Search bio-mods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link to="/heartwave-console" className="update-routine-btn">
          <Target size={18} />
          <span>Update Routine Stack</span>
        </Link>
      </div>

      {/* GRID */}
      <div className="heartwave-biomods-grid">
        {filteredBioMods.map(mod => {
          const Icon = mod.icon;
          const isActive = activeBioMods.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`heartwave-biomod-card ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedMod(mod)}
            >
              <div className="heartwave-biomod-header">
                <div className="heartwave-biomod-icon-wrapper">
                  <Icon size={24} />
                </div>
                <div className="heartwave-status-badge">
                  {isActive && <CheckCircle2 size={24} className="text-[#00A86B]" />}
                </div>
              </div>

              <h3 className="heartwave-biomod-name">{mod.name}</h3>
              <p className="heartwave-biomod-desc-short">{mod.description}</p>

              <div className="flex items-center gap-2 mt-4 text-[0.75rem] text-white/40 tracking-wider uppercase font-mono">
                <span>{mod.habits.length} Habits</span>
                <span>•</span>
                <span>{mod.difficulty || 'Advanced'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOATING AI WIDGET OVERLAY */}
      {selectedMod && createPortal(
        <div className="detail-overlay" onClick={() => setSelectedMod(null)}>
          <div className="detail-card" onClick={e => e.stopPropagation()}>
            <button className="detail-close" onClick={() => setSelectedMod(null)}>
              <X size={20} />
            </button>

            <div className="detail-header">
              <div className="ai-avatar">
                <Bot size={28} />
              </div>
              <div className="ai-header-text">
                <div className="ai-label">ATHENA ANALYSIS</div>
                <div className="detail-title">{selectedMod.name}</div>
              </div>
            </div>

            <div className="detail-content custom-scrollbar">

              {/* WHY IT WORKS - AI Voice */}
              <div className="chat-bubble">
                <div className="ai-label" style={{ marginBottom: '0.5rem' }}>EXPLANATION</div>
                <p className="chat-text">
                  {selectedMod.simpleExplanation}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(0,168,107,0.2)', paddingTop: '0.5rem' }}>
                  Science: {selectedMod.description}
                </div>
              </div>

              {/* DAILY HABITS */}
              <div className="section-label"><Clock size={12} /> PROTOCOL STEPS</div>
              <div>
                {selectedMod.habits.map((h, idx) => (
                  <div key={idx} className="habit-item-row">
                    <div className="habit-time">{h.duration}m</div>
                    <div className="habit-detail">
                      <h4>{h.name}</h4>
                      <p>{h.why}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUPPLEMENTS */}
              {selectedMod.supplements && selectedMod.supplements.length > 0 && (
                <>
                  <div className="section-label"><Beaker size={12} /> CHEMICAL SUPPORT</div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {selectedMod.supplements.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '0.8rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#00A86B' }}>{s.name}</strong>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{s.dosage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

            </div>

            {/* ACTION BUTTON */}
            <button
              className={`activate-btn ${activeBioMods.includes(selectedMod.id) ? 'is-active' : ''}`}
              onClick={() => {
                toggleBioMod(selectedMod.id);
              }}
            >
              {activeBioMods.includes(selectedMod.id) ? 'DEACTIVATE PROTOCOL' : 'ACTIVATE PROTOCOL'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
