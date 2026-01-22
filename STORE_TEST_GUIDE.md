# Quick Test Guide - Store Section

## Prerequisites
1. Backend server running on port 5000
2. Frontend server running on port 5173
3. Teacher account with login credentials

## Test Steps

### Step 1: Start Servers (if not already running)

**Backend:**
```powershell
cd server
npm run dev
```

**Frontend:**
```powershell
cd client
npm run dev
```

### Step 2: Login as Teacher
1. Navigate to `http://localhost:5173`
2. Click "Login"
3. Use teacher credentials:
   - Email: (your teacher email)
   - Password: (your teacher password)

### Step 3: Mark Attendance (if no records exist)
1. Click "Mark New Attendance" button
2. Select a subject
3. Select today's date
4. Click "Fetch Students"
5. Mark attendance (P/A) for students
6. Click "Submit Attendance"
7. Wait for success message

### Step 4: Access Store Section
**Option A - Via Sidebar:**
1. Look at the left sidebar
2. Click on "Store" (Archive icon)

**Option B - Via Dashboard:**
1. Go to Teacher Dashboard
2. Click "Store" button in the header

### Step 5: View Submitted Records
You should see:
- ✅ Cards showing each submitted attendance session
- ✅ Subject name and code
- ✅ Date of attendance
- ✅ Statistics (Total, Present, Absent, Percentage)
- ✅ "View Details" button
- ✅ "CSV" and "JSON" download buttons

### Step 6: Test View Details
1. Click "View Details" on any record
2. Verify student list appears with:
   - Enrollment numbers
   - Student names
   - Status (PRESENT/ABSENT) with color coding
3. Click "Hide Details" to collapse

### Step 7: Test CSV Download
1. Click "CSV" button on any record
2. Check your Downloads folder
3. Open the CSV file in Excel/Notepad
4. Verify it contains:
   - Subject information
   - Date
   - Student list with enrollment numbers and status

### Step 8: Test JSON Download
1. Click "JSON" button on any record
2. Check your Downloads folder
3. Open the JSON file in a text editor
4. Verify it contains properly formatted JSON with:
   - Subject object
   - Date
   - Students array

### Step 9: Test Refresh
1. Click "Refresh" button in the header
2. Verify the page reloads the data

## Expected Results

### Visual Checks
- [ ] Page loads without errors
- [ ] Cards display properly
- [ ] Statistics are accurate
- [ ] Color coding works (green for present, red for absent)
- [ ] Responsive on mobile (resize browser)

### Functional Checks
- [ ] Only teacher's own records are shown
- [ ] Records are sorted by date (newest first)
- [ ] Expand/collapse works smoothly
- [ ] CSV downloads successfully
- [ ] JSON downloads successfully
- [ ] File names are descriptive and unique

### Data Accuracy
- [ ] Student counts match actual submissions
- [ ] Attendance percentage is calculated correctly
- [ ] Enrollment numbers are correct
- [ ] Student names are correct
- [ ] Status matches what was submitted

## Troubleshooting

### No records showing
- Make sure you've submitted attendance first
- Check browser console for errors
- Verify backend is running
- Check network tab for API response

### Download not working
- Check browser's download settings
- Verify pop-up blocker is not blocking downloads
- Try a different browser

### Statistics incorrect
- Verify the attendance was submitted correctly
- Check the database for the attendance records
- Refresh the page

## API Endpoint Test (Optional)

Test the backend directly:
```powershell
# Get auth token first by logging in, then:
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/attendance/teacher/submitted
```

Expected response: Array of attendance records with student details

## Success Criteria
✅ All test steps complete without errors
✅ Downloads work in both CSV and JSON formats
✅ Data is accurate and matches submissions
✅ UI is responsive and user-friendly
