/**
 * Migration Script: Add academicYear to existing Attendance records
 * 
 * Run ONCE from the project root:
 *   cd server && node ../migrate-academic-year.js
 * OR from the server directory:
 *   node ../migrate-academic-year.js
 * 
 * What it does:
 *   1. Reads all Attendance documents without an academicYear field
 *   2. Computes the academic year from each record's date
 *   3. Updates all records using bulkWrite for efficiency
 *   4. Drops the old unique index (subjectId + date)
 *   5. Creates the new compound index (subjectId + date + academicYear)
 */

const path = require('path');

// Add server's node_modules to the module resolution path FIRST
module.paths.unshift(path.join(__dirname, 'server', 'node_modules'));

require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const mongoose = require('mongoose');
const Attendance = require('./server/src/models/Attendance');

// Academic year helper (duplicated here so the script is standalone)
function getAcademicYear(date) {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();
    if (month >= 6) return `${year}-${String(year + 1).slice(2)}`;
    return `${year - 1}-${String(year).slice(2)}`;
}

async function migrate() {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('❌ MONGO_URI not found in environment.');
            console.error('   Make sure server/.env file exists with MONGO_URI defined.');
            process.exit(1);
        }

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Step 1: Count records without academicYear
        const totalRecords = await Attendance.countDocuments();
        const recordsMissingYear = await Attendance.countDocuments({
            $or: [
                { academicYear: { $exists: false } },
                { academicYear: null },
                { academicYear: '' }
            ]
        });

        console.log(`\n📊 Total attendance records: ${totalRecords}`);
        console.log(`📊 Records missing academicYear: ${recordsMissingYear}`);

        if (recordsMissingYear === 0) {
            console.log('\n✅ All records already have academicYear. Nothing to migrate.');
        } else {
            // Step 2: Fetch and update in batches
            console.log(`\n🔄 Migrating ${recordsMissingYear} records...`);

            const records = await Attendance.find({
                $or: [
                    { academicYear: { $exists: false } },
                    { academicYear: null },
                    { academicYear: '' }
                ]
            });

            const ops = records.map(record => ({
                updateOne: {
                    filter: { _id: record._id },
                    update: { $set: { academicYear: getAcademicYear(record.date) } }
                }
            }));

            // Process in chunks of 500
            const chunkSize = 500;
            let processed = 0;

            for (let i = 0; i < ops.length; i += chunkSize) {
                const chunk = ops.slice(i, i + chunkSize);
                await Attendance.bulkWrite(chunk);
                processed += chunk.length;
                console.log(`   ✅ Processed ${processed}/${ops.length} records`);
            }

            console.log(`\n✅ Successfully migrated ${ops.length} records!`);
        }

        // Step 3: Index management
        console.log('\n🔧 Updating indexes...');

        try {
            await Attendance.collection.dropIndex('subjectId_1_date_1');
            console.log('   ✅ Dropped old index: subjectId_1_date_1');
        } catch (e) {
            if (e.codeName === 'IndexNotFound') {
                console.log('   ℹ️  Old index subjectId_1_date_1 not found (already removed)');
            } else {
                console.log(`   ⚠️  Could not drop old index: ${e.message}`);
            }
        }

        try {
            await Attendance.collection.createIndex(
                { subjectId: 1, date: 1, academicYear: 1 },
                { unique: true }
            );
            console.log('   ✅ Created new index: subjectId_1_date_1_academicYear_1');
        } catch (e) {
            if (e.codeName === 'IndexOptionsConflict' || e.code === 85) {
                console.log('   ℹ️  New index already exists');
            } else {
                console.log(`   ⚠️  Index creation: ${e.message}`);
            }
        }

        // Step 4: Verify
        const stillMissing = await Attendance.countDocuments({
            $or: [
                { academicYear: { $exists: false } },
                { academicYear: null },
                { academicYear: '' }
            ]
        });

        if (stillMissing === 0) {
            console.log('\n🎉 Migration complete! All records have academicYear.');
        } else {
            console.log(`\n⚠️  ${stillMissing} records still missing academicYear.`);
        }

        // Show academic year distribution
        const yearDistribution = await Attendance.aggregate([
            { $group: { _id: '$academicYear', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📈 Academic Year Distribution:');
        yearDistribution.forEach(y => {
            console.log(`   ${y._id}: ${y.count} records`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

migrate();
