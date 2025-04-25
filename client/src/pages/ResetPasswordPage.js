// client/src/pages/ResetPasswordPage.js
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'

export default function ResetPasswordPage() {
  const { token }      = useParams()
  const navigate       = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
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
        setSuccess(data.message || 'Password reset successful!')
        // auto-redirect back to login after a short pause
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      console.error(err)
      setError('Network error—please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium">Confirm Password</label>
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
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
