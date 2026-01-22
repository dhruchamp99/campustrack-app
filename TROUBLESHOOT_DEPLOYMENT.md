# 🔍 Troubleshooting Guide

## Check These Things:

### 1. **Is the backend awake?**

Render free tier sleeps after 15 minutes. First request takes 30-60 seconds to wake up.

**Test backend:**
- Open in browser: https://campustrack-app-2.onrender.com
- You should see: "API is running..."
- If it takes 30+ seconds, that's normal (it's waking up)

### 2. **Check browser console for errors:**

On your phone:
1. Open: https://campustrack-app-4b232.web.app
2. Try to login
3. What error message do you see?

Common errors:
- "Network Error" → Backend is sleeping or not responding
- "CORS Error" → Backend CORS issue
- "401 Unauthorized" → Wrong credentials
- "500 Server Error" → Backend error

### 3. **Wait for backend to wake up:**

If you see "Network Error":
1. Open: https://campustrack-app-2.onrender.com in a new tab
2. Wait for "API is running..." to appear
3. Then try logging in again

### 4. **Check Render logs:**

1. Go to: https://dashboard.render.com/
2. Click on "campustrack-app-2"
3. Check the logs
4. Look for errors

---

## Quick Fixes:

### Fix 1: Wake up the backend
```
Open: https://campustrack-app-2.onrender.com
Wait 30 seconds
Then try login again
```

### Fix 2: Clear browser cache
```
On phone: Settings → Clear cache
Or use incognito/private mode
```

### Fix 3: Check credentials
```
Admin:
Email: dhru@campus.com
Password: admin123

Student:
Enrollment: cs101
Password: student123
```

---

## Tell Me:

1. What error message do you see?
2. Does https://campustrack-app-2.onrender.com show "API is running..."?
3. How long did you wait before trying to login?

Let me know and I'll help fix it!
