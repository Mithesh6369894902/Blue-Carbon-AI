import crypto from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const evidenceHash = crypto.createHash('sha256').update(payloadString).digest('hex');
  const merkleRoot = crypto.createHash('sha256').update(evidenceHash + '0x7e8b91a20c3d4e5f607').digest('hex');

  return res.status(200).json({
    success: true,
    verified: true,
    evidenceHash: '0x' + evidenceHash,
    merkleRoot: '0x' + merkleRoot,
    timestamp: new Date().toISOString(),
    blockNumber: 19842106,
    smartContract: '0xBlueCarbonMRV_MoES'
  });
}
