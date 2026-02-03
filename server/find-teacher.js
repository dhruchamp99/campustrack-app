require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const findTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Search for the teacher by name (case-insensitive)
        const teacherByName = await User.findOne({
            name: /RUTIKA PATEL/i,
            role: 'teacher'
        });

        // Search for the teacher by email (case-insensitive)
        const teacherByEmail = await User.findOne({
            email: /rutikapatel78@gmail.com/i,
            role: 'teacher'
        });

        // Search for any user with similar email
        const anyUserWithEmail = await User.findOne({
            email: /rutika/i
        });

        // Get all teachers to see what's in the database
        const allTeachers = await User.find({ role: 'teacher' }).select('name email department');

        console.log('🔍 Search Results:\n');
        console.log('='.repeat(80));

        if (teacherByName) {
            console.log('\n✅ Found by NAME: RUTIKA PATEL\n');
            console.log(`   Name: ${teacherByName.name}`);
            console.log(`   Email: ${teacherByName.email}`);
            console.log(`   Password: teacher123 (default)`);
            console.log(`   Department: ${teacherByName.department}`);
            console.log(`   Account Created: ${teacherByName.createdAt.toLocaleDateString('en-IN')}`);
        } else if (teacherByEmail) {
            console.log('\n✅ Found by EMAIL: rutikapatel78@gmail.com\n');
            console.log(`   Name: ${teacherByEmail.name}`);
            console.log(`   Email: ${teacherByEmail.email}`);
            console.log(`   Password: teacher123 (default)`);
            console.log(`   Department: ${teacherByEmail.department}`);
            console.log(`   Account Created: ${teacherByEmail.createdAt.toLocaleDateString('en-IN')}`);
        } else if (anyUserWithEmail) {
            console.log('\n⚠️  Found user with similar email:\n');
            console.log(`   Name: ${anyUserWithEmail.name}`);
            console.log(`   Email: ${anyUserWithEmail.email}`);
            console.log(`   Role: ${anyUserWithEmail.role}`);
            console.log(`   Department: ${anyUserWithEmail.department}`);
        } else {
            console.log('\n❌ Not found in local database\n');
            console.log('📋 All teachers in LOCAL database:\n');
            allTeachers.forEach((t, i) => {
                console.log(`${i + 1}. ${t.name} - ${t.email} - ${t.department}`);
            });
            console.log('\n⚠️  IMPORTANT: The screenshot shows RUTIKA PATEL exists in PRODUCTION database.');
            console.log('   Your local database may be different from production (MongoDB Atlas).\n');
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n🌐 Login URL: https://campustrack-app-4b232.web.app');
        console.log('🔑 Default Password: teacher123\n');

        await mongoose.connection.close();
        console.log('✅ Database connection closed.');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

findTeacher();
