const mongoose = require('mongoose');
const User = require('./src/models/User');
const fs = require('fs');

// Production MongoDB Atlas URI
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

const getProductionTeachers = async () => {
    try {
        console.log('🔗 Connecting to production MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to production database\n');

        // Fetch all teachers from production
        const teachers = await User.find({ role: 'teacher' })
            .select('name email department createdAt')
            .sort({ name: 1 });

        if (teachers.length === 0) {
            console.log('❌ No teachers found in the production database.');
        } else {
            let output = '';
            output += `# 👨‍🏫 Production Teacher Login Credentials\n\n`;
            output += `**Total Teachers**: ${teachers.length}\n`;
            output += `**Database**: Production (MongoDB Atlas)\n`;
            output += `**Generated**: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;
            output += `---\n\n`;

            console.log('='.repeat(80));
            console.log(`\n📚 Found ${teachers.length} teacher(s) in PRODUCTION database:\n`);
            console.log('='.repeat(80));

            teachers.forEach((teacher, index) => {
                output += `## ${index + 1}. ${teacher.name}\n\n`;
                output += `- **Email**: \`${teacher.email}\`\n`;
                output += `- **Password**: \`teacher123\` *(default)*\n`;
                output += `- **Department**: ${teacher.department}\n`;
                output += `- **Account Created**: ${teacher.createdAt.toLocaleDateString('en-IN')}\n`;
                output += `\n---\n\n`;

                // Also print to console
                console.log(`\n${index + 1}. ${teacher.name}`);
                console.log(`   Email: ${teacher.email}`);
                console.log(`   Password: teacher123 (default)`);
                console.log(`   Department: ${teacher.department}`);
                console.log(`   Created: ${teacher.createdAt.toLocaleDateString('en-IN')}`);
                console.log(`   ${'─'.repeat(70)}`);
            });

            output += `## 📝 Important Notes\n\n`;
            output += `1. **Default Password**: All teachers use the default password \`teacher123\` unless they have changed it.\n`;
            output += `2. **Password Security**: Passwords are hashed using bcrypt in the database.\n`;
            output += `3. **Login URL**: https://campustrack-app-4b232.web.app\n`;
            output += `4. **Role**: All accounts listed above have the "teacher" role.\n`;
            output += `5. **Database**: This data is from your PRODUCTION MongoDB Atlas database.\n\n`;
            output += `---\n\n`;
            output += `*This file contains sensitive information. Keep it secure and do not share publicly.*\n`;

            // Save to file
            fs.writeFileSync('../PRODUCTION_TEACHER_CREDENTIALS.md', output);

            console.log('\n' + '='.repeat(80));
            console.log('\n✅ Credentials saved to: PRODUCTION_TEACHER_CREDENTIALS.md');
            console.log('\n🌐 Login URL: https://campustrack-app-4b232.web.app');
            console.log('🔑 Default Password: teacher123\n');
        }

        await mongoose.connection.close();
        console.log('✅ Database connection closed.');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

getProductionTeachers();
