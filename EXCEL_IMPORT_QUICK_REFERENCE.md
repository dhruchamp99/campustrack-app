# Excel Import - Quick Reference Card

## ✅ Required Columns

| Column Name | Example | Notes |
|-------------|---------|-------|
| **Name** | John Doe | Student's full name |
| **Enrollment Number** | 2024001 | Must be unique |
| **Department** | Computer Science | Exact match required |
| **Semester** | 4 | Number 1-8 |

## 🔄 Alternative Column Names

You can use these alternative names:

| Standard | Alternatives |
|----------|-------------|
| Department | Branch |
| Semester | Sem |
| Enrollment Number | enrollmentNumber, enrollment |

## 📝 Optional Columns

| Column Name | Example | Default if Empty |
|-------------|---------|------------------|
| Email | john@example.com | Empty string |
| Password | mypass123 | "123" |

## 🎯 Valid Departments

- Computer Science
- Information Technology
- Electronics
- Mechanical
- Civil

## 📊 Valid Semesters

1, 2, 3, 4, 5, 6, 7, 8

## 📋 Sample Excel File

### Minimal Format (Required fields only)
```
Name          | Enrollment Number | Department        | Semester
John Doe      | 2024001          | Computer Science  | 4
Jane Smith    | 2024002          | Computer Science  | 4
Mike Johnson  | 2024003          | Electronics       | 3
```

### Complete Format (All fields)
```
Name          | Enrollment Number | Department        | Semester | Email              | Password
John Doe      | 2024001          | Computer Science  | 4        | john@example.com   | pass123
Jane Smith    | 2024002          | Computer Science  | 4        | jane@example.com   | pass456
Mike Johnson  | 2024003          | Electronics       | 3        | mike@example.com   | pass789
```

### Alternative Column Names
```
Name          | Enrollment Number | Branch            | Sem
John Doe      | 2024001          | Computer Science  | 4
Jane Smith    | 2024002          | Computer Science  | 4
```

## ⚠️ Common Mistakes to Avoid

❌ **Wrong Department Name**
```
Department: "CS" or "Comp Sci"
```
✅ **Correct**
```
Department: "Computer Science"
```

❌ **Semester as Text**
```
Semester: "Fourth" or "Sem 4"
```
✅ **Correct**
```
Semester: 4
```

❌ **Duplicate Enrollment Numbers**
```
2024001 appears twice → Second one will be skipped
```

❌ **Missing Required Fields**
```
Name: (empty) → Will fail
```

## 🚀 Quick Steps

1. **Open Excel** → Create new workbook
2. **Add Headers** → Name, Enrollment Number, Department, Semester
3. **Fill Data** → Add student information
4. **Save** → Save as .xlsx or .xls
5. **Import** → Go to Admin Dashboard → Manage Students → Import Students
6. **Upload** → Select your file
7. **Verify** → Check results and student list

## 💡 Pro Tips

1. **Test First**: Import 2-3 students first to verify format
2. **Use Excel**: Don't use Notepad or Word
3. **Check Spelling**: Department names must match exactly
4. **Unique IDs**: Ensure enrollment numbers are unique
5. **Backup**: Keep original Excel file for reference
6. **Review**: Check import results for any failures

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid file type" | Save as .xlsx or .xls |
| "Empty file" | Add at least one student row |
| Students skipped | They already exist (check enrollment #) |
| Import failed | Check required fields are filled |
| Wrong department | Use exact names from valid list |

## 🎯 Import Results Explained

- **✅ Success**: Student created successfully
- **⚠️ Skipped**: Student already exists (duplicate enrollment number)
- **❌ Failed**: Missing required fields or invalid data

## 📥 Download Template

Create a file with these exact headers:
```
Name | Enrollment Number | Department | Semester | Email
```

Then fill in your student data!

---

**Need Help?** Check these files:
- `EXCEL_IMPORT_FEATURE.md` - Full user guide
- `TEST_EXCEL_IMPORT.md` - Testing guide
- `EXCEL_IMPORT_VISUAL_GUIDE.md` - Visual walkthrough
