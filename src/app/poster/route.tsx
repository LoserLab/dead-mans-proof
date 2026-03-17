import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1800px',
            height: '1200px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.15) 0%, rgba(139, 0, 0, 0.05) 40%, transparent 70%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid rgba(139, 0, 0, 0.2)',
            display: 'flex',
          }}
        />

        <div style={{ position: 'absolute', top: '28px', left: '28px', width: '48px', height: '48px', borderTop: '2px solid rgba(196, 30, 58, 0.4)', borderLeft: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: '28px', right: '28px', width: '48px', height: '48px', borderTop: '2px solid rgba(196, 30, 58, 0.4)', borderRight: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '28px', left: '28px', width: '48px', height: '48px', borderBottom: '2px solid rgba(196, 30, 58, 0.4)', borderLeft: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '28px', right: '28px', width: '48px', height: '48px', borderBottom: '2px solid rgba(196, 30, 58, 0.4)', borderRight: '2px solid rgba(196, 30, 58, 0.4)', display: 'flex' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '160px',
              color: '#D4C5A9',
              fontFamily: 'UnifrakturMaguntia',
              letterSpacing: '0.04em',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Dead Man&apos;s
          </div>

          <div
            style={{
              fontSize: '240px',
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              marginTop: '64px',
              marginBottom: '56px',
            }}
          >
            <div style={{ width: '160px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(196, 30, 58, 0.5))', display: 'flex' }} />
            <svg width="28" height="44" viewBox="0 0 14 22" fill="none">
              <line x1="7" y1="0" x2="7" y2="22" stroke="#C41E3A" strokeWidth="1.5" />
              <line x1="3" y1="6" x2="11" y2="6" stroke="#C41E3A" strokeWidth="1.5" />
            </svg>
            <div style={{ width: '160px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(196, 30, 58, 0.5))', display: 'flex' }} />
          </div>

          <div
            style={{
              fontSize: '44px',
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

        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '28px',
            color: '#FFFFFF',
            fontFamily: 'Crimson Text',
            letterSpacing: '0.1em',
          }}
        >
          dead-mans-proof.vercel.app
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '80px',
            display: 'flex',
            fontSize: '24px',
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
      width: 2400,
      height: 1260,
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
