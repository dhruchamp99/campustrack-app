import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import API_BASE_URL from '../../config/apiConfig';

const AttendanceMarking = () => {
    const [searchParams] = useSearchParams();
    const initialSubjectId = searchParams.get('subject');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(initialSubjectId || '');
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch subjects
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/teacher/subjects`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSubjects(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSubjects();
    }, []);

    const fetchStudents = async () => {
        if (!selectedSubject) {
            toast.error('Please select a subject first');
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching students for subject:', selectedSubject);

            let url = `${API_BASE_URL}/api/teacher/students/${selectedSubject}`;
            if (selectedBatches.length > 0) {
                url += `?batches=${selectedBatches.join(',')}`;
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Fetched students:', res.data);

            if (res.data.length === 0) {
                toast.error('No students found for this subject. Make sure students are enrolled in the same department and semester.');
                setStudents([]);
                setLoading(false);
                return;
            }

            // Initialize students with default status 'present' and sort by enrollment number
            const studentsWithStatus = res.data
                .map(s => ({
                    studentId: s._id,
                    name: s.name,
                    enrollmentNumber: s.enrollmentNumber,
                    status: 'present'
                }))
                .sort((a, b) => {
                    // Sort by enrollment number in ascending order
                    return a.enrollmentNumber.localeCompare(b.enrollmentNumber, undefined, { numeric: true });
                });
            setStudents(studentsWithStatus);
            toast.success(`Loaded ${res.data.length} students successfully!`);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error(error.response?.data?.message || "Failed to fetch students");
        }
        setLoading(false);
    };

    const handleStatusChange = (id, status) => {
        setStudents(prev => prev.map(s => s.studentId === id ? { ...s, status } : s));
    };

    const handleSubmit = async () => {
        if (students.length === 0) {
            toast.error('No students to mark attendance for');
            return;
        }

        try {
            const payload = {
                subjectId: selectedSubject,
                date: date,
                students: students.map(s => ({ studentId: s.studentId, status: s.status }))
            };
            console.log('Submitting attendance:', payload);

            const response = await axios.post(`${API_BASE_URL}/api/attendance/mark`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log('Attendance response:', response.data);
            toast.success('✅ Attendance marked successfully!', {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                },
            });

            // Clear the form after a short delay
            setTimeout(() => {
                setStudents([]);
                setSelectedSubject('');
            }, 1000);
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error(error.response?.data?.message || "Failed to mark attendance");
        }
    };

    return (
        <DashboardLayout>
            <Toaster position="top-right" />
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Mark Attendance</h2>

                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3 items-end">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Subject</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={selectedSubject}
                                    onChange={(e) => {
                                        setSelectedSubject(e.target.value);
                                        setSelectedBatches([]); // Reset batches on subject change
                                    }}
                                >
                                    <option value="">-- Select --</option>
                                    {subjects.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.subjectName} ({s.subjectType === 'Lab' ? 'LAB' : 'Theory'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Batch Selection for Labs */}
                            {(() => {
                                const currentSubject = subjects.find(s => s._id === selectedSubject);
                                if (currentSubject?.subjectType === 'Lab') {
                                    return (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Batches (Multi-select)</label>
                                            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/20 min-h-[40px] items-center">
                                                {currentSubject.allowedBatches && currentSubject.allowedBatches.length > 0 ? (
                                                    currentSubject.allowedBatches.map(batch => (
                                                        <label key={batch} className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded border hover:bg-gray-50">
                                                            <input
                                                                type="checkbox"
                                                                value={batch}
                                                                checked={selectedBatches.includes(batch)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedBatches([...selectedBatches, batch]);
                                                                    } else {
                                                                        setSelectedBatches(selectedBatches.filter(b => b !== batch));
                                                                    }
                                                                }}
                                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                            />
                                                            <span className="text-sm font-medium">{batch}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No specific batches restricted. Fetching all.</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <Button onClick={fetchStudents} disabled={loading || !selectedSubject}>
                                {loading ? 'Loading...' : 'Fetch Students'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {students.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Class List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {students.map((student) => (
                                        <div key={student.studentId} className={`p-4 rounded-lg border flex justify-between items-center transition-colors ${student.status === 'present' ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'
                                            }`}>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.enrollmentNumber}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(student.studentId, 'present')}
                                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${student.status === 'present'
                                                        ? 'bg-green-500 text-white shadow-sm'
                                                        : 'bg-transparent text-muted-foreground hover:bg-green-100'
                                                        }`}
                                                >
                                                    P
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student.studentId, 'absent')}
                                                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${student.status === 'absent'
                                                        ? 'bg-red-500 text-white shadow-sm'
                                                        : 'bg-transparent text-muted-foreground hover:bg-red-100'
                                                        }`}
                                                >
                                                    A
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button size="lg" onClick={handleSubmit}>
                                        Submit Attendance
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AttendanceMarking;
