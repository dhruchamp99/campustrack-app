const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // Adjust path to models
const connectDB = require('./src/config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campustrack');
        console.log('MongoDB Connected for Seeding');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@campustrack.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        // Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@campustrack.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin',
            department: 'Administration',
            semester: 'N/A'
        });

        console.log('Admin User Created Successfully');
        console.log('Email: admin@campustrack.com');
        console.log('Password: admin123');

        // Create a Demo Teacher
        await User.create({
            name: 'John Doe',
            email: 'teacher@campustrack.com',
            password: 'teacher123',
            role: 'teacher',
            department: 'Computer Science'
        });
        console.log('Demo Teacher Created: teacher@campustrack.com / teacher123');

        // Create a Demo Student
        await User.create({
            name: 'Jane Smith',
            enrollmentNumber: 'CS101',
            password: 'student123',
            role: 'student',
            department: 'Computer Science',
            semester: '3'
        });
        console.log('Demo Student Created: CS101 / student123');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
