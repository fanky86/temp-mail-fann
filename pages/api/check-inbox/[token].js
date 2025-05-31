export default async function handler(req, res) {
  const token = req.query.token

  // Cek apakah token valid
  if (!token || !token.includes('@')) {
    return res.status(400).json({ error: 'Token tidak valid atau format salah (harus ada @).' })
  }

  const [login, domain] = token.split('@')

  if (!login || !domain) {
    return res.status(400).json({ error: 'Login atau domain kosong.' })
  }

  try {
    const inboxRes = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
    const inboxData = await inboxRes.json()

    // Jika tidak ada email
    if (!Array.isArray(inboxData) || inboxData.length === 0) {
      return res.status(200).json({ emails: [] })
    }

    // Ambil detail dari masing-masing email
    const emails = await Promise.all(inboxData.map(async (item) => {
      const detailRes = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${item.id}`)
      const detailData = await detailRes.json()

      return {
        subject: detailData.subject || '(Tanpa Subjek)',
        body: detailData.body || '(Kosong)',
        from: detailData.from || '(Tidak diketahui)'
      }
    }))

    res.status(200).json({ emails })
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', details: error.toString() })
  }
}
