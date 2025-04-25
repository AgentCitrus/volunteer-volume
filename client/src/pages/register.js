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
  email: 'Email',
  password: 'Password'
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', birthday: '',
    street: '', city: '', state: '',
    phoneNumber: '', preferredContact: '',
    languagesSpoken: '', howHeard: '',
    otherOrganizations: '', disabilities: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    email: '', password: ''
  })
  const [errors, setErrors] = useState({})
  const [globalErr, setGlobalErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    if (name.startsWith('emergencyContact.')) {
      const key = name.split('.')[1]
      setForm(f => ({
        ...f,
        emergencyContact: { ...f.emergencyContact, [key]: value }
      }))
      setErrors(errs => ({ ...errs, [`emergencyContact.${key}`]: undefined }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
      setErrors(errs => ({ ...errs, [name]: undefined }))
    }
    setGlobalErr('')
  }

  const validateFrontEnd = () => {
    const errs = {}
    // Required fields
    if (!form.firstName.trim())              errs.firstName               = 'First Name is required.'
    if (!form.lastName.trim())               errs.lastName                = 'Last Name is required.'
    if (!form.birthday)                      errs.birthday                = 'Birthday is required.'
    if (!form.street.trim())                 errs.street                  = 'Street is required.'
    if (!form.city.trim())                   errs.city                    = 'City is required.'
    if (!/^[A-Za-z]{2}$/.test(form.state))   errs.state                   = 'State must be 2 letters.'
    if (!/^\d{10}$/.test(form.phoneNumber))  errs.phoneNumber             = 'Phone Number must be 10 digits.'
    if (!form.preferredContact.trim())       errs.preferredContact        = 'Preferred Contact is required.'
    if (!form.languagesSpoken.trim())        errs.languagesSpoken         = 'Languages Spoken is required.'
    if (!form.howHeard.trim())               errs.howHeard                = 'How You Heard About Us is required.'
    if (!form.otherOrganizations.trim())      errs.otherOrganizations      = 'Other Organizations is required.'
    if (!form.disabilities.trim())           errs.disabilities            = 'Disabilities is required.'
    if (!form.email.trim())                  errs.email                   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                             errs.email                   = 'Email is invalid.'
    if (!form.password)                      errs.password                = 'Password is required.'

    // Emergency contact required
    if (!form.emergencyContact.name.trim())        errs['emergencyContact.name']         = 'Contact Name is required.'
    if (!form.emergencyContact.phone.trim())       errs['emergencyContact.phone']        = 'Contact Phone is required.'
    if (!form.emergencyContact.relationship.trim())errs['emergencyContact.relationship'] = 'Contact Relationship is required.'

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
      } else if (/validation failed/i.test(data.error || '')) {
        // Schema validation errors
        const parts = (data.error || '')
          .split(/validation failed:?/i)[1]
          .split(/,\s*/)
        const fldErr = {}
        parts.forEach(p => {
          const [key, ...rest] = p.split(/: (.+)/)
          if (key && rest.length) fldErr[key.trim()] = rest.join(': ')
        })
        setErrors(fldErr)
      } else {
        setGlobalErr(data.error || `Error ${res.status}`)
      }
    } catch {
      setGlobalErr('Network error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <HamburgerMenu />
      <main className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        {globalErr && (
          <p className="mb-4 text-red-600 text-center">{globalErr}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            'firstName','lastName','birthday',
            'street','city','state',
            'phoneNumber','preferredContact',
            'languagesSpoken','howHeard',
            'otherOrganizations','disabilities',
            'email','password'
          ].map(name => (
            <div key={name}>
              <label className="block font-medium">
                {fieldLabels[name]}:
              </label>
              <input
                type={
                  name === 'birthday'  ? 'date' :
                  name === 'password'  ? 'password' :
                                         'text'
                }
                name={name}
                value={
                  name === 'password'
                    ? form.password
                    : form[name] || ''
                }
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
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </main>
    </div>
  )
}
