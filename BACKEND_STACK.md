# 🚀 CampusTrack Backend - Technology Stack & Architecture

## 📋 **Overview**

The CampusTrack backend is built using the **MERN Stack** with a focus on security, scalability, and clean architecture.

---

## 🛠️ **Technology Stack**

### **Core Technologies:**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v14+ | JavaScript runtime environment |
| **Express.js** | ^4.18.2 | Web application framework |
| **MongoDB** | Local/Atlas | NoSQL database |
| **Mongoose** | ^8.0.3 | MongoDB object modeling (ODM) |

### **Security & Authentication:**

| Package | Version | Purpose |
|---------|---------|---------|
| **bcryptjs** | ^2.4.3 | Password hashing |
| **jsonwebtoken** | ^9.0.2 | JWT token generation & verification |
| **helmet** | ^7.1.0 | Security headers |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing |

### **Utilities:**

| Package | Version | Purpose |
|---------|---------|---------|
| **dotenv** | ^16.3.1 | Environment variables |
| **morgan** | ^1.10.0 | HTTP request logger |
| **cookie-parser** | ^1.4.6 | Cookie parsing |
| **nodemon** | ^3.0.2 | Auto-restart on file changes (dev) |

---

## 📁 **Project Structure**

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication logic
│   │   ├── attendanceController.js # Attendance management
│   │   └── teacherController.js  # Teacher operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification, role checks
│   ├── models/
│   │   ├── User.js               # User schema (students, teachers, admin)
│   │   ├── Subject.js            # Subject schema
│   │   ├── Attendance.js         # Attendance records
│   │   └── Holiday.js            # Holiday calendar
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── adminRoutes.js        # /api/admin/*
│   │   ├── teacherRoutes.js      # /api/teacher/*
│   │   ├── studentRoutes.js      # /api/student/*
│   │   └── attendanceRoutes.js   # /api/attendance/*
│   └── server.js                 # Main entry point
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── update-admin-email.js         # Utility script
```

---

## 🔐 **Authentication & Security**

### **JWT Authentication:**
- **Token-based authentication** using JSON Web Tokens
- Tokens stored in localStorage on client-side
- Sent via `Authorization: Bearer <token>` header
- Token expiration: Configurable (default: 30 days)

### **Password Security:**
- Passwords hashed using **bcryptjs** (10 salt rounds)
- Never stored in plain text
- Automatic hashing on user creation/update

### **Role-Based Access Control (RBAC):**
```javascript
Roles:
- admin    → Full access to all resources
- teacher  → Manage attendance, view assigned subjects
- student  → View own attendance, dashboard
```

### **Security Middleware:**
- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configured for cross-origin requests
- **Input Validation** - Required fields validation
- **Error Handling** - Global error handler

---

## 🗄️ **Database Schema**

### **1. User Model** (`User.js`)
```javascript
{
  name: String (required),
  email: String (unique, for teachers/admin),
  enrollmentNumber: String (unique, for students),
  password: String (required, hashed),
  role: String (enum: ['student', 'teacher', 'admin']),
  department: String (required),
  semester: Number (for students),
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Subject Model** (`Subject.js`)
```javascript
{
  subjectName: String (required),
  subjectCode: String (required, unique),
  department: String (required),
  semester: Number (required),
  teacherId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### **3. Attendance Model** (`Attendance.js`)
```javascript
{
  studentId: ObjectId (ref: 'User', required),
  subjectId: ObjectId (ref: 'Subject', required),
  date: Date (required),
  status: String (enum: ['present', 'absent'], required),
  markedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### **4. Holiday Model** (`Holiday.js`)
```javascript
{
  name: String (required),
  date: Date (required),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛣️ **API Routes**

### **Authentication Routes** (`/api/auth`)
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login (returns JWT token)
GET    /api/auth/me          # Get current user (protected)
```

### **Admin Routes** (`/api/admin`)
```
GET    /api/admin/students         # Get all students
POST   /api/admin/students         # Create student
PUT    /api/admin/users/:id        # Update user
DELETE /api/admin/users/:id        # Delete user (cascade)

GET    /api/admin/teachers         # Get all teachers
POST   /api/admin/teachers         # Create teacher

GET    /api/admin/subjects         # Get all subjects
POST   /api/admin/subjects         # Create subject
PUT    /api/admin/subjects/:id     # Update subject (assign teacher)
DELETE /api/admin/subjects/:id     # Delete subject
```

### **Teacher Routes** (`/api/teacher`)
```
GET    /api/teacher/subjects       # Get assigned subjects
POST   /api/teacher/attendance     # Mark attendance
GET    /api/teacher/students       # Get students by subject
```

### **Student Routes** (`/api/student`)
```
GET    /api/student/attendance     # Get own attendance
GET    /api/student/subjects       # Get enrolled subjects
```

### **Attendance Routes** (`/api/attendance`)
```
GET    /api/attendance/report              # Get attendance report (admin)
GET    /api/attendance/student/:studentId  # Get student attendance
POST   /api/attendance                     # Mark attendance
```

---

## 🔄 **Key Features**

### **1. Cascade Delete**
When deleting users:
- **Student deletion** → All attendance records deleted
- **Teacher deletion** → Subjects unassigned (not deleted)

### **2. Auto-Refresh**
- Admin dashboard auto-refreshes every 30 seconds
- Student dashboard auto-refreshes every 30 seconds
- Real-time data synchronization

### **3. Data Validation**
- Required field validation
- Unique constraint enforcement
- Role-based data access

### **4. Error Handling**
- Global error handler
- Detailed error messages in development
- Generic messages in production

---

## ⚙️ **Environment Variables**

```env
PORT=5000                                          # Server port
MONGO_URI=mongodb://localhost:27017/campustrack   # MongoDB connection
JWT_SECRET=supersecretkey_campustrack_2024        # JWT signing key
NODE_ENV=development                               # Environment mode
```

---

## 🚀 **Running the Backend**

### **Development Mode:**
```bash
cd server
npm install
npm run dev
```
- Runs on: `http://localhost:5000`
- Auto-restarts on file changes (nodemon)

### **Production Mode:**
```bash
npm start
```

---

## 📊 **Database Connection**

### **Local MongoDB:**
```javascript
// config/db.js
mongoose.connect('mongodb://localhost:27017/campustrack')
```

### **MongoDB Atlas (Cloud):**
```javascript
// Update MONGO_URI in .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campustrack
```

---

## 🔒 **Middleware Flow**

```
Request → CORS → Helmet → Morgan → JSON Parser → Routes → Auth Middleware → Controller → Response
```

### **Auth Middleware:**
```javascript
1. Extract token from Authorization header
2. Verify JWT token
3. Decode user info
4. Attach user to req.user
5. Check role permissions
6. Allow/Deny access
```

---

## 📝 **API Response Format**

### **Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "stack": "..." // Only in development
}
```

---

## 🧪 **Testing**

### **Manual Testing:**
- Use **Postman** or **Thunder Client**
- Import API collection
- Test all endpoints

### **Database Testing:**
```bash
# Check student data
node update-admin-email.js

# Connect to MongoDB
mongosh
use campustrack
db.users.find()
```

---

## 🔧 **Utility Scripts**

### **Update Admin Email:**
```bash
node update-admin-email.js
```
- Updates admin email in database
- Useful for resetting credentials

---

## 📈 **Performance Optimizations**

1. **Mongoose Indexing** - Unique indexes on email, enrollmentNumber
2. **Lean Queries** - Use `.lean()` for read-only operations
3. **Population** - Efficient data fetching with `.populate()`
4. **Connection Pooling** - MongoDB connection reuse
5. **Error Caching** - Minimize database queries

---

## 🛡️ **Security Best Practices**

✅ **Password Hashing** - bcryptjs with salt rounds  
✅ **JWT Tokens** - Secure token generation  
✅ **CORS Configuration** - Controlled cross-origin access  
✅ **Helmet Headers** - Security HTTP headers  
✅ **Input Validation** - Required field checks  
✅ **Role-Based Access** - Protected routes  
✅ **Environment Variables** - Sensitive data in .env  

---

## 📦 **Deployment**

### **Recommended Platforms:**
- **Render** - Free tier available
- **Railway** - Easy deployment
- **Heroku** - Classic choice
- **DigitalOcean** - VPS option

### **Deployment Steps:**
1. Set environment variables
2. Update MONGO_URI to cloud database
3. Set NODE_ENV=production
4. Deploy code
5. Test API endpoints

---

## 🎯 **Summary**

**Backend Stack:**
- ✅ **Node.js + Express** - Fast, scalable server
- ✅ **MongoDB + Mongoose** - Flexible NoSQL database
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **bcryptjs** - Password hashing
- ✅ **RESTful API** - Clean, organized endpoints
- ✅ **MVC Architecture** - Separation of concerns
- ✅ **Middleware** - Security, logging, error handling
- ✅ **Cascade Delete** - Data integrity
- ✅ **Role-Based Access** - Secure permissions

**The backend is production-ready and follows industry best practices!** 🚀
