import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';
  const shareText = encodeURIComponent(`Get a random challenge and share your thoughts with the world: ${baseUrl}`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}`;
  const imageUrl = `${baseUrl}/challenge.png`;

  return (
    <>
      <Head>
        <title>Random Challenges</title>
        <meta name="description" content="Get a random challenge and share your thoughts with the world!" />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="Random Challenges" />
        <meta property="og:description" content="Get a random challenge and share your thoughts with the world!" />
        <meta property="og:image" content={imageUrl} />
        
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={imageUrl} />
        <meta property="fc:frame:button:1" content="Take the Challenge" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content={`${baseUrl}/api/challengeFrame`} />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
      </Head>
      
      <main style={{ 
        textAlign: 'center', 
        backgroundColor: '#121212', 
        color: '#FFFFFF', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <img 
          src={imageUrl}
          alt="Random Challenges" 
          style={{ maxWidth: '80%', marginBottom: '20px' }} 
        />
      </main>
    </>
  );
}