import React, { useState, useEffect } from 'react';
import { auth } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Shield, Check } from 'lucide-react';

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
    } catch (err) {
      setError('Could not load user. Please refresh the page.');
    }
  };

  const handleGrantAccess = async () => {
    if (!user) {
      setError('User not loaded. Please refresh.');
      return;
    }

    if (user.email.toLowerCase() !== 'tylervei@outlook.com') {
      setError('This function is only available for the admin account.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Update directly from frontend
      await auth.updateMe({
        subscription_status: 'active',
        subscribed_products: ['sanctuary', 'nexus', 'heartwave'],
        subscription_type: 'all_bundle',
        subscription_start_date: new Date().toISOString(),
        trial_end_date: null,
        has_used_trial: true
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/portal';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to grant access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: 'white',
      fontFamily: 'Orbitron, monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'rgba(255, 89, 0, 0.05)',
        border: '2px solid #FF5900',
        padding: '40px',
        textAlign: 'center'
      }}>
        <Shield size={64} color="#FF5900" style={{ marginBottom: '20px' }} />
        
        <h1 style={{
          fontSize: '2rem',
          color: '#FF5900',
          marginBottom: '20px',
          textShadow: '0 0 20px #FF5900'
        }}>
          ADMIN ACCESS SETUP
        </h1>

        {!success ? (
          <>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Click below to grant your account lifetime access to all INNERSYNC pathways 
              (Sanctuary, Nexus, and HeartWave).
            </p>

            {user && (
              <p style={{
                color: 'rgba(255, 179, 122, 0.8)',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                Logged in as: {user.email}
              </p>
            )}

            <Button
              onClick={handleGrantAccess}
              disabled={loading || !user}
              style={{
                background: 'linear-gradient(135deg, #FF5900, #FF8C42)',
                border: '2px solid #FF5900',
                color: 'white',
                padding: '15px 40px',
                fontSize: '1rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 700,
                cursor: (loading || !user) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'GRANTING ACCESS...' : 'GRANT ADMIN ACCESS'}
            </Button>

            {error && (
              <p style={{
                color: '#FF4444',
                marginTop: '20px',
                fontSize: '0.9rem'
              }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <div>
            <Check size={64} color="#44FF44" style={{ marginBottom: '20px' }} />
            <p style={{
              color: '#44FF44',
              fontSize: '1.2rem',
              marginBottom: '10px'
            }}>
              ACCESS GRANTED!
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}>
              Redirecting to portal...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}