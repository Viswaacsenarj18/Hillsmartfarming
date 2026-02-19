/* ============================================================
   CENTRALIZED API CONFIGURATION
   Automatically switches between localhost and Render backend
   PRODUCTION-READY WITH DEBUG LOGGING
============================================================ */

/**
 * SAFE DEBUG: Logs environment variables without exposing secrets
 */
const debugEnv = () => {
  if (typeof window !== 'undefined') {
    console.log('🔍 [API CONFIG DEBUG]');
    console.log('  DEV Mode:', import.meta.env.DEV);
    console.log('  MODE:', import.meta.env.MODE);
    console.log('  Hostname:', window.location.hostname);
    console.log('  VITE_BACKEND_URL exists:', !!import.meta.env.VITE_BACKEND_URL);
    console.log('  NodeEnv:', process.env.NODE_ENV);
  }
};

/**
 * Get the correct API base URL based on environment
 * - Development (localhost): http://localhost:5000
 * - Production (Vercel): https://hillsmartfarming.onrender.com
 */
const getApiBaseUrl = (): string => {
  try {
    // For Vercel production deployment - always use Render backend
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const isVercelProduction = hostname.includes('vercel.app') || hostname.includes('vercel.com');
    
    // Check environment variable first (highest priority)
    const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
    if (envBackendUrl) {
      console.log('✅ Using VITE_BACKEND_URL:', envBackendUrl);
      return envBackendUrl;
    }

    // Development mode uses localhost
    if (import.meta.env.DEV) {
      console.log('✅ Using localhost (DEV mode)');
      return 'http://localhost:5000';
    }

    // For Vercel or any production deployment, use Render backend
    if (isVercelProduction || !import.meta.env.DEV) {
      console.log('✅ Using Render backend (Production)');
      return 'https://hillsmartfarming.onrender.com';
    }

    // Final fallback
    console.warn('⚠️ Using default Render backend (fallback)');
    return 'https://hillsmartfarming.onrender.com';
  } catch (error) {
    console.error('❌ Error in getApiBaseUrl:', error);
    return 'https://hillsmartfarming.onrender.com';
  }
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Build full API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/tractors')
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export { debugEnv };

export default {
  API_BASE_URL,
  getApiUrl,
  debugEnv,
  // Common endpoints
  endpoints: {
    tractors: '/api/tractors',
    registerTractor: '/api/tractors/register',
    getTractor: (id: string) => `/api/tractors/${id}`,
    confirmRental: '/api/tractors/confirm-rental',
  },
};
