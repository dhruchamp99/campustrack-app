const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

// Subject schema
const subjectSchema = new mongoose.Schema({
    subjectName: String,
    subjectCode: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: String,
    semester: String,
    credits: Number
});

const Subject = mongoose.model('Subject', subjectSchema);

async function seedSubjects() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Semester 4 Computer Science subjects
        const subjects = [
            {
                subjectCode: 'BE04000101',
                subjectName: 'Environmental Science, Sustainability & Renewable Energy',
                department: 'Computer Science',
                semester: '4',
                credits: 3
            },
            {
                subjectCode: 'BE04000221',
                subjectName: 'Operating System',
                department: 'Computer Science',
                semester: '4',
                credits: 4
            },
            {
                subjectCode: 'BE04000231',
                subjectName: 'Object Oriented Programming',
                department: 'Computer Science',
                semester: '4',
                credits: 4
            },
            {
                subjectCode: 'BE04000241',
                subjectName: 'Analysis & Design of Algorithms',
                department: 'Computer Science',
                semester: '4',
                credits: 4
            },
            {
                subjectCode: 'BE04000251',
                subjectName: 'Computer Organization & Architecture',
                department: 'Computer Science',
                semester: '4',
                credits: 4
            },
            {
                subjectCode: 'BE04000261',
                subjectName: 'Discrete Mathematics & Graph Theory',
                department: 'Computer Science',
                semester: '4',
                credits: 4
            }
        ];

        console.log('\n📚 Adding subjects to database...\n');

        for (const subjectData of subjects) {
            // Check if subject already exists
            const existing = await Subject.findOne({ subjectCode: subjectData.subjectCode });

            if (existing) {
                console.log(`⚠️  Subject ${subjectData.subjectCode} already exists - ${subjectData.subjectName}`);
            } else {
                await Subject.create(subjectData);
                console.log(`✅ Added: ${subjectData.subjectCode} - ${subjectData.subjectName}`);
            }
        }

        console.log('\n🎉 Subject seeding completed!');

        // Show all subjects
        const allSubjects = await Subject.find({ department: 'Computer Science', semester: '4' });
        console.log(`\n📊 Total Semester 4 CS subjects in database: ${allSubjects.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedSubjects();
