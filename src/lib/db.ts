import Database from 'better-sqlite3';
import path from 'path';

// Note: Ensure the database is created in a writable directory. 
// For production Next.js apps, consider using a managed DB or an external volume.
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    age INTEGER,
    blood_group TEXT,
    department TEXT,
    authority_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
