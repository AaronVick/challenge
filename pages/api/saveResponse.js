import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

const PINATA_HUB_API = 'https://hub.pinata.cloud/v1';
const USER_DATA_TYPES = { USERNAME: 6 };

async function fetchUsername(fid) {
  console.log('Fetching username for FID:', fid);
  try {
    const response = await fetch(`${PINATA_HUB_API}/userDataByFid?fid=${fid}&user_data_type=${USER_DATA_TYPES.USERNAME}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data?.data?.userDataBody?.value || `user_${fid}`;
  } catch (error) {
    console.error("Error fetching username from Pinata:", error);
    return `user_${fid}`; // Fallback in case of error
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';
  const { untrustedData } = req.body || {};
  const responseText = untrustedData?.inputText;
  const fid = untrustedData?.fid;
  const questionId = req.query.questionId;

  console.log('saveResponse accessed');
  console.log('Received FID:', fid);
  console.log('Received response text:', responseText);
  console.log('Received question ID:', questionId);

  if (!responseText) {
    console.error('No response provided.');
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og?message=Please provide an answer" />
      </head>
      <body>
        <p>Please provide an answer to the question.</p>
      </body>
      </html>
    `);
  }

  if (!fid) {
    console.error('No FID provided.');
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og?message=Authentication required" />
      </head>
      <body>
        <p>Authentication required.</p>
      </body>
      </html>
    `);
  }

  try {
    const username = await fetchUsername(fid);
    console.log('Retrieved username:', username);

    // Get the question text
    const questionDoc = await db.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      throw new Error('Question not found');
    }
    const questionText = questionDoc.data().question;

    // Save the response
    await db.collection('responses').add({
      FID: fid,
      questionID: questionId,
      response: responseText,
      username: username,
      created: new Date(),
    });

    console.log('Response saved successfully for FID:', fid);
    
    const castText = `My challenge was: ${questionText}\n\nAnd my answer was: ${responseText}\n\nAre you ready to take the challenge?`;
    const frameUrl = encodeURIComponent(baseUrl);
    const shareLink = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${frameUrl}`;
    
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/shareOG?question=${encodeURIComponent(questionText)}&response=${encodeURIComponent(responseText)}" />
        <meta property="fc:frame:button:1" content="Share Your Response" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${shareLink}" />
      </head>
      <body>
        <p>Response saved! Click "Share Your Response" to share.</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error saving response to Firebase:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/og?message=Error saving response" />
        <meta property="fc:frame:button:1" content="Try Again" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/api/challengeFrame" />
      </head>
      <body>
        <p>Error saving your response. Please try again.</p>
      </body>
      </html>
    `);
  }
}