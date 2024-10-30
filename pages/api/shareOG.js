import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const question = searchParams.get('question');
    const response = searchParams.get('response');

    console.log('ShareOG accessed with:', { question, response });

    // Provide defaults in case parameters are missing
    const displayQuestion = question || 'Question not found';
    const displayResponse = response || 'Response not found';

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
          <p style={{ fontSize: '36px', marginBottom: '30px' }}>Question: {decodeURIComponent(displayQuestion)}</p>
          <p style={{ fontSize: '28px', color: '#4CAF50' }}>Response: {decodeURIComponent(displayResponse)}</p>

        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error in ShareOG:', error);
    
    // Return a fallback image in case of errors
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
          <p style={{ fontSize: '32px' }}>Share your challenge response!</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}