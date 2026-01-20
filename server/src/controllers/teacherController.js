const Subject = require('../models/Subject');

// @desc    Get subjects assigned to teacher
// @route   GET /api/teacher/subjects
// @access  Private (Teacher)
const getAssignedSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ teacherId: req.user.id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get students for a subject (based on dept/sem)
// @route   GET /api/teacher/students/:subjectId
// @access  Private (Teacher)
const getStudentsForSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Check if teacher is assigned? (Security)
        if (subject.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized for this subject' });
        }

        const students = await require('../models/User').find({
            role: 'student',
            department: subject.department,
            semester: subject.semester
        }).select('-password').sort({ name: 1 });

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssignedSubjects,
    getStudentsForSubject
};
