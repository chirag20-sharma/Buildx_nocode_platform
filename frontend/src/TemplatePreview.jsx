const CATEGORY_META = {
  saas:         { label: "SaaS",        color: "#6366f1" },
  blog:         { label: "Blog",        color: "#ef4444" },
  ecommerce:    { label: "E-commerce",  color: "#d97706" },
  portfolio:    { label: "Portfolio",   color: "#22d3ee" },
  restaurant:   { label: "Restaurant",  color: "#f59e0b" },
  "landing-page":{ label: "Landing",   color: "#818cf8" },
  dashboard:    { label: "Dashboard",   color: "#34d399" },
  other:        { label: "Other",       color: "#94a3b8" },
};

export default function TemplatePreview({ template, onUse, onClose }) {
  if (!template) return null;
  const meta = CATEGORY_META[template.category] || CATEGORY_META.other;
  const gradient = template.theme?.previewGradient || "135deg, #1e1b4b 0%, #312e81 100%";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-[860px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` }}>
              {meta.label}
            </span>
            <h2 className="text-base font-semibold text-slate-100">{template.name}</h2>
          </div>
          <button className="bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer" onClick={onClose}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#1e293b] flex items-center justify-center bg-[#080f1e]">
            <div className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl" style={{ background: `linear-gradient(${gradient})` }}>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5" style={{ borderBottom: `2px solid ${meta.color}40` }}>
                <div className="w-5 h-5 rounded opacity-90" style={{ background: meta.color }} />
                <div className="flex gap-1.5 flex-1">
                  <span className="h-1.5 w-7 bg-white/15 rounded-full" />
                  <span className="h-1.5 w-7 bg-white/15 rounded-full" />
                  <span className="h-1.5 w-7 bg-white/15 rounded-full" />
                </div>
                <div className="h-5 w-12 rounded opacity-85" style={{ background: meta.color }} />
              </div>
              <div className="p-4 pb-3.5 flex flex-col gap-2">
                <div className="h-3.5 w-[70%] bg-white/70 rounded" />
                <div className="h-2.5 w-[55%] bg-white/40 rounded" />
                <div className="h-2 w-[80%] bg-white/20 rounded" />
                <div className="h-6 w-20 rounded-md mt-1.5 opacity-90" style={{ background: meta.color }} />
              </div>
              <div className="flex gap-2 px-4 pb-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 bg-white/[0.07] rounded-md p-2 flex flex-col gap-1.5">
                    <div className="h-9 bg-white/[0.12] rounded" />
                    <div className="h-1.5 bg-white/20 rounded-full" />
                    <div className="h-1.5 w-[60%] bg-white/20 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="h-6 bg-black/25" />
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-[280px] shrink-0 p-5 overflow-y-auto flex flex-col gap-4 bg-[#0f172a]">
            <p className="text-[13px] text-slate-400 leading-relaxed">{template.description}</p>

            {template.sections?.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Page Structure</div>
                <div className="flex flex-col gap-1.5">
                  {template.sections.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
                      <span>{s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {template.features?.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Included Features</div>
                <div className="flex flex-col gap-1.5">
                  {template.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" style={{ color: meta.color, flexShrink: 0 }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1 text-xs text-slate-400 border-t border-[#1e293b] pt-3">
              <div className="flex justify-between"><span>Components</span><span className="text-slate-200 font-medium">{template.components?.length || 0}</span></div>
              <div className="flex justify-between"><span>Used by</span><span className="text-slate-200 font-medium">{template.usageCount || 0} projects</span></div>
            </div>

            <button
              className="w-full mt-auto py-2.5 px-4 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] cursor-pointer"
              style={{ background: meta.color }}
              onClick={() => onUse(template)}
            >
              Use this template
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
