# 🚀 Backend Deployment - Step by Step

## ⚠️ Current Issue

Your frontend is live at: https://campustrack-app-4b232.web.app
But your backend is on localhost:5000 (only accessible from your computer)

**Result:** Login fails when accessed from phone or other devices

---

## ✅ Solution: Deploy Backend to Render (Free)

### **Step 1: Create Render Account**

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with:
   - GitHub (recommended)
   - OR Email

### **Step 2: Create Web Service**

1. Click "New +" button
2. Select "Web Service"
3. Choose deployment method:

#### **Option A: Connect GitHub (Recommended)**
1. Connect your GitHub account
2. Create a new repository for CampusTrack
3. Push your code to GitHub
4. Select the repository in Render

#### **Option B: Manual Deploy**
1. Select "Public Git repository"
2. Or upload code directly

### **Step 3: Configure Service**

Fill in these settings:

```
Name: campustrack-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
Instance Type: Free
```

### **Step 4: Add Environment Variables**

Click "Advanced" → "Add Environment Variable"

Add these variables:

```
PORT = 5000
MONGO_URI = mongodb://localhost:27017/campustrack
JWT_SECRET = supersecretkey_campustrack_2024
NODE_ENV = production
```

**⚠️ Important:** For production, you should use MongoDB Atlas instead of localhost.

### **Step 5: Deploy**

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://campustrack-backend.onrender.com`

---

## 📝 **After Backend is Deployed**

### **Update Frontend API URL**

1. Note your backend URL from Render
2. Update `client/.env.production`:
   ```env
   VITE_API_URL=https://campustrack-backend.onrender.com
   ```

3. Rebuild frontend:
   ```bash
   cd client
   npm run build
   ```

4. Redeploy to Firebase:
   ```bash
   cd ..
   firebase deploy --only hosting
   ```

---

## 🗄️ **Setup MongoDB Atlas (Cloud Database)**

Since Render can't access your local MongoDB, you need cloud database:

### **Step 1: Create MongoDB Atlas Account**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create organization and project

### **Step 2: Create Free Cluster**

1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Select cloud provider: AWS
4. Select region: Closest to you
5. Cluster name: "CampusTrack"
6. Click "Create"

### **Step 3: Create Database User**

1. Security → Database Access
2. Add New Database User
3. Username: `campustrack`
4. Password: Generate strong password (SAVE IT!)
5. Privileges: Read and write to any database
6. Add User

### **Step 4: Whitelist IP**

1. Security → Network Access
2. Add IP Address
3. Select "Allow access from anywhere"
4. IP: `0.0.0.0/0`
5. Confirm

### **Step 5: Get Connection String**

1. Database → Connect
2. Connect your application
3. Driver: Node.js
4. Copy connection string
5. Replace `<password>` with your actual password

**Example:**
```
mongodb+srv://campustrack:YOUR_PASSWORD@campustrack.xxxxx.mongodb.net/campustrack?retryWrites=true&w=majority
```

### **Step 6: Update Render Environment Variables**

Go back to Render and update:
```
MONGO_URI = mongodb+srv://campustrack:YOUR_PASSWORD@...
```

---

## 🎯 **Quick Alternative: Use Firebase MCP Server**

Since you have Firebase, I can help you use Firebase's MCP server to deploy the backend!

Would you like me to:
1. Help you deploy to Render (recommended)
2. Use Firebase MCP server
3. Guide you through MongoDB Atlas setup

---

## 📞 **Need Help?**

Let me know which option you prefer and I'll guide you through it!

**Estimated time:**
- Render deployment: 15-20 minutes
- MongoDB Atlas: 10-15 minutes
- Total: 30-35 minutes

After this, your app will work from anywhere! 🌍
