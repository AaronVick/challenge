import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    const { untrustedData } = req.body;
    const response = untrustedData.text;
    const fid = untrustedData.fid;
    const questionId = req.query.questionId;

    if (!response) {
      console.log('No response provided.');
      return res.status(400).json({ error: 'Response cannot be empty' });
    }

    console.log('Received response:', response);
    console.log('Received FID:', fid);
    console.log('Received questionId:', questionId);

    const questionDoc = await db.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      console.log('Question not found in Firestore');
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = questionDoc.data().question;
    console.log('Fetched question from Firestore:', question);

    const username = await fetchUsername(fid);

    await db.collection('responses').add({
      FID: fid,
      questionID: questionId,
      response,
      username,
      created: new Date(),
    });
    console.log('Response saved in Firestore.');

    const shareText = encodeURIComponent(`My response was: "${response}" to the challenge: "${question}"\n\nAre you up for a challenge?`);
    const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/og?questionId=${questionId}`)}`;

    console.log('Generated share link:', shareLink);

    res.status(200).json({ redirect: shareLink });
  } catch (error) {
    console.error('Error in saveResponse handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function fetchUsername(fid) {
  // Mocked function for testing purposes, replace with actual Pinata API call if needed
  console.log('Fetching username for FID:', fid);
  return 'Unknown User';
}
