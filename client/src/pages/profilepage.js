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
  password: 'Password'
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState(null)
  const [errors, setErrors]   = useState({})
  const [globalErr, setGlobalErr] = useState('')
  const [loading, setLoading] = useState(false)
  const token                 = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:5001/api/userdata', {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => setForm(data[0] || null))
      .catch(() => setGlobalErr('Failed to load profile.'))
  }, [token])

  const handleChange = e => {
    const { name, value } = e.target
    if (name.startsWith('emergencyContact.')) {
      const k = name.split('.')[1]
      setForm(f => ({
        ...f,
        emergencyContact: { ...f.emergencyContact, [k]: value }
      }))
      setErrors(errs => ({ ...errs, [name]: undefined }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
      setErrors(errs => ({ ...errs, [name]: undefined }))
    }
    setGlobalErr('')
  }

  const validateFrontEnd = () => {
    const errs = {}
    if (!form.firstName.trim())            errs.firstName               = 'First Name is required.'
    if (!form.lastName.trim())             errs.lastName                = 'Last Name is required.'
    if (!form.birthday)                    errs.birthday                = 'Birthday is required.'
    if (!form.street.trim())               errs.street                  = 'Street is required.'
    if (!form.city.trim())                 errs.city                    = 'City is required.'
    if (!/^[A-Za-z]{2}$/.test(form.state)) errs.state                   = 'State must be 2 letters.'
    if (!/^\d{10}$/.test(form.phoneNumber))errs.phoneNumber             = 'Phone Number must be 10 digits.'
    if (!form.email.trim())                errs.email                   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                           errs.email                   = 'Email is invalid.'
    // Emergency contact
    ['name','phone','relationship'].forEach(key => {
      const fld = `emergencyContact.${key}`
      if (!form.emergencyContact[key]?.trim()) {
        errs[fld] = `Emergency contact ${key} is required.`
      }
    })
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const frontErrs = validateFrontEnd()
    if (Object.keys(frontErrs).length) {
      setErrors(frontErrs)
      return
    }
    setLoading(true)

    try {
      const res = await fetch(
        `http://localhost:5001/api/userdata/${form._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify(form)
        }
      )
      if (res.ok) navigate('/dashboard')
      else {
        const data = await res.json()
        setGlobalErr(data.error || `Error ${res.status}`)
      }
    } catch {
      setGlobalErr('Network error. Please try again.')
    }

    setLoading(false)
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <HamburgerMenu />
      <main className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        {globalErr && (
          <p className="mb-4 text-red-600 text-center">{globalErr}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            'firstName','lastName','birthday',
            'street','city','state',
            'phoneNumber','email'
          ].map(name => (
            <div key={name}>
              <label className="block font-medium">
                {fieldLabels[name]}:
              </label>
              <input
                type={name === 'birthday' ? 'date' : 'text'}
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                className={`mt-1 w-full border rounded p-2 ${
                  errors[name] ? 'border-red-600' : ''
                }`}
              />
              {errors[name] && (
                <p className="text-red-600 text-xs mt-1">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          <fieldset className="p-4 border rounded space-y-4">
            <legend className="font-medium">Emergency Contact</legend>
            {['name','phone','relationship'].map(key => {
              const fld = `emergencyContact.${key}`
              return (
                <div key={fld}>
                  <label className="block font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    name={fld}
                    value={form.emergencyContact[key] || ''}
                    onChange={handleChange}
                    className={`mt-1 w-full border rounded p-2 ${
                      errors[fld] ? 'border-red-600' : ''
                    }`}
                  />
                  {errors[fld] && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors[fld]}
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
