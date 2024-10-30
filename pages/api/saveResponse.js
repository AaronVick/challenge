import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

async function fetchUsername(fid) {
  try {
    const response = await fetch(`https://api.pinata.cloud/users/${fid}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error(`Failed to fetch username for FID ${fid}`);
      return 'Unknown User';
    }

    const data = await response.json();
    return data.username || 'Unknown User';
  } catch (error) {
    console.error('Error fetching username:', error);
    return 'Unknown User';
  }
}

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const responseText = untrustedData.text;
  const fid = untrustedData.fid;
  const questionId = req.query.questionId;

  if (!responseText) {
    console.error('No response provided.');
    return res.status(400).json({ error: 'Response cannot be empty' });
  }

  if (!fid) {
    console.error('No FID provided.');
    return res.status(400).json({ error: 'FID is required' });
  }

  const username = await fetchUsername(fid);

  try {
    await db.collection('responses').add({
      FID: fid,
      questionID: questionId,
      response: responseText,
      username,
      created: new Date(),
    });

    // Redirect to `share.js` with the response and question ID
    res.status(200).json({ redirect: `${process.env.NEXT_PUBLIC_BASE_PATH}/api/share?questionId=${questionId}&fid=${fid}` });
  } catch (error) {
    console.error('Error saving response to Firebase:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
}
