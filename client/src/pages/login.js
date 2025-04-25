// client/src/pages/login.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lastEmail, setLastEmail] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetMsg, setResetMsg]   = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const res  = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.token)
        setAttempts(0)
        // ← now sends you straight to Time Clock
        navigate('/clock')
      } else {
        setError(data.error || 'Login failed')
        const count = lastEmail === form.email ? attempts + 1 : 1
        setAttempts(count)
        setLastEmail(form.email)
        if (count > 2) setShowReset(true)
      }
    } catch {
      setError('Network error')
    }
  }

  const handleReset = async () => {
    setResetMsg('')
    try {
      const res = await fetch(
        'http://localhost:5001/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email })
        }
      )
      const data = await res.json()
      setResetMsg(data.message)
    } catch {
      setResetMsg('Network error. Try again later.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Email:</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium">Password:</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {showReset && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold mb-2">Forgot Password?</h2>
              <p className="mb-4 text-sm">
                We’ve detected multiple failed attempts. Enter your email for a reset link.
              </p>
              <input
                type="email"
                className="w-full mb-4 p-2 border rounded"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Send Reset Link
                </button>
              </div>
              {resetMsg && <p className="mt-3 text-sm">{resetMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
