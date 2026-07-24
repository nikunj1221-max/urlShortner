const dotenv = require('dotenv');
dotenv.config();

const pool = require('./db/pool');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected successfully!');
    console.log('Database time:', res.rows[0].now);
  }
  pool.end();
});
