# INNERSYNC - Wellness & Meditation Platform

## Overview
INNERSYNC is a meditation and wellness platform built with Vite and React, featuring 3D graphics, audio playback, biohacking tools, and personalized content. Its core purpose is to provide an immersive and personalized wellness experience. The platform includes interactive guided breathing protocols, AI-powered daily cosmic briefings, and integrates user-specific bio-mods for personalized guidance. Key capabilities include a redesigned global meditation page ("The Synchrony Redesign") with dynamic visuals and an AI-powered "Today's Cosmic Briefing" feature using OpenAI. The project aims to deliver a cutting-edge digital wellness solution, leveraging advanced frontend technologies and AI for a unique user experience. It has also been configured for native iOS and Android deployment via Capacitor, positioning it for expansion into mobile app stores.

## User Preferences
- **Design Aesthetic**: Less intrusive, minimal "Matrix-like" authentication
- **Future Goal**: Convert to native iOS app for App Store
- **Approach**: Capacitor (not React Native) for mobile conversion

## System Architecture

### UI/UX Decisions
- **The Synchrony Redesign**: Features a cyan aesthetic (`#00FFFF`) with a compact card-based pre-session lobby. Incorporates animated pulsing circles for box breathing and a breath visualizer bar for Aum toning, with radiating wave effects. A 3D particle field ("Sovereign Galaxy") visualizes connected users.
- **Portal as Landing Page**: The default landing page is now Portal, featuring 3D graphics as the initial user experience.

### Technical Implementations
- **Frontend**: Vite + React (JavaScript/JSX) with Tailwind CSS and Radix UI components for styling.
- **3D Graphics**: Three.js is used for immersive visualizations, including the "Sovereign Galaxy" particle field.
- **State Management**: @tanstack/react-query for data fetching and caching.
- **Routing**: React Router DOM.
- **Authentication**: Supabase Auth, replacing a previous Base44 implementation. Includes user profile management and supports demo mode.
- **AI Integration**: Uses OpenAI's `gpt-4o-mini` model for AI assistants (Dream Assistant and Athena AI) with streaming support. OpenAI API calls are managed via a secure backend.
- **Backend**: Express.js API server (`server.js`) handles secure OpenAI API calls, protecting API keys and providing streaming responses.
- **Mobile Deployment**: Configured for native iOS and Android deployment using Capacitor, enabling the existing React web app to run in native containers with access to device APIs.
- **Cosmic Briefing**: Utilizes OpenAI (GPT-4o-mini) to generate daily astrological briefings, extracting key themes and employing a caching system with Supabase.

### Feature Specifications
- **Synchrony Global Meditation**: Guided box breathing (4-4-4-4 rhythm) for 2 minutes, followed by Aum toning (10s inhale, 15s exhale), with auto-progression and synchronized 3D particle effects. Sessions are daily at 11 PM Japan time for 15 minutes.
- **Wisdom Well**: Spiritual knowledge library featuring 10 expandable wisdom threads from various traditions (Hermetic Principles, Christ Consciousness, Buddha's Path, Yoga Sutras, Bhagavad Gita, Emerald Tablet, Tao Te Ching, Krishna Stories, Gnostic Gospels, Jungian Archetypes). Accessed via left-side portal button with Ankh symbol (☥). Matches Synchrony's cyan aesthetic (#4A9EFF, #00FFFF) with animated glow effects. Each thread expands to reveal full formatted teachings in a clean, scrollable card interface.
- **Today's Cosmic Briefing**: AI-powered daily astrological insights (300-400 words) with 3-4 extracted themes, cached in Supabase.
- **Dream Assistant**: Provides dream interpretation and sleep guidance, leveraging user profile and dream journal context.
- **Athena AI**: Offers bio-protocol optimization, science explanations, and habit adjustments, utilizing user profile and active bio-mods context.
- **Resonator (Audio Library)**: Features 6 categories of healing frequencies (Deep Sleep, Lucid Dreaming, Chakra Alignment, Astral Projection, Theta Waves, Solfeggio) with downloadable MP3s and iOS-specific background playback support. Audio files hosted on Backblaze B2.
- **Meditation Chamber & Healing Lab**: Four categories of audio content (Guided Meditations, Heart Coherence, Healing Frequencies, Focus) with download functionality and iOS background playback support. Includes 11 total tracks with 3D particle field visualization. All audio hosted on Backblaze B2.

### System Design Choices
- **Secure Client-Server Architecture**: Frontend (Vite/React) on Port 5000, Backend (Express.js) on Port 3000. Frontend proxies API requests to the backend to protect API keys.
- **Supabase Integration**: Used for authentication and database (PostgreSQL). Includes `profiles` and `cosmic_briefings` tables with Row Level Security and a trigger for automatic profile creation on user signup.
- **Environment Variables**: Managed via Replit Secrets for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `OPENAI_API_KEY`.
- **Workflow Configuration**: `npm run dev:all` script to run both frontend and backend concurrently.

### Capacitor Native Mobile Setup
**Configuration**: `capacitor.config.ts` defines App ID (`com.innersync.app`), App Name (`INNERSYNC`), and web directory (`dist`).

**Prerequisites**:
- iOS: macOS + Xcode + CocoaPods
- Android: Android Studio + Java SDK (any OS)

**Native Project Locations**:
- iOS: `/ios` directory (Xcode project)
- Android: `/android` directory (Android Studio project)
- Web build: `/dist` (synced to both platforms)

**Build & Sync Workflow**:
1. Edit React code in `/src`
2. Build: `npm run build` (creates `/dist`)
3. Sync: `npx cap sync` (copies to `/ios` and `/android`)
4. Open IDE: `npm run cap:open:ios` or `npm run cap:open:android`

**Quick Commands**:
- `npm run ios` - Build + sync + open Xcode
- `npm run android` - Build + sync + open Android Studio
- `npm run cap:build` - Build web app + sync to native
- `npm run cap:sync` - Sync existing build to native
- See `DEPLOYMENT.md` for App Store/Play Store submission

**iOS Background Audio Configuration**:
- **Info.plist**: Configured with `UIBackgroundModes` array containing `audio` for background playback support
- **AppDelegate.swift**: Audio session configured with `AVAudioSessionCategoryPlayback` to enable background audio, lock screen playback, and audio continuation with silent switch ON
- **Safe Area Support**: Added `viewport-fit=cover` and `env(safe-area-inset-*)` CSS for iPhone notch/Dynamic Island compatibility across Foundation, Portal, Temple, and Synchrony pages

**App Icon & Branding**:
- **Custom Icon**: Chakra-themed icon with vertically stacked glowing spheres (purple, blue, green, yellow, orange, red) on dark background
- **Icon Generation**: Uses `@capacitor/assets` to automatically generate all required sizes for iOS and Android from source image in `/resources/icon.png`
- **Asset Locations**: iOS icons in `/ios/App/App/Assets.xcassets/AppIcon.appiconset/`, Android adaptive icons in `/android/app/src/main/res/mipmap-*/`
- **Web Favicon**: Updated `index.html` to use custom icon at `/public/icon.png` with apple-touch-icon support
- **Regeneration Command**: `npx capacitor-assets generate --iconBackgroundColor '#000000' --iconBackgroundColorDark '#000000' --ios --android`

**Backend Deployment for Native App Support**:
- **Replit Autoscale Deployment**: The Express backend (`server.js`) is configured for deployment to Replit's autoscale platform
  - **Run Command**: `node server.js` (automatically runs in production mode)
  - **Build Command**: `npm run build` (builds the Vite frontend to `dist/` folder)
  - **Port Configuration**: Server listens on port 5000 in production, serves both API and static files
  - **Pricing**: $1/month base + pay-per-use (typically $2-5/month, covered by Core plan credits)
  - **Features**: Auto-scaling, HTTPS by default, secrets management built-in
- **Server Configuration**:
  - **Development**: Runs on port 3000, works with Vite dev server on port 5000
  - **Production**: Runs on port 5000, serves built static files from `dist/` folder
  - **Environment Detection**: Uses `NODE_ENV=production` to switch modes automatically
  - **SPA Support**: All non-API routes (`/portal`, `/foundation`, etc.) serve `index.html` in production
- **API Configuration**: Environment-based endpoint switching (`src/api/config.js`)
  - Development (web): Uses Vite proxy to `localhost:3000`
  - Production (web): Uses deployed backend URL from `VITE_API_URL`
  - Native (iOS/Android): Uses deployed backend URL from `VITE_API_URL`
- **Deployment Steps**:
  1. Click "Publish" button at top of Replit workspace (or search "Publishing" in command bar)
  2. Choose "Autoscale" deployment option
  3. Configure: 1vCPU, 2 GiB RAM, max machines as needed
  4. Verify run command is `node server.js` and build command is `npm run build`
  5. Click "Publish" to deploy
  6. Copy your deployment URL (e.g., `https://innersync-username.replit.app`)
  7. Add to Replit Secrets: `VITE_API_URL=<your-deployment-url>`
  8. For native app: Run `npm run cap:build` to rebuild with new API URL
- **AI Features in Native App**: All AI features (Cosmic Briefing, Dream Assistant, Athena AI) work in native mode when backend is deployed
- **Secrets Management**: All secrets (`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`) automatically carry over from Replit development environment to deployment

## External Dependencies
- **Supabase**: Used for authentication (`@supabase/supabase-js`) and as the primary PostgreSQL database.
- **OpenAI API**: Integrated for AI capabilities, powering the Dream Assistant, Athena AI, and the Cosmic Briefing feature.
- **Three.js**: Utilized for 3D graphics rendering and immersive visualizations.
- **Capacitor**: Used for wrapping the web application into native iOS and Android applications (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`).
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Radix UI**: A collection of unstyled, accessible UI components.
- **@tanstack/react-query**: For server state management and caching.
- **React Router DOM**: For client-side routing.