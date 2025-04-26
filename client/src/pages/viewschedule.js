// client/src/pages/viewschedule.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function ViewSchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5001/api/schedules/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setSchedules(data))
      .catch(() => setError('Failed to load schedule'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center mb-8">
        <HamburgerMenu />
        <h1 className="text-2xl font-semibold ml-4">Your schedule</h1>
      </header>
      <main className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {schedules.length === 0 ? (
          <p className="text-gray-700">No assignments yet</p>
        ) : (
          <ul className="space-y-4">
            {schedules.map(s => (
              <li key={s._id} className="p-4 bg-gray-100 rounded">
                <p>
                  <strong>
                    {s.user.firstName + " " + s.user.lastName + ": "}
                  </strong>
                  
                  {new Date(s.start).toLocaleString()} –{' '}
                  {new Date(s.end).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
