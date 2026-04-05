const User = require('../models/User');
const Subject = require('../models/Subject');
const Holiday = require('../models/Holiday');
const SemesterPromotion = require('../models/SemesterPromotion');
const { getCurrentAcademicYear } = require('../utils/academicYear');

// --- USER MANAGEMENT ---

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private (Admin)
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a Teacher
// @route   POST /api/admin/teachers
// @access  Private (Admin)
// NOTE: Reusing register logic or creating specific function. 
// Ideally we call the user creation logic, but doing it here allows specific validation/fields
const addTeacher = async (req, res) => {
    // Logic similar to register but enforced role 'teacher'
    // For brevity, assuming frontend calls /api/auth/register or we implement here.
    // Let's implement robust creation here.
    const { name, email, password, department } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Teacher already exists' });

        const user = await User.create({
            name, email, password, department, role: 'teacher'
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addStudent = async (req, res) => {
    const { name, email, enrollmentNumber, password, department, semester, batch } = req.body;
    try {
        const userExists = await User.findOne({ enrollmentNumber });
        if (userExists) return res.status(400).json({ message: 'Student already exists' });

        const user = await User.create({
            name, email, enrollmentNumber, password, department, semester,
            batch: batch || null, // Optional batch
            role: 'student'
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Import students from Excel
// @route   POST /api/admin/students/import
// @access  Private (Admin)
const importStudents = async (req, res) => {
    try {
        const { students } = req.body;

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'No students data provided' });
        }

        const results = {
            success: [],
            failed: [],
            skipped: []
        };

        for (const studentData of students) {
            try {
                // Validate required fields
                if (!studentData.enrollmentNumber || !studentData.name || !studentData.department || !studentData.semester) {
                    results.failed.push({
                        data: studentData,
                        reason: 'Missing required fields (enrollmentNumber, name, department, or semester)'
                    });
                    continue;
                }

                // Check if student already exists
                const existingStudent = await User.findOne({ enrollmentNumber: studentData.enrollmentNumber });
                if (existingStudent) {
                    results.skipped.push({
                        enrollmentNumber: studentData.enrollmentNumber,
                        name: studentData.name,
                        reason: 'Student already exists'
                    });
                    continue;
                }

                // Create student with default password if not provided
                const password = studentData.password || '123';

                const newStudent = await User.create({
                    name: studentData.name,
                    email: studentData.email || null,
                    enrollmentNumber: studentData.enrollmentNumber,
                    password: password,
                    department: studentData.department,
                    semester: String(studentData.semester),
                    batch: studentData.batch || studentData.Batch || null, // Support batch column
                    role: 'student'
                });

                results.success.push({
                    enrollmentNumber: newStudent.enrollmentNumber,
                    name: newStudent.name
                });
            } catch (error) {
                results.failed.push({
                    data: studentData,
                    reason: error.message
                });
            }
        }

        res.status(200).json({
            message: 'Import completed',
            summary: {
                total: students.length,
                success: results.success.length,
                failed: results.failed.length,
                skipped: results.skipped.length
            },
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, enrollmentNumber, department, semester, password, batch } = req.body;

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (enrollmentNumber) user.enrollmentNumber = enrollmentNumber;
        if (department) user.department = department;
        if (semester) user.semester = semester;
        if (batch) user.batch = batch;
        if (password) user.password = password; // Will be hashed by pre-save hook

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If deleting a student, remove them from all attendance session arrays
        if (user.role === 'student') {
            const Attendance = require('../models/Attendance');
            await Attendance.updateMany(
                {},
                { $pull: { presentStudents: req.params.id, absentStudents: req.params.id } }
            );
            console.log(`Removed student ${user.name} from all attendance records`);
        }

        // If deleting a teacher, unassign them from subjects
        if (user.role === 'teacher') {
            const Subject = require('../models/Subject');
            await Subject.updateMany(
                { teacherId: req.params.id },
                { $unset: { teacherId: "" } }
            );
            console.log(`Unassigned subjects for teacher ${user.name}`);
        }

        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// --- SUBJECT MANAGEMENT ---

const createSubject = async (req, res) => {
    const {
        subjectName, subjectCode, teacherId,
        semester, department, // Legacy inputs
        departments, semesters, subjectType, allowedBatches // New inputs
    } = req.body;

    try {
        // Fallback logic for arrays
        const finalDepartments = departments && departments.length > 0 ? departments : (department ? [department] : []);
        const finalSemesters = semesters && semesters.length > 0 ? semesters : (semester ? [semester] : []);

        const subject = await Subject.create({
            subjectName,
            subjectCode,
            teacherId,
            department: department || finalDepartments[0], // Keep legacy field populated
            semester: semester || finalSemesters[0],       // Keep legacy field populated
            departments: finalDepartments,
            semesters: finalSemesters,
            subjectType: subjectType || 'Theory',
            allowedBatches: allowedBatches || []
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllSubjects = async (req, res) => {
    try {
        // Populate teacher name/email
        const subjects = await Subject.find().populate('teacherId', 'name email');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const {
            teacherId, subjectName, subjectCode,
            department, semester,
            departments, semesters, subjectType, allowedBatches
        } = req.body;

        if (teacherId) subject.teacherId = teacherId;
        if (subjectName) subject.subjectName = subjectName;
        if (subjectCode) subject.subjectCode = subjectCode;

        // Update both legacy and new fields
        if (department) {
            subject.department = department;
            // If departments array not provided, ensure this one is in it (or reset it? safer to append or sync)
            if (!departments) {
                if (!subject.departments.includes(department)) subject.departments.push(department);
            }
        }
        if (semester) {
            subject.semester = semester;
            if (!semesters) {
                if (!subject.semesters.includes(semester)) subject.semesters.push(semester);
            }
        }

        // Overwrite full arrays if provided
        if (departments) {
            subject.departments = departments;
            subject.department = departments[0] || subject.department; // Sync legacy
        }
        if (semesters) {
            subject.semesters = semesters;
            subject.semester = semesters[0] || subject.semester; // Sync legacy
        }

        if (subjectType) subject.subjectType = subjectType;
        if (allowedBatches) subject.allowedBatches = allowedBatches;

        await subject.save();
        res.json({ message: 'Subject updated successfully', subject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- HOLIDAY MANAGEMENT ---

const addHoliday = async (req, res) => {
    const { date, title, description, type } = req.body;
    try {
        const holiday = await Holiday.create({ date, title, description, type });
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- SEMESTER PROMOTION ---

// @desc    Preview students for semester promotion
// @route   GET /api/admin/semester/preview
// @access  Private (Admin)
const previewSemesterPromotion = async (req, res) => {
    try {
        const { department, semester } = req.query;

        if (!department || !semester) {
            return res.status(400).json({ message: 'Department and semester are required' });
        }

        const students = await User.find({
            role: 'student',
            department: department,
            semester: semester
        }).select('-password').sort({ enrollmentNumber: 1 });

        res.json({
            students,
            total: students.length,
            fromSemester: semester,
            toSemester: String(parseInt(semester) + 1),
            department
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Execute semester promotion
// @route   POST /api/admin/semester/promote
// @access  Private (Admin)
const executeSemesterPromotion = async (req, res) => {
    try {
        const { department, fromSemester, toSemester, studentIds } = req.body;

        // Validate inputs
        if (!department || !fromSemester || !toSemester || !studentIds || studentIds.length === 0) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate semester progression
        if (parseInt(toSemester) !== parseInt(fromSemester) + 1) {
            return res.status(400).json({ message: 'Target semester must be exactly one more than current semester' });
        }

        // Verify all students exist and are in the correct department/semester
        const students = await User.find({
            _id: { $in: studentIds },
            role: 'student',
            department: department,
            semester: fromSemester
        }).select('name enrollmentNumber');

        if (students.length === 0) {
            return res.status(400).json({ message: 'No valid students found matching the criteria' });
        }

        if (students.length !== studentIds.length) {
            return res.status(400).json({
                message: `Only ${students.length} of ${studentIds.length} students match the department/semester. Some may have already been promoted.`
            });
        }

        // Execute the promotion
        const result = await User.updateMany(
            { _id: { $in: studentIds } },
            { $set: { semester: toSemester } }
        );

        // Create audit log
        const promotionLog = await SemesterPromotion.create({
            promotedBy: req.user.id,
            fromSemester,
            toSemester,
            department,
            academicYear: getCurrentAcademicYear(),
            students: students.map(s => ({
                studentId: s._id,
                name: s.name,
                enrollmentNumber: s.enrollmentNumber
            })),
            totalPromoted: result.modifiedCount
        });

        res.status(200).json({
            message: `Successfully promoted ${result.modifiedCount} students from Semester ${fromSemester} to Semester ${toSemester}`,
            promoted: result.modifiedCount,
            promotionId: promotionLog._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Undo a semester promotion
// @route   POST /api/admin/semester/undo/:promotionId
// @access  Private (Admin)
const undoSemesterPromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;

        const promotion = await SemesterPromotion.findById(promotionId);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion record not found' });
        }

        if (promotion.undone) {
            return res.status(400).json({ message: 'This promotion has already been undone' });
        }

        // Get student IDs from the promotion record
        const studentIds = promotion.students.map(s => s.studentId);

        // Revert: set semester back to fromSemester for students who are still in toSemester
        const result = await User.updateMany(
            {
                _id: { $in: studentIds },
                semester: promotion.toSemester  // Only revert students still in the promoted semester
            },
            { $set: { semester: promotion.fromSemester } }
        );

        // Mark promotion as undone
        promotion.undone = true;
        promotion.undoneAt = new Date();
        promotion.undoneBy = req.user.id;
        await promotion.save();

        res.status(200).json({
            message: `Successfully reverted ${result.modifiedCount} students from Semester ${promotion.toSemester} back to Semester ${promotion.fromSemester}`,
            reverted: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get promotion history
// @route   GET /api/admin/semester/history
// @access  Private (Admin)
const getPromotionHistory = async (req, res) => {
    try {
        const history = await SemesterPromotion.find()
            .populate('promotedBy', 'name email')
            .populate('undoneBy', 'name email')
            .sort({ promotedAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
    addHoliday,
    previewSemesterPromotion,
    executeSemesterPromotion,
    undoSemesterPromotion,
    getPromotionHistory
};
