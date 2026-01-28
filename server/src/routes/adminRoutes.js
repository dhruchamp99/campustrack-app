const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllStudents,
    getAllTeachers,
    addTeacher,
    addStudent,
    importStudents,
    updateUser,
    deleteUser,
    createSubject,
    getAllSubjects,
    updateSubject,
    addHoliday
} = require('../controllers/adminController');

// All routes here require Admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/students', getAllStudents);
router.post('/students', addStudent);
router.post('/students/import', importStudents);
router.put('/users/:id', updateUser); // Update student/teacher
router.delete('/users/:id', deleteUser); // Generic delete for student/teacher

router.get('/teachers', getAllTeachers);
router.post('/teachers', addTeacher);

router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);

router.post('/holidays', addHoliday);

module.exports = router;
