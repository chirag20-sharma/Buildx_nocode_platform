import { useState } from "react";
import "./auth.css";

const API = "http://localhost:5000/api/v1";

const FEATURES = [
  { icon: "✦", text: "Visual drag-and-drop canvas" },
  { icon: "⚡", text: "AI-powered page generation" },
  { icon: "🎨", text: "50+ professional templates" },
  { icon: "🚀", text: "One-click publish & deploy" },
];

export default function SignUp({ onAuth, goToSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.payload.token);
        onAuth(data.payload.token, data.payload.user, true);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch {
      setError("Unable to connect. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo-mark">B</span>
          <span className="auth-logo-text">BuildX</span>
        </div>
        <div className="auth-tagline">
          <h1>Start building<br />for free.</h1>
          <p>Join thousands of creators shipping faster with BuildX.</p>
        </div>
        <div className="auth-features">
          {FEATURES.map((f) => (
            <div key={f.text} className="auth-feature-item">
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
        <div className="auth-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-header">
            <h2>Create account</h2>
            <p>Get started — it's free, no credit card needed</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label>Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              required
              autoFocus
            />
          </div>

          <div className="field-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Create account"}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" onClick={goToSignIn}>Sign in</button>
          </p>
        </form>
      </div>
    </div>
  );
}
