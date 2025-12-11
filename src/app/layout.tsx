import type { Metadata } from "next";
import "./globals.css";  // 여기서 globals.css 임포트! (상대 경로 맞춰주세요)

export const metadata: Metadata = {
  title: "Letter Masterpiece",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}