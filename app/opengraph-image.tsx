import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '핫딜 알리미 - 네이버·쿠팡·알리 매일 엄선된 최저가 핫딜';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const iconData = await fetch(
    new URL('../public/icon-512.png', import.meta.url)
  ).then((res) => res.arrayBuffer());
  const iconBase64 = `data:image/png;base64,${Buffer.from(iconData).toString('base64')}`;

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
        <img
          src={iconBase64}
          width={120}
          height={120}
          style={{ marginBottom: 20 }}
        />
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
          네이버·쿠팡·알리 매일 엄선된 최저가 핫딜
        </div>
      </div>
    ),
    { ...size }
  );
}
