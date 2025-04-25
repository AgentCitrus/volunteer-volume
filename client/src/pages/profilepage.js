// client/src/pages/profilepage.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'

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
  'emergencyContact.name': 'Emergency Contact Name',
  'emergencyContact.phone': 'Emergency Contact Phone',
  'emergencyContact.relationship': 'Emergency Contact Relationship'
}

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
  return msg
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return navigate('/login')
    fetch('http://localhost:5001/api/userdata', {
      headers: { Authorization:`Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const u = Array.isArray(data) ? data[0] : data
        u.emergencyContact = u.emergencyContact || { name:'',phone:'',relationship:'' }
        setForm(u)
      })
      .catch(() => setErrors({_global:'Failed to load profile'}))
  }, [token, navigate])

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
    setSuccess('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors({}); setSuccess('')

    try {
      const res = await fetch(
        `http://localhost:5001/api/userdata/${form._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      )
      const data = await res.json()
      if (res.ok) {
        setSuccess('Information updated successfully!')
      } else {
        const errText = data.error || ''
        if (/validation failed/i.test(errText)) {
          const tail = errText.split(/validation failed:?/i)[1] || ''
          const parts = tail.split(/,\s*/)
          const fldErr = {}
          parts.forEach(p => {
            const [key, ...rest] = p.split(/: (.+)/)
            if (key && rest.length) {
              fldErr[key.trim()] = rest.join(': ').trim()
            }
          })
          setErrors(fldErr)
        } else {
          setErrors({_global: errText || `Error ${res.status}`})
        }
      }
    } catch {
      setErrors({_global:'Network error. Please try again.'})
    }
    setLoading(false)
  }

  if (!form) {
    return <div className="p-6 text-center">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center mb-6">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold ml-4">Edit Profile</h1>
      </header>

      <main className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        {errors._global && (
          <p className="text-red-500 text-sm text-center">{errors._global}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            'firstName','lastName','birthday',
            'street','city','state',
            'phoneNumber','preferredContact',
            'languagesSpoken','howHeard',
            'otherOrganizations','disabilities','email'
          ].map(name => (
            <div key={name}>
              <label className="block font-medium">{fieldLabels[name]}</label>
              {name === 'otherOrganizations' ? (
                <textarea
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2 h-20"
                />
              ) : (
                <input
                  name={name}
                  type={name==='birthday'?'date': name==='email'?'email':'text'}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              )}
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">
                  {formatError(name, errors[name])}
                </p>
              )}
            </div>
          ))}

          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-medium">Emergency Contact</legend>
            {['name','phone','relationship'].map(key => {
              const fld = `emergencyContact.${key}`
              return (
                <div key={key}>
                  <label className="block font-medium">
                    {fieldLabels[fld]}
                  </label>
                  <input
                    name={fld}
                    value={form.emergencyContact[key] || ''}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}
