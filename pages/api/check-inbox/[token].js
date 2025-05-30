// pages/api/check-inbox/[token].js
export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token tidak ditemukan' });
  }

  try {
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Ambil inbox asli dari email.vwh.sh
    const response = await fetch(`https://email.vwh.sh/api/email/${email}`);
    const data = await response.json();

    res.status(200).json({ emails: data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', detail: error.message });
  }
}
