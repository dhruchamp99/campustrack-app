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

        // --- LAB CONSTRAINT CHECK ---
        const Subject = require('../models/Subject');
        const currentSubject = await Subject.findById(subjectId);

        if (currentSubject && currentSubject.subjectType === 'Lab') {
            const studentIds = students.map(s => s.studentId);

            // Find existing attendance for these students on this date for OTHER subjects
            const existingAttendance = await Attendance.find({
                studentId: { $in: studentIds },
                date: attendanceDate,
                subjectId: { $ne: subjectId } // Exclude current subject (checking against others)
            }).populate('subjectId');

            // Check if any existing attendance is also for a Lab
            const conflicts = existingAttendance.filter(record =>
                record.subjectId && record.subjectId.subjectType === 'Lab'
            );

            if (conflicts.length > 0) {
                // Return clear error message with the first conflicting student
                const conflictingStudentId = conflicts[0].studentId;
                const conflictingSubjectName = conflicts[0].subjectId.subjectName;

                // Fetch student name for better error
                const conflictingStudent = await User.findById(conflictingStudentId);

                return res.status(400).json({
                    message: `Constraint Violation: Student ${conflictingStudent ? conflictingStudent.name : 'Unknown'} has already attended a Lab today (${conflictingSubjectName}). Only 1 Lab per day is allowed.`
                });
            }
        }
        // ----------------------------


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

// @desc    Get Teacher's Submitted Attendance Records
// @route   GET /api/attendance/teacher/submitted
// @access  Private (Teacher)
const getTeacherSubmittedAttendance = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Find all attendance records marked by this teacher
        const attendanceRecords = await Attendance.find({ markedBy: teacherId })
            .populate('studentId', 'name enrollmentNumber')
            .populate('subjectId', 'subjectName subjectCode department semester')
            .sort({ date: -1, subjectId: 1 });

        // Filter out records where student or subject was deleted
        const validRecords = attendanceRecords.filter(
            record => record.studentId !== null && record.subjectId !== null
        );

        // Group by date and subject
        const groupedData = {};
        validRecords.forEach(record => {
            const dateKey = record.date.toISOString().split('T')[0];
            const subjectKey = record.subjectId._id.toString();

            if (!groupedData[dateKey]) {
                groupedData[dateKey] = {};
            }

            if (!groupedData[dateKey][subjectKey]) {
                groupedData[dateKey][subjectKey] = {
                    subject: {
                        _id: record.subjectId._id,
                        subjectName: record.subjectId.subjectName,
                        subjectCode: record.subjectId.subjectCode,
                        department: record.subjectId.department,
                        semester: record.subjectId.semester
                    },
                    date: record.date,
                    students: []
                };
            }

            groupedData[dateKey][subjectKey].students.push({
                _id: record._id,
                enrollmentNumber: record.studentId.enrollmentNumber,
                name: record.studentId.name,
                status: record.status
            });
        });

        // Convert to array format and sort students by enrollment number
        const formattedData = [];
        Object.keys(groupedData).forEach(dateKey => {
            Object.keys(groupedData[dateKey]).forEach(subjectKey => {
                const record = groupedData[dateKey][subjectKey];
                // Sort students by enrollment number in ascending order
                record.students.sort((a, b) => {
                    return a.enrollmentNumber.localeCompare(b.enrollmentNumber, undefined, { numeric: true });
                });
                formattedData.push(record);
            });
        });

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Attendance Record (for a specific subject and date)
// @route   DELETE /api/attendance/delete
// @access  Private (Teacher)
const deleteAttendanceRecord = async (req, res) => {
    try {
        const { subjectId, date } = req.body;
        const teacherId = req.user.id;

        if (!subjectId || !date) {
            return res.status(400).json({ message: 'Subject ID and date are required' });
        }

        // Parse the date to match the format in database
        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(0, 0, 0, 0);

        // Find all attendance records for this subject, date, and teacher
        const records = await Attendance.find({
            subjectId: subjectId,
            date: attendanceDate,
            markedBy: teacherId
        });

        if (records.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this date and subject' });
        }

        // Delete all attendance records for this subject and date
        const result = await Attendance.deleteMany({
            subjectId: subjectId,
            date: attendanceDate,
            markedBy: teacherId
        });

        res.status(200).json({
            message: 'Attendance records deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getSubjectAttendance,
    getStudentAttendance,
    getAttendanceReport,
    getTeacherSubmittedAttendance,
    deleteAttendanceRecord
};
