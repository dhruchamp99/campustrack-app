// API Configuration
// This file centralizes all API endpoint configurations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    GET_USER: `${API_BASE_URL}/api/auth/me`,

    // Admin endpoints
    ADMIN_STUDENTS: `${API_BASE_URL}/api/admin/students`,
    ADMIN_TEACHERS: `${API_BASE_URL}/api/admin/teachers`,
    ADMIN_SUBJECTS: `${API_BASE_URL}/api/admin/subjects`,
    ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,

    // Teacher endpoints
    TEACHER_SUBJECTS: `${API_BASE_URL}/api/teacher/subjects`,
    TEACHER_ATTENDANCE: `${API_BASE_URL}/api/teacher/attendance`,
    TEACHER_STUDENTS: `${API_BASE_URL}/api/teacher/students`,

    // Student endpoints
    STUDENT_ATTENDANCE: `${API_BASE_URL}/api/student/attendance`,
    STUDENT_SUBJECTS: `${API_BASE_URL}/api/student/subjects`,

    // Attendance endpoints
    ATTENDANCE_REPORT: `${API_BASE_URL}/api/attendance/report`,
    ATTENDANCE_STUDENT: (studentId) => `${API_BASE_URL}/api/attendance/student/${studentId}`,
    ATTENDANCE: `${API_BASE_URL}/api/attendance`,
};

export default API_BASE_URL;
