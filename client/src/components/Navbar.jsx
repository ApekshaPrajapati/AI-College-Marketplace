import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkStyle = {
    fontSize: '13px',
    color: '#555',
    textDecoration: 'none',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e8e4dc',
      padding: '0 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Logo — left side */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{ width: '28px', height: '28px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎓</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px', color: '#0f0f0f' }}>CampusMart</span>
      </Link>

      {/* ALL links — right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

        <Link to="/" style={linkStyle}
          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.color = '#555'}>
          Home
        </Link>

        {user && (
          <Link to="/sell" style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}>
            Sell
          </Link>
        )}

        {user ? (
          <>
            <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'Playfair Display', sans-serif" }}>
              Hi, {user.name.split(' ')[0]} 👋
            </span>
            <button onClick={handleLogout} style={{
              ...linkStyle,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc2626'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              Login
            </Link>
            <Link to="/register" style={{
              fontSize: '13px',
              color: '#fff',
              textDecoration: 'none',
              padding: '7px 18px',
              background: '#2563eb',
              borderRadius: '8px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              Sign up →
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}