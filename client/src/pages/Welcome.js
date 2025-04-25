import { Link } from 'react-router-dom';

/* absolutely-centred card */
export default function Welcome() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg px-8 py-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Volunteer Central
        </h1>

        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          A straightforward platform for volunteers and admins to coordinate
          effort, log hours, and assign work — without the clutter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="w-full sm:w-40 inline-flex items-center justify-center
                       px-4 py-2 rounded-md text-sm font-medium
                       text-white bg-indigo-600 hover:bg-indigo-700
                       focus:outline-none focus:ring focus:ring-indigo-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-40 inline-flex items-center justify-center
                       px-4 py-2 rounded-md text-sm font-medium
                       text-indigo-700 border border-indigo-300 bg-white
                       hover:bg-indigo-50 focus:outline-none
                       focus:ring focus:ring-indigo-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
