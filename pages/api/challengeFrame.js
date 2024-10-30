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
    // Fetch previously answered questions for this FID
    const answeredQuestionsSnapshot = await db.collection('responses')
      .where('FID', '==', fid)
      .get();
    const answeredQuestionIds = answeredQuestionsSnapshot.docs.map(doc => doc.data().questionID);

    console.log('Previously answered questions for FID:', answeredQuestionIds);

    // Check if the list of answered question IDs is indeed empty
    if (answeredQuestionIds.length === 0) {
      console.log('No questions have been answered by this FID yet');
    }

    // Get total number of questions in the database to set the loop limit
    const totalQuestionsSnapshot = await db.collection('questions').get();
    const questions = totalQuestionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalQuestionsCount = questions.length;

    let attempts = 0;
    let selectedQuestion = null;

    while (attempts < totalQuestionsCount) {
      // Select a random question from the fetched questions
      const randomQuestion = questions[Math.floor(Math.random() * totalQuestionsCount)];

      // Check if this question has already been answered by this FID
      if (!answeredQuestionIds.includes(randomQuestion.id)) {
        selectedQuestion = randomQuestion;
        break;
      }

      console.log('Question already answered, fetching another...');
      attempts++;
    }

    if (!selectedQuestion) {
      console.log('No unanswered questions available for this FID');

      // If all questions are answered or we couldn't find an unanswered one, show a "No challenges" message
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?message=No new challenges available" />
        </head>
        <body>
          <p>No new challenges available. Check back later!</p>
        </body>
        </html>
      `);
    }

    console.log('Random unanswered question selected:', selectedQuestion);

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og?questionId=${selectedQuestion.id}" />
        <meta property="fc:frame:input:text" content="Share your answer..." />
        <meta property="fc:frame:button:1" content="Save" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/api/saveResponse?questionId=${selectedQuestion.id}" />
      </head>
      <body>
        <p>${selectedQuestion.question}</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching questions or responses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
