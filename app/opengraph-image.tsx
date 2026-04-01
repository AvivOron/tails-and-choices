import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'סיפורים ובחירות | Tales & Choices';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadHeeboFont() {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Heebo:wght@400;800&subset=hebrew',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  ).then((r) => r.text());

  const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
  if (!url) throw new Error('Could not parse Heebo font URL');
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OGImage() {
  const heeboData = await loadHeeboFont();

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
          background: 'linear-gradient(135deg, #f5e6c8 0%, #e8dff5 100%)',
          fontFamily: 'Heebo, sans-serif',
        }}
      >
        {/* decorative stars */}
        <div style={{ position: 'absolute', top: 48, left: 64, fontSize: 64, opacity: 0.35 }}>⭐</div>
        <div style={{ position: 'absolute', top: 80, right: 80, fontSize: 52, opacity: 0.35 }}>🌙</div>
        <div style={{ position: 'absolute', bottom: 80, left: 80, fontSize: 52, opacity: 0.35 }}>🌟</div>
        <div style={{ position: 'absolute', bottom: 48, right: 64, fontSize: 64, opacity: 0.35 }}>✨</div>

        {/* icon circle */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFCF81, #B2A4FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            fontSize: 88,
          }}
        >
          📖
        </div>

        <div style={{ fontSize: 72, fontWeight: 800, color: '#2d2d2d', marginBottom: 16 }}>
          Tales &amp; Choices
        </div>
        <div style={{ fontSize: 36, color: '#6b6b8a', marginBottom: 12, direction: 'rtl' }}>
          סיפורים אינטראקטיביים לילדים
        </div>
        <div style={{ fontSize: 28, color: '#9b9bb0', direction: 'rtl' }}>
          צרו סיפורים קסומים עם הגיבור שלכם
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Heebo',
          data: heeboData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
