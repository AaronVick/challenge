import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const { questionId, fid } = req.query;

  try {
    // Fetch the question and the response from Firebase
    const questionDoc = await db.collection('questions').doc(questionId).get();
    const responseSnapshot = await db.collection('responses').where('FID', '==', fid).where('questionID', '==', questionId).limit(1).get();

    if (!questionDoc.exists || responseSnapshot.empty) {
      return res.status(404).json({ error: 'Question or response not found' });
    }

    const question = questionDoc.data().question;
    const responseText = responseSnapshot.docs[0].data().response;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:button:1" content="Share" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_BASE_PATH}/api/shareOG?questionId=${questionId}&response=${encodeURIComponent(responseText)}" />
      </head>
      <body>
        <h1>Challenge Response</h1>
        <p>Question: ${question}</p>
        <p>Your response: ${responseText}</p>
        <button onclick="location.href='${process.env.NEXT_PUBLIC_BASE_PATH}/api/shareOG?questionId=${questionId}&response=${encodeURIComponent(responseText)}'">Share</button>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error loading share page:', error);
    res.status(500).json({ error: 'Failed to load share page' });
  }
}
