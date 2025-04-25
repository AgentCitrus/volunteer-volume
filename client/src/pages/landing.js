// client/src/pages/landing.js
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-5xl font-extrabold mb-6">Volunteer Central</h1>

      <p className="text-2xl mb-10 max-w-4xl">
        A simple way for volunteers and admins to coordinate effort, log hours,
        and assign work—without the clutter.
      </p>

      {/* separate links with spacing */}
      <div className="space-x-6 text-lg">
        <Link to="/login"    className="text-purple-700 hover:underline">
          Login
        </Link>
        <Link to="/register" className="text-purple-700 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
