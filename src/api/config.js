import { Capacitor } from '@capacitor/core';

/**
 * API Configuration
 * Handles environment-based API endpoint configuration
 * - Development (web): Uses Vite proxy to localhost:3000
 * - Production (web): Uses deployed backend URL
 * - Native (iOS/Android): Uses deployed backend URL
 */

const getApiBaseUrl = () => {
  const isNative = Capacitor.isNativePlatform();
  const isProduction = import.meta.env.PROD;

  // Native apps always use the deployed backend
  if (isNative) {
    // Production Firebase URL
    return import.meta.env.VITE_API_URL || 'https://innersync-2bbd1.web.app';
  }

  // Production web build uses relative path (served by same origin)
  if (isProduction) {
    return import.meta.env.VITE_API_URL || '';
  }

  // Development uses Vite proxy (proxies to localhost:3000)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  cosmicBriefing: `${API_BASE_URL}/api/cosmic-briefing`,
  dreamAssistant: `${API_BASE_URL}/api/dream-assistant`,
  athenaAssistant: `${API_BASE_URL}/api/athena-assistant`,
};

console.log('🔧 API Config:', {
  isNative: Capacitor.isNativePlatform(),
  isProduction: import.meta.env.PROD,
  baseUrl: API_BASE_URL,
});
