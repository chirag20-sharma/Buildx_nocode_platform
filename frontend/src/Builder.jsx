import { useState, useRef, useCallback, useEffect } from "react";
import "./builder.css";

const API = "http://localhost:5000/api/v1";
const GRID = 8;
const snap = (v) => Math.round(v / GRID) * GRID;

// ─── History (Undo/Redo) ───────────────────────────────────────────────────
function useHistory(initial) {
  const [index, setIndex] = useState(0);
  const history = useRef([initial]);

  const state = history.current[index];

  const push = useCallback((next) => {
    const newHistory = history.current.slice(0, index + 1);
    newHistory.push(typeof next === "function" ? next(history.current[index]) : next);
    history.current = newHistory;
    setIndex(newHistory.length - 1);
  }, [index]);

  const undo = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
  const redo = useCallback(() => setIndex(i => Math.min(history.current.length - 1, i + 1)), []);
  const canUndo = index > 0;
  const canRedo = index < history.current.length - 1;

  return { state, push, undo, redo, canUndo, canRedo };
}

// ─── Component Library ────────────────────────────────────────────────────
const COMPONENT_GROUPS = [
  {
    group: "Layout",
    items: [
      { type: "section",    label: "Section",     icon: "▬", defaultW: 800, defaultH: 200, props: { bg: "#f8fafc" } },
      { type: "container",  label: "Container",   icon: "▭", defaultW: 400, defaultH: 120, props: { bg: "#ffffff" } },
      { type: "columns",    label: "2 Columns",   icon: "⊟", defaultW: 600, defaultH: 120, props: { cols: 2 } },
    ]
  },
  {
    group: "Basic",
    items: [
      { type: "text",       label: "Text",        icon: "T",  defaultW: 300, defaultH: 40,  props: { text: "Your text here", fontSize: 16, color: "#1a1a1a" } },
      { type: "heading",    label: "Heading",     icon: "H",  defaultW: 400, defaultH: 56,  props: { text: "Section Heading", fontSize: 32, fontWeight: "700", color: "#0f172a" } },
      { type: "button",     label: "Button",      icon: "▶",  defaultW: 160, defaultH: 44,  props: { text: "Click me", bg: "#6366f1", color: "#ffffff", radius: 8 } },
      { type: "divider",    label: "Divider",     icon: "─",  defaultW: 400, defaultH: 2,   props: { color: "#e2e8f0" } },
      { type: "spacer",     label: "Spacer",      icon: "↕",  defaultW: 400, defaultH: 40,  props: {} },
    ]
  },
  {
    group: "Media",
    items: [
      { type: "image",      label: "Image",       icon: "🖼", defaultW: 320, defaultH: 220, props: { src: "", alt: "Image", fit: "cover" } },
      {
        type: "imagegrid",
        label: "Image Grid",
        icon: "▦",
        defaultW: 660,
        defaultH: 440,
        props: {
          cols: 3,
          gap: 8,
          aspectRatio: "1/1",
          fit: "cover",
          radius: 8,
          hoverEffect: "zoom",
          lightbox: false,
          desktopCols: 3,
          tabletCols: 2,
          mobileCols: 1,
          images: [
            { src: "", alt: "Photo 1" },
            { src: "", alt: "Photo 2" },
            { src: "", alt: "Photo 3" },
            { src: "", alt: "Photo 4" },
            { src: "", alt: "Photo 5" },
            { src: "", alt: "Photo 6" },
          ],
        },
      },
      { type: "video",      label: "Video",       icon: "▶",  defaultW: 480, defaultH: 270, props: { src: "", poster: "", controls: true } },
    ]
  },
  {
    group: "Navigation",
    items: [
      { type: "navbar",     label: "Navbar",      icon: "☰",  defaultW: 800, defaultH: 60,  props: { brand: "My Brand", links: "Home, About, Contact", bg: "#0f172a", color: "#f1f5f9" } },
      { type: "footer",     label: "Footer",      icon: "▬",  defaultW: 800, defaultH: 80,  props: { text: "© 2025 My Company. All rights reserved.", bg: "#0f172a", color: "#94a3b8" } },
    ]
  },
  {
    group: "UI Components",
    items: [
      { type: "card",       label: "Card",        icon: "▣",  defaultW: 280, defaultH: 180, props: { title: "Card Title", body: "Card description goes here.", bg: "#ffffff", radius: 12 } },
      { type: "badge",      label: "Badge",       icon: "◉",  defaultW: 100, defaultH: 28,  props: { text: "New", bg: "#6366f1", color: "#ffffff" } },
      { type: "alert",      label: "Alert",       icon: "⚠",  defaultW: 400, defaultH: 56,  props: { text: "This is an alert message.", type: "info" } },
      { type: "tabs",       label: "Tabs",        icon: "⊞",  defaultW: 500, defaultH: 44,  props: { tabs: "Tab 1, Tab 2, Tab 3" } },
    ]
  },
  {
    group: "Forms",
    items: [
      { type: "input",      label: "Input",       icon: "▭",  defaultW: 300, defaultH: 44,  props: { placeholder: "Enter text...", label: "Label" } },
      { type: "textarea",   label: "Textarea",    icon: "▭",  defaultW: 300, defaultH: 100, props: { placeholder: "Enter message...", label: "Message" } },
      { type: "select",     label: "Select",      icon: "▾",  defaultW: 200, defaultH: 44,  props: { label: "Choose option", options: "Option 1, Option 2, Option 3" } },
      { type: "checkbox",   label: "Checkbox",    icon: "☑",  defaultW: 200, defaultH: 32,  props: { label: "I agree to terms" } },
      { type: "formblock",  label: "Form",        icon: "📋", defaultW: 400, defaultH: 280, props: { title: "Contact Us", cta: "Send Message" } },
    ]
  },
  {
    group: "Business",
    items: [
      { type: "hero",       label: "Hero Section",    icon: "★",  defaultW: 800, defaultH: 300, props: { heading: "Your Big Headline", subtext: "Supporting description text.", cta: "Get Started", bg: "#0f172a", color: "#f1f5f9" } },
      { type: "productcard",label: "Product Card",    icon: "🛒", defaultW: 240, defaultH: 320, props: { name: "Product Name", price: "$99.99", brand: "Brand", rating: 4.5 } },
      { type: "pricingcard",label: "Pricing Card",    icon: "💰", defaultW: 260, defaultH: 360, props: { plan: "Pro", price: "$49/mo", features: "Feature 1, Feature 2, Feature 3" } },
      { type: "testimonial",label: "Testimonial",     icon: "💬", defaultW: 360, defaultH: 160, props: { quote: "This product changed everything for us.", author: "Jane Doe", role: "CEO, Acme Inc." } },
      { type: "blogcard",   label: "Blog Card",       icon: "📰", defaultW: 300, defaultH: 240, props: { title: "Article Title", author: "Author Name", date: "June 2025", readTime: "5 min read", category: "Design" } },
      { type: "statcard",   label: "Stat Card",       icon: "📊", defaultW: 180, defaultH: 100, props: { value: "12,400", label: "Monthly Users", trend: "+24%" } },
    ]
  },
];

const ALL_COMPONENTS = COMPONENT_GROUPS.flatMap(g => g.items);

// ─── Snap helpers ─────────────────────────────────────────────────────────
const SNAP_THRESHOLD = 6;
function getSnapGuides(x, y, w, h, others) {
  let sx = x, sy = y;
  const guides = [];
  for (const o of others) {
    const xPairs = [[x, o.x], [x, o.x + o.w], [x + w, o.x], [x + w, o.x + o.w], [x + w / 2, o.x + o.w / 2]];
    for (const [mine, theirs] of xPairs) {
      if (Math.abs(mine - theirs) < SNAP_THRESHOLD) {
        sx = theirs - (mine - x);
        guides.push({ type: "v", pos: theirs });
        break;
      }
    }
    const yPairs = [[y, o.y], [y, o.y + o.h], [y + h, o.y], [y + h, o.y + o.h], [y + h / 2, o.y + o.h / 2]];
    for (const [mine, theirs] of yPairs) {
      if (Math.abs(mine - theirs) < SNAP_THRESHOLD) {
        sy = theirs - (mine - y);
        guides.push({ type: "h", pos: theirs });
        break;
      }
    }
  }
  return { sx: snap(sx), sy: snap(sy), guides };
}

// ─── Component Renderer ───────────────────────────────────────────────────
function renderNodeContent(node) {
  const p = node.props || {};
  switch (node.type) {
    case "text":
      return <span style={{ fontSize: p.fontSize || 16, color: p.color || "#1a1a1a", fontWeight: p.fontWeight || "400", lineHeight: 1.5 }}>{p.text || "Text"}</span>;
    case "heading":
      return <span style={{ fontSize: p.fontSize || 32, color: p.color || "#0f172a", fontWeight: p.fontWeight || "700", lineHeight: 1.2 }}>{p.text || "Heading"}</span>;
    case "button":
      return <button style={{ background: p.bg || "#6366f1", color: p.color || "#fff", border: "none", borderRadius: p.radius || 8, padding: "0 20px", height: "100%", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{p.text || "Button"}</button>;
    case "image":
      return p.src
        ? <img src={p.src} alt={p.alt || ""} style={{ width: "100%", height: "100%", objectFit: p.fit || "cover", borderRadius: p.radius || 0, display: "block" }} />
        : <div className="node-img-empty"><svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>Image</span></div>;
    case "imagegrid": {
      const images = p.images || [];
      const cols = p.cols || 3;
      const gap = p.gap ?? 8;
      const radius = p.radius ?? 8;
      const fit = p.fit || "cover";
      const aspectRatio = p.aspectRatio || "1/1";
      return (
        <div className="node-imagegrid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, width: "100%", height: "100%", padding: 4 }}>
          {images.map((img, i) => (
            <div key={i} className="node-imagegrid-item" style={{ borderRadius: radius, overflow: "hidden", aspectRatio, position: "relative" }}>
              {img.src
                ? <img src={img.src} alt={img.alt || `Photo ${i+1}`} style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }} />
                : <div className="node-imagegrid-empty-cell">
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span>{i + 1}</span>
                  </div>
              }
            </div>
          ))}
          {images.length === 0 && (
            <div className="node-imagegrid-placeholder" style={{ gridColumn: `1 / span ${cols}` }}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32"><rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span>Image Grid</span>
            </div>
          )}
        </div>
      );
    }
    case "video":
      return (
        <div className="node-img-empty" style={{ background: "#0a0a0f" }}>
          <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg>
          <span>{p.src ? "Video" : "Video"}</span>
        </div>
      );
    case "navbar":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", gap: 24, fontSize: 14, fontWeight: 600 }}><span style={{ fontWeight: 800, fontSize: 16 }}>{p.brand || "Brand"}</span><span style={{ opacity: 0.6, fontSize: 12 }}>{p.links || "Home · About · Contact"}</span></div>;
    case "footer":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || "#94a3b8", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{p.text || "Footer"}</div>;
    case "hero":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", gap: 10 }}><div style={{ fontSize: Math.min(28, (p.fontSize || 36)), fontWeight: 800, lineHeight: 1.2 }}>{p.heading || "Hero Heading"}</div><div style={{ fontSize: 13, opacity: 0.7, maxWidth: 400 }}>{p.subtext || "Subtext"}</div><button style={{ marginTop: 8, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{p.cta || "Get Started"}</button></div>;
    case "card":
      return <div style={{ background: p.bg || "#ffffff", width: "100%", height: "100%", borderRadius: p.radius || 12, padding: "16px", display: "flex", flexDirection: "column", gap: 6, border: "1px solid #e2e8f0" }}><div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{p.title || "Card Title"}</div><div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{p.body || "Card description."}</div></div>;
    case "section":
      return <div style={{ background: p.bg || "#f8fafc", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Section</span></div>;
    case "container":
      return <div style={{ background: p.bg || "#ffffff", width: "100%", height: "100%", border: "1px dashed #cbd5e1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 11, color: "#94a3b8" }}>Container</span></div>;
    case "divider":
      return <div style={{ width: "100%", height: "100%", background: p.color || "#e2e8f0", borderRadius: 2 }} />;
    case "spacer":
      return <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(99,102,241,0.06) 4px, rgba(99,102,241,0.06) 8px)" }} />;
    case "badge":
      return <div style={{ background: p.bg || "#6366f1", color: p.color || "#fff", borderRadius: 6, padding: "0 10px", height: "100%", display: "flex", alignItems: "center", fontSize: 12, fontWeight: 700 }}>{p.text || "Badge"}</div>;
    case "alert":
      return <div style={{ background: p.type === "error" ? "#fef2f2" : p.type === "success" ? "#f0fdf4" : "#eff6ff", border: `1px solid ${p.type === "error" ? "#fecaca" : p.type === "success" ? "#bbf7d0" : "#bfdbfe"}`, borderRadius: 8, padding: "0 16px", height: "100%", display: "flex", alignItems: "center", fontSize: 13, color: p.type === "error" ? "#dc2626" : p.type === "success" ? "#16a34a" : "#2563eb" }}>{p.text || "Alert message"}</div>;
    case "input":
      return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>{p.label && <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{p.label}</label>}<div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, color: "#94a3b8" }}>{p.placeholder || "Input"}</div></div>;
    case "select":
      return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>{p.label && <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{p.label}</label>}<div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 13, color: "#94a3b8" }}><span>{(p.options || "Option 1").split(",")[0].trim()}</span><span>▾</span></div></div>;
    case "checkbox":
      return <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", fontSize: 13, color: "#374151" }}><div style={{ width: 16, height: 16, border: "2px solid #6366f1", borderRadius: 4, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 10 }}>✓</span></div>{p.label || "Checkbox"}</div>;
    case "textarea":
      return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>{p.label && <label style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{p.label}</label>}<div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "#94a3b8" }}>{p.placeholder || "Textarea"}</div></div>;
    case "formblock":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}><div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{p.title || "Form"}</div><div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6 }} /><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600 }}>{p.cta || "Submit"}</button></div>;
    case "tabs":
      return <div style={{ display: "flex", gap: 2, height: "100%", alignItems: "center", background: "#f1f5f9", borderRadius: 8, padding: "3px" }}>{(p.tabs || "Tab 1, Tab 2").split(",").map((t, i) => <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#fff" : "transparent", borderRadius: 6, fontSize: 12, fontWeight: 600, color: i === 0 ? "#0f172a" : "#64748b" }}>{t.trim()}</div>)}</div>;
    case "productcard":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}><div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Product Image</div><div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}><div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>{p.brand || "Brand"}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.name || "Product"}</div><div style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>{p.price || "$0.00"}</div><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, padding: "6px", fontSize: 11, fontWeight: 600 }}>Add to Cart</button></div></div>;
    case "pricingcard":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}><div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{p.plan || "Plan"}</div><div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1" }}>{p.price || "$0/mo"}</div><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>{(p.features || "Feature 1, Feature 2").split(",").map((f, i) => <div key={i} style={{ fontSize: 12, color: "#475569", display: "flex", gap: 6 }}><span style={{ color: "#22c55e" }}>✓</span>{f.trim()}</div>)}</div><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600 }}>Get Started</button></div>;
    case "testimonial":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, fontStyle: "italic" }}>"{p.quote || "Great product!"}"</div><div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{p.author || "Author"} <span style={{ color: "#94a3b8", fontWeight: 400 }}>— {p.role || "Role"}</span></div></div>;
    case "blogcard":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}><div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Cover Image</div><div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}><div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textTransform: "uppercase" }}>{p.category || "Category"}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{p.title || "Article Title"}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>{p.author || "Author"} · {p.readTime || "5 min"}</div></div></div>;
    case "statcard":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}><div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{p.value || "0"}</div><div style={{ fontSize: 12, color: "#64748b" }}>{p.label || "Metric"}</div>{p.trend && <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>{p.trend}</div>}</div>;
    case "columns":
      return <div style={{ display: "flex", gap: 8, width: "100%", height: "100%", padding: 4 }}>{Array.from({ length: p.cols || 2 }).map((_, i) => <div key={i} style={{ flex: 1, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Col {i + 1}</div>)}</div>;
    default:
      return <span style={{ fontSize: 12, color: "#94a3b8", padding: "0 8px" }}>{node.type}</span>;
  }
}

// ─── Properties Panel ─────────────────────────────────────────────────────
function PropertiesPanel({ node, onChange, onDelete, onDuplicate }) {
  if (!node) {
    return (
      <div className="bx-props-empty">
        <svg viewBox="0 0 24 24" fill="none" width="32" height="32"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/></svg>
        <p>Select an element to edit its properties</p>
      </div>
    );
  }

  const p = node.props || {};
  const set = (key, val) => onChange({ ...node, props: { ...p, [key]: val } });

  const PropRow = ({ label, children }) => (
    <div className="bx-prop-row">
      <span className="bx-prop-label">{label}</span>
      <div className="bx-prop-control">{children}</div>
    </div>
  );

  const TextInput = ({ k, placeholder }) => (
    <input className="bx-prop-input" value={p[k] || ""} placeholder={placeholder || k}
      onChange={e => set(k, e.target.value)} />
  );

  const NumberInput = ({ k, min, max, step }) => (
    <input className="bx-prop-input bx-prop-number" type="number" value={p[k] || 0}
      min={min} max={max} step={step || 1} onChange={e => set(k, +e.target.value)} />
  );

  const ColorInput = ({ k }) => (
    <div className="bx-prop-color-row">
      <input type="color" className="bx-prop-color" value={p[k] || "#000000"} onChange={e => set(k, e.target.value)} />
      <input className="bx-prop-input" value={p[k] || ""} placeholder="#000000" onChange={e => set(k, e.target.value)} />
    </div>
  );

  const renderTypeProps = () => {
    switch (node.type) {
      case "text":
      case "heading":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="Size"><NumberInput k="fontSize" min={8} max={120} /></PropRow>
          <PropRow label="Weight">
            <select className="bx-prop-select" value={p.fontWeight || "400"} onChange={e => set("fontWeight", e.target.value)}>
              {["300","400","500","600","700","800","900"].map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
          <PropRow label="Align">
            <div className="bx-prop-align-btns">
              {["left","center","right"].map(a => (
                <button key={a} className={`bx-prop-align-btn ${p.textAlign === a ? "active" : ""}`} onClick={() => set("textAlign", a)}>{a[0].toUpperCase()}</button>
              ))}
            </div>
          </PropRow>
        </>;
      case "button":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={50} /></PropRow>
          <PropRow label="Link"><TextInput k="href" placeholder="https://..." /></PropRow>
        </>;
      case "image":
        return <>
          <PropRow label="URL"><TextInput k="src" placeholder="https://..." /></PropRow>
          <PropRow label="Alt"><TextInput k="alt" /></PropRow>
          <PropRow label="Fit">
            <select className="bx-prop-select" value={p.fit || "cover"} onChange={e => set("fit", e.target.value)}>
              {["cover","contain","fill","none"].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={100} /></PropRow>
          <PropRow label="Upload">
            <label className="bx-prop-upload-btn">
              Browse file
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => set("src", ev.target.result);
                reader.readAsDataURL(file);
              }} />
            </label>
          </PropRow>
        </>;
      case "imagegrid": {
        const images = p.images || [];
        const setImage = (idx, key, val) => {
          const next = images.map((img, i) => i === idx ? { ...img, [key]: val } : img);
          set("images", next);
        };
        const addImage = () => set("images", [...images, { src: "", alt: `Photo ${images.length + 1}` }]);
        const removeImage = (idx) => set("images", images.filter((_, i) => i !== idx));
        return <>
          <div className="bx-props-section-title" style={{ marginTop: 4 }}>Layout</div>
          <PropRow label="Columns"><NumberInput k="cols" min={1} max={6} /></PropRow>
          <PropRow label="Gap"><NumberInput k="gap" min={0} max={40} /></PropRow>
          <PropRow label="Aspect">
            <select className="bx-prop-select" value={p.aspectRatio || "1/1"} onChange={e => set("aspectRatio", e.target.value)}>
              {["1/1","4/3","3/2","16/9","2/3","3/4"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </PropRow>
          <PropRow label="Fit">
            <select className="bx-prop-select" value={p.fit || "cover"} onChange={e => set("fit", e.target.value)}>
              {["cover","contain","fill"].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={40} /></PropRow>
          <div className="bx-props-section-title" style={{ marginTop: 8 }}>Hover</div>
          <PropRow label="Effect">
            <select className="bx-prop-select" value={p.hoverEffect || "none"} onChange={e => set("hoverEffect", e.target.value)}>
              {["none","zoom","overlay","both"].map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </PropRow>
          <div className="bx-props-section-title" style={{ marginTop: 8 }}>Responsive</div>
          <PropRow label="Desktop"><NumberInput k="desktopCols" min={1} max={6} /></PropRow>
          <PropRow label="Tablet"><NumberInput k="tabletCols" min={1} max={4} /></PropRow>
          <PropRow label="Mobile"><NumberInput k="mobileCols" min={1} max={2} /></PropRow>
          <div className="bx-props-section-title" style={{ marginTop: 8 }}>Images ({images.length})</div>
          <div className="bx-imagegrid-images-list">
            {images.map((img, idx) => (
              <div key={idx} className="bx-imagegrid-img-row">
                <span className="bx-imagegrid-img-num">{idx + 1}</span>
                <input className="bx-prop-input" style={{ flex: 1, fontSize: 11 }} value={img.src || ""} placeholder="URL or upload" onChange={e => setImage(idx, "src", e.target.value)} />
                <label className="bx-imagegrid-upload-mini" title="Upload">
                  ↑
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setImage(idx, "src", ev.target.result);
                    reader.readAsDataURL(file);
                  }} />
                </label>
                <button className="bx-imagegrid-remove-btn" onClick={() => removeImage(idx)} title="Remove">✕</button>
              </div>
            ))}
          </div>
          <button className="bx-prop-upload-btn" style={{ marginTop: 6 }} onClick={addImage}>+ Add Image</button>
        </>;
      }
      case "video":
        return <>
          <PropRow label="URL"><TextInput k="src" placeholder="https://..." /></PropRow>
          <PropRow label="Poster"><TextInput k="poster" placeholder="Thumbnail URL" /></PropRow>
        </>;
      case "navbar":
        return <>
          <PropRow label="Brand"><TextInput k="brand" /></PropRow>
          <PropRow label="Links"><TextInput k="links" placeholder="Home, About, Contact" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "hero":
        return <>
          <PropRow label="Heading"><TextInput k="heading" /></PropRow>
          <PropRow label="Subtext"><TextInput k="subtext" /></PropRow>
          <PropRow label="CTA"><TextInput k="cta" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "card":
        return <>
          <PropRow label="Title"><TextInput k="title" /></PropRow>
          <PropRow label="Body"><TextInput k="body" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={40} /></PropRow>
        </>;
      case "productcard":
        return <>
          <PropRow label="Name"><TextInput k="name" /></PropRow>
          <PropRow label="Brand"><TextInput k="brand" /></PropRow>
          <PropRow label="Price"><TextInput k="price" /></PropRow>
          <PropRow label="Rating"><NumberInput k="rating" min={0} max={5} step={0.1} /></PropRow>
        </>;
      case "pricingcard":
        return <>
          <PropRow label="Plan"><TextInput k="plan" /></PropRow>
          <PropRow label="Price"><TextInput k="price" /></PropRow>
          <PropRow label="Features"><TextInput k="features" placeholder="F1, F2, F3" /></PropRow>
        </>;
      case "testimonial":
        return <>
          <PropRow label="Quote"><TextInput k="quote" /></PropRow>
          <PropRow label="Author"><TextInput k="author" /></PropRow>
          <PropRow label="Role"><TextInput k="role" /></PropRow>
        </>;
      case "blogcard":
        return <>
          <PropRow label="Title"><TextInput k="title" /></PropRow>
          <PropRow label="Author"><TextInput k="author" /></PropRow>
          <PropRow label="Category"><TextInput k="category" /></PropRow>
          <PropRow label="Read time"><TextInput k="readTime" /></PropRow>
        </>;
      case "statcard":
        return <>
          <PropRow label="Value"><TextInput k="value" /></PropRow>
          <PropRow label="Label"><TextInput k="label" /></PropRow>
          <PropRow label="Trend"><TextInput k="trend" placeholder="+12%" /></PropRow>
        </>;
      case "formblock":
        return <>
          <PropRow label="Title"><TextInput k="title" /></PropRow>
          <PropRow label="CTA"><TextInput k="cta" /></PropRow>
        </>;
      case "alert":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="Type">
            <select className="bx-prop-select" value={p.type || "info"} onChange={e => set("type", e.target.value)}>
              {["info","success","error","warning"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </PropRow>
        </>;
      case "badge":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "tabs":
        return <PropRow label="Tabs"><TextInput k="tabs" placeholder="Tab 1, Tab 2, Tab 3" /></PropRow>;
      case "input":
      case "textarea":
        return <>
          <PropRow label="Label"><TextInput k="label" /></PropRow>
          <PropRow label="Placeholder"><TextInput k="placeholder" /></PropRow>
        </>;
      case "select":
        return <>
          <PropRow label="Label"><TextInput k="label" /></PropRow>
          <PropRow label="Options"><TextInput k="options" placeholder="Opt 1, Opt 2" /></PropRow>
        </>;
      case "checkbox":
        return <PropRow label="Label"><TextInput k="label" /></PropRow>;
      case "footer":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "section":
      case "container":
        return <PropRow label="BG"><ColorInput k="bg" /></PropRow>;
      case "divider":
        return <PropRow label="Color"><ColorInput k="color" /></PropRow>;
      default:
        return <p style={{ fontSize: 12, color: "#475569", padding: "8px 0" }}>No editable properties.</p>;
    }
  };

  return (
    <div className="bx-props-panel">
      <div className="bx-props-header">
        <span className="bx-props-type">{node.type}</span>
        <span className="bx-props-id">{node.id?.slice(-6)}</span>
      </div>

      <div className="bx-props-section">
        <div className="bx-props-section-title">Layout</div>
        <div className="bx-prop-xywh">
          <div className="bx-prop-xywh-item"><span>X</span><input type="number" value={node.x} onChange={e => onChange({ ...node, x: snap(+e.target.value) })} /></div>
          <div className="bx-prop-xywh-item"><span>Y</span><input type="number" value={node.y} onChange={e => onChange({ ...node, y: snap(+e.target.value) })} /></div>
          <div className="bx-prop-xywh-item"><span>W</span><input type="number" value={node.w} onChange={e => onChange({ ...node, w: Math.max(20, +e.target.value) })} /></div>
          <div className="bx-prop-xywh-item"><span>H</span><input type="number" value={node.h} onChange={e => onChange({ ...node, h: Math.max(8, +e.target.value) })} /></div>
        </div>
      </div>

      <div className="bx-props-section">
        <div className="bx-props-section-title">Properties</div>
        {renderTypeProps()}
      </div>

      <div className="bx-props-actions">
        <button className="bx-prop-btn-dup" onClick={onDuplicate}>Duplicate</button>
        <button className="bx-prop-btn-del" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────
export default function Builder({ token, projectId, onBack }) {
  const { state: nodes, push, undo, redo, canUndo, canRedo } = useHistory([]);
  const [selected, setSelected] = useState(null); // single id
  const [multiSelected, setMultiSelected] = useState([]); // array of ids
  const [guides, setGuides] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [leftTab, setLeftTab] = useState("components"); // "components" | "layers"
  const [projectName, setProjectName] = useState("Untitled Project");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!projectId);
  const [toast, setToast] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(projectId || null);
  const [dragOver, setDragOver] = useState(false);
  const [layerSearch, setLayerSearch] = useState("");

  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const dragState = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const selectedNode = nodes.find(n => n.id === selected);

  // ── Load existing project ──
  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      try {
        const res = await fetch(`${API}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          const p = data.payload.project;
          setProjectName(p.name);
          const mapped = (p.components || []).map((c, i) => ({
            id: c.id || `node-${i}`,
            type: c.type,
            x: c.position?.x ?? i * 20,
            y: c.position?.y ?? i * 60,
            w: c.styles?.width ?? 280,
            h: c.styles?.height ?? 60,
            props: c.properties || {},
            locked: false,
            hidden: false,
            name: c.properties?.text || c.properties?.heading || c.properties?.title || c.type,
          }));
          push(mapped);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") { e.preventDefault(); duplicateSelected(); }
      if (e.key === "Delete" || e.key === "Backspace") { if (selected) { e.preventDefault(); deleteSelected(); } }
      if (e.key === "Escape") { setSelected(null); setMultiSelected([]); }
      if ((e.metaKey || e.ctrlKey) && e.key === "a") { e.preventDefault(); setMultiSelected(nodes.map(n => n.id)); }
      // Arrow nudge
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key) && selected) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        push(prev => prev.map(n => n.id !== selected ? n : {
          ...n,
          x: n.x + (e.key === "ArrowRight" ? delta : e.key === "ArrowLeft" ? -delta : 0),
          y: n.y + (e.key === "ArrowDown" ? delta : e.key === "ArrowUp" ? -delta : 0),
        }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, nodes, undo, redo]);

  // ── Drag to move/resize ──
  const startDrag = useCallback((e, id, mode = "move") => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if (!node || node.locked) return;
    setSelected(id);
    dragState.current = {
      id, mode,
      startX: e.clientX, startY: e.clientY,
      origX: node.x, origY: node.y,
      origW: node.w, origH: node.h,
    };
    const onMove = (ev) => {
      if (!dragState.current) return;
      const { id, mode, startX, startY, origX, origY, origW, origH } = dragState.current;
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;
      push(prev => prev.map(n => {
        if (n.id !== id) return n;
        if (mode === "move") {
          const rawX = Math.max(0, origX + dx);
          const rawY = Math.max(0, origY + dy);
          const others = prev.filter(o => o.id !== id);
          const { sx, sy, guides: g } = getSnapGuides(rawX, rawY, n.w, n.h, others);
          setGuides(g);
          return { ...n, x: sx, y: sy };
        }
        let { x, y, w, h } = { x: origX, y: origY, w: origW, h: origH };
        if (mode.includes("e"))  w = snap(Math.max(20, origW + dx));
        if (mode.includes("s"))  h = snap(Math.max(8,  origH + dy));
        if (mode.includes("w")) { w = snap(Math.max(20, origW - dx)); x = snap(origX + origW - w); }
        if (mode.includes("n")) { h = snap(Math.max(8,  origH - dy)); y = snap(origY + origH - h); }
        return { ...n, x, y, w, h };
      }));
    };
    const onUp = () => {
      dragState.current = null;
      setGuides([]);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [nodes, zoom, isPreview, push]);

  // ── Drop from sidebar ──
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData("compDef");
    if (!raw) return;
    const def = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(Math.max(0, (e.clientX - rect.left) / zoom - def.defaultW / 2));
    const y = snap(Math.max(0, (e.clientY - rect.top) / zoom - def.defaultH / 2));
    const newNode = {
      id: `${def.type}-${Date.now()}`,
      type: def.type,
      x, y,
      w: def.defaultW,
      h: def.defaultH,
      props: { ...def.props },
      locked: false,
      hidden: false,
      name: def.label,
    };
    push(prev => [...prev, newNode]);
    setSelected(newNode.id);
  };

  const deleteSelected = () => {
    if (!selected) return;
    push(prev => prev.filter(n => n.id !== selected));
    setSelected(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const orig = nodes.find(n => n.id === selected);
    if (!orig) return;
    const copy = { ...orig, id: `${orig.type}-${Date.now()}`, x: orig.x + 24, y: orig.y + 24, props: { ...orig.props } };
    push(prev => [...prev, copy]);
    setSelected(copy.id);
  };

  const updateNode = (updated) => {
    push(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const toggleLock = (id) => push(prev => prev.map(n => n.id === id ? { ...n, locked: !n.locked } : n));
  const toggleHide = (id) => push(prev => prev.map(n => n.id === id ? { ...n, hidden: !n.hidden } : n));

  // ── Alignment ──
  const align = (type) => {
    const ids = multiSelected.length > 1 ? multiSelected : (selected ? [selected] : []);
    if (ids.length < 1) return;
    const targets = nodes.filter(n => ids.includes(n.id));
    const canvasW = canvasRef.current?.offsetWidth || 1200;
    push(prev => prev.map(n => {
      if (!ids.includes(n.id)) return n;
      const minX = Math.min(...targets.map(t => t.x));
      const maxX = Math.max(...targets.map(t => t.x + t.w));
      const minY = Math.min(...targets.map(t => t.y));
      const maxY = Math.max(...targets.map(t => t.y + t.h));
      switch (type) {
        case "left":   return { ...n, x: minX };
        case "right":  return { ...n, x: maxX - n.w };
        case "top":    return { ...n, y: minY };
        case "bottom": return { ...n, y: maxY - n.h };
        case "cx":     return { ...n, x: Math.round((minX + maxX) / 2 - n.w / 2) };
        case "cy":     return { ...n, y: Math.round((minY + maxY) / 2 - n.h / 2) };
        case "canvas-cx": return { ...n, x: snap((canvasW - n.w) / 2) };
        default: return n;
      }
    }));
  };

  // ── AI Generate ──
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.payload.components || []).map((c, i) => ({
          id: `${c.type}-ai-${Date.now()}-${i}`,
          type: c.type,
          x: snap(c.position?.x || 40),
          y: snap(c.position?.y || i * 80 + 40),
          w: 400, h: 80,
          props: { text: c.properties?.content || c.properties?.text || c.type, heading: c.properties?.content || c.type },
          locked: false, hidden: false,
          name: c.type,
        }));
        push(mapped);
        setAiPrompt("");
        showToast("AI layout generated");
      } else {
        showToast(data.message, "error");
      }
    } catch { showToast("AI request failed", "error"); }
    finally { setAiLoading(false); }
  };

  // ── Save ──
  const saveProject = async () => {
    if (!token) { showToast("Not logged in", "error"); return; }
    setSaving(true);
    try {
      const ALLOWED = ["button","input","textarea","text","heading","image","imagegrid","video","container","section","columns","formblock","navbar","footer","hero","card","badge","alert","tabs","productcard","pricingcard","testimonial","blogcard","statcard","divider","spacer","select","checkbox"];
      const comps = nodes.map(n => ({
        id: n.id,
        type: ALLOWED.includes(n.type) ? n.type : "container",
        properties: n.props || {},
        position: { x: n.x || 0, y: n.y || 0 },
        styles: { width: n.w, height: n.h },
      }));
      const body = {
        name: projectName.trim().length >= 2 ? projectName.trim() : "My Project",
        description: "Created with BuildX",
        components: comps,
      };
      const isUpdate = !!currentProjectId;
      const url = isUpdate ? `${API}/projects/${currentProjectId}` : `${API}/projects`;
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (!isUpdate) setCurrentProjectId(data.payload.project._id);
        showToast(isUpdate ? "Project saved!" : "Project created!");
        setTimeout(() => onBack(), 1200);
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch { showToast("Save failed", "error"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="bx-loading">
        <div className="bx-spinner" />
        <span>Loading project…</span>
      </div>
    );
  }

  const visibleNodes = nodes.filter(n => !n.hidden);
  const activeIds = multiSelected.length > 1 ? multiSelected : (selected ? [selected] : []);

  return (
    <div className={`bx-root${isPreview ? " bx-preview-mode" : ""}`}>
      {toast && <div className={`bx-toast bx-toast-${toast.type}`}>{toast.msg}</div>}

      {/* ── Top Bar ── */}
      <header className="bx-topbar">
        <div className="bx-topbar-left">
          <button className="bx-back-btn" onClick={onBack} title="Back to Dashboard">
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
          </button>
          <div className="bx-brand-mark">B</div>
          <input className="bx-project-name" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />
        </div>

        <div className="bx-topbar-center">
          <div className="bx-ai-bar">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ color: "#818cf8", flexShrink: 0 }}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
              placeholder="Describe what to build with AI…"
              onKeyDown={e => e.key === "Enter" && generateWithAI()} />
            <button className="bx-ai-btn" onClick={generateWithAI} disabled={aiLoading}>
              {aiLoading ? <span className="bx-spinner-sm" /> : "Generate"}
            </button>
          </div>
        </div>

        <div className="bx-topbar-right">
          <div className="bx-undo-redo">
            <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            </button>
            <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          </div>

          <div className="bx-zoom-ctrl">
            <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}>+</button>
            <button onClick={() => setZoom(1)} title="Reset zoom">⊙</button>
          </div>

          {!isPreview && (
            <button className="bx-preview-btn" onClick={() => { setSelected(null); setIsPreview(true); }}>
              Preview
            </button>
          )}
          {isPreview && (
            <button className="bx-exit-preview-btn" onClick={() => setIsPreview(false)}>
              Exit Preview
            </button>
          )}
          <button className="bx-save-btn" onClick={saveProject} disabled={saving}>
            {saving ? <span className="bx-spinner-sm" /> : "Save"}
          </button>
        </div>
      </header>

      {/* ── Preview device bar ── */}
      {isPreview && (
        <div className="bx-preview-bar">
          {["desktop","tablet","mobile"].map(d => (
            <button key={d} className={`bx-device-btn${previewDevice === d ? " active" : ""}`} onClick={() => setPreviewDevice(d)}>
              {d === "desktop" ? "Desktop" : d === "tablet" ? "Tablet (768px)" : "Mobile (375px)"}
            </button>
          ))}
        </div>
      )}

      <div className="bx-body">
        {/* ── Left Panel ── */}
        {!isPreview && (
          <aside className="bx-left-panel">
            <div className="bx-panel-tabs">
              <button className={leftTab === "components" ? "active" : ""} onClick={() => setLeftTab("components")}>Components</button>
              <button className={leftTab === "layers" ? "active" : ""} onClick={() => setLeftTab("layers")}>Layers</button>
            </div>

            {leftTab === "components" && (
              <div className="bx-comp-library">
                {COMPONENT_GROUPS.map(group => (
                  <div key={group.group} className="bx-comp-group">
                    <div className="bx-comp-group-label">{group.group}</div>
                    {group.items.map(item => (
                      <div key={item.type} className="bx-comp-item"
                        data-imagegrid={item.type === "imagegrid" ? "true" : undefined}
                        draggable
                        onDragStart={e => { e.dataTransfer.setData("compDef", JSON.stringify(item)); e.dataTransfer.effectAllowed = "copy"; }}>
                        <span className="bx-comp-icon">{item.icon}</span>
                        <span className="bx-comp-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {leftTab === "layers" && (
              <div className="bx-layers-panel">
                <input className="bx-layer-search" placeholder="Search layers…" value={layerSearch} onChange={e => setLayerSearch(e.target.value)} />
                <div className="bx-layers-list">
                  {[...nodes].reverse()
                    .filter(n => !layerSearch || n.name?.toLowerCase().includes(layerSearch.toLowerCase()) || n.type.includes(layerSearch.toLowerCase()))
                    .map(n => (
                      <div key={n.id}
                        className={`bx-layer-item${selected === n.id ? " active" : ""}${n.locked ? " locked" : ""}${n.hidden ? " hidden" : ""}`}
                        onClick={() => setSelected(n.id)}>
                        <span className="bx-layer-type-dot" style={{ background: n.locked ? "#f59e0b" : n.hidden ? "#475569" : "#6366f1" }} />
                        <span className="bx-layer-name">{n.name || n.type}</span>
                        <div className="bx-layer-actions">
                          <button onClick={e => { e.stopPropagation(); toggleHide(n.id); }} title={n.hidden ? "Show" : "Hide"}>
                            {n.hidden ? "○" : "●"}
                          </button>
                          <button onClick={e => { e.stopPropagation(); toggleLock(n.id); }} title={n.locked ? "Unlock" : "Lock"}>
                            {n.locked ? "🔒" : "🔓"}
                          </button>
                        </div>
                      </div>
                    ))}
                  {nodes.length === 0 && <div className="bx-layers-empty">No elements yet</div>}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ── Canvas ── */}
        <div className="bx-canvas-wrap" ref={wrapRef}>
          {/* Alignment toolbar */}
          {!isPreview && activeIds.length > 0 && (
            <div className="bx-align-bar">
              {[
                { t: "left",      label: "⇤" , title: "Align left" },
                { t: "cx",        label: "⊕" , title: "Center horizontal" },
                { t: "right",     label: "⇥" , title: "Align right" },
                { t: "top",       label: "⇡" , title: "Align top" },
                { t: "cy",        label: "⊕" , title: "Center vertical" },
                { t: "bottom",    label: "⇣" , title: "Align bottom" },
                { t: "canvas-cx", label: "⊞" , title: "Center on canvas" },
              ].map(a => (
                <button key={a.t} onClick={() => align(a.t)} title={a.title}>{a.label}</button>
              ))}
              <span className="bx-align-sep" />
              <button onClick={duplicateSelected} title="Duplicate (Ctrl+D)">⧉</button>
              <button onClick={deleteSelected} title="Delete (Del)" className="bx-align-del">✕</button>
            </div>
          )}

          <div
            className={`bx-canvas${dragOver ? " drag-over" : ""}${isPreview ? ` bx-preview-${previewDevice}` : ""}`}
            ref={canvasRef}
            style={!isPreview ? { transform: `scale(${zoom})`, transformOrigin: "top left" } : {}}
            onDrop={!isPreview ? handleDrop : undefined}
            onDragOver={!isPreview ? e => { e.preventDefault(); setDragOver(true); } : undefined}
            onDragLeave={!isPreview ? () => setDragOver(false) : undefined}
            onPointerDown={!isPreview ? e => { if (e.target === canvasRef.current) { setSelected(null); setMultiSelected([]); } } : undefined}
          >
            {/* Grid dots */}
            {!isPreview && (
              <svg className="bx-grid" aria-hidden="true">
                <defs><pattern id="bxgrid" width={GRID * 4} height={GRID * 4} patternUnits="userSpaceOnUse"><circle cx="0.5" cy="0.5" r="0.5" fill="#1e1e2e"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#bxgrid)" />
              </svg>
            )}

            {/* Snap guides */}
            {!isPreview && guides.map((g, i) =>
              g.type === "v"
                ? <div key={i} className="bx-guide-v" style={{ left: g.pos }} />
                : <div key={i} className="bx-guide-h" style={{ top: g.pos }} />
            )}

            {/* Empty state */}
            {nodes.length === 0 && !isPreview && (
              <div className="bx-canvas-empty">
                <svg viewBox="0 0 48 48" fill="none" width="48" height="48"><rect x="4" y="4" width="40" height="40" rx="8" stroke="#2a2a3e" strokeWidth="2"/><path d="M16 24h16M24 16v16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                <p>Drag components from the left panel</p>
                <span>or describe what to build in the AI bar above</span>
              </div>
            )}

            {/* Nodes */}
            {visibleNodes.map(node => {
              const isSel = selected === node.id || multiSelected.includes(node.id);
              return (
                <div
                  key={node.id}
                  className={`bx-node bx-node-${node.type}${isSel && !isPreview ? " selected" : ""}${node.locked ? " locked" : ""}${isPreview ? " preview" : ""}`}
                  style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
                  onPointerDown={!isPreview && !node.locked ? e => startDrag(e, node.id) : undefined}
                  onClick={isPreview ? undefined : e => {
                    if (e.shiftKey) {
                      setMultiSelected(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]);
                    } else {
                      setSelected(node.id);
                      setMultiSelected([]);
                    }
                  }}
                >
                  {renderNodeContent(node)}

                  {/* Selection handles */}
                  {isSel && !isPreview && !node.locked && (
                    <>
                      {["nw","n","ne","e","se","s","sw","w"].map(dir => (
                        <div key={dir} className={`bx-handle bx-handle-${dir}`}
                          onPointerDown={e => { e.stopPropagation(); startDrag(e, node.id, `resize-${dir}`); }} />
                      ))}
                      <div className="bx-node-label">{node.name || node.type}</div>
                    </>
                  )}
                  {node.locked && !isPreview && <div className="bx-lock-badge">🔒</div>}
                </div>
              );
            })}
          </div>

          {/* Status bar */}
          {!isPreview && (
            <div className="bx-statusbar">
              <span>{nodes.length} element{nodes.length !== 1 ? "s" : ""}</span>
              {selectedNode && <span>· {selectedNode.type} · {selectedNode.w}×{selectedNode.h} at ({selectedNode.x}, {selectedNode.y})</span>}
              {multiSelected.length > 1 && <span>· {multiSelected.length} selected</span>}
              <span className="bx-statusbar-right">Shift+click to multi-select · Del to delete · Ctrl+Z undo</span>
            </div>
          )}
        </div>

        {/* ── Right Panel ── */}
        {!isPreview && (
          <aside className="bx-right-panel">
            <PropertiesPanel
              node={selectedNode}
              onChange={updateNode}
              onDelete={deleteSelected}
              onDuplicate={duplicateSelected}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
