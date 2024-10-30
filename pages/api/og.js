import { ImageResponse } from '@vercel/og';
import { db } from '../../utils/firebase';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log("OG Image Generator accessed");

  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('questionId');
    console.log("Question ID:", questionId);

    if (!questionId) {
      console.log("Error: Question ID not provided");
      return new Response("Question ID is required", { status: 400 });
    }

    const questionDoc = await db.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      console.log("Error: Question not found in Firestore");
      return new Response("Question not found", { status: 404 });
    }

    const question = questionDoc.data().question;
    console.log("Fetched Question:", question);

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
          <p style={{ fontSize: '36px', marginBottom: '30px' }}>{question}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Error in OG Image Generator:", e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
