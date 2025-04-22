// client/src/pages/clock.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ClockPage() {
  const [checkInTime, setCheckInTime] = useState(null)
  const [desc,        setDesc]        = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const navigate = useNavigate()

  // Load pending check‑in if any
  useEffect(() => {
    const stored = localStorage.getItem('currentCheckIn')
    if (stored) setCheckInTime(new Date(stored))
  }, [])

  const token = localStorage.getItem('token')   // ← grab once

  const handleCheckIn = () => {
    const now = new Date()
    localStorage.setItem('currentCheckIn', now.toISOString())
    setCheckInTime(now)
    setError('')
  }

  const handleCheckOut = async () => {
    setError('')
    if (desc.trim().length < 75) {
      setError('Description must be at least 75 characters.')
      return
    }
    if (!token) {
      setError('Not authenticated. Please log in again.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5001/api/logdata', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`     // ← **send the JWT**
        },
        body: JSON.stringify({
          checkIn:   checkInTime.toISOString(),
          checkOut:  new Date().toISOString(),
          tasksDesc: desc
        })
      })

      if (res.ok) {
        localStorage.removeItem('currentCheckIn')
        setCheckInTime(null)
        setDesc('')
        alert('Checked out successfully!')
      } else {
        const { error: msg } = await res.json()
        setError(msg || `Error ${res.status}`)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* header with hamburger */}
      <header className="flex items-center mb-6">
        <button className="text-2xl mr-4" onClick={() => navigate('/dashboard')}>☰</button>
        <h1 className="text-xl font-semibold">Time Clock</h1>
      </header>

      <main className="max-w-md mx-auto bg-white p-6 rounded shadow">
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        {!checkInTime ? (
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Check In
          </button>
        ) : (
          <>
            <p className="mb-4">
              Checked in at <strong>{checkInTime.toLocaleString()}</strong>
            </p>

            <label className="block mb-2 font-medium">What did you do? (min 75 chars)</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full h-28 p-2 border rounded mb-4"
            />

            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Check Out'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
