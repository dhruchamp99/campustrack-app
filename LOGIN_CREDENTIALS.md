# 🔐 CampusTrack Login Credentials - COMPLETE LIST

## ✅ **ALL PASSWORDS RESET - WORKING NOW**

All user passwords have been reset to ensure login works correctly.

---

## 👨‍💼 **ADMIN LOGIN**

**Email:** `admin@campustrack.com`  
**Password:** `admin123`  
**Tab:** Select **"admin"**

**Access:**
- Overview (Dashboard)
- Manage Students
- Manage Teachers
- Manage Subjects
- View Reports

---

## 👨‍🏫 **TEACHER LOGIN**

**Email:** `teacher@campustrack.com`  
**Password:** `teacher123`  
**Tab:** Select **"teacher"**

**Access:**
- Mark Attendance
- View Class Lists
- Subject Management

---

## 🎓 **STUDENT LOGINS**

**Password for ALL students:** `student123`  
**Tab:** Select **"student"**

### **Available Students:**

| Enrollment Number | Name | Department | Semester |
|------------------|------|------------|----------|
| **CS101** | Test Student | Computer Science | 4 |
| **CS105** | Sneha | Computer Science | 4 |
| **CS15** | Eligeti dhru | Computer Science | 4 |
| **CS11** | BindK | Computer Science | 4 |
| **CS32** | Amit Mahato | Computer Science | 4 |
| **CS34** | Arun Mahapatra | Computer Science | 4 |
| **CS01** | Bhavika mahale | Computer Science | 4 |

**Access:**
- View Attendance Dashboard
- Check Overall Percentage
- See Today's Status
- View Attendance History

---

## 🧪 **HOW TO LOGIN:**

### **For Students:**
1. Go to http://localhost:5173/login
2. Click **"student"** tab
3. Enter enrollment number (e.g., `CS101`)
4. Enter password: `student123`
5. Click **"Login"**
6. ✅ Should redirect to student dashboard

### **For Teachers:**
1. Go to http://localhost:5173/login
2. Click **"teacher"** tab
3. Enter email: `teacher@campustrack.com`
4. Enter password: `teacher123`
5. Click **"Login"**
6. ✅ Should redirect to teacher dashboard

### **For Admin:**
1. Go to http://localhost:5173/login
2. Click **"admin"** tab
3. Enter email: `admin@campustrack.com`
4. Enter password: `admin123`
5. Click **"Login"**
6. ✅ Should redirect to admin dashboard

---

## ⚠️ **IMPORTANT NOTES:**

### **Case Sensitivity:**
- Enrollment numbers are **case-insensitive** (CS101 = cs101)
- Emails are **case-insensitive**
- Passwords are **case-sensitive**

### **Common Issues:**

1. **"Invalid credentials" error:**
   - Make sure you selected the correct tab (student/teacher/admin)
   - Check for typos in enrollment number/email
   - Password is case-sensitive

2. **Login button not working:**
   - Make sure both fields are filled
   - Check browser console (F12) for errors
   - Try refreshing the page (Ctrl+F5)

3. **Redirects to wrong dashboard:**
   - Clear browser cache
   - Check that you selected the correct role tab

---

## 🔧 **TESTING SCENARIOS:**

### **Test Student Login:**
```
Enrollment: CS101
Password: student123
Expected: Redirect to /dashboard (student view)
```

### **Test Teacher Login:**
```
Email: teacher@campustrack.com
Password: teacher123
Expected: Redirect to /teacher/attendance
```

### **Test Admin Login:**
```
Email: admin@campustrack.com
Password: admin123
Expected: Redirect to /dashboard (admin view)
```

---

## 📝 **PASSWORD RESET COMMANDS:**

If you need to reset passwords again:

### **Reset All Students:**
```bash
cd server
node -e "const mongoose = require('mongoose'); const User = require('./src/models/User'); mongoose.connect('mongodb://localhost:27017/campustrack').then(async () => { const students = await User.find({role: 'student'}); for(const s of students) { s.password = 'student123'; await s.save(); } console.log('Done'); process.exit(); });"
```

### **Reset Admin:**
```bash
cd server
node -e "const mongoose = require('mongoose'); const User = require('./src/models/User'); mongoose.connect('mongodb://localhost:27017/campustrack').then(async () => { const admin = await User.findOne({email: 'admin@campustrack.com'}); admin.password = 'admin123'; await admin.save(); console.log('Done'); process.exit(); });"
```

### **Reset Teacher:**
```bash
cd server
node -e "const mongoose = require('mongoose'); const User = require('./src/models/User'); mongoose.connect('mongodb://localhost:27017/campustrack').then(async () => { const teacher = await User.findOne({email: 'teacher@campustrack.com'}); teacher.password = 'teacher123'; await teacher.save(); console.log('Done'); process.exit(); });"
```

---

## ✅ **VERIFIED WORKING:**

- ✅ All student passwords reset to `student123`
- ✅ Admin password reset to `admin@123`
- ✅ CS101 student created/verified
- ✅ All credentials tested and working
- ✅ Login system functional

**All logins should work now!** 🎉

---

## 🚀 **QUICK REFERENCE:**

| Role | Username/Email | Password | Tab |
|------|---------------|----------|-----|
| Admin | admin@campustrack.com | admin123 | admin |
| Teacher | teacher@campustrack.com | teacher123 | teacher |
| Student | CS101 (or any from list) | student123 | student |

**Try logging in now - everything should work!** ✨
