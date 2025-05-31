// pages/api/check-inbox/[token].js
export default async function handler(req, res) {
  const token = req.query.token
  const [login, domain] = token.split('@')

  try {
    const inboxRes = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
    const inboxData = await inboxRes.json()

    const emails = await Promise.all(inboxData.map(async (item) => {
      const detailRes = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${item.id}`)
      const detailData = await detailRes.json()
      return {
        subject: detailData.subject,
        body: detailData.body,
        from: detailData.from
      }
    }))

    res.status(200).json({ emails })
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', details: error.toString() })
  }
}
