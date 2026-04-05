/**
 * Migration Script: Convert old per-student attendance docs → new session-based docs
 * 
 * Run this ONCE after deploying the new schema.
 * It reads the old "attendances" collection and creates new session documents.
 * 
 * Usage: node server/migrate-attendance.js
 * 
 * NOTE: This script reads from the OLD format and writes in the NEW format.
 *       It is safe to run multiple times (uses upsert).
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// We need a raw connection to read the old documents directly
async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!\n');

        const db = mongoose.connection.db;

        // 1. Check if old-format documents exist
        // Old format has: studentId, subjectId, date, status, markedBy (individual fields)
        // New format has: subjectId, date, markedBy, presentStudents[], absentStudents[]
        const collection = db.collection('attendances');
        const sampleDoc = await collection.findOne({});

        if (!sampleDoc) {
            console.log('No attendance documents found. Nothing to migrate.');
            process.exit(0);
        }

        // Check if already migrated (new format has presentStudents array)
        if (sampleDoc.presentStudents) {
            console.log('Database appears to already be in the new format (found presentStudents array).');
            console.log('Migration not needed. Exiting.');
            process.exit(0);
        }

        // Check for old format (has studentId field)
        if (!sampleDoc.studentId) {
            console.log('Documents do not match old or new format. Aborting.');
            process.exit(1);
        }

        console.log('Old format detected. Starting migration...\n');

        // 2. Read ALL old documents
        const oldDocs = await collection.find({}).toArray();
        console.log(`Found ${oldDocs.length} old attendance records.`);

        // 3. Group by subjectId + date
        const sessions = {};
        oldDocs.forEach(doc => {
            const dateKey = new Date(doc.date).toISOString().split('T')[0];
            const key = `${doc.subjectId.toString()}_${dateKey}`;

            if (!sessions[key]) {
                sessions[key] = {
                    subjectId: doc.subjectId,
                    date: doc.date,
                    markedBy: doc.markedBy,
                    presentStudents: [],
                    absentStudents: []
                };
            }

            if (doc.status === 'present') {
                sessions[key].presentStudents.push(doc.studentId);
            } else {
                sessions[key].absentStudents.push(doc.studentId);
            }
        });

        const sessionCount = Object.keys(sessions).length;
        console.log(`Grouped into ${sessionCount} session documents.\n`);
        console.log(`Compression: ${oldDocs.length} docs → ${sessionCount} docs (${((1 - sessionCount / oldDocs.length) * 100).toFixed(1)}% reduction)\n`);

        // 4. Drop old collection and insert new documents
        // First, back up old data by renaming the collection
        const backupName = 'attendances_backup_' + Date.now();
        console.log(`Backing up old collection as "${backupName}"...`);
        await collection.rename(backupName);
        console.log('Backup complete.');

        // 5. Insert new session documents into fresh "attendances" collection
        const newCollection = db.collection('attendances');
        const sessionDocs = Object.values(sessions).map(s => ({
            ...s,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        if (sessionDocs.length > 0) {
            await newCollection.insertMany(sessionDocs);
            console.log(`\n✅ Migration complete! Inserted ${sessionDocs.length} new session documents.`);
        }

        // 6. Create indexes
        await newCollection.createIndex({ subjectId: 1, date: 1 }, { unique: true });
        await newCollection.createIndex({ presentStudents: 1 });
        await newCollection.createIndex({ absentStudents: 1 });
        console.log('Indexes created.');

        console.log(`\n📋 Summary:`);
        console.log(`   Old records: ${oldDocs.length}`);
        console.log(`   New sessions: ${sessionDocs.length}`);
        console.log(`   Backup collection: ${backupName}`);
        console.log(`\n🎉 Done! Your app is ready to use the new compressed schema.`);

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();
