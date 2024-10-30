import { db } from '../../utils/firebase';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const response = untrustedData.text;
  const fid = untrustedData.fid;
  const questionId = req.query.questionId;

  if (!response) {
    return res.status(400).json({ error: 'Response cannot be empty' });
  }

  const username = await fetchUsername(fid);

  await db.collection('responses').add({
    FID: fid,
    questionID: questionId,
    response,
    username,
    created: new Date(),
  });

  const shareText = encodeURIComponent(`Challenge: ${response}\n\nAre you up for a challenge?`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/og?questionId=${questionId}`)}`;

  res.status(200).json({ redirect: shareLink });
}