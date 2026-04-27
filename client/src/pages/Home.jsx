
import { useEffect, useState } from 'react'
import API from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const DUMMY_PRODUCTS = [
  { _id: '1', title: 'Data Structures Textbook', description: 'Cormen CLRS 3rd edition. Used for 1 semester, excellent condition. Perfect for CS students preparing for placements.', price: 280, category: 'books', productType: 'physical', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop', seller: { college: 'GTU' } },
  { _id: '2', title: 'DBMS Handwritten Notes', description: 'Complete DBMS notes with ER diagrams, normalization, SQL queries. Very neat handwriting. Useful for Sem 4 exams.', price: 80, category: 'notes', productType: 'digital', seller: { college: 'SVIT' } },
  { _id: '3', title: 'Scientific Calculator Casio', description: 'Casio FX-991ES Plus. Works perfectly, minor scratches on back. Must have for engineering students.', price: 350, category: 'gadgets', productType: 'physical', imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', seller: { college: 'PDPU' } },
  { _id: '4', title: 'Operating Systems Notes PDF', description: 'Complete OS notes covering scheduling, memory management, deadlocks. Based on Galvin. Great for final exams.', price: 50, category: 'notes', productType: 'digital', seller: { college: 'GTU' } },
  { _id: '5', title: 'Engineering Drawing Set', description: 'Full drawing set with compass, scale, protractor. Used only in first year. Selling cheap for juniors.', price: 150, category: 'other', productType: 'physical', imageUrl: 'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?w=400&h=300&fit=crop', seller: { college: 'CHARUSAT' } },
  { _id: '6', title: 'Computer Networks Textbook', description: 'Forouzan 5th edition. Good condition with some highlights. Essential for networking and placement prep.', price: 220, category: 'books', productType: 'physical', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', seller: { college: 'SVIT' } },
]

const CATEGORIES = ['', 'books', 'notes', 'gadgets', 'other']

export default function Home() {
  const [products, setProducts] = useState(DUMMY_PRODUCTS)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/products${filter ? '?category=' + filter : ''}`)
      .then(res => { if (res.data.length > 0) setProducts(res.data) })
      .catch(() => { })
  }, [filter])

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'Playfair Display', sans-serif", minHeight: '100vh', background: '#f8f7f4' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
    
      <Navbar />

      {/* ───── HERO ───── */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '3.5rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#93c5fd', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 500 }}>Student Marketplace</p>
        <h1 style={{ fontFamily: "'Playfair Display ', serif", color: '#fff', fontSize: '2.8rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
          Buy & Sell Within<br />Your Campus
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: '15px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
          Books, notes, gadgets and more — all at student-friendly prices. AI-powered listings make selling effortless.
        </p>

        {/* Search */}
        <div style={{ maxWidth: '480px', margin: '0 auto 20px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            placeholder="Search books, notes, gadgets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* CTA buttons — only when not logged in */}
        {!user && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
            <Link to="/register" style={{ padding: '11px 28px', background: '#fff', color: '#2563eb', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              Start selling free →
            </Link>
            <Link to="/login" style={{ padding: '11px 28px', background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>
              Login
            </Link>
          </div>
        )}

        {/* When logged in show sell button in hero */}
        {user && (
          <Link to="/sell" style={{ display: 'inline-block', marginTop: '8px', padding: '11px 28px', background: '#fff', color: '#2563eb', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
            + Post a listing
          </Link>
        )}
      </div>

      {/* ───── STATS BAR ───── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '1rem 2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
        {[['📚', '500+', 'Books listed'], ['📝', '200+', 'Notes shared'], ['💻', '150+', 'Gadgets'], ['🎓', '50+', 'Colleges']].map(([icon, num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px' }}>{icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>{num}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ───── MAIN CONTENT ───── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '7px 18px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === c ? '#2563eb' : '#ddd',
              background: filter === c ? '#2563eb' : '#fff',
              color: filter === c ? '#fff' : '#555',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {c === '' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Section title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', fontFamily: "'Syne', sans-serif" }}>
            {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'All listings'}
            <span style={{ fontSize: '13px', fontWeight: 400, color: '#888', marginLeft: '8px', fontFamily: "'DM Sans', sans-serif" }}>{filtered.length} items</span>
          </h2>
          <Link to="/sell" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>+ List something →</Link>
        </div>

        {/* Product grid */}
        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(p => (
            <div key={p._id}
              style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e4dc', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Image — clickable to detail */}
              <div onClick={() => navigate(`/product/${p._id}`)} style={{ cursor: 'pointer' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#f8f8f8' }} />
                ) : (
                  <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                    {p.category === 'notes' ? '📝' : p.category === 'books' ? '📚' : p.category === 'gadgets' ? '💻' : '📦'}
                  </div>
                )}
              </div>

              <div style={{ padding: '14px' }}>
                {/* Badges */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', fontWeight: 500 }}>{p.category}</span>
                  {p.productType === 'digital' && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', fontWeight: 500 }}>Digital</span>
                  )}
                </div>

                {/* Title — clickable */}
                <div onClick={() => navigate(`/product/${p._id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </div>
                </div>

                {/* Price + college */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', fontFamily: "'Syne', sans-serif" }}>₹{p.price}</span>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>📍 {p.seller?.college || 'Campus'}</span>
                </div>

                {/* ── BUTTONS — like Amazon ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* View Details */}
                  <button
                    onClick={() => navigate(`/product/${p._id}`)}
                    style={{ width: '100%', padding: '9px', background: '#fbbf24', color: '#1a1a1a', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    🛒 View & Buy
                  </button>

                  {/* Contact Seller directly */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!p.seller?.email) {
                        navigate(`/product/${p._id}`)
                        return
                      }
                      window.location.href = `mailto:${p.seller?.email}?subject=Interested in ${p.title}&body=Hi ${p.seller?.name}, I am interested in buying "${p.title}" for ₹${p.price}. When can we meet on campus?`
                    }}
                    style={{ width: '100%', padding: '9px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    📧 Contact Seller
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>No items found</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Try a different search or category</div>
          </div>
        )}
      </div>

      {/* ───── FOOTER ───── */}
      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid #e8e4dc', color: '#aaa', fontSize: '12px', marginTop: '2rem' }}>
        CampusMart
      </div>
    </div>
  )
}