/**
 * Database Initialization
 * Creates SQLite database and tables for syncing training data
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const DB_PATH = process.env.DATABASE_PATH || './data/gypsy-training.db';

let db;

function getDatabase() {
  if (!db) {
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
    });
  }
  return db;
}

async function initDatabase() {
  const database = getDatabase();

  return new Promise((resolve, reject) => {
    database.serialize(async () => {
      try {
        // Users table (single user system)
        database.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
          )
        `);

        // Training sessions table
        database.run(`
          CREATE TABLE IF NOT EXISTS training_sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            phase INTEGER NOT NULL,
            skill_name TEXT NOT NULL,
            notes TEXT,
            rating INTEGER,
            duration INTEGER,
            date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Training progress table
        database.run(`
          CREATE TABLE IF NOT EXISTS training_progress (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            phase INTEGER NOT NULL,
            skill_name TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Journal entries table
        database.run(`
          CREATE TABLE IF NOT EXISTS journal_entries (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            date DATE NOT NULL,
            mood TEXT,
            category TEXT,
            word_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Photo albums table
        database.run(`
          CREATE TABLE IF NOT EXISTS photo_albums (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Photos table
        database.run(`
          CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY,
            album_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            file_name TEXT NOT NULL,
            file_data TEXT NOT NULL,
            caption TEXT,
            upload_date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (album_id) REFERENCES photo_albums (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Nutrition logs table
        database.run(`
          CREATE TABLE IF NOT EXISTS nutrition_logs (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            date DATE NOT NULL,
            meal_type TEXT NOT NULL,
            food_item TEXT NOT NULL,
            calories INTEGER,
            protein REAL,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Sync metadata table
        database.run(`
          CREATE TABLE IF NOT EXISTS sync_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_id TEXT NOT NULL,
            last_sync DATETIME NOT NULL,
            sync_type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Certificates table
        database.run(`
          CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            certificate_number INTEGER UNIQUE NOT NULL,
            user_id INTEGER NOT NULL,
            handler_name TEXT NOT NULL,
            dog_name TEXT NOT NULL,
            dog_breed TEXT,
            certification_type TEXT NOT NULL,
            issue_date DATE NOT NULL,
            completion_date DATE,
            training_hours INTEGER,
            skills_mastered TEXT,
            instructor_name TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);

        // Certificate counter table (starts at 3416)
        database.run(`
          CREATE TABLE IF NOT EXISTS certificate_counter (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            current_number INTEGER NOT NULL DEFAULT 3416
          )
        `);

        // Initialize certificate counter
        database.run(`
          INSERT OR IGNORE INTO certificate_counter (id, current_number) VALUES (1, 3416)
        `);

        // Create indexes for better performance
        database.run('CREATE INDEX IF NOT EXISTS idx_training_sessions_user ON training_sessions(user_id)');
        database.run('CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(date)');
        database.run('CREATE INDEX IF NOT EXISTS idx_journal_entries_user ON journal_entries(user_id)');
        database.run('CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date)');
        database.run('CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album_id)');
        database.run('CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user ON nutrition_logs(user_id)');
        database.run('CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON nutrition_logs(date)');

        // Check if default user exists
        database.get('SELECT id FROM users WHERE username = ?', [process.env.DEFAULT_USERNAME], async (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            // Create default user
            const passwordHash = await bcrypt.hash(process.env.DEFAULT_PASSWORD, parseInt(process.env.BCRYPT_ROUNDS));
            database.run(
              'INSERT INTO users (username, password_hash) VALUES (?, ?)',
              [process.env.DEFAULT_USERNAME, passwordHash],
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  console.log(`✓ Default user '${process.env.DEFAULT_USERNAME}' created`);
                  resolve();
                }
              }
            );
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

function runQuery(sql, params = []) {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(sql, params = []) {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(sql, params = []) {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  runQuery,
  getQuery,
  allQuery
};
