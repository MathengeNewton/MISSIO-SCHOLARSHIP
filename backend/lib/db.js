import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'missio.sqlite');
const db = new Database(dbPath);

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create applications table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    fullName TEXT,
    dateOfBirth DATE,
    address TEXT,
    phoneNumber TEXT,
    currentInstitution TEXT,
    programOfStudy TEXT,
    gpa REAL,
    essay TEXT,
    householdIncome INTEGER,
    incomeProofDocument TEXT, 
    transcriptDocument TEXT,
    recommendationLetterDocument TEXT,
    status TEXT DEFAULT 'submitted',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

// Trigger to update 'updatedAt' timestamp on row update for applications table
db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_applications_updatedAt
  AFTER UPDATE ON applications
  FOR EACH ROW
  BEGIN
    UPDATE applications SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;
`);

console.log('Database initialized and tables (users, applications) checked/created at', dbPath);

export default db;
