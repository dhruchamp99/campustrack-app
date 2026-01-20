# 🧪 Testing Guide: New Student Creation & Attendance

## Step-by-Step Testing Process

### ✅ **Step 1: Create New Student (as Admin)**

1. **Login as Admin:**
   - Email: `admin@campustrack.com`
   - Password: `admin123`
   - Tab: **admin**

2. **Navigate to "Manage Students"**

3. **Click "Add New Student"**

4. **Fill in the form:**
   - **Full Name:** `Test Student`
   - **Enrollment Number:** `CS107` (or any unique number)
   - **Email:** `test@example.com` (optional)
   - **Password:** `student123`
   - **Department:** Select **"Computer Science"** from dropdown
   - **Semester:** Select **"Semester 4"** from dropdown

5. **Click "Add Student"**
   - ✅ You should see a green toast: "Student Test Student added successfully!"
   - ✅ The student should appear in the table below

6. **Check Browser Console (F12)**
   - Look for: `Student created: {_id: "...", name: "Test Student", ...}`
   - If you see an error, note it down

---

### ✅ **Step 2: Mark Attendance (as Teacher)**

1. **Logout and Login as Teacher:**
   - Email: `teacher@campustrack.com`
   - Password: `teacher123`
   - Tab: **teacher**

2. **Navigate to "Mark Attendance"**

3. **Select Subject:**
   - Choose: **"Data Structures (CE401)"** or any Sem 4 subject

4. **Select Today's Date**

5. **Click "Fetch Students"**
   - ✅ You should see a green toast: "Loaded X students successfully!"
   - ✅ **CS107 (Test Student)** should appear in the list
   - ✅ All other Sem 4 Computer Science students should also appear

6. **Mark Attendance:**
   - Mark CS107 as **Present** (click P button)
   - Mark others as needed

7. **Click "Submit Attendance"**
   - ✅ You should see a green toast: "✅ Attendance marked successfully!"
   - ✅ The form should clear after 1 second

---

### ✅ **Step 3: View Dashboard (as New Student)**

1. **Logout and Login as New Student:**
   - Enrollment: `CS107`
   - Password: `student123`
   - Tab: **student**

2. **You should see the Student Dashboard with:**
   - ✅ **Overall Attendance:** Shows percentage (should be 100% if only marked present once)
   - ✅ **Today's Status:** Shows the class you just marked (Data Structures - PRESENT)
   - ✅ **Attendance History:** Table with 1 record showing today's attendance

3. **Check Browser Console (F12)**
   - Look for: `Fetched attendance data: [...]`
   - Should show at least 1 attendance record

4. **Click "Refresh" Button**
   - Data should reload

---

## 🐛 **Troubleshooting**

### Problem: Student not appearing in class list

**Possible Causes:**
1. **Department mismatch:** Student's department ≠ Subject's department
2. **Semester mismatch:** Student's semester ≠ Subject's semester

**Solution:**
- Run this command to check student data:
  ```bash
  cd server
  node check-student.js CS107
  ```
- Verify department is exactly "Computer Science" (case-sensitive)
- Verify semester is exactly "4" (not "Semester 4")

### Problem: Student can't login

**Possible Causes:**
1. Student wasn't created in database
2. Wrong enrollment number or password

**Solution:**
- Check browser console for errors
- Verify student exists in admin panel
- Try resetting password

### Problem: Dashboard shows no data

**Possible Causes:**
1. No attendance has been marked yet
2. API error

**Solution:**
- Check browser console for errors
- Click "Refresh" button
- Mark attendance as teacher first

---

## 📊 **Expected Results**

After completing all steps:

| Metric | Expected Value |
|--------|---------------|
| Students in Sem 4 CS | 5 (CS101, CS103, CS105, CS106, CS107) |
| CS107 Attendance Records | 1+ |
| CS107 Percentage | 100% (if all marked present) |
| Today's Status | Shows today's classes |

---

## 🔍 **Verification Commands**

Run these in the server directory:

```bash
# Check if student exists
node check-student.js CS107

# Check all Sem 4 students
node -e "require('./src/models/User'); const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/campustrack').then(async () => { const User = require('./src/models/User'); const students = await User.find({role:'student', department:'Computer Science', semester:'4'}); console.log(students.map(s => s.enrollmentNumber + ' - ' + s.name)); process.exit(); });"
```

---

## ✅ **Success Criteria**

- [x] Admin can create student with dropdowns
- [x] Student appears in admin table
- [x] Teacher can see student in class list
- [x] Teacher can mark attendance
- [x] Student can login
- [x] Student dashboard shows attendance
- [x] Today's status updates in real-time
- [x] Overall percentage calculates correctly
