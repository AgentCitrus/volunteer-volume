// client/src/pages/admin.js
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'
import { Trash2, Edit2 } from 'lucide-react'

export default function AdminPage() {
  const token = localStorage.getItem('token')
  const [tab, setTab]         = useState('users')
  const [users, setUsers]     = useState([])
  const [logs, setLogs]       = useState([])
  const [uFilter, setUFilter] = useState('')
  const [lFilter, setLFilter] = useState('')
  const base = 'http://localhost:5001/api'

  useEffect(() => {
    if (!token) return
    const headers = {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`
    }
    fetch(`${base}/userdata`, { headers, credentials: 'include' })
      .then(r => r.json()).then(setUsers)
    fetch(`${base}/logdata`, { headers, credentials: 'include' })
      .then(r => r.json()).then(setLogs)
  }, [token])

  // decode role
  let role = ''
  if (token) {
    try { role = JSON.parse(window.atob(token.split('.')[1])).role }
    catch {}
  }
  if (role !== 'admin') return <Navigate to="/dashboard" replace />

  // filtered data
  const fu = users.filter(u =>
    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(uFilter.toLowerCase()) ||
     u.email.toLowerCase().includes(uFilter.toLowerCase()))
  )
  const fl = logs
    .filter(l => l.user)
    .filter(l => {
      const t = lFilter.toLowerCase()
      return (
        l.user.firstName.toLowerCase().includes(t) ||
        l.user.lastName.toLowerCase().includes(t) ||
        l.tasksDesc.toLowerCase().includes(t)
      )
    })

  const cellStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    verticalAlign: 'top'
  }

  const noRows = cols => (
    <tr>
      <td
        colSpan={cols}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex space-x-4 border-b mb-6">
          {['users','logs'].map(x => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={`py-2 px-6 font-medium ${
                tab === x
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {x === 'users' ? 'Users' : 'Log Data'}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <>
            <input
              type="text"
              placeholder="🔍 Search users"
              value={uFilter}
              onChange={e => setUFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />

            <div className="overflow-x-auto">
              <table
                style={{ borderCollapse: 'collapse', width: '100%' }}
              >
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    {['Name','Email','Role','Joined','Actions'].map(h => (
                      <th
                        key={h}
                        style={{ ...cellStyle, fontWeight: '600', textAlign: 'left' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fu.length > 0
                    ? fu.map(u => (
                        <tr key={u._id} style={{ backgroundColor: '#fff' }}>
                          <td style={cellStyle}>
                            {u.firstName} {u.lastName}
                          </td>
                          <td style={cellStyle}>{u.email}</td>
                          <td style={cellStyle}>{u.role}</td>
                          <td style={cellStyle}>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td style={cellStyle}>
                            <div className="flex space-x-3">
                              <Edit2 className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                              <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                            </div>
                          </td>
                        </tr>
                      ))
                    : noRows(5)}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'logs' && (
          <>
            <input
              type="text"
              placeholder="🔍 Search logs"
              value={lFilter}
              onChange={e => setLFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />

            <div className="overflow-x-auto">
              <table
                style={{ borderCollapse: 'collapse', width: '100%' }}
              >
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    {['User','Email','Check In','Check Out','Tasks','Actions'].map(h => (
                      <th
                        key={h}
                        style={{ ...cellStyle, fontWeight: '600', textAlign: 'left' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fl.length > 0
                    ? fl.map(l => (
                        <tr key={l._id} style={{ backgroundColor: '#fff' }}>
                          <td style={cellStyle}>
                            {l.user.firstName} {l.user.lastName}
                          </td>
                          <td style={cellStyle}>{l.user.email}</td>
                          <td style={cellStyle}>
                            {new Date(l.checkIn).toLocaleString()}
                          </td>
                          <td style={cellStyle}>
                            {new Date(l.checkOut).toLocaleString()}
                          </td>
                          <td style={{ ...cellStyle, wordBreak: 'break-word' }}>
                            {l.tasksDesc}
                          </td>
                          <td style={cellStyle}>
                            <div className="flex space-x-3">
                              <Edit2 className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                              <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                            </div>
                          </td>
                        </tr>
                      ))
                    : noRows(6)}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
