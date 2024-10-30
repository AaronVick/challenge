import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          color: 'white',
          background: '#333',
          width: '100%',
          height: '100%',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '48px', color: '#FF0000', marginBottom: '20px' }}>Error</h1>
        <p style={{ fontSize: '36px', color: '#FFD700' }}>Something went wrong</p>
        <p style={{ fontSize: '28px', color: '#FFFFFF' }}>Please try again</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
