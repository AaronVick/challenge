import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';

  console.log("Base URL:", baseUrl);
  console.log("Environment Variable NEXT_PUBLIC_BASE_PATH:", process.env.NEXT_PUBLIC_BASE_PATH);

  return (
    <>
      <Head>
        <title>Challenges</title>
        <meta name="description" content="Participate in fun challenges and share your responses with the Farcaster community!" />
        
        {/* Farcaster Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/challenge.png`} />
        
        {/* Button 1: Take the Challenge */}
        <meta property="fc:frame:button:1" content="Take the Challenge" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content={`${baseUrl}/api/challengeFrame`} />
      </Head>
      
      <main>
        <h1>Welcome to Challenges</h1>
        <p>Take on a challenge, share your response, and inspire others!</p>
      </main>
    </>
  );
}
