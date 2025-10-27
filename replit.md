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
- **Today's Cosmic Briefing**: AI-powered daily astrological insights (300-400 words) with 3-4 extracted themes, cached in Supabase.
- **Dream Assistant**: Provides dream interpretation and sleep guidance, leveraging user profile and dream journal context.
- **Athena AI**: Offers bio-protocol optimization, science explanations, and habit adjustments, utilizing user profile and active bio-mods context.

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

## External Dependencies
- **Supabase**: Used for authentication (`@supabase/supabase-js`) and as the primary PostgreSQL database.
- **OpenAI API**: Integrated for AI capabilities, powering the Dream Assistant, Athena AI, and the Cosmic Briefing feature.
- **Three.js**: Utilized for 3D graphics rendering and immersive visualizations.
- **Capacitor**: Used for wrapping the web application into native iOS and Android applications (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`).
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Radix UI**: A collection of unstyled, accessible UI components.
- **@tanstack/react-query**: For server state management and caching.
- **React Router DOM**: For client-side routing.