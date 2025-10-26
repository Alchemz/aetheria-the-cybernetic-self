
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Heart, Zap, Eye, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function Nexus() {
  const mountRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const navigate = useNavigate();

  const modules = [
    {
      id: 'meditation',
      name: 'Meditations & Healing Lab',
      icon: Heart,
      description: 'Curated library of consciousness-expanding meditation tracks and healing frequencies',
      path: '/nexus-frequency-lab',
      color: '#C89BD8' // More saturated lavender
    },
    {
      id: 'cosmic',
      name: 'Cosmic Observatory',
      icon: Moon, // Changed from Brain to Moon
      description: 'Astrological insights, human design, and cosmic alignment tools',
      path: '/nexus-cosmic-observatory',
      color: '#D4C44A' // Changed from #B87FC8 to #D4C44A
    },
    {
      id: 'biohacking',
      name: 'Biohacking Lab',
      icon: Zap,
      description: 'Advanced protocols for cognitive enhancement and neuroplasticity',
      path: '/nexus-biohacking-lab',
      color: '#7BA8D8' // More saturated periwinkle blue
    },
    {
      id: 'pineal',
      name: 'Pineal Atrium',
      icon: Eye,
      description: 'Interactive 3D brain exploration and pineal gland activation protocols',
      path: '/nexus-pineal-atrium',
      color: '#BA7BC8' // More saturated mauve
    }
  ];

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

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x9B8AA8, // Muted purple for stars
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      stars.rotation.y = elapsedTime * 0.02;
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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? modules.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === modules.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    if (absDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 100,
        filter: 'brightness(1.2)'
      };
    } else if (absDiff === 1) {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 60}%) scale(0.8) rotateY(${-direction * 25}deg)`,
        opacity: 0.6,
        zIndex: 50,
        filter: 'brightness(0.7)'
      };
    } else {
      const direction = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 100}%) scale(0.6) rotateY(${-direction * 45}deg)`,
        opacity: 0.3,
        zIndex: 10,
        filter: 'brightness(0.4)'
      };
    }
  };

  return (
    <SubscriptionGuard requiredProduct="nexus">
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

          @keyframes soft-glow {
            0%, 100% {
              filter: drop-shadow(0 0 15px currentColor);
              text-shadow: 0 0 15px currentColor;
            }
            50% {
              filter: drop-shadow(0 0 30px currentColor);
              text-shadow: 0 0 30px currentColor;
            }
          }

          @keyframes title-glow {
            0%, 100% {
              text-shadow: 0 0 20px currentColor;
            }
            50% {
              text-shadow: 0 0 35px currentColor, 0 0 45px currentColor;
            }
          }

          .nexus-carousel-container {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 2000px;
            user-select: none;
          }

          .nexus-header {
            position: absolute;
            top: 2rem;
            left: 0;
            right: 0;
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
          }

          .nexus-back {
            color: rgba(255, 255, 255, 0.7);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .nexus-back:hover {
            color: #B87FC8;
          }

          .nexus-title {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 900;
            color: #B87FC8;
            text-align: center;
            letter-spacing: 0.15em;
            text-shadow: 0 0 30px rgba(184, 127, 200, 0.6);
          }

          .nexus-subtitle {
            position: absolute;
            top: 7rem;
            left: 0;
            right: 0;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            letter-spacing: 0.05em;
            z-index: 200;
            font-family: 'Exo 2', sans-serif;
          }

          .carousel-track {
            position: relative;
            width: 100%;
            height: 70%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .module-card {
            position: absolute;
            width: 450px;
            max-width: 90vw;
            height: 550px;
            background: linear-gradient(135deg, rgba(139, 123, 168, 0.15), rgba(139, 123, 168, 0.05));
            border: 2px solid rgba(139, 123, 168, 0.6);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 3rem 2rem;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
            transform-style: preserve-3d;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .module-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, currentColor, transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .module-card.active::before {
            opacity: 1;
          }

          .module-card:hover {
            border-color: currentColor;
            box-shadow: 0 0 50px currentColor;
          }

          .module-icon {
            width: 100px;
            height: 100px;
            margin-bottom: 2rem;
            animation: soft-glow 4s ease-in-out infinite;
            transition: all 0.3s ease;
          }

          .module-card.active .module-icon {
            transform: scale(1.1);
            animation: soft-glow 3s ease-in-out infinite;
          }

          .module-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            letter-spacing: 0.1em;
            animation: title-glow 4s ease-in-out infinite;
          }

          .module-desc {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.8;
            font-size: 1rem;
            font-family: 'Exo 2', sans-serif;
            max-width: 350px;
          }

          .carousel-nav {
            position: absolute;
            bottom: 4rem;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            z-index: 200;
          }

          .nav-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(184, 127, 200, 0.2), rgba(184, 127, 200, 0.1));
            border: 2px solid rgba(184, 127, 200, 0.6);
            color: #B87FC8;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .nav-button:hover {
            background: linear-gradient(135deg, rgba(184, 127, 200, 0.4), rgba(184, 127, 200, 0.2));
            border-color: #B87FC8;
            box-shadow: 0 0 30px rgba(184, 127, 200, 0.5);
            transform: scale(1.1);
          }

          .progress-dots {
            display: flex;
            gap: 1rem;
          }

          .progress-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(184, 127, 200, 0.3);
            border: 2px solid rgba(184, 127, 200, 0.5);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .progress-dot.active {
            background: #B87FC8;
            box-shadow: 0 0 20px rgba(184, 127, 200, 0.8);
            transform: scale(1.3);
          }

          @media (max-width: 768px) {
            .nexus-title {
              font-size: 1.8rem;
            }

            .nexus-subtitle {
              font-size: 0.85rem;
              top: 6rem;
            }

            .module-card {
              width: 350px;
              height: 480px;
              padding: 2rem 1.5rem;
            }

            .module-icon {
              width: 70px;
              height: 70px;
            }

            .module-name {
              font-size: 1.4rem;
            }

            .module-desc {
              font-size: 0.9rem;
            }
          }
        `}</style>

        <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

        <div className="nexus-header">
          <Link to="/portal" className="nexus-back">
            <ArrowLeft size={28} />
          </Link>
          <h1 className="nexus-title">THE NEXUS</h1>
          <div style={{ width: 28 }} />
        </div>

        <div 
          className="nexus-carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="carousel-track">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={module.id}
                  className={`module-card ${isActive ? 'active' : ''}`}
                  style={{
                    ...getCardStyle(index),
                    color: module.color
                  }}
                  onClick={() => isActive && handleCardClick(module.path)}
                >
                  <Icon className="module-icon" />
                  <h3 className="module-name">{module.name}</h3>
                  <p className="module-desc">{module.description}</p>
                </div>
              );
            })}
          </div>

          <div className="carousel-nav">
            <div className="nav-button" onClick={handlePrev}>
              <ChevronLeft size={28} />
            </div>
            
            <div className="progress-dots">
              {modules.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <div className="nav-button" onClick={handleNext}>
              <ChevronRight size={28} />
            </div>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
