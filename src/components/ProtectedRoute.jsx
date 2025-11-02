import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/api/supabaseClient';
import { subscriptionService } from '@/services/subscriptionService';

/**
 * ProtectedRoute - Redirects to upgrade page if user doesn't have active subscription
 * 
 * Free features (no protection needed):
 * - /portal
 * - /synchrony
 * - /wisdom-well
 * 
 * Paid features (protected):
 * - /foundation
 * - /temple
 * - /nexus-frequency-lab
 * - All other features
 */
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Check if user has active subscription
      const user = await auth.me();
      const hasActiveSubscription = user.subscription_status === 'active';
      
      // Also check RevenueCat on native platforms
      const hasRevenueCatAccess = await subscriptionService.hasActiveSubscription();
      
      setHasAccess(hasActiveSubscription || hasRevenueCatAccess);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#000',
        color: '#00FFFF',
        fontFamily: 'Orbitron, monospace',
      }}>
        <div>VERIFYING ACCESS...</div>
      </div>
    );
  }

  if (!hasAccess) {
    // Redirect to upgrade page with return URL
    return <Navigate to="/upgrade" state={{ from: location.pathname }} replace />;
  }

  return children;
}
