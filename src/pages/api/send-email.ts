import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message, image } = req.body;
  const ID = process.env.SENDPULSE_ID;
  const SECRET = process.env.SENDPULSE_SECRET;

  // 토큰 발급
  const tokenRes = await fetch('https://api.sendpulse.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: ID, client_secret: SECRET }),
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  // 이메일 전송
  const emailRes = await fetch('https://api.sendpulse.com/smtp/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: `<p>${message}</p><img src="${image}" />`,
      subject: '감성 편지',
      from: { name: '편지서비스', email: process.env.FROM_EMAIL },
      to: [{ email: '받는사람@예시.com', name: '받는사람' }],
    }),
  });

  if (emailRes.ok) res.status(200).json({ ok: true });
  else res.status(500).json({ ok: false });
}
