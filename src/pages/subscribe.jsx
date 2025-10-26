
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function SubscribePage() {
  const mountRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [selectedTwo, setSelectedTwo] = useState([]);
  const [startingTrial, setStartingTrial] = useState(false);

  // BETA MODE FLAG
  const BETA_MODE = true;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
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
      color: 0xFF5900,
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

  const handleStartTrial = async () => {
    if (!user) return;
    
    if (user.has_used_trial) {
      alert('You have already used your free trial. Please select a subscription plan.');
      return;
    }

    setStartingTrial(true);
    
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      await base44.auth.updateMe({
        subscription_status: 'trial',
        subscribed_products: ['sanctuary', 'nexus', 'heartwave'],
        subscription_type: 'all_bundle',
        trial_start_date: new Date().toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        has_used_trial: true
      });

      window.location.href = '/portal';
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('Failed to start trial. Please try again.');
    } finally {
      setStartingTrial(false);
    }
  };

  const handleToggleTwo = (product) => {
    setSelectedTwo(prev => {
      if (prev.includes(product)) {
        return prev.filter(p => p !== product);
      } else if (prev.length < 2) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const products = [
    {
      id: 'sanctuary',
      name: 'Sleep Sanctuary',
      icon: '🌙',
      description: 'Master your sleep with frequencies, dream journaling, and AI guidance',
      features: ['Delta Wave Frequencies', 'Dream Assistant AI', 'Sleep Optimization Guide']
    },
    {
      id: 'nexus',
      name: 'The Nexus',
      icon: '🧬',
      description: 'Explore consciousness through biohacking and cosmic knowledge',
      features: ['Interactive Pineal Atrium', 'Biohacking Lab', 'Cosmic Observatory']
    },
    {
      id: 'heartwave',
      name: 'HeartWave',
      icon: '❤️',
      description: 'Connect with your partner through synchronized frequencies',
      features: ['Couples Meditation', 'Shared Journaling', 'Relationship Insights']
    }
  ];

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FF5900',
        fontFamily: 'Orbitron, monospace'
      }}>
        LOADING...
      </div>
    );
  }

  return (
    <div className="subscribe-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .subscribe-page {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .subscribe-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .subscribe-content {
          position: relative;
          z-index: 10;
          padding: 80px 20px 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #FF5900;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 40px;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .back-button:hover {
          color: #FF8C42;
          transform: translateX(-3px);
        }

        .subscribe-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .subscribe-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          color: #FF5900;
          margin-bottom: 20px;
          letter-spacing: 0.15em;
          text-shadow: 0 0 30px #FF5900;
        }

        .subscribe-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .trial-section {
          background: linear-gradient(135deg, rgba(255, 89, 0, 0.2), rgba(255, 140, 66, 0.2));
          border: 2px solid #FF5900;
          padding: 40px;
          margin-bottom: 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .trial-badge {
          background: #FF5900;
          color: #000;
          padding: 8px 15px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 25px;
          border-radius: 5px;
          box-shadow: 0 0 15px rgba(255, 89, 0, 0.5);
        }

        .trial-section h2 {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          color: #FF5900;
          margin-bottom: 15px;
        }

        .trial-section p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 25px;
          font-size: 1.1rem;
        }

        .trial-button {
          background: linear-gradient(135deg, #FF5900, #FF8C42);
          border: none;
          color: white;
          padding: 15px 40px;
          font-size: 1.1rem;
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          letter-spacing: '0.08em';
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 5px;
        }

        .trial-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 89, 0, 0.4);
        }

        .trial-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tier-section {
          margin-bottom: 60px;
        }

        .tier-section-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          color: #FF8C42;
          margin-bottom: 30px;
          text-align: center;
          letter-spacing: 0.08em;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .product-card {
          background: rgba(255, 89, 0, 0.05);
          border: 2px solid rgba(255, 89, 0, 0.3);
          padding: 30px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .product-card:hover {
          border-color: #FF5900;
          box-shadow: 0 0 25px rgba(255, 89, 0, 0.3);
        }

        .product-card.selected {
          border-color: #FF5900;
          background: rgba(255, 89, 0, 0.15);
          box-shadow: 0 0 30px rgba(255, 89, 0, 0.5);
        }

        .product-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          display: block;
        }

        .product-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          color: #FF5900;
          margin-bottom: 10px;
        }

        .product-description {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .product-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .product-features li {
          padding: 6px 0;
          color: rgba(255, 179, 122, 0.8);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .product-features li::before {
          content: '◆';
          color: #FF5900;
        }

        .selected-indicator {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 30px;
          height: 30px;
          background: #FF5900;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stripe-button-container {
          text-align: center;
          margin-top: 25px;
        }

        .stripe-placeholder {
          background: rgba(0, 0, 0, 0.5);
          border: 2px dashed rgba(255, 89, 0, 0.5);
          padding: 30px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
        }

        .price-tag {
          font-family: 'Orbitron', monospace;
          font-size: 2rem;
          color: #FF5900;
          margin-bottom: 15px;
        }

        .free-plan {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 30px;
          text-align: center;
          margin-bottom: 40px;
        }

        .free-plan-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 15px;
        }

        .free-plan-description {
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .subscribe-content {
            padding: 60px 15px 40px;
          }

          .subscribe-title {
            font-size: 2rem;
          }

          .trial-section {
            padding: 30px 20px;
          }

          .trial-features { /* This style is not used anymore due to trial-section restructure */
            flex-direction: column;
            gap: 15px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div ref={mountRef} className="subscribe-bg" />

      <div className="subscribe-content">
        <Link to="/portal" className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Portal</span>
        </Link>

        {/* BETA MODE BANNER */}
        {BETA_MODE && (
          <div style={{
            background: 'linear-gradient(135deg, #FF5900, #FF8C42)',
            border: '2px solid #FF8C42',
            padding: '20px',
            marginBottom: '40px',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(255, 89, 0, 0.5)'
          }}>
            <h2 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '1.5rem',
              marginBottom: '10px',
              color: '#000'
            }}>
              🚀 BETA ACCESS ACTIVE
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#000',
              marginBottom: '10px'
            }}>
              All pathways are currently free during beta testing!
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(0, 0, 0, 0.8)'
            }}>
              Explore everything INNERSYNC has to offer. Subscriptions will be enabled after beta.
            </p>
            <Link to="/portal">
              <button style={{
                marginTop: '20px',
                background: '#000',
                color: '#FF5900',
                border: '2px solid #000',
                padding: '12px 30px',
                fontSize: '1rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                ENTER INNERSYNC
              </button>
            </Link>
          </div>
        )}

        {!BETA_MODE && (
          <>
            <div className="subscribe-header">
              <h1 className="subscribe-title">CHOOSE YOUR PATH</h1>
              <p className="subscribe-subtitle">
                Unlock the tools to master your consciousness
              </p>
            </div>

            {/* Free Plan */}
            <div className="free-plan">
              <h3 className="free-plan-title">🎁 Free Access</h3>
              <p className="free-plan-description">
                You currently have free access to <strong>The Wisdom Well</strong> — 
                a curated collection of timeless spiritual wisdom from various traditions.
              </p>
            </div>

            {/* 7-Day Trial */}
            {!user?.has_used_trial && (
              <div className="trial-section">
                <div className="trial-badge">
                  <Sparkles size={24} />
                  <span>7-DAY FREE TRIAL</span>
                </div>
                <h2>Experience Everything</h2>
                <p>
                  Get full access to all three pathways for 7 days. No credit card required.
                </p>
                <button 
                  className="trial-button"
                  onClick={handleStartTrial}
                  disabled={startingTrial}
                >
                  {startingTrial ? 'ACTIVATING TRIAL...' : 'START FREE TRIAL'}
                </button>
              </div>
            )}

            {/* Single Category - $9.99/month */}
            <div className="tier-section">
              <h2 className="tier-section-title">SINGLE PATH — $9.99/MONTH</h2>
              <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '30px'}}>
                Choose one pathway to begin your journey
              </p>
              
              <div className="products-grid">
                {products.map(product => (
                  <div 
                    key={product.id}
                    className={`product-card ${selectedSingle === product.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSingle(product.id)}
                  >
                    {selectedSingle === product.id && (
                      <div className="selected-indicator">
                        <Check size={20} color="white" />
                      </div>
                    )}
                    <span className="product-icon">{product.icon}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <ul className="product-features">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {selectedSingle && (
                <div className="stripe-button-container">
                  <div className="price-tag">$9.99 / month</div>
                  {selectedSingle === 'sanctuary' ? (
                    <div id="sanctuary-single-stripe">
                      {/* PASTE YOUR SANCTUARY STRIPE BUY BUTTON HERE */}
                      <div className="stripe-placeholder">
                        [Sanctuary $9.99/month Stripe Button]
                        <br/>
                        Paste your Stripe Buy Button code here
                      </div>
                    </div>
                  ) : (
                    <div className="stripe-placeholder">
                      [Stripe Buy Button for {products.find(p => p.id === selectedSingle)?.name}]
                      <br/>
                      Create this product in Stripe and paste the button code
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Two Categories - $12.99/month */}
            <div className="tier-section">
              <h2 className="tier-section-title">TWO PATHS — $12.99/MONTH</h2>
              <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '30px'}}>
                Select any two pathways (save $7/month)
              </p>
              
              <div className="products-grid">
                {products.map(product => (
                  <div 
                    key={product.id}
                    className={`product-card ${selectedTwo.includes(product.id) ? 'selected' : ''}`}
                    onClick={() => handleToggleTwo(product.id)}
                  >
                    {selectedTwo.includes(product.id) && (
                      <div className="selected-indicator">
                        <Check size={20} color="white" />
                      </div>
                    )}
                    <span className="product-icon">{product.icon}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <ul className="product-features">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {selectedTwo.length === 2 && (
                <div className="stripe-button-container">
                  <div className="price-tag">$12.99 / month</div>
                  <div className="stripe-placeholder">
                    [Stripe Buy Button for {selectedTwo.map(id => products.find(p => p.id === id)?.name).join(' + ')}]
                    <br/>
                    Create this bundle in Stripe and paste the button code
                  </div>
                </div>
              )}
            </div>

            {/* All Three Categories - $14.99/month */}
            <div className="tier-section">
              <h2 className="tier-section-title">ALL PATHS — $14.99/MONTH</h2>
              <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '30px'}}>
                Complete INNERSYNC experience (save $15/month)
              </p>
              
              <div className="products-grid">
                {products.map(product => (
                  <div 
                    key={product.id}
                    className="product-card selected"
                  >
                    <div className="selected-indicator">
                      <Check size={20} color="white" />
                    </div>
                    <span className="product-icon">{product.icon}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <ul className="product-features">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="stripe-button-container">
                <div className="price-tag">$14.99 / month</div>
                <div className="stripe-placeholder">
                  [Stripe Buy Button for All Three Paths]
                  <br/>
                  Create this bundle in Stripe and paste the button code
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
