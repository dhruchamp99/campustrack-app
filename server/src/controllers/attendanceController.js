const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark Attendance (Bulk or Single)
// @route   POST /api/attendance/mark
// @access  Private (Teacher)
const markAttendance = async (req, res) => {
    const { subjectId, date, students } = req.body;

    if (!subjectId || !date || !students || students.length === 0) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(0, 0, 0, 0);

        const operations = students.map((student) => ({
            updateOne: {
                filter: {
                    studentId: student.studentId,
                    subjectId: subjectId,
                    date: attendanceDate
                },
                update: {
                    $set: {
                        status: student.status,
                        markedBy: req.user.id
                    }
                },
                upsert: true
            }
        }));

        await Attendance.bulkWrite(operations);
        res.status(200).json({ message: 'Attendance marked successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Attendance for a specific Subject and Date
const getSubjectAttendance = async (req, res) => {
    const { subjectId } = req.params;
    const { date } = req.query;

    try {
        let query = { subjectId };
        if (date) {
            const attendanceDate = new Date(date);
            attendanceDate.setUTCHours(0, 0, 0, 0);
            query.date = attendanceDate;
        }

        const attendance = await Attendance.find(query)
            .populate('studentId', 'name enrollmentNumber')
            .sort({ 'studentId.enrollmentNumber': 1 }); // Sorting might need aggregation for populated field

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Student Attendance (List + Populated Refs)
const getStudentAttendance = async (req, res) => {
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const attendance = await Attendance.find({ studentId: req.params.studentId })
            .populate('subjectId', 'subjectName subjectCode')
            .populate('markedBy', 'name')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Report (Admin)
// Retrieves low attendance students across the system (simple version)
const getAttendanceReport = async (req, res) => {
    try {
        // Aggregate to find percentage per student
        const report = await Attendance.aggregate([
            {
                $group: {
                    _id: "$studentId",
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    percentage: { $multiply: [{ $divide: ["$presentClasses", "$totalClasses"] }, 100] },
                    totalClasses: 1,
                    presentClasses: 1
                }
            },
            { $sort: { percentage: 1 } } // Show lowest attendance first
        ]);

        // Populate user details (since aggregate returned simple _id)
        const populatedReport = await User.populate(report, { path: "_id", select: "name enrollmentNumber department" });

        // Filter out records where student was deleted (null _id)
        const filteredReport = populatedReport.filter(record => record._id !== null);

        res.json(filteredReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getSubjectAttendance,
    getStudentAttendance,
    getAttendanceReport
};
