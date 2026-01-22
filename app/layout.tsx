import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "운명테라피 | 당신의 인생 나침반",
  description: "15년 명리심리학 전문가가 제공하는 100페이지 정밀 사주 분석서. 3,000명의 인생 전환점을 함께한 데이터의 힘으로 당신의 운명을 읽어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Pretendard:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
