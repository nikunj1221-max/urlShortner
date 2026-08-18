const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return false; // Stop retrying if Redis is not running locally
      }
      return 1000;
    },
  },
});

let errorLogged = false;
redisClient.on('error', (err) => {
  if (err.code === 'ECONNREFUSED' || (err.errors && err.errors.some(e => e.code === 'ECONNREFUSED'))) {
    if (!errorLogged) {
      console.warn("⚠️ Redis is not running locally. App will continue using PostgreSQL without Redis caching.");
      errorLogged = true;
    }
  } else {
    console.warn("Redis Error:", err.message || err);
  }
});

redisClient.connect().then(() => {
  console.log("✓ Redis connected successfully.");
}).catch(() => {
  // Handled by error listener
});

module.exports = redisClient;
