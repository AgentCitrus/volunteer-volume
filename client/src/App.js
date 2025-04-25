// client/src/App.js
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

<<<<<<< HEAD
import LoginPage          from './pages/login'
import RegisterPage       from './pages/register'
import ClockPage          from './pages/clock'
import ProfilePage        from './pages/profilepage'
import DashboardPage      from './pages/dashboard'
import AdminPage          from './pages/admin'
import ResetPasswordPage  from './pages/ResetPasswordPage'
import ProtectedRoute     from './components/ProtectedRoute'
=======
import LoginPage     from './pages/login'
import RegisterPage  from './pages/register'
import ClockPage     from './pages/clock'
import ProfilePage   from './pages/profilepage'
import DashboardPage from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
>>>>>>> parent of c3b1a79 (Admin dashboard)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

<<<<<<< HEAD
        {/* Authenticated routes */}
=======
        {/* Protected */}
>>>>>>> parent of c3b1a79 (Admin dashboard)
        <Route
          path="/clock"
          element={
            <ProtectedRoute>
              <ClockPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
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

<<<<<<< HEAD
        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
=======
        {/* Fallback: redirect any unknown URL to /login */}
>>>>>>> parent of c3b1a79 (Admin dashboard)
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
