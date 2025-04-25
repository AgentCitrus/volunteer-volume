// client/src/pages/login.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, Button } from '../components/UI';

export default function LoginPage() {
  const navigate              = useNavigate();
  const [form,   setForm]     = useState({ email: '', password: '' });
  const [err,    setErr]      = useState('');
  const [tries,  setTries]    = useState(0);

  /* forgot-password mini-form */
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg,   setResetMsg]   = useState('');

  /* ---- login submit ---- */
  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res  = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/clock');
      } else {
        setErr(data.error || 'Login failed');
        setTries(t => t + 1);
      }
    } catch {
      setErr('Network error – try again');
      setTries(t => t + 1);
    }
  };

  /* ---- send reset link ---- */
  const handleReset = async () => {
    setResetMsg('');
    try {
      const res = await fetch(
        'http://localhost:5001/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail || form.email })
        }
      );
      const data = await res.json();
      setResetMsg(data.message || 'If the address exists, a link was sent.');
    } catch {
      setResetMsg('Network error – try again');
    }
  };

  /* ---- UI ---- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <Card className="w-80">
        <h1 className="text-2xl font-semibold text-brand-700 mb-6 text-center">
          Sign In
        </h1>

        {/* login form */}
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

        {/* show "forgot?" only after 3 bad tries */}
        {tries >= 3 && !showReset && (
          <button
            onClick={() => setShowReset(true)}
            className="mt-4 text-sm text-indigo-700 hover:underline"
          >
            Forgot your password?
          </button>
        )}

        {/* reset form */}
        {showReset && (
          <div className="mt-4 space-y-3">
            <Input
              placeholder="Your e-mail"
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleReset} className="w-full">
              Send reset link
            </Button>
            {resetMsg && <p className="text-sm">{resetMsg}</p>}
          </div>
        )}

        {/* footer */}
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
