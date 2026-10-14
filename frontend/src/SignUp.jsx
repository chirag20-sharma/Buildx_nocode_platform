import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE as API } from "./api.js";

const FEATURES = [
  { icon: "✦", text: "Pixel-perfect visual drag & drop canvas" },
  { icon: "⚡", text: "AI-assisted section & layout generator" },
  { icon: "🎨", text: "50+ pre-built production templates" },
  { icon: "🚀", text: "One-click instant worldwide deployment" },
];

export default function SignUp({ onAuth, goToSignIn }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.payload.token);
        if (onAuth) onAuth(data.payload.token, data.payload.user, true);
        navigate("/onboarding");
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch {
      setError("Unable to connect to authentication server. Please check your connection.");
    } finally {
      setLoading(false);
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
              Get Started Free
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.15] text-[#0f0f1a] tracking-tight mb-3">
              Start building<br />for free.
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Join thousands of creators, agencies, and founders deploying beautiful websites with BuildX.
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

          <div className="mt-12 p-4 rounded-xl bg-[#f4f4fa] border border-black/[0.07] shadow-xs">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "We built and launched our entire product site in one afternoon without touching Webpack or servers."
            </p>
            <div className="flex items-center gap-2 mt-3 text-[11px]">
              <span className="font-semibold text-[#0f0f1a]">Elena Rostova</span>
              <span className="text-slate-500">· Founder, Aura Design Studio</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          © 2026 BuildX. Free forever · No credit card required.
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f0f1a] tracking-tight mb-2">Create Account</h2>
            <p className="text-sm text-slate-500">Start building in 30 seconds — free forever</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs leading-relaxed animate-[bx-pop_0.15s_ease-out]">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Connor"
                required
                autoFocus
                className="w-full bg-white border border-black/[0.12] hover:border-black/[0.22] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-[#0f0f1a] placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-white border border-black/[0.12] hover:border-black/[0.22] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-[#0f0f1a] placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="w-full bg-white border border-black/[0.12] hover:border-black/[0.22] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-[#0f0f1a] placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-12 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.45)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Free Account →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/signin"
              onClick={goToSignIn}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
