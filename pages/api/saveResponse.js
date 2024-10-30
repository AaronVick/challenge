import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

// Mock function for fetching username; replace with actual logic if needed.
async function fetchUsername(fid) {
  // Simulate username lookup or use a real API as required
  console.log('Fetching username for FID:', fid);
  return `user_${fid}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body || {};
  const responseText = untrustedData?.text;
  const fid = untrustedData?.fid;
  const questionId = req.query.questionId;

  console.log('saveResponse accessed');
  console.log('Received FID:', fid);
  console.log('Received response text:', responseText);
  console.log('Received question ID:', questionId);

  if (!responseText) {
    console.error('No response provided.');
    return res.status(400).json({ error: 'Response cannot be empty' });
  }

  if (!fid) {
    console.error('No FID provided.');
    return res.status(400).json({ error: 'FID is required' });
  }

  try {
    const username = await fetchUsername(fid);

    await db.collection('responses').add({
      FID: fid,
      questionID: questionId,
      response: responseText,
      username: username,
      created: new Date(),
    });

    console.log('Response saved successfully for FID:', fid);
    res.status(200).json({ message: 'Response saved successfully' });
  } catch (error) {
    console.error('Error saving response to Firebase:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
}
