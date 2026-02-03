import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Download, Calendar, BookOpen, Users, FileText, Trash2 } from 'lucide-react';
import API_BASE_URL from '../../config/apiConfig';

import ExcelJS from 'exceljs';





const AttendanceStore = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRecord, setExpandedRecord] = useState(null);

    useEffect(() => {
        fetchSubmittedAttendance();
    }, []);

    const fetchSubmittedAttendance = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/attendance/teacher/submitted`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Sort students by enrollment number in each record
            const sortedRecords = res.data.map(record => ({
                ...record,
                students: [...record.students].sort((a, b) =>
                    a.enrollmentNumber.localeCompare(b.enrollmentNumber, undefined, { numeric: true })
                )
            }));

            setAttendanceRecords(sortedRecords);
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch attendance records');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const downloadAsCSV = (record) => {
        const { subject, date, students } = record;

        // Create CSV content
        let csvContent = `Attendance Report\n`;
        csvContent += `Subject: ${subject.subjectName} (${subject.subjectCode})\n`;
        csvContent += `Department: ${subject.department}\n`;
        csvContent += `Semester: ${subject.semester}\n`;
        csvContent += `Date: ${formatDate(date)}\n\n`;
        csvContent += `Enrollment Number,Student Name,Status\n`;

        students.forEach(student => {
            // Use ="number" format to prevent Excel from converting to scientific notation
            csvContent += `="${student.enrollmentNumber}",${student.name},${student.status.toUpperCase()}\n`;
        });

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${subject.subjectCode}_${formatDate(date).replace(/\s/g, '_')}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Attendance downloaded as CSV successfully!');
    };

    const downloadAsExcel = async (record) => {
        const { subject, date, students } = record;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // Add Header Info
        worksheet.addRow(['Attendance Report']);
        worksheet.addRow([`Subject: ${subject.subjectName} (${subject.subjectCode})`]);
        worksheet.addRow([`Department: ${subject.department}`]);
        worksheet.addRow([`Semester: ${subject.semester}`]);
        worksheet.addRow([`Date: ${formatDate(date)}`]);
        worksheet.addRow([]); // Empty row

        // Table Header
        const headerRow = worksheet.addRow(['Enrollment Number', 'Student Name', 'Status']);
        headerRow.font = { bold: true };

        // Set column widths
        worksheet.getColumn(1).width = 25;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 15;

        // Data Rows
        students.forEach(student => {
            const row = worksheet.addRow([
                student.enrollmentNumber,
                student.name,
                student.status.toUpperCase()
            ]);

            // Highlight absent student names in red
            if (student.status === 'absent') {
                row.getCell(2).font = { color: { argb: 'FFFF0000' } }; // column 2 is Name
                row.getCell(3).font = { color: { argb: 'FFFF0000' } }; // column 3 is Status
            }
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_${subject.subjectCode}_${formatDate(date).replace(/\s/g, '_')}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Attendance downloaded as Excel successfully!');
    };

    const downloadAsJSON = (record) => {
        const { subject, date, students } = record;

        const jsonData = {
            subject: {
                name: subject.subjectName,
                code: subject.subjectCode,
                department: subject.department,
                semester: subject.semester
            },
            date: formatDate(date),
            students: students.map(s => ({
                enrollmentNumber: s.enrollmentNumber,
                name: s.name,
                status: s.status
            }))
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${subject.subjectCode}_${formatDate(date).replace(/\s/g, '_')}.json`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Attendance downloaded successfully!');
    };

    const deleteAttendanceRecord = async (record) => {
        const { subject, date } = record;

        // Confirm before deleting
        const confirmDelete = window.confirm(
            `Are you sure you want to delete attendance for:\n\n` +
            `Subject: ${subject.subjectName} (${subject.subjectCode})\n` +
            `Date: ${formatDate(date)}\n` +
            `Students: ${record.students.length}\n\n` +
            `This action cannot be undone!`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/attendance/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                data: {
                    subjectId: subject._id,
                    date: date
                }
            });

            toast.success('Attendance record deleted successfully!');

            // Refresh the list
            fetchSubmittedAttendance();
        } catch (error) {
            console.error('Error deleting attendance:', error);
            toast.error(error.response?.data?.message || 'Failed to delete attendance record');
        }
    };

    const getAttendanceStats = (students) => {
        const present = students.filter(s => s.status === 'present').length;
        const absent = students.filter(s => s.status === 'absent').length;
        const total = students.length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        return { present, absent, total, percentage };
    };

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Attendance Store</h2>
                        <p className="text-muted-foreground">View and download your submitted attendance records</p>
                    </div>
                    <Button
                        onClick={fetchSubmittedAttendance}
                        variant="outline"
                        className="gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>

                {/* Records List */}
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse"></div>
                        ))}
                    </div>
                ) : attendanceRecords.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No attendance records found</p>
                                <p className="text-sm mt-2">Submit attendance to see records here</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {attendanceRecords.map((record, index) => {
                            const stats = getAttendanceStats(record.students);
                            const isExpanded = expandedRecord === index;

                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                    {record.subject.subjectName}
                                                </CardTitle>
                                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                                    <span className="font-mono bg-muted px-2 py-0.5 rounded">
                                                        {record.subject.subjectCode}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(record.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {stats.total} Students
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadAsExcel(record)}
                                                    className="gap-2 text-green-700 hover:text-green-800"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Excel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadAsCSV(record)}
                                                    className="gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    CSV
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => downloadAsJSON(record)}
                                                    className="gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    JSON
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteAttendanceRecord(record)}
                                                    className="gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => setExpandedRecord(isExpanded ? null : index)}
                                                >
                                                    {isExpanded ? 'Hide' : 'View'} Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Stats Summary */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div className="bg-muted rounded-lg p-3">
                                                <p className="text-xs text-muted-foreground">Total</p>
                                                <p className="text-2xl font-bold">{stats.total}</p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                <p className="text-xs text-green-700">Present</p>
                                                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                                            </div>
                                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                                <p className="text-xs text-red-700">Absent</p>
                                                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                                            </div>
                                            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                                                <p className="text-xs text-primary">Attendance</p>
                                                <p className="text-2xl font-bold text-primary">{stats.percentage}%</p>
                                            </div>
                                        </div>

                                        {/* Expanded Student List */}
                                        {isExpanded && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-3">Student List</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="text-left py-2 px-3 text-sm font-medium">Enrollment No.</th>
                                                                <th className="text-left py-2 px-3 text-sm font-medium">Student Name</th>
                                                                <th className="text-center py-2 px-3 text-sm font-medium">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {record.students.map((student) => (
                                                                <tr key={student._id} className="border-b hover:bg-muted/50">
                                                                    <td className="py-2 px-3 font-mono text-sm">{student.enrollmentNumber}</td>
                                                                    <td className="py-2 px-3">{student.name}</td>
                                                                    <td className="py-2 px-3 text-center">
                                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${student.status === 'present'
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : 'bg-red-100 text-red-700'
                                                                            }`}>
                                                                            {student.status.toUpperCase()}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AttendanceStore;
