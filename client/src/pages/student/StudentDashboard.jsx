import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/apiConfig';
import {
    BookOpen,
    Calendar as CalendarIcon,
    Clock,
    Award,
    ChevronRight,
    MapPin,
    Search,
    Bell,
    FileText,
    Download,
    BarChart2,
    PieChart,
    CheckCircle,
    XCircle
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
    getDay,
    startOfWeek,
    endOfWeek,
    isWithinInterval
} from 'date-fns';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    useEffect(() => {
        fetchAttendance();
    }, [user]);

    // Stats Calculations
    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todaysClasses = attendance.filter(a => new Date(a.date).toISOString().split('T')[0] === todayStr);

        // Active Subjects (Unique subject IDs)
        const activeSubjects = new Set(attendance.map(a => a.subjectId?._id)).size;

        // Overall Stats
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = total - present;
        const pct = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        // Weekly Stats
        const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
        const weeklyRecords = attendance.filter(a =>
            isWithinInterval(new Date(a.date), { start: startWeek, end: endWeek })
        );
        const weeklyTotal = weeklyRecords.length;
        const weeklyPresent = weeklyRecords.filter(a => a.status === 'present').length;
        const weeklyPct = weeklyTotal > 0 ? ((weeklyPresent / weeklyTotal) * 100).toFixed(1) : 0;

        // Monthly Stats (Current Month)
        const startMonth = startOfMonth(new Date());
        const endMonth = endOfMonth(new Date());
        const monthlyRecords = attendance.filter(a =>
            isWithinInterval(new Date(a.date), { start: startMonth, end: endMonth })
        );
        const monthlyTotal = monthlyRecords.length;
        const monthlyPresent = monthlyRecords.filter(a => a.status === 'present').length;
        const monthlyPct = monthlyTotal > 0 ? ((monthlyPresent / monthlyTotal) * 100).toFixed(1) : 0;

        // Subject Breakdown
        const subjects = {};
        attendance.forEach(record => {
            const subName = record.subjectId?.subjectName || 'Unknown';
            if (!subjects[subName]) subjects[subName] = { total: 0, present: 0 };
            subjects[subName].total++;
            if (record.status === 'present') subjects[subName].present++;
        });

        // Monthly Trend (Dynamic based on data)
        // Monthly Trend (Starts from January of current year)
        const trendData = [];
        const currentYear = new Date().getFullYear();
        const startOfJan = new Date(currentYear, 0, 1);
        const monthsCount = new Date().getMonth() + 1; // 1 for Jan, 2 for Feb, etc.

        for (let i = 0; i < monthsCount; i++) {
            const d = new Date(currentYear, i, 1);
            const monthKey = format(d, 'MMM');
            const mStart = startOfMonth(d);
            const mEnd = endOfMonth(d);

            const mRecs = attendance.filter(a =>
                isWithinInterval(new Date(a.date), { start: mStart, end: mEnd })
            );

            const mTot = mRecs.length;
            const mPres = mRecs.filter(a => a.status === 'present').length;
            const mPct = mTot > 0 ? Math.round((mPres / mTot) * 100) : 0;

            trendData.push({ month: monthKey, percentage: mPct, total: mTot, present: mPres });
        }



        // Convert to array and sort


        // If no data, maybe show last 3 months empty? Or just empty.
        // Let's just return what we have. If empty, the UI handles it.

        return {
            todaysClasses,
            activeSubjects: activeSubjects || 0,
            percentage: pct,
            total,
            present,
            absent,
            weekly: { percentage: weeklyPct, total: weeklyTotal, present: weeklyPresent },
            monthly: { percentage: monthlyPct, total: monthlyTotal, present: monthlyPresent },
            subjects,
            trend: trendData
        };
    }, [attendance]);

    // Calendar Helper
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const getDayStatus = (date) => {
        const dayRecords = attendance.filter(a => isSameDay(new Date(a.date), date));
        if (dayRecords.length === 0) return null;
        const presentCount = dayRecords.filter(a => a.status === 'present').length;
        if (presentCount === dayRecords.length) return 'present';
        if (presentCount === 0) return 'absent';
        return 'mixed';
    };

    // Mock Data for UI
    const events = [
        { id: 1, title: 'Hackathon 2026 - Code Sprint', type: 'Competition', date: 'Feb 5, 2026', time: '9:00 AM - 6:00 PM', location: 'Main Auditorium', attendees: 150 },
        { id: 2, title: 'Guest Lecture on AI & ML', type: 'Seminar', date: 'Feb 3, 2026', time: '2:00 PM - 4:00 PM', location: 'Conference Hall', attendees: 200 },
        { id: 3, title: 'Tech Workshop - Cloud Basics', type: 'Workshop', date: 'Feb 8, 2026', time: '10:00 AM - 1:00 PM', location: 'Lab 301', attendees: 50 },
    ];

    const materials = [
        { id: 1, title: 'Operating System Concepts', type: 'PDF' },
        { id: 2, title: 'Database Normalization', type: 'PDF' },
        { id: 3, title: 'Binary Tree Implementation', type: 'Code' },
    ];

    const getStatusColor = (status) => {
        if (status === 'present') return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
        if (status === 'absent') return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
        return 'text-yellow-600 bg-yellow-100';
    };

    return (
        <DashboardLayout>
            <div className="space-y-4 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-700">
                            Welcome back, {user?.name || 'Student'}! 👋
                        </h1>
                        <p className="text-muted-foreground mt-1 text-base">
                            Here's your academic overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Motivational Banner */}
                {stats.percentage >= 75 ? (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                        <span className="text-2xl">✨</span>
                        <div>
                            <p className="font-bold text-indigo-900">Amazing progress!</p>
                            <p className="text-sm text-indigo-700">You've maintained {stats.percentage}% attendance this semester. Keep up the excellent work! 🎯</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-bold text-orange-900">Attention Needed</p>
                            <p className="text-sm text-orange-700">Attendance is at {stats.percentage}%. Try to attend more classes to reach the safe zone.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats, Trend, Calendar */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Overall Attendance */}
                            <div className="rounded-xl p-6 text-white shadow-lg relative overflow-hidden group bg-gradient-to-br from-blue-500 to-blue-600">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BarChart2 className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-blue-100 font-medium mb-1">Overall Attendance</p>
                                            <h3 className="text-4xl font-bold">{stats.percentage}%</h3>
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            {stats.percentage >= 75 ? 'On Track' : 'Needs Focus'}
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-blue-100 mb-2">{stats.present} of {stats.total} classes</p>
                                        <div className="w-full bg-black/20 rounded-full h-1.5">
                                            <div
                                                className="bg-white h-1.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${stats.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Attendance */}
                            <div className="rounded-xl p-6 text-white shadow-lg relative overflow-hidden group bg-gradient-to-br from-emerald-500 to-emerald-600">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CalendarIcon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-emerald-100 font-medium mb-1">This Week</p>
                                            <h3 className="text-4xl font-bold">{stats.weekly.percentage}%</h3>
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            +{stats.weekly.present} Attended
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-emerald-100 mb-2">{stats.weekly.present} of {stats.weekly.total} classes attended</p>
                                        <div className="w-full bg-black/20 rounded-full h-1.5">
                                            <div
                                                className="bg-white h-1.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${stats.weekly.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Attendance */}
                            <div className="rounded-xl p-6 text-white shadow-lg relative overflow-hidden group bg-gradient-to-br from-purple-500 to-purple-600">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Award className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-purple-100 font-medium mb-1">This Month</p>
                                            <h3 className="text-4xl font-bold">{stats.monthly.percentage}%</h3>
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            Active
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-purple-100 mb-2">{stats.monthly.present} of {stats.monthly.total} classes</p>
                                        <div className="w-full bg-black/20 rounded-full h-1.5">
                                            <div
                                                className="bg-white h-1.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${stats.monthly.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-primary" />
                                    Attendance Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2 relative ml-8">
                                    {/* Y-Axis Labels */}
                                    <div className="absolute left-[-2rem] top-0 bottom-6 flex flex-col justify-between text-xs text-muted-foreground font-medium">
                                        <span>100</span>
                                        <span>75</span>
                                        <span>50</span>
                                        <span>25</span>
                                        <span>0</span>
                                    </div>

                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-2 pb-6 pr-2">
                                        <div className="border-b border-dashed border-slate-200 h-full w-full absolute top-[0%] left-0"></div>
                                        <div className="border-b border-dashed border-slate-200 h-full w-full absolute top-[25%] left-0"></div>
                                        <div className="border-b border-dashed border-slate-200 h-full w-full absolute top-[50%] left-0"></div>
                                        <div className="border-b border-dashed border-slate-200 h-full w-full absolute top-[75%] left-0"></div>
                                        <div className="border-b border-dashed border-slate-200 h-full w-full absolute bottom-[24px] left-0"></div>
                                    </div>

                                    <div className="flex justify-start items-end w-full h-full pb-6 pl-2 z-10 gap-6">
                                        {stats.trend.map((item, idx) => {
                                            const isLow = item.percentage < 75;
                                            const colorClass = isLow ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';
                                            const textColorClass = isLow ? 'text-red-700' : 'text-green-700';
                                            const borderColorClass = isLow ? 'border-red-100' : 'border-green-100';

                                            return (
                                                <div key={idx} className="flex flex-col items-center justify-end gap-2 w-16 group relative h-full">
                                                    <div
                                                        className={`w-full max-w-[45px] ${colorClass} rounded-t-sm relative flex items-end justify-center transition-all duration-700 cursor-pointer shadow-sm group-hover:shadow-md`}
                                                        style={{ height: `${item.percentage}%`, minHeight: '4px' }}
                                                    >
                                                        {/* Tooltip */}
                                                        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white ${textColorClass} text-xs font-bold py-1 px-2 rounded shadow-lg border ${borderColorClass} opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0`}>
                                                            {item.percentage}%
                                                            <div className={`w-2 h-2 bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b ${borderColorClass}`}></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide shrink-0">{item.month}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                                        <span className="text-xs text-slate-600 font-medium">Good (≥75%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                                        <span className="text-xs text-slate-600 font-medium">Low (&lt;75%)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>




                        {/* Calendar & Distribution */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Calendar */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                        {format(currentMonth, 'MMMM yyyy')}
                                    </CardTitle>
                                    <div className="flex gap-1">
                                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded text-xs">&lt;</button>
                                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-muted rounded text-xs">&gt;</button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                            <div key={day} className="font-medium text-muted-foreground py-1">{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="h-8 md:h-10"></div>
                                        ))}
                                        {daysInMonth.map(date => {
                                            const status = getDayStatus(date);
                                            let bgClass = "bg-transparent";
                                            let textClass = "text-slate-700";

                                            if (status === 'present') {
                                                bgClass = "bg-green-500 text-white shadow-sm";
                                                textClass = "text-white";
                                            } else if (status === 'absent') {
                                                bgClass = "bg-red-500 text-white shadow-sm";
                                                textClass = "text-white";
                                            } else if (status === 'mixed') {
                                                bgClass = "bg-yellow-500 text-white shadow-sm";
                                                textClass = "text-white";
                                            }

                                            return (
                                                <div
                                                    key={date.toString()}
                                                    className={`h-8 md:h-10 rounded-md flex items-center justify-center transition-colors text-xs font-medium cursor-default ${bgClass} ${textClass}`}
                                                >
                                                    {format(date, 'd')}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex gap-3 mt-4 text-[10px] text-muted-foreground justify-center">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <PieChart className="w-4 h-4 text-primary" />
                                        Attendance Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <div className="relative w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center"
                                        style={{
                                            background: `conic-gradient(#22c55e ${stats.percentage}%, #ef4444 0)`
                                        }}
                                    >
                                        <div className="absolute inset-0 rounded-full border-4 border-white opacity-20"></div>
                                        <div className="bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-inner">
                                            <span className="text-2xl font-bold">{stats.percentage}%</span>
                                            <span className="text-[10px] text-muted-foreground">Present</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6 w-full">
                                        <div className="text-center">
                                            <p className="text-green-600 font-bold text-xl">{stats.present}</p>
                                            <p className="text-xs text-muted-foreground">Present</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-red-600 font-bold text-xl">{stats.absent}</p>
                                            <p className="text-xs text-muted-foreground">Absent</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Today's Attendance List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Today's Attendance
                                </h3>
                                <Badge variant="outline">{stats.todaysClasses.length} Classes</Badge>
                            </div>

                            <div className="space-y-3">
                                {stats.todaysClasses.length > 0 ? (
                                    stats.todaysClasses.map((item, idx) => (
                                        <Card key={idx} className="border-l-4 border-l-green-500 hover:shadow-md transition-all">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex gap-4 items-center">
                                                    <div className="p-2 bg-muted rounded-lg">
                                                        <CheckIcons status={item.status} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">{item.subjectId?.subjectName || 'Subject'}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.subjectId?.subjectCode} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(item.status)}>
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="border-dashed">
                                        <CardContent className="p-8 text-center text-muted-foreground">
                                            No classes scheduled or marked for today.
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Student Info, Subject Overview, Events */}
                    <div className="space-y-8">
                        {/* Student Profile Overview Card */}
                        <Card className="bg-white">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                                        {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-xl">{user?.name}</h3>
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-3 py-1">Active Student</Badge>
                                        <p className="text-sm text-muted-foreground mt-1">{user?.department}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Student ID</p>
                                        <p className="font-bold text-slate-800 break-all text-sm">#{user?.enrollmentNumber || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Department</p>
                                        <p className="font-bold text-slate-800 text-sm truncate">{user?.department || "CSE"}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Semester</p>
                                        <p className="font-bold text-slate-800">{user?.semester || '4th Sem'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Year</p>
                                        <p className="font-bold text-slate-800">2025-26</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Subject Overview */}
                        <Card className="bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Subject Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {Object.entries(stats.subjects).map(([subject, data]) => {
                                    const subPct = (data.present / data.total) * 100;
                                    return (
                                        <div key={subject} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium truncate max-w-[150px]" title={subject}>{subject}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{subject.split(' ').map(s => s[0]).join('')}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`font-bold ${subPct >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {Math.round(subPct)}%
                                                    </span>
                                                    <p className="text-[10px] text-muted-foreground">{data.present}/{data.total}</p>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${subPct >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: `${subPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {Object.keys(stats.subjects).length === 0 && (
                                    <p className="text-muted-foreground text-sm text-center py-4">No subject data available.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* College Events Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">College Events</h3>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">{events.length} Upcoming</Badge>
                            </div>

                            {events.map(event => (
                                <Card key={event.id} className="hover:shadow-md transition-all group bg-white">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs border-orange-200 bg-orange-50 text-orange-700">{event.type}</Badge>
                                                </div>
                                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper for status icon
const CheckIcons = ({ status }) => {
    if (status === 'present') return <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"><span className="text-xs">✔</span></div>;
    return <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"><span className="text-xs">✖</span></div>;
};

export default StudentDashboard;
