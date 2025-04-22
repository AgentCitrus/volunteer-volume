import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // we rely on the HttpOnly cookie; if you stored a token in localStorage, check that instead
  const isAuth = document.cookie.includes('token=')
  return isAuth ? children : <Navigate to="/login" replace />
}
