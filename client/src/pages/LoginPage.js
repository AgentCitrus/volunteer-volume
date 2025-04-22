import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const navigate                = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      const { user, token } = await res.json()
      localStorage.setItem('token', token)      // store token for protected routes
      navigate('/clock')                        // send them to clock page
    } else {
      alert('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <label className="block mb-4">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block mb-6">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="••••••"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  )
}
