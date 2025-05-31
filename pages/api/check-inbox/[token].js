export default async function handler(req, res) {
  const token = req.query.token;
  if (!token || !token.includes('@')) {
    return res.status(400).json({ error: 'Token invalid' });
  }

  const [login, domain] = token.split('@');

  try {
    const inboxRes = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);

    if (!inboxRes.ok) {
      return res.status(500).json({ error: 'Gagal mengambil inbox: 1secmail API error' });
    }

    const inboxData = await inboxRes.json();

    const emails = await Promise.all(inboxData.map(async (item) => {
      const detailRes = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${item.id}`);

      if (!detailRes.ok) {
        return null; // Skip jika gagal ambil detail email
      }

      const detailData = await detailRes.json();

      return {
        subject: detailData.subject,
        body: detailData.body,
        from: detailData.from
      };
    }));

    res.status(200).json({ emails: emails.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', details: error.toString() });
  }
}
