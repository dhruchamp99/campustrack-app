import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { FileDown, Calendar, Users, Filter, Trash2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { toast, Toaster } from 'react-hot-toast';

const AttendanceReport = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [includeFaculty, setIncludeFaculty] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchAttendanceData(selectedSubject);
        } else {
            setAttendanceData([]);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/teacher/subjects`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load subjects');
        }
    };

    const fetchAttendanceData = async (subjectId) => {
        setLoading(true);
        try {
            // Fetch all attendance records for the subject
            const res = await axios.get(`${API_BASE_URL}/api/attendance/subject/${subjectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAttendanceData(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const deleteAttendanceDate = async (date) => {
        const dateStr = formatDateHeader(date);

        const confirmDelete = window.confirm(
            `Are you sure you want to delete all attendance records for ${dateStr}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            // 'date' here is "YYYY-MM-DD" string extracted from ISO
            // We can send it directly to the backend.
            // Backend new Date("YYYY-MM-DD") creates UTC midnight.
            // This matches how we store it (via markAttendance which does setUTCHours(0,0,0,0)).

            await axios.delete(`${API_BASE_URL}/api/attendance/delete`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                data: {
                    subjectId: selectedSubject,
                    date: date // Send YYYY-MM-DD string
                }
            });

            toast.success(`Attendance for ${dateStr} deleted successfully`);
            // Refresh data
            fetchAttendanceData(selectedSubject);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete attendance');
        }
    };

    // Process data for the matrix
    const processedData = useMemo(() => {
        if (!attendanceData.length) return null;

        // 1. Get unique dates as YYYY-MM-DD strings
        // item.date is ISO string: 2026-02-01T00:00:00.000Z
        const dates = [...new Set(attendanceData.map(item => item.date.split('T')[0]))];
        // Sort dates
        dates.sort((a, b) => new Date(a) - new Date(b));

        // 2. Get unique students
        const studentMap = new Map();
        attendanceData.forEach(item => {
            if (item.studentId) {
                studentMap.set(item.studentId._id, item.studentId);
            }
        });
        const students = Array.from(studentMap.values()).sort((a, b) =>
            a.enrollmentNumber.localeCompare(b.enrollmentNumber, undefined, { numeric: true })
        );

        // 3. Build lookup map
        const lookup = new Map();
        attendanceData.forEach(item => {
            // Key using YYYY-MM-DD
            const key = `${item.studentId?._id}-${item.date.split('T')[0]}`;
            lookup.set(key, item.status);
        });

        return { dates, students, lookup };
    }, [attendanceData]);

    const formatDateHeader = (dateString) => {
        // dateString is YYYY-MM-DD e.g., "2026-02-01"
        // We want to format it as DD MMM (01 Feb)
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    const downloadExcel = async () => {
        if (!processedData || !selectedSubject) return;

        const subject = subjects.find(s => s._id === selectedSubject);
        const { dates, students, lookup } = processedData;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Styles
        const centerStyle = { vertical: 'middle', horizontal: 'center' };
        const borderStyle = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        // Header Section
        worksheet.mergeCells('A1:AC1'); // Approximate width
        worksheet.getCell('A1').value = 'PACIFIC SCHOOL OF ENGINEERING, SURAT';
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = centerStyle;

        worksheet.mergeCells('A2:AC2');
        worksheet.getCell('A2').value = `Attendance Sheet for ${subject.department}`;
        worksheet.getCell('A2').font = { bold: true, size: 12 };
        worksheet.getCell('A2').alignment = centerStyle;

        // Row 3: Sem, Sub
        worksheet.mergeCells('A3:C3');
        worksheet.getCell('A3').value = `Sem: ${subject.semester}`;
        worksheet.getCell('A3').font = { bold: true };

        worksheet.mergeCells('D3:J3'); // Adjust range as needed
        worksheet.getCell('D3').value = `Subject: ${subject.subjectName} (${subject.subjectCode})`;
        worksheet.getCell('D3').font = { bold: true };

        // Helper to find teacher name from local storage or context
        let currentRow = 4;
        if (includeFaculty) {
            worksheet.mergeCells(`A${currentRow}:AC${currentRow}`);
            const userStr = localStorage.getItem('user');
            const userName = userStr ? JSON.parse(userStr).name : '';
            worksheet.getCell(`A${currentRow}`).value = `Faculty Name: ${userName}`;
            worksheet.getCell(`A${currentRow}`).font = { bold: true };
            worksheet.getCell(`A${currentRow}`).alignment = centerStyle;
            currentRow++;
        }

        // Table Header
        const headerRowIndex = currentRow;
        worksheet.getCell(`A${headerRowIndex}`).value = 'Sr. No';
        worksheet.getCell(`B${headerRowIndex}`).value = 'Enrollment No';
        worksheet.getCell(`C${headerRowIndex}`).value = 'Student Name';

        // Add Date Headers
        dates.forEach((date, i) => {
            const cell = worksheet.getCell(headerRowIndex, 4 + i);
            cell.value = formatDateHeader(date);
            cell.alignment = { textRotation: 90, ...centerStyle };
            cell.font = { bold: true };
        });

        // Set column widths
        worksheet.getColumn(1).width = 6;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 25;
        for (let i = 0; i < dates.length; i++) {
            worksheet.getColumn(4 + i).width = 4; // Narrow columns for P/A
        }

        // Data Rows
        students.forEach((student, index) => {
            const rowIndex = headerRowIndex + 1 + index;
            worksheet.getCell(`A${rowIndex}`).value = index + 1;
            worksheet.getCell(`B${rowIndex}`).value = student.enrollmentNumber;
            worksheet.getCell(`C${rowIndex}`).value = student.name;

            dates.forEach((date, i) => {
                const status = lookup.get(`${student._id}-${date}`);
                const cell = worksheet.getCell(rowIndex, 4 + i);

                if (status === 'present') {
                    cell.value = 'P';
                } else if (status === 'absent') {
                    cell.value = 'A';
                    cell.font = { color: { argb: 'FFFF0000' }, bold: true };
                } else {
                    cell.value = '-';
                }
                cell.alignment = centerStyle;
            });
        });

        // Add borders to the table
        const totalCols = 3 + dates.length;
        const totalRows = headerRowIndex + students.length;

        for (let r = headerRowIndex; r <= totalRows; r++) {
            for (let c = 1; c <= totalCols; c++) {
                worksheet.getCell(r, c).border = borderStyle;
            }
        }

        // Download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Attendance_Report_${subject.subjectName}_${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Report downloaded successfully');
    };

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Attendance Report</h2>
                        <p className="text-muted-foreground">View and download comprehensive attendance records.</p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-end">
                            <div className="space-y-2 w-full md:w-1/3">
                                <Label>Select Subject</Label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                >
                                    <option value="" disabled>Choose a subject...</option>
                                    {subjects.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.subjectName} ({sub.department} - Sem {sub.semester})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2 pb-2">
                                <input
                                    type="checkbox"
                                    id="faculty"
                                    checked={includeFaculty}
                                    onChange={(e) => setIncludeFaculty(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="faculty">Include Faculty Name in Export</Label>
                            </div>

                            <Button
                                onClick={downloadExcel}
                                disabled={!selectedSubject || !processedData || loading}
                                className="gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Download Excel
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Table */}
                {selectedSubject && (
                    <Card>
                        <CardContent className="pt-6 overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-8">Loading attendance data...</div>
                            ) : !processedData || processedData.dates.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No attendance records found for this subject.</div>
                            ) : (
                                <div className="min-w-max">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="border p-2 text-left sticky left-0 bg-background z-10 w-12">Sr.</th>
                                                <th className="border p-2 text-left sticky left-12 bg-background z-10 w-32">Enrollment</th>
                                                <th className="border p-2 text-left sticky left-44 bg-background z-10 shadow-r w-48">Name</th>
                                                {processedData.dates.map((date, i) => (
                                                    <th key={i} className="border p-2 text-center text-xs whitespace-nowrap min-w-[40px] align-bottom pb-2">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="transform -rotate-90 block whitespace-nowrap h-24 w-4 flex items-center justify-center">
                                                                {formatDateHeader(date)}
                                                            </span>
                                                            <button
                                                                onClick={() => deleteAttendanceDate(date)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                                                title={`Delete attendance for ${formatDateHeader(date)}`}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {processedData.students.map((student, idx) => (
                                                <tr key={student._id} className="hover:bg-muted/10">
                                                    <td className="border p-2 sticky left-0 bg-background z-10">{idx + 1}</td>
                                                    <td className="border p-2 font-mono text-xs sticky left-12 bg-background z-10">{student.enrollmentNumber}</td>
                                                    <td className="border p-2 sticky left-44 bg-background z-10 shadow-r whitespace-nowrap">{student.name}</td>
                                                    {processedData.dates.map((date, i) => {
                                                        const status = processedData.lookup.get(`${student._id}-${date}`);
                                                        return (
                                                            <td key={i} className={`border p-2 text-center text-sm ${status === 'absent' ? 'text-red-600 font-bold bg-red-50' :
                                                                    status === 'present' ? 'text-green-600' : 'text-muted-foreground'
                                                                }`}>
                                                                {status === 'present' ? 'P' : status === 'absent' ? 'A' : '-'}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AttendanceReport;
