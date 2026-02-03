import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageSubjects from './pages/admin/ManageSubjects';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import AttendanceMarking from './pages/teacher/AttendanceMarking';
import AttendanceStore from './pages/teacher/AttendanceStore';
import AttendanceReport from './pages/teacher/AttendanceReport';
import { StudentDashboard } from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentAnalytics from './pages/student/StudentAnalytics';
import StudentTimeTable from './pages/student/StudentTimeTable';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />


      {/* Admin Routes */}
      <Route path="/admin/students" element={
        <PrivateRoute roles={['admin']}>
          <ManageStudents />
        </PrivateRoute>
      } />
      <Route path="/admin/teachers" element={
        <PrivateRoute roles={['admin']}>
          <ManageTeachers />
        </PrivateRoute>
      } />
      <Route path="/admin/subjects" element={
        <PrivateRoute roles={['admin']}>
          <ManageSubjects />
        </PrivateRoute>
      } />

      {/* Teacher Routes */}
      <Route path="/teacher/attendance" element={
        <PrivateRoute roles={['teacher']}>
          <AttendanceMarking />
        </PrivateRoute>
      } />
      <Route path="/teacher/store" element={
        <PrivateRoute roles={['teacher']}>
          <AttendanceStore />
        </PrivateRoute>
      } />
      <Route path="/teacher/report" element={
        <PrivateRoute roles={['teacher']}>
          <AttendanceReport />
        </PrivateRoute>
      } />
      <Route path="/teacher/subjects" element={
        <PrivateRoute roles={['teacher']}>
          <TeacherDashboard />
        </PrivateRoute>
      } />

      {/* Student Routes */}
      {/* Note: /dashboard redirects to StudentDashboard for students */}
      <Route path="/student/attendance" element={
        <PrivateRoute roles={['student']}>
          <StudentAttendance />
        </PrivateRoute>
      } />
      <Route path="/student/materials" element={
        <PrivateRoute roles={['student']}>
          <StudentMaterials />
        </PrivateRoute>
      } />
      <Route path="/student/analytics" element={
        <PrivateRoute roles={['student']}>
          <StudentAnalytics />
        </PrivateRoute>
      } />
      <Route path="/student/time-table" element={
        <PrivateRoute roles={['student']}>
          <StudentTimeTable />
        </PrivateRoute>
      } />

      {/* Catch all for /student/* to default dashboard if needed, or specific sub-routes */}
      {/* We removed the generic /student/* to allow specific routing, dashboard handles main view */}

    </Routes>
  );
}

export default App;
