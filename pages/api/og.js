import { ImageResponse } from '@vercel/og';
import { db } from '../../utils/firebase';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get('questionId');
  
  const questionDoc = await db.collection('questions').doc(questionId).get();
  const question = questionDoc.exists ? questionDoc.data().question : 'Challenge';

  return new ImageResponse(
    (
      <div style={{ fontSize: 32, color: 'white', background: '#333', width: '100%', height: '100%', padding: '40px' }}>
        <h1 style={{ fontSize: '48px', color: '#FFD700' }}>Challenge</h1>
        <p style={{ fontSize: '36px', marginBottom: '20px' }}>{question}</p>
        <p style={{ fontSize: '28px', color: '#4CAF50' }}>Your response here</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
