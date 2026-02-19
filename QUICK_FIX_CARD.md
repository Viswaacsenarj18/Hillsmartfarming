# ⚡ QUICK FIX REFERENCE CARD

## 🚀 If You See White Page on https://hillsmartfarming.vercel.app

### Step 1: Hard Refresh (Clears Cache)
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Step 2: Open Browser Console
```
Press F12 → Click "Console" tab
```

### Step 3: Look For These Positive Signs ✅
You should see green/gray messages like:
```
🚀 HillSmart App Starting...
🔍 [API CONFIG DEBUG]
  DEV Mode: false
  Hostname: hillsmartfarming.vercel.app
✅ Using Render backend (Production)
```

### Step 4: Check For RED ERROR MESSAGES ❌
If you see red errors, take a screenshot and check the full debugging guide.

---

## 🔍 Quick Diagnosis Tests (Paste in Console)

### Test 1: Is Root Element Working?
```javascript
document.getElementById('root') ? '✅ YES' : '❌ NO'
```

### Test 2: Is Backend Reachable?
```javascript
fetch('https://hillsmartfarming.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test', password: 'test' })
}).then(r => console.log(`Status: ${r.status}`, r.status === 400 ? '✅ Backend OK' : '❌ Backend issue'))
```

### Test 3: Check Environment Variables
```javascript
{
  dev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  backendUrl: import.meta.env.VITE_BACKEND_URL
}
```

---

## 🐛 Common Issues & Quick Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| **White page** | Browser console (F12) | Hard refresh, check errors |
| **"Cannot find root"** | `document.getElementById('root')` | Check index.html |
| **Backend error** | Network tab | Check Render backend status |
| **CORS error** | Console error message | Backend CORS configured for Vercel URLs |
| **Login doesn't work** | Backend connectivity test | Verify `https://hillsmartfarming.onrender.com` is online |

---

## 📞 When to Check What

### If Page Stays Blank:
1. ✅ Hard refresh
2. ✅ Open Console (F12)
3. ✅ Run: `document.getElementById('root')`
4. ✅ Check for RED errors

### If Login Fails:
1. ✅ Run backend test (see Test 2 above)
2. ✅ Check Network tab for failed requests
3. ✅ Verify backend environment variables on Render

### If Nothing Changes After Deploy:
1. ✅ Hard refresh (Ctrl+Shift+R)
2. ✅ Clear browser cache
3. ✅ Incognito/Private window test
4. ✅ Check Vercel deployment finished

---

## 📊 What Success Looks Like

✅ Page loads (you see login form)  
✅ Console shows no RED errors  
✅ Console shows "✅ Using Render backend"  
✅ Backend test returns HTTP 400 (expected from test data)  
✅ Can type in login fields  
✅ Submit button works  

---

## 🆘 If Problem Persists

1. **Check Vercel deployment:** https://vercel.com → Select project → Check latest deployment log
2. **Check Render backend:** https://render.com → Select backend → Check logs
3. **See full guide:** Open `PRODUCTION_DEBUGGING_GUIDE.md` for detailed steps
4. **Test locally first:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📱 Network Tab Debugging (Most Important!)

1. Press F12 → Click **Network** tab
2. Reload page (Ctrl+R)
3. Look for:

| File | Status | What It Means |
|------|--------|---|
| index.html | 200 | ✅ Good |
| main-*.js | 200 | ✅ Good |
| *.css | 200 | ✅ Good |
| Any | 404 | ❌ File missing |
| Any | 5xx | ❌ Server error |
| Any | 0 | ❌ Network/CORS issue |

---

**Last Updated:** February 20, 2026  
**For Full Guide:** See `PRODUCTION_DEBUGGING_GUIDE.md`
