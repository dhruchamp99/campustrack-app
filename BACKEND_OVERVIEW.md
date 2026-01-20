# 🎯 Backend Technology Stack - Quick Overview

## **MERN Stack Backend**

```
┌─────────────────────────────────────────────┐
│         CampusTrack Backend                 │
│                                             │
│  Node.js + Express.js + MongoDB + Mongoose  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ **Core Technologies**

### **Runtime & Framework:**
```
Node.js (v14+)
    └── Express.js (v4.18.2)
        └── RESTful API Server
```

### **Database:**
```
MongoDB (Local/Atlas)
    └── Mongoose (v8.0.3)
        └── ODM (Object Data Modeling)
```

---

## 📦 **Key Dependencies**

### **Security:**
- 🔐 **bcryptjs** - Password hashing
- 🎫 **jsonwebtoken** - JWT authentication
- 🛡️ **helmet** - Security headers
- 🌐 **cors** - Cross-origin requests

### **Utilities:**
- 📝 **morgan** - HTTP logging
- 🔧 **dotenv** - Environment config
- 🍪 **cookie-parser** - Cookie handling
- 🔄 **nodemon** - Auto-restart (dev)

---

## 🏗️ **Architecture**

```
┌──────────────┐
│   Client     │ (React)
└──────┬───────┘
       │ HTTP/REST
       ↓
┌──────────────┐
│   Express    │ (Routes + Middleware)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Controllers  │ (Business Logic)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   Models     │ (Mongoose Schemas)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   MongoDB    │ (Database)
└──────────────┘
```

---

## 🗂️ **Database Models**

1. **User** - Students, Teachers, Admin
2. **Subject** - Course information
3. **Attendance** - Attendance records
4. **Holiday** - Holiday calendar

---

## 🛣️ **API Endpoints**

```
/api/auth/*         → Authentication
/api/admin/*        → Admin operations
/api/teacher/*      → Teacher operations
/api/student/*      → Student operations
/api/attendance/*   → Attendance management
```

---

## 🔐 **Authentication Flow**

```
1. User Login
   ↓
2. Verify Credentials (bcryptjs)
   ↓
3. Generate JWT Token
   ↓
4. Return Token to Client
   ↓
5. Client Stores Token
   ↓
6. Client Sends Token in Headers
   ↓
7. Server Verifies Token (JWT)
   ↓
8. Grant Access Based on Role
```

---

## 🎭 **Roles & Permissions**

| Role | Access |
|------|--------|
| **Admin** | Full system access |
| **Teacher** | Mark attendance, view subjects |
| **Student** | View own attendance |

---

## ⚡ **Key Features**

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs encryption  
✅ **Role-Based Access** - RBAC implementation  
✅ **Cascade Delete** - Data integrity  
✅ **Auto-Refresh** - Real-time updates  
✅ **RESTful API** - Clean endpoints  
✅ **Error Handling** - Global error handler  
✅ **Security Headers** - Helmet.js  

---

## 🚀 **Running the Server**

```bash
# Development
cd server
npm install
npm run dev

# Production
npm start
```

**Server URL:** `http://localhost:5000`

---

## 📊 **Tech Stack Summary**

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Auth** | JWT + bcryptjs |
| **Security** | Helmet + CORS |
| **Logging** | Morgan |
| **Dev Tool** | Nodemon |

---

## 🎯 **Why This Stack?**

✅ **Scalable** - Handles concurrent requests  
✅ **Fast** - Non-blocking I/O  
✅ **Flexible** - NoSQL schema  
✅ **Secure** - Industry-standard auth  
✅ **Popular** - Large community  
✅ **Modern** - Latest best practices  

---

**The backend is production-ready!** 🚀
