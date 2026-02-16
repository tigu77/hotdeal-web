import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "핫딜 알리미 - 매일 최저가 추천";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff4757 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
          }}
        >
          🔥
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          핫딜 알리미
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 32,
          }}
        >
          매일 엄선된 쿠팡 최저가 핫딜 추천
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 20,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>골드박스</span>
          <span>·</span>
          <span>타임세일</span>
          <span>·</span>
          <span>베스트 상품</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
