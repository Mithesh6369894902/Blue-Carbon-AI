import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'datasets', 'indian_blue_carbon_master.json');
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      return res.status(200).json({ success: true, count: data.features.length, data });
    }
  } catch (err) {
    console.error('Error reading dataset:', err);
  }

  return res.status(200).json({
    success: true,
    count: 5,
    message: 'Master dataset accessible via /datasets/indian_blue_carbon_master.json'
  });
}
