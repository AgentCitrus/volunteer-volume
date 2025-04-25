import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({
  children,
  adminOnly = false
}) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }

  let role = ''
  try {
    role = JSON.parse(window.atob(token.split('.')[1])).role
  } catch {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
