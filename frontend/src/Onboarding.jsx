import { useState } from "react";
import "./onboarding.css";

const GOALS = [
  { id: "website",  icon: "🌐", label: "Website",       desc: "Marketing, landing, or business site" },
  { id: "store",    icon: "🛒", label: "Online Store",   desc: "Sell products or services" },
  { id: "blog",     icon: "📰", label: "Blog",           desc: "Articles, news, or editorial content" },
  { id: "portfolio",icon: "💼", label: "Portfolio",      desc: "Showcase your work and projects" },
  { id: "app",      icon: "⚡", label: "Web App",        desc: "Dashboard, SaaS, or internal tool" },
  { id: "other",    icon: "✦",  label: "Something else", desc: "I'll figure it out as I go" },
];

const STARTS = [
  { id: "template", icon: "🎨", label: "Start from a template", desc: "Pick from 50+ industry-specific designs" },
  { id: "ai",       icon: "✦",  label: "Generate with AI",      desc: "Describe what you want to build" },
  { id: "blank",    icon: "⬜", label: "Blank canvas",          desc: "Start from scratch with full control" },
];

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(null);
  const [start, setStart] = useState(null);

  const firstName = user?.name?.split(" ")[0] || "there";

  const handleFinish = () => {
    onComplete({ goal, start });
  };

  return (
    <div className="ob-root">
      <div className="ob-header">
        <div className="ob-logo">
          <span className="ob-logo-mark">B</span>
          <span className="ob-logo-text">BuildX</span>
        </div>
        <div className="ob-steps">
          <div className={`ob-step-dot${step >= 1 ? " done" : ""}`} />
          <div className="ob-step-line" />
          <div className={`ob-step-dot${step >= 2 ? " done" : ""}`} />
        </div>
      </div>

      <div className="ob-body">
        {step === 1 && (
          <div className="ob-card" style={{ animation: "bx-slide-up 0.3s ease" }}>
            <div className="ob-welcome">
              <span className="ob-wave">👋</span>
              <h1>Welcome to BuildX, {firstName}!</h1>
              <p>Let's get you set up. What do you want to build?</p>
            </div>
            <div className="ob-options-grid">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  className={`ob-option${goal === g.id ? " selected" : ""}`}
                  onClick={() => setGoal(g.id)}
                >
                  <span className="ob-option-icon">{g.icon}</span>
                  <span className="ob-option-label">{g.label}</span>
                  <span className="ob-option-desc">{g.desc}</span>
                </button>
              ))}
            </div>
            <button
              className="ob-next-btn"
              disabled={!goal}
              onClick={() => setStep(2)}
            >
              Continue
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="ob-card" style={{ animation: "bx-slide-up 0.3s ease" }}>
            <div className="ob-welcome">
              <h1>How would you like to start?</h1>
              <p>You can always change this later.</p>
            </div>
            <div className="ob-starts-grid">
              {STARTS.map(s => (
                <button
                  key={s.id}
                  className={`ob-start-option${start === s.id ? " selected" : ""}`}
                  onClick={() => setStart(s.id)}
                >
                  <span className="ob-start-icon">{s.icon}</span>
                  <div>
                    <div className="ob-start-label">{s.label}</div>
                    <div className="ob-start-desc">{s.desc}</div>
                  </div>
                  <div className="ob-start-check">
                    {start === s.id && <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                  </div>
                </button>
              ))}
            </div>
            <div className="ob-footer-row">
              <button className="ob-back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="ob-next-btn" disabled={!start} onClick={handleFinish}>
                Go to Dashboard
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
