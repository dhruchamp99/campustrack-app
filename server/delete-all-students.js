const mongoose = require('mongoose');

// MongoDB Atlas connection (PRODUCTION)
const MONGO_URI = 'mongodb+srv://campustrack:dhrutrack123@campustrack.qxnptp5.mongodb.net/campustrack?retryWrites=true&w=majority&appName=campustrack';

const userSchema = new mongoose.Schema({
    role: String
}, { strict: false }); // Strict false to match any schema

const User = mongoose.model('User', userSchema);

async function unseedStudents() {
    try {
        console.log('🌐 Connecting to MongoDB Atlas (PRODUCTION)...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        console.log('🗑️  Deleting all students...');
        const result = await User.deleteMany({ role: 'student' });

        console.log(`✅ Deleted ${result.deletedCount} students.`);

        // Double check
        const remaining = await User.countDocuments({ role: 'student' });
        console.log(`📊 Remaining students: ${remaining}`);

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

unseedStudents();
