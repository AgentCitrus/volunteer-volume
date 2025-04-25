// client/src/pages/login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

export default function LoginPage() {
  const navigate = useNavigate();

  /* ───── login form ───── */
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  /* ───── reset-password form ───── */
  const [showReset,   setShowReset]   = useState(false);
  const [resetEmail,  setResetEmail]  = useState('');
  const [resetMsg,    setResetMsg]    = useState('');

  /* ─────────────────────────────── */
  const handleLoginChange = e =>
    setLoginForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/clock');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error – try again');
    }
  };

  /* ───────── forgot-password ───────── */
  const handleResetSubmit = async () => {
    setResetMsg('');
    try {
      const res = await fetch(
        'http://localhost:5001/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail })
        }
      );
      const data = await res.json();
      setResetMsg(data.message || 'If that address is registered, we sent a link.');
    } catch {
      setResetMsg('Network error – try again');
    }
  };

  /* ───────────────── UI ───────────────── */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <HamburgerMenu />
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Log In</h1>

        {/* ───── Login form ───── */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
            className="w-full border p-2 rounded"
          />

          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>

        {/* ───── Forgot-password toggle ───── */}
        <button
          onClick={() => setShowReset(s => !s)}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          Forgot your password?
        </button>

        {showReset && (
          <div className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="Enter your e-mail"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleResetSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send reset link
            </button>
            {resetMsg && <p className="text-sm">{resetMsg}</p>}
          </div>
        )}

        {/* ───── Create-account link ───── */}
        <p className="mt-6 text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
