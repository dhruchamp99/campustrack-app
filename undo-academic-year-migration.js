/**
 * Undo Migration Script: Remove academicYear from Attendance records
 * 
 * Run from the project root:
 *   node undo-academic-year-migration.js
 * 
 * What it does:
 *   1. Removes the academicYear field from all Attendance documents
 *   2. Drops the new compound index (subjectId + date + academicYear)
 *   3. Recreates the original index (subjectId + date)
 */

const path = require('path');

// Add server's node_modules to the module resolution path FIRST
module.paths.unshift(path.join(__dirname, 'server', 'node_modules'));

require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const mongoose = require('mongoose');
const Attendance = require('./server/src/models/Attendance');

async function undoMigration() {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('❌ MONGO_URI not found. Check server/.env file.');
            process.exit(1);
        }

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected');

        // Step 1: Remove academicYear from all documents
        console.log('\n🔄 Removing academicYear field from all attendance records...');
        const result = await Attendance.updateMany(
            {},
            { $unset: { academicYear: "" } }
        );
        console.log(`   ✅ Updated ${result.modifiedCount} records`);

        // Step 2: Drop the new index
        console.log('\n🔧 Reverting indexes...');
        try {
            await Attendance.collection.dropIndex('subjectId_1_date_1_academicYear_1');
            console.log('   ✅ Dropped index: subjectId_1_date_1_academicYear_1');
        } catch (e) {
            console.log(`   ℹ️  Index not found: ${e.message}`);
        }

        // Step 3: Recreate original index
        try {
            await Attendance.collection.createIndex(
                { subjectId: 1, date: 1 },
                { unique: true }
            );
            console.log('   ✅ Recreated original index: subjectId_1_date_1');
        } catch (e) {
            console.log(`   ⚠️  ${e.message}`);
        }

        console.log('\n🎉 Undo migration complete! academicYear field removed.');

    } catch (error) {
        console.error('❌ Undo failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

undoMigration();
