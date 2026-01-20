const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true // Assuming one holiday entry per date? Or could be ranges. Simple date for now.
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String, // e.g., 'National Holiday', 'Festival'
        default: 'Holiday'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Holiday', holidaySchema);
