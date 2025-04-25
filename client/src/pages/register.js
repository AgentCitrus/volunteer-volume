import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, TextArea, Button } from '../components/UI';

const blank = {
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
};

export default function RegisterPage() {
  const navigate          = useNavigate();
  const [form, setForm]   = useState(blank);
  const [err, setErr]     = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Account created. Check email to confirm.');
        navigate('/login');
      } else setErr(data.error || 'Error');
    } catch {
      setErr('Network error – try again');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <Card className="max-w-3xl w-full">
        <h1 className="text-2xl font-semibold text-brand-700 mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="First Name" value={form.firstName}  onChange={e => set('firstName', e.target.value)} required />
          <Input placeholder="Last Name"  value={form.lastName}   onChange={e => set('lastName', e.target.value)} required />
          <Input placeholder="Birthday"   type="date" value={form.birthday} onChange={e => set('birthday', e.target.value)} />
          <Input placeholder="Phone Number" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} />
          <Input placeholder="Street"     value={form.street}      onChange={e => set('street', e.target.value)} />
          <Input placeholder="City"       value={form.city}        onChange={e => set('city', e.target.value)} />
          <Input placeholder="State"      value={form.state}       onChange={e => set('state', e.target.value)} />

          <Input placeholder="Preferred Contact (email/phone)" value={form.preferredContact} onChange={e => set('preferredContact', e.target.value)} />
          <Input placeholder="Languages Spoken (comma-separated)" value={form.languagesSpoken} onChange={e => set('languagesSpoken', e.target.value)} />
          <Input placeholder="How You Heard" value={form.howHeard} onChange={e => set('howHeard', e.target.value)} />
          <Input placeholder="Other Organizations (comma-separated)" value={form.otherOrganizations} onChange={e => set('otherOrganizations', e.target.value)} />
          <Input placeholder="Disabilities" value={form.disabilities} onChange={e => set('disabilities', e.target.value)} />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Emergency Contact Name" value={form.emergencyContact.name} onChange={e => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, name: e.target.value } }))} />
            <Input placeholder="Emergency Phone" value={form.emergencyContact.phone} onChange={e => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, phone: e.target.value } }))} />
            <Input placeholder="Relationship" value={form.emergencyContact.relationship} onChange={e => setForm(f => ({ ...f, emergencyContact: { ...f.emergencyContact, relationship: e.target.value } }))} />
          </div>

          <Input placeholder="Email"   type="email" className="md:col-span-2" value={form.email} onChange={e => set('email', e.target.value)} required />
          <Input placeholder="Password" type="password" className="md:col-span-2" value={form.password} onChange={e => set('password', e.target.value)} required />

          <TextArea
            placeholder="Anything else we should know?"
            className="md:col-span-2 h-24"
            value={form.notes || ''}
            onChange={e => set('notes', e.target.value)}
          />

          {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}

          <Button type="submit" className="md:col-span-2">
            Create Account
          </Button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
