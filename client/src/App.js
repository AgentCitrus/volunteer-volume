import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage     from './pages/login'
import ClockPage     from './pages/clock'
import DashboardPage from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterPage from './pages/register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect anything else to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
