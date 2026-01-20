const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: [true, 'Please add subject name']
    },
    subjectCode: {
        type: String,
        required: [true, 'Please add subject code'],
        unique: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
