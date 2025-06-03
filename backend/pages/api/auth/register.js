import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Though not strictly needed for register if not setting cookies

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for /api/auth/register');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    console.log('Handling POST request for /api/auth/register');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const existingUser = stmt.get(email);

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertStmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
      const info = insertStmt.run(email, hashedPassword);

      return res.status(201).json({ message: 'User registered successfully', userId: info.lastInsertRowid });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error during registration.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
