# 🚀 Production Debugging Guide - White Screen Issue

## Common Causes for White Screen in Vite Production

1. **React Root Element Not Found** - `<div id="root">` missing in index.html
2. **Runtime JavaScript Errors** - Uncaught exceptions prevent rendering
3. **Import Path Issues** - File names with wrong casing (Linux is case-sensitive)
4. **Environment Variables Undefined** - `import.meta.env` not set in Vercel
5. **API Call Failures** - Network errors on initial render
6. **React Router Issues** - Missing routes or redirect loops
7. **Module Import Errors** - Missing dependencies or circular imports
8. **CORS Errors** - Backend rejecting requests from frontend
9. **CSS/Asset Loading Issues** - Missing stylesheets or images
10. **i18n Initialization Error** - Translation library not loading

---

## 🔍 Browser DevTools Debugging Steps

### Step 1: Open Browser Console
```
Windows/Linux: F12 or Ctrl+Shift+I
Mac: Cmd+Option+I
```

### Step 2: Check for JavaScript Errors
Look for **RED ERROR MESSAGES** - These are critical to fixing the white screen.

### Step 3: Check Network Tab
- Click **Network** tab
- Reload page (Ctrl+Shift+R for hard refresh)
- Look for failed requests (red status codes)
- Check particularly:
  - `index.html` - should be 200
  - `.js` files - should be 200
  - API calls - check CORS issues

### Step 4: Check Console Warnings
```javascript
// You should see these debug logs:
🚀 HillSmart App Starting...
🔍 [API CONFIG DEBUG]
✅ Using Render backend (Production)
```

### Step 5: Test Environment Variables
Paste this in browser console:
```javascript
// Check if environment is loading
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
console.log('DEV Mode:', import.meta.env.DEV);
console.log('MODE:', import.meta.env.MODE);
```

### Step 6: Test Root Element
```javascript
// Check if React root element exists
const root = document.getElementById('root');
console.log('Root element:', root ? '✅ FOUND' : '❌ NOT FOUND');
console.log('Root HTML:', root?.innerHTML);
```

### Step 7: Test API Connection
```javascript
// Test backend connectivity
fetch('https://hillsmartfarming.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log('✅ Backend response:', d))
.catch(e => console.error('❌ Backend error:', e));
```

---

## 🔧 Production-Ready Code Snippets

### Safe Environment Variable Logging
```typescript
// src/config/api.ts - Already implemented

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

// Safe to paste in console - no secrets exposed!
```

### Safe Error Logging
```typescript
// src/main.tsx - Already implemented

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('❌ Uncaught Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
});
```

---

## 🔐 CORS Configuration for Production

### Backend Configuration (server.js)
```javascript
// Already improved - Now supports multiple origins:
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://hillsmartfarming.vercel.app",
  "https://viswaacproject-elcmaxilw-viswaacsenars-projects.vercel.app"
];
```

### Frontend Configuration (api.ts)
```typescript
// Already centralized - No hardcoded URLs!
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Usage in components:
const res = await fetch(getApiUrl('/api/auth/login'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form)
});
```

### Fetch with Error Handling
```typescript
// Safe fetch wrapper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const url = getApiUrl(endpoint);
    console.log(`📡 Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ API Error on ${endpoint}:`, error);
    throw error;
  }
}
```

---

## 📋 Production Checklist

### ✅ Frontend Vercel Deployment

- [x] **vercel.json Configured**
  - ✅ `buildCommand: npm run build`
  - ✅ `outputDirectory: dist`
  - ✅ `framework: vite`
  - ✅ SPA routes configured (all paths → index.html)

- [x] **Environment Variables Set**
  - ✅ Go to Vercel Dashboard
  - ✅ Settings → Environment Variables
  - ✅ Add: `VITE_BACKEND_URL` = `https://hillsmartfarming.onrender.com`

- [x] **Git and Build**
  - ✅ `git add .` and `git commit`
  - ✅ `git push origin main`
  - ✅ Wait for Vercel auto-deploy

- [x] **Testing**
  - ✅ Open browser console (F12)
  - ✅ Look for gray log messages (no red errors)
  - ✅ See "✅ Using Render backend (Production)"

### ✅ Backend Render Deployment

- [x] **render.yaml Configured**
  - ✅ `rootDir: backend`
  - ✅ `buildCommand: npm install`
  - ✅ `startCommand: npm start`

- [x] **Environment Variables Set**
  - ✅ Go to Render Dashboard
  - ✅ Environment → Add variables:
    - MONGO_URI
    - PORT (5000)
    - HOST (0.0.0.0)
    - EMAIL_USER
    - EMAIL_PASSWORD
    - OPENROUTER_API_KEY

- [x] **CORS Configured**
  - ✅ Backend accepts requests from Vercel URLs
  - ✅ `Access-Control-Allow-Origin` headers set
  - ✅ Preflight OPTIONS requests handled

### ✅ Code Quality

- [x] **No Hardcoded URLs**
  - ✅ Use `getApiUrl()` from `@/config/api`
  - ✅ Check Login.tsx, Signup.tsx, Chatbot.tsx
  - ✅ No `http://localhost:5000` in production code

- [x] **Error Handling**
  - ✅ Try-catch blocks on fetch calls
  - ✅ Error listeners in main.tsx
  - ✅ Console debug logging on startup

- [x] **i18n Configuration**
  - ✅ No duplicate translation keys
  - ✅ All language sections have same keys
  - ✅ Build doesn't show esbuild errors

---

## 🚨 If White Screen Persists

### Immediate Actions

1. **Hard Refresh**
   ```
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
   ```

2. **Check Console (F12)**
   - Copy any RED ERROR MESSAGES
   - Screenshot and share

3. **Test Backend**
   ```javascript
   // In browser console:
   fetch('https://hillsmartfarming.onrender.com/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@test.com', password: 'test' })
   }).then(r => r.json()).then(d => console.log(d));
   ```

4. **Check Vercel Logs**
   - Vercel Dashboard → Deployments
   - Click latest deployment
   - Check Build Logs and Runtime Logs

5. **Check Render Logs**
   - Render Dashboard → Backend Service
   - Click Logs tab
   - Look for errors

### Advanced Debugging

#### Check if HTML Renders
```javascript
// In browser console:
document.body.innerHTML  // See what's actually rendered
```

#### Check for CSS Issues
```javascript
// If everything is hidden by CSS:
document.body.style.display = 'block';
document.body.style.visibility = 'visible';
document.body.style.opacity = '1';
```

#### Monitor Network Requests
```javascript
// Intercept all fetch calls:
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('📡 FETCH:', args[0]);
  return originalFetch.apply(this, args);
};
```

---

## 📞 Common Error Messages & Fixes

### ❌ "Cannot read properties of undefined (reading 'render')"
**Cause:** ReactDOM or root element issue  
**Fix:** Check `index.html` has `<div id="root"></div>`

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause:** Backend not allowing requests from Vercel  
**Fix:** Update `allowedOrigins` in backend server.js

### ❌ "SyntaxError: Unexpected token '<' in JSON"
**Cause:** Getting HTML (error page) instead of JSON  
**Fix:** Check backend URL is correct

### ❌ "Module not found" or "Cannot find module"
**Cause:** Wrong file casing (User.js vs user.js)  
**Fix:** Ensure all imports match exact filename casing

### ❌ "import.meta.env.VITE_BACKEND_URL is undefined"
**Cause:** Environment variable not set in Vercel  
**Fix:** Add to Vercel dashboard Environment Variables

---

## ✅ Verification Steps

Run these in browser console on production (https://hillsmartfarming.vercel.app):

```javascript
// 1. Check root element
document.getElementById('root') !== null ? '✅ Root found' : '❌ Root missing'

// 2. Check backend URL
import.meta.env.VITE_BACKEND_URL ? '✅ Env set' : '❌ Env missing'

// 3. Test backend connectivity
fetch('https://hillsmartfarming.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test', password: 'test' })
}).then(r => console.log(`Backend: ${r.status === 400 ? '✅ Reachable' : '❌ Failed'}`));

// 4. Check React is loaded
window.React ? '✅ React loaded' : '❌ React missing'

// 5. Check localStorage
localStorage.getItem('token') ? '💾 Token exists' : '📭 No token'
```

---

## 🎯 Success Indicators

When fixed, you should see:
- ✅ Login page displays
- ✅ Console shows no RED errors
- ✅ Console shows "✅ Using Render backend (Production)"
- ✅ Backend connectivity test succeeds
- ✅ Can login/signup
- ✅ App renders without white screen

---

**Last Updated:** February 20, 2026  
**Status:** Production Ready
