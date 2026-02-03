import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, UserCheck, Calendar, Archive, FileBarChart } from 'lucide-react';
import API_BASE_URL from '../../config/apiConfig';

export const TeacherDashboard = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/teacher/subjects`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSubjects(res.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchSubjects();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                        <p className="text-muted-foreground">Manage your classes and attendances effortlessly.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/teacher/store">
                            <Button variant="outline" className="gap-2">
                                <Archive className="w-4 h-4" />
                                Store
                            </Button>
                        </Link>
                        <Link to="/teacher/report">
                            <Button variant="outline" className="gap-2">
                                <FileBarChart className="w-4 h-4" />
                                Report
                            </Button>
                        </Link>
                        <Link to="/teacher/attendance">
                            <Button className="gap-2 shadow-lg bg-primary hover:bg-primary/90">
                                <UserCheck className="w-4 h-4" />
                                Mark New Attendance
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats or Quick Actions could go here */}

                {/* Subjects Grid */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Assigned Subjects
                    </h3>

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse"></div>)}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {subjects.length === 0 ? (
                                <p className="text-muted-foreground col-span-full py-8 text-center border-2 border-dashed rounded-lg">
                                    No subjects assigned yet. Please contact Admin.
                                </p>
                            ) : (
                                subjects.map(sub => (
                                    <Card key={sub._id} className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-primary">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{sub.subjectName}</CardTitle>
                                                    <p className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded w-fit mt-1">{sub.subjectCode}</p>
                                                </div>
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                                                    <span>Department</span>
                                                    <span className="font-medium text-foreground">{sub.department}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                                                    <span>Semester</span>
                                                    <span className="font-medium text-foreground">{sub.semester}</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex gap-2">
                                                <Link to={`/teacher/attendance?subject=${sub._id}`} className="flex-1">
                                                    <Button className="w-full" variant="outline">
                                                        Mark Attendance
                                                    </Button>
                                                </Link>
                                                <Button size="icon" variant="ghost" title="View History">
                                                    <Calendar className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
