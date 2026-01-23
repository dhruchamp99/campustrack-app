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

async function diagnoseTeacherIssue() {
    try {
        console.log('🔍 Diagnosing Teacher Dashboard Issue...');
        console.log('');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas (PRODUCTION)');
        console.log('');

        // 1. Check students
        const students = await User.find({ role: 'student', department: 'Computer Science', semester: 4 });
        console.log('📊 Students in Database:');
        console.log(`   Total CS Semester 4 students: ${students.length}`);
        if (students.length > 0) {
            console.log(`   Sample: ${students[0].enrollmentNumber} - ${students[0].name}`);
        }
        console.log('');

        // 2. Check teachers
        const teachers = await User.find({ role: 'teacher' });
        console.log('👨‍🏫 Teachers in Database:');
        console.log(`   Total teachers: ${teachers.length}`);
        if (teachers.length > 0) {
            teachers.forEach(t => {
                console.log(`   - ${t.name} (${t.email}) - ${t.department || 'No department'}`);
            });
        } else {
            console.log('   ⚠️ No teachers found!');
        }
        console.log('');

        // 3. Check subjects
        const subjects = await Subject.find().populate('teacherId', 'name email');
        console.log('📚 Subjects in Database:');
        console.log(`   Total subjects: ${subjects.length}`);
        if (subjects.length > 0) {
            subjects.forEach(s => {
                console.log(`   - ${s.subjectName} (${s.subjectCode})`);
                console.log(`     Department: ${s.department || 'NOT SET'}`);
                console.log(`     Semester: ${s.semester || 'NOT SET'}`);
                console.log(`     Teacher: ${s.teacherId ? s.teacherId.name : 'NOT ASSIGNED'}`);
                console.log('');
            });
        } else {
            console.log('   ⚠️ No subjects found!');
        }
        console.log('');

        // 4. Diagnosis
        console.log('═══════════════════════════════════════');
        console.log('🔍 DIAGNOSIS:');
        console.log('═══════════════════════════════════════');

        if (students.length === 0) {
            console.log('❌ ISSUE: No students found in database');
        } else {
            console.log(`✅ Students: ${students.length} students found`);
        }

        if (teachers.length === 0) {
            console.log('❌ ISSUE: No teachers found in database');
        } else {
            console.log(`✅ Teachers: ${teachers.length} teachers found`);
        }

        if (subjects.length === 0) {
            console.log('❌ ISSUE: No subjects found in database');
            console.log('   SOLUTION: Create subjects with department="Computer Science" and semester=4');
        } else {
            console.log(`✅ Subjects: ${subjects.length} subjects found`);

            // Check if subjects have correct department/semester
            const csSubjects = subjects.filter(s => s.department === 'Computer Science' && s.semester === 4);
            if (csSubjects.length === 0) {
                console.log('❌ ISSUE: No subjects with department="Computer Science" and semester=4');
                console.log('   SOLUTION: Update subjects to have correct department and semester');
            } else {
                console.log(`✅ ${csSubjects.length} subjects match CS Semester 4`);
            }

            // Check if subjects have teachers assigned
            const assignedSubjects = subjects.filter(s => s.teacherId);
            if (assignedSubjects.length === 0) {
                console.log('❌ ISSUE: No subjects have teachers assigned');
                console.log('   SOLUTION: Assign teachers to subjects from admin panel');
            } else {
                console.log(`✅ ${assignedSubjects.length} subjects have teachers assigned`);
            }
        }

        console.log('═══════════════════════════════════════');

        await mongoose.connection.close();
        console.log('');
        console.log('✅ Diagnosis complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

diagnoseTeacherIssue();
