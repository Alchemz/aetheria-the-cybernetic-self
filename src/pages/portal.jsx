
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/api/supabaseClient';
import { APP_CONFIG } from '@/config';
import * as THREE from 'three';

export default function SovereignPortal() {
  const [currentRealm, setCurrentRealm] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(!APP_CONFIG.BYPASS_AUTH);
  const [isAuthenticated, setIsAuthenticated] = useState(APP_CONFIG.BYPASS_AUTH);
  const [synchronyOpen, setSynchronyOpen] = useState(false); // Added synchronyOpen state
  const scrollContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const particlesRef = useRef(null);
  const navigate = useNavigate();
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);

  const realms = [
    {
      name: "THE SANCTUARY",
      caption: "Reclaim Your Night. Master Sleep & Subconscious Power.",
      buttonText: "Enter the Sanctuary",
      path: "/foundation",
      logoUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/50a012bb8_Photoroom_20251026_013106.png",
      colors: {
        primary: '#FF4500',
        secondary: '#FF6347',
        tertiary: '#8B0000',
        background: 'radial-gradient(ellipse at center, #2d0a0a 0%, #1a0000 50%, #000000 100%)'
      },
      particleColor: 0xFF4500,
      vibe: 'sanctuary'
    },
    {
      name: "THE NEXUS",
      caption: "Augment Your Mind. Master Your Inner Frequency.",
      buttonText: "Activate Neuro-Sync",
      path: "/nexus",
      logoUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/209999ac2_20251025_0942_CelestialBrainLogo_simple_compose_01k8e3xrb6fs6rrdxvh20ppw2y.png",
      colors: {
        primary: '#9B59B6',
        secondary: '#BB8FCE',
        tertiary: '#6C3483',
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0d0515 50%, #000000 100%)'
      },
      particleColor: 0x9B59B6,
      vibe: 'nexus'
    },
    {
      name: "THE TEMPLE",
      caption: "Embody Your Spirit. Align Breath, Movement, Energy.",
      buttonText: "Begin Embodiment",
      path: "/heartwave",
      logoUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/d4dc55d83_20251025_1106_MeditativeGeometricHeart_simple_compose_01k8e8pzp2eeyvqyv030kvy8ts.png",
      colors: {
        primary: '#00A86B',
        secondary: '#3CB371',
        tertiary: '#2E8B57',
        background: 'radial-gradient(ellipse at center, #0a1a15 0%, #05120d 50%, #000000 100%)'
      },
      particleColor: 0x00A86B,
      vibe: 'temple'
    }
  ];

  // Check authentication on mount
  useEffect(() => {
    if (APP_CONFIG.BYPASS_AUTH) {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        const authenticated = await auth.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          setTimeout(() => {
            auth.redirectToLogin('/portal');
          }, 2000);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkAuth();
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || isAuthenticating || !isAuthenticated) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: realms[currentRealm].particleColor,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const positions = particles.geometry.attributes.position.array;
      const velocities = particles.geometry.attributes.velocity.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        if (currentRealm === 0) {
          // SANCTUARY: Barely moving, almost static with subtle drift
          positions[i3] += velocities[i3] * 0.05;
          positions[i3 + 1] += velocities[i3 + 1] * 0.05;
          positions[i3 + 2] += velocities[i3 + 2] * 0.05;
        } else if (currentRealm === 1) {
          // NEXUS: Galaxy spiral rotation
          const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
          const angle = Math.atan2(positions[i3 + 2], positions[i3]);
          const newAngle = angle + 0.005;
          
          positions[i3] = radius * Math.cos(newAngle);
          positions[i3 + 2] = radius * Math.sin(newAngle);
          positions[i3 + 1] += Math.sin(elapsedTime + i) * 0.002;
        } else if (currentRealm === 2) {
          // TEMPLE: Slow upward drift
          positions[i3 + 1] += 0.01;
          
          // Reset particles that go too high
          if (positions[i3 + 1] > 10) {
            positions[i3 + 1] = -10;
          }
        }

        // Boundary wrapping for x and z
        if (Math.abs(positions[i3]) > 10) positions[i3] *= -1;
        if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -1;
      }

      particles.geometry.attributes.position.needsUpdate = true;
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
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [isAuthenticating, isAuthenticated, currentRealm]);

  // Update particle colors when realm changes
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.material.color.setHex(realms[currentRealm].particleColor);
    }
  }, [currentRealm]);

  const scrollToRealm = (realmIndex) => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const container = scrollContainerRef.current;
    if (!container) return;

    const targetScroll = realmIndex * window.innerHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
    
    setCurrentRealm(realmIndex);
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (isScrolling.current) return;

    if (e.deltaY > 0 && currentRealm < realms.length - 1) {
      scrollToRealm(currentRealm + 1);
    } else if (e.deltaY < 0 && currentRealm > 0) {
      scrollToRealm(currentRealm - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isScrolling.current) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentRealm < realms.length - 1) {
        scrollToRealm(currentRealm + 1);
      } else if (diff < 0 && currentRealm > 0) {
        scrollToRealm(currentRealm - 1);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && currentRealm < realms.length - 1) {
      scrollToRealm(currentRealm + 1);
    } else if (e.key === 'ArrowUp' && currentRealm > 0) {
      scrollToRealm(currentRealm - 1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRealm]);

  const handleEnterRealm = (path) => {
    if (!isAuthenticated) {
      alert('Please login to access this feature');
      base44.auth.redirectToLogin(path);
      return;
    }
    navigate(path);
  };

  const handleSynchronyClick = () => {
    navigate('/synchrony');
  };

  const handleSynchronyHover = () => {
    setSynchronyOpen(true);
  };

  const handleSynchronyLeave = () => {
    setSynchronyOpen(false);
  };

  const handleSynchronyToggle = (e) => {
    e.stopPropagation();
    setSynchronyOpen(!synchronyOpen);
  };

  if (isAuthenticating) {
    return (
      <div className="loading-screen">
        <style>{`
          .loading-screen {
            width: 100vw;
            height: 100vh;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
            color: #FF4500;
          }
          .loading-text {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px #FF4500;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
        <div className="loading-text">INITIALIZING INNERSYNC...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="loading-screen">
        <style>{`
          .loading-screen {
            width: 100vw;
            height: 100vh;
            background: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
            color: #FF4500;
            padding: 20px;
            text-align: center;
          }
          .auth-message {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px #FF4500;
            margin-bottom: 20px;
          }
          .auth-submessage {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
          }
        `}</style>
        <div className="auth-message">AUTHENTICATION REQUIRED</div>
        <div className="auth-submessage">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="sovereign-portal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .sovereign-portal {
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .particle-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .realms-container {
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          position: relative;
          z-index: 2;
        }

        .realms-container::-webkit-scrollbar {
          display: none;
        }

        .realm {
          width: 100%;
          height: 100vh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.8s ease;
        }

        /* Premium Glass Panel */
        .ui-panel {
          position: relative;
          z-index: 10;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          padding: 4rem 3rem;
          max-width: 650px;
          width: 90%;
          text-align: center;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 60px rgba(0, 0, 0, 0.4);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .realm.sanctuary .ui-panel {
          border-color: rgba(255, 69, 0, 0.2);
          box-shadow: 
            0 8px 32px rgba(255, 69, 0, 0.3),
            inset 0 1px 0 rgba(255, 99, 71, 0.2),
            0 0 80px rgba(255, 69, 0, 0.2);
        }

        .realm.nexus .ui-panel {
          border-color: rgba(155, 89, 182, 0.2);
          box-shadow: 
            0 8px 32px rgba(155, 89, 182, 0.3),
            inset 0 1px 0 rgba(187, 143, 206, 0.2),
            0 0 80px rgba(155, 89, 182, 0.2);
        }

        .realm.temple .ui-panel {
          border-color: rgba(0, 168, 107, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 168, 107, 0.3),
            inset 0 1px 0 rgba(60, 179, 113, 0.2),
            0 0 80px rgba(0, 168, 107, 0.2);
        }

        .logo-container {
          width: 180px;
          height: 180px;
          margin: 0 auto 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .realm-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 0 20px currentColor); /* This will be overridden by inline style */
        }

        .realm-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          margin-bottom: 1.5rem;
          transition: all 0.6s ease;
          line-height: 1.2;
        }

        .realm.sanctuary .realm-title {
          color: #FF6347;
          text-shadow: 0 0 40px rgba(255, 69, 0, 0.8), 0 0 80px rgba(255, 69, 0, 0.4);
        }

        .realm.nexus .realm-title {
          color: #BB8FCE;
          text-shadow: 0 0 40px rgba(155, 89, 182, 0.8), 0 0 80px rgba(155, 89, 182, 0.4);
        }

        .realm.temple .realm-title {
          color: #3CB371;
          text-shadow: 0 0 40px rgba(0, 168, 107, 0.8), 0 0 80px rgba(0, 168, 107, 0.4);
        }

        .realm-caption {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.8;
          margin-bottom: 3rem;
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .realm-button {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 1.1rem 2.8rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          color: white;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 30px rgba(255, 255, 255, 0.05);
        }

        .realm-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.6s ease;
        }

        .realm-button:hover::before {
          left: 100%;
        }

        .realm.sanctuary .realm-button {
          border-color: rgba(255, 69, 0, 0.3);
          background: rgba(255, 69, 0, 0.08);
          color: #FFB3A3;
          box-shadow: 
            0 4px 20px rgba(255, 69, 0, 0.25),
            inset 0 1px 0 rgba(255, 99, 71, 0.2),
            0 0 30px rgba(255, 69, 0, 0.15);
        }

        .realm.sanctuary .realm-button:hover {
          background: rgba(255, 69, 0, 0.18);
          border-color: rgba(255, 69, 0, 0.5);
          box-shadow: 
            0 6px 30px rgba(255, 69, 0, 0.4),
            inset 0 1px 0 rgba(255, 99, 71, 0.3),
            0 0 50px rgba(255, 69, 0, 0.3);
          transform: translateY(-2px);
          color: #FF6347;
        }

        .realm.nexus .realm-button {
          border-color: rgba(155, 89, 182, 0.3);
          background: rgba(155, 89, 182, 0.08);
          color: #D8BFD8;
          box-shadow: 
            0 4px 20px rgba(155, 89, 182, 0.25),
            inset 0 1px 0 rgba(187, 143, 206, 0.2),
            0 0 30px rgba(155, 89, 182, 0.15);
        }

        .realm.nexus .realm-button:hover {
          background: rgba(155, 89, 182, 0.18);
          border-color: rgba(155, 89, 182, 0.5);
          box-shadow: 
            0 6px 30px rgba(155, 89, 182, 0.4),
            inset 0 1px 0 rgba(187, 143, 206, 0.3),
            0 0 50px rgba(155, 89, 182, 0.3);
          transform: translateY(-2px);
          color: #BB8FCE;
        }

        .realm.temple .realm-button {
          border-color: rgba(0, 168, 107, 0.3);
          background: rgba(0, 168, 107, 0.08);
          color: #A8E6CF;
          box-shadow: 
            0 4px 20px rgba(0, 168, 107, 0.25),
            inset 0 1px 0 rgba(60, 179, 113, 0.2),
            0 0 30px rgba(0, 168, 107, 0.15);
        }

        .realm.temple .realm-button:hover {
          background: rgba(0, 168, 107, 0.18);
          border-color: rgba(0, 168, 107, 0.5);
          box-shadow: 
            0 6px 30px rgba(0, 168, 107, 0.4),
            inset 0 1px 0 rgba(60, 179, 113, 0.3),
            0 0 50px rgba(0, 168, 107, 0.3);
          transform: translateY(-2px);
          color: #3CB371;
        }

        /* Scroll Indicator - More Subtle */
        .scroll-indicator {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .scroll-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          opacity: 0.6;
        }

        .scroll-dot:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.2);
          opacity: 1;
        }

        .scroll-dot.active {
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
          transform: scale(1.25);
          opacity: 1;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .ui-panel {
            padding: 2.5rem 2rem;
            border-radius: 24px;
          }

          .realm-title {
            font-size: 2rem;
            margin-bottom: 1.2rem;
          }

          .realm-caption {
            font-size: 1rem;
            margin-bottom: 2.5rem;
          }

          .realm-button {
            font-size: 0.9rem;
            padding: 1rem 2.3rem;
          }

          .logo-container {
            width: 135px;
            height: 135px;
            margin-bottom: 2rem;
          }
          
          .realm-logo-img {
            width: 100%;
            height: 100%;
          }

          .scroll-indicator {
            right: 1.2rem;
          }

          .scroll-dot {
            width: 7px;
            height: 7px;
          }
        }

        @media (max-width: 480px) {
          .realm-title {
            font-size: 1.6rem;
            letter-spacing: 0.15em;
          }

          .realm-caption {
            font-size: 0.9rem;
          }

          .realm-button {
            font-size: 0.8rem;
            padding: 0.9rem 2rem;
          }
        }

        /* Cyberpunk Synchrony Portal Widget */
        .floating-portal-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          cursor: pointer;
          --portal-size: 80px;
        }

        .portal-container {
          position: relative;
          width: var(--portal-size);
          height: var(--portal-size);
          transition: transform 0.4s ease;
        }

        .portal-container:hover {
          transform: scale(1.15);
        }

        .portal-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid #4A9EFF;
          border-radius: 50%;
          box-shadow: 
            0 0 15px #4A9EFF,
            0 0 30px #4A9EFF,
            0 0 45px rgba(74, 158, 255, 0.5),
            inset 0 0 15px #4A9EFF;
          animation: portal-pulse 3s ease-in-out infinite alternate;
        }

        .portal-vortex {
          position: absolute;
          top: 15%;
          left: 15%;
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(10, 20, 50, 0.9) 0%, 
            rgba(30, 80, 150, 0.6) 40%,
            rgba(74, 158, 255, 0.3) 70%,
            transparent 100%
          );
          opacity: 0.8;
          animation: vortex-spin 8s linear infinite;
        }

        .portal-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(74, 158, 255, 0.15) 2%, transparent 20%),
            radial-gradient(circle at 70% 60%, rgba(74, 158, 255, 0.15) 2%, transparent 20%),
            radial-gradient(circle at 50% 80%, rgba(74, 158, 255, 0.15) 2%, transparent 20%);
          animation: particle-shimmer 4s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .portal-center-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: #4A9EFF;
          font-family: 'Orbitron', monospace;
          text-shadow: 
            0 0 10px #4A9EFF,
            0 0 20px #4A9EFF;
          z-index: 10;
          animation: symbol-pulse 2s ease-in-out infinite;
        }

        @keyframes portal-pulse {
          from {
            box-shadow: 
              0 0 15px #4A9EFF,
              0 0 30px #4A9EFF,
              0 0 45px rgba(74, 158, 255, 0.5),
              inset 0 0 15px #4A9EFF;
          }
          to {
            box-shadow: 
              0 0 25px #4A9EFF,
              0 0 50px #4A9EFF,
              0 0 70px rgba(74, 158, 255, 0.8),
              inset 0 0 25px #4A9EFF;
          }
        }

        @keyframes vortex-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes particle-shimmer {
          from { opacity: 0.4; }
          to { opacity: 0.9; }
        }

        @keyframes symbol-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Synchrony Floating Text */
        .synchrony-button-overlay {
          position: fixed;
          bottom: 2rem;
          right: 7rem;
          z-index: 999;
          opacity: 0;
          transform: translateX(20px) scale(0.8);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .synchrony-button-overlay.visible {
          opacity: 1;
          transform: translateX(0) scale(1);
          pointer-events: all;
        }

        .synchrony-glass-button {
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .synchrony-glass-button:hover .synchrony-title {
          text-shadow: 0 0 25px #4A9EFF, 0 0 35px #4A9EFF;
          transform: scale(1.05);
        }

        .synchrony-glass-button:hover .synchrony-subtitle {
          color: rgba(74, 158, 255, 0.9);
        }

        .synchrony-title {
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #4A9EFF;
          letter-spacing: 0.12em;
          margin-bottom: 0.2rem;
          text-shadow: 0 0 15px rgba(74, 158, 255, 0.6);
          transition: all 0.3s ease;
        }

        .synchrony-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.6rem;
          color: rgba(74, 158, 255, 0.6);
          letter-spacing: 0.08em;
          text-transform: lowercase;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .floating-portal-widget {
            bottom: 1.5rem;
            right: 1.5rem;
            --portal-size: 60px;
          }

          .portal-center-symbol {
            font-size: 1.5rem;
          }

          .synchrony-button-overlay {
            bottom: 1.5rem;
            right: 5.5rem;
          }

          .synchrony-title {
            font-size: 0.9rem;
          }

          .synchrony-subtitle {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <canvas ref={canvasRef} className="particle-canvas" />

      <div 
        className="realms-container"
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {realms.map((realm, index) => (
          <section
            key={index}
            className={`realm ${realm.vibe} ${index === currentRealm ? 'active' : ''}`}
            style={{ background: realm.colors.background }}
          >
            <div className="ui-panel">
              <div className="logo-container">
                <img 
                  src={realm.logoUrl} 
                  alt={realm.name}
                  className="realm-logo-img"
                  style={{ filter: `drop-shadow(0 0 20px ${realm.colors.primary})` }}
                />
              </div>
              <h1 className="realm-title">{realm.name}</h1>
              <p className="realm-caption">{realm.caption}</p>
              <button 
                className="realm-button"
                onClick={() => handleEnterRealm(realm.path)}
              >
                {realm.buttonText}
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* Scroll Dots Indicator */}
      <div className="scroll-indicator">
        {realms.map((_, index) => (
          <button
            key={index}
            className={`scroll-dot ${index === currentRealm ? 'active' : ''}`}
            onClick={() => scrollToRealm(index)}
            aria-label={`Scroll to ${realms[index].name}`}
          />
        ))}
      </div>

      {/* Cyberpunk Synchrony Portal Widget */}
      <div 
        className="floating-portal-widget"
        onClick={handleSynchronyClick}
        onMouseEnter={handleSynchronyHover}
        onMouseLeave={handleSynchronyLeave}
        onTouchStart={handleSynchronyToggle}
      >
        <div className="portal-container">
          <div className="portal-ring"></div>
          <div className="portal-vortex"></div>
          <div className="portal-particles"></div>
          <div className="portal-center-symbol">ॐ</div>
        </div>
      </div>

      {/* Synchrony Floating Text Labels */}
      <div className={`synchrony-button-overlay ${synchronyOpen ? 'visible' : ''}`}>
        <div className="synchrony-glass-button" onClick={handleSynchronyClick}>
          <div className="synchrony-title">SYNCHRONY</div>
          <div className="synchrony-subtitle">save the world</div>
        </div>
      </div>
    </div>
  );
}
