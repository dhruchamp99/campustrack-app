const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

// User schema (simplified)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    enrollmentNumber: String,
    password: String,
    role: String,
    department: String,
    semester: Number
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@campustrack.com' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const admin = new User({
                name: 'Admin',
                email: 'admin@campustrack.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Administration'
            });

            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('   Email: admin@campustrack.com');
            console.log('   Password: admin123');
        }

        // Create a test student
        const existingStudent = await User.findOne({ enrollmentNumber: 'cs101' });

        if (!existingStudent) {
            const hashedPassword = await bcrypt.hash('student123', 10);

            const student = new User({
                name: 'Test Student',
                enrollmentNumber: 'cs101',
                password: hashedPassword,
                role: 'student',
                department: 'Computer Science',
                semester: 1
            });

            await student.save();
            console.log('✅ Test student created!');
            console.log('   Enrollment: cs101');
            console.log('   Password: student123');
        }

        // Create a test teacher
        const existingTeacher = await User.findOne({ email: 'teacher1@campus.com' });

        if (!existingTeacher) {
            const hashedPassword = await bcrypt.hash('teacher123', 10);

            const teacher = new User({
                name: 'Test Teacher',
                email: 'teacher1@campus.com',
                password: hashedPassword,
                role: 'teacher',
                department: 'Computer Science'
            });

            await teacher.save();
            console.log('✅ Test teacher created!');
            console.log('   Email: teacher1@campus.com');
            console.log('   Password: teacher123');
        }

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedAdmin();
