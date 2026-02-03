require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Subject = require('./src/models/Subject');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Migration...');

        // 1. Migrate Subjects
        console.log('--- Migrating Subjects ---');
        const subjects = await Subject.find({});
        for (const subject of subjects) {
            let updated = false;

            // Migrate Department -> departments
            if (subject.department && (!subject.departments || subject.departments.length === 0)) {
                subject.departments = [subject.department];
                // subject.department = undefined; // Optional: delete old field, but let's keep for safety
                updated = true;
                console.log(`Migrated Department for: ${subject.subjectName}`);
            }

            // Migrate Semester -> semesters
            if (subject.semester && (!subject.semesters || subject.semesters.length === 0)) {
                subject.semesters = [subject.semester];
                // subject.semester = undefined;
                updated = true;
                console.log(`Migrated Semester for: ${subject.subjectName}`);
            }

            // Set Defaults for new fields
            if (!subject.subjectType) {
                subject.subjectType = 'Theory';
                updated = true;
            }
            if (!subject.allowedBatches) {
                subject.allowedBatches = [];
                updated = true;
            }

            if (updated) {
                await subject.save();
            }
        }
        console.log('Subject Migration Completed.');

        // 2. Migrate Students
        console.log('--- Migrating Students ---');
        const students = await User.find({ role: 'student' });
        let studentCount = 0;
        for (const student of students) {
            if (!student.batch) {
                student.batch = 'A'; // Default batch
                await student.save();
                studentCount++;
            }
        }
        console.log(`Migrated ${studentCount} Students to default Batch 'A'.`);

        console.log('MIGRATION SUCCESSFUL!');
        process.exit();
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
