import FoldDemo from './FoldDemo';

export default function Hero() {
  return (<>
  <div className='main1'>
     
    <section className="hero">
      <div className="hero-art">

        <div className="hero-copy pt-333">
          {/* <div className="eyebrow mono pt-0 pb-22">Now snipping 4.2M links/day</div> */}
          <h1 className="display">
            <span className="l1">PASTE IT.</span>
            <span className="l2">SNIP IT SHORT.</span>
          </h1>
          <p className="sub">
            Any link, any length. codedUrl tears it down to something worth sharing — with analytics, a
            QR code, and zero expiry, free.
          </p>

          <div className="hero-actions">
            <button 
              className="btn-primary" 
              type="button"
              onClick={() => {
                const input = document.getElementById('url-input');
                if (input) {
                  input.focus();
                  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              Now snip it
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a href="#how" className="btn-ghost">
              See how it works
            </a>
          </div>

         
          {/* <div className="stat-row">
            <div className="stat">
              <div className="n display">4.2M</div>
              <div className="l">Links snipped / day</div>
            </div>
            <div className="stat">
              <div className="n display">38ms</div>
              <div className="l">Avg. redirect</div>
            </div>
            <div className="stat">
              <div className="n display">99.99%</div>
              <div className="l">Uptime, 3yr</div>
            </div>
          </div> */}

        </div>
      </div>
    </section>
<section className='mvp'>
       <FoldDemo />

    </section>
   
    </div>
    </>
  );
}
