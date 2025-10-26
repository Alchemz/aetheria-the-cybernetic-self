
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Bell, Calendar, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/api/supabaseClient';

export default function CosmicObservatory() {
  const mountRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cosmicBriefing, setCosmicBriefing] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  const [currentView, setCurrentView] = useState('calendar'); // Changed default to calendar

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      sizes[i] = Math.random() * 2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const planetGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const planets = [];

    for (let i = 0; i < 5; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: [0xFFD700, 0xFFA500, 0xFF6347, 0x4169E1, 0x9370DB][i],
        transparent: true,
        opacity: 0.8
      });
      const planet = new THREE.Mesh(planetGeometry, material);
      const radius = 2 + i * 0.8;
      planet.userData = { radius, speed: 0.5 - i * 0.08, angle: Math.random() * Math.PI * 2 };
      planets.push(planet);
      scene.add(planet);
    }

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      stars.rotation.y = elapsedTime * 0.02;
      
      planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed * 0.01;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.radius;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.radius;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    loadCosmicBriefing();
  }, []);

  const loadCosmicBriefing = async () => {
    try {
      const response = await base44.functions.invoke('generateDailyCosmicBriefing', {});
      setCosmicBriefing(response.data.briefing);
    } catch (error) {
      console.error('Failed to load cosmic briefing:', error);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const cosmicEvents = [
    {
      id: 1,
      name: 'Full Moon in Leo',
      date: '2025-02-09',
      daysUntil: 12,
      type: 'lunar',
      significance: 'Peak creative energy, self-expression, and leadership qualities amplified',
      recommendations: [
        { type: 'meditation', text: 'Heart Chakra Opening Meditation' },
        { type: 'frequency', text: '528 Hz Heart Coherence Track' },
        { type: 'practice', text: 'Creative Expression Ritual' }
      ]
    },
    {
      id: 2,
      name: 'Mercury Retrograde Begins',
      date: '2025-03-15',
      daysUntil: 46,
      type: 'planetary',
      significance: 'Time for reflection, review, and inner recalibration. Avoid major decisions.',
      recommendations: [
        { type: 'meditation', text: 'Stillness & Inner Listening' },
        { type: 'frequency', text: '7.83 Hz Schumann Resonance' },
        { type: 'practice', text: 'Journaling & Shadow Work' }
      ]
    },
    {
      id: 3,
      name: 'Spring Equinox',
      date: '2025-03-20',
      daysUntil: 51,
      type: 'solar',
      significance: 'Balance of light and dark. Perfect time for new beginnings and rebirth.',
      recommendations: [
        { type: 'meditation', text: 'Balance & Equilibrium Practice' },
        { type: 'frequency', text: '432 Hz Nature Attunement' },
        { type: 'practice', text: 'Spring Renewal Ritual' }
      ]
    },
    {
      id: 4,
      name: 'Perseid Meteor Shower Peak',
      date: '2025-08-12',
      daysUntil: 196,
      type: 'celestial',
      significance: 'Cosmic downloads and spiritual insights. High dimensional energy.',
      recommendations: [
        { type: 'meditation', text: 'Starlight Activation' },
        { type: 'frequency', text: '963 Hz Pineal Stimulation' },
        { type: 'practice', text: 'Night Sky Meditation' }
      ]
    }
  ];

  const getEventColor = (type) => {
    const colors = {
      lunar: '#9370DB',
      planetary: '#FFD700',
      solar: '#FF6347',
      celestial: '#4169E1'
    };
    return colors[type] || '#FFFFFF';
  };

  return (
    <div className="cosmic-observatory">
      <style>{`
        .cosmic-observatory {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
        }

        .observatory-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .observatory-content {
          position: relative;
          z-index: 10;
          padding: 80px 20px 40px;
        }

        .observatory-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #9370DB;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 40px;
          transition: all 0.3s ease;
        }

        .observatory-back:hover {
          color: #BA55D3;
          transform: translateX(-3px);
        }

        .observatory-header {
          text-align: center;
          margin-bottom: 50px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .observatory-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #9370DB;
          margin-bottom: 15px;
          text-shadow: 0 0 30px #9370DB;
        }

        .observatory-subtitle {
          color: rgba(147, 112, 219, 0.8);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .view-toggle {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .toggle-btn {
          padding: 12px 24px;
          background: rgba(147, 112, 219, 0.1);
          border: 2px solid rgba(147, 112, 219, 0.3);
          color: rgba(186, 85, 211, 0.7);
          font-family: 'Orbitron', monospace;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          border-radius: 4px;
        }

        .toggle-btn:hover {
          border-color: #9370DB;
        }

        .toggle-btn.active {
          background: rgba(147, 112, 219, 0.2);
          border-color: #9370DB;
          color: #9370DB;
          box-shadow: 0 0 20px rgba(147, 112, 219, 0.4);
        }

        .events-timeline {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 20px;
        }

        .event-card {
          background: rgba(147, 112, 219, 0.05);
          border: 2px solid rgba(147, 112, 219, 0.3);
          padding: 30px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .event-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--event-color);
        }

        .event-card:hover {
          border-color: #9370DB;
          box-shadow: 0 0 30px rgba(147, 112, 219, 0.3);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
        }

        .event-info {
          flex: 1;
        }

        .event-name {
          font-family: 'Orbitron', monospace;
          color: var(--event-color);
          font-size: 1.4rem;
          margin-bottom: 8px;
        }

        .event-meta {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .event-countdown {
          background: rgba(147, 112, 219, 0.2);
          border: 1px solid var(--event-color);
          padding: 8px 16px;
          border-radius: 20px;
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          color: var(--event-color);
          white-space: nowrap;
        }

        .event-significance {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .event-recommendations {
          background: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-left: 3px solid var(--event-color);
        }

        .recommendations-title {
          font-family: 'Orbitron', monospace;
          color: var(--event-color);
          font-size: 1rem;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .recommendation-item {
          padding: 12px;
          margin-bottom: 10px;
          background: rgba(147, 112, 219, 0.05);
          border: 1px solid rgba(147, 112, 219, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .recommendation-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(147, 112, 219, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recommendation-text {
          color: rgba(186, 85, 211, 0.9);
          font-size: 0.95rem;
        }

        .notification-banner {
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.2), rgba(186, 85, 211, 0.2));
          border: 2px solid #9370DB;
          padding: 20px;
          text-align: center;
          margin-bottom: 40px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 8px;
        }

        .banner-icon {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .cosmic-briefing-section {
          max-width: 1000px;
          margin: 0 auto 50px;
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.15), rgba(186, 85, 211, 0.1));
          border: 2px solid rgba(147, 112, 219, 0.4);
          padding: 40px;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }

        .cosmic-briefing-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #9370DB, #BA55D3, #9370DB, transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .briefing-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .briefing-icon {
          animation: pulse 2s ease-in-out infinite;
        }

        .briefing-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.6rem;
          color: #BA55D3;
          letter-spacing: 0.1em;
          text-shadow: 0 0 20px rgba(186, 85, 211, 0.5);
        }

        .briefing-date {
          color: rgba(186, 85, 211, 0.7);
          font-size: 0.9rem;
          margin-bottom: 20px;
          font-family: 'Orbitron', monospace;
          letter-spacing: 0.05em;
        }

        .briefing-themes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }

        .theme-tag {
          background: rgba(147, 112, 219, 0.2);
          border: 1px solid rgba(147, 112, 219, 0.5);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #BA55D3;
          font-family: 'Orbitron', monospace;
          letter-spacing: 0.05em;
        }

        .briefing-content {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.9;
          font-size: 1.05rem;
          white-space: pre-line;
        }

        .briefing-loading {
          text-align: center;
          color: rgba(186, 85, 211, 0.7);
          padding: 40px;
          font-family: 'Orbitron', monospace;
          animation: pulse 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .observatory-content {
            padding: 60px 15px 30px;
          }

          .observatory-title {
            font-size: 2rem;
          }

          .event-card {
            padding: 20px;
          }

          .event-header {
            flex-direction: column;
            gap: 15px;
          }

          .event-countdown {
            align-self: flex-start;
          }
        }
      `}</style>

      <div ref={mountRef} className="observatory-bg" />

      <div className="observatory-content">
        <Link to="/nexus" className="observatory-back">
          <ArrowLeft size={18} />
          Back to Nexus
        </Link>

        <div className="observatory-header">
          <h1 className="observatory-title">THE COSMIC OBSERVATORY</h1>
          <p className="observatory-subtitle">
            A living star chart tracking celestial events and their energetic influence. 
            Align your biohacking practice with cosmic rhythms.
          </p>
        </div>

        {/* View Toggle - Swapped Order */}
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            COSMIC CALENDAR
          </button>
          <button 
            className={`toggle-btn ${currentView === 'briefing' ? 'active' : ''}`}
            onClick={() => setCurrentView('briefing')}
          >
            TODAY'S BRIEFING
          </button>
        </div>

        {/* Calendar View First */}
        {currentView === 'calendar' && (
          <>
            <div className="notification-banner">
              <Bell className="banner-icon" size={24} color="#9370DB" style={{display: 'inline-block', marginRight: '10px'}} />
              <span style={{color: '#BA55D3', fontFamily: 'Orbitron'}}>
                Full Moon approaching in 12 days - Peak energy window
              </span>
            </div>

            <div className="events-timeline">
              {cosmicEvents.map(event => (
                <div 
                  key={event.id} 
                  className="event-card"
                  style={{'--event-color': getEventColor(event.type)}}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div className="event-header">
                    <div className="event-info">
                      <h2 className="event-name">{event.name}</h2>
                      <div className="event-meta">{event.date}</div>
                      <div className="event-meta" style={{textTransform: 'uppercase', fontSize: '0.8rem', color: getEventColor(event.type)}}>
                        {event.type} EVENT
                      </div>
                    </div>
                    <div className="event-countdown">
                      {event.daysUntil} days
                    </div>
                  </div>

                  <p className="event-significance">{event.significance}</p>

                  <div className="event-recommendations">
                    <div className="recommendations-title">
                      <Zap size={18} />
                      Recommended Practices
                    </div>
                    {event.recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-item">
                        <div className="recommendation-icon">
                          {rec.type === 'meditation' && '🧘'}
                          {rec.type === 'frequency' && '🎵'}
                          {rec.type === 'practice' && '✨'}
                        </div>
                        <div className="recommendation-text">{rec.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Cosmic Briefing View Second */}
        {currentView === 'briefing' && (
          <div className="cosmic-briefing-section">
            {loadingBriefing ? (
              <div className="briefing-loading">
                <Sparkles size={32} />
                <div style={{marginTop: '15px'}}>Channeling today's cosmic intelligence...</div>
              </div>
            ) : cosmicBriefing ? (
              <>
                <div className="briefing-header">
                  <Sparkles className="briefing-icon" size={28} color="#BA55D3" />
                  <h2 className="briefing-title">TODAY'S COSMIC BRIEFING</h2>
                </div>
                
                <div className="briefing-date">
                  {new Date(cosmicBriefing.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                {cosmicBriefing.cosmic_themes && cosmicBriefing.cosmic_themes.length > 0 && (
                  <div className="briefing-themes">
                    {cosmicBriefing.cosmic_themes.map((theme, idx) => (
                      <div key={idx} className="theme-tag">{theme}</div>
                    ))}
                  </div>
                )}

                <div className="briefing-content">
                  {cosmicBriefing.briefing_text}
                </div>
              </>
            ) : (
              <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)'}}>
                Unable to load cosmic briefing. Please refresh the page.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
