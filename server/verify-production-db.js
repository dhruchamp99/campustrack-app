const mongoose = require('mongoose');

// MongoDB Atlas connection (PRODUCTION) - Same as Render uses
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

async function verifyAndCount() {
    try {
        console.log('🔍 Verifying Production Database...');
        console.log('');
        console.log('Connection String:', MONGO_URI.replace('dhrutrack123', '***'));
        console.log('');

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        console.log('');

        // Count all users by role
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            enrollmentNumber: String,
            role: String,
            department: String,
            semester: Number
        }));

        const students = await User.countDocuments({ role: 'student' });
        const teachers = await User.countDocuments({ role: 'teacher' });
        const admins = await User.countDocuments({ role: 'admin' });

        console.log('📊 User Counts:');
        console.log(`   Students: ${students}`);
        console.log(`   Teachers: ${teachers}`);
        console.log(`   Admins: ${admins}`);
        console.log('');

        // Count CS Semester 4 students
        const csStudents = await User.countDocuments({
            role: 'student',
            department: 'Computer Science',
            semester: 4
        });

        console.log('📊 CS Semester 4 Students: ' + csStudents);
        console.log('');

        // List all students
        const allStudents = await User.find({ role: 'student' }).select('name enrollmentNumber department semester');
        console.log('📋 All Students in Database:');
        if (allStudents.length === 0) {
            console.log('   ❌ NO STUDENTS FOUND!');
        } else {
            allStudents.slice(0, 10).forEach((s, i) => {
                console.log(`   ${i + 1}. ${s.enrollmentNumber} - ${s.name} (${s.department}, Sem ${s.semester})`);
            });
            if (allStudents.length > 10) {
                console.log(`   ... and ${allStudents.length - 10} more`);
            }
        }

        await mongoose.connection.close();
        console.log('');
        console.log('✅ Verification complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verifyAndCount();
