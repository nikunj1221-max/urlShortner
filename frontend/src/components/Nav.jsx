import { useAuth } from '../context/AuthContext';

export default function Nav({ onOpenAuth, onOpenAllStats }) {
  const { user, loading, logout } = useAuth();

  return (
    <nav>
      <div className="logo">
        <span className="logo-mark">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8"
              stroke="#EAE4D6"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path d="M4 12v6M20 12v6" stroke="#EAE4D6" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        codedUrl
      </div>

      <div className="nav-links">
        <a href="#demo">Product</a>
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
      </div>

      <div className="nav-user-actions">
        {loading ? (
          <div className="nav-loading-pill">...</div>
        ) : user ? (
          <div className="nav-profile-badge">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name || 'User Avatar'}
                className="user-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="user-display-name">
              {user.name ? user.name.split(' ')[0] : user.email.split('@')[0]}
            </span>
            <button
              onClick={logout}
              className="btn-logout"
              title="Sign Out"
              aria-label="Sign Out"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="nav-auth-buttons">
            <button
              onClick={(e) => {
                e.preventDefault();
                onOpenAuth();
              }}
              className="nav-cta"
              style={{ background: 'black', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Sign in / Sign up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}