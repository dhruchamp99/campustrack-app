const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

// User schema
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

// Random Indian first and last names
const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
    'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Navya', 'Anika', 'Pari', 'Sara', 'Myra'
];

const lastNames = [
    'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi', 'Mehta', 'Nair', 'Shah',
    'Verma', 'Rao', 'Iyer', 'Desai', 'Pandey', 'Agarwal', 'Malhotra', 'Chopra', 'Kapoor', 'Bhat'
];

function getRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

async function addStudents() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const hashedPassword = await bcrypt.hash('123', 10);
        const students = [];

        // Create 20 students with enrollment numbers from 241120107001 to 241120107020
        for (let i = 1; i <= 20; i++) {
            const enrollmentNumber = `24112010700${i < 10 ? '0' + i : i}`;

            // Check if student already exists
            const existing = await User.findOne({ enrollmentNumber });
            if (existing) {
                console.log(`⚠️  Student ${enrollmentNumber} already exists, skipping...`);
                continue;
            }

            const student = {
                name: getRandomName(),
                enrollmentNumber: enrollmentNumber,
                password: hashedPassword,
                role: 'student',
                department: 'Computer Science',
                semester: 4
            };

            students.push(student);
        }

        if (students.length > 0) {
            await User.insertMany(students);
            console.log(`\n✅ Successfully added ${students.length} students!`);
            console.log('\n📋 Student Details:');
            console.log('Department: Computer Science');
            console.log('Semester: 4');
            console.log('Password: 123');
            console.log('\nEnrollment Numbers:');
            students.forEach((student, index) => {
                console.log(`${index + 1}. ${student.enrollmentNumber} - ${student.name}`);
            });
        } else {
            console.log('ℹ️  All students already exist in the database.');
        }

        console.log('\n🎉 Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addStudents();
