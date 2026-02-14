import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "핫딜 알리미 | 매일 최저가 추천",
  description: "매일 엄선된 최저가 상품을 추천합니다. 쿠팡 베스트, 골드박스, 타임세일 핫딜 모음.",
  keywords: ["핫딜", "최저가", "쿠팡", "추천", "베스트", "골드박스"],
  openGraph: {
    title: "핫딜 알리미 | 매일 최저가 추천",
    description: "매일 엄선된 최저가 상품을 추천합니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
