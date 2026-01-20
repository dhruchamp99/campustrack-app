const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Attendance = require('./src/models/Attendance');

dotenv.config();

const checkStudentData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campustrack');
        console.log('MongoDB Connected\n');

        // Get the enrollment number from command line or use default
        const enrollmentNumber = process.argv[2] || 'CS107';

        console.log(`🔍 Checking data for student: ${enrollmentNumber}\n`);

        // Find the student
        const student = await User.findOne({ enrollmentNumber, role: 'student' });

        if (!student) {
            console.log('❌ Student not found!');
            console.log('Make sure the student was created successfully.');
            process.exit(1);
        }

        console.log('✅ Student found:');
        console.log(`   ID: ${student._id}`);
        console.log(`   Name: ${student.name}`);
        console.log(`   Department: ${student.department}`);
        console.log(`   Semester: ${student.semester}`);
        console.log('');

        // Check attendance records
        const attendanceRecords = await Attendance.find({ studentId: student._id })
            .populate('subjectId', 'subjectName subjectCode')
            .populate('markedBy', 'name')
            .sort({ date: -1 });

        console.log(`📊 Attendance Records: ${attendanceRecords.length} total\n`);

        if (attendanceRecords.length === 0) {
            console.log('⚠️  No attendance records found for this student.');
            console.log('   This is normal if attendance hasn\'t been marked yet.');
        } else {
            attendanceRecords.forEach((record, index) => {
                console.log(`${index + 1}. ${new Date(record.date).toLocaleDateString()}`);
                console.log(`   Subject: ${record.subjectId?.subjectName || 'Unknown'} (${record.subjectId?.subjectCode})`);
                console.log(`   Status: ${record.status.toUpperCase()}`);
                console.log(`   Marked by: ${record.markedBy?.name || 'Unknown'}`);
                console.log('');
            });

            // Calculate percentage
            const present = attendanceRecords.filter(r => r.status === 'present').length;
            const percentage = ((present / attendanceRecords.length) * 100).toFixed(1);
            console.log(`📈 Attendance Summary:`);
            console.log(`   Present: ${present}/${attendanceRecords.length}`);
            console.log(`   Percentage: ${percentage}%`);
        }

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkStudentData();
