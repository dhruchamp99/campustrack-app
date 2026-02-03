import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import {
    Calendar as CalendarIcon,
    BarChart2,
    PieChart,
    BookOpen,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    getDay
} from 'date-fns';

const StudentAttendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/api/attendance/student/${user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAttendance(res.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [user]);

    // Analytics Calculations
    const stats = useMemo(() => {
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = total - present; // Assuming only present/absent for simplicity
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        // Subject Breakdown
        const subjects = {};
        attendance.forEach(record => {
            const subName = record.subjectId?.subjectName || 'Unknown';
            if (!subjects[subName]) subjects[subName] = { total: 0, present: 0 };
            subjects[subName].total++;
            if (record.status === 'present') subjects[subName].present++;
        });

        // Monthly Trend (Last 6 months)
        const trend = {};
        attendance.forEach(record => {
            const monthKey = format(new Date(record.date), 'MMM');
            if (!trend[monthKey]) trend[monthKey] = { total: 0, present: 0 };
            trend[monthKey].total++;
            if (record.status === 'present') trend[monthKey].present++;
        });

        return { total, present, absent, percentage, subjects, trend };
    }, [attendance]);

    // Calendar Helper
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const getDayStatus = (date) => {
        // Find records for this day
        // Note: A student might have multiple classes in a day.
        // We can show a dot for each, or a general status. 
        // Let's show "Green" if all present, "Red" if all absent, "Yellow" if mixed.
        const dayRecords = attendance.filter(a => isSameDay(new Date(a.date), date));

        if (dayRecords.length === 0) return null;

        const presentCount = dayRecords.filter(a => a.status === 'present').length;
        if (presentCount === dayRecords.length) return 'present';
        if (presentCount === 0) return 'absent';
        return 'mixed';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
                    <p className="text-muted-foreground">Detailed overview of your academic presence.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Attendance Distribution (Pie Chart Placeholder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-primary" />
                                Attendance Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center py-8">
                            <div className="relative w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center border-8 border-red-500"
                                style={{
                                    background: `conic-gradient(#22c55e ${stats.percentage}%, #ef4444 0)`
                                }}
                            >
                                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20"></div>
                                <div className="bg-white rounded-full w-36 h-36 flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-4xl font-bold">{stats.percentage}%</span>
                                    <span className="text-xs text-muted-foreground">Present</span>
                                </div>
                            </div>
                            <div className="ml-8 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-green-500"></div>
                                    <div className="text-sm">
                                        <p className="font-bold text-green-500">Present {stats.percentage}%</p>
                                        <p className="text-muted-foreground">{stats.present} Classes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-red-500"></div>
                                    <div className="text-sm">
                                        <p className="font-bold text-red-500">Absent {(100 - stats.percentage).toFixed(1)}%</p>
                                        <p className="text-muted-foreground">{stats.absent} Classes</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Trend (Bar Chart CSS) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-primary" />
                                Attendance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-end justify-between gap-2 pt-4">
                                {Object.keys(stats.trend).map((month, idx) => {
                                    const data = stats.trend[month];
                                    const pct = data.total > 0 ? (data.present / data.total) * 100 : 0;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 w-full">
                                            <div className="w-full bg-gray-100 rounded-t-md relative h-48 overflow-hidden group">
                                                <div
                                                    className={`absolute bottom-0 w-full transition-all duration-1000 ${pct >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ height: `${pct}%` }}
                                                ></div>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {Math.round(pct)}% ({data.present}/{data.total})
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground">{month}</span>
                                        </div>
                                    )
                                })}
                                {Object.keys(stats.trend).length === 0 && (
                                    <div className="w-full text-center text-muted-foreground mt-20">No trend data available yet.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar & Subject Overview */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Calendar */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                Attendance Calendar - {format(currentMonth, 'MMMM yyyy')}
                            </CardTitle>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded">&lt;</button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded">&gt;</button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="font-medium text-muted-foreground py-1">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-14 md:h-24 bg-transparent border-none"></div>
                                ))}
                                {daysInMonth.map(date => {
                                    const status = getDayStatus(date);
                                    let bgClass = "bg-card hover:bg-muted";
                                    let borderClass = "";
                                    let textClass = "";

                                    if (status === 'present') {
                                        bgClass = "bg-green-100 hover:bg-green-200 dark:bg-green-900/30";
                                        textClass = "text-green-700 dark:text-green-300";
                                    } else if (status === 'absent') {
                                        bgClass = "bg-red-100 hover:bg-red-200 dark:bg-red-900/30";
                                        textClass = "text-red-700 dark:text-red-300";
                                    } else if (status === 'mixed') {
                                        bgClass = "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30";
                                        textClass = "text-yellow-700 dark:text-yellow-300";
                                    }

                                    return (
                                        <div
                                            key={date.toString()}
                                            className={`h-14 md:h-24 border rounded-md p-2 flex flex-col justify-between transition-colors ${bgClass} ${borderClass}`}
                                        >
                                            <span className={`text-sm font-medium ${textClass || 'text-muted-foreground'}`}>
                                                {format(date, 'd')}
                                            </span>
                                            {status && (
                                                <div className="flex justify-end">
                                                    {status === 'present' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                    {status === 'absent' && <XCircle className="w-4 h-4 text-red-600" />}
                                                    {status === 'mixed' && <Clock className="w-4 h-4 text-yellow-600" />}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-4 text-xs text-muted-foreground justify-center">
                                <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Present</div>
                                <div className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /> Absent</div>
                                <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-600" /> Mixed</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subject Overview */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Subject Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(stats.subjects).map(([subject, data]) => {
                                const subPct = (data.present / data.total) * 100;
                                return (
                                    <div key={subject} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium truncate max-w-[150px]" title={subject}>{subject}</span>
                                            <span className={`font-bold ${subPct >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.round(subPct)}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${subPct >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${subPct}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-right">{data.present}/{data.total} Classes</p>
                                    </div>
                                );
                            })}
                            {Object.keys(stats.subjects).length === 0 && (
                                <p className="text-muted-foreground text-sm text-center">No subject data yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentAttendance;
