import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';
  const { untrustedData } = req.body || {};
  const fid = untrustedData?.fid;

  console.log('Challenge Frame Handler Accessed for FID:', fid);

  if (!fid) {
    console.error('FID not provided');
    return res.status(400).json({ error: 'FID is required' });
  }

  try {
    // Get all questions first
    const allQuestionsSnapshot = await db.collection('questions').get();
    const allQuestions = allQuestionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get answered questions for this user
    const answeredQuestionsSnapshot = await db.collection('responses')
      .where('FID', '==', fid)
      .get();
    const answeredQuestionIds = answeredQuestionsSnapshot.docs.map(doc => doc.data().questionID);

    console.log('Total questions:', allQuestions.length);
    console.log('Answered questions:', answeredQuestionIds.length);
    console.log('Previously answered IDs:', answeredQuestionIds);

    // Filter out answered questions
    const availableQuestions = allQuestions.filter(question => 
      !answeredQuestionIds.includes(question.id)
    );

    console.log('Available questions:', availableQuestions.length);

    // Double-check our completion logic
    if (availableQuestions.length === 0 && answeredQuestionIds.length === allQuestions.length) {
      console.log('User has truly completed all questions!');
      
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?message=Completed all challenges!" />
          <meta property="fc:frame:button:1" content="Share Achievement" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}/api/share?completed=true&fid=${fid}" />
        </head>
        <body>
          <p>Congratulations! You've completed all available challenges!</p>
        </body>
        </html>
      `);
    }

    // Otherwise, select and show a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    console.log('Selected random question:', selectedQuestion.id);
    console.log('Rendering question frame with question:', selectedQuestion.question);

    // Make sure we're actually sending the question frame
    res.setHeader('Content-Type', 'text/html');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og?question=${encodeURIComponent(selectedQuestion.question)}" />
        <meta property="fc:frame:input:text" content="Share your answer..." />
        <meta property="fc:frame:button:1" content="Save" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/api/saveResponse?questionId=${selectedQuestion.id}" />
      </head>
      <body>
        <p>${selectedQuestion.question}</p>
      </body>
      </html>
    `;
    
    console.log('Sending HTML response:', html.substring(0, 200) + '...');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Error in challengeFrame:', error, error.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}