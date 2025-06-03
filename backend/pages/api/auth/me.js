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
    console.log('Handling OPTIONS request for /api/auth/me');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated: No token provided for /me endpoint.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // You might want to fetch fresh user details from DB here if needed,
    // especially if roles/permissions can change.
    // For now, returning info from token is sufficient for re-establishing session.
    return res.status(200).json({ user: { id: decoded.userId, email: decoded.email } });
  } catch (error) {
    console.error('JWT verification error in /api/auth/me:', error.message);
    // Clear the invalid cookie if verification fails (e.g. expired, tampered)
    // This helps prevent the client from continuously sending a bad cookie.
    res.setHeader('Set-Cookie', 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'); 
    return res.status(401).json({ message: 'Authentication failed: Invalid or expired token for /me endpoint.' });
  }
}
