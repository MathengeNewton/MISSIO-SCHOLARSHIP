import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // This will cause the server to crash on startup if JWT_SECRET is not set,
  // which is good for development to catch the error early.
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env.local. Please add it.');
  process.exit(1);
}

export default async function handler(req, res) {
  // Set CORS headers
  // IMPORTANT: In a production environment, restrict the origin to your frontend's domain.
  // For development, 'http://localhost:3001' (your frontend) is appropriate.
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add any other headers your frontend might send
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // This is crucial for cookies to be sent and received

  if (req.method === 'OPTIONS') {
    // This is a preflight request. Browser is asking for permission.
    // Respond with 200 OK and the headers are already set above.
    console.log('Handling OPTIONS request for /api/auth/login');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    console.log('Handling POST request for /api/auth/login');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const user = stmt.get(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials (user not found)' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });

      // Set cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        // sameSite: 'strict', // 'strict' is generally safer
        sameSite: 'lax', // 'lax' can be more permissive for cross-origin requests during development if 'strict' causes issues.
        maxAge: 60 * 60, // 1 hour in seconds
        path: '/',
      };

      res.setHeader('Set-Cookie', serialize('authToken', token, cookieOptions));

      // It's good practice for the login endpoint to return some user information.
      // AuthContext expects to set `user` with an email.
      return res.status(200).json({ message: 'Login successful', user: { email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
