import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../config';

// Supabase credentials
// Note: These are public keys - safe to commit (anon key is meant for client-side use)
const supabaseUrl = 'https://azbtiweuzixzqkcrmnwq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YnRpd2V1eml4enFrY3JtbndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDExNTMsImV4cCI6MjA3NzA3NzE1M30.PmpdxGaA9ADUDrOercYHDDN9FeB1nPGwHdAS4pZi4tY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions to match the Base44 auth API
export const auth = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Get current user with profile data
  me: async () => {
    // Demo mode - use localStorage
    if (APP_CONFIG.BYPASS_AUTH) {
      const demoProfile = localStorage.getItem('demo_profile');
      if (demoProfile) {
        return JSON.parse(demoProfile);
      }
      // Return default demo user
      const defaultProfile = {
        id: 'demo-user',
        email: 'demo@innersync.app',
        full_name: 'Demo User',
        birth_date: '',
        birth_time: '',
        birth_location: '',
        subscription_status: 'active',
        subscribed_products: ['heartwave'],
        subscription_type: 'demo',
        trial_start_date: null,
        trial_end_date: null,
        has_used_trial: false,
        active_bio_mods: [],
      };
      localStorage.setItem('demo_profile', JSON.stringify(defaultProfile));
      return defaultProfile;
    }

    // Normal mode - use Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    // Combine auth user with profile data
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      birth_date: profile?.birth_date || '',
      birth_time: profile?.birth_time || '',
      birth_location: profile?.birth_location || '',
      subscription_status: profile?.subscription_status || 'inactive',
      subscribed_products: profile?.subscribed_products || [],
      subscription_type: profile?.subscription_type || null,
      trial_start_date: profile?.trial_start_date || null,
      trial_end_date: profile?.trial_end_date || null,
      has_used_trial: profile?.has_used_trial || false,
      active_bio_mods: profile?.active_bio_mods || [],
    };
  },

  // Update user profile
  updateMe: async (updates) => {
    // Demo mode - use localStorage
    if (APP_CONFIG.BYPASS_AUTH) {
      const demoProfile = localStorage.getItem('demo_profile');
      const currentProfile = demoProfile ? JSON.parse(demoProfile) : {
        id: 'demo-user',
        email: 'demo@innersync.app',
        full_name: 'Demo User',
        subscription_status: 'active',
        subscribed_products: ['heartwave'],
        subscription_type: 'demo',
        active_bio_mods: [],
      };
      
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('demo_profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    }

    // Normal mode - use Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update profile in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Sign out
  logout: async () => {
    await supabase.auth.signOut();
    window.location.href = '/portal';
  },

  // Redirect to login
  redirectToLogin: (returnUrl = null) => {
    const path = returnUrl ? `/login?return=${encodeURIComponent(returnUrl)}` : '/login';
    window.location.href = path;
  },

  // Sign up with email/password
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth provider (Google, GitHub, etc.)
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) throw error;
    return data;
  },

  // Send magic link
  signInWithMagicLink: async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) throw error;
    return data;
  },
};
