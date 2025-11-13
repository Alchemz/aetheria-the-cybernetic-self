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
- **Foundation (Dreamscape) Design**: Minimalist header with floating, glassmorphic circular icons (Home, Account) that glow on hover. Features 3 navigation panels: Resonator (audio frequencies), Sanctuary (Dream Assistant), and Library (sleep courses).

### Technical Implementations
- **Frontend**: Vite + React (JavaScript/JSX) with Tailwind CSS and Radix UI.
- **3D Graphics**: Three.js for immersive visualizations (e.g., "Sovereign Galaxy," Nexus Pineal Atrium).
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
- **Dream Assistant**: AI for dream interpretation and sleep guidance with voice input support:
  - **Web Platform**: Uses Web Speech API (`SpeechRecognition`) for real-time speech-to-text, configured with `continuous: false` and `interimResults: false` to capture actual speech (not rhythm detection)
  - **Native Platform**: Integrates Capacitor Voice Recorder for native audio capture on iOS/Android
  - **Visual Feedback**: Pulsing mic button animation (`.chat-mic-button.recording` class) provides clear visual indication of listening state
  - **Error Handling**: Comprehensive permission handling, microphone access checks, and user-friendly error messages
  - **Permissions**: Info.plist includes NSMicrophoneUsageDescription and NSSpeechRecognitionUsageDescription for iOS
- **Athena AI**: AI for bio-protocol optimization, science explanations, and habit adjustments.
- **Resonator & Meditation Chamber**: Audio libraries with healing frequencies and guided meditations, supporting background playback.
- **Pineal Atrium (Brain Visualization)**: An interactive 3D brain anatomy explorer within Nexus (`/nexus-pineal-atrium`) featuring wireframe brain images, glowing markers for 8 anatomical regions (pineal gland, prefrontal cortex, hippocampus, thalamus, amygdala, corpus callosum), and comprehensive camera controls. Enhanced with:
  - **Performance Optimizations**: Animation gating (pauses when tab hidden), ResizeObserver for responsive sizing, comprehensive cleanup (disposes geometries/materials/textures)
  - **Advanced Touch Controls**: Pinch zoom support (two-finger distance calculation, 0.01 sensitivity, 2-7 range), tap detection with both distance (<10px) and duration (<300ms) thresholds, `touchAction: 'none'` to prevent browser interference
  - **Smooth Camera Controls**: Lerped zoom animation (0.05 lerp factor), Reset View button, wheel zoom with smooth easing
  - **WebGL Error Handling**: Graceful fallback UI with helpful troubleshooting message when WebGL is unavailable
  - **Interactive Features**: Hover/click to view region info cards with scientific explanations, esoteric meanings, and optimization practices; side panel with detailed region information
  - **Visual Design**: Purple/pink theme (#BA55D3), glowing region markers with pulsing animations, neural connection particles, wireframe brain imagery from Supabase storage

### System Design Choices
- **Secure Client-Server Architecture**: Frontend on Port 5000, Backend on Port 3000 (dev) or 5000 (prod), with frontend proxying API requests.
- **Supabase Integration**: Used for authentication and PostgreSQL database (`profiles`, `cosmic_briefings` tables) with Row Level Security.
- **Environment Variables**: Managed via Replit Secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, `VITE_REVENUECAT_API_KEY`).
- **Monetization**: Subscription-based access via RevenueCat, with free features (Portal, Synchrony, Wisdom Well) and paid features (Foundation, Temple, Nexus, Meditation Chamber, AI features). Upgrade page (`/upgrade`) handles purchase flow and displays offerings.
- **Capacitor Configuration**: `capacitor.config.ts` defines App ID and Name. Includes iOS background audio support (Info.plist, AppDelegate.swift), safe area support, and voice/microphone permissions (NSMicrophoneUsageDescription, NSSpeechRecognitionUsageDescription). Custom chakra-themed app icon generated via `@capacitor/assets`. Voice input powered by `capacitor-voice-recorder` for native platforms.
- **Backend Deployment**: Express backend deployed to Replit's autoscale platform, configured to serve API and static files from `dist/` on port 5000 in production, with environment-based API endpoint switching.
- **Native Mobile App Behavior**: Viewport configured with `maximum-scale=1, user-scalable=no` to prevent pinch-zoom and double-tap zoom. Global CSS includes `touch-action: manipulation` to disable browser zoom gestures while preserving normal scrolling and tapping. Input fields use minimum 16px font size to prevent iOS auto-zoom. App behaves like a native mobile application across all platforms.
- **Safe Area Implementation**: 
  - **Viewport Meta Tag**: `viewport-fit=cover` in `index.html` enables full-screen rendering with safe area support
  - **Global CSS Variables**: (`--safe-area-top`, `--safe-area-bottom`, `--safe-area-left`, `--safe-area-right`) defined in `src/index.css` wrap `env(safe-area-inset-*)` to handle iPhone notches and home indicators
  - **Consistent Application**: All pages use these centralized variables via `calc()` for consistent padding/positioning offsets, ensuring content never overlaps with device UI on iPhone 6.7" and other devices with notches
  - **Applied To**: All immersive pages (Portal, Synchrony, Foundation, Temple, Nexus carousel, Nexus sub-pages, Pineal Atrium, Wisdom Well, Account, Upgrade)
  - **Specific Implementations**:
    - Synchrony: HUD container uses safe-area-aware padding on all sides (padding-top/bottom/left/right with calc() and safe area variables), overflow-y scrolling enabled for tall content, justify-content flex-start prevents vertical centering cut-off, lobby/meditation containers have proper margins and reduced gaps for mobile
    - Nexus: Header uses padding-top with safe area variable
    - Temple: TempleLayout component provides persistent safe area wrapper for all Temple routes (/heartwave, /heartwave-protocols, /heartwave-athena, /heartwave-console). Uses nested routing with <Outlet/> to prevent safe area reset during navigation. Centralizes Three.js background, bottom navigation, and StatusBar control (conditionally imported on native platforms only via `window.Capacitor?.isNativePlatform()`). Applies safe area padding exactly once via `.safe-page.temple-page` class.
    - Pineal Atrium: Controls, instructions, and side panel all account for safe area insets

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