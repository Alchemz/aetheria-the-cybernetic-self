import React, { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { Target, Flame, Zap } from 'lucide-react';

export default function TempleLayout() {
  const mountRef = useRef(null);
  const location = useLocation();

  // Set background and handle StatusBar on mount
  useEffect(() => {
    document.body.style.background = '#2C2C2C';
    
    // Disable StatusBar overlay for iOS (only in native environment)
    const disableOverlay = async () => {
      if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
        try {
          const { StatusBar } = await import('@capacitor/status-bar');
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (error) {
          console.log('StatusBar error:', error);
        }
      }
    };
    
    disableOverlay();
    
    return () => {
      document.body.style.background = '#000000';
    };
  }, []);

  // Three.js background animation
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2C2C2C);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x2C2C2C);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
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

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00A86B,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Wrap around edges
        if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.05;
      
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
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  // Determine active route
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="safe-page temple-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        .safe-page.temple-page {
          padding-top: var(--safe-area-top);
          padding-bottom: var(--safe-area-bottom);
          min-height: 100dvh;
          box-sizing: border-box;
          position: relative;
          background: #2C2C2C;
        }

        .temple-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #2C2C2C;
        }

        .temple-content {
          position: relative;
          z-index: 1;
          min-height: calc(100dvh - var(--safe-area-top) - var(--safe-area-bottom));
          padding-bottom: 100px;
        }

        .temple-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, #0A0A0F, rgba(10, 10, 15, 0.95));
          backdrop-filter: blur(10px);
          padding: 1rem;
          padding-bottom: calc(1rem + var(--safe-area-bottom));
          display: flex;
          justify-content: space-around;
          border-top: 1px solid rgba(0, 168, 107, 0.3);
          z-index: 100;
        }

        .temple-nav-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-family: 'Orbitron', monospace;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
        }

        .temple-nav-btn.active {
          color: #00A86B;
          text-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
        }

        .temple-nav-btn:hover {
          color: #00A86B;
        }
      `}</style>

      <div ref={mountRef} className="temple-bg" />

      <div className="temple-content">
        <Outlet />
      </div>

      <div className="temple-bottom-nav">
        <Link 
          to="/heartwave-console" 
          className={`temple-nav-btn ${isActive('/heartwave-console') || isActive('/heartwave/console') ? 'active' : ''}`}
        >
          <Target size={20} />
          <span>Routine</span>
        </Link>
        <Link 
          to="/heartwave" 
          className={`temple-nav-btn ${isActive('/heartwave') && location.pathname === '/heartwave' ? 'active' : ''}`}
        >
          <Flame size={20} />
          <span>Bio-Mods</span>
        </Link>
        <Link 
          to="/heartwave-athena" 
          className={`temple-nav-btn ${isActive('/heartwave-athena') || isActive('/heartwave/athena') ? 'active' : ''}`}
        >
          <Zap size={20} />
          <span>ATHENA</span>
        </Link>
      </div>
    </div>
  );
}
