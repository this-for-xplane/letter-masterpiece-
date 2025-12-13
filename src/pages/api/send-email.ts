// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { to, subject, htmlContent, imageBase64 } = req.body;

  if (!to || !subject || !htmlContent || !imageBase64) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // SendPulse access token 발급
    const tokenRes = await axios.post(
      'https://api.sendpulse.com/oauth/access_token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.SENDPULSE_ID,
        client_secret: process.env.SENDPULSE_SECRET,
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 이메일 발송
    const sendRes = await axios.post(
      'https://api.sendpulse.com/smtp/emails',
      {
        html: htmlContent,
        text: '편지 내용을 지원하지 않는 이메일 클라이언트용',
        subject,
        from: {
          name: '손글씨 편지',
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to, name: '' }],
        attachments: [
          {
            name: 'letter.png',
            type: 'image/png',
            content: imageBase64.replace(/^data:image\/png;base64,/, ''),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err.response?.data || err);
    return res.status(500).json({ success: false, message: 'SendPulse 발송 실패' });
  }
}
