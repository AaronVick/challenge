export default async function handler(req, res) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || 'https://takethechallenge.vercel.app';
  
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/errorOG" />
        <meta property="fc:frame:button:1" content="Retry" />
        <meta property="fc:frame:button:1:action" content="redirect" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          h1 { color: #FF0000; }
        </style>
      </head>
      <body>
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn’t save your response. Please try again.</p>
      </body>
      </html>
    `);
  }
  