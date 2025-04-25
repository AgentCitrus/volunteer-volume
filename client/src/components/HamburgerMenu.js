// client/src/components/HamburgerMenu.js
<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation }     from 'react-router-dom'
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'
=======
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
>>>>>>> parent of c3b1a79 (Admin dashboard)

export default function HamburgerMenu() {
  const [open, setOpen]   = useState(false)
  const menuRef           = useRef(null)
  const navigate          = useNavigate()
  const { pathname }      = useLocation()

<<<<<<< HEAD
  // close when clicking outside
=======
  // Close when clicking outside
>>>>>>> parent of c3b1a79 (Admin dashboard)
  useEffect(() => {
    const handle = e => open && menuRef.current && !menuRef.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

<<<<<<< HEAD
=======
  // All the authenticated pages you want in your menu:
  const items = [
    { label: 'Time Clock', path: '/clock' },
    { label: 'My Profile', path: '/profile' },
    { label: 'Dashboard',  path: '/dashboard' },
  ]

>>>>>>> parent of c3b1a79 (Admin dashboard)
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  // all links
  const items = [
    { label: 'Dashboard',       to: '/dashboard' },
    { label: 'Admin Dashboard', to: '/admin'      },
    { label: 'Clock In/Out',     to: '/clock'      },
    { label: 'My Profile',       to: '/profilepage' }
  ].filter(x => x.to !== pathname)  // omit current

  return (
    <div ref={menuRef} className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} className="p-2 focus:outline-none">
        {open ? <CloseIcon/> : <MenuIcon/>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <div className="py-1">
            {items.map(i => (
              <button
<<<<<<< HEAD
                key={i.to}
                onClick={() => { setOpen(false); navigate(i.to) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
=======
                key={item.path}
                onClick={() => { setOpen(false); navigate(item.path) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>>>>>>> parent of c3b1a79 (Admin dashboard)
              >
                {i.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200"/>
          <div className="py-1">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 focus:outline-none"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
