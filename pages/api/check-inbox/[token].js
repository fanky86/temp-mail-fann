// pages/api/check-inbox/[token].js

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token tidak ditemukan' });
  }

  try {
    // Decode token dari base64
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    // Fetch inbox dari API mail.tm / vwh.sh
    const response = await fetch('https://api.mail.tm/messages', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${decodedToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Kirim hanya daftar pesan (biasanya di hydra:member)
    return res.status(200).json({
      emails: data['hydra:member'] || [],
      total: data['hydra:totalItems'] || 0
    });

  } catch (error) {
    res.status(500).json({
      error: 'Gagal mengambil inbox',
      detail: error.message
    });
  }
}
