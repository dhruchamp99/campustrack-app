import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { FileDown, Users, Search } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Input } from '../../components/ui/input';
import ExcelJS from 'exceljs';

const OverallAttendance = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchReport(selectedSubject);
        } else {
            setStudents([]);
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

    const fetchReport = async (subjectId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/teacher/attendance-report/${subjectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load attendance report');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPercentageColor = (pct) => {
        if (pct >= 75) return 'text-green-600';
        if (pct >= 50) return 'text-yellow-600';
        return 'text-red-600 font-bold';
    };

    const downloadExcel = async () => {
        if (!selectedSubject || students.length === 0) return;

        const subject = subjects.find(s => s._id === selectedSubject);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Overall Report');

        // Header
        worksheet.columns = [
            { header: 'Sr No', key: 'sr', width: 8 },
            { header: 'Enrollment', key: 'enrollment', width: 20 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Batch', key: 'batch', width: 10 },
            { header: 'Total Classes', key: 'total', width: 15 },
            { header: 'Present', key: 'present', width: 15 },
            { header: 'Percentage', key: 'percentage', width: 15 },
        ];

        worksheet.getRow(1).font = { bold: true };

        students.forEach((student, index) => {
            const row = worksheet.addRow({
                sr: index + 1,
                enrollment: student.enrollmentNumber,
                name: student.name,
                batch: student.batch,
                total: student.totalClasses,
                present: student.presentClasses,
                percentage: `${student.percentage}%`
            });

            // Color code percentage
            const pct = parseFloat(student.percentage);
            if (pct < 50) {
                row.getCell('percentage').font = { color: { argb: 'FFFF0000' } }; // Red
            } else if (pct < 75) {
                row.getCell('percentage').font = { color: { argb: 'FFFFBB00' } }; // Yellow/Orange
            } else {
                row.getCell('percentage').font = { color: { argb: 'FF009900' } }; // Green
            }
        });

        // Add subject info
        worksheet.spliceRows(1, 0, []); // Empty row
        worksheet.spliceRows(1, 0, [`Subject: ${subject.subjectName} (${subject.subjectCode}) - Overall Attendance`]);
        worksheet.mergeCells('A1:G1');
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${subject.subjectName}_Overall_Attendance.xlsx`;
        a.click();
    };

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subject-wise Overall Attendance</h2>
                    <p className="text-muted-foreground">Select a subject to view aggregate attendance statistics per student.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Select Subject</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.subjectName} ({s.department} - Sem {s.semester})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search student..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={downloadExcel} disabled={!selectedSubject || students.length === 0}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {selectedSubject && (
                    <Card>
                        <CardContent className="pt-6">
                            {loading ? (
                                <div className="text-center py-8">Loading attendance statistics...</div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No students found.</div>
                            ) : (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Sr.</th>
                                                <th className="px-4 py-3 text-left font-medium">Enrollment</th>
                                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                                <th className="px-4 py-3 text-center font-medium">Batch</th>
                                                <th className="px-4 py-3 text-center font-medium">Total Classes</th>
                                                <th className="px-4 py-3 text-center font-medium">Present</th>
                                                <th className="px-4 py-3 text-right font-medium">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {filteredStudents.map((student, index) => (
                                                <tr key={student.studentId} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3">{index + 1}</td>
                                                    <td className="px-4 py-3 font-mono text-xs">{student.enrollmentNumber}</td>
                                                    <td className="px-4 py-3 font-medium">{student.name}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {student.batch !== '-' ? (
                                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">{student.batch}</span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{student.totalClasses}</td>
                                                    <td className="px-4 py-3 text-center">{student.presentClasses}</td>
                                                    <td className={`px-4 py-3 text-right font-bold ${getPercentageColor(parseFloat(student.percentage))}`}>
                                                        {student.percentage}%
                                                    </td>
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

export default OverallAttendance;
