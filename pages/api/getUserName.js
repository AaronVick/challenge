const PINATA_HUB_API = 'https://hub.pinata.cloud/v1';
const USER_DATA_TYPES = { USERNAME: 6 };

export default async function handler(req, res) {
  const { fid } = req.query;

  try {
    const response = await fetch(`${PINATA_HUB_API}/userDataByFid?fid=${fid}&user_data_type=${USER_DATA_TYPES.USERNAME}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    res.status(200).json({ username: data?.data?.userDataBody?.value || 'Unknown User' });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: 'Failed to fetch username' });
  }
}
