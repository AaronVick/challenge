import { db } from '../../utils/firebase';
import fetch from 'node-fetch';

export const config = {
  runtime: 'nodejs',
};

async function fetchUsername(fid) {
  try {
    const response = await fetch(`https://api.pinata.cloud/data/users/${fid}`);
    if (!response.ok) {
      console.error(`Failed to fetch username for FID: ${fid}`);
      return null;
    }
    const data = await response.json();
    return data.username || null;
  } catch (error) {
    console.error(`Error fetching username for FID: ${fid}`, error);
    return null;
  }
}

export default async function handler(req, res) {
  const { untrustedData } = req.body || {};
  const responseText = untrustedData?.text;
  const fid = untrustedData?.fid;
  const questionId = req.query.questionId;

  console.log('saveResponse accessed');
  console.log('Received data:', untrustedData);

  if (!responseText) {
    console.error('No response provided.');
    return res.status(400).json({ error: 'Response cannot be empty' });
  }

  if (!fid) {
    console.error('No FID provided.');
    return res.status(400).json({ error: 'FID is required' });
  }

  try {
    // Fetch username from Pinata
    const username = await fetchUsername(fid);
    if (!username) {
      console.error('Failed to fetch username');
      return res.status(500).json({ error: 'Failed to fetch username' });
    }

    // Save response to Firebase
    await db.collection('responses').add({
      FID: fid,
      questionID: questionId,
      response: responseText,
      username,
      created: new Date(),
    });

    res.status(200).json({ message: 'Response saved successfully' });
  } catch (error) {
    console.error('Error saving response to Firebase:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
}
