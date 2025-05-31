// pages/api/create-mail.js
export default async function handler(req, res) {
  const randomString = Math.random().toString(36).substring(2, 10)
  const email = `${randomString}@1secmail.com`
  res.status(200).json({
    email,
    token: email // token = email, karena 1secmail pakai email penuh
  })
}
