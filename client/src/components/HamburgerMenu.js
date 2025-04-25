// client/src/components/HamburgerMenu.js
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const wrapperRef      = useRef(null)
  const navigate        = useNavigate()
  const { pathname }    = useLocation()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const tabs = [
    { name: 'Time Clock', path: '/clock' },
    { name: 'Dashboard',  path: '/dashboard' },
    { name: 'My Profile', path: '/userdata' }
  ]

  // Close menu when clicking outside the whole wrapper
  useEffect(() => {
    const handleClickOutside = e => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 focus:outline-none"
      >
        {open ? <CloseIcon size={24}/> : <MenuIcon size={24}/>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded divide-y divide-gray-200">
          <div className="py-1">
            {tabs
              .filter(tab => tab.path !== pathname)
              .map(tab => (
                <button
                  key={tab.path}
                  onClick={() => {
                    setOpen(false)
                    navigate(tab.path)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {tab.name}
                </button>
              ))}
          </div>
          <div className="border-t border-gray-200" />
          <div className="py-1">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
