import './globals.css'

export const metadata = {
  title: '손글씨 편지',
  description: '손글씨 편지 작성 및 VR/이메일 전송',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
