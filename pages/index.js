import { useEffect, useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(true)

  const createMail = async () => {
    const res = await fetch('/api/create-mail')
    const data = await res.json()
    setEmail(data.email)
    setToken(data.token)
    localStorage.setItem('email', data.email)
    localStorage.setItem('token', data.token)
    checkInbox(data.token)
  }

  const checkInbox = async (customToken: string) => {
    const res = await fetch(`/api/check-inbox/${customToken}`)
    const data = await res.json()
    setInbox(data.emails)
    setLoading(false)
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedEmail = localStorage.getItem('email')

    if (savedToken && savedEmail) {
      setEmail(savedEmail)
      setToken(savedToken)
      checkInbox(savedToken)
    } else {
      createMail()
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Fanky Temp Mail</h1>
      {loading ? (
        <p>🔄 Sedang memuat email dan inbox...</p>
      ) : (
        <>
          <p>Email Kamu: <strong>{email}</strong></p>
          <p>Token: <code>{token}</code></p>
          <h2>📥 Inbox</h2>
          <ul>
            {inbox.length === 0 ? (
              <li><i>Belum ada email masuk</i></li>
            ) : (
              inbox.map((mail, i) => (
                <li key={i}>
                  <strong>{mail.subject}</strong><br />
                  <span>{mail.text}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  )
}
