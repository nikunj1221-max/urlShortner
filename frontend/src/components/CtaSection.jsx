export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-box reveal">
        <h2 className="display">Your next link is one snip away.</h2>
        <p>Free for your first 10 links — no card required.</p>
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
      </div>
    </section>
  );
}
