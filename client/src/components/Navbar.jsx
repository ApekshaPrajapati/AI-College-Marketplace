import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', position: 'sticky', top: 0, zIndex: 100 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '26px', height: '26px', background: '#2563eb', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>🎓</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '17px', color: '#0f0f0f' }}>CampusMart</span>
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Home</Link>
            {user && <Link to="/sell" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Sell</Link>}
            {user ? (
              <>
                <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'DM Sans', sans-serif" }}>Hi, {user.name.split(' ')[0]} 👋</span>
                <button onClick={handleLogout} style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Login</Link>
                <Link to="/register" style={{ fontSize: '13px', color: '#fff', textDecoration: 'none', padding: '6px 14px', background: '#2563eb', borderRadius: '8px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Sign up →</Link>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <div style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#374151', borderRadius: '2px' }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: '56px', left: 0, right: 0, background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '18px', zIndex: 99, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>

          <Link to="/" onClick={() => setMenuOpen(false)}
            style={{ fontSize: '15px', color: '#374151', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            🏠 Home
          </Link>

          {user && (
            <Link to="/sell" onClick={() => setMenuOpen(false)}
              style={{ fontSize: '15px', color: '#374151', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              📦 Sell something
            </Link>
          )}

          {user ? (
            <>
              <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'DM Sans', sans-serif" }}>
                Logged in as {user.name}
              </div>
              <button onClick={handleLogout}
                style={{ fontSize: '15px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textAlign: 'left', padding: 0 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                style={{ fontSize: '15px', color: '#374151', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', fontSize: '15px', color: '#fff', textDecoration: 'none', padding: '11px 16px', background: '#2563eb', borderRadius: '10px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                Sign up free →
              </Link>
            </>
          )}
        </div>
      )}
    </>
  )
}