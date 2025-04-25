import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // close on outside click
  useEffect(() => {
    const handler = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // decode JWT to get role
  const token = localStorage.getItem('token')
  let role = ''
  if (token) {
    try {
      role = JSON.parse(window.atob(token.split('.')[1])).role
    } catch (err) {
      console.error('JWT decode failed', err)
    }
  }

  const items = [
    { label: 'Time Clock',      path: '/clock' },
    { label: 'Dashboard',       path: '/dashboard' },
    ...(role === 'admin'
      ? [{ label: 'Admin Dashboard', path: '/admin' }]
      : []),
    { label: 'My Profile',      path: '/profilepage' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/;'
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-2xl"
        aria-label="Menu"
      >
        ☰
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-10"
        >
          {items
            .filter(item => item.path !== pathname)
            .map(item => (
              <button
                key={item.path}
                onClick={() => {
                  setOpen(false)
                  navigate(item.path)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}

          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
