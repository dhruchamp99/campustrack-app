const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('\x1b[31m%s\x1b[0m', 'Create a local MongoDB instance or set MONGO_URI in .env to a valid Atlas URI.');
        console.log('\x1b[33m%s\x1b[0m', 'If you do not have MongoDB installed, please install it from: https://www.mongodb.com/try/download/community');
        process.exit(1);
    }
};

module.exports = connectDB;
