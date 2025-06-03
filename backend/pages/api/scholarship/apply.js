import db from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  // Set CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Adjust if your frontend is elsewhere
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for /api/scholarship/apply');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
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

  // Application Data Processing
  const {
    fullName,
    dateOfBirth,
    address,
    phoneNumber,
    currentInstitution,
    programOfStudy,
    gpa,
    essay,
    householdIncome,
    // For document fields, we'll store placeholders or filenames for now.
    // Actual file upload handling would be more complex.
    incomeProofDocument, 
    transcriptDocument,
    recommendationLetterDocument
  } = req.body;

  // Basic validation (can be expanded)
  if (!fullName || !dateOfBirth || !essay || !userId) {
    return res.status(400).json({ message: 'Missing required application fields (e.g., fullName, dateOfBirth, essay).' });
  }

  try {
    // Check if user already has an application
    const checkStmt = db.prepare('SELECT id FROM applications WHERE userId = ?');
    const existingApplication = checkStmt.get(userId);

    if (existingApplication) {
      // Optionally, allow updates here or return an error/specific message
      return res.status(409).json({ message: 'You have already submitted an application. You can update it if allowed.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO applications (
        userId, fullName, dateOfBirth, address, phoneNumber, 
        currentInstitution, programOfStudy, gpa, essay, householdIncome,
        incomeProofDocument, transcriptDocument, recommendationLetterDocument, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const transformDoc = (docField) => {
      if (docField && typeof docField === 'object' && Object.keys(docField).length === 0) {
        return 'file_placeholder.pdf'; // Placeholder for files that became {}
      }
      if (typeof docField === 'string' && docField.trim() === '') {
        return null; // Treat empty strings as null
      }
      return docField || null; // Use the value if it's a string, otherwise null
    };

    const dbIncomeProofDocument = transformDoc(incomeProofDocument);
    const dbTranscriptDocument = transformDoc(transcriptDocument);
    const dbRecommendationLetterDocument = transformDoc(recommendationLetterDocument);

    const info = insertStmt.run(
      userId, fullName, dateOfBirth, address, phoneNumber,
      currentInstitution, programOfStudy, gpa, essay, householdIncome,
      dbIncomeProofDocument,
      dbTranscriptDocument,
      dbRecommendationLetterDocument,
      'submitted' // Default status
    );

    return res.status(201).json({ message: 'Application submitted successfully', applicationId: info.lastInsertRowid });
  } catch (error) {
    console.error('Application submission error:', error);
    // Check for unique constraint violation if email was part of application and unique
    // For now, general server error
    return res.status(500).json({ message: 'Internal server error during application submission.' });
  }
}
