import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '핫딜 알리미 - 매일 엄선된 쿠팡 최저가 핫딜';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20, display: 'flex' }}>🔥</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          핫딜 알리미
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            display: 'flex',
          }}
        >
          매일 엄선된 쿠팡 최저가 핫딜 추천
        </div>
      </div>
    ),
    { ...size }
  );
}
