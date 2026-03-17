
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Zap, Droplet, Moon, Sun, Dumbbell, Brain, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bioModsData } from '@/data/heartwaveData';

export default function BiohackingLab() {
  const mountRef = useRef(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const protocols = Object.values(bioModsData);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- GALAXY VISUALIZATION SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // 1. Central Sun (Source)
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.9
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Sun Glow
    const sunGlowGeom = new THREE.SphereGeometry(3, 32, 32);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xFF8C00,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(sunGlowGeom, sunGlowMat);
    sun.add(sunGlow);
    galaxyGroup.add(sun);

    // 2. Spiral Galaxy Particles
    const particleCount = 4000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorInside = new THREE.Color(0xff6030);
    const colorOutside = new THREE.Color(0x1b3984);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 8 + 2; // Spiral radius
      const spinAngle = radius * 0.8;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3); // 3 arms

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.5; // Flatten galaxy
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color mix
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / 10);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.1,
      // sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    const points = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyGroup.add(points);

    // 3. Orbiting Planets
    const planets = [];
    const planetData = [
      { r: 0.3, d: 4, speed: 0.005, color: 0x00FFFF },
      { r: 0.5, d: 6, speed: 0.003, color: 0xFF4500 },
      { r: 0.4, d: 8, speed: 0.002, color: 0x9D4EDD },
      { r: 0.6, d: 11, speed: 0.001, color: 0x00D4FF }
    ];

    planetData.forEach(p => {
      const pGeom = new THREE.SphereGeometry(p.r, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({ color: p.color, wireframe: true });
      const mesh = new THREE.Mesh(pGeom, pMat);

      // Orbit Ring
      const ringGeom = new THREE.RingGeometry(p.d - 0.05, p.d + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.1, transparent: true, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      galaxyGroup.add(ring);

      // Planet Object wrapper for easier animation
      const planetObj = { mesh, distance: p.d, angle: Math.random() * Math.PI * 2, speed: p.speed };
      planets.push(planetObj);
      galaxyGroup.add(mesh);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate Galaxy
      galaxyGroup.rotation.y = elapsedTime * 0.05;

      // Pulse Sun
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
      sun.scale.set(scale, scale, scale);

      // Animate Planets
      planets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.distance;
        p.mesh.rotation.y += 0.02;
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
      geometry?.dispose();
      material?.dispose();
    };
  }, []);

  return (
    <div className="biohacking-lab">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .biohacking-lab {
          min-height: 100dvh;
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .lab-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        /* INCREASED PADDING TO FIX OVERLAP */
        .lab-content {
          position: relative;
          z-index: 10;
          padding: calc(180px + var(--safe-area-top)) 20px calc(40px + var(--safe-area-bottom));
          max-width: 1400px;
          margin: 0 auto;
        }

        .lab-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #9370DB;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .lab-back:hover {
          color: #00D4FF;
          transform: translateX(-3px);
        }

        .lab-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .lab-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #9370DB, #00D4FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          text-shadow: 0 0 40px rgba(147, 112, 219, 0.5);
        }

        .lab-subtitle {
          color: rgba(147, 112, 219, 0.7);
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .protocols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .protocol-card {
          background: linear-gradient(135deg, rgba(0, 20, 20, 0.50), rgba(0, 10, 10, 0.55));
          border: 2px solid rgba(0, 255, 255, 0.3);
          padding: 30px;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .protocol-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #9370DB, transparent);
          transition: left 0.6s ease;
        }

        .protocol-card:hover::before {
          left: 100%;
        }

        .protocol-card:hover {
          border-color: #9370DB;
          box-shadow: 0 0 30px rgba(147, 112, 219, 0.4);
          transform: translateY(-5px);
          background: linear-gradient(135deg, rgba(0, 25, 25, 0.55), rgba(0, 15, 15, 0.60));
        }
        
        .protocol-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .protocol-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid currentColor;
          transition: all 0.3s ease;
        }

        .protocol-card:hover .protocol-icon {
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 0 20px currentColor;
        }

        .protocol-info {
          flex: 1;
        }

        .protocol-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .protocol-category {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .protocol-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .learn-button {
          width: 100%;
          background: transparent;
          border: 2px solid #9370DB;
          color: #9370DB;
          padding: 12px;
          font-family: 'Orbitron', monospace;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
        }

        .learn-button:hover {
          background: rgba(0, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(147, 112, 219, 0.4);
        }

        /* REFINED MODAL STYLES */
        .protocol-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-content {
          background: rgba(10, 10, 15, 0.85); /* Deep dark tint */
          backdrop-filter: blur(20px); /* Heavy glass */
          border: 1px solid rgba(0, 255, 255, 0.2);
          box-shadow: 
            0 0 0 1px rgba(0, 0, 0, 0.5), /* Inner rim */
            0 20px 50px rgba(0, 0, 0, 0.5), /* Drop shadow */
            0 0 30px rgba(0, 255, 255, 0.1); /* Glow */
          padding: 0; /* Layout handled by grid */
          max-width: 1000px;
          width: 100%;
          max-height: 85vh;
          overflow: hidden; /* Scroll internal */
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 4px; /* Tech look */
        }

        /* Scanline Overlay on Modal */
        .modal-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(0,255,255,0.02) 2px, transparent 3px);
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 0;
        }

        .modal-header-bar {
          padding: 20px 30px;
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          background: rgba(0, 255, 255, 0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .modal-title-glitch {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          color: #fff;
          letter-spacing: 0.1em;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .classification-badge {
          font-size: 0.7rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #9370DB;
          color: #9370DB;
          padding: 4px 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-left: 15px;
          vertical-align: middle;
        }

        .modal-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .modal-close:hover { color: #9370DB; transform: rotate(90deg); }

        .modal-body {
          display: grid;
          grid-template-columns: 350px 1fr;
          overflow: hidden;
          height: 100%;
        }

        .modal-sidebar {
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          padding: 30px;
          overflow-y: auto;
        }

        .modal-main {
          padding: 30px;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.01);
        }

        .intel-card {
          margin-bottom: 25px;
        }
        
        .intel-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.75rem;
          color: rgba(0, 255, 255, 0.7);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .intel-label::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background: #9370DB;
          box-shadow: 0 0 5px #9370DB;
        }

        .intel-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
        }
        .stat-label { color: rgba(255, 255, 255, 0.5); }
        .stat-val { color: #9370DB; font-family: 'Orbitron', monospace; }

        .habit-stack-item {
          background: rgba(0, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 255, 0.1);
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .habit-stack-item:hover {
          background: rgba(0, 255, 255, 0.08);
          border-color: rgba(0, 255, 255, 0.3);
        }

        /* Scrollbar polish */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.2); border-radius: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.4); }

        @media (max-width: 800px) {
          .modal-body { grid-template-columns: 1fr; overflow-y: auto; display: block; }
          .modal-sidebar { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .modal-content { max-height: 100dvh; max-height: 100vh; height: 100%; border-radius: 0; -webkit-overflow-scrolling: touch; }
        }

        @media (max-width: 768px) {
          .lab-content {
            padding: 60px 15px 30px;
          }

          .lab-title {
            font-size: 2rem;
          }

          .protocols-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 30px 20px;
          }
        }
      `}</style>

      <div ref={mountRef} className="lab-bg" />

      <div className="lab-content">
        <Link to="/nexus" className="lab-back">
          <ArrowLeft size={18} />
          Back to Command Center
        </Link>

        <div className="lab-header">
          <h1 className="lab-title">BIOHACKING LAB</h1>
          <p className="lab-subtitle">
            Evidence-based ancestral practices for optimizing human performance and longevity
          </p>
        </div>

        <div className="protocols-grid">
          {protocols.map(protocol => {
            const Icon = protocol.icon;

            return (
              <div
                key={protocol.id}
                className="protocol-card"
                style={{ color: protocol.color }}
                onClick={() => setSelectedProtocol(protocol)}
              >
                <div className="protocol-header">
                  <div className="protocol-icon">
                    <Icon size={24} />
                  </div>
                  <div className="protocol-info">
                    <div className="protocol-name">{protocol.name}</div>
                    <div className="protocol-category">{protocol.category}</div>
                  </div>
                </div>

                <p className="protocol-description">{protocol.description}</p>

                <button className="learn-button">
                  READ THE BENEFITS
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProtocol && (
        <div className="protocol-modal" onClick={() => setSelectedProtocol(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-scanline" />

            {/* HEADER */}
            <div className="modal-header-bar">
              <div>
                <span className="modal-title-glitch">{selectedProtocol.name}</span>
                <span className="classification-badge">CLASSIFIED</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedProtocol(null)}>
                <ArrowLeft size={24} />
              </button>
            </div>

            {/* BODY SPLIT */}
            <div className="modal-body">
              {/* SIDEBAR - High Level Intel */}
              <div className="modal-sidebar custom-scroll">

                <div className="intel-card">
                  <div className="intel-label">Description Declassified</div>
                  <p className="intel-text">{selectedProtocol.description}</p>
                </div>

                <div className="intel-card">
                  <div className="intel-label">Strategic Objective</div>
                  <p className="intel-text">{selectedProtocol.simpleExplanation}</p>
                </div>

                {selectedProtocol.supplements && selectedProtocol.supplements.length > 0 && (
                  <div className="intel-card">
                    <div className="intel-label"><Sparkles size={12} className="mr-1" /> Chemical Assistance</div>
                    {selectedProtocol.supplements.map((supp, idx) => (
                      <div key={idx} className="stat-row">
                        <span className="stat-val">{supp.name}</span>
                        <span className="stat-label">{supp.dosage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MAIN CONTENT - Protocols */}
              <div className="modal-main custom-scroll">
                <div className="intel-label" style={{ marginBottom: '20px', fontSize: '1rem', color: '#fff' }}>
                  <Activity size={16} className="text-[#9370DB]" />
                  ACTIVE HABIT PROTOCOLS
                </div>

                {selectedProtocol.habits.map((habit, idx) => (
                  <div key={idx} className="habit-stack-item group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-[Orbitron] font-bold text-[#9370DB]">
                        0{idx + 1} // {habit.name}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 border border-white/10 px-2 py-1 bg-black/50">
                        {habit.duration} MIN
                      </span>
                    </div>
                    <p className="text-sm text-white/80 font-mono mb-2 leading-relaxed">
                      {`> ${habit.howTo}`}
                    </p>
                    <div className="pl-3 border-l-2 border-[#9370DB]/30">
                      <p className="text-xs text-[#9370DB]/70 italic">
                        " {habit.why} "
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-4 border-t border-white/10 text-center">
                  <Button
                    className="bg-[#9370DB]/10 hover:bg-[#9370DB]/20 text-[#9370DB] border border-[#9370DB]/50 font-[Orbitron] tracking-widest w-full max-w-xs mx-auto"
                    onClick={() => window.open('/portal', '_self')} // Assuming we want to lead them to the tracker
                  >
                    INITIATE PROTOCOL
                  </Button>
                  <p className="text-[10px] text-white/30 mt-2 font-mono">AUTHORIZATION CODE: {selectedProtocol.id.toUpperCase()}-9X</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
