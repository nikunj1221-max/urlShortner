const express = require('express');
const router = express.Router();
const { rateLimiter } = require('../middleware/rateLimiter');
const { handleShortenUrl, handleGetLongUrl } = require('../controllers/urlController');

router.post('/shorten', rateLimiter, handleShortenUrl);
router.get('/:code', handleGetLongUrl);

module.exports = router;
