import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e8e4dc',
      padding: '0 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{ width: '26px', height: '26px', background: '#2563eb', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>🎓</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '17px', color: '#0f0f0f' }}>CampusMart</span>
      </Link>

      {/* Desktop right links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
        className="desktop-nav">
        <style>{`
          @media (max-width: 600px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
          @media (min-width: 601px) { .mobile-menu-btn { display: none !important; } .mobile-dropdown { display: none !important; } }
        `}</style>

        <Link to="/" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.color = '#555'}>
          Home
        </Link>

        {user && (
          <Link to="/sell" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}>
            Sell
          </Link>
        )}

        {user ? (
          <>
            <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'DM Sans', sans-serif" }}>
              Hi, {user.name.split(' ')[0]} 👋
            </span>
            <button onClick={handleLogout} style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Login
            </Link>
            <Link to="/register" style={{ fontSize: '13px', color: '#fff', textDecoration: 'none', padding: '6px 14px', background: '#2563eb', borderRadius: '8px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
              Sign up →
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
        <div style={{ width: '22px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.2s' }} />
        <div style={{ width: '22px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.2s' }} />
        <div style={{ width: '22px', height: '2px', background: menuOpen ? '#2563eb' : '#374151', borderRadius: '2px', transition: 'all 0.2s' }} />
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-dropdown" style={{
          position: 'absolute',
          top: '56px',
          left: 0,
          right: 0,
          background: '#fff',
          borderBottom: '1px solid #e8e4dc',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
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
                style={{ fontSize: '15px', color: '#fff', textDecoration: 'none', padding: '10px 16px', background: '#2563eb', borderRadius: '10px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
                Sign up free →
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}