// pages/api/check-inbox/[token].js
export default async function handler(req, res) {
  const { token } = req.query;
  const email = Buffer.from(token, 'base64').toString('utf-8');

  // Simulasi inbox: kamu bisa pakai layanan email API beneran
  const fakeInbox = [
    {
      subject: `${Math.floor(Math.random() * 9999)} adalah kode konfirmasi`,
      from: 'noreply@web.com',
      to: email
    }
  ];

  res.status(200).json({ emails: fakeInbox });
}
