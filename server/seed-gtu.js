const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Subject = require('./src/models/Subject');
const Holiday = require('./src/models/Holiday');

dotenv.config();

const seedGTUData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campustrack');
        console.log('MongoDB Connected for GTU Data Seeding');

        // Update student to semester 4
        await User.updateOne(
            { enrollmentNumber: 'CS101' },
            { $set: { semester: '4' } }
        );
        console.log('✅ Updated student to Semester 4');

        // Get the teacher
        const teacher = await User.findOne({ email: 'teacher@campustrack.com' });
        if (!teacher) {
            console.log('Teacher not found. Please run the main seed script first.');
            process.exit(1);
        }

        // GTU Semester 4 Computer Engineering Subjects
        const gtuSubjects = [
            {
                subjectName: 'Data Structures',
                subjectCode: 'CE401',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            },
            {
                subjectName: 'Database Management Systems',
                subjectCode: 'CE402',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            },
            {
                subjectName: 'Operating Systems',
                subjectCode: 'CE403',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            },
            {
                subjectName: 'Computer Organization',
                subjectCode: 'CE404',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            },
            {
                subjectName: 'Discrete Mathematics',
                subjectCode: 'CE405',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            },
            {
                subjectName: 'Economics and Management',
                subjectCode: 'CE406',
                teacherId: teacher._id,
                semester: '4',
                department: 'Computer Science'
            }
        ];

        // Clear existing subjects for semester 4
        await Subject.deleteMany({ semester: '4', department: 'Computer Science' });

        // Insert GTU subjects
        const createdSubjects = await Subject.insertMany(gtuSubjects);
        console.log(`✅ Created ${createdSubjects.length} GTU Semester 4 subjects`);

        // GTU Academic Year Holidays
        const holidays = [
            { date: new Date('2025-01-26'), title: 'Republic Day', description: 'National Holiday', type: 'National' },
            { date: new Date('2025-03-14'), title: 'Holi', description: 'Festival of Colors', type: 'Festival' },
            { date: new Date('2025-04-06'), title: 'Ram Navami', description: 'Hindu Festival', type: 'Festival' },
            { date: new Date('2025-04-18'), title: 'Good Friday', description: 'Christian Holiday', type: 'Festival' },
            { date: new Date('2025-05-01'), title: 'May Day', description: 'Labour Day', type: 'Public' },
            { date: new Date('2025-08-15'), title: 'Independence Day', description: 'National Holiday', type: 'National' },
            { date: new Date('2025-08-16'), title: 'Janmashtami', description: 'Birth of Lord Krishna', type: 'Festival' },
            { date: new Date('2025-10-02'), title: 'Gandhi Jayanti', description: 'National Holiday', type: 'National' },
            { date: new Date('2025-10-20'), title: 'Diwali', description: 'Festival of Lights', type: 'Festival' },
            { date: new Date('2025-10-21'), title: 'Diwali Holiday', description: 'Extended Holiday', type: 'Festival' },
            { date: new Date('2025-12-25'), title: 'Christmas', description: 'Christian Holiday', type: 'Festival' },
            { date: new Date('2026-01-01'), title: 'New Year', description: 'Public Holiday', type: 'Public' }
        ];

        // Clear existing holidays
        await Holiday.deleteMany({});

        // Insert holidays
        const createdHolidays = await Holiday.insertMany(holidays);
        console.log(`✅ Created ${createdHolidays.length} holidays`);

        console.log('\n📚 GTU Semester 4 Subjects:');
        createdSubjects.forEach(sub => {
            console.log(`   - ${sub.subjectCode}: ${sub.subjectName}`);
        });

        console.log('\n🎉 Holidays for Academic Year:');
        createdHolidays.forEach(holiday => {
            console.log(`   - ${holiday.date.toLocaleDateString()}: ${holiday.title}`);
        });

        console.log('\n✅ GTU data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedGTUData();
