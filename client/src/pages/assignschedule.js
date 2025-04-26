// client/src/pages/assignschedule.js
import React, { useState, useEffect } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

export default function AssignSchedulePage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5001/api/userdata', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`status ${res.status}`)
        return res.json()
      })
      .then(data => {
        const volunteers = data.filter(u => u.role === 'volunteer')
        setUsers(volunteers)
      })
      .catch(() => setError("Couldn't load users"))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!selectedUser || !start || !end) {
      setError('Please fill in the relevant information')
      return
    }
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5001/api/schedules', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUser,
          start,
          end,
        }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Assign failed')
      }
      alert('Assigned successfully')
      setSelectedUser('')
      setStart('')
      setEnd('')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center mb-8">
        <HamburgerMenu />
        <h1 className="text-2xl font-semibold ml-4">Assign schedule</h1>
      </header>
      <main className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Volunteer</label>
            <select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select one</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Assigning…' : 'Assign schedule'}
          </button>
        </form>
      </main>
    </div>
  )
}