import "./landing.css";

const FEATURES = [
  { icon: "✦", title: "Visual Canvas", desc: "Drag, drop, resize, and align elements with pixel-perfect precision. Free positioning on an infinite canvas." },
  { icon: "⚡", title: "AI Builder", desc: "Describe what you want to build. BuildX AI generates pages, components, and layouts instantly." },
  { icon: "🎨", title: "50+ Templates", desc: "Start from a professionally designed template for any industry — SaaS, e-commerce, blog, restaurant, and more." },
  { icon: "🗄", title: "No-Code Backend", desc: "Create databases, authentication, and APIs visually. No SQL, no server config, no code required." },
  { icon: "📱", title: "Responsive Design", desc: "Design for desktop, tablet, and mobile independently. Every breakpoint, fully customizable." },
  { icon: "🚀", title: "One-Click Deploy", desc: "Publish your website instantly. Custom domains, SSL, and CDN included." },
];

const TEMPLATES = [
  { name: "Guitar Store",       cat: "E-commerce", color: "#f59e0b", bg: "linear-gradient(135deg,#1c1008,#2d1a06)" },
  { name: "SaaS Landing",       cat: "SaaS",       color: "#6366f1", bg: "linear-gradient(135deg,#1e1b4b,#0f0f1a)" },
  { name: "Editorial Blog",     cat: "Blog",       color: "#ef4444", bg: "linear-gradient(135deg,#0f172a,#1e293b)" },
  { name: "Designer Portfolio", cat: "Portfolio",  color: "#22d3ee", bg: "linear-gradient(135deg,#09090b,#0a0e1a)" },
  { name: "Restaurant",         cat: "Restaurant", color: "#f59e0b", bg: "linear-gradient(135deg,#0c0a08,#1a1208)" },
  { name: "Admin Dashboard",    cat: "Dashboard",  color: "#34d399", bg: "linear-gradient(135deg,#0a0f0a,#0f1a14)" },
];

const STEPS = [
  { n: "01", title: "Choose a template or start blank", desc: "Pick from 50+ industry-specific templates or start from a blank canvas." },
  { n: "02", title: "Design visually", desc: "Drag, drop, and style every element. Use AI to generate sections instantly." },
  { n: "03", title: "Connect your data", desc: "Create collections, bind data to components, and add authentication — no code." },
  { n: "04", title: "Publish", desc: "Deploy with one click. Your site is live on a fast global CDN." },
];

export default function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <span className="lp-logo-mark">B</span>
            <span className="lp-logo-text">BuildX</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#how">How it works</a>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-btn-ghost" onClick={onSignIn}>Sign in</button>
            <button className="lp-btn-primary" onClick={onGetStarted}>Start free</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-badge">
          <span className="lp-hero-badge-dot" />
          Now with AI generation
        </div>
        <h1 className="lp-hero-title">
          Build websites and<br />
          <span className="lp-hero-gradient">web apps visually.</span>
        </h1>
        <p className="lp-hero-sub">
          Design with Figma-level freedom. Build with Wix-level simplicity.<br />
          Connect a backend without writing a single line of code.
        </p>
        <div className="lp-hero-actions">
          <button className="lp-btn-primary lp-btn-lg" onClick={onGetStarted}>
            Start building free
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
          <button className="lp-btn-outline" onClick={onSignIn}>Sign in to your account</button>
        </div>
        <p className="lp-hero-note">Free forever · No credit card required · Deploy in minutes</p>

        {/* Product preview mockup */}
        <div className="lp-hero-preview">
          <div className="lp-preview-bar">
            <span /><span /><span />
            <div className="lp-preview-url">buildx.app/editor</div>
          </div>
          <div className="lp-preview-body">
            <div className="lp-preview-sidebar">
              <div className="lp-ps-label">Components</div>
              {["Section","Heading","Button","Image Grid","Card","Form"].map(c => (
                <div key={c} className="lp-ps-item"><span />{c}</div>
              ))}
            </div>
            <div className="lp-preview-canvas">
              <div className="lp-pc-navbar" />
              <div className="lp-pc-hero">
                <div className="lp-pc-h1" />
                <div className="lp-pc-h2" />
                <div className="lp-pc-btn" />
              </div>
              <div className="lp-pc-cards">
                <div className="lp-pc-card" /><div className="lp-pc-card" /><div className="lp-pc-card" />
              </div>
            </div>
            <div className="lp-preview-props">
              <div className="lp-pp-label">Properties</div>
              <div className="lp-pp-row"><span />Columns</div>
              <div className="lp-pp-row"><span />Gap</div>
              <div className="lp-pp-row"><span />Aspect</div>
              <div className="lp-pp-row"><span />Images</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-label">Features</div>
          <h2 className="lp-section-title">Everything you need to build<br />a real web application</h2>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates ── */}
      <section className="lp-section lp-section-dark" id="templates">
        <div className="lp-section-inner">
          <div className="lp-section-label">Templates</div>
          <h2 className="lp-section-title">Start from a real website,<br />not a generic layout</h2>
          <p className="lp-section-sub">Every template has its own information architecture, components, and visual identity — not just different text.</p>
          <div className="lp-templates-grid">
            {TEMPLATES.map(t => (
              <div key={t.name} className="lp-template-card" style={{ background: t.bg }}>
                <div className="lp-template-preview">
                  <div className="lp-tp-nav" style={{ background: t.color + "44" }} />
                  <div className="lp-tp-hero" />
                  <div className="lp-tp-cards">
                    <div /><div /><div />
                  </div>
                </div>
                <div className="lp-template-info">
                  <span className="lp-template-cat" style={{ color: t.color }}>{t.cat}</span>
                  <span className="lp-template-name">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="lp-btn-outline lp-center-btn" onClick={onGetStarted}>Browse all templates</button>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section" id="how">
        <div className="lp-section-inner">
          <div className="lp-section-label">How it works</div>
          <h2 className="lp-section-title">From idea to live website<br />in four steps</h2>
          <div className="lp-steps">
            {STEPS.map(s => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2>Ready to build something?</h2>
          <p>Join thousands of creators, founders, and teams building with BuildX.</p>
          <button className="lp-btn-primary lp-btn-lg" onClick={onGetStarted}>
            Start building free
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">
            <span className="lp-logo-mark">B</span>
            <span className="lp-logo-text">BuildX</span>
          </div>
          <p>© 2025 BuildX. Build websites without code.</p>
        </div>
      </footer>
    </div>
  );
}
