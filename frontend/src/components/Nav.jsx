export default function Nav() {
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
      <a href="#demo" className="nav-cta">
        Start snipping
      </a>
    </nav>
  );
}