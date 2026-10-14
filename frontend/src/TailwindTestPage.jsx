import { useState } from "react";
import { Link } from "react-router-dom";

export default function TailwindTestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f8fb] text-[#0f0f1a] font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* ── Top Header / Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.07] px-6 lg:px-12 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-extrabold text-white text-base shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
              B
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#0f0f1a] tracking-tight">BuildX</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Tailwind v4 Test Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Independent Styling & Utility Verification Page</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-black/[0.05] transition"
            >
              ← Landing
            </Link>
            <Link
              to="/signup"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-black/[0.05] transition"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-black/[0.05] transition"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-16">
        {/* Hero Banner with Responsive Indicator */}
        <section className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-500/30 rounded-3xl p-8 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Breakpoint:{" "}
              <span className="font-mono text-white">
                <span className="inline sm:hidden">Mobile (&lt;640px)</span>
                <span className="hidden sm:inline md:hidden">SM (640px - 767px)</span>
                <span className="hidden md:inline lg:hidden">MD / Tablet (768px - 1023px)</span>
                <span className="hidden lg:inline xl:hidden">LG / Laptop (1024px - 1279px)</span>
                <span className="hidden xl:inline">XL / Desktop (1280px+)</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Tailwind CSS v4{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Diagnostic & Test Suite
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              This page isolates and tests typography, color tokens, surface elevations, responsive flex/grid layouts,
              interactive states, and Tailwind v4 arbitrary bracket utilities. If this page renders accurately, the
              Vite + Tailwind plugin integration is working.
            </p>
          </div>
        </section>

        {/* ── 1. TYPOGRAPHY TEST ── */}
        <section className="space-y-6 bg-[#0c0c16] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">01.</span> Typography &amp; Hierarchy
            </h2>
            <p className="text-xs text-slate-400 mt-1">Font weights, responsive font sizes, alignments, line heights, and muted palettes.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Font Size Scale</p>
              <div className="text-xs text-slate-300">text-xs (12px): The quick brown fox jumps over the lazy dog.</div>
              <div className="text-sm text-slate-300">text-sm (14px): The quick brown fox jumps over the lazy dog.</div>
              <div className="text-base text-slate-200">text-base (16px): The quick brown fox jumps over the lazy dog.</div>
              <div className="text-lg text-slate-100 font-semibold">text-lg (18px): The quick brown fox jumps over the lazy dog.</div>
              <div className="text-xl text-white font-bold">text-xl (20px): The quick brown fox jumps over the lazy dog.</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">text-2xl / text-3xl: Responsive Section Heading</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xs text-slate-400 font-bold mb-1">Left Aligned (text-left)</p>
                <p className="text-xs text-slate-300 text-left leading-relaxed">
                  Design websites with Figma-grade freedom and Wix-grade simplicity.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xs text-slate-400 font-bold mb-1">Center Aligned (text-center)</p>
                <p className="text-xs text-slate-300 text-center leading-relaxed">
                  Design websites with Figma-grade freedom and Wix-grade simplicity.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xs text-slate-400 font-bold mb-1">Right Aligned (text-right)</p>
                <p className="text-xs text-slate-300 text-right leading-relaxed">
                  Design websites with Figma-grade freedom and Wix-grade simplicity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded bg-slate-800 text-slate-400">text-slate-400 (Muted)</span>
              <span className="px-3 py-1 rounded bg-indigo-950 text-indigo-300 font-medium">text-indigo-300 (Accent)</span>
              <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 font-medium">text-purple-300 (Purple)</span>
              <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 font-medium">text-emerald-300 (Success)</span>
              <span className="px-3 py-1 rounded bg-amber-950 text-amber-300 font-medium">text-amber-300 (Warning)</span>
              <span className="px-3 py-1 rounded bg-rose-950 text-rose-300 font-medium">text-rose-300 (Error)</span>
            </div>
          </div>
        </section>

        {/* ── 2. COLORS & SURFACES ── */}
        <section className="space-y-6 bg-[#0c0c16] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">02.</span> Colors, Surfaces &amp; Theme Tokens
            </h2>
            <p className="text-xs text-slate-400 mt-1">Background colors, @theme custom tokens, borders, rounded corners, and gradients.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Default Surface */}
            <div className="bg-[#0e0e18] border border-white/[0.08] rounded-xl p-5 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Surface</span>
                <h3 className="text-sm font-bold text-white">Dark Base Card</h3>
                <p className="text-xs text-slate-400 mt-1">bg-[#0e0e18] with border-white/[0.08]</p>
              </div>
              <div className="mt-4 h-2 w-full bg-white/10 rounded-full" />
            </div>

            {/* Card 2: Brand Theme Token Card */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Brand Accent</span>
                <h3 className="text-sm font-bold text-white">Indigo Elevated</h3>
                <p className="text-xs text-indigo-300/80 mt-1">bg-indigo-950/40 with border-indigo-500/30</p>
              </div>
              <div className="mt-4 h-2 w-full bg-indigo-500 rounded-full" />
            </div>

            {/* Card 3: Gradient Surface */}
            <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 rounded-xl p-5 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Multi-stop Gradient</span>
                <h3 className="text-sm font-bold text-white">Purple / Indigo Blend</h3>
                <p className="text-xs text-purple-200/80 mt-1">bg-gradient-to-br from purple to slate</p>
              </div>
              <div className="mt-4 h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            </div>

            {/* Card 4: High Opacity Contrast */}
            <div className="bg-white/[0.05] border border-white/[0.15] rounded-xl p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Translucent Blur</span>
                <h3 className="text-sm font-bold text-white">Glassmorphism Card</h3>
                <p className="text-xs text-slate-300 mt-1">bg-white/[0.05] with backdrop-blur</p>
              </div>
              <div className="mt-4 h-2 w-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </section>

        {/* ── 3. LAYOUT, GRIDS & SPACING (6-CARD GRID) ── */}
        <section className="space-y-6 bg-[#0c0c16] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400">03.</span> Responsive Grid &amp; Container Width
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                6-card grid testing `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`. Should use full container width.
              </p>
            </div>
            <div className="text-xs font-mono bg-white/[0.05] px-3 py-1 rounded-lg border border-white/[0.08] self-start sm:self-auto text-indigo-300">
              max-w-7xl mx-auto
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "1", title: "Visual Canvas Engine", badge: "Engine", desc: "Drag, drop, snap, and resize elements with absolute coordinate precision.", color: "from-indigo-600/20 to-indigo-400/10", border: "border-indigo-500/30" },
              { id: "2", title: "AI Generation Studio", badge: "AI Gen", desc: "Instantly create landing sections, palettes, and marketing copy via prompts.", color: "from-purple-600/20 to-purple-400/10", border: "border-purple-500/30" },
              { id: "3", title: "50+ Curated Layouts", badge: "Design", desc: "Production templates for SaaS, restaurants, e-commerce stores, and portfolios.", color: "from-pink-600/20 to-rose-400/10", border: "border-pink-500/30" },
              { id: "4", title: "Visual Schema Binding", badge: "Database", desc: "Bind collections, form submissions, and data records with zero SQL code.", color: "from-amber-600/20 to-yellow-400/10", border: "border-amber-500/30" },
              { id: "5", title: "Multi-Breakpoint Controls", badge: "Responsive", desc: "Fine-tune desktop, tablet, and mobile views independently on the canvas.", color: "from-cyan-600/20 to-blue-400/10", border: "border-cyan-500/30" },
              { id: "6", title: "Instant Global Edge CDN", badge: "Deploy", desc: "Publish websites to live public URLs with automatic SSL and caching.", color: "from-emerald-600/20 to-teal-400/10", border: "border-emerald-500/30" },
            ].map((card) => (
              <div
                key={card.id}
                className={`bg-[#0e0e1a] border ${card.border} rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-200 group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      {card.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>Explore Spec</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. INTERACTIVE STATES TEST ── */}
        <section className="space-y-6 bg-[#0c0c16] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">04.</span> Interactive States &amp; Form Controls
            </h2>
            <p className="text-xs text-slate-400 mt-1">Hover, focus-visible, active scaling, disabled states, and dynamic state updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Interactive Buttons */}
            <div className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Button States</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setClickCount((c) => c + 1)}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] focus-visible:ring-2 focus-visible:ring-indigo-400 outline-none transition cursor-pointer"
                >
                  Click Me (Clicks: {clickCount})
                </button>

                <button
                  type="button"
                  className="bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Secondary Outline
                </button>

                <button
                  type="button"
                  disabled
                  className="bg-indigo-600/30 border border-indigo-500/20 text-indigo-300/40 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed opacity-50"
                >
                  Disabled Action
                </button>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Input Focus State</p>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">Test Input Field</label>
                <input
                  type="text"
                  placeholder="Type here to test focus ring..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-[#10101c] border border-white/[0.1] hover:border-white/[0.2] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/25 transition"
                />
                {inputValue && (
                  <p className="text-[11px] text-indigo-300 font-mono">Current value: {inputValue}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ARBITRARY BRACKET UTILITIES TEST ── */}
        <section className="space-y-6 bg-[#0c0c16] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">05.</span> Arbitrary Bracket Utilities (Tailwind v4)
            </h2>
            <p className="text-xs text-slate-400 mt-1">Validating bracket syntax for precise dimensions, opacities, and box shadows.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                30
              </div>
              <div className="text-xs">
                <p className="font-mono text-indigo-300">w-[30px] h-[30px]</p>
                <p className="text-slate-400 text-[11px]">Exact 30px square icon</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-xs font-bold text-white shrink-0">
                0.08
              </div>
              <div className="text-xs">
                <p className="font-mono text-purple-300">bg-white/[0.08]</p>
                <p className="text-slate-400 text-[11px]">Precise 8% white opacity</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-4">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#121224] border border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.35)] flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                Glow
              </div>
              <div className="text-xs">
                <p className="font-mono text-pink-300">shadow-[0_0_25px_...]</p>
                <p className="text-slate-400 text-[11px]">Arbitrary ambient glow</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.08] py-8 px-6 lg:px-12 mt-16 text-center text-xs text-slate-500">
        BuildX Tailwind CSS v4 Diagnostics • Verified independently without legacy CSS dependencies
      </footer>
    </div>
  );
}
