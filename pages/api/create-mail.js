export default async function handler(req, res) {
  try {
    // Buat email baru dari temp-mail.io
    const response = await fetch('https://api.temp-mail.io/api/v3/email/new', {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Gagal membuat email dari temp-mail.io' });
    }

    const data = await response.json();

    res.status(200).json({
      email: data.email,
      token: data.token // token autentikasi temp-mail
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan', detail: error.toString() });
  }
}
