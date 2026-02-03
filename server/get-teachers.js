require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const fs = require('fs');

const getTeachers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Fetch all teachers
        const teachers = await User.find({ role: 'teacher' }).select('name email department createdAt').sort({ createdAt: 1 });

        if (teachers.length === 0) {
            console.log('❌ No teachers found in the database.');
        } else {
            let output = '';
            output += `# 👨‍🏫 Teacher Login Credentials\n\n`;
            output += `**Total Teachers**: ${teachers.length}\n`;
            output += `**Generated**: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;
            output += `---\n\n`;

            teachers.forEach((teacher, index) => {
                output += `## ${index + 1}. ${teacher.name}\n\n`;
                output += `- **Email**: \`${teacher.email}\`\n`;
                output += `- **Password**: \`teacher123\` *(default)*\n`;
                output += `- **Department**: ${teacher.department}\n`;
                output += `- **Account Created**: ${teacher.createdAt.toLocaleDateString('en-IN')}\n`;
                output += `\n---\n\n`;
            });

            output += `## 📝 Important Notes\n\n`;
            output += `1. **Default Password**: All teachers use the default password \`teacher123\` unless they have changed it.\n`;
            output += `2. **Password Security**: Passwords are hashed using bcrypt in the database.\n`;
            output += `3. **Login URL**: https://campustrack-app-4b232.web.app\n`;
            output += `4. **Role**: All accounts listed above have the "teacher" role.\n\n`;
            output += `---\n\n`;
            output += `*This file contains sensitive information. Keep it secure and do not share publicly.*\n`;

            // Save to file
            fs.writeFileSync('../TEACHER_CREDENTIALS.md', output);
            console.log('✅ Teacher credentials saved to: TEACHER_CREDENTIALS.md\n');

            // Also print to console
            console.log(output);
        }

        await mongoose.connection.close();
        console.log('✅ Database connection closed.');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

getTeachers();
