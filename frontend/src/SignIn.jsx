import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE as API } from "./api.js";

const FEATURES = [
  { icon: "✦", text: "Pixel-perfect visual drag & drop canvas" },
  { icon: "⚡", text: "AI-assisted section & layout generator" },
  { icon: "🎨", text: "50+ pre-built production templates" },
  { icon: "🚀", text: "One-click instant worldwide deployment" },
];

export default function SignIn({ onAuth, goToSignUp }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
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
        if (onAuth) onAuth(data.payload.token, data.payload.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Unable to connect to the authentication service. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email above first to receive password reset instructions.");
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
        alert("Password reset instructions sent. Please check your email.");
        return;
      }

      setError(data?.message || "Password reset is not configured yet. Please contact support.");
    } catch {
      setError("Password reset service is temporarily unavailable.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#07070c] text-[#f0f0ff] selection:bg-indigo-500 selection:text-white">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex w-[460px] shrink-0 bg-[#0c0c16] border-r border-white/[0.08] flex-col p-12 relative overflow-hidden justify-between">
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <span className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
            B
          </span>
          <span className="text-xl font-bold tracking-tight text-white">BuildX</span>
        </Link>

        <div className="my-auto relative z-10">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 mb-4">
              Visual No-Code Platform
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.15] text-white tracking-tight mb-3">
              Build websites<br />without limits.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Design visually, bind data, connect AI, and publish directly to production.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 shrink-0 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-300 text-xs">
                  {f.icon}
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial snippet */}
          <div className="mt-12 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "BuildX replaced our entire staging-to-production website build cycle. It's shockingly fast."
            </p>
            <div className="flex items-center gap-2 mt-3 text-[11px]">
              <span className="font-semibold text-white">Alex Rivera</span>
              <span className="text-slate-400">· VP Design, VectorLab</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 relative z-10">
          © 2026 BuildX. Build websites visually.
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-300">Enter your credentials to access your workspaces</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs leading-relaxed animate-[bx-pop_0.15s_ease-out]">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signin-email" className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                autoFocus
                className="w-full bg-[#10101a] border border-white/[0.1] hover:border-white/[0.2] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/25 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#10101a] border border-white/[0.1] hover:border-white/[0.2] focus:border-indigo-500 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/25 outline-none transition"
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-12 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In to BuildX"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-slate-400 before:flex-1 before:h-px before:bg-white/[0.08] after:flex-1 after:h-px after:bg-white/[0.08]">
            OR
          </div>

          <button
            type="button"
            className="w-full h-11 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
            onClick={() => {
              window.location.href = `${API}/auth/google`;
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              onClick={goToSignUp}
              className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition"
            >
              Create Account Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
