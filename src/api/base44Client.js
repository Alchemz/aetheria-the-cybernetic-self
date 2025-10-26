import { createClient } from '@base44/sdk';
import { APP_CONFIG } from '@/config';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create base client
const baseClient = createClient({
  appId: "68d4574bc126933aed677cd7", 
  requiresAuth: !APP_CONFIG.BYPASS_AUTH
});

// Create mock auth object for bypass mode
const mockAuth = {
  isAuthenticated: async () => true,
  me: async () => ({
    full_name: 'Demo User',
    email: 'demo@example.com',
    subscription_status: 'active',
    subscribed_products: []
  }),
  updateMe: async (data) => ({ ...data }),
  logout: () => { window.location.href = '/portal'; },
  redirectToLogin: () => { console.log('Login redirect bypassed in demo mode'); }
};

// Export client with conditional auth
export const base44 = APP_CONFIG.BYPASS_AUTH ? {
  ...baseClient,
  auth: mockAuth
} : baseClient;
