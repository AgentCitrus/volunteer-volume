// client/src/pages/dashboard.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function DashboardPage() {
  const [logs, setLogs]     = useState([])
  const [filter, setFilter] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:5001/api/logdata', {
      headers: {
        'Content-Type': 'application/json',
        Authorization:   `Bearer ${token}`
      },
      credentials: 'include'
    })
      .then(r => r.json())
      .then(setLogs)
      .catch(console.error)
  }, [token])

  const fl = logs
    .filter(l => l.user)
    .filter(l => {
      const t = filter.toLowerCase()
      return (
        l.tasksDesc.toLowerCase().includes(t) ||
        l.user.firstName.toLowerCase().includes(t) ||
        l.user.lastName.toLowerCase().includes(t)
      )
    })

  const noRows = () => (
    <tr>
      <td
        colSpan="3"
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          textAlign: 'center',
          color: '#777'
        }}
      >
        No results found.
      </td>
    </tr>
  )

  const cellStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    verticalAlign: 'top'
  }

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
          <table
            style={{ borderCollapse: 'collapse', width: '100%' }}
          >
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                {['Check In', 'Check Out', 'Tasks'].map(h => (
                  <th key={h} style={{ ...cellStyle, fontWeight: '600', textAlign: 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fl.length > 0 ? (
                fl.map(l => (
                  <tr key={l._id} style={{ backgroundColor: '#fff' }}>
                    <td style={cellStyle}>
                      {new Date(l.checkIn).toLocaleString()}
                    </td>
                    <td style={cellStyle}>
                      {new Date(l.checkOut).toLocaleString()}
                    </td>
                    <td style={{ ...cellStyle, wordBreak: 'break-word' }}>
                      {l.tasksDesc}
                    </td>
                  </tr>
                ))
              ) : (
                noRows()
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
