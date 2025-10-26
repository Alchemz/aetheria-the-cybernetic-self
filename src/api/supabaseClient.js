import { createClient } from '@supabase/supabase-js';

// Supabase credentials - loaded from environment variables
// These are injected at build time via vite.config.js from Replit Secrets
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your Replit Secrets.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper functions to match the Base44 auth API
export const auth = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Get current user with profile data
  me: async () => {
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
