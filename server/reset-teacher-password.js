const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection (PRODUCTION)
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

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

async function resetTeacherPassword() {
    try {
        console.log('🔧 Resetting Teacher Password...');
        console.log('');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas (PRODUCTION)');
        console.log('');

        // Find all teachers
        const teachers = await User.find({ role: 'teacher' });

        if (teachers.length === 0) {
            console.log('⚠️ No teachers found in database');
            console.log('Creating default teacher account...');

            const newTeacher = new User({
                name: 'Default Teacher',
                email: 'teacher@campustrack.com',
                password: 'teacher123',
                role: 'teacher',
                department: 'Computer Science'
            });

            await newTeacher.save();
            console.log('✅ Created new teacher account:');
            console.log('   Email: teacher@campustrack.com');
            console.log('   Password: teacher123');
        } else {
            console.log(`Found ${teachers.length} teacher(s):`);
            console.log('');

            for (const teacher of teachers) {
                console.log(`📝 Resetting password for: ${teacher.name} (${teacher.email})`);
                teacher.password = 'teacher123';
                await teacher.save();
                console.log(`✅ Password reset to: teacher123`);
                console.log('');
            }
        }

        console.log('═══════════════════════════════════════');
        console.log('🎉 TEACHER PASSWORD(S) RESET!');
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('You can now login with:');
        teachers.forEach(t => {
            console.log(`   Email: ${t.email}`);
        });
        if (teachers.length === 0) {
            console.log('   Email: teacher@campustrack.com');
        }
        console.log('   Password: teacher123');
        console.log('');
        console.log('🌐 Login at: https://campustrack-app-4b232.web.app');
        console.log('═══════════════════════════════════════');

        await mongoose.connection.close();
        console.log('');
        console.log('✅ Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetTeacherPassword();
