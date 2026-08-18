const express = require('express');
const router = express.Router();
const { rateLimiter } = require('../middleware/rateLimiter');
const { optionalAuth } = require('../middleware/authMiddleware');
const { handleShortenUrl, handleGetLongUrl, handleGetAnalytics, handleGetAllAnalytics } = require('../controllers/urlController');

router.post('/shorten', rateLimiter, optionalAuth, handleShortenUrl);
router.get('/stats/all', handleGetAllAnalytics);
router.get('/:code/stats', handleGetAnalytics);
router.get('/:code', handleGetLongUrl);
    
module.exports = router;
