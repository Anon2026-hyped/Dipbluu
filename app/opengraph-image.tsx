import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#000000',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'serif',
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(37,99,235,0.12), transparent)',
        }}
      />

      {/* Top rule */}
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 64,
          right: 64,
          height: 1,
          background: 'rgba(201,168,76,0.3)',
        }}
      />

      {/* Brand name */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 400,
          letterSpacing: '0.18em',
          color: '#f0f4ff',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        BOANERGES
      </div>

      {/* Divider line */}
      <div
        style={{
          width: 1,
          height: 48,
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.7), transparent)',
          margin: '28px auto',
        }}
      />

      {/* Tagline */}
      <div
        style={{
          fontSize: 18,
          letterSpacing: '0.32em',
          color: 'rgba(201,168,76,0.75)',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        A Royal Priesthood
      </div>

      {/* Bottom rule */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 64,
          right: 64,
          height: 1,
          background: 'rgba(201,168,76,0.3)',
        }}
      />
    </div>,
    { width: 1200, height: 630 },
  )
}
