const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAssignedSubjects } = require('../controllers/teacherController');

router.use(protect);
router.use(authorize('teacher'));

router.get('/subjects', getAssignedSubjects);
router.get('/students/:subjectId', require('../controllers/teacherController').getStudentsForSubject); // Ensure imported if not

module.exports = router;
