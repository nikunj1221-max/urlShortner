const { insertUrl, updateCode, findByCode, getAnalyticsByCode } = require('../repository/urlRepository');
const { encode } = require('../utils/base62');
const redisClient = require('../db/redisClient');

async function shortenUrl(longUrl) {
  const id = await insertUrl(longUrl);
  const code = encode(id);
  await updateCode(id, code);
  return code;
}

async function getLongUrl(code) {
  const longUrl = await redisClient.get(code);
  if (!longUrl) {
    const newLongUrl = await findByCode(code);
    if (!newLongUrl) {
      console.log("cant fetch url");
      return null;
    }
    await redisClient.set(code, newLongUrl, { EX: 3600 });
    return newLongUrl;
  }
  return longUrl;
}

async function getAnalytics(code) {
  return await getAnalyticsByCode(code);
}

async function getAllAnalytics() {
  return await require('../repository/urlRepository').getAllAnalytics();
}

module.exports = { shortenUrl, getLongUrl, getAnalytics, getAllAnalytics };
