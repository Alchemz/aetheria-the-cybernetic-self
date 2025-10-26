# INNERSYNC - Wellness & Meditation Platform

## Overview
INNERSYNC is a Vite + React meditation and wellness platform featuring 3D graphics, audio playback, biohacking tools, and personalized content. Originally built with Base44 authentication, now migrated to Supabase for independent hosting and future native iOS development.

## Project Type
- **Frontend**: Vite + React (JavaScript/JSX)
- **UI Framework**: Tailwind CSS + Radix UI components
- **3D Graphics**: Three.js for immersive visualizations
- **State Management**: @tanstack/react-query
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth (formerly Base44)
- **Database**: Supabase PostgreSQL

## Recent Changes
**Date**: October 26, 2025

### Supabase Migration
Successfully migrated from Base44 authentication to Supabase:
1. **Removed Base44 SDK**: Uninstalled `@base44/sdk` package
2. **Installed Supabase**: Added `@supabase/supabase-js`
3. **Created Supabase Client**: New `src/api/supabaseClient.js` with auth helper functions
4. **Updated All Auth Calls**: Replaced `base44.auth` with `auth` across all pages and components
5. **Environment Configuration**: Configured Supabase credentials via Replit Secrets
6. **Preserved Demo Mode**: BYPASS_AUTH flag still available for local development

### Files Modified
- `src/api/supabaseClient.js` - NEW: Supabase client and auth helpers
- `src/api/base44Client.js` - DELETED
- `src/api/integrations.js` - Stubbed out (needs replacement with your OpenAI integration)
- All pages updated: `portal.jsx`, `account.jsx`, `subscribe.jsx`, `foundation.jsx`, `heartwave-*.jsx`, `nexus-*.jsx`, `synchrony.jsx`, `admin-setup.jsx`
- `src/components/SubscriptionGuard.jsx` - Updated for Supabase
- `vite.config.js` - Added environment variable injection

## Setup History
**Date**: October 26, 2025

### Initial Import Fixes
1. Fixed JavaScript syntax errors:
   - Replaced hyphenated variable names with camelCase
   - Capitalized React component imports
2. Installed missing dependencies: `three`, `@tanstack/react-query`
3. Configured Vite for Replit (host: 0.0.0.0, port: 5000, allowedHosts: true)

## Workflow Configuration
- **Name**: Server
- **Command**: `npm run dev`
- **Port**: 5000
- **Type**: Webview (Frontend preview)

## Authentication

### Current State: Supabase Auth (Demo Mode Active)
The app now uses **Supabase** for authentication, but BYPASS_AUTH is still enabled for development.

**Configuration**: `src/config.js`
```javascript
{
  DEMO_MODE: true,
  BETA_MODE: true,
  BYPASS_AUTH: true  // ← Set to false to enable real Supabase auth
}
```

### Supabase Setup Required
To complete the migration, you need to:

1. **Create Database Schema** in your Supabase project:
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  birth_date TEXT,
  birth_time TEXT,
  birth_location TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscribed_products TEXT[],
  subscription_type TEXT,
  trial_start_date TIMESTAMP,
  trial_end_date TIMESTAMP,
  has_used_trial BOOLEAN DEFAULT FALSE,
  active_bio_mods TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

2. **Create Login Page** (`src/pages/login.jsx`) with:
   - Email/password sign in
   - Sign up form
   - Magic link (passwordless) option
   - OAuth providers (Google, GitHub, etc.)

3. **Enable Authentication Methods** in Supabase Dashboard:
   - Email/Password: Settings → Authentication → Email
   - Magic Links: Enable "Enable email confirmations"
   - OAuth (optional): Configure Google/GitHub providers

### Production Mode
To enable real authentication:
1. Set `BYPASS_AUTH: false` in `src/config.js`
2. Create login page (see above)
3. Configure Supabase auth methods
4. Test signup/login flow

## Integration Notes

### OpenAI / LLM Integration
The `src/api/integrations.js` file currently has placeholder exports for:
- `InvokeLLM` - Used in HeartWave Athena (AI chat)
- Other Base44 integrations (SendEmail, UploadFile, etc.)

**TODO**: Replace with your own OpenAI agent workflow

### Future: Native iOS App
This codebase is designed to be converted to a native iOS app using **Capacitor** (not React Native):
- Capacitor allows minimal code changes
- Wraps the React web app in a native container
- Provides access to native iOS APIs (camera, push notifications, etc.)
- Easier path to App Store publication

## Environment Variables
Managed via Replit Secrets:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Note**: These are currently hardcoded in `supabaseClient.js` for development. For production, use proper environment variable injection.

## Key Files
- `vite.config.js` - Vite configuration
- `src/config.js` - App-wide configuration flags
- `src/api/supabaseClient.js` - Supabase client and auth helpers
- `src/api/integrations.js` - Placeholder for integrations (needs replacement)
- `src/pages/index.jsx` - Main routing configuration
- `package.json` - Dependencies and scripts

## Project Structure
```
src/
├── api/              # Supabase client and integration functions
├── components/       # Reusable UI components (Radix UI)
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Page components (routes)
├── utils/            # Helper utilities
├── App.jsx           # Root application component
└── main.jsx          # Application entry point
```

## Running the App
```bash
npm install
npm run dev
```

## Building for Production
```bash
npm run build
npm run preview
```

## User Preferences
- **Design Aesthetic**: Less intrusive, minimal "Matrix-like" authentication
- **Future Goal**: Convert to native iOS app for App Store
- **Approach**: Capacitor (not React Native) for mobile conversion
