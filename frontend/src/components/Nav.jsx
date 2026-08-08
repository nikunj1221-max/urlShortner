export default function Nav({ onOpenAuth, onOpenAllStats }) {
  return (
    <nav >
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
      <div  >    
             {/* <button 
            //  onClick={(e) => { e.preventDefault(); onOpenAllStats(); }} 
             className="nav-cta" style={{ background: 'black', border: 'none', cursor: 'pointer', fontFamily: 'inherit',  marginRight:'10px'}}>
        Link Stats
      </button> */}
      <button onClick={(e) => { e.preventDefault(); onOpenAuth(); }} className="nav-cta" style={{ background: 'black', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        Sign up
      </button>
      </div>

    </nav>
  );
}