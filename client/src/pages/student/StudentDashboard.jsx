import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Clock, AlertTriangle, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import API_BASE_URL from '../../config/apiConfig';

const ProgressBar = ({ value, className }) => (
    <div className={`h-3 w-full bg-secondary rounded-full overflow-hidden ${className}`}>
        <div
            className={`h-full transition-all duration-500 rounded-full ${value < 75 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
    </div>
);

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAttendance = async () => {
        try {
            setRefreshing(true);
            console.log('Fetching attendance for user:', user);

            if (!user?.id) {
                console.error('No user ID found');
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/api/attendance/student/${user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Fetched attendance data:', res.data);
            console.log('Number of records:', res.data.length);
            setAttendance(res.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            console.error('Error response:', error.response?.data);
            // Don't show error to user if it's just empty data
            if (error.response?.status !== 404) {
                // Could add toast notification here
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        console.log('User changed:', user);
        if (user?.id) {
            fetchAttendance();

            // Auto-refresh every 30 seconds
            const interval = setInterval(() => {
                console.log('Auto-refreshing attendance data...');
                fetchAttendance();
            }, 30000); // 30 seconds

            // Cleanup interval on unmount
            return () => clearInterval(interval);
        }
    }, [user]);

    // Analytics
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
    const isLowAttendance = percentage < 75;

    // Filter today's attendance - compare dates properly
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    const todaysAttendance = attendance.filter(a => {
        const attendanceDate = new Date(a.date).toISOString().split('T')[0];
        return attendanceDate === todayStr;
    });

    console.log('Today:', todayStr);
    console.log('Today\'s attendance:', todaysAttendance);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back, {user.name}. Here is your activity overview.</p>
                    </div>
                    <Button
                        onClick={fetchAttendance}
                        disabled={refreshing}
                        variant="outline"
                        className="gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Warning Banner */}
                {isLowAttendance && totalClasses > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center gap-4 text-red-800 dark:text-red-200 animate-pulse">
                        <AlertTriangle className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Attendance Warning</p>
                            <p className="text-sm">Your attendance is below 75%. Please attend more classes to avoid debarment.</p>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Overall Card */}
                    <Card className="md:col-span-1 overflow-hidden relative border-none shadow-lg">
                        <div className={`absolute inset-0 opacity-10 ${percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <PieChart className="w-5 h-5 opacity-70" />
                                Overall Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-extrabold tracking-tighter mb-2">
                                {percentage}%
                            </div>
                            <ProgressBar value={percentage} className="mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {presentClasses} Present out of {totalClasses} Sessions
                            </p>
                        </CardContent>
                    </Card>

                    {/* Today's Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Today's Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todaysAttendance.length > 0 ? (
                                <div className="space-y-2">
                                    {todaysAttendance.map(a => (
                                        <div key={a._id} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                                            <span>{a.subjectId?.subjectName || 'Subject'}</span>
                                            <span className={`font-bold ${a.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                                                {a.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-4 text-center text-sm">
                                    No attendance marked today.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming or Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                Department Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Department</p>
                                <p className="text-muted-foreground text-sm">{user.department}</p>
                            </div>
                            <div className="space-y-1 mt-4">
                                <p className="text-sm font-medium">Semester</p>
                                <p className="text-muted-foreground text-sm">{user.semester || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Table */}
                <div className="mt-8">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Attendance History</CardTitle>
                            <CardDescription>A detailed record of all your classes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-x-auto">
                                <table className="w-full text-sm text-left min-w-[500px]">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Date</th>
                                            <th className="px-4 py-3 font-medium">Subject</th>
                                            <th className="px-4 py-3 font-medium hidden sm:table-cell">Teacher</th>
                                            <th className="px-4 py-3 font-medium text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {loading ? (
                                            <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                                        ) : attendance.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-muted-foreground">No records found</td></tr>
                                        ) : (
                                            attendance.map(record => (
                                                <tr key={record._id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        <div className="text-xs text-muted-foreground sm:hidden">{record.markedBy?.name || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {record.subjectId?.subjectName || 'Unknown'}
                                                        <span className="text-muted-foreground font-normal ml-2 text-xs hidden md:inline">({record.subjectId?.subjectCode})</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{record.markedBy?.name || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${record.status === 'present'
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                            {record.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};
