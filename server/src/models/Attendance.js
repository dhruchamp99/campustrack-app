const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Arrays of student IDs — stores BOTH present and absent explicitly
    presentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    absentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// One session per subject per date — prevents duplicate marking
attendanceSchema.index({ subjectId: 1, date: 1 }, { unique: true });

// Speed up student lookups across sessions
attendanceSchema.index({ presentStudents: 1 });
attendanceSchema.index({ absentStudents: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
