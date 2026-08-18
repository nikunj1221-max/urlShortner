const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  findByEmail,
  findByGoogleId,
  findById,
  createUser,
  linkGoogleAccount,
} = require('../repository/userRepository');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_change_in_production';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function verifyGoogleCredential(credential) {
  if (!credential) {
    throw new Error('Missing Google credential token');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured on the backend server');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token payload');
  }

  // Validate issuer and email verification
  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (!validIssuers.includes(payload.iss)) {
    throw new Error('Invalid Google token issuer');
  }

  if (!payload.email_verified) {
    throw new Error('Google email is not verified');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || '',
    avatarUrl: payload.picture || null,
  };
}

async function handleGoogleAuth(credential) {
  const { googleId, email, name, avatarUrl } = await verifyGoogleCredential(credential);

  let user = await findByGoogleId(googleId);

  if (user) {
    // Existing Google account user
    const token = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      token,
    };
  }

  // Check if an account with this email exists (e.g. registered with password)
  const existingEmailUser = await findByEmail(email);
  if (existingEmailUser) {
    // Link Google ID to existing account
    user = await linkGoogleAccount(existingEmailUser.id, googleId, avatarUrl, name);
  } else {
    // Create brand new user
    user = await createUser({
      email,
      name,
      passwordHash: null,
      googleId,
      avatarUrl,
    });
  }

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
    token,
  };
}

async function registerUser({ name, email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existing = await findByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    email,
    name: name || '',
    passwordHash,
    googleId: null,
    avatarUrl: null,
  });

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.password_hash) {
    throw new Error('This account was created with Google Sign-In. Please sign in with Google.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
    token,
  };
}

async function getUserProfile(userId) {
  const user = await findById(userId);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

module.exports = {
  handleGoogleAuth,
  registerUser,
  loginUser,
  getUserProfile,
  generateToken,
};
