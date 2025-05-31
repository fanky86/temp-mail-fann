import { useEffect, useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [inbox, setInbox] = useState([])

  const createMail = async () => {
    try {
      const res = await fetch('/api/create-mail')
      const data = await res.json()
      setEmail(data.email)
      setToken(data.token)
      localStorage.setItem('email', data.email)
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.error('Gagal membuat email:', error)
    }
  }

  const checkInbox = async (usedToken) => {
    try {
      const res = await fetch(`/api/check-inbox/${usedToken}`)
      const data = await res.json()
      if (Array.isArray(data.emails)) {
        setInbox(data.emails)
      } else {
        setInbox([])
      }
    } catch (error) {
      console.error('Gagal cek inbox:', error)
      setInbox([])
    }
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Fanky Temp Mail</h1>
      </header>

      <section style={styles.infoBox}>
        <div style={styles.infoItem}>
          <span style={styles.label}>Email Kamu:</span>
          <span style={styles.value}>{email || '-'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Token Kamu:</span>
          <span style={styles.value}>{token || '-'}</span>
        </div>
      </section>

      <section style={styles.inboxSection}>
        <h2 style={styles.inboxTitle}>Kotak Masuk</h2>
        {inbox.length === 0 ? (
          <p style={styles.noMail}>Tidak ada email masuk</p>
        ) : (
          <ul style={styles.mailList}>
            {inbox.map((mail, i) => (
              <li key={i} style={styles.mailItem}>
                <strong>{mail.subject || '(No Subject)'}</strong>
                <p style={styles.mailPreview}>{mail.preview || ''}</p>
                <small style={styles.mailDate}>{mail.date || ''}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '20px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7fa',
    borderRadius: 10,
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    padding: 20,
  },
  header: {
    borderBottom: '2px solid #4f46e5',
    marginBottom: 20,
  },
  title: {
    margin: 0,
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: 28,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    boxShadow: 'inset 0 0 8px rgba(79, 70, 229, 0.15)',
    marginBottom: 25,
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoItem: {
    minWidth: '48%',
    marginBottom: 10,
  },
  label: {
    color: '#6b7280',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  value: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
    wordBreak: 'break-all',
  },
  inboxSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.1)',
  },
  inboxTitle: {
    margin: '0 0 15px 0',
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: 22,
    borderBottom: '1px solid #e0e7ff',
    paddingBottom: 6,
  },
  noMail: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  mailList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  mailItem: {
    padding: 15,
    borderBottom: '1px solid #e0e7ff',
  },
  mailPreview: {
    margin: '6px 0',
    color: '#374151',
    fontSize: 14,
  },
  mailDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
}
