import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dead Mans Proof - Privacy-preserving attestations on Base';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [unifrakturFont, crimsonFont] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/unifrakturmaguntia/v22/WWXPlieVYwiGNomYU-ciRLRvEmK7oaVunw.ttf'
    ).then((res) => res.arrayBuffer()),
    fetch(
      'https://fonts.gstatic.com/s/crimsontext/v19/wlpogwHKFkZgtmSR3NB0oRJfaghW.ttf'
    ).then((res) => res.arrayBuffer()),
  ]);

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
          backgroundColor: '#050507',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark red radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.15) 0%, rgba(139, 0, 0, 0.05) 40%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Subtle border frame */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid rgba(139, 0, 0, 0.2)',
            display: 'flex',
          }}
        />

        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', width: '24px', height: '24px', borderTop: '2px solid rgba(196, 30, 58, 0.4)', borderLeft: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: '14px', right: '14px', width: '24px', height: '24px', borderTop: '2px solid rgba(196, 30, 58, 0.4)', borderRight: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '14px', width: '24px', height: '24px', borderBottom: '2px solid rgba(196, 30, 58, 0.4)', borderLeft: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '24px', height: '24px', borderBottom: '2px solid rgba(196, 30, 58, 0.4)', borderRight: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {/* "Dead Man's" in blackletter */}
          <div
            style={{
              fontSize: '80px',
              color: '#D4C5A9',
              fontFamily: 'UnifrakturMaguntia',
              letterSpacing: '0.04em',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Dead Man&apos;s
          </div>

          {/* "Proof" in blackletter, blood red */}
          <div
            style={{
              fontSize: '120px',
              color: '#C41E3A',
              fontFamily: 'UnifrakturMaguntia',
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginTop: '0px',
              display: 'flex',
            }}
          >
            Proof
          </div>

          {/* Dagger/cross divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '32px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(196, 30, 58, 0.5))',
                display: 'flex',
              }}
            />
            {/* Dagger SVG */}
            <svg width="14" height="28" viewBox="0 0 14 22" fill="none">
              <line x1="7" y1="0" x2="7" y2="22" stroke="#C41E3A" strokeWidth="1.5" />
              <line x1="3" y1="6" x2="11" y2="6" stroke="#C41E3A" strokeWidth="1.5" />
            </svg>
            <div
              style={{
                width: '80px',
                height: '1px',
                background: 'linear-gradient(to left, transparent, rgba(196, 30, 58, 0.5))',
                display: 'flex',
              }}
            />
          </div>

          {/* Subtitle in Crimson Text */}
          <div
            style={{
              fontSize: '22px',
              color: '#D4C5A9',
              fontFamily: 'Crimson Text',
              fontStyle: 'italic',
              letterSpacing: '0.04em',
              display: 'flex',
            }}
          >
            Your data stays sealed. Only the truth gets out.
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#FFFFFF',
            fontFamily: 'Crimson Text',
            letterSpacing: '0.1em',
          }}
        >
          dead-mans-proof.vercel.app
        </div>

        {/* Built by Loser Labs */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '40px',
            display: 'flex',
            fontSize: '12px',
            color: '#FFFFFF',
            fontFamily: 'Crimson Text',
            letterSpacing: '0.05em',
          }}
        >
          Built by Loser Labs
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'UnifrakturMaguntia',
          data: unifrakturFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Crimson Text',
          data: crimsonFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
