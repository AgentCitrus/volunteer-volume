import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const menuRef         = useRef(null)
  const navigate        = useNavigate()

  /* close when clicking outside */
  useEffect(() => {
    const handleClick = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/;'
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl"
        aria-label="Menu"
      >
        ☰
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10"
        >
          <button
            onClick={() => { setOpen(false); navigate('/dashboard') }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}
