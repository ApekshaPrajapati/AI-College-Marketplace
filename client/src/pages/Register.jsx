import { useState } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/register', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif"
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', fontFamily: "'Platfair Display', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      {/* Left — form */}
      <div style={{ width: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
          <div style={{ width: '36px', height: '36px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎓</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', color: '#0f0f0f' }}>CampusMart</span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#0f0f0f', marginBottom: '6px' }}>Create your account</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '2rem' }}>Join thousands of students buying and selling</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'enter name' },
            { label: 'College Email', key: 'email', type: 'email', placeholder: 'exa@college.edu' },
            { label: 'College Name', key: 'college', type: 'text', placeholder: 'GTU, SVIT, PDPU...' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>{label}</label>
              <input type={type} placeholder={placeholder} required minLength={key === 'password' ? 6 : 1}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '6px' }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>

      {/* Right — decorative */}
      <div style={{ flex: 1, background: 'linear-gradient(145deg, #1e3a5f, #1e40af)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎓</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.3 }}>
            The smartest way<br />to trade on campus
          </h2>
          <p style={{ color: '#93c5fd', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>
            Upload a photo, let AI write the description, and your listing goes live in under 60 seconds.
          </p>

          {/* Fake stat cards */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '2.5rem', justifyContent: 'center' }}>
            {[['500+', 'Listings'], ['50+', 'Colleges'], ['₹0', 'Platform fee']].map(([num, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: '#fff' }}>{num}</div>
                <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}