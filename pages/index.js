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
    <div style={{ padding: 20 }}>
      <h1>Fanky Temp Mail</h1>
      <p>Email Kamu: <strong>{email}</strong></p>
      <p>Token Kamu: <strong>{token}</strong></p>
      <ul>
        {inbox.length === 0 ? (
          <li>Tidak ada email masuk</li>
        ) : (
          inbox.map((mail, i) => (
            <li key={i}><strong>{mail.subject}</strong></li>
          ))
        )}
      </ul>
    </div>
  )
}
