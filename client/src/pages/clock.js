// client/src/pages/clock.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function ClockPage() {
  /* ─────────────  local state  ───────────── */
  const [checkInTime, setCheckInTime] = useState(null)
  const [desc,        setDesc]        = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  /* ─────────────  init: load any pending check‑in  ───────────── */
  useEffect(() => {
    const stored = localStorage.getItem('currentCheckIn')
    if (stored) setCheckInTime(new Date(stored))
  }, [])

  const token = localStorage.getItem('token')

  /* ─────────────  handlers  ───────────── */
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
        credentials: 'include',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
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
        const data = await res.json()
        setError(data.error || `Error ${res.status}`)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  /* ─────────────  JSX  ───────────── */
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with hamburger pop‑up */}
      <header className="flex items-center mb-6">
        <HamburgerMenu />
        <h1 className="text-xl font-semibold ml-4">Time Clock</h1>
      </header>

      <main className="max-w-md mx-auto bg-white p-6 rounded shadow">
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        {!checkInTime ? (
          /* ---------------  CHECK‑IN --------------- */
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Check In
          </button>
        ) : (
          /* ---------------  CHECK‑OUT --------------- */
          <>
            <p className="mb-4">
              Checked in at{' '}
              <strong>{checkInTime.toLocaleString()}</strong>
            </p>

            <label className="block mb-2 font-medium">
              What did you do? (min 75 chars)
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full h-28 p-2 border rounded mb-4"
              placeholder="Describe your activities…"
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
