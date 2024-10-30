import { ImageResponse } from '@vercel/og';
import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const { questionId } = req.query;

  const questionDoc = await db.collection('questions').doc(questionId).get();
  if (!questionDoc.exists) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const question = questionDoc.data().question;

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
        <p style={{ fontSize: '28px', color: '#4CAF50' }}>Are you up for a challenge?</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
