import { useState } from "react";
import "./auth.css";

const API = "http://localhost:5000/api/v1";

export default function SignIn({ onAuth, goToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.payload.token);
        onAuth(data.payload.token, data.payload.user);
      } else {
        setError(data.message || "Invalid credentials");
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
          <h1>Build websites<br />without code.</h1>
          <p>Drag, drop, and launch — no developer needed.</p>
        </div>
        <div className="auth-dots">
          <span /><span /><span />
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign in"}
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button type="button" onClick={goToSignUp}>Create one</button>
          </p>
        </form>
      </div>
    </div>
  );
}
