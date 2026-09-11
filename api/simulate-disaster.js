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

  const { disasterType, siteId } = req.body || {};
  let impactRiskScore = 80;
  let eventCode = 'EMERGENCY_FREEZE_EVENT';

  if (disasterType === 'CYCLONE') {
    impactRiskScore = 82;
    eventCode = 'EMERGENCY_FREEZE_CYCLONE_DAMAGE';
  } else if (disasterType === 'DEFORESTATION') {
    impactRiskScore = 94;
    eventCode = 'CRITICAL_FRAUD_ILLEGAL_CLEARING';
  } else if (disasterType === 'OIL_SPILL') {
    impactRiskScore = 78;
    eventCode = 'ALERT_POLLUTION_SOIL_TOXICITY';
  } else if (disasterType === 'HEATWAVE') {
    impactRiskScore = 68;
    eventCode = 'WARNING_THERMAL_BLEACHING_RISK';
  }

  const payload = JSON.stringify({ disasterType, siteId, timestamp: new Date().toISOString() });
  const eventHash = crypto.createHash('sha256').update(payload).digest('hex');

  return res.status(200).json({
    success: true,
    disasterType,
    impactRiskScore,
    eventCode,
    blockchainHash: '0x' + eventHash,
    action: 'CARBON_ISSUANCE_PAUSED'
  });
}
