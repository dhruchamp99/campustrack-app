const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register a user (Admin/Teacher/Student) - Usually only Admin creates users, but we might need a setup script or initial admin.
//          We'll implement a 'register' for dev/testing or maybe the problem assumes Admin adds everyone. 
//          "Admin Panel Features: Create Teachers/Students". 
//          So this endpoint might not be public.
//          However, 'api/auth/register' was listed. I will implement it but possibly restrict it or use it for initial setup.
// @route   POST /api/auth/register
// @access  Public (for initial setup) / Admin
const registerUser = async (req, res) => {
    const { name, email, enrollmentNumber, password, role, department, semester } = req.body;

    // Validation
    if (!name || !password || !department || !role) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    // If student, check enrollment. If teacher/admin, check email.
    let userExists;
    if (role === 'student') {
        if (!enrollmentNumber) return res.status(400).json({ message: 'Enrollment number is required for students' });
        userExists = await User.findOne({ enrollmentNumber });
    } else {
        if (!email) return res.status(400).json({ message: 'Email is required for teachers/admins' });
        userExists = await User.findOne({ email });
    }

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    try {
        const user = await User.create({
            name,
            email,
            enrollmentNumber,
            password,
            role,
            department,
            semester
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, enrollmentNumber, password, role } = req.body; // Role optional in login often, but helps disambiguate credential type

    // Identify user by email or enrollment
    let user;
    if (email) {
        user = await User.findOne({ email });
    } else if (enrollmentNumber) {
        user = await User.findOne({ enrollmentNumber });
    } else {
        return res.status(400).json({ message: 'Please provide email or enrollment number' });
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/profile
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        enrollmentNumber: user.enrollmentNumber
    });
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
