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
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`
    }

    // Fetch users
    fetch(`${base}/userdata`, { headers, credentials: 'include' })
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to load users:', err)
        setUsers([])
      })

    // Fetch logs
    fetch(`${base}/logdata`, { headers, credentials: 'include' })
      .then(r => r.json())
      .then(data => setLogs(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to load logs:', err)
        setLogs([])
      })
  }, [token])

  // decode role
  let role = ''
  if (token) {
    try {
      role = JSON.parse(window.atob(token.split('.')[1])).role
    } catch {}
  }
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Always work with arrays
  const userArr = Array.isArray(users) ? users : []
  const logArr  = Array.isArray(logs)  ? logs  : []

  // Filter logic
  const filteredUsers = userArr.filter(u =>
    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(uFilter.toLowerCase()) ||
     u.email.toLowerCase().includes(uFilter.toLowerCase()))
  )
  const filteredLogs = logArr
    .filter(l => l.user)
    .filter(l => {
      const t = lFilter.toLowerCase()
      return (
        l.user.firstName.toLowerCase().includes(t) ||
        l.user.lastName.toLowerCase().includes(t) ||
        l.tasksDesc.toLowerCase().includes(t)
      )
    })

  const cellStyle = { border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' }
  const noRows    = cols => (
    <tr>
      <td colSpan={cols} style={{ ...cellStyle, textAlign:'center', color:'#777' }}>
        No results found.
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          {['users','logs'].map(x => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={`py-2 px-6 font-medium ${
                tab===x
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {x==='users' ? 'Users' : 'Log Data'}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {tab==='users' && (
          <>
            <input
              type="text"
              placeholder="🔍 Search users"
              value={uFilter}
              onChange={e => setUFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />
            <div className="overflow-x-auto">
              <table style={{ borderCollapse:'collapse', width:'100%' }}>
                <thead style={{ backgroundColor:'#f3f4f6' }}>
                  <tr>
                    {['Name','Email','Role','Joined','Actions'].map(h => (
                      <th
                        key={h}
                        style={{ ...cellStyle, fontWeight:'600', textAlign:'left' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0
                    ? filteredUsers.map(u => (
                        <tr key={u._id}>
                          <td style={cellStyle}>{u.firstName} {u.lastName}</td>
                          <td style={cellStyle}>{u.email}</td>
                          <td style={cellStyle}>{u.role}</td>
                          <td style={cellStyle}>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : '—'}
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

        {/* Logs Table */}
        {tab==='logs' && (
          <>
            <input
              type="text"
              placeholder="🔍 Search logs"
              value={lFilter}
              onChange={e => setLFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />
            <div className="overflow-x-auto">
              <table style={{ borderCollapse:'collapse', width:'100%' }}>
                <thead style={{ backgroundColor:'#f3f4f6' }}>
                  <tr>
                    {['User','Email','Check In','Check Out','Tasks','Actions'].map(h => (
                      <th
                        key={h}
                        style={{ ...cellStyle, fontWeight:'600', textAlign:'left' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length > 0
                    ? filteredLogs.map(l => (
                        <tr key={l._id}>
                          <td style={cellStyle}>
                            {l.user.firstName} {l.user.lastName}
                          </td>
                          <td style={cellStyle}>{l.user.email}</td>
                          <td style={cellStyle}>
                            {l.checkIn
                              ? new Date(l.checkIn).toLocaleString()
                              : '—'}
                          </td>
                          <td style={cellStyle}>
                            {l.checkOut
                              ? new Date(l.checkOut).toLocaleString()
                              : '—'}
                          </td>
                          <td style={{ ...cellStyle, wordBreak:'break-word' }}>
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
