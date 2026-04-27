
import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function SellProduct() {
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    category: 'books', productType: 'physical',
    subject: '', semester: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [docFile, setDocFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Reset image
  const resetImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setForm(f => ({ ...f, imageUrl: '' }))
  }

  // Reset doc file
  const resetDoc = () => {
    setDocFile(null)
    setForm(f => ({ ...f, fileUrl: '' }))
  }

  // Reset entire form
  const resetForm = () => {
    setForm({ title: '', description: '', price: '', category: 'books', productType: 'physical', subject: '', semester: '' })
    setImageFile(null)
    setDocFile(null)
    setImagePreview(null)
  }

  const handleImagePick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    // reset description when new image picked
    setForm(f => ({ ...f, description: '' }))
  }

  const handleDocPick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setDocFile(file)
    // reset description when new file picked
    setForm(f => ({ ...f, description: '' }))
  }

  const generateAI = async () => {
    if (!user) { alert('Please login first!'); navigate('/login'); return }
    if (form.productType === 'physical' && !imageFile) {
      alert('Please select an image first!'); return
    }
    if (form.productType === 'digital' && !docFile) {
      alert('Please select a PDF file first!'); return
    }

    setLoading(true)
    try {
      if (form.productType === 'physical') {
        const fd = new FormData()
        fd.append('image', imageFile)
        const upRes = await API.post('/upload/image', fd)
        const aiRes = await API.post('/ai/describe-image', { imageUrl: upRes.data.imageUrl })
        setForm(f => ({ ...f, description: aiRes.data.description, imageUrl: upRes.data.imageUrl }))
      } else {
        const fd = new FormData()
        fd.append('file', docFile)
        const upRes = await API.post('/upload/file', fd)
        const aiRes = await API.post('/ai/describe-file', { fileUrl: upRes.data.fileUrl })
        setForm(f => ({ ...f, description: aiRes.data.description, fileUrl: upRes.data.fileUrl }))
      }
    } catch (err) {
      alert('AI failed: ' + (err.response?.data?.msg || err.message))
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!user) { alert('Please login first!'); navigate('/login'); return }
    if (!form.title || !form.price) { alert('Please fill title and price'); return }
    if (!form.description) { alert('Please generate AI description or write one'); return }
    try {
      await API.post('/products', form)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      alert(err.response?.data?.msg || 'Error posting listing')
    }
  }

  if (success) return (
    <>
      <Navbar />
      <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, color: '#1a1a1a' }}>Listing posted!</h2>
          <p style={{ color: '#888', marginTop: '8px', marginBottom: '20px' }}>Redirecting to home...</p>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: "'Playfair Display', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

      <Navbar />

      <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* Header with reset button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#0f0f0f', marginBottom: '4px' }}>Post a listing</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Upload a photo or file — let AI write the description</p>
          </div>
          {/* Reset entire form */}
          <button onClick={resetForm}
            style={{ fontSize: '12px', color: '#888', background: '#fff', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Playfair Display', sans-serif" }}>
            🔄 Reset form
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e8e4dc', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Product type toggle */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>What are you selling?</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['physical', '📦 Physical product'], ['digital', '📄 Digital notes / PDF']].map(([val, label]) => (
                <button key={val}
                  onClick={() => { setForm({ ...form, productType: val, description: '' }); resetImage(); resetDoc() }}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid', borderColor: form.productType === val ? '#2563eb' : '#e5e7eb', background: form.productType === val ? '#eff6ff' : '#fff', color: form.productType === val ? '#2563eb' : '#555', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                {form.productType === 'physical' ? 'Upload product photo' : 'Upload your file (PDF, PPT, DOCX)'}
              </label>
              {/* ← Change file button */}
              {(imageFile || docFile) && (
                <button
                  onClick={form.productType === 'physical' ? resetImage : resetDoc}
                  style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  ✕ Remove file
                </button>
              )}
            </div>

            {form.productType === 'physical' ? (
              <label style={{ display: 'block', border: `2px dashed ${imageFile ? '#2563eb' : '#e5e7eb'}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: imageFile ? '#eff6ff' : '#fafafa', transition: 'all 0.2s', position: 'relative' }}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="preview" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#2563eb' }}>✓ Image selected — click to change</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>Click to upload product photo</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>JPG, PNG supported</div>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
              </label>
            ) : (
              <label style={{ display: 'block', border: `2px dashed ${docFile ? '#2563eb' : '#e5e7eb'}`, borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: docFile ? '#eff6ff' : '#fafafa', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                <div style={{ fontSize: '13px', color: docFile ? '#2563eb' : '#888', fontWeight: docFile ? 600 : 400 }}>
                  {docFile ? `✓ ${docFile.name} — click to change` : 'Click to upload PDF, PPT, DOCX'}
                </div>
                {!docFile && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>PDF, PPT, PPTX, DOCX supported</div>}
                <input type="file" accept=".pdf,.ppt,.pptx,.docx" onChange={handleDocPick} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* AI Button */}
          <button onClick={generateAI} disabled={loading} style={{
            width: '100%', padding: '12px',
            background: loading ? '#d1fae5' : 'linear-gradient(135deg, #059669, #10b981)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            {loading ? '🤖 AI is writing...' : '✨ Generate description with AI'}
          </button>

          {/* Title */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Title</label>
            <input placeholder="eg. Data Structures Cormen 3rd Edition" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Description <span style={{ color: '#10b981', fontWeight: 400 }}>(AI fills this ↑)</span>
              </label>
              {/* Clear description button */}
              {form.description && (
                <button onClick={() => setForm(f => ({ ...f, description: '' }))}
                  style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  ✕ Clear
                </button>
              )}
            </div>
            <textarea rows={4} placeholder="AI will generate this from your photo/file, or type manually..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Price + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Price (₹)</label>
              <input type="number" placeholder="eg. 250" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", background: '#fff' }}>
                <option value="books">Books</option>
                <option value="notes">Notes</option>
                <option value="gadgets">Gadgets</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Subject + Semester for digital */}
          {form.productType === 'digital' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input placeholder="eg. DBMS, OS, CN" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Semester</label>
                <input placeholder="eg. Sem 4, Final Year" value={form.semester}
                  onChange={e => setForm({ ...form, semester: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '13px', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Post listing →
          </button>

        </div>
      </div>
    </div>
  )
}