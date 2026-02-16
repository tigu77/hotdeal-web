import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "핫딜 알리미 | 매일 최저가 추천",
  description: "매일 엄선된 최저가 상품을 추천합니다. 쿠팡 베스트, 골드박스, 타임세일 핫딜 모음.",
  keywords: ["핫딜", "최저가", "쿠팡", "추천", "베스트", "골드박스"],
  icons: {
    icon: "/icon.svg",
  },
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
        {/* 쿠팡 다이나믹 배너 - 하단 고정 */}
        <div
          id="coupang-banner-wrap"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "rgba(255,255,255,0.97)",
            borderTop: "1px solid #e5e7eb",
            padding: "4px 0",
            textAlign: "center",
          }}
        >
          <div
            id="coupang-banner-inner"
            style={{ width: "100%", overflow: "hidden" }}
            dangerouslySetInnerHTML={{
              __html: `
                <script src="https://ads-partners.coupang.com/g.js"></script>
                <script>new PartnersCoupang.G({"id":965423,"template":"carousel","trackingCode":"AF6113349","width":"680","height":"100","tsource":""});</script>
                <style>#coupang-banner-inner iframe{width:100%!important;max-width:100%!important;}</style>
              `,
            }}
          />
        </div>
      </body>
    </html>
  );
}
