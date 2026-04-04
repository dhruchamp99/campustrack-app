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

            // Find existing session documents for these students on this date for OTHER subjects
            const existingSessions = await Attendance.find({
                date: attendanceDate,
                subjectId: { $ne: subjectId },
                presentStudents: { $in: studentIds }
            }).populate('subjectId');

            // Check if any existing session is also for a Lab
            const conflicts = existingSessions.filter(session =>
                session.subjectId && session.subjectId.subjectType === 'Lab'
            );

            if (conflicts.length > 0) {
                const conflictingSubjectName = conflicts[0].subjectId.subjectName;

                // Find which student is conflicting
                const conflictingStudentId = studentIds.find(sid =>
                    conflicts[0].presentStudents.some(pid => pid.toString() === sid.toString())
                );

                const conflictingStudent = await User.findById(conflictingStudentId);

                return res.status(400).json({
                    message: `Constraint Violation: Student ${conflictingStudent ? conflictingStudent.name : 'Unknown'} has already attended a Lab today (${conflictingSubjectName}). Only 1 Lab per day is allowed.`
                });
            }
        }
        // ----------------------------

        // Split students into present and absent arrays
        const presentStudents = students
            .filter(s => s.status === 'present')
            .map(s => s.studentId);

        const absentStudents = students
            .filter(s => s.status === 'absent')
            .map(s => s.studentId);

        // Upsert: one session document per subject per date
        await Attendance.updateOne(
            { subjectId: subjectId, date: attendanceDate },
            {
                $set: {
                    markedBy: req.user.id,
                    presentStudents: presentStudents,
                    absentStudents: absentStudents
                }
            },
            { upsert: true }
        );

        res.status(200).json({ message: 'Attendance marked successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Attendance for a specific Subject and Date
// @route   GET /api/attendance/subject/:subjectId
// @access  Private (Teacher/Admin)
// IMPORTANT: Frontend (AttendanceReport.jsx) expects an array of objects with shape:
//   { studentId: { _id, name, enrollmentNumber }, date: "ISO", status: "present"|"absent" }
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

        const sessions = await Attendance.find(query)
            .populate('presentStudents', 'name enrollmentNumber')
            .populate('absentStudents', 'name enrollmentNumber');

        // Flatten sessions back into the individual-record format the frontend expects
        const flatRecords = [];
        sessions.forEach(session => {
            session.presentStudents.forEach(student => {
                flatRecords.push({
                    _id: `${session._id}_p_${student._id}`,
                    studentId: student,
                    subjectId: session.subjectId,
                    date: session.date.toISOString(),
                    status: 'present',
                    markedBy: session.markedBy
                });
            });
            session.absentStudents.forEach(student => {
                flatRecords.push({
                    _id: `${session._id}_a_${student._id}`,
                    studentId: student,
                    subjectId: session.subjectId,
                    date: session.date.toISOString(),
                    status: 'absent',
                    markedBy: session.markedBy
                });
            });
        });

        res.json(flatRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Student Attendance (List + Populated Refs)
// @route   GET /api/attendance/student/:studentId
// @access  Private
// IMPORTANT: Frontend (StudentAttendance.jsx) expects an array of objects with shape:
//   { subjectId: { subjectName, subjectCode }, markedBy: { name }, date: "ISO", status: "present"|"absent" }
const getStudentAttendance = async (req, res) => {
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const studentId = req.params.studentId;

        // Find sessions where this student appears in either array
        const sessions = await Attendance.find({
            $or: [
                { presentStudents: studentId },
                { absentStudents: studentId }
            ]
        })
            .populate('subjectId', 'subjectName subjectCode')
            .populate('markedBy', 'name')
            .sort({ date: -1 });

        // Flatten into the individual-record format the frontend expects
        const flatRecords = sessions.map(session => {
            const isPresent = session.presentStudents.some(
                pid => pid.toString() === studentId.toString()
            );
            return {
                _id: `${session._id}_${studentId}`,
                studentId: studentId,
                subjectId: session.subjectId,
                markedBy: session.markedBy,
                date: session.date.toISOString(),
                status: isPresent ? 'present' : 'absent'
            };
        });

        res.json(flatRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Report (Admin)
// @route   GET /api/attendance/report
// @access  Private (Admin)
// IMPORTANT: Frontend expects array of { _id: { _id, name, enrollmentNumber, department }, totalClasses, presentClasses, percentage }
const getAttendanceReport = async (req, res) => {
    try {
        // Fetch all sessions
        const sessions = await Attendance.find({});

        // Build per-student stats
        const studentStats = {};
        sessions.forEach(session => {
            session.presentStudents.forEach(sid => {
                const key = sid.toString();
                if (!studentStats[key]) studentStats[key] = { total: 0, present: 0 };
                studentStats[key].total++;
                studentStats[key].present++;
            });
            session.absentStudents.forEach(sid => {
                const key = sid.toString();
                if (!studentStats[key]) studentStats[key] = { total: 0, present: 0 };
                studentStats[key].total++;
            });
        });

        // Format into the shape the frontend expects
        const report = Object.entries(studentStats).map(([studentId, stats]) => ({
            _id: studentId,
            totalClasses: stats.total,
            presentClasses: stats.present,
            percentage: (stats.present / stats.total) * 100
        }));

        // Sort by percentage ascending (lowest first)
        report.sort((a, b) => a.percentage - b.percentage);

        // Populate user details
        const populatedReport = await User.populate(report, { path: "_id", select: "name enrollmentNumber department" });

        // Filter out deleted students
        const filteredReport = populatedReport.filter(record => record._id !== null);

        res.json(filteredReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Teacher's Submitted Attendance Records
// @route   GET /api/attendance/teacher/submitted
// @access  Private (Teacher)
// IMPORTANT: Frontend (AttendanceStore.jsx) expects array of:
//   { subject: { _id, subjectName, subjectCode, department, semester }, date, students: [{ _id, enrollmentNumber, name, status }] }
const getTeacherSubmittedAttendance = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Find all sessions marked by this teacher
        const sessions = await Attendance.find({ markedBy: teacherId })
            .populate('subjectId', 'subjectName subjectCode department semester')
            .populate('presentStudents', 'name enrollmentNumber')
            .populate('absentStudents', 'name enrollmentNumber')
            .sort({ date: -1 });

        // Filter out sessions with deleted subjects
        const validSessions = sessions.filter(s => s.subjectId !== null);

        // Format into the shape the frontend expects
        const formattedData = validSessions.map(session => {
            const students = [];

            session.presentStudents.forEach(student => {
                if (student) {
                    students.push({
                        _id: `${session._id}_p_${student._id}`,
                        enrollmentNumber: student.enrollmentNumber,
                        name: student.name,
                        status: 'present'
                    });
                }
            });

            session.absentStudents.forEach(student => {
                if (student) {
                    students.push({
                        _id: `${session._id}_a_${student._id}`,
                        enrollmentNumber: student.enrollmentNumber,
                        name: student.name,
                        status: 'absent'
                    });
                }
            });

            // Sort students by enrollment number
            students.sort((a, b) =>
                a.enrollmentNumber.localeCompare(b.enrollmentNumber, undefined, { numeric: true })
            );

            return {
                subject: {
                    _id: session.subjectId._id,
                    subjectName: session.subjectId.subjectName,
                    subjectCode: session.subjectId.subjectCode,
                    department: session.subjectId.department,
                    semester: session.subjectId.semester
                },
                date: session.date,
                students: students
            };
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

        const attendanceDate = new Date(date);
        attendanceDate.setUTCHours(0, 0, 0, 0);

        // Find and delete the single session document
        const result = await Attendance.deleteOne({
            subjectId: subjectId,
            date: attendanceDate,
            markedBy: teacherId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No attendance records found for this date and subject' });
        }

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
