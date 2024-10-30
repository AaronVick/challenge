import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { question, response } = req.query;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          color: 'white',
          background: 'linear-gradient(to bottom right, #1E2E3D, #2D3E4D)',
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
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#FFD700' }}>Challenge Response</h1>
        <p style={{ fontSize: '36px', marginBottom: '30px' }}>Question: {question}</p>
        <p style={{ fontSize: '28px', color: '#4CAF50' }}>Response: {response}</p>
        <p style={{ fontSize: '24px' }}>Are you up for a challenge?</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
