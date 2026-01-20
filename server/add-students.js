const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const addMoreStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campustrack');
        console.log('MongoDB Connected');

        // Add more students for Semester 4 Computer Science
        const students = [
            {
                name: 'Raj Patel',
                enrollmentNumber: 'CS102',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: '4'
            },
            {
                name: 'Priya Shah',
                enrollmentNumber: 'CS103',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: '4'
            },
            {
                name: 'Amit Kumar',
                enrollmentNumber: 'CS104',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: '4'
            },
            {
                name: 'Sneha Desai',
                enrollmentNumber: 'CS105',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: '4'
            },
            {
                name: 'Karan Mehta',
                enrollmentNumber: 'CS106',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: '4'
            }
        ];

        // Check and create students
        for (const studentData of students) {
            const exists = await User.findOne({ enrollmentNumber: studentData.enrollmentNumber });
            if (!exists) {
                await User.create(studentData);
                console.log(`✅ Created student: ${studentData.name} (${studentData.enrollmentNumber})`);
            } else {
                console.log(`⚠️  Student ${studentData.enrollmentNumber} already exists`);
            }
        }

        console.log('\n✅ Student seeding completed!');
        console.log('\nAll Semester 4 Computer Science Students:');
        const allStudents = await User.find({
            role: 'student',
            department: 'Computer Science',
            semester: '4'
        }).select('name enrollmentNumber');

        allStudents.forEach(s => {
            console.log(`   - ${s.enrollmentNumber}: ${s.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

addMoreStudents();
