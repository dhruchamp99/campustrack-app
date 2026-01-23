const mongoose = require('mongoose');

// MongoDB Atlas connection (PRODUCTION)
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

// Define schemas
const subjectSchema = new mongoose.Schema({
    subjectName: String,
    subjectCode: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: String,
    semester: Number
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    enrollmentNumber: String,
    password: String,
    role: String,
    department: String,
    semester: Number
});

const Subject = mongoose.model('Subject', subjectSchema);
const User = mongoose.model('User', userSchema);

async function deepDiagnosis() {
    try {
        console.log('🔍 DEEP DIAGNOSIS - Checking Exact Data...');
        console.log('');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas (PRODUCTION)');
        console.log('');

        // Get a sample student
        const sampleStudent = await User.findOne({ role: 'student' });
        console.log('📊 SAMPLE STUDENT DATA:');
        console.log('   Name:', sampleStudent.name);
        console.log('   Enrollment:', sampleStudent.enrollmentNumber);
        console.log('   Department:', `"${sampleStudent.department}"`);
        console.log('   Department Type:', typeof sampleStudent.department);
        console.log('   Semester:', sampleStudent.semester);
        console.log('   Semester Type:', typeof sampleStudent.semester);
        console.log('');

        // Get a sample subject
        const sampleSubject = await Subject.findOne();
        console.log('📚 SAMPLE SUBJECT DATA:');
        console.log('   Name:', sampleSubject.subjectName);
        console.log('   Code:', sampleSubject.subjectCode);
        console.log('   Department:', `"${sampleSubject.department}"`);
        console.log('   Department Type:', typeof sampleSubject.department);
        console.log('   Semester:', sampleSubject.semester);
        console.log('   Semester Type:', typeof sampleSubject.semester);
        console.log('');

        // Check if they match
        console.log('🔍 MATCHING CHECK:');
        console.log('   Department Match:', sampleStudent.department === sampleSubject.department ? '✅ YES' : '❌ NO');
        console.log('   Semester Match:', sampleStudent.semester === sampleSubject.semester ? '✅ YES' : '❌ NO');
        console.log('');

        // Try the actual query that the backend uses
        console.log('🔍 SIMULATING BACKEND QUERY:');
        console.log(`   Looking for students with:`);
        console.log(`   - role: 'student'`);
        console.log(`   - department: "${sampleSubject.department}"`);
        console.log(`   - semester: ${sampleSubject.semester}`);
        console.log('');

        const matchingStudents = await User.find({
            role: 'student',
            department: sampleSubject.department,
            semester: sampleSubject.semester
        });

        console.log(`   Result: ${matchingStudents.length} students found`);
        console.log('');

        if (matchingStudents.length === 0) {
            console.log('❌ PROBLEM FOUND!');
            console.log('   No students match the subject criteria');
            console.log('');
            console.log('   Checking all unique student departments:');
            const allStudents = await User.find({ role: 'student' });
            const uniqueDepts = [...new Set(allStudents.map(s => s.department))];
            uniqueDepts.forEach(dept => {
                const count = allStudents.filter(s => s.department === dept).length;
                console.log(`   - "${dept}": ${count} students`);
            });
            console.log('');
            console.log('   Checking all unique student semesters:');
            const uniqueSems = [...new Set(allStudents.map(s => s.semester))];
            uniqueSems.forEach(sem => {
                const count = allStudents.filter(s => s.semester === sem).length;
                console.log(`   - Semester ${sem} (${typeof sem}): ${count} students`);
            });
        } else {
            console.log('✅ QUERY WORKS!');
            console.log(`   Found ${matchingStudents.length} students`);
            console.log('   Sample students:');
            matchingStudents.slice(0, 5).forEach(s => {
                console.log(`   - ${s.enrollmentNumber}: ${s.name}`);
            });
        }

        console.log('');
        console.log('═══════════════════════════════════════');

        await mongoose.connection.close();
        console.log('✅ Diagnosis complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

deepDiagnosis();
