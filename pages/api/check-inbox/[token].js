export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token tidak ditemukan' });
  }

  try {
    // Decode token dari base64 ke email
    const email = Buffer.from(token, 'base64').toString('utf-8');

    // Validasi email sederhana
    if (!email.includes('@') || !email.endsWith('@email.vwh.sh')) {
      return res.status(400).json({ error: 'Email tidak valid' });
    }

    // Fetch data inbox dari email.vwh.sh
    const response = await fetch(`https://email.vwh.sh/api/email/${email}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gagal fetch dari VWH' });
    }

    // Baca response sebagai text dulu
    const text = await response.text();

    if (!text) {
      // Kalau response kosong, kembalikan array inbox kosong
      return res.status(200).json({ emails: [] });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // JSON invalid dari response API
      return res.status(500).json({ error: 'Response dari VWH tidak valid JSON' });
    }

    // Kirim data emails ke client
    res.status(200).json({ emails: data });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil inbox', detail: error.message });
  }
}
