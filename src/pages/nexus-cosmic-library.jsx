import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Calendar, Search, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CosmicLibrary() {
  const mountRef = useRef(null);
  const [activeTab, setActiveTab] = useState('transit');
  const [transitDate, setTransitDate] = useState('');
  const [symbolInput, setSymbolInput] = useState('');
  const [interpretation, setInterpretation] = useState('');

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Cosmic energy field
    const geometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFF5900,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xFF8C42,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      torus.rotation.x = elapsedTime * 0.1;
      torus.rotation.y = elapsedTime * 0.15;
      
      particles.rotation.y = elapsedTime * 0.02;

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

  const handleTransitInterpret = () => {
    setInterpretation('Transit interpretation will be powered by AI + Astrology API in Phase 2. This will analyze planetary positions for your selected date and provide personalized guidance.');
  };

  const handleSymbolDecode = () => {
    setInterpretation('Symbol decoder will use AI trained on Jungian archetypes, astrological symbolism, and esoteric wisdom to interpret your input in Phase 2.');
  };

  return (
    <div className="cosmic-library">
      <style>{`
        .cosmic-library {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
        }

        .lib-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .lib-content {
          position: relative;
          z-index: 10;
          padding: 80px 20px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .lib-back-button {
          position: absolute;
          left: 20px;
          top: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #FF5900;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          z-index: 100;
        }

        .lib-back-button:hover {
          color: #FF8C42;
          transform: translateX(-3px);
        }

        .lib-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .lib-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #FF5900;
          margin-bottom: 15px;
          text-shadow: 0 0 30px #FF5900;
        }

        .tab-selector {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
        }

        .tab-btn {
          padding: 12px 24px;
          background: rgba(255, 89, 0, 0.1);
          border: 2px solid rgba(255, 89, 0, 0.3);
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover {
          border-color: #FF5900;
          color: #FF8C42;
        }

        .tab-btn.active {
          background: rgba(255, 89, 0, 0.2);
          border-color: #FF5900;
          color: #FF5900;
          box-shadow: 0 0 20px rgba(255, 89, 0, 0.4);
        }

        .tool-section {
          background: rgba(255, 89, 0, 0.05);
          border: 2px solid rgba(255, 89, 0, 0.3);
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        .tool-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.6rem;
          color: #FF5900;
          margin-bottom: 10px;
          text-align: center;
        }

        .tool-description {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
        }

        .interpretation-box {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 89, 0, 0.3);
          padding: 25px;
          margin-top: 30px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .calendar-item {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 89, 0, 0.3);
          padding: 20px;
          transition: all 0.3s ease;
        }

        .calendar-item:hover {
          border-color: #FF5900;
          box-shadow: 0 0 15px rgba(255, 89, 0, 0.3);
        }

        .calendar-date {
          font-family: 'Orbitron', monospace;
          color: #FF5900;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .calendar-event {
          color: #FF8C42;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .calendar-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .lib-content {
            padding: 60px 15px 30px;
          }

          .lib-title {
            font-size: 1.8rem;
          }

          .tool-section {
            padding: 25px;
          }

          .calendar-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div ref={mountRef} className="lib-bg" />

      <Link to="/nexus" className="lib-back-button">
        <ArrowLeft size={18} />
        Command Center
      </Link>

      <div className="lib-content">
        <div className="lib-header">
          <h1 className="lib-title">COSMIC LIBRARY</h1>
          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem'}}>
            Interactive knowledge and ritual protocols
          </p>
        </div>

        <div className="tab-selector">
          <button
            className={`tab-btn ${activeTab === 'transit' ? 'active' : ''}`}
            onClick={() => setActiveTab('transit')}
          >
            <Calendar size={16} />
            Transit Interpreter
          </button>
          <button
            className={`tab-btn ${activeTab === 'symbol' ? 'active' : ''}`}
            onClick={() => setActiveTab('symbol')}
          >
            <Search size={16} />
            Symbol Decoder
          </button>
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <BookOpen size={16} />
            Cosmic Calendar
          </button>
          <button
            className={`tab-btn ${activeTab === 'rituals' ? 'active' : ''}`}
            onClick={() => setActiveTab('rituals')}
          >
            <Sparkles size={16} />
            Alignment Protocols
          </button>
        </div>

        {activeTab === 'transit' && (
          <div className="tool-section">
            <h2 className="tool-title">TRANSIT INTERPRETER</h2>
            <p className="tool-description">
              Input any date to understand the cosmic weather and receive personalized practices aligned with current planetary energies.
            </p>

            <div className="input-group">
              <label className="input-label">Select Date</label>
              <Input
                type="date"
                value={transitDate}
                onChange={(e) => setTransitDate(e.target.value)}
              />
            </div>

            <Button onClick={handleTransitInterpret} style={{width: '100%'}}>
              Interpret Cosmic Weather
            </Button>

            {interpretation && (
              <div className="interpretation-box">
                <strong style={{color: '#FF8C42'}}>COSMIC INSIGHT</strong><br/><br/>
                {interpretation}
              </div>
            )}
          </div>
        )}

        {activeTab === 'symbol' && (
          <div className="tool-section">
            <h2 className="tool-title">SYMBOL DECODER</h2>
            <p className="tool-description">
              Input dreams, synchronicities, or symbols. The AI interprets them through archetypal, astrological, and psychological lenses.
            </p>

            <div className="input-group">
              <label className="input-label">Describe Your Symbol/Dream/Synchronicity</label>
              <Textarea
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value)}
                placeholder="I keep seeing the number 444 everywhere..."
                rows={5}
              />
            </div>

            <Button onClick={handleSymbolDecode} style={{width: '100%'}}>
              Decode Symbol
            </Button>

            {interpretation && (
              <div className="interpretation-box">
                <strong style={{color: '#FF8C42'}}>ARCHETYPAL INTERPRETATION</strong><br/><br/>
                {interpretation}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="tool-section">
            <h2 className="tool-title">COSMIC CALENDAR</h2>
            <p className="tool-description">
              Upcoming planetary shifts, retrogrades, and new moons with practical guidance for each event.
            </p>

            <div className="calendar-grid">
              <div className="calendar-item">
                <div className="calendar-date">JAN 15, 2025</div>
                <div className="calendar-event">New Moon in Capricorn</div>
                <div className="calendar-desc">Ideal for setting long-term intentions and career manifestation.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-date">FEB 3, 2025</div>
                <div className="calendar-event">Mercury Retrograde Begins</div>
                <div className="calendar-desc">Time for review, reflection, and inner recalibration.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-date">MAR 20, 2025</div>
                <div className="calendar-event">Spring Equinox</div>
                <div className="calendar-desc">Balance of light and dark. Rebirth and renewal protocols.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-date">APR 8, 2025</div>
                <div className="calendar-event">Jupiter-Uranus Conjunction</div>
                <div className="calendar-desc">Breakthrough energy. Sudden expansion and liberation.</div>
              </div>
            </div>

            <div style={{marginTop: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>
              <em>Live cosmic calendar with personalized transit alerts coming in Phase 2</em>
            </div>
          </div>
        )}

        {activeTab === 'rituals' && (
          <div className="tool-section">
            <h2 className="tool-title">ALIGNMENT PROTOCOLS</h2>
            <p className="tool-description">
              Step-by-step rituals for specific intentions, tied to cosmic events and planetary energies.
            </p>

            <div className="calendar-grid">
              <div className="calendar-item">
                <div className="calendar-event">New Moon Manifestation</div>
                <div className="calendar-desc">7-step protocol for planting intentions during the lunar dark phase.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-event">Full Moon Release</div>
                <div className="calendar-desc">Guided ritual for releasing what no longer serves your highest path.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-event">Solstice Activation</div>
                <div className="calendar-desc">Harnessing maximum light or darkness for energetic attunement.</div>
              </div>
              <div className="calendar-item">
                <div className="calendar-event">Mercury Retrograde Reset</div>
                <div className="calendar-desc">Protocol for navigating communication challenges and inner review.</div>
              </div>
            </div>

            <div style={{marginTop: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem'}}>
              <em>Full interactive ritual guides with AI personalization coming in Phase 2</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}