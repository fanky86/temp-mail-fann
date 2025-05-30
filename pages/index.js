import { useEffect, useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [inbox, setInbox] = useState([])

  const createMail = async () => {
    const res = await fetch('/api/create-mail')
    const data = await res.json()
    setEmail(data.email)
    setToken(data.token)
    localStorage.setItem('email', data.email)
    localStorage.setItem('token', data.token)
  }

  const checkInbox = async () => {
    const res = await fetch(`/api/check-inbox/${token}`)
    const data = await res.json()
    setInbox(data.emails)
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedEmail = localStorage.getItem('email')
    if (savedToken && savedEmail) {
      setEmail(savedEmail)
      setToken(savedToken)
    } else {
      createMail()
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Fanky Temp Mail</h1>
      <p>Email Kamu: <strong>{email}</strong></p>
      <button onClick={checkInbox}>🔁 Cek Inbox</button>
      <ul>
        {inbox.map((mail, i) => (
          <li key={i}><strong>{mail.subject}</strong></li>
        ))}
      </ul>
    </div>
  )
}
