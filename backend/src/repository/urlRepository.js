const pool = require('../db/pool');

// Conceptually: creates a brand new row in your short_urls table, but at this point you only have the long URL. 
// You don't have a code yet, because code is generated from the row's id, and you don't have an id until the row exists. 
// This function's job is: "create the row, hand me back the id Postgres just generated for it."
async function insertUrl(longUrl, userId = null) {
  const result = await pool.query(
    'INSERT INTO short_urls (long_url, user_id) VALUES ($1, $2) RETURNING id',
    [longUrl, userId]
  );
  return result.rows[0].id;
}

async function updateCode(id, code) {
  await pool.query('UPDATE short_urls SET code = $1 WHERE id = $2', [code, id]);
}

async function findByCode(code) {
  const result = await pool.query('SELECT long_url FROM short_urls WHERE code = $1', [code]);
  
  if (result.rows.length === 0) {
    console.log("no url found for this code");
    return null;
  }
  
  return result.rows[0].long_url;
}

async function incrementClickCount(code) {
  await pool.query('UPDATE short_urls SET click_count = click_count + 1 WHERE code = $1', [code]);
}

async function getAnalyticsByCode(code) {
  const result = await pool.query('SELECT long_url, click_count, created_at FROM short_urls WHERE code = $1', [code]);
  
  if (result.rows.length === 0) {
    return null;
  }}
async function getAllAnalytics() {
   
  const result = await pool.query('SELECT code, long_url, click_count, created_at FROM short_urls ORDER BY created_at DESC');
  return result.rows;
}

module.exports = { insertUrl, updateCode, findByCode, incrementClickCount, getAnalyticsByCode, getAllAnalytics }; 
