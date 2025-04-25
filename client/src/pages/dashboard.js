// client/src/pages/dashboard.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function DashboardPage() {
  const [logs, setLogs]     = useState([])
  const [filter, setFilter] = useState('')
  const token               = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return

    async function loadLogs() {
      try {
        const res = await fetch('http://localhost:5001/api/logdata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:   `Bearer ${token}`
          },
          credentials: 'include'
        })

        const data = await res.json()
        console.log('dashboard raw response:', data)

        if (!res.ok) {
          console.error('Failed to fetch logs:', data)
          setLogs([])
          return
        }

        setLogs(Array.isArray(data) ? data : [])
        console.log('dashboard logs:', data)
      } catch (err) {
        console.error('Error fetching logs:', err)
        setLogs([])
      }
    }

    loadLogs()
  }, [token])

  const term = filter.toLowerCase().trim()
  const filtered = logs
    .filter(l => l.user)
    .filter(l =>
      l.user.firstName.toLowerCase().includes(term) ||
      l.user.lastName.toLowerCase().includes(term) ||
      l.user.email.toLowerCase().includes(term)
    )

  const noRows = () => (
    <tr>
      <td colSpan={3} className="text-center p-4">
        No logs to display
      </td>
    </tr>
  )

  const cellStyle = { border: '1px solid #ccc', padding: 8, verticalAlign: 'top' }

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Activity</h1>
        <input
          type="text"
          placeholder="🔍 Search your logs"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
        />
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                {['Check In', 'Check Out', 'Tasks'].map(h => (
                  <th
                    key={h}
                    style={{ ...cellStyle, fontWeight: 600, textAlign: 'left' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length
                ? filtered.map(l => (
                    <tr key={l._id}>
                      <td style={cellStyle}>
                        {new Date(l.checkIn).toLocaleString()}
                      </td>
                      <td style={cellStyle}>
                        {l.checkOut
                          ? new Date(l.checkOut).toLocaleString()
                          : '—'}
                      </td>
                      <td style={{ ...cellStyle, wordBreak: 'break-word' }}>
                        {l.tasksDesc}
                      </td>
                    </tr>
                  ))
                : noRows()}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
