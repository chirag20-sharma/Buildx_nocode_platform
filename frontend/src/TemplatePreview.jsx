import "./template-preview.css";

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
    <div className="tp-backdrop" onClick={onClose}>
      <div className="tp-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tp-header">
          <div className="tp-header-left">
            <span className="tp-cat-badge" style={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` }}>
              {meta.label}
            </span>
            <h2 className="tp-title">{template.name}</h2>
          </div>
          <div className="tp-header-right">
            <button className="tp-close-btn" onClick={onClose}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>
        </div>

        <div className="tp-body">
          {/* Preview */}
          <div className="tp-preview-area">
            <div className="tp-preview-frame" style={{ background: `linear-gradient(${gradient})` }}>
              <div className="tp-frame-nav" style={{ borderBottom: `2px solid ${meta.color}40` }}>
                <div className="tp-frame-logo" style={{ background: meta.color }} />
                <div className="tp-frame-links">
                  <span /><span /><span /><span />
                </div>
                <div className="tp-frame-cta" style={{ background: meta.color }} />
              </div>
              <div className="tp-frame-hero">
                <div className="tp-frame-h1" />
                <div className="tp-frame-h2" />
                <div className="tp-frame-h3" />
                <div className="tp-frame-btn" style={{ background: meta.color }} />
              </div>
              <div className="tp-frame-cards">
                {[1,2,3].map(i => (
                  <div key={i} className="tp-frame-card">
                    <div className="tp-frame-card-img" />
                    <div className="tp-frame-card-line" />
                    <div className="tp-frame-card-line tp-short" />
                  </div>
                ))}
              </div>
              <div className="tp-frame-footer" />
            </div>
          </div>

          {/* Info */}
          <div className="tp-info">
            <p className="tp-description">{template.description}</p>

            {template.sections?.length > 0 && (
              <div className="tp-info-section">
                <div className="tp-info-label">Page Structure</div>
                <div className="tp-sections-list">
                  {template.sections.map((s, i) => (
                    <div key={i} className="tp-section-item">
                      <span className="tp-section-dot" style={{ background: meta.color }} />
                      <span>{s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {template.features?.length > 0 && (
              <div className="tp-info-section">
                <div className="tp-info-label">Included Features</div>
                <div className="tp-features-list">
                  {template.features.map((f, i) => (
                    <div key={i} className="tp-feature-item">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" style={{ color: meta.color, flexShrink: 0 }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="tp-info-section">
              <div className="tp-info-label">Details</div>
              <div className="tp-meta-row"><span>Components</span><span>{template.components?.length || 0}</span></div>
              <div className="tp-meta-row"><span>Used by</span><span>{template.usageCount || 0} projects</span></div>
            </div>

            <button className="tp-use-btn" style={{ background: meta.color }} onClick={() => onUse(template)}>
              Use this template
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
