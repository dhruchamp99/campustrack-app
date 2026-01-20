# 🚀 Quick Deployment Commands

## Prerequisites
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

## Deploy Frontend to Firebase

```bash
# 1. Build the frontend
cd client
npm run build

# 2. Go back to root
cd ..

# 3. Initialize Firebase (first time only)
firebase init
# Select: Hosting
# Public directory: client/dist
# Single-page app: Yes
# Don't overwrite index.html

# 4. Deploy to Firebase
firebase deploy --only hosting
```

## Deploy Backend to Render

### Option 1: Using GitHub
```bash
# 1. Create GitHub repository
# 2. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main

# 3. Connect Render to GitHub and deploy
```

### Option 2: Manual Deploy
1. Go to https://render.com
2. Create new Web Service
3. Upload code or connect GitHub
4. Set environment variables
5. Deploy

## Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0
5. Get connection string
6. Add to Render environment variables

## Update Frontend API URL

After backend is deployed:

1. Update `client/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Rebuild and redeploy frontend:
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

## Test Deployment

1. Open Firebase URL: `https://your-project-id.web.app`
2. Try logging in with credentials
3. Test all features

## Troubleshooting

### Frontend not loading:
```bash
# Check Firebase console
firebase hosting:channel:list

# Redeploy
firebase deploy --only hosting --debug
```

### Backend not responding:
- Check Render logs
- Verify environment variables
- Test API endpoint directly

### Database connection failed:
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user credentials

## Quick Redeploy

### Frontend only:
```bash
cd client && npm run build && cd .. && firebase deploy --only hosting
```

### Backend (if using GitHub):
```bash
git add .
git commit -m "Update"
git push origin main
# Render auto-deploys
```

## Environment Variables Needed

### Backend (Render):
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campustrack
JWT_SECRET=supersecretkey_campustrack_2024
NODE_ENV=production
```

### Frontend (client/.env.production):
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

**Follow these commands in order for successful deployment!** 🚀
