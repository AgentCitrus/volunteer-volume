import { NavLink } from 'react-router-dom';
import { LogOut, Grid, Calendar, User, Settings, MessageCircle } from 'lucide-react';

const allLinks = [
  { label: 'Dashboard',      to: '/dashboard',   icon: Grid },
  { label: 'My Time Sheets', to: '/clock',       icon: Calendar },
  { label: 'Update Info',    to: '/userdata',    icon: User },
  { label: 'Admin Panel',    to: '/admin',       icon: Settings },
  { label: 'Shifts Calendar',to: '/calendar',    icon: Calendar },
  { label: 'Admin Chat',     to: '/chat',        icon: MessageCircle }
];

export default function Sidebar({ onLogout, role }) {
  const links = role === 'admin' ? allLinks : allLinks.filter(l => l.to !== '/admin');
  return (
    <aside className="w-56 h-screen border-r bg-white flex flex-col">
      <h2 className="text-2xl font-semibold p-6 text-brand-700">
        Volunteer Central
      </h2>

      <nav className="px-3 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm
               ${isActive ? 'bg-brand-100 text-brand-700' : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-2 p-6 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </aside>
  );
}
