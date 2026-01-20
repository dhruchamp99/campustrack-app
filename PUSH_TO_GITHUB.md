# 🚀 Push Code to GitHub - Step by Step

## ⚠️ IMPORTANT: Restart Your Terminal First!

After installing Git, you MUST close and reopen your terminal/command prompt for Git to work.

---

## 📝 Steps to Push Code:

### 1. Close this terminal and open a NEW one

### 2. Navigate to your project:
```bash
cd "d:\attendence management"
```

### 3. Configure Git (first time only):
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"
```

### 4. Initialize Git repository:
```bash
git init
```

### 5. Add all files:
```bash
git add .
```

### 6. Create first commit:
```bash
git commit -m "Initial commit - CampusTrack app"
```

### 7. Add your GitHub repository:
Replace `YOUR-USERNAME` with your actual GitHub username:
```bash
git remote add origin https://github.com/YOUR-USERNAME/campustrack-app.git
```

### 8. Push to GitHub:
```bash
git branch -M main
git push -u origin main
```

You'll be asked for GitHub credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

---

## 🔑 How to Get GitHub Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Render Deployment"
4. Select scopes: Check **"repo"** (full control)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## ✅ After Pushing to GitHub:

1. Go back to Render
2. Refresh the repository list
3. Select "campustrack-app"
4. Continue with deployment settings

---

## 🆘 If You Get Stuck:

Let me know at which step you're having trouble!
