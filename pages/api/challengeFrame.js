import { db } from '../../utils/firebase';

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';

  // Pull a random question from Firestore
  const questionsSnapshot = await db.collection('questions').get();
  const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${baseUrl}/api/og?questionId=${randomQuestion.id}" />
      <meta property="fc:frame:input:text" content="Share your answer..." />
      <meta property="fc:frame:button:1" content="Cancel" />
      <meta property="fc:frame:button:1:action" content="dismiss" />
      <meta property="fc:frame:button:2" content="Save & Share" />
      <meta property="fc:frame:button:2:action" content="post" />
      <meta property="fc:frame:button:2:target" content="${baseUrl}/api/saveResponse?questionId=${randomQuestion.id}" />
    </head>
    </html>
  `);
}
