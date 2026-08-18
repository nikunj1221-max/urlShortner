const authService = require('../services/authService');

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

function setAuthCookie(res, token) {
  res.cookie('auth_token', token, COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}

async function handleGoogleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    const { user, token } = await authService.handleGoogleAuth(credential);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user,
      token,
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(400).json({
      message: err.message || 'Google authentication failed',
    });
  }
}

async function handleRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password });
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user,
      token,
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(400).json({
      message: err.message || 'Registration failed',
    });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(400).json({
      message: err.message || 'Login failed',
    });
  }
}

async function handleMe(req, res) {
  try {
    const user = await authService.getUserProfile(req.user.userId);
    if (!user) {
      clearAuthCookie(res);
      return res.status(404).json({ message: 'User account not found' });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ message: 'Failed to retrieve profile' });
  }
}

async function handleLogout(req, res) {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}

module.exports = {
  handleGoogleLogin,
  handleRegister,
  handleLogin,
  handleMe,
  handleLogout,
};
