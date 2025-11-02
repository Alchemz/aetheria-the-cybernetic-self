
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config';

export default function Synchrony() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const particlesRef = useRef([]);
  const centralLightRef = useRef(null);
  const audioRef = useRef(null);
  
  const [participantCount, setParticipantCount] = useState(8421); // Simulated count
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [sessionActive, setSessionActive] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionTime, setSessionTime] = useState(900); // 15 minutes in seconds
  
  // New states for guided meditation
  const [meditationPhase, setMeditationPhase] = useState('lobby'); // 'lobby', 'boxBreathing', 'aumToning'
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold1', 'exhale', 'hold2'
  const [breathProgress, setBreathProgress] = useState(0); // 0-100
  const [phaseTimer, setPhaseTimer] = useState(0); // Seconds in current phase

  // Helper to create a Date object representing a specific time in Asia/Tokyo
  const getJapanDateTime = useCallback((date, hour, minute, second, addDays = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() + addDays);

    const options = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hourCycle: 'h23'
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(d);

    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    
    const japanISOString = `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.000+09:00`;
    
    return new Date(japanISOString);
  }, []);

  // Calculate next session time - DEMO MODE: ACTIVE NOW!
  const getNextSessionTime = useCallback(() => {
    const now = new Date();
    // Session already started (show as ending in 15 minutes)
    const targetDate = new Date(now.getTime() + 15 * 60 * 1000); // Ends in 15 minutes
    return targetDate;
  }, []);

  // Check if session should be active - DEMO MODE: ACTIVE NOW!
  const checkSessionActive = useCallback(() => {
    // Always return true so session is active immediately
    return true;
  }, []);

  // Three.js scene setup
  useEffect(() => {
    if (!mountRef.current) return;

    let renderer, scene, camera, centralLight, animationId;
    
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      sceneRef.current = scene;

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 15;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // Central Light Source - CYAN
      const lightGeometry = new THREE.SphereGeometry(1, 32, 32);
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.8
      });
      centralLight = new THREE.Mesh(lightGeometry, lightMaterial);
      scene.add(centralLight);
      centralLightRef.current = centralLight;

      // Add glow effect to central light - CYAN
      const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      centralLight.add(glow);

      // Grid background - CYAN
      const gridHelper = new THREE.GridHelper(50, 50, 0x00FFFF, 0x003333);
      gridHelper.position.y = -10;
      gridHelper.material.opacity = 0.1;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);

      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Pulsate central light based on meditation phase
        let pulse = Math.sin(elapsedTime * 2) * 0.2 + 1;
        
        // Sync pulse with breath in active meditation
        if (meditationPhase === 'boxBreathing') {
          pulse = (breathProgress / 100) * 0.5 + 0.7;
        } else if (meditationPhase === 'aumToning') {
          pulse = (breathProgress / 100) * 0.8 + 0.6;
        }
        
        centralLight.scale.set(pulse, pulse, pulse);
        
        // Rotate particles
        particlesRef.current.forEach((particle, index) => {
          const radius = 3 + (index % 5);
          const speed = 0.3 + (index % 3) * 0.1;
          const offset = (index * Math.PI * 2) / particlesRef.current.length;
          
          particle.position.x = Math.cos(elapsedTime * speed + offset) * radius;
          particle.position.y = Math.sin(elapsedTime * speed * 0.5 + offset) * (radius * 0.5);
          particle.position.z = Math.sin(elapsedTime * speed + offset) * radius;
        });

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
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
        if (animationId) cancelAnimationFrame(animationId);
        if (mountRef.current && renderer && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (error) {
      console.warn('WebGL not available, running without 3D graphics:', error);
      return () => {}; // Return empty cleanup function
    }
  }, [meditationPhase, breathProgress]);

  // Update particle count - CYAN particles
  useEffect(() => {
    if (!sceneRef.current) return;

    const currentCount = particlesRef.current.length;
    const targetCount = participantCount;

    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x00FFFF,
          transparent: true,
          opacity: 0.9
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        sceneRef.current.add(particle);
        particlesRef.current.push(particle);
      }
    } else if (targetCount < currentCount) {
      for (let i = currentCount - 1; i >= targetCount; i--) {
        const particle = particlesRef.current[i];
        sceneRef.current.remove(particle);
        particlesRef.current.pop();
      }
    }
  }, [participantCount]);

  // Timer countdown for session
  useEffect(() => {
    const updateSessionState = () => {
      const now = new Date();
      const currentIsActive = checkSessionActive();

      if (currentIsActive) {
        setSessionActive(true);
        const japanMinute = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', minute: 'numeric' }));
        const japanSecond = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', second: 'numeric' }));
        const secondsElapsedInSession = (japanMinute % 15) * 60 + japanSecond;
        const remainingSeconds = Math.max(0, 900 - secondsElapsedInSession);
        setSessionTime(remainingSeconds);
        setTimeUntilNext({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setSessionActive(false);
        setHasJoined(false);
        setMeditationPhase('lobby');
        setSessionTime(900);

        const nextSession = getNextSessionTime();
        const diff = nextSession.getTime() - now.getTime();

        if (diff <= 0) {
             setTimeUntilNext({ hours: 0, minutes: 0, seconds: 0 }); 
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeUntilNext({ hours, minutes, seconds });
        }
      }
    };

    updateSessionState();
    const interval = setInterval(updateSessionState, 1000);
    return () => clearInterval(interval);
  }, [checkSessionActive, getJapanDateTime, getNextSessionTime]);

  // Breathing animation for box breathing (4-4-4-4)
  useEffect(() => {
    if (meditationPhase !== 'boxBreathing') return;

    const breathCycleDuration = 16000; // 16 seconds total (4s each phase)
    const phaseDuration = 4000; // 4 seconds per phase
    
    const interval = setInterval(() => {
      const now = Date.now();
      const cyclePosition = now % breathCycleDuration;
      
      if (cyclePosition < phaseDuration) {
        // Phase 1: Inhale (0-4s)
        setBreathPhase('inhale');
        setBreathProgress((cyclePosition / phaseDuration) * 100);
      } else if (cyclePosition < phaseDuration * 2) {
        // Phase 2: Hold (4-8s)
        setBreathPhase('hold1');
        setBreathProgress(100);
      } else if (cyclePosition < phaseDuration * 3) {
        // Phase 3: Exhale (8-12s)
        setBreathPhase('exhale');
        setBreathProgress(100 - ((cyclePosition - phaseDuration * 2) / phaseDuration) * 100);
      } else {
        // Phase 4: Hold (12-16s)
        setBreathPhase('hold2');
        setBreathProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [meditationPhase]);

  // Breathing animation for Aum toning (slower, deeper)
  useEffect(() => {
    if (meditationPhase !== 'aumToning') return;

    const breathCycleDuration = 25000; // 25 seconds total (10s inhale, 15s exhale)
    const inhaleDuration = 10000; // 10 seconds inhale
    const exhaleDuration = 15000; // 15 seconds exhale with Aum
    
    const interval = setInterval(() => {
      const now = Date.now();
      const cyclePosition = now % breathCycleDuration;
      
      if (cyclePosition < inhaleDuration) {
        // Inhale phase (0-10s)
        setBreathPhase('inhale');
        setBreathProgress((cyclePosition / inhaleDuration) * 100);
      } else {
        // Exhale with AUM (10-25s)
        setBreathPhase('exhale');
        setBreathProgress(100 - ((cyclePosition - inhaleDuration) / exhaleDuration) * 100);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [meditationPhase]);

  // Phase progression timer (box breathing for 2 minutes, then Aum toning)
  useEffect(() => {
    if (meditationPhase === 'boxBreathing' || meditationPhase === 'aumToning') {
      const interval = setInterval(() => {
        setPhaseTimer(prev => {
          const newTime = prev + 1;
          
          // After 2 minutes of box breathing, switch to Aum toning
          if (meditationPhase === 'boxBreathing' && newTime >= 120) {
            setMeditationPhase('aumToning');
            return 0;
          }
          
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [meditationPhase]);

  // Autoplay 963 Hz meditation audio when joining
  useEffect(() => {
    if (hasJoined && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented, will play on user interaction:', err);
      });

      // Setup Media Session API for background playback
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: '963 Hz Alignment Meditation',
          artist: 'INNERSYNC Synchrony',
          album: 'Global Meditation',
        });
      }
    }
  }, [hasJoined]);

  const handleJoinSession = async () => {
    try {
      // In demo mode, skip auth check
      if (!APP_CONFIG.BYPASS_AUTH) {
        const user = await auth.me();
        if (!user) {
          alert('Please login to join the session');
          return;
        }
      }

      setHasJoined(true);
      setMeditationPhase('boxBreathing');
      setPhaseTimer(0);
      setParticipantCount(prev => prev + 1);
    } catch (error) {
      console.error('Error joining session:', error);
      // Even if auth fails, allow joining in demo mode
      if (APP_CONFIG.BYPASS_AUTH) {
        setHasJoined(true);
        setMeditationPhase('boxBreathing');
        setPhaseTimer(0);
        setParticipantCount(prev => prev + 1);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    if (meditationPhase === 'boxBreathing') {
      switch (breathPhase) {
        case 'inhale': return 'INHALE (4s)';
        case 'hold1': return 'HOLD (4s)';
        case 'exhale': return 'EXHALE (4s)';
        case 'hold2': return 'HOLD (4s)';
        default: return 'BREATHE';
      }
    } else if (meditationPhase === 'aumToning') {
      return breathPhase === 'inhale' ? 'SLOW, DEEP INHALE...' : 'EXHALE WITH AUM...';
    }
    return '';
  };

  return (
    <div className="synchrony-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        .synchrony-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000000;
          font-family: 'Rajdhani', sans-serif;
        }

        .canvas-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .synchrony-hud {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .back-button {
          position: absolute;
          top: 1.5rem;
          top: calc(1.5rem + env(safe-area-inset-top));
          left: 1.5rem;
          pointer-events: all;
          z-index: 100;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #00FFFF;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .back-button:hover {
          color: #00D4FF;
          transform: translateX(-3px);
        }

        /* LOBBY STATE */
        .lobby-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          max-width: 600px;
          pointer-events: all;
        }

        .lobby-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #00FFFF;
          text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
          text-align: center;
          margin-top: calc(1rem + env(safe-area-inset-top));
          margin-bottom: 0;
        }

        .info-card {
          background: rgba(0, 31, 63, 0.9);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(0, 255, 255, 0.2);
          width: 100%;
        }

        .timer-large {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .timer-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.75rem;
          color: rgba(0, 255, 255, 0.8);
          letter-spacing: 0.2em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .timer-value {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 700;
          color: #00FFFF;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
          letter-spacing: 0.1em;
        }

        .mission-statement {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.7;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .participant-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .participant-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          color: rgba(0, 255, 255, 0.8);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .participant-count {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          font-weight: 900;
          color: #00FFFF;
          text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
        }

        .join-wave-button {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 212, 255, 0.1));
          border: 2px solid #00FFFF;
          color: #00FFFF;
          padding: 1.2rem 3rem;
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.4s ease;
          border-radius: 50px;
          text-transform: uppercase;
          box-shadow: 
            0 0 30px rgba(0, 255, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          width: 100%;
          margin-top: 1rem;
        }

        .join-wave-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(0, 212, 255, 0.2));
          box-shadow: 0 0 50px rgba(0, 255, 255, 0.8);
          transform: scale(1.05);
        }

        .join-wave-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }

        /* ACTIVE MEDITATION STATE */
        .meditation-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
          max-width: 700px;
          pointer-events: all;
        }

        .phase-indicator {
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          color: rgba(0, 255, 255, 0.7);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-align: center;
        }

        .breath-guide {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .breath-circle-container {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breath-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 255, 0.3), rgba(0, 212, 255, 0.1));
          border: 3px solid #00FFFF;
          box-shadow: 
            0 0 40px rgba(0, 255, 255, 0.6),
            inset 0 0 40px rgba(0, 255, 255, 0.2);
          transition: all 0.1s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breath-instruction {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          font-weight: 700;
          color: #00FFFF;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
          letter-spacing: 0.1em;
          text-align: center;
        }

        .breath-bar-container {
          width: 100%;
          max-width: 400px;
          height: 60px;
          background: rgba(0, 31, 63, 0.8);
          border-radius: 30px;
          border: 2px solid rgba(0, 255, 255, 0.3);
          overflow: hidden;
          position: relative;
        }

        .breath-bar {
          height: 100%;
          background: linear-gradient(90deg, #00FFFF, #00D4FF);
          transition: width 0.1s ease-out;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 1.5rem;
        }

        .bar-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #000;
          letter-spacing: 0.1em;
        }

        .aum-wave {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid #00FFFF;
          opacity: 0;
          animation: wave-pulse 3s ease-out infinite;
        }

        @keyframes wave-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        .sovereigns-counter {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(0, 31, 63, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 15px;
          padding: 1rem 1.5rem;
          pointer-events: all;
          text-align: center;
        }

        .counter-label-small {
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem;
          color: rgba(0, 255, 255, 0.8);
          letter-spacing: 0.15em;
          margin-bottom: 0.3rem;
          text-transform: uppercase;
        }

        .counter-value-small {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: #00FFFF;
          text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .lobby-title {
            font-size: 1.8rem;
          }

          .timer-value {
            font-size: 2rem;
          }

          .mission-statement {
            font-size: 1rem;
          }

          .breath-circle-container {
            width: 250px;
            height: 250px;
          }

          .breath-circle {
            width: 150px;
            height: 150px;
          }

          .breath-instruction {
            font-size: 1rem;
          }

          .sovereigns-counter {
            top: 1rem;
            right: 1rem;
            padding: 0.75rem 1rem;
          }
        }
      `}</style>

      <div ref={mountRef} className="canvas-container" />

      <div className="synchrony-hud">
        <Link to="/portal" className="back-button">
          <ArrowLeft size={18} />
          Back to Portal
        </Link>

        {meditationPhase === 'lobby' && (
          <div className="lobby-container">
            <h1 className="lobby-title">THE SYNCHRONY</h1>
            
            <div className="info-card">
              {sessionActive ? (
                <>
                  <div className="timer-large">
                    <div className="timer-label">SESSION ACTIVE - TIME REMAINING</div>
                    <div className="timer-value">{formatTime(sessionTime)}</div>
                  </div>
                  
                  <p className="mission-statement">
                    Join a global synchronized meditation. We use coherent breathing and the Aum vibration 
                    to generate a unified field of consciousness, raising the planet's frequency.
                  </p>

                  <div className="participant-display">
                    <span className="participant-label">Sovereigns in Sync:</span>
                    <span className="participant-count">{participantCount.toLocaleString()}</span>
                  </div>

                  <button className="join-wave-button" onClick={handleJoinSession}>
                    JOIN THE WAVE
                  </button>
                </>
              ) : (
                <>
                  <div className="timer-large">
                    <div className="timer-label">NEXT WAVE IN</div>
                    <div className="timer-value">
                      {timeUntilNext.hours.toString().padStart(2, '0')}H {timeUntilNext.minutes.toString().padStart(2, '0')}M
                    </div>
                  </div>
                  
                  <p className="mission-statement">
                    Join a global synchronized meditation. We use coherent breathing and the Aum vibration 
                    to generate a unified field of consciousness, raising the planet's frequency.
                  </p>

                  <div className="participant-display">
                    <span className="participant-label">Global Community:</span>
                    <span className="participant-count">{participantCount.toLocaleString()}</span>
                  </div>

                  <button className="join-wave-button" disabled>
                    AWAITING NEXT SESSION
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {(meditationPhase === 'boxBreathing' || meditationPhase === 'aumToning') && (
          <>
            <div className="sovereigns-counter">
              <div className="counter-label-small">SOVEREIGNS IN SYNC</div>
              <div className="counter-value-small">{participantCount.toLocaleString()}</div>
            </div>

            <div className="meditation-container">
              <div className="phase-indicator">
                {meditationPhase === 'boxBreathing' ? 'PHASE 1: COHERENCE INDUCTION' : 'PHASE 2: SOVEREIGN VIBRATION'}
              </div>

              {meditationPhase === 'boxBreathing' && (
                <div className="breath-guide">
                  <div className="breath-circle-container">
                    <div 
                      className="breath-circle" 
                      style={{
                        transform: `scale(${0.7 + (breathProgress / 100) * 0.6})`
                      }}
                    >
                      <div className="breath-instruction">{getBreathInstruction()}</div>
                    </div>
                  </div>
                </div>
              )}

              {meditationPhase === 'aumToning' && (
                <div className="breath-guide">
                  <div className="breath-circle-container">
                    <div className="breath-circle">
                      <div className="breath-instruction">{getBreathInstruction()}</div>
                    </div>
                    {breathPhase === 'exhale' && breathProgress < 80 && (
                      <>
                        <div className="aum-wave" style={{ animationDelay: '0s' }}></div>
                        <div className="aum-wave" style={{ animationDelay: '1s' }}></div>
                        <div className="aum-wave" style={{ animationDelay: '2s' }}></div>
                      </>
                    )}
                  </div>

                  <div className="breath-bar-container">
                    <div className="breath-bar" style={{ width: `${breathProgress}%` }}>
                      {breathProgress > 30 && (
                        <span className="bar-label">
                          {breathPhase === 'inhale' ? 'INHALE' : 'AUM'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Hidden audio element for 963 Hz meditation */}
      <audio 
        ref={audioRef}
        src="https://Innersync-media.s3.us-east-005.backblazeb2.com/963+Hz+to+Connect++healing+Meditation+and+Healing+.mp3"
        loop
        preload="auto"
      />
    </div>
  );
}
