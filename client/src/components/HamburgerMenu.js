// client/src/components/HamburgerMenu.js
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const menuRef         = useRef(null);
  const navigate        = useNavigate();
  const { pathname }    = useLocation();

  /* decode role from JWT */
  let role = '';
  const token = localStorage.getItem('token');
  if (token) {
    try {
      role = JSON.parse(atob(token.split('.')[1])).role;
    } catch {/* ignore */}
  }

  /* click-outside closes menu */
  useEffect(() => {
    const close = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  /* links */
  const tabs = [
    { name: 'Time Clock', path: '/clock' },
    { name: 'Dashboard',  path: '/dashboard' },
    { name: 'My Profile', path: '/userdata' },
    { name: 'My Schedule',   path: '/viewschedule' }
  ];
  if (role === 'admin') {
    tabs.push(
      { name: 'Assign Schedule', path: '/assignschedule' },
    )
    tabs.push({ name: 'Admin', path: '/admin' })
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  /* UI */
  return (
    <div
      ref={menuRef}
      className="fixed top-4 right-4 z-50"   /* <— stays top-right */
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-md bg-white shadow hover:bg-gray-100 focus:outline-none"
      >
        {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100">
          <div className="py-1">
            {tabs
              .filter(t => t.path !== pathname)
              .map(t => (
                <button
                  key={t.path}
                  onClick={() => {
                    navigate(t.path);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {t.name}
                </button>
              ))}
          </div>

          <div className="border-t" />
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
