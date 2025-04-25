import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, Button } from '../components/UI';

export default function LoginPage() {
  const navigate      = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr]   = useState('');

  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/clock');
      } else setErr(data.error || 'Login failed');
    } catch {
      setErr('Network error – try again');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <Card className="w-80">
        <h1 className="text-2xl font-semibold text-brand-700 mb-6 text-center">
          Sign In
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}
