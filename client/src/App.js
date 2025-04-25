// client/src/App.js
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage         from './pages/login'
import RegisterPage      from './pages/register'
import ResetPasswordPage from './pages/ResetPasswordPage'

import ClockPage     from './pages/clock'
import DashboardPage from './pages/dashboard'
import ProfilePage   from './pages/profilepage'
import AdminPage     from './pages/admin'

import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/register"          element={<RegisterPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Authenticated */}
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

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
