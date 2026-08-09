const { createClient } = require('redis');
console.log("REDIS_URL length:", process.env.REDIS_URL?.length);
console.log("REDIS_URL raw:", JSON.stringify(process.env.REDIS_URL));
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error',(err) => console.log("Redis Error" , err));
redisClient.connect();

module.exports =redisClient;
