import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Check, Lock, ArrowLeft } from 'lucide-react';
import { subscriptionService } from '@/services/subscriptionService';
import { Capacitor } from '@capacitor/core';

export default function Upgrade() {
  const location = useLocation();
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const isNative = Capacitor.isNativePlatform();
  
  const fromPage = location.state?.from || '/portal';

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      if (isNative) {
        const currentOffering = await subscriptionService.getOfferings();
        setOfferings(currentOffering);
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageToPurchase) => {
    setPurchasing(true);
    try {
      const result = await subscriptionService.purchasePackage(packageToPurchase);
      
      if (result) {
        // Purchase successful, navigate to original destination
        navigate(fromPage);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await subscriptionService.restorePurchases();
      
      // Check if user now has access
      const hasAccess = await subscriptionService.hasActiveSubscription();
      if (hasAccess) {
        navigate(fromPage);
      } else {
        alert('No previous purchases found.');
      }
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Failed to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upgrade-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

        .upgrade-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #000033 100%);
          color: white;
          font-family: 'Rajdhani', sans-serif;
          padding: calc(40px + var(--safe-area-top)) 20px calc(40px + var(--safe-area-bottom));
          overflow-y: auto;
        }

        .upgrade-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .upgrade-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #00FFFF;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 30px;
          transition: all 0.3s;
        }

        .back-button:hover {
          transform: translateX(-5px);
          color: #66FFFF;
        }

        .upgrade-icon {
          display: inline-block;
          margin-bottom: 20px;
        }

        .upgrade-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FFFF, #FF00FF, #FFFF00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
        }

        .upgrade-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 255, 255, 0.6);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
        }

        .feature-icon {
          color: #00FFFF;
          margin-bottom: 15px;
        }

        .feature-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #00FFFF;
        }

        .feature-desc {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .pricing-section {
          max-width: 500px;
          margin: 0 auto;
        }

        .price-card {
          background: rgba(0, 255, 255, 0.1);
          border: 2px solid #00FFFF;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 20px 60px rgba(0, 255, 255, 0.3);
        }

        .price-badge {
          display: inline-block;
          background: #00FFFF;
          color: #000;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .price-amount {
          font-family: 'Orbitron', monospace;
          font-size: 3.5rem;
          font-weight: 900;
          color: #00FFFF;
          margin-bottom: 10px;
        }

        .price-period {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 30px;
        }

        .subscribe-button {
          width: 100%;
          padding: 18px;
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00FFFF, #00CCCC);
          color: #000;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.4);
        }

        .subscribe-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 255, 255, 0.6);
        }

        .subscribe-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .restore-link {
          text-align: center;
          margin-top: 20px;
        }

        .restore-link button {
          background: none;
          border: none;
          color: #00FFFF;
          text-decoration: underline;
          cursor: pointer;
          font-size: 1rem;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #00FFFF;
        }

        .web-notice {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 0, 0.1);
          border: 2px solid rgba(255, 255, 0, 0.5);
          border-radius: 15px;
          margin-top: 30px;
        }

        .web-notice h3 {
          font-family: 'Orbitron', monospace;
          color: #FFFF00;
          margin-bottom: 15px;
        }

        .web-notice p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .upgrade-title {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .price-amount {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="upgrade-content">
        <Link to={fromPage} className="back-button">
          <ArrowLeft size={20} />
          Go Back
        </Link>

        <div className="upgrade-header">
          <div className="upgrade-icon">
            <Lock size={60} color="#00FFFF" />
          </div>
          <h1 className="upgrade-title">UNLOCK INNERSYNC</h1>
          <p className="upgrade-subtitle">
            Access the complete wellness experience with premium features designed to transform your consciousness
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles size={40} />
            </div>
            <h3 className="feature-title">Foundation</h3>
            <p className="feature-desc">
              Dreamscape sanctuary with healing frequencies, AI Dream Assistant, and sleep mastery courses
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles size={40} />
            </div>
            <h3 className="feature-title">Temple</h3>
            <p className="feature-desc">
              Align mind and body with proven biohacks to achieve complete inner and outer optimization
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles size={40} />
            </div>
            <h3 className="feature-title">Meditation Chamber</h3>
            <p className="feature-desc">
              Guided meditations, healing frequencies, and immersive 3D sound experiences
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles size={40} />
            </div>
            <h3 className="feature-title">All Features</h3>
            <p className="feature-desc">
              Complete access to cosmic briefings, resonator frequencies, and future updates
            </p>
          </div>
        </div>

        <div className="pricing-section">
          {loading ? (
            <div className="loading-state">
              <p>Loading subscription options...</p>
            </div>
          ) : isNative && offerings ? (
            <>
              {offerings.availablePackages.map((pkg) => (
                <div key={pkg.identifier} className="price-card">
                  <div className="price-badge">PREMIUM ACCESS</div>
                  <div className="price-amount">
                    {pkg.product.priceString}
                  </div>
                  <div className="price-period">
                    {pkg.product.subscriptionPeriod || 'per month'}
                  </div>
                  <button 
                    className="subscribe-button"
                    onClick={() => handlePurchase(pkg)}
                    disabled={purchasing}
                  >
                    {purchasing ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>
              ))}

              <div className="restore-link">
                <button onClick={handleRestore}>
                  Already purchased? Restore purchases
                </button>
              </div>
            </>
          ) : (
            <div className="web-notice">
              <h3>📱 Download the Native App</h3>
              <p>
                In-app purchases are only available in the iOS and Android native apps.
                <br /><br />
                Download INNERSYNC from the App Store or Google Play to unlock premium features!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
