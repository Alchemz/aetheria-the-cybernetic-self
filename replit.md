# INNERSYNC - Wellness & Meditation Platform

## Overview
INNERSYNC is a meditation and wellness platform built with Vite and React, offering an immersive and personalized wellness experience. It features 3D graphics, audio playback, biohacking tools, and AI-powered personalized content. Key capabilities include interactive guided breathing, AI-driven cosmic briefings, and user-specific bio-mods. The platform aims to deliver a cutting-edge digital wellness solution, leveraging advanced frontend technologies and AI, and is configured for native iOS and Android deployment via Capacitor.

## User Preferences
- **Design Aesthetic**: Less intrusive, minimal "Matrix-like" authentication
- **Future Goal**: Convert to native iOS app for App Store
- **Approach**: Capacitor (not React Native) for mobile conversion

## System Architecture

### UI/UX Decisions
- **The Synchrony Redesign**: Features a cyan aesthetic (`#00FFFF`), card-based pre-session lobby, animated pulsing circles for box breathing, and a breath visualizer bar for Aum toning. A 3D particle field ("Sovereign Galaxy") visualizes connected users.
- **Portal as Landing Page**: The default landing page is Portal, prioritizing 3D graphics for initial user experience.
- **Foundation (Dreamscape) Design**: Minimalist header with floating, glassmorphic circular icons (Home, Account) that glow on hover. Includes Pineal Atrium (Panel 4), an interactive 3D brain anatomy visualization.

### Technical Implementations
- **Frontend**: Vite + React (JavaScript/JSX) with Tailwind CSS and Radix UI.
- **3D Graphics**: Three.js for immersive visualizations (e.g., "Sovereign Galaxy," Pineal Atrium).
- **State Management**: @tanstack/react-query for data fetching.
- **Routing**: React Router DOM.
- **Authentication**: Supabase Auth for user management and demo mode.
- **AI Integration**: OpenAI's `gpt-4o-mini` for AI assistants (Dream Assistant, Athena AI) and Cosmic Briefing, managed via a secure Express.js backend.
- **Backend**: Express.js (`server.js`) handles secure OpenAI API calls and serves the frontend in production.
- **Mobile Deployment**: Capacitor for native iOS and Android deployment, running the React web app in native containers.
- **Audio Hosting**: Backblaze B2 for audio files in Resonator and Meditation Chamber.
- **In-App Purchases**: RevenueCat integrated for cross-platform subscriptions.

### Feature Specifications
- **Synchrony Global Meditation**: Guided box breathing and Aum toning with auto-progression and synchronized 3D effects, daily at 11 PM Japan time.
- **Wisdom Well**: A spiritual knowledge library with 10 expandable wisdom threads, accessed via an Ankh symbol, featuring a cyan aesthetic and animated glows.
- **Today's Cosmic Briefing**: AI-powered daily astrological insights (300-400 words) with extracted themes, cached in Supabase.
- **Dream Assistant**: AI for dream interpretation and sleep guidance.
- **Athena AI**: AI for bio-protocol optimization, science explanations, and habit adjustments.
- **Resonator & Meditation Chamber**: Audio libraries with healing frequencies and guided meditations, supporting background playback.
- **Pineal Atrium (Brain Visualization)**: An interactive 3D brain anatomy explorer within Foundation (Panel 4) featuring a 3D brain model, glowing markers for 7 anatomical regions, interactive info cards, and camera controls for desktop and mobile.

### System Design Choices
- **Secure Client-Server Architecture**: Frontend on Port 5000, Backend on Port 3000 (dev) or 5000 (prod), with frontend proxying API requests.
- **Supabase Integration**: Used for authentication and PostgreSQL database (`profiles`, `cosmic_briefings` tables) with Row Level Security.
- **Environment Variables**: Managed via Replit Secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, `VITE_REVENUECAT_API_KEY`).
- **Monetization**: Subscription-based access via RevenueCat, with free features (Portal, Synchrony, Wisdom Well) and paid features (Foundation, Temple, Nexus, Meditation Chamber, AI features). Upgrade page (`/upgrade`) handles purchase flow and displays offerings.
- **Capacitor Configuration**: `capacitor.config.ts` defines App ID and Name. Includes iOS background audio support (Info.plist, AppDelegate.swift), safe area support, and voice/microphone permissions (NSMicrophoneUsageDescription, NSSpeechRecognitionUsageDescription). Custom chakra-themed app icon generated via `@capacitor/assets`.
- **Backend Deployment**: Express backend deployed to Replit's autoscale platform, configured to serve API and static files from `dist/` on port 5000 in production, with environment-based API endpoint switching.

## External Dependencies
- **Supabase**: Authentication and PostgreSQL database.
- **OpenAI API**: AI capabilities (Dream Assistant, Athena AI, Cosmic Briefing).
- **Three.js**: 3D graphics rendering.
- **Capacitor**: Native iOS and Android application wrapping.
- **RevenueCat**: Cross-platform subscription management.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Unstyled, accessible UI components.
- **@tanstack/react-query**: Server state management.
- **React Router DOM**: Client-side routing.