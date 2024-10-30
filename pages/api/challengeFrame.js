import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';
  const { untrustedData } = req.body;
  const fid = untrustedData?.fid;

  console.log("Fetching questions from Firestore...");
  
  // Fetch all questions
  const questionsSnapshot = await db.collection('questions').get();
  const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  if (!fid) {
    console.error('No FID provided.');
    return res.status(400).json({ error: 'FID is required' });
  }

  console.log("Checking previously answered questions for FID:", fid);
  
  // Fetch all questions already answered by this FID
  const answeredQuestionsSnapshot = await db.collection('responses')
    .where('FID', '==', fid)
    .get();
  const answeredQuestionIds = answeredQuestionsSnapshot.docs.map(doc => doc.data().questionID);
  
  // Filter out already answered questions
  const unansweredQuestions = questions.filter(q => !answeredQuestionIds.includes(q.id));

  if (unansweredQuestions.length === 0) {
    console.log("No new questions available for this user.");
    // Redirect to an error OG image when no questions are available
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/errorOG?error=no_new_questions" />
      </head>
      <body>
        <p>No new challenges available. Please check back later!</p>
      </body>
      </html>
    `);
  }

  // Select a random unanswered question
  const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
  console.log("Random unanswered question selected:", randomQuestion);

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${baseUrl}/api/og?question=${encodeURIComponent(randomQuestion.question)}" />
      <meta property="fc:frame:input:text" content="Share your answer..." />
      <meta property="fc:frame:button:1" content="Save & Share" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:1:target" content="${baseUrl}/api/saveResponse?questionId=${randomQuestion.id}" />
    </head>
    <body>
      <p>${randomQuestion.question}</p>
    </body>
    </html>
  `);
}
