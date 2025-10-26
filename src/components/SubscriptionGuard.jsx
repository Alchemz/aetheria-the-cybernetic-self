import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { APP_CONFIG } from '@/config';

export default function SubscriptionGuard({ requiredProduct, children }) {
  // BETA MODE: Bypassing all subscription checks
  // TODO: Re-enable subscription checks after beta testing
  const BETA_MODE = APP_CONFIG.BETA_MODE;

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BETA_MODE) {
      // In beta mode, grant immediate access
      setHasAccess(true);
      setLoading(false);
      return;
    }
    
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const user = await base44.auth.me();
      
      // Check if user has active subscription or trial
      const isActive = user.subscription_status === 'active' || user.subscription_status === 'trial';
      const hasProduct = user.subscribed_products?.includes(requiredProduct);
      
      // If trial, check if it's still valid
      if (user.subscription_status === 'trial') {
        const trialEnd = new Date(user.trial_end_date);
        const now = new Date();
        
        if (now > trialEnd) {
          // Trial expired
          window.location.href = '/subscribe';
          return;
        }
      }
      
      if (isActive && hasProduct) {
        setHasAccess(true);
      } else {
        window.location.href = '/subscribe';
      }
    } catch (error) {
      console.error('Access check error:', error);
      window.location.href = '/subscribe';
    } finally {
      setLoading(false);
    }
  };

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
        fontFamily: 'Orbitron, monospace',
        fontSize: '1.2rem'
      }}>
        {BETA_MODE ? 'LOADING...' : 'VERIFYING ACCESS...'}
      </div>
    );
  }

  return hasAccess ? children : null;
}