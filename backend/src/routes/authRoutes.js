const express = require('express');
const router = express.Router();
const {
  handleGoogleLogin,
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/google', handleGoogleLogin);
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', authenticateUser, handleMe);
router.post('/logout', handleLogout);

module.exports = router;
