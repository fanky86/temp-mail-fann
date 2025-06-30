export default async function handler(req, res) {
  try {
    // 1. Buat email acak via temp-mail API (tanpa domain kustom)
    const createRes = await fetch('https://api.temp-mail.io/api/v3/email/new', {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });

    if (!createRes.ok) {
      return res.status(500).json({ error: 'Gagal membuat email baru' });
    }

    const emailData = await createRes.json();
    const token = emailData.token;
    const email = emailData.email;

    // 2. Ambil inbox dengan token (autentikasi Bearer)
    const inboxRes = await fetch('https://api.temp-mail.io/api/v3/email', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
      }
    });

    if (!inboxRes.ok) {
      return res.status(500).json({ error: 'Gagal mengambil inbox dari temp.mail' });
    }

    const inboxData = await inboxRes.json();

    // 3. Format data email
    const emails = inboxData.map((item) => ({
      from: item.from,
      subject: item.subject,
      body: item.text_body || item.html_body || 'Tidak ada isi email'
    }));

    res.status(200).json({
      email,
      token,
      inbox: emails
    });

  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan', details: err.toString() });
  }
}
