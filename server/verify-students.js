const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/campustrack').then(async () => {
    const students = await User.find({
        role: 'student',
        department: 'Computer Science'
    }).sort({ enrollmentNumber: 1 });

    console.log('═══════════════════════════════════════');
    console.log('📊 Computer Science Students Summary');
    console.log('═══════════════════════════════════════');
    console.log('Total CS Students:', students.length);
    console.log('');
    console.log('Sample Students (First 10):');
    students.slice(0, 10).forEach(s => {
        console.log(`  ✅ ${s.enrollmentNumber}: ${s.name} (Semester ${s.semester})`);
    });
    console.log('  ...');
    console.log('');
    console.log('Last 5 Students:');
    students.slice(-5).forEach(s => {
        console.log(`  ✅ ${s.enrollmentNumber}: ${s.name} (Semester ${s.semester})`);
    });
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('Student Details:');
    console.log('- Department: Computer Science');
    console.log('- Semester: 4');
    console.log('- Password: 123 (for all students)');
    console.log('═══════════════════════════════════════');

    process.exit();
});
