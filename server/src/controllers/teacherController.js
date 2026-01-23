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

        // FIX: Convert semester to number to handle both string and number types
        const semesterNumber = parseInt(subject.semester);

        // FIX: Trim department to remove any extra whitespace
        const departmentTrimmed = subject.department ? subject.department.trim() : subject.department;

        console.log('=== FETCHING STUDENTS ===');
        console.log('Subject:', subject.subjectName);
        console.log('Department (original):', subject.department);
        console.log('Department (trimmed):', departmentTrimmed);
        console.log('Semester (original):', subject.semester, 'type:', typeof subject.semester);
        console.log('Semester (converted):', semesterNumber, 'type:', typeof semesterNumber);

        // Try to find students with flexible matching
        const students = await require('../models/User').find({
            role: 'student',
            department: departmentTrimmed,
            $or: [
                { semester: subject.semester },      // Try original value
                { semester: semesterNumber },        // Try as number
                { semester: String(subject.semester) } // Try as string
            ]
        }).select('-password').sort({ enrollmentNumber: 1 });

        console.log('Students found:', students.length);
        console.log('========================');

        res.json(students);
    } catch (error) {
        console.error('Error in getStudentsForSubject:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssignedSubjects,
    getStudentsForSubject
};
