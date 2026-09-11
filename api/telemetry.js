export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { siteId } = req.query;
  const salinity = Number((24 + Math.random() * 8).toFixed(2));
  const temp = Number((26 + Math.random() * 4).toFixed(2));
  const soc = Number((3.5 + Math.random() * 1.5).toFixed(2));
  const ph = Number((6.8 + Math.random() * 0.8).toFixed(2));

  return res.status(200).json({
    success: true,
    siteId: siteId || 'sundarbans-wb',
    timestamp: new Date().toISOString(),
    telemetry: {
      salinityPpt: salinity,
      waterTempC: temp,
      socPercentage: soc,
      soilPh: ph,
      seaLevelAnomalyMm: Number((1.0 + Math.random() * 1.5).toFixed(1)),
      dissolvedOxygenMgL: Number((6.0 + Math.random() * 1.2).toFixed(1))
    }
  });
}
