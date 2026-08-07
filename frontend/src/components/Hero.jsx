import FoldDemo from './FoldDemo';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-art">
        <div className="paper-sheet sheet-1 torn-top float-slow" style={{ "--r": "-9deg" }} />
        <div className="paper-sheet sheet-2 torn-top float-med" style={{ "--r": "5deg" }} />
        <div className="paper-sheet sheet-3 float-slow" style={{ "--r": "0deg" }} />
        <div className="paper-sheet sheet-4 float-med" style={{ "--r": "0deg" }} />

        <div className="blob b1 float-fast">
          <svg viewBox="0 0 100 100">
            <path
              d="M62,8 C82,4 96,24 92,44 C88,66 68,86 46,84 C24,82 6,64 8,42 C10,20 30,4 50,6 C54,7 58,7 62,8 Z"
              fill="#DED4BE"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="blob b2 float-med">
          <svg viewBox="0 0 100 100">
            <path
              d="M60,10 C80,14 90,36 84,54 C78,72 56,88 38,80 C20,72 8,50 16,32 C24,14 44,6 60,10 Z"
              fill="#F2EDE0"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="blob b3 float-slow">
          <svg viewBox="0 0 100 100">
            <path
              d="M58,6 C78,10 92,30 88,50 C84,72 62,90 42,84 C22,78 6,58 12,38 C18,16 40,4 58,6 Z"
              fill="#E38066"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="blob b4 float-fast">
          <svg viewBox="0 0 100 100">
            <path
              d="M64,10 C84,16 94,38 86,56 C78,76 54,90 36,80 C18,70 8,48 18,30 C28,12 48,6 64,10 Z"
              fill="#A6CEBD"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="blob b5 float-med">
          <svg viewBox="0 0 100 100">
            <path
              d="M60,8 C80,12 92,32 86,52 C80,72 58,88 40,82 C22,76 8,56 14,36 C20,16 42,4 60,8 Z"
              fill="#F2EDE0"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className="blob b6 float-slow">
          <svg viewBox="0 0 100 100">
            <path
              d="M58,10 C76,14 88,32 82,50 C76,70 56,86 38,80 C20,74 8,54 14,36 C20,18 42,6 58,10 Z"
              fill="#B6B1E3"
              stroke="#17140F"
              strokeWidth="3"
            />
          </svg>
        </div>

        <svg className="doodle d-scissors float-fast" viewBox="0 0 40 40" fill="none">
          <circle cx="8" cy="30" r="5" stroke="#17140F" strokeWidth="2" />
          <circle cx="8" cy="10" r="5" stroke="#17140F" strokeWidth="2" />
          <path d="M12 13 L34 34M12 27 L34 6" stroke="#17140F" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg className="doodle d-spiral float-slow" viewBox="0 0 60 60" fill="none">
          <path
            d="M30 30 C30 20 40 20 40 30 C40 42 24 42 24 28 C24 12 44 12 44 28"
            stroke="#17140F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg className="doodle d-squiggle float-med" viewBox="0 0 140 30" fill="none">
          <path
            d="M2 15 C12 2 22 28 32 15 C42 2 52 28 62 15 C72 2 82 28 92 15 C102 2 112 28 122 15 C128 10 132 12 136 15"
            stroke="#17140F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg className="doodle d-hook float-fast" viewBox="0 0 40 40" fill="none">
          <path
            d="M8 30 C4 18 12 6 24 8 C34 10 34 20 26 22"
            stroke="#17140F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg className="doodle d-scribble2 float-slow" viewBox="0 0 100 40" fill="none">
          <path
            d="M4 20 Q14 4 24 20 T44 20 T64 20 T84 20 T100 20"
            stroke="#17140F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="hero-copy pt-333">
          <div className="eyebrow mono pt-0 pb-22">Now snipping 4.2M links/day</div>
          <h1 className="display">
            <span className="l1">PASTE IT.</span>
            <span className="l2">SNIP IT SHORT.</span>
          </h1>
          <p className="sub">
            Any link, any length. codedUrl tears it down to something worth sharing — with analytics, a
            QR code, and zero expiry, free.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" type="button">
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

          <FoldDemo />

          <div className="stat-row">
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
          </div>
        </div>
      </div>
    </section>
  );
}
