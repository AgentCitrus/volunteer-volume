// client/src/pages/register.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// human-friendly field labels
const fieldLabels = {
  firstName: 'First Name',
  lastName: 'Last Name',
  birthday: 'Birthday',
  street: 'Street',
  city: 'City',
  state: 'State',
  phoneNumber: 'Phone Number',
  preferredContact: 'Preferred Contact',
  languagesSpoken: 'Languages Spoken',
  howHeard: 'How You Heard About Us',
  otherOrganizations: 'Other Organizations',
  disabilities: 'Disabilities',
  email: 'Email',
  password: 'Password',
  'emergencyContact.name': 'Emergency Contact Name',
  'emergencyContact.phone': 'Emergency Contact Phone',
  'emergencyContact.relationship': 'Emergency Contact Relationship'
}

// format raw Mongoose error messages into something friendlier
function formatError(field, msg) {
  if (/required/i.test(msg)) {
    return `${fieldLabels[field]} is required.`
  }
  const minMatch = msg.match(/Minimum characters is (\d+)/)
  if (minMatch) {
    return `${fieldLabels[field]} must be at least ${minMatch[1]} characters.`
  }
  const maxMatch = msg.match(/Max characters is (\d+)/)
  if (maxMatch) {
    return `${fieldLabels[field]} must be at most ${maxMatch[1]} characters.`
  }
  // fallback to the raw message
  return msg
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName:'', lastName:'', birthday:'',
    street:'', city:'', state:'',
    phoneNumber:'', preferredContact:'',
    languagesSpoken:'', howHeard:'',
    otherOrganizations:'', disabilities:'',
    emergencyContact:{ name:'', phone:'', relationship:'' },
    email:'', password:''
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    if (name.startsWith('emergencyContact.')) {
      const key = name.split('.')[1]
      setForm(f => ({
        ...f,
        emergencyContact: { ...f.emergencyContact, [key]: value }
      }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
    setErrors({})
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        return navigate('/login')
      }

      const errText = data.error || ''
      if (/validation failed/i.test(errText)) {
        // parse fields
        const tail = errText.split(/validation failed:?/i)[1] || ''
        const parts = tail.split(/,\s*/)
        const fieldErrors = {}
        parts.forEach(p => {
          const [key, ...rest] = p.split(/: (.+)/)
          if (key && rest.length) {
            fieldErrors[key.trim()] = rest.join(': ').trim()
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ _global: errText })
      }
    } catch {
      setErrors({ _global: 'Network error. Please try again.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        {errors._global && (
          <p className="text-red-500 text-sm mb-4">{errors._global}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            'firstName','lastName','birthday',
            'street','city','state',
            'phoneNumber','preferredContact',
            'languagesSpoken','howHeard',
            'disabilities'
          ].map(name => (
            <div key={name}>
              <label className="block font-medium">{fieldLabels[name]}</label>
              <input
                name={name}
                type={name==='birthday'?'date':'text'}
                value={form[name]}
                onChange={handleChange}
                className="mt-1 w-full border rounded p-2"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">
                  {formatError(name, errors[name])}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block font-medium">{fieldLabels.otherOrganizations}</label>
            <textarea
              name="otherOrganizations"
              value={form.otherOrganizations}
              onChange={handleChange}
              className="mt-1 w-full border rounded p-2 h-20"
            />
            {errors.otherOrganizations && (
              <p className="text-red-500 text-sm mt-1">
                {formatError('otherOrganizations', errors.otherOrganizations)}
              </p>
            )}
          </div>

          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-medium">Emergency Contact</legend>
            {['name','phone','relationship'].map(key => {
              const fld = `emergencyContact.${key}`
              return (
                <div key={key}>
                  <label className="block font-medium">{fieldLabels[fld]}</label>
                  <input
                    name={fld}
                    value={form.emergencyContact[key]}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded p-2"
                  />
                  {errors[fld] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formatError(fld, errors[fld])}
                    </p>
                  )}
                </div>
              )
            })}
          </fieldset>

          <div>
            <label className="block font-medium">{fieldLabels.email}</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formatError('email', errors.email)}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium">{fieldLabels.password}</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full border rounded p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formatError('password', errors.password)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
