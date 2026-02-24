import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { WebSiteJsonLd } from "./JsonLd";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const SITE_URL = "https://hotdeal-web-peach.vercel.app";

export const metadata: Metadata = {
  title: "핫딜 알리미 | 매일 엄선된 쿠팡 최저가 핫딜 추천",
  description:
    "매일 엄선된 쿠팡 최저가 핫딜을 추천합니다. 골드박스, 타임세일, 베스트 상품을 한눈에 비교하고 최대 할인가로 구매하세요.",
  keywords: [
    "핫딜",
    "최저가",
    "쿠팡",
    "쿠팡 핫딜",
    "골드박스",
    "타임세일",
    "쿠팡 추천",
    "오늘의 특가",
    "최저가 비교",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "sJctEFwOH0C-tk14N2XwoNkxFb99d_yG9Z32tLKFaYU",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "핫딜 알리미 | 매일 엄선된 쿠팡 최저가 핫딜 추천",
    description:
      "매일 엄선된 쿠팡 최저가 핫딜을 추천합니다. 골드박스, 타임세일, 베스트 상품을 한눈에!",
    url: SITE_URL,
    siteName: "핫딜 알리미",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "핫딜 알리미" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "핫딜 알리미 | 매일 엄선된 쿠팡 최저가 핫딜 추천",
    description:
      "매일 엄선된 쿠팡 최저가 핫딜을 추천합니다. 골드박스, 타임세일, 베스트 상품을 한눈에!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SPGEYB1T06" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SPGEYB1T06');`,
          }}
        />
      </head>
      <body className={`${geist.className} antialiased`}>
        <WebSiteJsonLd />
        {children}
        {/* 쿠팡 다이나믹 배너 제거 (2026-02-25) */}
      </body>
    </html>
  );
}
