# Base44 App - Replit Configuration

## Overview
This is a Vite + React application that connects to the Base44 API. The app provides a meditation/wellness platform with various features including audio playback, cosmic libraries, biohacking tools, and subscription management.

## Project Type
- **Frontend**: Vite + React (TypeScript/JavaScript)
- **UI Framework**: Tailwind CSS + Radix UI components
- **3D Graphics**: Three.js
- **State Management**: @tanstack/react-query
- **Routing**: React Router DOM
- **API Integration**: @base44/sdk

## Setup History
**Date**: October 26, 2025

### Initial Import Fixes
1. Fixed JavaScript syntax errors in `src/pages/index.jsx`:
   - Replaced hyphenated variable names (e.g., `nexus-frequency-lab`) with camelCase (e.g., `nexusFrequencyLab`)
   - Capitalized all React component imports and references to follow React naming conventions
   
2. Installed missing dependencies:
   - `three` - 3D graphics library
   - `@tanstack/react-query` - Data fetching/caching library

3. Configured Vite development server:
   - Host: `0.0.0.0` (required for Replit proxy)
   - Port: `5000` (Replit's standard web port)
   - Allowed hosts: `true` (required for Replit iframe preview)

## Workflow Configuration
- **Name**: Server
- **Command**: `npm run dev`
- **Port**: 5000
- **Type**: Webview (Frontend preview)

## Deployment Configuration
- **Target**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: `npx vite preview --host 0.0.0.0 --port 5000`

## Authentication
The app uses Base44 SDK for authentication. Users must be logged in through the Base44 platform to access most features. The 401 authentication errors in console are expected for unauthenticated users.

## Key Files
- `vite.config.js` - Vite configuration with proxy settings
- `src/pages/index.jsx` - Main routing configuration
- `src/api/base44Client.js` - Base44 SDK client initialization
- `package.json` - Dependencies and scripts
- `.gitignore` - Git ignore configuration

## Project Structure
```
src/
├── api/              # Base44 API client and integration functions
├── components/       # Reusable UI components (Radix UI)
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Page components (routes)
├── utils/            # Helper utilities
├── App.jsx           # Root application component
└── main.jsx          # Application entry point
```

## Environment Requirements
- Node.js 20.x
- npm (package manager)

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
