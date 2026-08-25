import { useState } from "react";
import "./auth.css";

const API = "http://localhost:5000/api/v1";

const FEATURES = [
  { icon: "✦", text: "Visual drag-and-drop canvas" },
  { icon: "⚡", text: "AI-powered page generation" },
  { icon: "🎨", text: "50+ professional templates" },
  { icon: "🚀", text: "One-click publish & deploy" },
];

export default function SignIn({ onAuth, goToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) {
      return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.payload.token);
        onAuth(data.payload.token, data.payload.user);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first to reset your password.");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setError("");
        alert("Password reset link sent. Check your email.");
        return;
      }

      if (res.status === 404 || !data?.success) {
        setError("Password reset is not configured yet. Add the forgot-password backend route and SMTP settings to enable it.");
        return;
      }

      setError(data.message || "Unable to send password reset email.");
    } catch {
      setError("Password reset is not configured yet. Add a forgot-password endpoint and email provider setup in the backend.");
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
          <p>Design visually, connect a backend, and publish — all in one place.</p>
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
            <h2>Welcome back</h2>
            <p>Sign in to continue building</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="field-group">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div className="field-group">
            <label htmlFor="signin-password">Password</label>
            <div className="password-with-toggle">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <button type="button" className="auth-link-btn" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>

          <div className="auth-divider">OR</div>

          <div className="auth-google-note">
            Google OAuth is not configured in this backend yet. To enable it, add Google client credentials, callback URL, and the OAuth route on the server.
          </div>

          <p className="auth-switch">
            Don&apos;t have an account? <button type="button" onClick={goToSignUp}>Sign Up</button>
          </p>
        </form>
      </div>
    </div>
  );
}
