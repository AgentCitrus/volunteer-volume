import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Welcome            from './pages/Welcome';
import LoginPage          from './pages/login';
import RegisterPage       from './pages/register';
import ResetPasswordPage  from './pages/ResetPasswordPage';

import ClockPage          from './pages/clock';
import DashboardPage      from './pages/dashboard';
import ProfilePage        from './pages/profilepage';
import AdminPage          from './pages/admin';

import ViewSchedulePage   from './pages/viewschedule.js';
import AssignSchedulePage from './pages/assignschedule.js';

import ProtectedRoute     from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route index                     element={<Welcome />} />
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/register"          element={<RegisterPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* authenticated */}
        <Route
          path="/clock"
          element={
            <ProtectedRoute>
              <ClockPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdata"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewschedule"
          element={
            <ProtectedRoute>
              <ViewSchedulePage />
            </ProtectedRoute>
          }
        />

        {/* admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignschedule"
          element={
            <ProtectedRoute adminOnly>
              <AssignSchedulePage />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
