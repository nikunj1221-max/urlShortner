const { shortenUrl, getLongUrl, getAnalytics } = require('../services/urlService');
const { incrementClickCount } = require('../repository/urlRepository');

async function handleShortenUrl(req, res) {
  try {
    if (!req.body.longUrl) {
      return res.status(400).json({ message: "bad request" });
    }
    const longUrl = req.body.longUrl;
    const userId = req.user ? req.user.userId : null;
    const code = await shortenUrl(longUrl, userId);
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.status(201).json({ shortUrl: `${baseUrl}/api/${code}` });
  } catch (err) {
    console.error("error shortening url:", err);
    res.status(500).json({ message: "something went wrong" });
  }
}

async function handleGetLongUrl(req, res) {
  try {
    const code = req.params.code;
    const longUrl = await getLongUrl(code);
    if (!longUrl) {
      return res.status(404).json({ message: "no url code found" });
    }
    incrementClickCount(code).catch(err => console.error("click tracking failed", err));
    res.redirect(302, longUrl);
  } catch (err) {
    console.error("error getting long url:", err);
    res.status(500).json({ message: "something went wrong" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const code = req.params.code;
    const stats = await getAnalytics(code);
    if (!stats) {
      return res.status(404).json({ message: "analytics not found" });
    }
    res.json(stats);
  } catch (err) {
    console.error("error getting analytics:", err);
    res.status(500).json({ message: "something went wrong" });
  }
}

async function handleGetAllAnalytics(req, res) {
  try {
    const { getAllAnalytics } = require('../services/urlService');
    const stats = await getAllAnalytics();
    res.json(stats);
  } catch (err) {
    console.error("error getting all analytics:", err);
    res.status(500).json({ message: "something went wrong" });
  }
}

module.exports = {
  handleShortenUrl,
  handleGetLongUrl,
  handleGetAnalytics,
  handleGetAllAnalytics
};
