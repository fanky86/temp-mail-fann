import { useEffect, useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [inbox, setInbox] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  const createMail = async () => {
    try {
      const res = await fetch('/api/create-mail')
      const data = await res.json()
      setEmail(data.email)
      setToken(data.token)
      localStorage.setItem('email', data.email)
      localStorage.setItem('token', data.token)
      setErrorMsg('')
    } catch (error) {
      console.error('Gagal membuat email:', error)
      setErrorMsg('Gagal buat email, coba lagi.')
    }
  }

  const checkInbox = async (usedToken) => {
    try {
      const res = await fetch(`/api/check-inbox/${usedToken}`)
      const data = await res.json()
      if (Array.isArray(data.emails)) {
        setInbox(data.emails)
        setErrorMsg(data.emails.length === 0 ? 'Belum ada email masuk, mungkin pengirim belum mengirim.' : '')
      } else {
        setInbox([])
        setErrorMsg('Token tidak valid atau email belum aktif.')
      }
    } catch (error) {
      console.error('Gagal cek inbox:', error)
      setInbox([])
      setErrorMsg('Gagal mengambil inbox. Periksa koneksi atau token.')
    }
  }

  const handleNewEmail = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('token')
    setEmail('')
    setToken('')
    setInbox([])
    setErrorMsg('')
    createMail().then(() => {
      const newToken = localStorage.getItem('token')
      if (newToken) {
        checkInbox(newToken)
      }
    })
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedEmail = localStorage.getItem('email')

    if (savedToken && savedEmail) {
      setEmail(savedEmail)
      setToken(savedToken)
      checkInbox(savedToken)
    } else {
      createMail().then(() => {
        const newToken = localStorage.getItem('token')
        if (newToken) {
          checkInbox(newToken)
        }
      })
    }
  }, [])

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 20,
      backgroundColor: '#1e293b',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      color: '#f1f5f9',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#60a5fa' }}>Fanky Temp Mail</h1>

      <button
        onClick={handleNewEmail}
        style={{
          display: 'block',
          marginBottom: 20,
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          border: 'none',
          borderRadius: 6,
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e40af'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
      >
        Buat Email Baru
      </button>

      <button
        onClick={() => checkInbox(token)}
        style={{
          display: 'block',
          marginBottom: 20,
          padding: '10px 20px',
          backgroundColor: '#14b8a6',
          border: 'none',
          borderRadius: 6,
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#0f766e'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#14b8a6'}
        disabled={!token}
      >
        Checkpoint Inbox Manual
      </button>

      <p><strong>Email Kamu:</strong> <span style={{ color: '#93c5fd' }}>{email || '-'}</span></p>
      <p><strong>Token Kamu:</strong> <span style={{ color: '#93c5fd', wordBreak: 'break-all' }}>{token || '-'}</span></p>

      <h3 style={{ marginTop: 30, borderBottom: '1px solid #334155', paddingBottom: 10, color: '#bfdbfe' }}>Kotak Masuk</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {inbox.length === 0 ? (
          <li style={{ padding: 10, backgroundColor: '#334155', borderRadius: 6, color: '#94a3b8' }}>Tidak ada email masuk</li>
        ) : (
          inbox.map((mail, i) => (
            <li
              key={i}
              style={{
                backgroundColor: '#2563eb',
                padding: '10px 15px',
                borderRadius: 8,
                marginBottom: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e40af'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#2563eb'}
              title={mail.body || 'Tidak ada isi email'}
            >
              <strong>{mail.subject || '(No Subject)'}</strong>
            </li>
          ))
        )}
      </ul>

      {errorMsg && (
        <div style={{
          marginTop: 15,
          padding: 10,
          backgroundColor: '#dc2626',
          borderRadius: 6,
          color: '#fff',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  )
}
