import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "✦",
    title: "Visual Canvas",
    desc: "Drag, drop, resize, and align elements with pixel-perfect precision. Free positioning on an infinite responsive canvas.",
    tag: "Core Engine",
  },
  {
    icon: "⚡",
    title: "AI Website Builder",
    desc: "Describe what you want in plain English. BuildX AI automatically generates layouts, copy, palettes, and components instantly.",
    tag: "AI Powered",
  },
  {
    icon: "🎨",
    title: "50+ Curated Templates",
    desc: "Production-ready website architectures for SaaS, e-commerce, portfolios, blogs, and restaurants designed by top creators.",
    tag: "Design Ready",
  },
  {
    icon: "🗄",
    title: "Visual Data & Forms",
    desc: "Capture form submissions, bind dynamic content, and store records without configuring complex databases or SQL servers.",
    tag: "No-Code Data",
  },
  {
    icon: "📱",
    title: "Multi-Breakpoint Responsive",
    desc: "Design desktop, tablet, and mobile layouts with independent control. Ensure your website looks flawless on any screen size.",
    tag: "Responsive",
  },
  {
    icon: "🚀",
    title: "Instant Global Publishing",
    desc: "Deploy your site globally with one click. Get instant live URLs, SSL encryption, CDN caching, and exportable clean HTML/CSS.",
    tag: "1-Click Live",
  },
];

const TEMPLATES = [
  {
    name: "SaaS Landing",
    cat: "SaaS",
    color: "#818cf8",
    gradient: "from-indigo-950/80 via-slate-900 to-slate-950",
    accent: "bg-indigo-500",
    border: "border-indigo-500/30",
    headline: "Transform your workflow with intelligent automation",
    pill: "Software",
  },
  {
    name: "Guitar & Gear Store",
    cat: "E-Commerce",
    color: "#f59e0b",
    gradient: "from-amber-950/80 via-zinc-900 to-black",
    accent: "bg-amber-500",
    border: "border-amber-500/30",
    headline: "Handcrafted vintage & acoustic instruments",
    pill: "Retail",
  },
  {
    name: "Tech & Editorial Blog",
    cat: "Editorial",
    color: "#f43f5e",
    gradient: "from-rose-950/80 via-slate-900 to-slate-950",
    accent: "bg-rose-500",
    border: "border-rose-500/30",
    headline: "Deep dives into engineering, AI, and digital culture",
    pill: "Publications",
  },
  {
    name: "Designer Portfolio",
    cat: "Portfolio",
    color: "#06b6d4",
    gradient: "from-cyan-950/80 via-zinc-900 to-black",
    accent: "bg-cyan-500",
    border: "border-cyan-500/30",
    headline: "Product designer crafting digital experiences",
    pill: "Creative",
  },
  {
    name: "Artisan Restaurant",
    cat: "Hospitality",
    color: "#eab308",
    gradient: "from-yellow-950/80 via-neutral-900 to-black",
    accent: "bg-yellow-500",
    border: "border-yellow-500/30",
    headline: "Farm-to-table culinary experiences & seasonal menus",
    pill: "Dining",
  },
  {
    name: "Executive Analytics",
    cat: "Dashboard",
    color: "#10b981",
    gradient: "from-emerald-950/80 via-slate-900 to-slate-950",
    accent: "bg-emerald-500",
    border: "border-emerald-500/30",
    headline: "Real-time metrics, funnel telemetry, and revenue graphs",
    pill: "Analytics",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Pick a Template or Start Blank",
    desc: "Choose from 50+ industry-specific designs or begin from scratch with complete creative freedom on an infinite canvas.",
  },
  {
    n: "02",
    title: "Design Visually with Real-time AI",
    desc: "Drag, style, and reorder elements. Prompt BuildX AI to instantly generate sections, marketing copy, and imagery.",
  },
  {
    n: "03",
    title: "Connect Data & Customize Props",
    desc: "Attach forms, add buttons with custom actions, bind image grids, and set custom fonts and colors with zero code.",
  },
  {
    n: "04",
    title: "Publish Globally with One Click",
    desc: "Deploy your project live to the web instantly with SSL, fast global CDN distribution, and a shareable live URL.",
  },
];

export default function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <div className="min-h-screen bg-[#f8f8fb] text-[#0f0f1a] selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ── Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-400/8 via-purple-400/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[800px] -left-[200px] w-[500px] h-[500px] bg-indigo-200/20 blur-[130px] rounded-full" />
        <div className="absolute top-[1400px] -right-[200px] w-[550px] h-[550px] bg-purple-200/20 blur-[130px] rounded-full" />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.07] transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center font-extrabold text-base text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform">
              B
            </span>
            <span className="text-lg font-bold tracking-tight text-[#0f0f1a] group-hover:text-indigo-600 transition-colors">
              BuildX
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-black/[0.03] border border-black/[0.06] rounded-full px-4 py-1.5 shadow-inner">
            <a
              href="#features"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full hover:bg-black/[0.05] transition"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full hover:bg-black/[0.05] transition"
            >
              Templates
            </a>
            <a
              href="#how"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full hover:bg-black/[0.05] transition"
            >
              How it works
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-black/[0.05] transition"
              onClick={onSignIn}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_28px_rgba(99,102,241,0.55)] active:scale-95 transition-all cursor-pointer"
              onClick={onGetStarted}
            >
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 md:pt-28 pb-20 px-6 lg:px-12 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-md shadow-[0_0_16px_rgba(99,102,241,0.10)]">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_6px_#6366f1]" />
            <span>BuildX 2.0 with Real-time AI Generation</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#0f0f1a]">
            Build websites and<br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              web apps visually.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Design with Figma-level creative freedom. Build with Wix-level simplicity.
            Connect dynamic components and deploy live websites without writing code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto justify-center">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_36px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              onClick={onGetStarted}
            >
              <span>Start Building Free</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f1f1f7] border border-black/[0.10] hover:border-black/[0.18] text-slate-700 hover:text-slate-900 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Templates</span>
              <span className="text-indigo-500">→</span>
            </Link>
          </div>

          {/* Reassurance text */}
          <div className="flex items-center gap-6 text-xs text-slate-500 mt-1">
            <span>✓ No credit card required</span>
            <span>✓ 50+ free templates</span>
            <span>✓ Instant deployment</span>
          </div>
        </div>

        {/* ── High-Fidelity Product Preview Mockup ── */}
        <div className="max-w-5xl mx-auto mt-14 relative group">
          {/* Subtle Ambient Back-Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/15 via-purple-400/12 to-pink-400/12 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

          {/* Browser Container */}
          <div className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            {/* Window Title Bar */}
            <div className="h-11 bg-[#f4f4fa] border-b border-black/[0.06] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]/70 inline-block" />
              </div>
              <div className="flex items-center gap-2 bg-[#ebebf3] border border-black/[0.06] rounded-lg px-4 py-1 text-xs text-slate-500 font-mono">
                <span className="text-indigo-500">https://</span>buildx.app/builder/demo-saas
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-600 font-semibold text-[11px] border border-indigo-200">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Inner Studio Work Area */}
            <div className="flex h-[360px] md:h-[420px] bg-[#f5f5fa]">
              {/* Left Component Drawer */}
              <div className="hidden sm:flex w-44 shrink-0 bg-[#f1f1f7] border-r border-black/[0.05] p-3 flex-col gap-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Components
                </div>
                {[
                  { name: "Navbar", icon: "☰" },
                  { name: "Hero Header", icon: "✦" },
                  { name: "Feature Grid", icon: "⊞" },
                  { name: "CTA Banner", icon: "⚡" },
                  { name: "Image Gallery", icon: "🖼" },
                  { name: "Footer", icon: "▪" },
                ].map((item, idx) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      idx === 1
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "text-slate-500 hover:text-slate-800 hover:bg-black/[0.04]"
                    }`}
                  >
                    <span className="text-indigo-500 text-xs">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Central Visual Canvas Area */}
              <div className="flex-1 p-5 flex flex-col gap-3.5 bg-[#eeeef5] overflow-hidden">
                  {/* Simulated Canvas Top Bar */}
                <div className="h-9 bg-white border border-black/[0.06] rounded-xl flex items-center justify-between px-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                      B
                    </span>
                    <span className="text-xs font-bold text-[#0f0f1a]">Acme Corp</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                      Get Started
                    </span>
                  </div>
                </div>

                {/* Simulated Hero Section */}
                <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-200/70 rounded-xl p-5 flex flex-col items-center text-center gap-2.5 relative shadow-sm">
                  <div className="w-24 h-4 bg-indigo-100 text-indigo-600 rounded-full text-[9px] font-semibold flex items-center justify-center border border-indigo-200">
                    AI AUTOMATION
                  </div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
                  <div className="flex gap-2 mt-1">
                    <div className="w-24 h-6 rounded-md bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      Launch Demo
                    </div>
                    <div className="w-20 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-medium flex items-center justify-center">
                      Docs
                    </div>
                  </div>
                </div>

                {/* Simulated Feature Cards Grid */}
                <div className="grid grid-cols-3 gap-2.5 flex-1">
                  {[
                    { title: "Fast CDN", color: "from-indigo-50 to-purple-50" },
                    { title: "Custom CSS", color: "from-pink-50 to-rose-50" },
                    { title: "Analytics", color: "from-cyan-50 to-blue-50" },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border border-black/[0.06] bg-gradient-to-br ${card.color} p-3 flex flex-col gap-1.5`}
                    >
                      <div className="w-5 h-5 rounded-md bg-slate-200" />
                      <div className="w-16 h-2.5 bg-slate-300 rounded" />
                      <div className="w-full h-1.5 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Properties Panel */}
              <div className="hidden lg:flex w-48 shrink-0 bg-[#f1f1f7] border-l border-black/[0.05] p-3.5 flex-col gap-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Inspector
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                  <span className="text-[10px] text-slate-400">Layout</span>
                  <div className="grid grid-cols-2 gap-1.5 bg-white p-1.5 rounded-lg border border-black/[0.06]">
                    <span className="text-center font-mono text-[10px]">W: 100%</span>
                    <span className="text-center font-mono text-[10px]">H: Auto</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                  <span className="text-[10px] text-slate-400">Typography</span>
                  <div className="h-6 bg-white rounded border border-black/[0.06] px-2 flex items-center text-[10px]">
                    Inter Display (Bold)
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                  <span className="text-[10px] text-slate-400">Background</span>
                  <div className="h-6 bg-indigo-50 rounded border border-indigo-200 px-2 flex items-center justify-between text-[10px]">
                    <span>#6366f1</span>
                    <span className="w-3 h-3 rounded bg-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6 lg:px-12 relative border-t border-black/[0.07]" id="features">
        <div className="max-w-7xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1 mb-4">
              Powerful Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f0f1a] leading-tight">
              Everything you need to build<br />production-grade websites
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              No compromises. No limits. Switch between visual building and customized components with complete design flexibility.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative bg-white hover:bg-[#fafafa] border border-black/[0.07] hover:border-indigo-400/40 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-xl text-indigo-600 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0f0f1a] mb-2 group-hover:text-indigo-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Section ── */}
      <section className="py-24 px-6 lg:px-12 bg-[#f1f1f7] border-t border-b border-black/[0.07] relative" id="templates">
        <div className="max-w-7xl mx-auto">
          {/* Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1 mb-4">
              Curated Layouts
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f0f1a] leading-tight">
              Start from a real website,<br />not a blank page
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              Every template is built with complete section architecture, custom colors, and component hierarchies.
            </p>
          </div>

          {/* High-Fidelity Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t) => (
              <div
                key={t.name}
                className="group rounded-2xl overflow-hidden border border-black/[0.08] hover:border-indigo-400/50 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] cursor-pointer flex flex-col"
              >
                {/* Miniature Site Preview Canvas — keep the gradient previews dark for realism */}
                <div className={`h-48 bg-gradient-to-br ${t.gradient} p-4 flex flex-col justify-between border-b border-white/[0.08] relative overflow-hidden`}>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.1]">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${t.accent}`} />
                      <span className="text-[11px] font-bold text-white tracking-wide">{t.name}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                      {t.pill}
                    </span>
                  </div>
                  <div className="my-auto py-2 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                      "{t.headline}"
                    </p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white ${t.accent} shadow-sm`}>
                        Get Started
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium text-slate-300 bg-white/10">
                        View Demo
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className="h-6 bg-white/[0.08] rounded border border-white/5" />
                    <div className="h-6 bg-white/[0.08] rounded border border-white/5" />
                    <div className="h-6 bg-white/[0.08] rounded border border-white/5" />
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="p-4 bg-[#f5f5fa] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase block" style={{ color: t.color }}>
                      {t.cat}
                    </span>
                    <h4 className="text-sm font-bold text-[#0f0f1a] mt-0.5">{t.name}</h4>
                  </div>
                  <Link
                    to="/signup"
                    className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 group-hover:translate-x-0.5 transition-all flex items-center gap-1"
                    onClick={onGetStarted}
                  >
                    Use Template →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="flex justify-center mt-12">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f1f1f7] border border-black/[0.09] hover:border-indigo-400/40 text-slate-700 hover:text-slate-900 text-sm font-semibold px-7 py-3 rounded-xl transition cursor-pointer"
              onClick={onGetStarted}
            >
              <span>Explore All 50+ Templates</span>
              <span className="text-indigo-500">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-24 px-6 lg:px-12 relative" id="how">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3.5 py-1 mb-4">
              Simple Workflow
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f0f1a] leading-tight">
              From initial idea to live website<br />in four simple steps
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              No boilerplate code, no terminal commands, no hosting headaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 relative group hover:border-indigo-400/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 text-indigo-700 font-extrabold text-sm flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="text-base font-bold text-[#0f0f1a] leading-snug">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-white border border-indigo-200 p-12 md:p-16 text-center relative overflow-hidden shadow-[0_8px_40px_rgba(99,102,241,0.12)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-400/8 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f0f1a]">
              Ready to build something extraordinary?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Join thousands of founders, creators, and developers shipping beautiful websites faster with BuildX.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-base px-9 py-4 rounded-xl shadow-[0_0_28px_rgba(99,102,241,0.40)] hover:shadow-[0_0_40px_rgba(99,102,241,0.60)] hover:-translate-y-0.5 transition-all cursor-pointer"
              onClick={onGetStarted}
            >
              <span>Get Started Free</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.07] py-10 px-6 lg:px-12 bg-[#f1f1f7]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs text-white">
              B
            </span>
            <span className="text-base font-bold text-[#0f0f1a]">BuildX</span>
            <span className="text-xs text-slate-500 ml-2">Visual No-Code Platform</span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#templates" className="hover:text-slate-900 transition">Templates</a>
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <Link to="/signin" className="hover:text-slate-900 transition">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-900 transition">Sign Up</Link>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 BuildX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
