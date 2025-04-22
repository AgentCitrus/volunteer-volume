// client/src/pages/register.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    street: '',
    city: '',
    state: '',
    phoneNumber: '',
    preferredContact: 'email',
    languagesSpoken: '',
    howHeard: '',
    otherOrganizations: '',
    disabilities: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      birthday: form.birthday,
      street: form.street,
      city: form.city,
      state: form.state,
      phoneNumber: form.phoneNumber,
      preferredContact: form.preferredContact,
      languagesSpoken: form.languagesSpoken
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      howHeard: form.howHeard,
      otherOrganizations: form.otherOrganizations
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      disabilities: form.disabilities,
      emergencyContact: {
        name: form.emergencyName,
        phone: form.emergencyPhone,
        relationship: form.emergencyRelationship
      },
      email: form.email,
      password: form.password
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Account created! Please sign in.')
        navigate('/login')
      } else {
        const data = await res.json()
        setError(data.error || `Error ${res.status}`)
      }
    } catch {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Fields */}
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Birthday (YYYY-MM-DD)</label>
            <input
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Preferred Contact Method
            </label>
            <select
              name="preferredContact"
              value={form.preferredContact}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Languages Spoken (comma-separated)
            </label>
            <input
              name="languagesSpoken"
              value={form.languagesSpoken}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">How Did You Hear About Us?</label>
            <input
              name="howHeard"
              value={form.howHeard}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Other Organizations (comma-separated)
            </label>
            <input
              name="otherOrganizations"
              value={form.otherOrganizations}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Disabilities</label>
            <input
              name="disabilities"
              value={form.disabilities}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Emergency Contact</legend>
            <div>
              <label className="block text-sm">Name</label>
              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <input
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                placeholder="1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Relationship</label>
              <input
                name="emergencyRelationship"
                value={form.emergencyRelationship}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                required
              />
            </div>
          </fieldset>

          {/* Auth Fields */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline"
            >
              Back to Sign In
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
