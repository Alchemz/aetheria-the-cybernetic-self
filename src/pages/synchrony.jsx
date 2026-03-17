
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
  const [meditationPhase, setMeditationPhase] = useState('lobby'); // 'lobby', 'preMeditation', 'boxBreathing', 'aumToning'
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold1', 'exhale', 'hold2'
  const [breathProgress, setBreathProgress] = useState(0); // 0-100
  const [phaseTimer, setPhaseTimer] = useState(0); // Seconds in current phase

  // Voice guidance audio refs - NEW 12-file system
  const voiceAudioRefs = useRef({
    // Pre-meditation (2 files)
    letsBegin: null,
    forTwoMinutes: null,
    // Box breathing first cycle (4 files)
    breatheIn: null,
    hold4Seconds: null,
    andBreatheOut: null,
    andHold: null,
    // AUM transition (6 files)
    nowRelaxed: null,
    itIsTime: null,
    theGoal: null,
    imagineVibration: null,
    asMorePeople: null,
    thisNet: null
  });

  // Track which voice cues have been played
  const [voiceCuesPlayed, setVoiceCuesPlayed] = useState({
    preMeditationComplete: false,
    boxBreathingCycle: false,
    aumTransitionComplete: false
  });

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

      // Central AUM Core - PBR Premium Glass
      const coreGeometry = new THREE.SphereGeometry(1, 64, 64);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00FFFF,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95, // Glass effect
        thickness: 2,
        iridescence: 1,
        iridescenceIOR: 1.3,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00FFFF,
        emissiveIntensity: 0.5
      });
      centralLight = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(centralLight);
      centralLightRef.current = centralLight;

      // Internal Radiance Node
      const innerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const innerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
      centralLight.add(innerCore);

      // Multi-layered Glow Shells
      for (let i = 0; i < 3; i++) {
        const shellGeo = new THREE.SphereGeometry(1.2 + i * 0.4, 32, 32);
        const shellMat = new THREE.MeshBasicMaterial({
          color: 0x00FFFF,
          transparent: true,
          opacity: 0.15 - i * 0.04,
          side: THREE.BackSide
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        centralLight.add(shell);
      }

      // Add Environmental Lights
      const pointLight = new THREE.PointLight(0x00FFFF, 2, 50);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const ambLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambLight);

      // Starfield Background
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 5000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 100;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.05, transparent: true, opacity: 0.5 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Stylized Neon Grid
      const gridHelper = new THREE.GridHelper(100, 50, 0x00D4FF, 0x001122);
      gridHelper.position.y = -15;
      gridHelper.material.opacity = 0.2;
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
      return () => { }; // Return empty cleanup function
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

  // Audio sequencer - plays audio files consecutively with timeout fallback
  const playAudioSequence = useCallback((audioKeys, onComplete) => {
    if (!audioKeys || audioKeys.length === 0) {
      console.log('✅ Audio sequence complete (no audios to play)');
      if (onComplete) onComplete();
      return;
    }

    let currentIndex = 0;
    let timeoutId = null;

    const playNext = () => {
      if (currentIndex >= audioKeys.length) {
        console.log('✅ Audio sequence complete');
        if (onComplete) onComplete();
        return;
      }

      const audioKey = audioKeys[currentIndex];
      const audio = voiceAudioRefs.current[audioKey];

      console.log(`🎵 Playing audio ${currentIndex + 1}/${audioKeys.length}: ${audioKey}`);

      if (audio) {
        audio.currentTime = 0;

        const handleEnded = () => {
          if (timeoutId) clearTimeout(timeoutId);
          audio.removeEventListener('ended', handleEnded);
          console.log(`✅ Audio ${audioKey} ended`);
          currentIndex++;
          playNext();
        };

        // Fallback timeout - if audio doesn't end in 30 seconds, move on
        timeoutId = setTimeout(() => {
          console.log(`⏭️ Audio ${audioKey} timeout - moving to next`);
          audio.removeEventListener('ended', handleEnded);
          currentIndex++;
          playNext();
        }, 30000);

        audio.addEventListener('ended', handleEnded);
        audio.play().catch(err => {
          console.log(`⚠️ Audio ${audioKey} autoplay prevented:`, err);
          // Still continue sequence even if one fails
          handleEnded();
        });
      } else {
        console.log(`⚠️ Audio ${audioKey} not found - skipping`);
        currentIndex++;
        playNext();
      }
    };

    playNext();
  }, []);

  // Pre-meditation phase - plays intro audios before any animation
  useEffect(() => {
    if (meditationPhase !== 'preMeditation') {
      console.log(`⏭️ Not in preMeditation phase (current: ${meditationPhase})`);
      return;
    }

    if (voiceCuesPlayed.preMeditationComplete) {
      console.log('⏭️ PreMeditation already completed');
      return;
    }

    console.log('🎬 Starting preMeditation sequence...');
    // Play the 2 intro audios in sequence
    playAudioSequence(['letsBegin', 'forTwoMinutes'], () => {
      // After both audios complete, transition to box breathing
      console.log('✅ PreMeditation complete - transitioning to box breathing');
      setVoiceCuesPlayed(prev => ({ ...prev, preMeditationComplete: true }));
      setMeditationPhase('boxBreathing');
      setPhaseTimer(0);
    });
  }, [meditationPhase, voiceCuesPlayed.preMeditationComplete, playAudioSequence]);

  // Breathing animation for box breathing (4-4-4-4)
  useEffect(() => {
    if (meditationPhase !== 'boxBreathing') return;

    const breathCycleDuration = 16000; // 16 seconds total (4s each phase)
    const phaseDuration = 4000; // 4 seconds per phase
    const startTime = Date.now();
    let lastPhase = null;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const cyclePosition = elapsedTime % breathCycleDuration;
      const isFirstCycle = elapsedTime < breathCycleDuration;

      if (cyclePosition < phaseDuration) {
        // Phase 1: Inhale (0-4s)
        if (lastPhase !== 'inhale') {
          setBreathPhase('inhale');
          lastPhase = 'inhale';

          // Play "Breathe in for" voice cue only once at the very start
          if (isFirstCycle && !voiceCuesPlayed.boxBreathingCycle) {
            playVoiceGuidance('breatheIn');
          }
        }
        setBreathProgress((cyclePosition / phaseDuration) * 100);
      } else if (cyclePosition < phaseDuration * 2) {
        // Phase 2: Hold (4-8s)
        if (lastPhase !== 'hold1') {
          setBreathPhase('hold1');
          lastPhase = 'hold1';

          // Play "Hold 4 seconds" voice cue only in first cycle
          if (isFirstCycle && !voiceCuesPlayed.boxBreathingCycle) {
            playVoiceGuidance('hold4Seconds');
          }
        }
        setBreathProgress(100);
      } else if (cyclePosition < phaseDuration * 3) {
        // Phase 3: Exhale (8-12s)
        if (lastPhase !== 'exhale') {
          setBreathPhase('exhale');
          lastPhase = 'exhale';

          // Play "And breathe out" voice cue only in first cycle
          if (isFirstCycle && !voiceCuesPlayed.boxBreathingCycle) {
            playVoiceGuidance('andBreatheOut');
          }
        }
        setBreathProgress(100 - ((cyclePosition - phaseDuration * 2) / phaseDuration) * 100);
      } else {
        // Phase 4: Hold (12-16s)
        if (lastPhase !== 'hold2') {
          setBreathPhase('hold2');
          lastPhase = 'hold2';

          // Play "And hold" voice cue only in first cycle
          if (isFirstCycle && !voiceCuesPlayed.boxBreathingCycle) {
            playVoiceGuidance('andHold');
            // Mark that we've played the complete first cycle
            setVoiceCuesPlayed(prev => ({ ...prev, boxBreathingCycle: true }));
          }
        }
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
    const startTime = Date.now();
    let lastPhase = null;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const cyclePosition = elapsedTime % breathCycleDuration;
      const isFirstCycle = elapsedTime < breathCycleDuration;

      if (cyclePosition < inhaleDuration) {
        // Inhale phase (0-10s)
        if (lastPhase !== 'inhale') {
          setBreathPhase('inhale');
          lastPhase = 'inhale';
        }
        setBreathProgress((cyclePosition / inhaleDuration) * 100);
      } else {
        // Exhale with AUM (10-25s)
        if (lastPhase !== 'exhale') {
          setBreathPhase('exhale');
          lastPhase = 'exhale';
        }
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

          // After 2 minutes of box breathing, switch to Aum toning with 6-audio transition
          if (meditationPhase === 'boxBreathing' && newTime >= 120) {
            setMeditationPhase('aumToning');

            // Play all 6 transition audios in sequence
            if (!voiceCuesPlayed.aumTransitionComplete) {
              setTimeout(() => {
                playAudioSequence(
                  ['nowRelaxed', 'itIsTime', 'theGoal', 'imagineVibration', 'asMorePeople', 'thisNet'],
                  () => {
                    setVoiceCuesPlayed(prev => ({ ...prev, aumTransitionComplete: true }));
                  }
                );
              }, 500);
            }

            return 0;
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [meditationPhase, playAudioSequence, voiceCuesPlayed.aumTransitionComplete]);

  // Preload voice guidance audio files - NEW 12-file premium system
  useEffect(() => {
    const voiceFiles = {
      // Pre-meditation phase (2 files)
      letsBegin: 'https://f005.backblazeb2.com/file/Innersync-media/Lets+begin+the+worldwide.mp3',
      forTwoMinutes: 'https://f005.backblazeb2.com/file/Innersync-media/For+2+minutes+close.mp3',
      // Box breathing first cycle (4 files)
      breatheIn: 'https://f005.backblazeb2.com/file/Innersync-media/Breathe+in+for+.mp3',
      hold4Seconds: 'https://f005.backblazeb2.com/file/Innersync-media/Hold+4+seconds.mp3',
      andBreatheOut: 'https://f005.backblazeb2.com/file/Innersync-media/And+breathe+out.mp3',
      andHold: 'https://f005.backblazeb2.com/file/Innersync-media/And+hold.mp3',
      // AUM transition phase (6 files)
      nowRelaxed: 'https://f005.backblazeb2.com/file/Innersync-media/Now+that+weve+relaxed.mp3',
      itIsTime: 'https://f005.backblazeb2.com/file/Innersync-media/It+is+time+to+join.mp3',
      theGoal: 'https://f005.backblazeb2.com/file/Innersync-media/The+goal+is+to+.mp3',
      imagineVibration: 'https://f005.backblazeb2.com/file/Innersync-media/Imagine+your+vibration.mp3',
      asMorePeople: 'https://f005.backblazeb2.com/file/Innersync-media/As+more+people+connect+.mp3',
      thisNet: 'https://f005.backblazeb2.com/file/Innersync-media/This+net+will+help.mp3'
    };

    Object.keys(voiceFiles).forEach(key => {
      const audio = new Audio(voiceFiles[key]);
      audio.preload = 'auto';
      voiceAudioRefs.current[key] = audio;
    });
  }, []);

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

  // Play single voice guidance cue
  const playVoiceGuidance = (audioKey) => {
    const audio = voiceAudioRefs.current[audioKey];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log(`Voice guidance ${audioKey} autoplay prevented:`, err);
      });
    }
  };

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
      setMeditationPhase('preMeditation'); // Start with pre-meditation phase
      setPhaseTimer(0);
      setParticipantCount(prev => prev + 1);

      // Reset voice cues tracking for new session
      setVoiceCuesPlayed({
        preMeditationComplete: false,
        boxBreathingCycle: false,
        aumTransitionComplete: false
      });
    } catch (error) {
      console.error('Error joining session:', error);
      // Even if auth fails, allow joining in demo mode
      if (APP_CONFIG.BYPASS_AUTH) {
        setHasJoined(true);
        setMeditationPhase('preMeditation'); // Start with pre-meditation phase
        setPhaseTimer(0);
        setParticipantCount(prev => prev + 1);

        // Reset voice cues tracking for new session
        setVoiceCuesPlayed({
          preMeditationComplete: false,
          boxBreathingCycle: false,
          aumTransitionComplete: false
        });
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
      return breathPhase === 'inhale' ? 'NEURAL_INHALATION...' : 'AUM_RESONANCE_BROADCAST...';
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
          height: 100dvh;
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
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: calc(2rem + var(--safe-area-top));
          padding-bottom: calc(2rem + var(--safe-area-bottom));
          padding-left: calc(1.5rem + var(--safe-area-left));
          padding-right: calc(1.5rem + var(--safe-area-right));
          overflow-y: auto;
          overflow-x: hidden;
        }

        .back-button {
          position: absolute;
          top: calc(1.5rem + var(--safe-area-top));
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
          gap: 1.5rem;
          max-width: 600px;
          width: 100%;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .lobby-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 0.4em;
          background: linear-gradient(to right, #FFFFFF, #00FFFF, #9370DB, #FFFFFF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: spectral-flow 8s linear infinite;
          text-align: center;
          margin-top: 0;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.3));
        }

        @keyframes spectral-flow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .info-card {
          background: rgba(0, 5, 20, 0.4);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #00FFFF, transparent);
          opacity: 0.3;
        }

        .timer-large {
          text-align: center;
          margin-bottom: 2rem;
        }

        .timer-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          color: rgba(0, 255, 255, 0.5);
          letter-spacing: 0.4em;
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-weight: 900;
        }

        .timer-value {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(to bottom, #FFFFFF, #00FFFF);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
          letter-spacing: 0.1em;
        }

        .mission-statement {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1rem;
          line-height: 1.8;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .posture-instructions {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .posture-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.8rem;
          color: #00FFFF;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 900;
          opacity: 0.8;
        }

        .posture-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          line-height: 1.8;
          text-align: center;
          margin: 0;
          font-family: 'Rajdhani', sans-serif;
        }

        .participant-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.2rem;
          background: rgba(0, 255, 255, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(0, 255, 255, 0.1);
          margin-bottom: 1.5rem;
        }

        .participant-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          color: rgba(0, 255, 255, 0.6);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .participant-count {
          font-family: 'Orbitron', monospace;
          font-size: 2rem;
          font-weight: 900;
          color: #FFFFFF;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
        }

        .join-wave-button {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.5);
          color: #FFFFFF;
          padding: 1.5rem 3rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.4em;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 4px;
          text-transform: uppercase;
          box-shadow: 0 0 40px rgba(0, 255, 255, 0.1);
          width: 100%;
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }

        .join-wave-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.8s ease;
        }

        .join-wave-button:hover:not(:disabled)::before {
          transform: translateX(100%);
        }

        .join-wave-button:hover:not(:disabled) {
          background: rgba(0, 255, 255, 0.2);
          border-color: #00FFFF;
          box-shadow: 0 0 60px rgba(0, 255, 255, 0.3);
          transform: translateY(-2px);
          letter-spacing: 0.5em;
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
          gap: 1.5rem;
          width: 100%;
          max-width: 700px;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .phase-indicator {
          font-family: 'Orbitron', monospace;
          font-size: 0.8rem;
          color: rgba(0, 255, 255, 0.4);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 2rem;
          width: 100%;
          font-weight: 900;
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
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 255, 0.1), rgba(0, 0, 0, 0.5));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 60px rgba(0, 255, 255, 0.2),
            inset 0 0 30px rgba(255, 255, 255, 0.05);
          transition: all 0.1s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .breath-circle::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid rgba(0, 255, 255, 0.3);
          opacity: 0.5;
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
          background: linear-gradient(90deg, #00FFFF, #9370DB);
          transition: width 0.1s ease-out;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
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
          position: fixed;
          bottom: calc(var(--safe-area-bottom) + 6rem);
          right: 1.5rem;
          background: rgba(0, 5, 20, 0.4);
          backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.2rem 1.5rem;
          pointer-events: all;
          text-align: center;
          z-index: 100;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 140px;
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
          .synchrony-hud {
            padding-top: calc(1.5rem + var(--safe-area-top));
            padding-bottom: calc(1.5rem + var(--safe-area-bottom));
            padding-left: calc(1rem + var(--safe-area-left));
            padding-right: calc(1rem + var(--safe-area-right));
          }

          .lobby-container,
          .meditation-container {
            gap: 1rem;
          }

          .lobby-title {
            font-size: 1.8rem;
          }

          .timer-value {
            font-size: 2rem;
          }

          .mission-statement {
            font-size: 1rem;
          }

          .info-card {
            padding: 1.5rem;
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
            bottom: calc(var(--safe-area-bottom) + 5rem);
            right: 1rem;
            padding: 0.75rem 1rem;
          }
          
          .counter-label-small {
            font-size: 0.55rem;
          }
          
          .counter-value-small {
            font-size: 1.2rem;
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

                  <div className="posture-instructions">
                    <div className="posture-title">Prepare Your Posture</div>
                    <p className="posture-text">
                      Find a comfortable seated position with your back naturally straight. You may lean against
                      a wall, cushion, or bed frame for support—or sit freely without. If you're not feeling tired,
                      lying down is also acceptable. Once settled, gently close your eyes and allow yourself to be
                      guided through each step of the meditation.
                    </p>
                  </div>

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

                  <div className="posture-instructions">
                    <div className="posture-title">Prepare Your Posture</div>
                    <p className="posture-text">
                      Find a comfortable seated position with your back naturally straight. You may lean against
                      a wall, cushion, or bed frame for support—or sit freely without. If you're not feeling tired,
                      lying down is also acceptable. Once settled, gently close your eyes and allow yourself to be
                      guided through each step of the meditation.
                    </p>
                  </div>

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

        {(meditationPhase === 'preMeditation' || meditationPhase === 'boxBreathing' || meditationPhase === 'aumToning') && (
          <>
            <div className="sovereigns-counter">
              <div className="counter-label-small">NEURAL_SYNC_COUNT</div>
              <div className="counter-value-small">{participantCount.toLocaleString()}</div>
            </div>

            <div className="meditation-container">
              <div className="phase-indicator">
                {meditationPhase === 'preMeditation' && 'STAGE_00 // INITIAL_CALIBRATION'}
                {meditationPhase === 'boxBreathing' && 'STAGE_01 // COHERENCE_INDUCTION'}
                {meditationPhase === 'aumToning' && 'STAGE_02 // AUM_RESONANCE_BROADCAST'}
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
