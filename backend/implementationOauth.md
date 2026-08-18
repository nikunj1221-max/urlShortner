# Google Sign-In / OAuth Authentication Implementation Plan

We will implement Google OAuth authentication using the official Google Identity Services on the frontend and `google-auth-library` on the backend, seamlessly integrated into the existing Express + PostgreSQL backend and React + Vite frontend.

## Existing Architecture Overview
- **Backend**: Express 5 application with PostgreSQL (`pg` pool) for URL storage, Redis for caching and rate limiting, CORS configured with credentials. `bcrypt`, `jsonwebtoken`, and `cookie-parser` are present in dependencies.
- **Frontend**: Vite + React 19 application with custom Brutalist editorial styling. Currently contains an unhooked `AuthModal.jsx` modal and public URL shortening tools.
- **Database**: PostgreSQL with `short_urls` table (containing `user_id INT NULL` column).

---

## User Review Required

> [!IMPORTANT]
> **Google Client ID Configuration**:
> - Frontend will use `VITE_GOOGLE_CLIENT_ID` from `frontend/.env`.
> - Backend will use `GOOGLE_CLIENT_ID` and `JWT_SECRET` from `backend/.env`.
> - You have already configured Google Cloud Console. Ensure your Authorized JavaScript Origins include:
>   - `http://localhost:5173` (Vite dev server)
>   - `http://localhost:3000` (Local preview/server)
>   - `https://url-shortner-rho-pied.vercel.app` (Production frontend)

> [!NOTE]
> **Database Table Creation**:
> We will create a `users` table in PostgreSQL. An automatic initialization script `initDb.js` / migration will be provided to ensure the table and indexes are created automatically if they do not exist.

---

## Proposed Changes

### 1. Backend

#### [NEW] [userRepository.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/repository/userRepository.js)
- `initUserTable()`: Creates `users` table if it doesn't already exist with fields `id`, `email`, `name`, `password_hash`, `google_id`, `avatar_url`, `created_at`, `updated_at`.
- `findByEmail(email)`: Query user by unique email.
- `findByGoogleId(googleId)`: Query user by Google subject ID.
- `findById(id)`: Query user by primary key ID.
- `createUser({ email, name, passwordHash, googleId, avatarUrl })`: Inserts new user record.
- `linkGoogleAccount(userId, googleId, avatarUrl)`: Links Google ID and updates avatar for an existing email/password user when they sign in with Google with the same email.

#### [NEW] [authService.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/services/authService.js)
- `verifyGoogleCredential(credential)`: Uses `google-auth-library` `OAuth2Client.verifyIdToken` to verify token signature, expiration, audience (`GOOGLE_CLIENT_ID`), issuer, and email verification status.
- `handleGoogleAuth(credential)`:
  1. Verifies token and extracts user profile (`sub`, `email`, `name`, `picture`, `email_verified`).
  2. Checks for existing user by `google_id` or `email`.
  3. If existing email user without Google ID, automatically links `google_id` and avatar (no duplicate accounts).
  4. If new user, creates new account.
  5. Generates application JWT.
- `registerUser({ name, email, password })`: Validates input, hashes password with `bcrypt`, checks email collision, creates user, issues JWT.
- `loginUser({ email, password })`: Verifies email and password hash, issues JWT.
- `generateToken(user)`: Signs JWT containing `{ userId: user.id, email: user.email }` using `JWT_SECRET`.

#### [NEW] [authMiddleware.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/middleware/authMiddleware.js)
- `authenticateUser(req, res, next)`: Reads JWT from `req.cookies.auth_token` or `Authorization: Bearer <token>`, verifies signature with `JWT_SECRET`, attaches decoded user `{ userId, email }` to `req.user`. Returns 401 if unauthorized.
- `optionalAuth(req, res, next)`: Attempts to decode token and attach `req.user` if present, but continues if anonymous.

#### [NEW] [authController.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/controllers/authController.js)
- `handleGoogleAuth`: Handles `POST /api/auth/google`, sets secure HttpOnly cookie `auth_token`, returns user info.
- `handleRegister`: Handles `POST /api/auth/register`, sets cookie, returns user info.
- `handleLogin`: Handles `POST /api/auth/login`, sets cookie, returns user info.
- `handleMe`: Handles `GET /api/auth/me` to return authenticated user details.
- `handleLogout`: Handles `POST /api/auth/logout`, clears `auth_token` cookie.

#### [NEW] [authRoutes.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/routes/authRoutes.js)
- Defines `/api/auth` endpoints:
  - `POST /google`
  - `POST /register`
  - `POST /login`
  - `GET /me` (protected)
  - `POST /logout`

#### [MODIFY] [index.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/index.js)
- Add `const cookieParser = require('cookie-parser');` and `app.use(cookieParser());`.
- Mount `app.use('/api/auth', authRoutes);`.
- Call `initUserTable()` on server startup to ensure PostgreSQL table readiness.

#### [MODIFY] [urlRepository.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/repository/urlRepository.js) & [urlController.js](file:///c:/Nikks_Workspace/URL-shortener/backend/src/controllers/urlController.js)
- Update `insertUrl(longUrl, userId)` to associate shortened URLs with the authenticated `user_id` when available.
- Use `optionalAuth` on `POST /api/shorten`.

#### [MODIFY] [package.json](file:///c:/Nikks_Workspace/URL-shortener/backend/package.json)
- Add `google-auth-library` dependency.

#### [NEW] [.env.example](file:///c:/Nikks_Workspace/URL-shortener/backend/.env.example)
- Document required variables (`DATABASE_URL`, `REDIS_URL`, `PORT`, `BASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `NODE_ENV`, `FRONTEND_URL`).

---

### 2. Frontend

#### [MODIFY] [index.html](file:///c:/Nikks_Workspace/URL-shortener/frontend/index.html)
- Include Google Identity Services script `<script src="https://accounts.google.com/gsi/client" async defer></script>`.

#### [NEW] [AuthContext.jsx](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/context/AuthContext.jsx)
- React context managing `user`, `loading`, `loginWithGoogle`, `loginWithPassword`, `registerWithPassword`, `logout`.
- Automatically calls `/api/auth/me` on initial load (with `credentials: 'include'`) to restore session.

#### [MODIFY] [AuthModal.jsx](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/components/AuthModal.jsx)
- Integrate Google Identity Services "Continue with Google" button with official branding and fallback custom trigger.
- Connect existing Sign In / Sign Up form to backend endpoints (`/api/auth/login`, `/api/auth/register`).
- Add user-friendly loading state, error alert banners, and input validation.

#### [MODIFY] [Nav.jsx](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/components/Nav.jsx)
- Display user avatar / name and "Log Out" button when logged in.
- Display "Sign In" / "Sign Up" button when logged out.

#### [MODIFY] [App.jsx](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/App.jsx) & [main.jsx](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/main.jsx)
- Wrap application with `AuthProvider`.
- Pass authentication context down as needed.

#### [MODIFY] [App.css](file:///c:/Nikks_Workspace/URL-shortener/frontend/src/App.css)
- Add styles for Google button wrapper, divider, user avatar badge in Nav, logout dropdown, and alert banners in the auth modal.

#### [NEW] [.env.example](file:///c:/Nikks_Workspace/URL-shortener/frontend/.env.example)
- Document frontend variables (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`).

---

## Verification Plan

### Automated / Syntax & Build Verification
1. Install backend dependencies (`google-auth-library`).
2. Run frontend build (`npm run build` in `frontend/`) to ensure no bundling/syntax errors.
3. Test backend syntax and startup (`node -c src/...` and test running the server).

### Manual Verification Flow
1. **Google OAuth Button & Initialization**:
   - Open frontend at `http://localhost:5173`.
   - Click "Sign in" / "Sign up" to open `AuthModal`.
   - Verify Google Identity Services initializes and renders the "Continue with Google" button.
2. **New User Google Login**:
   - Complete Google login prompt.
   - Verify backend verifies credential with Google and creates new user in `users` table.
   - Verify HttpOnly `auth_token` cookie is set and user state is reflected in UI.
3. **Session Persistence**:
   - Refresh the page and verify `GET /api/auth/me` restores user state.
4. **Existing User Google Login & Account Linking**:
   - Test logging in again with Google. Verify existing user is found and no duplicates created.
   - Test creating an account with email/password, then logging in with Google using that same email; verify account links smoothly.
5. **Logout**:
   - Click "Log Out" in Nav.
   - Verify cookie is cleared, user state reverts to logged out.
6. **Protected / Optional Routes**:
   - Shorten URL while logged in; verify URL is linked to `user_id`.
   - Shorten URL while logged out; verify anonymous shortening still works flawlessly.
