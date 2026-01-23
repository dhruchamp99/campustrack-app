# 🔧 Troubleshooting: Students List Showing 0

## Problem
Admin dashboard shows 0 students even though 85 students are in the database.

## ✅ Verified
- ✅ 85 students ARE in the MongoDB database
- ✅ Backend API endpoint exists (`/api/admin/students`)
- ✅ Frontend code is correct

## 🔍 Possible Causes

### 1. **Backend Server Not Running**
The most common issue - the backend server needs to be running.

**Solution:**
```powershell
# Open a NEW terminal
cd "d:\attendence management\server"
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

---

### 2. **Frontend Not Connected to Backend**
Frontend might be looking at wrong URL.

**Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - `Failed to fetch`
   - `Network Error`
   - `ERR_CONNECTION_REFUSED`

**Solution:**
Make sure both servers are running:
```powershell
# Terminal 1 - Backend
cd "d:\attendence management\server"
npm run dev

# Terminal 2 - Frontend  
cd "d:\attendence management\client"
npm run dev
```

---

### 3. **Authentication Issue**
Admin token might be invalid or expired.

**Solution:**
1. Logout from admin dashboard
2. Login again with:
   - Email: `admin@campustrack.com`
   - Password: `admin123`
3. Try accessing students list again

---

### 4. **CORS Issue**
Backend might be blocking frontend requests.

**Check server/src/index.js** should have:
```javascript
app.use(cors());
```

---

## 🧪 Quick Test Steps

### Step 1: Verify Database
```powershell
cd "d:\attendence management\server"
node verify-students.js
```

Expected output: `Total CS Students: 85`

### Step 2: Start Backend Server
```powershell
cd "d:\attendence management\server"
npm run dev
```

Wait for: `Server running on port 5000`

### Step 3: Start Frontend
```powershell
cd "d:\attendence management\client"
npm run dev
```

### Step 4: Test in Browser
1. Go to `http://localhost:5173`
2. Login as admin:
   - Email: `admin@campustrack.com`
   - Password: `admin123`
3. Click "Manage Students"
4. Open DevTools (F12) → Console tab
5. Look for any errors

---

## 🔍 Debug Checklist

Run through this checklist:

- [ ] Backend server is running (`npm run dev` in server folder)
- [ ] Frontend is running (`npm run dev` in client folder)
- [ ] No errors in browser console (F12)
- [ ] No errors in backend terminal
- [ ] Admin can login successfully
- [ ] Token is being sent with requests (check Network tab in DevTools)

---

## 📝 Common Error Messages & Solutions

### Error: "Failed to fetch"
**Cause:** Backend server not running  
**Solution:** Start backend with `npm run dev` in server folder

### Error: "Network Error"
**Cause:** Wrong API URL  
**Solution:** Check that backend is on port 5000

### Error: "401 Unauthorized"
**Cause:** Invalid or expired token  
**Solution:** Logout and login again

### Error: "CORS policy"
**Cause:** CORS not configured  
**Solution:** Add `app.use(cors())` in server/src/index.js

---

## 🎯 Expected Behavior

When everything is working:
1. Admin logs in successfully
2. Clicks "Manage Students"
3. Sees: "All Students (85)"
4. Table shows all 85 students with:
   - Name
   - Enrollment Number
   - Department
   - Semester
   - Edit/Delete buttons

---

## 💡 Quick Fix Command

Run this to start both servers:

**Terminal 1 (Backend):**
```powershell
cd "d:\attendence management\server"
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd "d:\attendence management\client"
npm run dev
```

Then go to: `http://localhost:5173` and login as admin.

---

## 🆘 Still Not Working?

If students still show 0 after following all steps:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Manage Students"
4. Look for request to `/api/admin/students`
5. Click on it and check:
   - Status code (should be 200)
   - Response (should show array of students)
   - Headers (should have Authorization token)

Take a screenshot of the Network tab and share it for further debugging.
