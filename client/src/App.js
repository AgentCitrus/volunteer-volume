// client/src/App.js
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage     from './pages/login'
import RegisterPage  from './pages/register'
import ClockPage     from './pages/clock'
import ProfilePage   from './pages/profilepage'
import DashboardPage from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
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

        {/* Fallback: redirect any unknown URL to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
