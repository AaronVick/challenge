import { db } from '../../utils/firebase';

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const response = untrustedData.text;
  const fid = untrustedData.fid;
  const questionId = req.query.questionId;

  if (!response) {
    return res.status(400).json({ error: 'Response cannot be empty' });
  }

  // Fetch the question text from Firestore
  const questionDoc = await db.collection('questions').doc(questionId).get();
  const questionText = questionDoc.exists ? questionDoc.data().question : "Challenge";

  // Fetch username (placeholder function, replace with actual Pinata API call if needed)
  const username = await fetchUsername(fid);

  // Save the response to Firestore
  await db.collection('responses').add({
    FID: fid,
    questionID: questionId,
    response,
    username,
    created: new Date(),
  });

  // Create share text using the question, response, and call-to-action
  const shareText = encodeURIComponent(`My question was:${questionText}\n\n${response}\n\nAre you up for a challenge?`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/og?questionId=${questionId}`)}`;

  res.status(200).json({ redirect: shareLink });
}

async function fetchUsername(fid) {
  return 'Unknown User'; // Replace with actual Pinata API call if needed
}
