const mongoose = require('mongoose');

const semesterPromotionSchema = new mongoose.Schema({
    promotedAt: {
        type: Date,
        default: Date.now
    },
    promotedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromSemester: {
        type: String,
        required: true
    },
    toSemester: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        enrollmentNumber: String
    }],
    totalPromoted: {
        type: Number,
        required: true
    },
    // Undo tracking
    undone: {
        type: Boolean,
        default: false
    },
    undoneAt: {
        type: Date
    },
    undoneBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for quick lookup by department/semester
semesterPromotionSchema.index({ department: 1, fromSemester: 1 });
semesterPromotionSchema.index({ promotedAt: -1 });

module.exports = mongoose.model('SemesterPromotion', semesterPromotionSchema);
