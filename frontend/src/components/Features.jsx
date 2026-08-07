const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 12a8 8 0 1 1 8 8" stroke="#17140F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 12l4-4M4 12l4 4" stroke="#17140F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Live click analytics",
    body: "See where every click comes from — device, country, referrer — updated in real time.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="#17140F" strokeWidth="1.8" />
        <path d="M9 12h6M12 9v6" stroke="#17140F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Custom back-halves",
    body: "Pick the slug yourself — codedUrl/launch reads better than a random string.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke="#17140F" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="#17140F" strokeWidth="1.8" />
      </svg>
    ),
    title: "Never expires",
    body: "A folded link works for as long as you need it. No surprise expirations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l2.2 6.6H21l-5.4 4 2.1 6.6L12 15.2 6.3 19.2l2.1-6.6L3 8.6h6.8z"
          stroke="#17140F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "QR, generated free",
    body: "Every short link ships with a scannable QR code — for print, packaging, slides.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7z" stroke="#17140F" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    title: "Malware screening",
    body: "Every destination is checked before it goes live, and rechecked after.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 17V7a2 2 0 0 1 2-2h6l4 4v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
          stroke="#17140F"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 13h6" stroke="#17140F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "API & bulk import",
    body: "Snip a CSV of a thousand links at once, or wire it in with three lines of code.",
  },
];

export default function Features() {
  return (
    <section id="features">
      <div className="section-head reveal">
        <div className="section-eyebrow">Why codedUrl</div>
        <h2>Built for links that matter</h2>
        <p>Every snip comes with the details you'd otherwise stitch together yourself.</p>
      </div>
      <div className="features">
        {FEATURES.map((f) => (
          <div className="feature-card reveal" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
