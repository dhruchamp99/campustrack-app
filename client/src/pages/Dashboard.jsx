import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { StudentDashboard } from './student/StudentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    if (user.role === 'admin') return <AdminDashboard />;
    if (user.role === 'teacher') return <TeacherDashboard />;
    if (user.role === 'student') return <StudentDashboard />;

    return <div>Role not recognized</div>;
};

export default Dashboard;
