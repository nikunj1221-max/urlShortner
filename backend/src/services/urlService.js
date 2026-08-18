const { insertUrl, updateCode, findByCode, getAnalyticsByCode, getAllAnalytics: getAllAnalyticsRepo } = require('../repository/urlRepository');
const { encode } = require('../utils/base62');
const redisClient = require('../db/redisClient');

async function shortenUrl(longUrl, userId = null) {
  const id = await insertUrl(longUrl, userId);
  const code = encode(id);
  await updateCode(id, code);
  return code;
}

async function getLongUrl(code) {
  let longUrl = null;
  try {
    if (redisClient.isOpen) {
      longUrl = await redisClient.get(code);
    }
  } catch (err) {
    // Fallback to PostgreSQL
  }

  if (!longUrl) {
    const newLongUrl = await findByCode(code);
    if (!newLongUrl) {
      console.log("cant fetch url");
      return null;
    }
    try {
      if (redisClient.isOpen) {
        await redisClient.set(code, newLongUrl, { EX: 3600 });
      }
    } catch (err) {
      // Ignore cache write error
    }
    return newLongUrl;
  }
  return longUrl;
}

async function getAnalytics(code) {
  return await getAnalyticsByCode(code);
}

async function getAllAnalytics() {
  return await getAllAnalyticsRepo();
}

module.exports = { shortenUrl, getLongUrl, getAnalytics, getAllAnalytics };
