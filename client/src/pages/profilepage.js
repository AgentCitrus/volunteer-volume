// client/src/pages/profilepage.js
import React, { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';

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
  disabilities:      'Disabilities'
};

export default function ProfilePage() {
  const [form,    setForm]     = useState({});
  const [errors,  setErrors]   = useState({});
  const [loading, setLoading]  = useState(false);
  const [success, setSuccess]  = useState('');

  // ─── Load and autofill on mount ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    let userId;
    try {
      userId = JSON.parse(atob(token.split('.')[1]))._id;
    } catch {
      console.error('Invalid token');
      return;
    }

    fetch(`http://localhost:5001/api/userdata/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const user = data.data || data.user || data;

        if (Array.isArray(user.languagesSpoken))
          user.languagesSpoken = user.languagesSpoken.join(', ');
        if (Array.isArray(user.otherOrganizations))
          user.otherOrganizations = user.otherOrganizations.join(', ');

        if (user.birthday) user.birthday = user.birthday.slice(0, 10);

        setForm(user);
      })
      .catch(err => console.error('Profile load error:', err));
  }, []);

  // ─── Handle field changes ───────────────────────────────────────────────
  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const key = name.split('.')[1];
      setForm(f => ({
        ...f,
        emergencyContact: { ...f.emergencyContact, [key]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(err => ({ ...err, [name]: null }));
    setSuccess('');
  };

  // ─── Front-end validation ───────────────────────────────────────────────
  const validate = () => {
    const v = {};

    if (!form.firstName?.trim())     v.firstName = 'First Name is required.';
    if (!form.lastName?.trim())      v.lastName  = 'Last Name is required.';
    if (form.birthday) {
      const then = new Date(form.birthday).getTime();
      if (then > Date.now())
        v.birthday = 'Birthday cannot be in the future.';
    }

    // STATE: required + two-letter code
    if (!form.state?.trim()) {
      v.state = 'State is required.';
    } else if (!/^[A-Za-z]{2}$/.test(form.state.trim())) {
      v.state = 'State must be a two-letter code (e.g. CA).';
    }

    // PHONE: exactly 10 digits
    const cleanPhone = (form.phoneNumber || '').replace(/\D/g, '');
    if (!cleanPhone) {
      v.phoneNumber = 'Phone Number is required.';
    } else if (cleanPhone.length !== 10) {
      v.phoneNumber = 'Phone Number must be exactly 10 digits.';
    }

    // PREFERRED CONTACT
    if (!form.preferredContact) {
      v.preferredContact = 'Preferred Contact is required.';
    } else if (
      !['email','phone'].includes(form.preferredContact.toLowerCase())
    ) {
      v.preferredContact =
        'Preferred Contact must be “email” or “phone.”';
    }

    // EMERGENCY CONTACT
    const em = form.emergencyContact || {};
    if (!em.name?.trim())
      v['emergencyContact.name'] =
        'Emergency Contact Name is required.';
    const cleanEmPhone = (em.phone||'').replace(/\D/g,'');
    if (!cleanEmPhone) {
      v['emergencyContact.phone'] =
        'Emergency Contact Phone is required.';
    } else if (cleanEmPhone.length !== 10) {
      v['emergencyContact.phone'] =
        'Emergency Contact Phone must be 10 digits.';
    }
    if (!em.relationship?.trim())
      v['emergencyContact.relationship'] =
        'Emergency Contact Relationship is required.';

    return v;
  };

  // ─── Submit updated profile ────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    const vErrors = validate();
    if (Object.keys(vErrors).length) {
      setErrors(vErrors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/userdata/${form._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Your profile has been updated.');
      } else if (data.error?.startsWith('Validation failed:')) {
        const parts = data.error.replace('Validation failed: ', '').split(', ');
        const errs = {};
        parts.forEach(p => {
          const [field,msg] = p.split(': ');
          const label = fieldLabels[field] || field;
          errs[field] = msg.includes('required')
            ? `${label} is required.`
            : msg;
        });
        setErrors(errs);
      } else {
        setErrors({ _global: data.error || 'Update failed.' });
      }
    } catch {
      setErrors({ _global: 'Network error—please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

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
          {Object.keys(fieldLabels).map(name => (
            <div key={name} className="flex flex-col">
              <label className="font-medium mb-1">
                {fieldLabels[name]}
              </label>
              <input
                type={name==='birthday'?'date':'text'}
                name={name}
                value={form[name]||''}
                onChange={handleChange}
                className={`border rounded p-2 ${
                  errors[name] ? 'border-red-600' : 'border-gray-300'
                }`}
              />
              {errors[name] && (
                <span className="text-red-600 text-xs mt-1">
                  {errors[name]}
                </span>
              )}
            </div>
          ))}

          {/* Email read-only */}
          <div className="md:col-span-2 flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email||''}
              disabled
              className="border rounded p-2 bg-gray-200 cursor-not-allowed"
            />
          </div>

          {/* Emergency Contact */}
          <fieldset className="md:col-span-2 p-4 border rounded space-y-4">
            <legend className="font-medium">Emergency Contact</legend>
            {['name','phone','relationship'].map(key => {
              const fld = `emergencyContact.${key}`;
              const lbl = key.charAt(0).toUpperCase()+key.slice(1);
              return (
                <div key={fld} className="flex flex-col">
                  <label className="font-medium mb-1">{lbl}</label>
                  <input
                    name={fld}
                    value={(form.emergencyContact&&form.emergencyContact[key])||''}
                    onChange={handleChange}
                    className={`border rounded p-2 ${
                      errors[fld]?'border-red-600':'border-gray-300'
                    }`}
                  />
                  {errors[fld] && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors[fld]}
                    </span>
                  )}
                </div>
              );
            })}
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
