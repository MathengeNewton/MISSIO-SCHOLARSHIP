import db from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  // Set CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Adjust if your frontend is elsewhere
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for /api/scholarship/application');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Authentication: Verify JWT token from HttpOnly cookie
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required: No token provided.' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
    if (!userId) {
      throw new Error('Invalid token: userId missing.');
    }
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Authentication failed: Invalid or expired token.' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM applications WHERE userId = ?');
    const application = stmt.get(userId);

    if (!application) {
      return res.status(404).json({ message: 'No application found for this user.' });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ message: 'Internal server error while fetching application.' });
  }
}
