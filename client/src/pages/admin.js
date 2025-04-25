// client/src/pages/admin.js
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'
import { Trash2, Edit2 } from 'lucide-react'

export default function AdminPage() {
  const token = localStorage.getItem('token')

  // Hooks
  const [activeTab, setActiveTab]   = useState('users')
  const [users, setUsers]           = useState([])
  const [logs, setLogs]             = useState([])
  const [userFilter, setUserFilter] = useState('')
  const [logFilter, setLogFilter]   = useState('')
  const baseURL = 'http://localhost:5001/api'

  // Fetch data
  useEffect(() => {
    if (!token) return
    const headers = {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`
    }
    fetch(`${baseURL}/userdata`, { headers, credentials: 'include' })
      .then(r => r.json()).then(setUsers).catch(console.error)
    fetch(`${baseURL}/logdata`, { headers, credentials: 'include' })
      .then(r => r.json()).then(setLogs).catch(console.error)
  }, [token])

  // Decode role
  let role = ''
  if (token) {
    try { role = JSON.parse(window.atob(token.split('.')[1])).role }
    catch {}
  }
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Actions
  const handleDeleteUser = async id => {
    if (!window.confirm('Delete this user?')) return
    await fetch(`${baseURL}/userdata/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    })
    setUsers(users.filter(u => u._id !== id))
  }
  const handleEditUser = async user => {
    const firstName = prompt('First name', user.firstName)
    const lastName  = prompt('Last name',  user.lastName)
    const email     = prompt('Email',      user.email)
    const roleVal   = prompt('Role (admin or volunteer)', user.role)
    if (!firstName||!lastName||!email||!roleVal) return
    const res = await fetch(`${baseURL}/userdata/${user._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ firstName, lastName, email, role: roleVal })
    })
    const updated = await res.json()
    setUsers(users.map(u => u._id===updated._id ? updated : u))
  }
  const handleDeleteLog = async id => {
    if (!window.confirm('Delete this log?')) return
    await fetch(`${baseURL}/logdata/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    })
    setLogs(logs.filter(l => l._id !== id))
  }
  const handleEditLog = async log => {
    const tasksDesc = prompt('Tasks description', log.tasksDesc)
    if (!tasksDesc) return
    const res = await fetch(`${baseURL}/logdata/${log._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ tasksDesc })
    })
    const updated = await res.json()
    setLogs(logs.map(l => l._id===updated._id ? updated : l))
  }

  // Filter data
  const filteredUsers = users.filter(u =>
    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(userFilter.toLowerCase()) ||
     u.email.toLowerCase().includes(userFilter.toLowerCase()))
  )
  const filteredLogs = logs
    .filter(l => l.user)
    .filter(l => {
      const name  = `${l.user.firstName} ${l.user.lastName}`.toLowerCase()
      const email = l.user.email.toLowerCase()
      const tasks = l.tasksDesc.toLowerCase()
      const term  = logFilter.toLowerCase()
      return name.includes(term) || email.includes(term) || tasks.includes(term)
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          {['users','logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 font-medium ${
                activeTab===tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
              {tab==='users' ? 'Users' : 'Log Data'}
            </button>
          ))}
        </div>

        {/* Users */}
        {activeTab==='users' && (
          <div className="mb-12">
            <input
              type="text"
              placeholder="🔍 Search users..."
              value={userFilter}
              onChange={e=>setUserFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full table-fixed border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Role</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Joined</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredUsers.map(u=>(
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{u.firstName} {u.lastName}</td>
                      <td className="border border-gray-300 px-4 py-3">{u.email}</td>
                      <td className="border border-gray-300 px-4 py-3 capitalize">{u.role}</td>
                      <td className="border border-gray-300 px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex space-x-3">
                          <Edit2 onClick={()=>handleEditUser(u)} className="w-5 h-5 text-blue-600 hover:text-blue-800"/>
                          <Trash2 onClick={()=>handleDeleteUser(u._id)} className="w-5 h-5 text-red-600 hover:text-red-800"/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs */}
        {activeTab==='logs' && (
          <div>
            <input
              type="text"
              placeholder="🔍 Search logs..."
              value={logFilter}
              onChange={e=>setLogFilter(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none"
            />
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full table-fixed border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">User</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Check In</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Check Out</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Tasks</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredLogs.map(l=>(
                    <tr key={l._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{l.user.firstName} {l.user.lastName}</td>
                      <td className="border border-gray-300 px-4 py-3">{l.user.email}</td>
                      <td className="border border-gray-300 px-4 py-3">{new Date(l.checkIn).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-3">{new Date(l.checkOut).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-3">{l.tasksDesc}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex space-x-3">
                          <Edit2 onClick={()=>handleEditLog(l)} className="w-5 h-5 text-blue-600 hover:text-blue-800"/>
                          <Trash2 onClick={()=>handleDeleteLog(l._id)} className="w-5 h-5 text-red-600 hover:text-red-800"/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
