import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GOALS = [
  { id: "website",   icon: "🌐", label: "Marketing Website", desc: "Landing page, agency, or company portal" },
  { id: "store",     icon: "🛒", label: "Online Store",      desc: "Sell physical goods or digital products" },
  { id: "blog",      icon: "📰", label: "Editorial & Blog",  desc: "Publications, newsletters, and news" },
  { id: "portfolio", icon: "💼", label: "Creative Portfolio",desc: "Showcase personal work & case studies" },
  { id: "app",       icon: "⚡", label: "Web Application",   desc: "SaaS platform, portal, or internal tools" },
  { id: "other",     icon: "✦",  label: "Custom Project",    desc: "Something unique and custom" },
];

const STARTS = [
  { id: "template", icon: "🎨", label: "Start with a Curated Template", desc: "Pick from 50+ professionally architected industry templates" },
  { id: "ai",       icon: "⚡", label: "Generate with BuildX AI",        desc: "Describe your concept and let AI assemble the layout in seconds" },
  { id: "blank",    icon: "⬜", label: "Start from a Blank Canvas",      desc: "Full manual control with free-form positioning and grid guides" },
];

export default function Onboarding({ user, onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(null);
  const [start, setStart] = useState(null);

  const firstName = user?.name ? user.name.split(" ")[0] : "Creator";

  const handleFinish = () => {
    if (onComplete) onComplete({ goal, start });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#07070c] text-[#f0f0ff] flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* ── Top Header ── */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/[0.08] bg-[#0c0c14]/80 backdrop-blur-xl">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <span className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center font-extrabold text-sm text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            B
          </span>
          <span className="text-base font-bold text-white tracking-tight">BuildX</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-white/10 text-slate-400"}`}>
              1
            </span>
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">Project Goal</span>
          </div>
          <div className="w-8 h-px bg-white/15" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-white/10 text-slate-400"}`}>
              2
            </span>
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">Workflow</span>
          </div>
        </div>
      </header>

      {/* ── Main Setup Flow ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {step === 1 && (
          <div className="w-full max-w-2xl flex flex-col gap-8 animate-[bx-pop_0.2s_ease-out]">
            <div className="text-center flex flex-col items-center gap-2">
              <span className="text-4xl mb-1">👋</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome to BuildX, {firstName}!
              </h1>
              <p className="text-sm text-slate-300">
                Let's personalize your workspace. What kind of project are you building today?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  className={`bg-[#0d0d16] border rounded-2xl p-5 flex flex-col items-start gap-2.5 cursor-pointer transition-all duration-200 text-left hover:-translate-y-1 ${
                    goal === g.id
                      ? "border-indigo-500 bg-indigo-600/15 shadow-[0_0_25px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/50"
                      : "border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.03]"
                  }`}
                  onClick={() => setGoal(g.id)}
                >
                  <span className="text-3xl">{g.icon}</span>
                  <div>
                    <span className="text-sm font-bold text-white block">{g.label}</span>
                    <span className="text-xs text-slate-400 mt-1 block leading-relaxed">{g.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                onClick={() => { setGoal("website"); setStep(2); }}
              >
                Skip for now
              </button>
              <button
                className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center gap-2 transition shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                disabled={!goal}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-2xl flex flex-col gap-8 animate-[bx-pop_0.2s_ease-out]">
            <div className="text-center flex flex-col items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How would you like to start?
              </h1>
              <p className="text-sm text-slate-300">
                You can always switch templates or generate more components later.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {STARTS.map((s) => (
                <button
                  key={s.id}
                  className={`bg-[#0d0d16] border rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 text-left hover:-translate-y-0.5 ${
                    start === s.id
                      ? "border-indigo-500 bg-indigo-600/15 shadow-[0_0_25px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/50"
                      : "border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.03]"
                  }`}
                  onClick={() => setStart(s.id)}
                >
                  <span className="text-3xl p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">{s.icon}</span>
                  <div className="flex-1">
                    <span className="text-base font-bold text-white block">{s.label}</span>
                    <span className="text-xs text-slate-400 mt-1 block leading-relaxed">{s.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${start === s.id ? "border-indigo-500 bg-indigo-600" : "border-white/20"}`}>
                    {start === s.id && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center gap-2 transition shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                disabled={!start}
                onClick={handleFinish}
              >
                Enter Studio Workspace →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
