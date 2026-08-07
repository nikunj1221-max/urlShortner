const STEPS = [
  {
    num: "01",
    title: "Paste the long link",
    body: "Drop in any URL — a product page, a doc, a deep link into your app.",
    visual: "…/collections?ref=newsletter",
  },
  {
    num: "02",
    title: "Choose how it snips",
    body: "Keep the random slug, or set your own back-half and expiry.",
    visual: "codedUrl/x9K2p",
  },
  {
    num: "03",
    title: "Share and watch it move",
    body: "Every click is logged the moment it happens, visible on your dashboard.",
    visual: "↳ 1,204 clicks today",
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="section-head reveal">
        <div className="section-eyebrow">The process</div>
        <h2>Three steps, every time</h2>
        <p>Nothing changes based on volume — one link, or ten thousand.</p>
      </div>
      <div className="steps">
        {STEPS.map((s) => (
          <div className="step reveal" key={s.num}>
            <div className="step-num display">{s.num}</div>
            <div className="step-body">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
            <div className="step-visual mono">{s.visual}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
