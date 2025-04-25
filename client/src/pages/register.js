// client/src/pages/register.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'

const fieldLabels = {
  firstName:         'First Name',
  lastName:          'Last Name',
  birthday:          'Birthday',
  street:            'Street',
  city:              'City',
  state:             'State',
  phoneNumber:       'Phone Number',
  preferredContact:  'Preferred Contact',
  languagesSpoken:   'Languages Spoken',
  howHeard:          'How You Heard',
  otherOrganizations:'Other Organizations',
  disabilities:      'Disabilities',
  email:             'Email',
  password:          'Password'
}

// simple regex checks
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const stateRegex = /^[A-Za-z]{2}$/

export default function RegisterPage() {
  const initialForm = Object.fromEntries(
    Object.keys(fieldLabels).map(k => [k, ''])
  )
  const [form,    setForm]    = useState(initialForm)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(err => ({ ...err, [name]: null }))
    setSuccess('')
  }

  // front-end validation before submit
  const validate = () => {
    const v = {}
    if (!form.firstName.trim()) v.firstName = 'First Name is required.'
    if (!form.lastName.trim())  v.lastName  = 'Last Name is required.'

    if (!form.email.trim())           v.email = 'Email is required.'
    else if (!emailRegex.test(form.email))
      v.email = 'Please enter a valid email address.'

    if (!form.password)               v.password = 'Password is required.'
    else if (form.password.length < 6)
      v.password = 'Password must be at least 6 characters.'

    if (!form.state.trim())           v.state = 'State is required.'
    else if (!stateRegex.test(form.state.trim()))
      v.state = 'State must be a two-letter code (e.g. CA).'

    return v
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess('')

    const vErrors = validate()
    if (Object.keys(vErrors).length) {
      setErrors(vErrors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(
        'http://localhost:5001/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      )
      const data = await res.json()
      if (res.ok) {
        setSuccess('Account created! Please check your email to confirm.')
      } else if (
        data.error?.startsWith('Validation failed:')
      ) {
        // map server-side validation messages
        const parts = data.error
          .replace('Validation failed: ', '')
          .split(', ')
        const errs = {}
        parts.forEach(p => {
          const [field, msg] = p.split(': ')
          errs[field] = msg.includes('required')
            ? `${fieldLabels[field]} is required.`
            : msg
        })
        setErrors(errs)
      } else {
        setErrors({ _global: data.error || 'Registration failed.' })
      }
    } catch {
      setErrors({ _global: 'Network error—please try again.' })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        {errors._global && (
          <p className="text-red-600 text-sm mb-4">{errors._global}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4">{success}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Object.keys(fieldLabels).map(name => {
            const isPwd   = name === 'password'
            const type    = name === 'birthday' ? 'date'
                          : isPwd             ? 'password'
                                             : name === 'email'
                                             ? 'email'
                                             : 'text'
            // make password field full width
            const spanAll = isPwd
            return (
              <div
                key={name}
                className={`flex flex-col ${
                  spanAll ? 'md:col-span-2' : ''
                }`}
              >
                <label className="font-medium mb-1">
                  {fieldLabels[name]}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  className={`border rounded p-2 ${
                    errors[name]
                      ? 'border-red-600'
                      : 'border-gray-300'
                  }`}
                />
                {errors[name] && (
                  <span className="text-red-600 text-xs mt-1">
                    {errors[name]}
                  </span>
                )}
              </div>
            )
          })}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering…' : 'Sign Up'}
          </button>

          <p className="text-sm mt-4 md:col-span-2 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
