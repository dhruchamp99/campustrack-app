const mongoose = require('mongoose');
const User = require('./src/models/User');

const updateAdminEmail = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/campustrack');
        console.log('Connected to MongoDB');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@campustrack.com' });

        if (!admin) {
            console.log('❌ Admin user not found with email: admin@campustrack.com');
            process.exit(1);
        }

        console.log('Found admin:', admin.name);

        // Update email
        admin.email = 'dhru@campus.com';
        await admin.save();

        console.log('✅ Admin email updated successfully!');
        console.log('New email:', admin.email);
        console.log('Password remains: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateAdminEmail();
