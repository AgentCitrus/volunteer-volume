// client/src/components/HamburgerMenu.js
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Close on outside click
  useEffect(() => {
    const handleClick = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Decode role
  const token = localStorage.getItem('token')
  let role = ''
  if (token) {
    try {
      role = JSON.parse(window.atob(token.split('.')[1])).role
    } catch {}
  }

  const items = [
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
        aria-label="Menu"
        className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {open
          ? <CloseIcon size={20} className="text-gray-700" />
          : <MenuIcon  size={20} className="text-gray-700" />}
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          style={{ borderCollapse: 'separate' }}
        >
          <div className="py-1">
            {items.map(item => {
              const isActive = pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setOpen(false)
                    navigate(item.path)
                  }}
                  disabled={isActive}
                  className={`
                    block w-full text-left px-4 py-2 text-sm font-medium
                    ${isActive
                      ? 'bg-gray-100 text-gray-900 cursor-default'
                      : 'text-gray-700 hover:bg-gray-50'}
                    focus:outline-none focus:bg-gray-50
                  `}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="border-t border-gray-200" />
          <div className="py-1">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
