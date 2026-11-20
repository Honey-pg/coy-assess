import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { DEMO_USER_ID, DEMO_USER } from './constants';
export { DEMO_USER_ID, DEMO_USER };

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'coy.db');

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
  }
  return dbInstance;
}

export function initSchema(db: Database.Database) {
  db.exec(`
    -- Single demo user and mock profiles share structured profile entity or dedicated tables
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      interests TEXT NOT NULL, -- JSON array
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      interests TEXT NOT NULL, -- JSON array
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, target_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_a_id TEXT NOT NULL,
      user_b_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_a_id, user_b_id)
    );

    CREATE INDEX IF NOT EXISTS idx_swipes_user ON swipes(user_id);
    CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_id);
    CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_a_id, user_b_id);
  `);
}

// Schema initialization and constants are in lib/constants.ts
