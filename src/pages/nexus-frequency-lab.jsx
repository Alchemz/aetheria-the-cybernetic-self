
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Play, Pause, Volume2, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeditationChamber() {
  const mountRef = useRef(null);
  const audioRef = useRef(null); // Added audioRef
  const [currentCategory, setCurrentCategory] = useState('guided');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(checkIOS);
  }, []);

  const categories = {
    guided: {
      name: 'Guided Meditations',
      description: 'Immersive guided journeys for deep relaxation and consciousness exploration',
      tracks: [
        { 
          id: 'heart-bloom', 
          name: 'A Heart in Full Bloom', 
          duration: '20:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/A+Heart+in+Full+Bloom%E2%80%9D+Meditation+%E2%80%93+Live+With+Mei-lan+.mp3'
        },
        { 
          id: 'transcendental-beginners', 
          name: 'Transcendental Meditation for Beginners', 
          duration: '10:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Powerful+10-Minute+Guided+Transcendental+Meditation+for+Beginners+.mp3'
        },
        { 
          id: 'heart-coherence-original', 
          name: 'Heart Coherence Meditation', 
          duration: '15:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Heart+Coherence+Guided+Meditation+Dr+Joe+Dispenza+.mp3'
        },
        { 
          id: 'chakra-alignment', 
          name: 'Full Chakra Alignment Journey', 
          duration: '25:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Guided+Meditation++-+Chakra+Alignment+.mp3'
        }
      ]
    },
    heartcoherence: {
      name: 'Heart Coherence',
      description: 'Heart-centered practices for emotional balance and cardiovascular harmony',
      tracks: [
        { 
          id: 'heart-coherence-hc', 
          name: 'Heart Coherence Meditation', 
          duration: '15:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Heart+Coherence+Guided+Meditation+Dr+Joe+Dispenza+.mp3'
        },
        { 
          id: 'heart-bloom-hc', 
          name: 'A Heart in Full Bloom', 
          duration: '20:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/A+Heart+in+Full+Bloom%E2%80%9D+Meditation+%E2%80%93+Live+With+Mei-lan+.mp3'
        }
      ]
    },
    healing: {
      name: 'Healing Frequencies',
      description: 'Solfeggio frequencies and sound healing for cellular regeneration and energy alignment',
      tracks: [
        { 
          id: '963-alignment', 
          name: '963 Hz Alignment Meditation', 
          duration: '30:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/963+Hz+to+Connect++healing+Meditation+and+Healing+.mp3'
        },
        { 
          id: 'chakra-sound-bath', 
          name: 'Chakra Restoration Sound Bath', 
          duration: '30:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Chakra+Restoration+Sound+Bath++Singing+bowls+music+for+aligning+Chakras+.mp3'
        },
        { 
          id: 'solar-harmonics-healing', 
          name: 'Solar Harmonics', 
          duration: '35:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Solar+Harmonics+.mp3'
        }
      ]
    },
    focus: {
      name: 'Focus',
      description: 'Binaural beats and gamma waves for peak concentration and cognitive performance',
      tracks: [
        { 
          id: 'deep-focus-40hz', 
          name: '40 Hz Deep Focus (Headphones)', 
          duration: '45:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/(Headphones)+40hz+for+Deep+Focus+.mp3'
        },
        { 
          id: 'solar-harmonics-focus', 
          name: 'Solar Harmonics', 
          duration: '35:00', 
          url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Solar+Harmonics+.mp3'
        }
      ]
    }
  };

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

    // Cosmic particles with meditation colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Meditation chamber colors - soft pinks and purples
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.01;
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

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for same track
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(err => {
          console.error('Playback error on play:', err);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      // Load and play new track
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Wait for next render to ensure audio element has new src
      // and then attempt to play. This is crucial for audio elements 
      // where src changes, as play() might be called too early.
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load(); // Reload the audio element to apply new src
          audioRef.current.play().catch(err => {
            console.error('Playback error on new track:', err);
            setIsPlaying(false);
          });
        }
      }, 50); // A small delay to ensure DOM update
    }
  };

  const handlePlayerToggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error on toggle:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleDownload = (track) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(track.url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = track.url;
      link.download = `${track.name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBackgroundPlay = (track) => {
    window.open(track.url, '_blank');
  };

  return (
    <div className="meditation-chamber">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .meditation-chamber {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .chamber-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .chamber-content {
          position: relative;
          z-index: 10;
          padding: 80px 20px 120px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .chamber-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .chamber-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #FF6B9D;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .chamber-back:hover {
          color: #FFB3D1;
          transform: translateX(-3px);
        }

        .chamber-title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          color: #FF6B9D;
          text-align: center;
          letter-spacing: 0.15em;
          text-shadow: 0 0 30px #FF6B9D;
          margin-bottom: 15px;
        }

        .chamber-subtitle {
          text-align: center;
          color: rgba(255, 179, 209, 0.7);
          font-size: 1rem;
          margin-bottom: 50px;
          letter-spacing: 0.05em;
        }

        .category-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 15px;
          margin-bottom: 40px;
        }

        .category-btn {
          padding: 18px 24px;
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.12), rgba(255, 107, 157, 0.06));
          border: 2px solid rgba(255, 107, 157, 0.4);
          color: rgba(255, 179, 209, 0.8);
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative;
          overflow: hidden;
        }

        .category-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF6B9D, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-btn:hover {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 107, 157, 0.1));
          border-color: #FF6B9D;
          color: #FFB3D1;
        }

        .category-btn:hover::before {
          opacity: 1;
        }

        .category-btn.active {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.25), rgba(255, 107, 157, 0.15));
          border-color: #FF6B9D;
          color: #FF6B9D;
          box-shadow: 0 0 25px rgba(255, 107, 157, 0.4);
        }

        .category-btn.active::before {
          opacity: 1;
        }

        .category-section {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(255, 107, 157, 0.04));
          border: 2px solid rgba(255, 107, 157, 0.4);
          padding: 40px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }

        .category-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FF6B9D, #FFB3D1, transparent);
        }

        .category-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .category-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          color: #FF6B9D;
          margin-bottom: 10px;
          text-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
        }

        .category-desc {
          color: rgba(255, 179, 209, 0.7);
          line-height: 1.6;
        }

        .tracks-list {
          display: grid;
          gap: 15px;
        }

        .track-item {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 107, 157, 0.3);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .track-item:hover {
          border-color: #FF6B9D;
          box-shadow: 0 0 20px rgba(255, 107, 157, 0.3);
          background: rgba(255, 107, 157, 0.05);
        }

        .track-item.playing {
          border-color: #FF6B9D;
          background: rgba(255, 107, 157, 0.15);
          box-shadow: 0 0 25px rgba(255, 107, 157, 0.4);
        }

        .track-info {
          flex: 1;
        }

        .track-name {
          font-family: 'Orbitron', monospace;
          color: #FFB3D1;
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .track-duration {
          color: rgba(255, 179, 209, 0.5);
          font-size: 0.85rem;
        }

        .track-controls {
          display: flex;
          gap: 10px;
        }

        .track-button {
          background: transparent;
          border: 1px solid #FF6B9D;
          color: #FF6B9D;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .track-button:hover {
          background: #FF6B9D;
          color: #000;
          box-shadow: 0 0 15px rgba(255, 107, 157, 0.5);
        }

        .track-button.playing {
          background: #FF6B9D;
          color: #000;
        }

        .player-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 10, 15, 0.95));
          border-top: 2px solid #FF6B9D;
          padding: 20px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 -5px 30px rgba(255, 107, 157, 0.3);
        }

        .player-info {
          flex: 1;
        }

        .player-label {
          font-family: 'Orbitron', monospace;
          color: #FF6B9D;
          margin-bottom: 5px;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .player-track-name {
          color: #FFB3D1;
          font-size: 1rem;
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .player-button {
          background: transparent;
          border: 2px solid #FF6B9D;
          color: #FF6B9D;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .player-button:hover {
          background: #FF6B9D;
          color: #000;
          box-shadow: 0 0 20px rgba(255, 107, 157, 0.6);
        }

        @media (max-width: 768px) {
          .chamber-content {
            padding: 60px 15px 140px;
          }

          .chamber-title {
            font-size: 1.8rem;
          }

          .category-selector {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .category-section {
            padding: 25px;
          }

          .track-item {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .track-controls {
            width: 100%;
            justify-content: flex-end;
          }

          .player-bar {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }

          .player-info {
            text-align: center;
          }

          .player-controls {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div ref={mountRef} className="chamber-bg" />

      <div className="chamber-content">
        <div className="chamber-header">
          <Link to="/nexus" className="chamber-back">
            <ArrowLeft size={18} />
            Back to Nexus
          </Link>
        </div>

        <h1 className="chamber-title">MEDITATIONS & HEALING MUSIC</h1>
        <p className="chamber-subtitle">
          Immersive sonic journeys for consciousness expansion and cellular regeneration
        </p>

        <div className="category-selector">
          {Object.keys(categories).map(key => (
            <button
              key={key}
              className={`category-btn ${currentCategory === key ? 'active' : ''}`}
              onClick={() => setCurrentCategory(key)}
            >
              {categories[key].name}
            </button>
          ))}
        </div>

        <div className="category-section">
          <div className="category-header">
            <h2 className="category-name">{categories[currentCategory].name}</h2>
            <p className="category-desc">{categories[currentCategory].description}</p>
          </div>

          <div className="tracks-list">
            {categories[currentCategory].tracks.map(track => (
              <div
                key={track.id}
                className={`track-item ${currentTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
              >
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-duration">{track.duration}</div>
                </div>
                <div className="track-controls">
                  <button 
                    className={`track-button ${currentTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
                    onClick={() => handlePlayTrack(track)}
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} />
                    )}
                  </button>
                  <button className="track-button">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentTrack && (
        <>
          <audio
            ref={audioRef}
            src={currentTrack.url}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            preload="auto" // Added preload to help with quicker loading
          />
          
          <div className="player-bar">
            <div className="player-info">
              <div className="player-label">NOW PLAYING</div>
              <div className="player-track-name">{currentTrack.name}</div>
            </div>
            <div className="player-controls">
              <button className="player-button" onClick={handlePlayerToggle}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <Volume2 size={24} color="#FF6B9D" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
