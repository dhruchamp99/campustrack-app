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

        // FIX: Trim department to remove any extra whitespace (though identifying based on array now)
        // const departmentTrimmed = subject.department ? subject.department.trim() : subject.department;

        // NEW LOGIC: Use arrays for Departments and Semesters
        const targetDepartments = subject.departments && subject.departments.length > 0
            ? subject.departments
            : [subject.department]; // Fallback to old field if array empty

        const targetSemesters = subject.semesters && subject.semesters.length > 0
            ? subject.semesters
            : [subject.semester]; // Fallback

        // Handle string/number semester matching
        const targetSemestersMixed = [
            ...targetSemesters,
            ...targetSemesters.map(s => parseInt(s)).filter(n => !isNaN(n)),
            ...targetSemesters.map(s => String(s))
        ];

        // Batch Filtering Configuration
        let batchQuery = {};

        // 1. Base Allowed Batches from Subject
        let effectiveAllowedBatches = [];
        if (subject.subjectType === 'Lab' && subject.allowedBatches && subject.allowedBatches.length > 0) {
            effectiveAllowedBatches = subject.allowedBatches;
        }

        // 2. Dynamic Override from Query Params (e.g., ?batches=A,B)
        // This allows teacher to "Combine Batches" or "Select Specific Batch" on the fly
        if (req.query.batches) {
            const requestedBatches = req.query.batches.split(',').map(b => b.trim());

            if (effectiveAllowedBatches.length > 0) {
                // Security: Only allow requested batches that ARE in the allowed list
                effectiveAllowedBatches = requestedBatches.filter(b => effectiveAllowedBatches.includes(b));
            } else {
                // If subject implies ALL batches (empty allowedBatches), just use requested
                effectiveAllowedBatches = requestedBatches;
            }
        }

        // 3. Construct Query
        if (effectiveAllowedBatches.length > 0) {
            batchQuery = { batch: { $in: effectiveAllowedBatches } };
        } else if (subject.subjectType === 'Lab' && (!subject.allowedBatches || subject.allowedBatches.length === 0)) {
            // Lab with NO restrictions -> Fetch all (No batch query needed)
        }

        console.log('=== FETCHING STUDENTS (SCALED + DYNAMIC) ===');
        console.log('Subject:', subject.subjectName);
        console.log('Type:', subject.subjectType);
        console.log('Depts:', targetDepartments);
        console.log('Sems:', targetSemesters);
        console.log('Effective Batches:', effectiveAllowedBatches);

        // Try to find students with flexible matching
        const students = await require('../models/User').find({
            role: 'student',
            department: { $in: targetDepartments },
            semester: { $in: targetSemestersMixed },
            ...batchQuery
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
