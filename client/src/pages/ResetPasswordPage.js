// client/src/pages/ResetPasswordPage.js
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }
    if (password !== confirm) {
      return setError('Passwords do not match.')
    }

    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5001/api/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        }
      )
      const data = await res.json()
      if (res.ok) {
        setSuccess(data.message)
        // auto‐redirect to login after success
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Reset failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold">Reset Password</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium">Confirm Password:</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
