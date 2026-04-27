import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await API.delete(`/products/${id}`)
      setDeleted(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not delete')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#888' }}>
      Loading...
    </div>
  )

  if (!product || deleted) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{deleted ? '✅' : '😕'}</div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>{deleted ? 'Listing deleted!' : 'Product not found'}</div>
      <Link to="/" style={{ marginTop: '16px', color: '#2563eb', fontSize: '14px' }}>← Back to home</Link>
    </div>
  )

  const isOwner = user && product.seller && user.id === product.seller._id

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <Navbar />

      <div style={{ maxWidth: '860px', margin: '2rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left — image */}
        <div>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title}
              style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '380px', border: '1px solid #e8e4dc' }} />
          ) : (
            <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', border: '1px solid #e8e4dc' }}>
              {product.category === 'notes' ? '📝' : product.category === 'books' ? '📚' : product.category === 'gadgets' ? '💻' : '📦'}
            </div>
          )}

          {/* Digital file badge */}
          {product.productType === 'digital' && (
            <div style={{ marginTop: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📄</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>Digital product</div>
                <div style={{ fontSize: '12px', color: '#4ade80' }}>Instant download after contact</div>
              </div>
            </div>
          )}
        </div>

        {/* Right — details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', fontWeight: 500 }}>
              {product.category}
            </span>
            {product.productType === 'digital' && (
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', fontWeight: 500 }}>
                Digital
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#0f0f0f', lineHeight: 1.3, margin: 0 }}>
            {product.title}
          </h1>

          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', fontFamily: "'Syne', sans-serif" }}>
            ₹{product.price}
          </div>

          {/* Description */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e8e4dc' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</div>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0 }}>{product.description}</p>
          </div>

          {/* Subject/Semester for digital */}
          {product.productType === 'digital' && (product.subject || product.semester) && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.subject && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 14px', border: '1px solid #e8e4dc', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Subject</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{product.subject}</div>
                </div>
              )}
              {product.semester && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 14px', border: '1px solid #e8e4dc', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Semester</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{product.semester}</div>
                </div>
              )}
            </div>
          )}

          {/* Seller info */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e8e4dc' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Seller</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{product.seller?.name || 'Student'}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>📍 {product.seller?.college || 'Campus'}</div>
              </div>
            </div>
          </div>

          {/* How to buy — visible to everyone */}
          <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '16px', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>How buying works</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['1', '📧', 'Contact the seller via email'],
                ['2', '🤝', 'Agree on meetup spot on campus'],
                ['3', '💵', 'Pay cash or UPI — no platform fees'],
              ].map(([num, icon, text]) => (
                <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{num}</div>
                  <span style={{ fontSize: '13px' }}>{icon}</span>
                  <span style={{ fontSize: '13px', color: '#1e40af' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buy button — only for non-owners */}
          {!isOwner ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <a href={`mailto:${product.seller?.email}?subject=Interested in ${product.title}&body=Hi ${product.seller?.name}, I am interested in buying "${product.title}" for ₹${product.price}. When can we meet on campus?`}
                style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#2563eb', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                🛒 Buy Now — Contact Seller
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(product.seller?.email)
                  alert(`Copied: ${product.seller?.email}`)
                }}
                style={{ width: '100%', padding: '12px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                📋 Copy seller email
              </button>
              <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                Meet on campus • Pay via cash or UPI • No platform fees
              </p>
            </div>
          ) : (
            /* Delete button — only for owner */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#92400e', textAlign: 'center' }}>
                👆 This is your listing
              </div>
              <button onClick={handleDelete}
                style={{ width: '100%', padding: '13px', background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                🗑️ Delete my listing
              </button>
            </div>

          )}
        </div>
      </div>
    </div>
  )
}

