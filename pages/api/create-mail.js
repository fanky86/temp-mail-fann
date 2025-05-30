// pages/api/create-mail.js
export default async function handler(req, res) {
  const random = Math.random().toString(36).substring(2, 10);
  const email = `${random}@domainkamu.com`;
  const token = Buffer.from(email).toString('base64');
  res.status(200).json({ email, token });
}
