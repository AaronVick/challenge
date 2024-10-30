import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    console.log("OG handler accessed");

    const { searchParams } = new URL(req.url);
    const question = searchParams.get('question') || "Ready for a challenge?";
    console.log("Received question parameter:", question);

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 32,
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
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#FFD700' }}>Challenge</h1>
          <p style={{ fontSize: '36px', marginBottom: '30px' }}>{decodeURIComponent(question)}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error in OG handler:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
