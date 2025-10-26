
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SubscriptionGate({ onClose, onSuccess }) {
  const [trialCode, setTrialCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const VALID_CODES = [
    'Liberation444',
    'Liberation4441',
    'Liberation4442',
    'Liberation4443',
    'Liberation4444',
    'Liberation4445',
    'Liberation4446',
    'Liberation4447',
    'Liberation4448',
    'Liberation4449'
  ];

  const handleTrialCodeSubmit = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      // Check if code is valid
      if (!VALID_CODES.includes(trialCode)) {
        setError('Invalid liberation code. Check your code and try again.');
        setIsLoading(false);
        return;
      }

      // Get current user
      const currentUser = await base44.auth.me();

      // Check if user already used a trial code
      if (currentUser.trial_code_used) {
        setError('You have already redeemed a trial code.');
        setIsLoading(false);
        return;
      }

      // Check if this specific code has been used by anyone
      const usersWithThisCode = await base44.entities.User.filter({
        trial_code_used: trialCode
      });

      if (usersWithThisCode.length > 0) {
        setError('This liberation code has already been redeemed.');
        setIsLoading(false);
        return;
      }

      // Grant 2-week trial
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      await base44.auth.updateMe({
        subscription_status: 'trial',
        trial_code_used: trialCode,
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString()
      });

      setMessage('Liberation code activated! Welcome to The Sanctuary.');
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err) {
      console.error('Trial code error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleTrialCodeSubmit();
    }
  };

  return (
    <div className="subscription-gate-overlay">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        @keyframes gate-breath {
          0% { 
            box-shadow: 0 0 20px rgba(226, 88, 34, 0.4), inset 0 0 20px rgba(226, 88, 34, 0.1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(226, 88, 34, 0.6), inset 0 0 30px rgba(226, 88, 34, 0.2);
          }
          100% { 
            box-shadow: 0 0 20px rgba(226, 88, 34, 0.4), inset 0 0 20px rgba(226, 88, 34, 0.1);
          }
        }

        @keyframes glow-pulse {
          0% { text-shadow: 0 0 10px #FF7836; }
          50% { text-shadow: 0 0 20px #FF7836, 0 0 30px #F83200; }
          100% { text-shadow: 0 0 10px #FF7836; }
        }

        .subscription-gate-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .subscription-gate-box {
          background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 10, 5, 0.95));
          border: 2px solid #E25822;
          max-width: 500px;
          width: 100%;
          position: relative;
          animation: gate-breath 7s ease-in-out infinite;
          padding: 0;
          overflow: hidden;
        }

        .gate-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #FFB37A;
        }

        .gate-corner.top-left {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .gate-corner.top-right {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }

        .gate-corner.bottom-left {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }

        .gate-corner.bottom-right {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        .gate-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: #E25822;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          padding: 0.5rem;
        }

        .gate-close:hover {
          color: #FFB37A;
          transform: scale(1.1);
        }

        .gate-content {
          padding: 3rem 2rem 2rem;
          text-align: center;
        }

        .gate-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.8rem;
          font-weight: 900;
          color: #E25822;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .gate-subtitle {
          font-family: 'Exo 2', sans-serif;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .gate-divider {
          width: 80%;
          height: 1px;
          background: linear-gradient(to right, transparent, #E25822, transparent);
          margin: 2rem auto;
        }

        .gate-section-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          color: #FFB37A;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .gate-input-group {
          margin-bottom: 1.5rem;
        }

        .gate-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(226, 88, 34, 0.5);
          color: white;
          padding: 1rem;
          font-family: 'Orbitron', monospace;
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-align: center;
          transition: all 0.3s ease;
        }

        .gate-input:focus {
          outline: none;
          border-color: #E25822;
          box-shadow: 0 0 15px rgba(226, 88, 34, 0.5);
        }

        .gate-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
        }

        .gate-button {
          width: 100%;
          background: linear-gradient(135deg, #E25822, #FFB37A);
          border: 2px solid #E25822;
          color: white;
          padding: 1rem 2rem;
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }

        .gate-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #FFB37A, #E25822);
          box-shadow: 0 0 25px rgba(226, 88, 34, 0.6);
          transform: translateY(-2px);
        }

        .gate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gate-error {
          color: #FF4444;
          font-size: 0.85rem;
          margin-top: 1rem;
          font-family: 'Exo 2', sans-serif;
        }

        .gate-success {
          color: #44FF44;
          font-size: 0.85rem;
          margin-top: 1rem;
          font-family: 'Exo 2', sans-serif;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .gate-future-text {
          font-family: 'Exo 2', sans-serif;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .gate-title {
            font-size: 1.4rem;
          }

          .gate-subtitle {
            font-size: 0.9rem;
          }

          .gate-content {
            padding: 2.5rem 1.5rem 1.5rem;
          }
        }
      `}</style>

      <div className="subscription-gate-box">
        <div className="gate-corner top-left"></div>
        <div className="gate-corner top-right"></div>
        <div className="gate-corner bottom-left"></div>
        <div className="gate-corner bottom-right"></div>

        <button className="gate-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="gate-content">
          <h1 className="gate-title">ACCESS PROTOCOL</h1>
          <p className="gate-subtitle">
            The Sanctuary awaits those who seek mastery over sleep, dreams, and consciousness.
          </p>

          <div className="gate-divider"></div>

          <div className="gate-section-title">Liberation Code</div>
          <p className="gate-subtitle" style={{fontSize: '0.85rem', marginBottom: '1rem'}}>
            Enter your code to begin your 14-day journey
          </p>

          <div className="gate-input-group">
            <input
              type="text"
              className="gate-input"
              placeholder="LIBERATION444"
              value={trialCode}
              onChange={(e) => setTrialCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <button 
            className="gate-button"
            onClick={handleTrialCodeSubmit}
            disabled={isLoading || !trialCode.trim()}
          >
            {isLoading ? 'VALIDATING...' : 'ACTIVATE TRIAL'}
          </button>

          {error && <div className="gate-error">{error}</div>}
          {message && <div className="gate-success">{message}</div>}

          <div className="gate-future-text">
            Full subscription options coming soon.<br/>
            For now, liberation codes grant 2 weeks of sovereign access.
          </div>
        </div>
      </div>
    </div>
  );
}
