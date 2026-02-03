# 📊 CampusTrack Database Usage Documentation

## Overview

CampusTrack uses **MongoDB** as its primary database, hosted on **MongoDB Atlas** for production. The database is accessed through **Mongoose ODM** (Object Data Modeling) library version 8.0.3.

---

## 🗄️ Database Architecture

### Database Type
- **Database**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose v8.0.3
- **Hosting**: MongoDB Atlas (Production) / Local MongoDB (Development)
- **Connection**: Via `MONGO_URI` environment variable

### Connection Configuration
**Location**: `server/src/config/db.js`

```javascript
mongoose.connect(process.env.MONGO_URI)
```

---

## 📋 Database Collections (Models)

CampusTrack currently uses **4 main collections** to manage all application data:

### 1. **Users Collection** (`users`)
**Model File**: `server/src/models/User.js`

**Purpose**: Stores all user accounts (Admin, Teachers, and Students)

**Schema Fields**:
| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `name` | String | ✅ Yes | ❌ No | User's full name |
| `email` | String | ❌ No* | ✅ Yes (sparse) | Email address (for admin/teachers) |
| `enrollmentNumber` | String | ❌ No* | ✅ Yes (sparse) | Enrollment number (for students) |
| `password` | String | ✅ Yes | ❌ No | Hashed password (bcrypt) |
| `role` | String (enum) | ✅ Yes | ❌ No | User role: 'admin', 'teacher', 'student' |
| `department` | String | ✅ Yes | ❌ No | Department name (e.g., 'Computer Science') |
| `semester` | String | ⚠️ Conditional* | ❌ No | Semester (required for students only) |
| `createdAt` | Date | ✅ Yes (auto) | ❌ No | Account creation timestamp |

**Special Features**:
- ✅ Password encryption using bcrypt (salt rounds: 10)
- ✅ Pre-save middleware for automatic password hashing
- ✅ `matchPassword()` method for authentication
- ✅ Sparse indexes on email and enrollmentNumber (allows null values without conflicts)

**Indexes**:
- `email` (unique, sparse)
- `enrollmentNumber` (unique, sparse)

---

### 2. **Subjects Collection** (`subjects`)
**Model File**: `server/src/models/Subject.js`

**Purpose**: Stores all subjects/courses offered in the institution

**Schema Fields**:
| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `subjectName` | String | ✅ Yes | ❌ No | Full subject name |
| `subjectCode` | String | ✅ Yes | ✅ Yes | Unique subject code |
| `teacherId` | ObjectId (ref: User) | ✅ Yes | ❌ No | Reference to teacher assigned |
| `semester` | String | ✅ Yes | ❌ No | Semester for this subject |
| `department` | String | ✅ Yes | ❌ No | Department offering this subject |
| `createdAt` | Date | ✅ Yes (auto) | ❌ No | Record creation timestamp |
| `updatedAt` | Date | ✅ Yes (auto) | ❌ No | Last update timestamp |

**Relationships**:
- 🔗 `teacherId` → References `User` collection (teacher role)

**Indexes**:
- `subjectCode` (unique)

---

### 3. **Attendance Collection** (`attendances`)
**Model File**: `server/src/models/Attendance.js`

**Purpose**: Stores daily attendance records for students

**Schema Fields**:
| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `studentId` | ObjectId (ref: User) | ✅ Yes | ❌ No | Reference to student |
| `subjectId` | ObjectId (ref: Subject) | ✅ Yes | ❌ No | Reference to subject |
| `date` | Date | ✅ Yes | ❌ No | Attendance date |
| `status` | String (enum) | ✅ Yes | ❌ No | 'present' or 'absent' |
| `markedBy` | ObjectId (ref: User) | ✅ Yes | ❌ No | Reference to teacher who marked |
| `createdAt` | Date | ✅ Yes (auto) | ❌ No | Record creation timestamp |
| `updatedAt` | Date | ✅ Yes (auto) | ❌ No | Last update timestamp |

**Relationships**:
- 🔗 `studentId` → References `User` collection (student role)
- 🔗 `subjectId` → References `Subject` collection
- 🔗 `markedBy` → References `User` collection (teacher role)

**Indexes**:
- **Compound Unique Index**: `{ studentId: 1, subjectId: 1, date: 1 }`
  - **Purpose**: Prevents duplicate attendance entries for same student, subject, and date
  - **Ensures**: One attendance record per student per subject per day

---

### 4. **Holidays Collection** (`holidays`)
**Model File**: `server/src/models/Holiday.js`

**Purpose**: Stores institutional holidays and special dates

**Schema Fields**:
| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `date` | Date | ✅ Yes | ✅ Yes | Holiday date |
| `title` | String | ✅ Yes | ❌ No | Holiday name/title |
| `description` | String | ❌ No | ❌ No | Additional details |
| `type` | String | ❌ No | ❌ No | Holiday type (default: 'Holiday') |
| `createdAt` | Date | ✅ Yes (auto) | ❌ No | Record creation timestamp |
| `updatedAt` | Date | ✅ Yes (auto) | ❌ No | Last update timestamp |

**Indexes**:
- `date` (unique)

---

## 🔗 Database Relationships

```
┌─────────────┐
│    User     │
│  (Admin)    │
└─────────────┘
       │
       │ manages
       ↓
┌─────────────┐         ┌──────────────┐
│    User     │────────→│   Subject    │
│  (Teacher)  │ teaches │              │
└─────────────┘         └──────────────┘
       │                       │
       │ marks                 │ belongs to
       ↓                       ↓
┌─────────────┐         ┌──────────────┐
│ Attendance  │←────────│     User     │
│             │         │  (Student)   │
└─────────────┘         └──────────────┘
       │
       │ references
       ↓
┌─────────────┐
│   Holiday   │
│ (Optional)  │
└─────────────┘
```

---

## 📊 Current Database Usage Statistics

### Collections Summary

| Collection | Purpose | Estimated Size* | Key Features |
|------------|---------|----------------|--------------|
| **users** | User accounts | Variable | 3 roles, bcrypt encryption |
| **subjects** | Course catalog | Small-Medium | Teacher assignments |
| **attendances** | Daily records | Large (grows daily) | Compound unique index |
| **holidays** | Holiday calendar | Small | Date-based |

*Size depends on institution scale

---

## 🔐 Security Features

### 1. **Password Security**
- ✅ Bcrypt hashing with salt rounds: 10
- ✅ Pre-save middleware for automatic hashing
- ✅ Never stores plain-text passwords

### 2. **Data Validation**
- ✅ Email format validation using regex
- ✅ Required field enforcement
- ✅ Enum validation for roles and status
- ✅ Conditional requirements (e.g., semester for students)

### 3. **Data Integrity**
- ✅ Unique constraints on critical fields
- ✅ Compound indexes to prevent duplicates
- ✅ Sparse indexes for optional unique fields
- ✅ Referential integrity via ObjectId references

---

## 🚀 Database Operations

### Common Operations by Role

#### **Admin Operations**
- ✅ Create/Read/Update/Delete Users (all roles)
- ✅ Create/Read/Update/Delete Subjects
- ✅ Manage Holidays
- ✅ View all Attendance records
- ✅ Import students via Excel (bulk operations)

#### **Teacher Operations**
- ✅ Read assigned Subjects
- ✅ Create Attendance records
- ✅ Read Attendance records (own subjects)
- ✅ Read Students (filtered by department/semester)

#### **Student Operations**
- ✅ Read own Attendance records
- ✅ Read own profile
- ✅ View Holidays

---

## 📈 Scalability Considerations

### Current Capacity
Based on MongoDB Atlas Free Tier (M0):
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent

### Growth Projections
For a typical institution:
- **Users**: ~1,000 - 10,000 documents
- **Subjects**: ~100 - 500 documents
- **Attendance**: ~10,000 - 1,000,000+ documents (grows daily)
- **Holidays**: ~50 - 200 documents

### Optimization Strategies
1. ✅ **Indexes**: Compound index on attendance prevents duplicates and speeds queries
2. ✅ **Sparse Indexes**: Reduces index size for optional fields
3. ✅ **Timestamps**: Automatic createdAt/updatedAt for auditing
4. ⚠️ **Future**: Consider archiving old attendance records (>1 year)

---

## 🛠️ Database Dependencies

### NPM Packages
```json
{
  "mongoose": "^8.0.3",      // MongoDB ODM
  "bcryptjs": "^2.4.3",      // Password hashing
  "dotenv": "^16.3.1",       // Environment variables
  "xlsx": "^0.18.5"          // Excel import/export
}
```

---

## 🔄 Cascade Delete Implementation

The application implements cascade deletion to maintain data integrity:

### When a Student is Deleted:
- ✅ All associated attendance records are deleted
- ✅ Prevents orphaned attendance data

### When a Teacher is Deleted:
- ✅ All assigned subjects are deleted
- ✅ All attendance records for those subjects are deleted
- ✅ Prevents orphaned subject and attendance data

**Implementation**: Handled in `server/src/controllers/adminController.js`

---

## 📝 Environment Configuration

### Required Environment Variables
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campustrack?retryWrites=true&w=majority
```

### Database Name
- **Production**: `campustrack` (or as specified in MONGO_URI)
- **Development**: `campustrack-dev` (recommended)

---

## 🔍 Query Patterns

### Most Common Queries

1. **Fetch Students by Department & Semester**
   ```javascript
   User.find({ role: 'student', department: 'CS', semester: '3' })
   ```

2. **Fetch Attendance for a Student**
   ```javascript
   Attendance.find({ studentId: studentId })
     .populate('subjectId')
     .populate('markedBy')
   ```

3. **Fetch Subjects for a Teacher**
   ```javascript
   Subject.find({ teacherId: teacherId })
   ```

4. **Check for Duplicate Attendance**
   ```javascript
   // Prevented by compound unique index
   { studentId: 1, subjectId: 1, date: 1 }
   ```

---

## 📊 Storage Estimation

### Per Document Size (Approximate)

| Collection | Avg Size | Example Count | Total Size |
|------------|----------|---------------|------------|
| User | ~500 bytes | 1,000 users | ~500 KB |
| Subject | ~300 bytes | 200 subjects | ~60 KB |
| Attendance | ~200 bytes | 100,000 records | ~20 MB |
| Holiday | ~250 bytes | 100 holidays | ~25 KB |

**Total Estimated**: ~20.5 MB for a medium-sized institution

---

## ⚠️ Important Notes

1. **Attendance is the largest collection** - grows daily with each class
2. **Indexes are critical** for query performance on large datasets
3. **Cascade deletes** prevent orphaned data but require careful implementation
4. **Sparse indexes** allow multiple null values while maintaining uniqueness
5. **MongoDB Atlas free tier** (512 MB) is sufficient for small-medium institutions

---

## 🔮 Future Enhancements

### Potential Database Additions
- [ ] **Notifications Collection**: For alerts and announcements
- [ ] **Reports Collection**: For cached analytics
- [ ] **Audit Logs Collection**: For tracking all changes
- [ ] **Timetable Collection**: For class scheduling
- [ ] **Assignments Collection**: For homework tracking

### Optimization Opportunities
- [ ] Implement data archiving for old attendance records
- [ ] Add caching layer (Redis) for frequently accessed data
- [ ] Implement database sharding for very large datasets
- [ ] Add read replicas for better query performance

---

## 📞 Database Monitoring

### Key Metrics to Monitor
- ✅ Storage usage (current vs 512 MB limit)
- ✅ Connection count (current vs 500 limit)
- ✅ Query performance (slow query log)
- ✅ Index usage statistics
- ✅ Daily growth rate of attendance collection

### Tools
- **MongoDB Atlas Dashboard**: Real-time monitoring
- **Mongoose Debug Mode**: Query logging in development
- **Application Logs**: Connection status and errors

---

## 📚 Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Mongoose Documentation**: https://mongoosejs.com/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **CampusTrack Deployment Guide**: See `DEPLOYMENT_GUIDE.md`

---

**Last Updated**: February 3, 2026  
**Database Version**: MongoDB 6.x (Atlas)  
**Mongoose Version**: 8.0.3  
**Application**: CampusTrack v1.0.0
