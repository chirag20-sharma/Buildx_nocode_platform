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
    <div className="min-h-screen flex bg-[#f8f8fb] text-[#0f0f1a] selection:bg-indigo-500 selection:text-white">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex w-[460px] shrink-0 bg-white border-r border-black/[0.07] flex-col p-12 relative overflow-hidden justify-between shadow-sm">
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <span className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-[0_4px_16px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
            B
          </span>
          <span className="text-xl font-bold tracking-tight text-[#0f0f1a]">BuildX</span>
        </Link>

        <div className="my-auto relative z-10">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 mb-4">
              Visual No-Code Platform
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.15] text-[#0f0f1a] tracking-tight mb-3">
              Build websites<br />without limits.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Design visually, bind data, connect AI, and publish directly to production.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-7 h-7 shrink-0 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center text-indigo-600 text-xs">
                  {f.icon}
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial snippet */}
          <div className="mt-12 p-4 rounded-xl bg-[#f4f4fa] border border-black/[0.07] shadow-xs">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "BuildX replaced our entire staging-to-production website build cycle. It's shockingly fast."
            </p>
            <div className="flex items-center gap-2 mt-3 text-[11px]">
              <span className="font-semibold text-[#0f0f1a]">Alex Rivera</span>
              <span className="text-slate-500">· VP Design, VectorLab</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          © 2026 BuildX. Build websites visually.
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f0f1a] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access your workspaces</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs leading-relaxed animate-[bx-pop_0.15s_ease-out]">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signin-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
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
                className="w-full bg-white border border-black/[0.12] hover:border-black/[0.22] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-[#0f0f1a] placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
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
                  className="w-full bg-white border border-black/[0.12] hover:border-black/[0.22] focus:border-indigo-500 rounded-xl px-4 py-3 pr-12 text-sm text-[#0f0f1a] placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition shadow-xs"
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-xs font-semibold text-slate-400 hover:text-[#0f0f1a] transition cursor-pointer"
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
              className="w-full mt-2 h-12 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.45)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In to BuildX"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              onClick={goToSignUp}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Create Account Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
