// pages/api/check-inbox/[token].js
export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token tidak ditemukan' });
  }

  try {
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Validasi email format dasar
    if (!email.includes('@') || !email.endsWith('@email.vwh.sh')) {
      return res.status(400).json({ error: 'Email tidak valid' });
    }

    const response = await fetch(`https://email.vwh.sh/api/email/${email}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gagal fetch dari VWH' });
    }

    const data = await response.json();
    res.status(200).json({ emails: data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', detail: error.message });
  }
}
