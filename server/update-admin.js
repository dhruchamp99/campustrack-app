const mongoose = require('mongoose');
const User = require('./src/models/User');

// Update admin credentials
const updateAdminCredentials = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campustrack';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find the old admin account
        const oldAdmin = await User.findOne({ email: 'dhru@campus.com', role: 'admin' });

        if (oldAdmin) {
            console.log('📝 Found existing admin account:', oldAdmin.email);

            // Update email and password
            oldAdmin.email = 'dhru@admin.com';
            oldAdmin.password = 'admin@123'; // Will be hashed by pre-save hook
            await oldAdmin.save();

            console.log('✅ Admin credentials updated successfully!');
            console.log('');
            console.log('New Admin Credentials:');
            console.log('Email:', 'dhru@admin.com');
            console.log('Password:', 'admin@123');
        } else {
            console.log('⚠️  No admin found with email dhru@campus.com');
            console.log('Creating new admin account...');

            // Create new admin
            const newAdmin = new User({
                name: 'Admin',
                email: 'dhru@admin.com',
                password: 'admin@123',
                role: 'admin'
            });

            await newAdmin.save();
            console.log('✅ New admin account created!');
            console.log('');
            console.log('Admin Credentials:');
            console.log('Email:', 'dhru@admin.com');
            console.log('Password:', 'admin@123');
        }

        await mongoose.connection.close();
        console.log('');
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateAdminCredentials();
