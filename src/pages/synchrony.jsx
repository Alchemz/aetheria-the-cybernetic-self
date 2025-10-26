
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function Synchrony() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const particlesRef = useRef([]);
  const centralLightRef = useRef(null);
  
  const [participantCount, setParticipantCount] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0, seconds: 0 }); // Initial state is 0, will be calculated on mount
  const [sessionActive, setSessionActive] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [sessionTime, setSessionTime] = useState(900); // 15 minutes in seconds

  // Helper to create a Date object representing a specific time in Asia/Tokyo
  const getJapanDateTime = useCallback((date, hour, minute, second, addDays = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() + addDays); // Apply day offset first

    // Use Intl.DateTimeFormat to get date components in Asia/Tokyo timezone
    const options = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hourCycle: 'h23' // Ensures 24-hour format
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(d);

    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    
    // Construct an ISO 8601 string for the target time in Japan timezone with explicit offset
    // Asia/Tokyo (JST) is UTC+09:00 and does not observe Daylight Saving Time.
    const japanISOString = `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.000+09:00`;
    
    // Parse this string to get a Date object that internally represents that exact moment in UTC.
    return new Date(japanISOString);
  }, []);

  // Calculate next 11 PM Japan time
  const getNextSessionTime = useCallback(() => {
    const now = new Date();
    
    // Target 11 PM Japan time today
    let targetDate = getJapanDateTime(now, 23, 0, 0); 
    
    // If targetDate is already in the past (or very close, within 500ms buffer), advance to tomorrow
    if (targetDate.getTime() <= now.getTime() + 500) { 
      targetDate = getJapanDateTime(now, 23, 0, 0, 1); // 11 PM Japan time tomorrow
    }
    return targetDate;
  }, [getJapanDateTime]);

  // Check if session should be active (11:00 PM to 11:15 PM Japan time)
  const checkSessionActive = useCallback(() => {
    const now = new Date();
    // Get current hour and minute in Japan time
    const japanHour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', hour: 'numeric', hourCycle: 'h23' }));
    const japanMinute = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', minute: 'numeric' }));
    
    // Session is active between 11:00 PM and 11:15 PM Japan time
    return japanHour === 23 && japanMinute >= 0 && japanMinute < 15;
  }, []);


  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Central Light Source - GOLDEN
    const lightGeometry = new THREE.SphereGeometry(1, 32, 32);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.8
    });
    const centralLight = new THREE.Mesh(lightGeometry, lightMaterial);
    scene.add(centralLight);
    centralLightRef.current = centralLight;

    // Add glow effect to central light - GOLDEN
    const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    centralLight.add(glow);

    // Grid background
    const gridHelper = new THREE.GridHelper(50, 50, 0xFFD700, 0x333300);
    gridHelper.position.y = -10;
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Pulsate central light
      const pulse = Math.sin(elapsedTime * 2) * 0.2 + 1;
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
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update particle count when participantCount changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const currentCount = particlesRef.current.length;
    const targetCount = participantCount;

    if (targetCount > currentCount) {
      // Add new particles - GOLDEN
      for (let i = currentCount; i < targetCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFD700,
          transparent: true,
          opacity: 0.9
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // No particle glow in the new specification
        
        sceneRef.current.add(particle);
        particlesRef.current.push(particle);
      }
    } else if (targetCount < currentCount) {
      // Remove particles
      for (let i = currentCount - 1; i >= targetCount; i--) {
        const particle = particlesRef.current[i];
        sceneRef.current.remove(particle);
        particlesRef.current.pop();
      }
    }
  }, [participantCount]);

  // Timer countdown
  useEffect(() => {
    const updateSessionState = () => {
      const now = new Date();
      const currentIsActive = checkSessionActive();

      if (currentIsActive) {
        setSessionActive(true);
        // Calculate remaining time for the session
        const japanMinute = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', minute: 'numeric' }));
        const japanSecond = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', second: 'numeric' }));
        const secondsElapsedInSession = (japanMinute % 15) * 60 + japanSecond; // Ensures it's within the 15 min window
        const remainingSeconds = Math.max(0, 900 - secondsElapsedInSession); // 15 minutes = 900 seconds
        setSessionTime(remainingSeconds);
        setTimeUntilNext({ hours: 0, minutes: 0, seconds: 0 }); // No "until next" if currently active
      } else {
        // Session is not active
        setSessionActive(false);
        setHasJoined(false); // User is no longer considered "joined" for a session that just ended
        setSessionTime(900); // Reset session time for next session

        // Calculate time until next session
        const nextSession = getNextSessionTime();
        const diff = nextSession.getTime() - now.getTime(); // Difference in milliseconds

        if (diff <= 0) { // If diff is negative (should be rare due to getNextSessionTime logic), just show 0
             setTimeUntilNext({ hours: 0, minutes: 0, seconds: 0 }); 
        } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeUntilNext({ hours, minutes, seconds });
        }
      }
    };

    // Run once immediately on mount to set initial state
    updateSessionState();

    const interval = setInterval(updateSessionState, 1000);

    return () => clearInterval(interval);
  }, [checkSessionActive, getJapanDateTime, getNextSessionTime]); // Depend on memoized functions

  const handleJoinSession = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) {
        alert('Please login to join the session');
        return;
      }

      setHasJoined(true);
      setParticipantCount(prev => prev + 1);
      
      // In production, this would update the backend
      // await base44.entities.MeditationSession.update(sessionId, {
      //   participants: [...participants, user.email],
      //   participant_count: participantCount + 1
      // });
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          justify-content: space-between;
          padding: 2rem;
        }

        .back-button {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          pointer-events: all;
          z-index: 100;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #FFD700;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .back-button:hover {
          color: #FFF2CC;
          transform: translateX(-3px);
        }

        .hud-top {
          width: 100%;
          max-width: 500px;
          text-align: center;
          margin-top: 1rem;
        }

        .session-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #FFF8DC;
          text-shadow: 0 0 20px rgba(255, 248, 220, 0.6);
          margin-bottom: 0.5rem;
        }

        .session-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 248, 220, 0.7);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .hud-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .timer-display {
          background: rgba(0, 31, 63, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 1.5rem 2.5rem;
          border-radius: 15px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          pointer-events: all;
        }

        .timer-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          color: rgba(255, 248, 220, 0.8);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .timer-value {
          font-family: 'Orbitron', monospace;
          font-size: 2rem;
          font-weight: 700;
          color: #FFF8DC;
          text-shadow: 0 0 15px rgba(255, 248, 220, 0.5);
          letter-spacing: 0.1em;
        }

        .participant-counter {
          background: rgba(0, 31, 63, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 1.5rem 2.5rem;
          border-radius: 15px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          text-align: center;
          min-width: 280px;
        }

        .counter-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          color: rgba(255, 248, 220, 0.8);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }

        .counter-value {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #FFF8DC;
          text-shadow: 0 0 20px rgba(255, 248, 220, 0.6);
          letter-spacing: 0.05em;
        }

        .hud-bottom {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column; /* Changed to column for better stacking */
          align-items: center; /* Center items in column */
          gap: 1rem; /* Space between button and status */
          margin-bottom: 2rem;
          pointer-events: all;
        }

        .join-button {
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #FFD700;
          color: #FFF8DC;
          padding: 1rem 3rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50px;
          text-transform: uppercase;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .join-button:hover:not(:disabled) {
          background: rgba(255, 215, 0, 0.2);
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          transform: scale(1.05);
        }

        .join-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .join-button.joined {
          background: rgba(255, 215, 0, 0.3);
          border-color: #FFD700;
        }

        .session-status {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          color: rgba(255, 215, 0, 0.7);
          text-align: center;
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .hud-top {
            max-width: 90%;
          }

          .session-title {
            font-size: 1.2rem;
          }

          .timer-display,
          .participant-counter {
            padding: 1rem 1.5rem;
          }

          .timer-value {
            font-size: 1.5rem;
          }

          .counter-value {
            font-size: 2rem;
          }

          .join-button {
            padding: 0.8rem 2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div ref={mountRef} className="canvas-container" />

      <div className="synchrony-hud">
        <Link to="/portal" className="back-button">
          <ArrowLeft size={18} />
          Back to Portal
        </Link>

        <div className="hud-top">
          <h2 className="session-title">SYNCHRONY</h2>
          <p className="session-subtitle">GLOBAL CONSCIOUSNESS FIELD ACTIVATION</p>
        </div>

        <div className="hud-center">
          <div className="participant-counter">
            <div className="counter-label">SOVEREIGNS IN SYNC</div>
            <div className="counter-value">{participantCount.toLocaleString()}</div>
          </div>

          <div className="timer-display">
            <div className="timer-label">
              {sessionActive ? 'SESSION TIME REMAINING' : 'NEXT ACTIVATION IN'}
            </div>
            <div className="timer-value">
              {sessionActive ? (
                formatTime(sessionTime)
              ) : (
                `${timeUntilNext.hours.toString().padStart(2, '0')}H ${timeUntilNext.minutes.toString().padStart(2, '0')}M ${timeUntilNext.seconds.toString().padStart(2, '0')}S`
              )}
            </div>
          </div>
        </div>

        <div className="hud-bottom">
          {sessionActive ? (
            <>
              {!hasJoined ? (
                <button className="join-button" onClick={handleJoinSession}>
                  JOIN THE FIELD
                </button>
              ) : (
                <div className="session-status">
                  YOU ARE SYNCHRONIZED ✦ HOLD THE FREQUENCY
                </div>
              )}
            </>
          ) : (
            <div className="session-status">
              NEXT GLOBAL MEDITATION APPROACHING
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
