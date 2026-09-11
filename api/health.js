export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ONLINE',
    system: 'BlueCarbon AI Unified Platform (Vercel Serverless)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    deployment: 'Vercel Edge & Serverless Network'
  });
}
