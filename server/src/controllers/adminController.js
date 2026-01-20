const User = require('../models/User');
const Subject = require('../models/Subject');
const Holiday = require('../models/Holiday');

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
    const { name, email, enrollmentNumber, password, department, semester } = req.body;
    try {
        const userExists = await User.findOne({ enrollmentNumber });
        if (userExists) return res.status(400).json({ message: 'Student already exists' });

        const user = await User.create({
            name, email, enrollmentNumber, password, department, semester, role: 'student'
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, enrollmentNumber, department, semester, password } = req.body;

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (enrollmentNumber) user.enrollmentNumber = enrollmentNumber;
        if (department) user.department = department;
        if (semester) user.semester = semester;
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

        // If deleting a student, also delete their attendance records
        if (user.role === 'student') {
            const Attendance = require('../models/Attendance');
            await Attendance.deleteMany({ studentId: req.params.id });
            console.log(`Deleted attendance records for student ${user.name}`);
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
    const { subjectName, subjectCode, teacherId, semester, department } = req.body;
    try {
        const subject = await Subject.create({
            subjectName, subjectCode, teacherId, semester, department
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllSubjects = async (req, res) => {
    try {
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

        const { teacherId, subjectName, subjectCode, department, semester } = req.body;

        if (teacherId) subject.teacherId = teacherId;
        if (subjectName) subject.subjectName = subjectName;
        if (subjectCode) subject.subjectCode = subjectCode;
        if (department) subject.department = department;
        if (semester) subject.semester = semester;

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

module.exports = {
    getAllStudents,
    getAllTeachers,
    addTeacher,
    addStudent,
    updateUser,
    deleteUser,
    createSubject,
    getAllSubjects,
    updateSubject,
    addHoliday
};
