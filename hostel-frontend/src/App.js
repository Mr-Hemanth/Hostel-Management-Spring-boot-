import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import NoticeBoard from './pages/NoticeBoard';
import AdminProfile from './pages/admin/AdminProfile';
import StudentProfile from './pages/student/StudentProfile';
import AdminRooms from './pages/admin/AdminRooms';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRoomChanges from './pages/admin/AdminRoomChanges';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import StudentRoomChange from './pages/student/StudentRoomChange';
import StudentMaintenance from './pages/student/StudentMaintenance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rooms" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminRooms />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminStudents />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maintenance" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminMaintenance />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/room-changes" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminRoomChanges />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-profile" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminProfile />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Student Routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-room" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <StudentRoomChange />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-maintenance" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <StudentMaintenance />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-profile" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <StudentProfile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/notices" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}>
                <Layout>
                  <NoticeBoard />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Fallback routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;