const pool = require('../db/pool');

async function initUserTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      password_hash VARCHAR(255) NULL,
      google_id VARCHAR(255) UNIQUE NULL,
      avatar_url TEXT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
  `;
  try {
    await pool.query(query);
    console.log('PostgreSQL: Users table initialized.');
  } catch (err) {
    console.error('PostgreSQL: Failed to initialize users table:', err);
  }
}

async function findByEmail(email) {
  if (!email) return null;
  const result = await pool.query(
    'SELECT id, email, name, password_hash, google_id, avatar_url, created_at FROM users WHERE LOWER(email) = LOWER($1)',
    [email.trim()]
  );
  return result.rows[0] || null;
}

async function findByGoogleId(googleId) {
  if (!googleId) return null;
  const result = await pool.query(
    'SELECT id, email, name, password_hash, google_id, avatar_url, created_at FROM users WHERE google_id = $1',
    [googleId]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  if (!id) return null;
  const result = await pool.query(
    'SELECT id, email, name, avatar_url, google_id, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createUser({ email, name, passwordHash = null, googleId = null, avatarUrl = null }) {
  const result = await pool.query(
    `INSERT INTO users (email, name, password_hash, google_id, avatar_url)
     VALUES (LOWER($1), $2, $3, $4, $5)
     RETURNING id, email, name, avatar_url, google_id, created_at`,
    [email.trim(), name || '', passwordHash, googleId, avatarUrl]
  );
  return result.rows[0];
}

async function linkGoogleAccount(userId, googleId, avatarUrl = null, name = null) {
  const result = await pool.query(
    `UPDATE users
     SET google_id = $1,
         avatar_url = COALESCE(avatar_url, $2),
         name = COALESCE(NULLIF(name, ''), $3),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, email, name, avatar_url, google_id, created_at`,
    [googleId, avatarUrl, name, userId]
  );
  return result.rows[0];
}

module.exports = {
  initUserTable,
  findByEmail,
  findByGoogleId,
  findById,
  createUser,
  linkGoogleAccount,
};
