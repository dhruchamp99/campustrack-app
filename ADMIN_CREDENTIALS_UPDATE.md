# Admin Credentials Update

## New Admin Credentials

**Email:** `dhru@admin.com`  
**Password:** `admin@123`

---

## Changes Made

### 1. **Local Database Updated** ✅
- Old: `dhru@campus.com` / `admin123`
- New: `dhru@admin.com` / `admin@123`
- Status: **Updated successfully**

### 2. **Documentation Updated** ✅
- `LOGIN_CREDENTIALS.md` - All references updated
- Admin login instructions updated
- Password reset commands updated
- Quick reference table updated

### 3. **Scripts Created**
- `server/update-admin.js` - Script to update admin credentials
- `update-admin-prod.ps1` - PowerShell script for production update

---

## How to Update Production Database

Run the PowerShell script:
```powershell
.\update-admin-prod.ps1
```

Or manually:
```powershell
cd server
$env:MONGO_URI = "your-mongodb-atlas-connection-string"
node update-admin.js
```

---

## Login Instructions

### **Local Development:**
1. Go to `http://localhost:5173/login`
2. Click **"admin"** tab
3. Email: `dhru@admin.com`
4. Password: `admin@123`
5. Click **Login**

### **Production:**
1. Go to `https://campustrack-app-4b232.web.app`
2. Click **"admin"** tab
3. Email: `dhru@admin.com`
4. Password: `admin@123`
5. Click **Login**

---

## Status

✅ **Local Database** - Updated  
⏳ **Production Database** - Needs manual update (run script)  
✅ **Documentation** - Updated  
✅ **Scripts** - Created

---

## Next Steps

1. **Test Local Login:**
   - Login with new credentials on localhost
   - Verify admin dashboard access

2. **Update Production:**
   - Run `update-admin-prod.ps1`
   - Enter MongoDB Atlas connection string
   - Verify update

3. **Test Production Login:**
   - Login at live URL
   - Verify admin access

---

## Old vs New

| Item | Old | New |
|------|-----|-----|
| Email | dhru@campus.com | dhru@admin.com |
| Password | admin123 | admin@123 |

---

**Local database updated successfully!** 🎉

To update production, run: `.\update-admin-prod.ps1`
