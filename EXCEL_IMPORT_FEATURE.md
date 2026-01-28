# Excel Import Feature for Students

## Overview
The admin dashboard now includes an **Import Students** feature that allows bulk importing of student data from Excel files (.xlsx or .xls).

## How to Use

### 1. Access the Import Feature
- Navigate to **Admin Dashboard → Manage Students**
- Click the **"Import Students"** button in the header

### 2. Prepare Your Excel File
Your Excel file should have the following columns (case-insensitive):

#### Required Columns:
- **Name** - Student's full name
- **Enrollment Number** - Unique enrollment number
- **Department** or **Branch** - e.g., "Computer Science", "Information Technology"
- **Semester** or **Sem** - Semester number (1-8)

#### Optional Columns:
- **Email** - Student's email address
- **Password** - Custom password (if not provided, enrollment number will be used as password)

### 3. Sample Excel Format

| Name | Enrollment Number | Department | Semester | Email |
|------|------------------|------------|----------|-------|
| John Doe | 2024001 | Computer Science | 4 | john@example.com |
| Jane Smith | 2024002 | Information Technology | 4 | jane@example.com |
| Mike Johnson | 2024003 | Computer Science | 4 | mike@example.com |

### 4. Import Process
1. Click **"Import Students"** button
2. Review the format requirements in the modal
3. Click **"Select Excel File"** and choose your file
4. Click **"Import Students"** to start the import
5. Wait for the import to complete

### 5. Import Results
After import, you'll see a summary showing:
- ✅ **Success**: Number of students successfully imported
- ⚠️ **Skipped**: Number of students skipped (already exist)
- ❌ **Failed**: Number of students that failed to import (check console for details)

## Features

### ✨ Smart Column Mapping
The system automatically recognizes multiple column name variations:
- "Department" or "Branch"
- "Semester" or "Sem"
- "Enrollment Number" or "enrollmentNumber" or "enrollment"

### 🔒 Duplicate Prevention
- Students with existing enrollment numbers are automatically skipped
- No duplicate entries will be created

### 🔑 Default Passwords
- If no password is provided in the Excel file, the enrollment number is used as the default password
- Students can change their password after first login

### 📊 Validation
- All required fields are validated before import
- Invalid entries are reported in the failed section
- Partial imports are supported (valid entries are imported even if some fail)

## Teacher Access
Once students are imported:
- They immediately appear in the admin's student list
- Teachers can fetch these students when marking attendance
- Students can log in using their enrollment number and password

## Supported Departments
- Computer Science
- Information Technology
- Electronics
- Mechanical
- Civil

## Supported Semesters
- 1 through 8

## Tips
1. **Keep it simple**: Use the exact column names shown in the sample template
2. **Check data**: Ensure enrollment numbers are unique
3. **Test first**: Try importing a small batch first to verify your format
4. **Review results**: Always check the import summary for any issues

## Troubleshooting

### "Please select a valid Excel file"
- Make sure your file has .xlsx or .xls extension
- Try re-saving the file in Excel format

### Students showing as "Failed"
- Check that all required fields are filled
- Verify enrollment numbers are unique
- Check console (F12) for detailed error messages

### Students not appearing for teachers
- Ensure the Department and Semester match exactly with the subject configuration
- Refresh the teacher dashboard after import

## Technical Details
- Backend endpoint: `POST /api/admin/students/import`
- Supported formats: .xlsx, .xls
- Maximum file size: No specific limit (reasonable sizes recommended)
- Processing: Sequential (one student at a time for data integrity)
