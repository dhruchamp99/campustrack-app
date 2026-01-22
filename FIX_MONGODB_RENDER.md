# 🔧 Fix MongoDB Connection on Render

## The Problem:
Render backend can't connect to MongoDB Atlas - that's why you're getting "Server error"

## ✅ Solution - Update Render Environment Variable:

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Click on your service: **"campustrack-app-2"**

### Step 2: Go to Environment Variables
1. Click on **"Environment"** tab (on the left sidebar)
2. Find the variable: **MONGO_URI**

### Step 3: Update MONGO_URI
1. Click **"Edit"** next to MONGO_URI
2. Replace the current value with:
   ```
   mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack
   ```
3. Click **"Save Changes"**

### Step 4: Redeploy
After saving, Render will automatically redeploy your service.

**Wait 3-5 minutes** for the deployment to complete.

### Step 5: Check Logs
1. Click on **"Logs"** tab
2. Look for:
   ```
   ✅ MongoDB Connected successfully
   ✅ Server running in production mode on port 5000
   ```

If you see these messages, MongoDB is connected!

---

## 🎯 Then Try Login Again:

1. Open: https://campustrack-app-4b232.web.app
2. Login with: dhru@campus.com / admin123
3. Should work now! 🎉

---

## 🆘 If You Can't Find Environment Tab:

Look for:
- **"Settings"** → **"Environment Variables"**
- OR **"Environment"** in the left sidebar
- OR a **"⚙️"** settings icon

The MONGO_URI should be there - just edit it and save!

---

Let me know when you've updated it and I'll help you verify!
