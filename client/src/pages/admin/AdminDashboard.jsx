import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Users, GraduationCap, BookOpen, TrendingUp, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import { Button } from '../../components/ui/button';

export const AdminDashboard = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReport = async () => {
        // We need robust endpoints for stats. For now, fetch report
        try {
            setRefreshing(true);
            const res = await axios.get('http://localhost:5000/api/attendance/report', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Fetched report:', res.data);
            setReport(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching report:', error);
            setLoading(false);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReport();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            console.log('Auto-refreshing admin dashboard...');
            fetchReport();
        }, 30000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // Derived stats
    const totalStudents = report.length;
    const lowAttendanceCount = report.filter(s => s.percentage < 75).length;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="gap-2 flex-1 sm:flex-none"
                            onClick={fetchReport}
                            disabled={refreshing}
                        >
                            <Download className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                            <span className="sm:hidden">{refreshing ? '...' : 'Refresh'}</span>
                        </Button>
                        <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Report</span>
                            <span className="sm:hidden">Export</span>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Total Students</CardTitle>
                            <GraduationCap className="h-4 w-4 opacity-75" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalStudents}</div>
                            <p className="text-xs opacity-75">Active enrollments</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{lowAttendanceCount}</div>
                            <p className="text-xs text-muted-foreground">Students below 75%</p>
                        </CardContent>
                    </Card>
                    {/* Placeholders for specific counts */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">Active</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Section */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Attendance Report / Defaulters List</CardTitle>
                        <CardDescription>Students sorted by lowest attendance percentage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Department</th>
                                        <th className="px-4 py-3 font-medium text-center">Total</th>
                                        <th className="px-4 py-3 font-medium text-center">Present</th>
                                        <th className="px-4 py-3 font-medium text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                                    ) : report.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">No data available</td></tr>
                                    ) : (
                                        report.map((row) => (
                                            <tr key={row._id?._id || Math.random()} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    {row._id?.name || 'Unknown'}
                                                    <div className="text-xs text-muted-foreground">{row._id?.enrollmentNumber || 'N/A'}</div>
                                                    <div className="text-xs text-muted-foreground sm:hidden">{row._id?.department || 'N/A'}</div>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell">{row._id?.department || 'N/A'}</td>
                                                <td className="px-4 py-3 text-center">{row.totalClasses || 0}</td>
                                                <td className="px-4 py-3 text-center">{row.presentClasses || 0}</td>
                                                <td className="px-4 py-3 text-right font-bold">
                                                    <span className={row.percentage < 75 ? 'text-red-600' : 'text-green-600'}>
                                                        {row.percentage?.toFixed(1) || '0.0'}%
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
        </DashboardLayout>
    );
};
