// client/src/pages/register.js
import React, { useState } from 'react'
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
  'emergencyContact.name': 'Emergency Contact Name',
  'emergencyContact.phone': 'Emergency Contact Phone',
  'emergencyContact.relationship': 'Emergency Contact Relationship',
  email: 'Email',
  password: 'Password'
}

function formatError(field, msg) {
  if (/required/i.test(msg)) {
    return `${fieldLabels[field]} is required.`
  }
  return msg
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    street: '',
    city: '',
    state: '',
    phoneNumber: '',
    preferredContact: '',
    languagesSpoken: '',
    howHeard: '',
    otherOrganizations: '',
    disabilities: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    email: '',
    password: ''
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [globalErr, setGlobalErr] = useState('')

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
    setErrors(errs => ({ ...errs, [name]: undefined }))
    setGlobalErr('')
  }

  const validateFrontEnd = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First Name is required.'
    if (!form.lastName.trim())  errs.lastName  = 'Last Name is required.'
    if (!/^[A-Za-z]{2}$/.test(form.state)) {
      errs.state = 'State must be 2 letters.'
    }
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      errs.phoneNumber = 'Phone Number must be 10 digits.'
    }
    if (!form.email.trim())    errs.email    = 'Email is required.'
    if (!form.password)        errs.password = 'Password is required.'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const frontErrs = validateFrontEnd()
    if (Object.keys(frontErrs).length) {
      setErrors(frontErrs)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        navigate('/clock')
      } else {
        const msg = data.error || ''
        if (/validation failed/i.test(msg)) {
          // parse "Validation failed: field: msg, field2: msg2"
          const parts = msg
            .split(/validation failed:?/i)[1]
            .split(/,\s*/)
          const fldErr = {}
          parts.forEach(p => {
            const [key, ...rest] = p.split(/: (.+)/)
            if (key && rest.length) fldErr[key.trim()] = rest.join(': ')
          })
          setErrors(fldErr)
        } else {
          setGlobalErr(msg || `Error ${res.status}`)
        }
      }
    } catch {
      setGlobalErr('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center mb-6">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold ml-4">Create Account</h1>
      </header>

      <main className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        {globalErr && (
          <p className="text-red-600 text-xs text-center" style={{ color: 'red', fontSize: '0.75rem' }}>
            {globalErr}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            'firstName','lastName','birthday',
            'street','city','state',
            'phoneNumber','preferredContact',
            'languagesSpoken','howHeard',
            'otherOrganizations','disabilities','email','password'
          ].map(name => (
            <div key={name}>
              <label className="block font-medium">
                {fieldLabels[name]}:
              </label>
              <div className="flex items-center">
                <input
                  type={
                    name === 'birthday'
                      ? 'date'
                      : name === 'password'
                      ? 'password'
                      : 'text'
                  }
                  name={name}
                  value={
                    name === 'password' ? form.password : form[name] || ''
                  }
                  onChange={handleChange}
                  className={`mt-1 w-full border rounded p-2 ${
                    errors[name] ? 'border-red-600' : ''
                  }`}
                />
                {errors[name] && (
                  <span
                    className="ml-2 text-red-600 text-xs"
                    style={{ color: 'red', fontSize: '0.75rem' }}
                  >
                    {formatError(name, errors[name])}
                  </span>
                )}
              </div>
            </div>
          ))}

          <fieldset className="border p-4 rounded space-y-4">
            <legend className="font-medium">Emergency Contact</legend>
            {['name','phone','relationship'].map(key => {
              const fld = `emergencyContact.${key}`
              return (
                <div key={fld}>
                  <label className="block font-medium">
                    {fieldLabels[fld]}:
                  </label>
                  <div className="flex items-center">
                    <input
                      name={fld}
                      value={form.emergencyContact[key] || ''}
                      onChange={handleChange}
                      className={`mt-1 w-full border rounded p-2 ${
                        errors[key] ? 'border-red-600' : ''
                      }`}
                    />
                    {errors[key] && (
                      <span
                        className="ml-2 text-red-600 text-xs"
                        style={{ color: 'red', fontSize: '0.75rem' }}
                      >
                        {formatError(key, errors[key])}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </main>
    </div>
  )
}
