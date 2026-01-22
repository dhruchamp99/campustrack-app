const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    markAttendance,
    getSubjectAttendance,
    getStudentAttendance,
    getAttendanceReport,
    getTeacherSubmittedAttendance
} = require('../controllers/attendanceController');

router.use(protect);

// Mark attendance - Teachers only
router.post('/mark', authorize('teacher', 'admin'), markAttendance);

// View subject attendance - Teachers/Admin
router.get('/subject/:subjectId', authorize('teacher', 'admin'), getSubjectAttendance);

// View student attendance - Student (own), Admin, Teacher (maybe)
// The controller checks if student is accessing their own data.
router.get('/student/:studentId', getStudentAttendance);

// Get teacher's submitted attendance records - Teachers only
router.get('/teacher/submitted', authorize('teacher'), getTeacherSubmittedAttendance);

router.get('/report', authorize('admin'), getAttendanceReport);

module.exports = router;
