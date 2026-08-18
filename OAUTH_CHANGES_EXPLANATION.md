# Google OAuth & Authentication Integration - Complete File-by-File Breakdown

This document provides a comprehensive explanation of every file created, modified, and configured to implement Google OAuth / Sign-In with JWT session handling, secure HttpOnly cookies, and database user management.

---

## Table of Contents
1. [Architecture Overview & Auth Flow](#1-architecture-overview--auth-flow)
2. [Backend Files Breakdown](#2-backend-files-breakdown)
   - [New Files](#new-backend-files)
   - [Modified Files](#modified-backend-files)
3. [Frontend Files Breakdown](#3-frontend-files-breakdown)
   - [New Files](#new-frontend-files)
   - [Modified Files](#modified-frontend-files)
4. [Database Schema & Migrations](#4-database-schema--migrations)
5. [Security Architecture](#5-security-architecture)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Local & Production Verification Guide](#7-local--production-verification-guide)

---

## 1. Architecture Overview & Auth Flow

```
[ Frontend (React + Vite) ]
      │
      ├── 1. User clicks "Continue with Google"
      ├── 2. Google Identity Services displays auth prompt
      ├── 3. Google returns verified credential (ID Token)
      │
      ▼ (POST /api/auth/google with credential)
[ Backend (Express + Node.js) ]
      │
      ├── 4. Cryptographically verifies token via google-auth-library
      ├── 5. Extracts verified claims: sub (Google ID), email, name, avatar
      │
      ▼ (Query / Insert / Update)
[ Database (PostgreSQL) ]
      │
      ├── 6. Finds user by google_id OR email
      │      - If new user -> Creates account
      │      - If existing email user -> Links google_id (no duplicates!)
      │      - If existing Google user -> Logs in
      │
      ▼
[ Backend (Express + Node.js) ]
      │
      ├── 7. Generates application JWT ({ userId, email })
      ├── 8. Sets secure HttpOnly cookie (auth_token)
      │
      ▼ (Sends HTTP 200 + { user, token })
[ Frontend (React + Vite) ]
      │
      └── 9. Updates AuthContext, sets user profile in Nav, enables user features
```

---

## 2. Backend Files Breakdown

### New Backend Files

#### `backend/src/repository/userRepository.js`
* **Purpose**: Database access layer for the `users` table in PostgreSQL.
* **Key Functions**:
  * `initUserTable()`: Automatically runs `CREATE TABLE IF NOT EXISTS users (...)` and creates indexes on `email` and `google_id` during server startup.
  * `findByEmail(email)`: Case-insensitive user lookup using `LOWER(email)`.
  * `findByGoogleId(googleId)`: Looks up user by Google unique subject ID.
  * `findById(id)`: Fetches safe user profile attributes by primary key ID.
  * `createUser({ email, name, passwordHash, googleId, avatarUrl })`: Inserts a new user row into PostgreSQL.
  * `linkGoogleAccount(userId, googleId, avatarUrl, name)`: Associates a Google ID with an existing email/password user when they sign in with Google using that same email (prevents duplicate accounts).

#### `backend/src/services/authService.js`
* **Purpose**: Authentication business logic, token verification, and password management.
* **Key Functions**:
  * `verifyGoogleCredential(credential)`: Uses Google's official `OAuth2Client.verifyIdToken()` to verify signature against Google's public certificates, checks issuer (`accounts.google.com`), expiration, audience (`GOOGLE_CLIENT_ID`), and ensures `email_verified === true`.
  * `handleGoogleAuth(credential)`: Coordinates verification, user lookup/creation, account linking, and JWT token issuance.
  * `registerUser({ name, email, password })`: Hashes password with `bcrypt` (10 rounds), checks email uniqueness, and creates account.
  * `loginUser({ email, password })`: Validates email and verifies password hash using `bcrypt.compare()`.
  * `generateToken(user)`: Signs a 7-day JWT containing `{ userId: user.id, email: user.email }` using `JWT_SECRET`.
  * `getUserProfile(userId)`: Retrieves user profile data for authenticated sessions.

#### `backend/src/middleware/authMiddleware.js`
* **Purpose**: JWT validation and session extraction middleware.
* **Key Functions**:
  * `extractToken(req)`: Checks for token in `req.cookies.auth_token` (HttpOnly cookie) or `Authorization: Bearer <token>` header.
  * `authenticateUser(req, res, next)`: Strict auth check. Verifies JWT signature and attaches `req.user = { userId, email }`. Returns `401 Unauthorized` if token is missing or expired.
  * `optionalAuth(req, res, next)`: Soft auth check. Attaches `req.user` if valid token exists, but allows anonymous requests to proceed.

#### `backend/src/controllers/authController.js`
* **Purpose**: HTTP route handlers for authentication and cookie lifecycle management.
* **Key Functions**:
  * `setAuthCookie(res, token)`: Sets `auth_token` cookie with `httpOnly: true`, `secure: isProduction`, `sameSite: isProduction ? 'none' : 'lax'`, `maxAge: 7 days`.
  * `clearAuthCookie(res)`: Deletes `auth_token` cookie on logout.
  * `handleGoogleLogin(req, res)`: Handler for `POST /api/auth/google`.
  * `handleRegister(req, res)`: Handler for `POST /api/auth/register`.
  * `handleLogin(req, res)`: Handler for `POST /api/auth/login`.
  * `handleMe(req, res)`: Handler for `GET /api/auth/me`.
  * `handleLogout(req, res)`: Handler for `POST /api/auth/logout`.

#### `backend/src/routes/authRoutes.js`
* **Purpose**: Express router mounting auth endpoints:
  * `POST /api/auth/google`
  * `POST /api/auth/register`
  * `POST /api/auth/login`
  * `GET /api/auth/me` (protected with `authenticateUser`)
  * `POST /api/auth/logout`

#### `backend/.env.example`
* **Purpose**: Example environment configuration for developers and deployment environments.

---

### Modified Backend Files

#### `backend/package.json`
* **Changes**: Added `google-auth-library` dependency.

#### `backend/src/index.js`
* **Changes**:
  * Imported `cookie-parser` and added `app.use(cookieParser())`.
  * Mounted `app.use('/api/auth', authRoutes)`.
  * Configured CORS with credentials (`credentials: true`) and dynamic origins (`process.env.FRONTEND_URL`, Vercel, localhost).
  * Added `await initUserTable()` in `app.listen` to ensure database tables are initialized automatically on startup.

#### `backend/src/repository/urlRepository.js`
* **Changes**: Updated `insertUrl(longUrl, userId = null)` to save `user_id` alongside `long_url` in `short_urls`.

#### `backend/src/services/urlService.js`
* **Changes**:
  * Updated `shortenUrl(longUrl, userId = null)` to pass `userId` to `insertUrl`.
  * Added safe checks `if (redisClient.isOpen)` before Redis calls so lookups fallback gracefully to PostgreSQL if Redis is offline.

#### `backend/src/controllers/urlController.js`
* **Changes**: Extracted `req.user?.userId` in `handleShortenUrl` and passed it to `shortenUrl`.

#### `backend/src/routes/urlRoutes.js`
* **Changes**: Added `optionalAuth` middleware on `POST /shorten` to capture user IDs when authenticated while preserving anonymous access.

#### `backend/src/db/redisClient.js`
* **Changes**: Added a reconnect strategy and error suppression so the application doesn't flood terminal with `ECONNREFUSED` when Redis is not running locally.

#### `backend/src/middleware/rateLimiter.js`
* **Changes**: Added `if (!redisClient.isOpen) return next();` to allow local development when Redis is not active.

#### `backend/.env`
* **Changes**: Added `JWT_SECRET` and `GOOGLE_CLIENT_ID` configuration keys.

---

## 3. Frontend Files Breakdown

### New Frontend Files

#### `frontend/src/context/AuthContext.jsx`
* **Purpose**: Central React Context managing authentication state and actions.
* **Features**:
  * `user`: Current user object (`id`, `email`, `name`, `avatar_url`) or `null`.
  * `loading`: State while verifying initial session with `/api/auth/me`.
  * `loginWithGoogle(credential)`: Sends ID token to backend with `credentials: 'include'`.
  * `loginWithPassword(email, password)`: Email/password login.
  * `registerWithPassword(name, email, password)`: Email/password registration.
  * `logout()`: Clears session cookie and resets user state.
  * `checkAuth()`: Re-checks session on mount.

#### `frontend/src/components/GoogleAuthButton.jsx`
* **Purpose**: Integrates Google Identity Services (GIS) button.
* **Features**:
  * Initializes `window.google.accounts.id` with `VITE_GOOGLE_CLIENT_ID`.
  * Renders official Google button inside a container ref.
  * Captures `response.credential` and triggers `onCredentialSuccess`.
  * Provides visual fallback and loading state if Google script is loading or config is missing.

#### `frontend/.env.example`
* **Purpose**: Example frontend configuration template (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`).

#### `.gitignore` (Root)
* **Purpose**: Workspace root gitignore preventing `.env` files and build directories from being committed.

---

### Modified Frontend Files

#### `frontend/index.html`
* **Changes**: Added Google Identity Services client script:
  ```html
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  ```

#### `frontend/src/main.jsx`
* **Changes**: Wrapped root `<App />` component in `<AuthProvider>`.

#### `frontend/src/components/Nav.jsx`
* **Changes**:
  * Consumes `useAuth()`.
  * When logged out: Shows "Sign in / Sign up" CTA button.
  * When logged in: Shows user profile badge with avatar image, first name, and "Sign out" button.

#### `frontend/src/components/AuthModal.jsx`
* **Changes**:
  * Added `GoogleAuthButton` ("Continue with Google") prominently at the top.
  * Added visual divider `"or continue with email"`.
  * Connected standard form submission to `loginWithPassword` and `registerWithPassword`.
  * Added error alert banners (`auth-alert-error`), success banners, and loading spinners.

#### `frontend/src/components/FoldDemo.jsx`
* **Changes**: Added `credentials: 'include'` to `fetch(`${API_URL}/api/shorten`, ...)` so shortened links associate with the logged-in user.

#### `frontend/src/components/AllStatsModal.jsx`
* **Changes**: Used `API_BASE_URL` with `credentials: 'include'` for fetching global link statistics.

#### `frontend/src/App.css`
* **Changes**: Added styles for:
  * Google OAuth button wrapper & container.
  * Visual divider lines with text.
  * Error and success alert boxes.
  * Animated circular spinners.
  * Nav user profile badge, avatar circle, and logout button.

#### `frontend/.env`
* **Changes**: Added `VITE_GOOGLE_CLIENT_ID` configuration key.

---

## 4. Database Schema & Migrations

The `users` table is automatically created in PostgreSQL on server startup:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NULL,
  google_id VARCHAR(255) UNIQUE NULL,
  avatar_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

### Key Schema Characteristics:
* `password_hash` is `NULL` for users who authenticate solely via Google.
* `google_id` is unique and indexed for fast OAuth lookups.
* `email` is unique and indexed to prevent duplicate accounts.
* `short_urls.user_id` links shortened links to the `users.id` foreign key.

---

## 5. Security Architecture

1. **Cryptographic Token Verification**: The backend verifies Google tokens directly against Google's public key certificates using `google-auth-library`. Claims from the frontend are never trusted without backend signature verification.
2. **HttpOnly Cookies**: Session JWTs are stored in `HttpOnly` cookies, preventing XSS-based token theft.
3. **Cross-Site Protection**: In production, cookies are configured with `SameSite=None` and `Secure=true` (HTTPS), enabling secure cross-origin communication between Vercel and Render.
4. **CORS Safety**: CORS is configured with `credentials: true` and explicit origin reflection. Wildcard `*` origins are strictly avoided.
5. **No Secret Leaks**: Google Client Secret and JWT secrets are kept exclusively on the backend server. Only public Client IDs are present in the frontend.

---

## 6. Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/urlshortner` |
| `PORT` | Express server port | `3000` |
| `BASE_URL` | Base URL for generated short links | `http://localhost:3000` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key used to sign session JWTs | `super_secure_jwt_secret_min_32_chars` |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web Client ID | `xxxx.apps.googleusercontent.com` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` (or empty for Vite proxy) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web Client ID | `xxxx.apps.googleusercontent.com` |

---

## 7. Local & Production Verification Guide

### Local Testing
1. Add your Google OAuth Client ID to both `backend/.env` and `frontend/.env`.
2. Ensure `http://localhost:5173` and `http://localhost:3000` are added under **Authorized JavaScript origins** in Google Cloud Console.
3. Start backend:
   ```powershell
   cd backend
   npm run dev
   ```
4. Start frontend:
   ```powershell
   cd frontend
   npm run dev
   ```
5. Open `http://localhost:5173`, click **"Sign in / Sign up"**, and click **"Continue with Google"**.

### Production Deployment
1. **Render (Backend)**: Add environment variables in Render Dashboard: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `NODE_ENV=production`, `FRONTEND_URL=https://url-shortner-rho-pied.vercel.app`.
2. **Vercel (Frontend)**: Add environment variables in Vercel Project Settings: `VITE_API_URL=https://urlshortner-exex.onrender.com`, `VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com`.
3. In Google Cloud Console, ensure your Vercel URL (`https://url-shortner-rho-pied.vercel.app`) is listed in **Authorized JavaScript origins**.
