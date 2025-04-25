// client/src/pages/clock.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function ClockPage() {
  /* ─────────────  local state  ───────────── */
  const [checkInTime, setCheckInTime] = useState(null)
  const [desc,        setDesc]        = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  /* ─────────────  init: load any pending check-in  ───────────── */
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

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5001/api/logdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          checkIn:  checkInTime.toISOString(),
          checkOut: new Date().toISOString(),
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

  /* ─────────────  UI ───────────── */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center mb-8">
        <HamburgerMenu />
        <h1 className="text-2xl font-semibold ml-4">Time Clock</h1>
      </header>

      <main className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
        {!checkInTime ? (
          <>
            <p className="text-gray-700 mb-6">
              You’re currently <strong>not checked in.</strong>
            </p>
            <button
              onClick={handleCheckIn}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check In
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">
              Checked in at{' '}
              <strong>{checkInTime.toLocaleString()}</strong>
            </p>

            <label className="block mb-2 font-medium">
              What did you do?{' '}
              <span className="text-sm text-gray-500">
                (min 75 chars)
              </span>
            </label>
            <textarea
              className="w-full h-28 rounded-md border-gray-300 mb-4 p-2"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Check Out'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
