import { useState, useRef, useCallback, useEffect } from "react";
import "./builder.css";

const API = "http://localhost:5000/api/v1";
const GRID = 8;
const snap = (v, step = GRID) => Math.round(v / step) * step;

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
      { type: "loginform",  label: "Login Form",  icon: "🔐", defaultW: 420, defaultH: 320, props: { title: "Welcome back", subtitle: "Sign in to continue", emailLabel: "Email", passwordLabel: "Password", buttonText: "Login" } },
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
function getSnapGuides(x, y, w, h, others, step = GRID) {
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
  return { sx: snap(sx, step), sy: snap(sy, step), guides };
}

// ─── Component Renderer ───────────────────────────────────────────────────
function normalizeList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const label = item.label ?? item.text ?? item.name ?? item.title;
          if (label) return String(label).trim();
          if (item.url) return String(item.url).trim();
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof value === "string") return value.split(",").map(v => v.trim()).filter(Boolean);
  return Array.isArray(fallback) ? fallback.map(String).map(v => v.trim()).filter(Boolean) : [];
}

function renderNodeContent(node, updateNode, isPreview = false) {
  const p = node.props || {};
  const handleTextChange = (newText) => {
    if (newText !== p.text) {
      const updated = { ...node, props: { ...p, text: newText } };
      updateNode(updated);
    }
  };
  switch (node.type) {
    case "text":
      return (
        <span
          contentEditable
          suppressContentEditableWarning
          style={{ fontSize: p.fontSize || 16, color: p.color || "#1a1a1a", fontWeight: p.fontWeight || "400", lineHeight: 1.5, outline: "none", cursor: "text", userSelect: "text", display: "block", width: "100%", minHeight: 20 }}
          onPointerDown={e => e.stopPropagation()}
          onBlur={e => handleTextChange(e.target.innerText)}
        >{p.text || "Text"}</span>
      );
    case "heading":
      return (
        <span
          contentEditable
          suppressContentEditableWarning
          style={{ fontSize: p.fontSize || 32, color: p.color || "#0f172a", fontWeight: p.fontWeight || "700", lineHeight: 1.2, outline: "none", cursor: "text", userSelect: "text", display: "block", width: "100%", minHeight: 24 }}
          onPointerDown={e => e.stopPropagation()}
          onBlur={e => handleTextChange(e.target.innerText)}
        >{p.text || "Heading"}</span>
      );
    case "button":
      // Make button label directly editable on the canvas.
      return (
        <button
          contentEditable
          suppressContentEditableWarning
          style={{ background: p.bg || "#6366f1", color: p.color || "#fff", border: "none", borderRadius: p.radius || 8, padding: "0 20px", height: "100%", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          onBlur={e => {
            const newText = e.target.innerText;
            if (newText !== p.text) {
              const updated = { ...node, props: { ...p, text: newText } };
              updateNode(updated);
            }
          }}
        >
          {p.text || "Button"}
        </button>
      );
    case "image":
      return p.src
        ? <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <img src={p.src} alt={p.alt || ""} style={{ width: "100%", height: "100%", objectFit: p.fit || "cover", borderRadius: p.radius || 0, display: "block" }}
              onError={e => {
                const wrapper = e.target.parentElement;
                e.target.style.display = "none";
                const fallback = wrapper?.querySelector(".node-img-empty");
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="node-img-empty" style={{ display: "none", position: "absolute", inset: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>Image</span>
            </div>
          </div>
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
                ? <>
                    <img src={img.src} alt={img.alt || `Photo ${i+1}`}
                      style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }}
                      onError={e => {
                        const card = e.target.parentElement;
                        e.target.style.display = "none";
                        const fallback = card?.querySelector(".node-imagegrid-empty-cell");
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="node-imagegrid-empty-cell" style={{ display: "none", flexDirection: "column", gap: 4, position: "absolute", inset: 0 }}>
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <span style={{ fontSize: 9, color: "#f87171" }}>Can't load</span>
                    </div>
                  </>
                : <div className="node-imagegrid-empty-cell"><svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span>{i + 1}</span></div>}
            </div>
          ))}
          {images.length === 0 && (
            <div className="node-imagegrid-placeholder" style={{ gridColumn: `1 / span ${cols}` }}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32"><rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg><span>Image Grid</span>
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
    case "navbar": {
      const links = normalizeList(p.links, ["Home", "About", "Contact"]);
      return (
        <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", gap: 24, fontSize: 14, fontWeight: 600 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{p.brand || "Brand"}</span>
          <div style={{ display: "flex", gap: 18, alignItems: "center", opacity: 0.8, fontSize: 12 }}>
            {links.map((link, index) => <span key={`${link}-${index}`}>{link}</span>)}
          </div>
        </div>
      );
    }
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
    case "input": {
      const inputStyle = {
        width: "100%",
        minHeight: 40,
        height: "100%",
        background: "#ffffff",
        border: "1.5px solid #d1d5db",
        borderRadius: 8,
        padding: "0 12px",
        fontSize: 14,
        lineHeight: "1.4",
        color: "#374151",
        boxSizing: "border-box",
        outline: "none",
        flexShrink: 0,
      };
      const displayValue = p.placeholder || (p.inputType === "email" ? "Enter your email" : p.inputType === "password" ? "Enter your password" : "Enter text...");
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, padding: "2px 0" }}>
          {p.label && (
            <span
              contentEditable
              suppressContentEditableWarning
              onPointerDown={e => e.stopPropagation()}
              onBlur={e => {
                const newLabel = e.target.innerText.trim();
                if (newLabel && newLabel !== p.label) {
                  updateNode({ ...node, props: { ...p, label: newLabel } });
                }
              }}
              style={{ fontSize: 12, fontWeight: 600, color: "#374151", lineHeight: "1.2", display: "block", flexShrink: 0, marginBottom: 2, outline: "none", cursor: "text" }}
            >{p.label}</span>
          )}
          <input
            type={p.inputType || "text"}
            value={displayValue}
            onChange={e => {
              const updated = { ...node, props: { ...p, placeholder: e.target.value } };
              updateNode(updated);
            }}
            onPointerDown={e => e.stopPropagation()}
            style={inputStyle}
          />
        </div>
      );
    }
    case "select": {
      const options = normalizeList(p.options, ["Option 1"]);
      return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>{p.label && <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", lineHeight: "1.2" }}>{p.label}</label>}<div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 13, color: "#94a3b8" }}><span>{options[0] || "Option 1"}</span><span>▾</span></div></div>;
    }
    case "checkbox":
      return <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", fontSize: 13, color: "#374151" }}><div style={{ width: 16, height: 16, border: "2px solid #6366f1", borderRadius: 4, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 10 }}>✓</span></div>{p.label || "Checkbox"}</div>;
    case "textarea": {
      const textareaValue = p.placeholder || "Textarea";
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
          {p.label && (
            <span
              contentEditable
              suppressContentEditableWarning
              onPointerDown={e => e.stopPropagation()}
              onBlur={e => {
                const newLabel = e.target.innerText.trim();
                if (newLabel && newLabel !== p.label) {
                  updateNode({ ...node, props: { ...p, label: newLabel } });
                }
              }}
              style={{ fontSize: 12, fontWeight: 600, color: "#475569", lineHeight: "1.2", outline: "none", cursor: "text" }}
            >{p.label}</span>
          )}
          <textarea
            value={textareaValue}
            onChange={e => {
              const updated = { ...node, props: { ...p, placeholder: e.target.value } };
              updateNode(updated);
            }}
            onPointerDown={e => e.stopPropagation()}
            style={{
              width: "100%",
              flex: 1,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "8px 10px",
              fontSize: 14,
              lineHeight: "1.4",
              color: "#374151",
              resize: "none",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
      );
    }
    case "loginform":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 360, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: "#0f172a" }}>{p.title || "Welcome back"}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.subtitle || "Sign in to continue"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{p.emailLabel || "Email"}</label>
                <input value="you@example.com" readOnly style={{ width: "100%", height: 42, border: "1px solid #dbe2ea", borderRadius: 10, background: "#f8fafc", padding: "0 12px", fontSize: 14, color: "#475569" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{p.passwordLabel || "Password"}</label>
                <input value="••••••••" readOnly type="password" style={{ width: "100%", height: 42, border: "1px solid #dbe2ea", borderRadius: 10, background: "#f8fafc", padding: "0 12px", fontSize: 14, color: "#475569" }} />
              </div>
            </div>
            <button style={{ width: "100%", height: 42, border: "none", borderRadius: 10, background: "#4f46e5", color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{p.buttonText || "Login"}</button>
          </div>
        </div>
      );
    case "formblock":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}><div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{p.title || "Form"}</div><div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6 }} /><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600 }}>{p.cta || "Submit"}</button></div>;
    case "tabs": {
      const tabs = normalizeList(p.tabs, ["Tab 1", "Tab 2"]);
      return <div style={{ display: "flex", gap: 2, height: "100%", alignItems: "center", background: "#f1f5f9", borderRadius: 8, padding: "3px" }}>{tabs.map((t, i) => <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#fff" : "transparent", borderRadius: 6, fontSize: 12, fontWeight: 600, color: i === 0 ? "#0f172a" : "#64748b" }}>{t}</div>)}</div>;
    }
    case "productcard":
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}><div style={{ flex: 1, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#94a3b8" }}>Product Image</div><div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}><div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>{p.brand || "Brand"}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.name || "Product"}</div><div style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>{p.price || "$0.00"}</div><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, padding: "6px", fontSize: 11, fontWeight: 600 }}>Add to Cart</button></div></div>;
    case "pricingcard": {
      const features = normalizeList(p.features, ["Feature 1", "Feature 2"]);
      return <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, width: "100%", height: "100%", padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}><div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{p.plan || "Plan"}</div><div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1" }}>{p.price || "$0/mo"}</div><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>{features.map((f, i) => <div key={i} style={{ fontSize: 12, color: "#475569", display: "flex", gap: 6 }}><span style={{ color: "#22c55e" }}>✓</span>{f}</div>)}</div><button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 13, fontWeight: 600 }}>Get Started</button></div>;
    }
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
          <PropRow label="Type">
            <select className="bx-prop-select" value={p.inputType || "text"} onChange={e => set("inputType", e.target.value)}>
              {["text","email","password","number","tel","url"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </PropRow>
          <PropRow label="Label"><TextInput k="label" /></PropRow>
          <PropRow label="Placeholder"><TextInput k="placeholder" /></PropRow>
          <PropRow label="Upload">
            <label className="bx-prop-upload-btn">
              Browse image
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
      case "loginform":
        return <>
          <PropRow label="Title"><TextInput k="title" /></PropRow>
          <PropRow label="Subtitle"><TextInput k="subtitle" /></PropRow>
          <PropRow label="Email Label"><TextInput k="emailLabel" /></PropRow>
          <PropRow label="Password Label"><TextInput k="passwordLabel" /></PropRow>
          <PropRow label="Button"><TextInput k="buttonText" /></PropRow>
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
  const draftKey = projectId ? `buildx-draft-${projectId}` : "buildx-draft-new";
  const getSavedDraft = () => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return { projectId, updatedAt: 0, nodes: [] };
      const parsed = JSON.parse(raw);
      return {
        projectId: parsed.projectId || projectId || null,
        updatedAt: Number(parsed.updatedAt) || 0,
        nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
      };
    } catch {
      return { projectId, updatedAt: 0, nodes: [] };
    }
  };

  const initialDraft = getSavedDraft();
  const { state: nodes, push, undo, redo, canUndo, canRedo } = useHistory(initialDraft.nodes);
  const [selected, setSelected] = useState(null); // single id
  const [multiSelected, setMultiSelected] = useState([]); // array of ids
  const [guides, setGuides] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(8);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
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
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState("page-1");

  // ── Publish Modal & Deployment State ──
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishStatus, setPublishStatus] = useState("idle"); // "idle" | "publishing" | "success" | "error"
  const [publishedData, setPublishedData] = useState(null); // { url, slug }
  const [publishError, setPublishError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const dragState = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const selectedNode = nodes.find(n => n.id === selected);
  const snapValue = useCallback((value) => {
    if (!Number.isFinite(value)) return 0;
    if (!snapToGrid || (!gridSize && gridSize !== 0)) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [gridSize, snapToGrid]);

  useEffect(() => {
    try {
      const draft = getSavedDraft();
      if (nodes.length > 0) {
        localStorage.setItem(draftKey, JSON.stringify({
          projectId: projectId || draft.projectId || null,
          updatedAt: Date.now(),
          nodes,
        }));
      } else if (!projectId) {
        localStorage.removeItem(draftKey);
      }
    } catch {}
  }, [nodes, draftKey, projectId]);

  useEffect(() => {
    setPages((prev) => {
      if (!prev.length) return prev;
      const pageExists = prev.some((page) => page.id === currentPageId);
      if (!pageExists) {
        return [...prev, { id: currentPageId, name: "Page", components: nodes }];
      }
      const changed = prev.some((page) => page.id === currentPageId && JSON.stringify(page.components) !== JSON.stringify(nodes));
      if (!changed) return prev;
      return prev.map((page) => page.id === currentPageId ? { ...page, components: nodes } : page);
    });
  }, [nodes, currentPageId]);

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

          const projectPages = Array.isArray(p.settings?.pages) && p.settings.pages.length
            ? p.settings.pages.map((page, index) => ({
                id: page.id || `page-${index + 1}`,
                name: page.name || `Page ${index + 1}`,
                components: Array.isArray(page.components) ? page.components.map((c, j) => ({
                  id: c.id || `node-${index}-${j}`,
                  type: c.type,
                  x: c.position?.x ?? j * 20,
                  y: c.position?.y ?? j * 60,
                  w: c.styles?.width ?? 280,
                  h: c.styles?.height ?? 60,
                  props: c.properties || {},
                  locked: false,
                  hidden: false,
                  name: c.properties?.text || c.properties?.heading || c.properties?.title || c.type,
                })) : [],
              }))
            : [{ id: "page-1", name: "Home", components: mapped }];

          const savedDraft = getSavedDraft();
          const draftNodes = Array.isArray(savedDraft.nodes) ? savedDraft.nodes : [];
          const lastSavedAt = Number(p.updatedAt ? new Date(p.updatedAt).getTime() : 0);
          const shouldUseDraft = draftNodes.length > 0 && savedDraft.projectId === projectId && savedDraft.updatedAt > lastSavedAt;
          const initialNodes = shouldUseDraft ? draftNodes : projectPages[0].components;
          const initialPageId = projectPages[0].id;

          setPages(projectPages);
          setCurrentPageId(initialPageId);
          push(initialNodes);

          if (shouldUseDraft) {
            localStorage.setItem(draftKey, JSON.stringify({
              projectId,
              updatedAt: savedDraft.updatedAt,
              nodes: draftNodes,
            }));
          } else {
            localStorage.setItem(draftKey, JSON.stringify({
              projectId,
              updatedAt: lastSavedAt || Date.now(),
              nodes: initialNodes,
            }));
          }
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
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
          const { sx, sy, guides: g } = getSnapGuides(rawX, rawY, n.w, n.h, others, showGuides ? gridSize : GRID);
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
  }, [nodes, zoom, isPreview, push, snapToGrid, gridSize, showGuides]);

  // ── Drop from sidebar ──
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData("compDef");
    if (!raw) return;
    const def = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(Math.max(0, (e.clientX - rect.left) / zoom - def.defaultW / 2), snapToGrid ? gridSize : GRID);
    const y = snap(Math.max(0, (e.clientY - rect.top) / zoom - def.defaultH / 2), snapToGrid ? gridSize : GRID);
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
        case "left":   return { ...n, x: snapToGrid ? snap(minX, gridSize) : minX };
        case "right":  return { ...n, x: snapToGrid ? snap(maxX - n.w, gridSize) : maxX - n.w };
        case "top":    return { ...n, y: snapToGrid ? snap(minY, gridSize) : minY };
        case "bottom": return { ...n, y: snapToGrid ? snap(maxY - n.h, gridSize) : maxY - n.h };
        case "cx":     return { ...n, x: snapToGrid ? snap(Math.round((minX + maxX) / 2 - n.w / 2), gridSize) : Math.round((minX + maxX) / 2 - n.w / 2) };
        case "cy":     return { ...n, y: snapToGrid ? snap(Math.round((minY + maxY) / 2 - n.h / 2), gridSize) : Math.round((minY + maxY) / 2 - n.h / 2) };
        case "canvas-cx": return { ...n, x: snapToGrid ? snap((canvasW - n.w) / 2, gridSize) : (canvasW - n.w) / 2 };
        default: return n;
      }
    }));
  };

  const addPage = () => {
    const pageNumber = pages.length + 1;
    const nextPageId = `page-${Date.now()}`;
    const nextPage = { id: nextPageId, name: `Page ${pageNumber}`, components: [] };
    setPages((prev) => [...prev, nextPage]);
    setCurrentPageId(nextPageId);
    push([]);
    setSelected(null);
  };

  const switchPage = (pageId) => {
    const target = pages.find((page) => page.id === pageId);
    if (!target) return;
    setCurrentPageId(pageId);
    push(target.components || []);
    setSelected(null);
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
        body: JSON.stringify({ prompt: aiPrompt, websiteType: "website" }),
      });
      const data = await res.json();

      if (!data.success || !Array.isArray(data.payload?.components) || data.payload.components.length === 0) {
        showToast(data.message || "AI generation returned no valid components.", "error");
        return;
      }

      const mapped = data.payload.components.map((c, i) => {
        const baseType = String(c.type || "container").toLowerCase();
        const defaultW = (() => {
          if (["navbar", "footer", "section", "hero", "imagegrid", "container"].includes(baseType)) return 760;
          if (["text", "heading", "button", "card", "badge", "alert", "testimonial", "blogcard", "statcard", "input"].includes(baseType)) return 360;
          if (["image"].includes(baseType)) return 420;
          if (["productcard", "pricingcard"].includes(baseType)) return 260;
          return 320;
        })();

        const defaultH = (() => {
          if (["navbar", "footer"].includes(baseType)) return 72;
          if (["hero"].includes(baseType)) return 260;
          if (["imagegrid"].includes(baseType)) return 340;
          if (["productcard", "pricingcard", "card", "blogcard"].includes(baseType)) return 220;
          if (["input", "textarea", "select", "checkbox"].includes(baseType)) return 48;
          return 100;
        })();

        return {
          id: c.id || `${baseType}-ai-${Date.now()}-${i}`,
          type: baseType,
          x: Number.isFinite(Number(c.position?.x)) ? snap(Number(c.position.x)) : 40 + (i % 3) * 30,
          y: Number.isFinite(Number(c.position?.y)) ? snap(Number(c.position.y)) : 40 + Math.floor(i / 3) * 120,
          w: Number(c.styles?.width) || defaultW,
          h: Number(c.styles?.height) || defaultH,
          props: c.properties || {},
          locked: false,
          hidden: false,
          name: c.properties?.heading || c.properties?.title || c.properties?.text || baseType,
        };
      });

      push(prev => [...prev, ...mapped]);
      setAiPrompt("");
      showToast("AI layout generated");
    } catch (error) {
      const message = error?.message || "AI request failed";
      showToast(message, "error");
    } finally {
      setAiLoading(false);
    }
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
      const serializedPages = pages.length
        ? pages.map((page) => ({
            id: page.id,
            name: page.name || "Page",
            components: page.components || [],
          }))
        : [{ id: currentPageId || "page-1", name: "Home", components: comps }];

      const body = {
        name: projectName.trim().length >= 2 ? projectName.trim() : "My Project",
        description: "Created with BuildX",
        components: comps,
        settings: {
          theme: "light",
          layout: "responsive",
          pages: serializedPages,
        },
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
        const savedProject = data.payload.project;
        const savedProjectId = savedProject?._id || currentProjectId;
        if (savedProjectId) {
          setCurrentProjectId(savedProjectId);
          localStorage.setItem(`buildx-draft-${savedProjectId}`, JSON.stringify({
            projectId: savedProjectId,
            updatedAt: Date.now(),
            nodes,
          }));
          localStorage.removeItem("buildx-draft-new");
        }
        showToast(isUpdate ? "Project saved!" : "Project created!");
        setTimeout(() => onBack(), 1200);
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch { showToast("Save failed", "error"); }
    finally { setSaving(false); }
  };

  // ── Publish / Deploy ──
  const publishWebsite = async () => {
    if (!token) { showToast("Not logged in", "error"); return; }
    setPublishModalOpen(true);
    setPublishStatus("publishing");
    setPublishError("");

    try {
      const ALLOWED = ["button","input","textarea","text","heading","image","imagegrid","video","container","section","columns","formblock","navbar","footer","hero","card","badge","alert","tabs","productcard","pricingcard","testimonial","blogcard","statcard","divider","spacer","select","checkbox"];
      const comps = nodes.map(n => ({
        id: n.id,
        type: ALLOWED.includes(n.type) ? n.type : "container",
        properties: n.props || {},
        position: { x: n.x || 0, y: n.y || 0 },
        styles: { width: n.w, height: n.h },
      }));

      let projId = currentProjectId;
      if (!projId) {
        const createRes = await fetch(`${API}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          credentials: "include",
          body: JSON.stringify({
            name: projectName.trim().length >= 2 ? projectName.trim() : "My Project",
            description: "Created with BuildX",
            components: comps,
          }),
        });
        const createData = await createRes.json();
        if (!createData.success) {
          setPublishStatus("error");
          setPublishError(createData.message || "Failed to create project prior to publishing.");
          return;
        }
        projId = createData.payload.project._id;
        setCurrentProjectId(projId);
      }

      const serializedPages = pages.length
        ? pages.map((page) => ({
            id: page.id,
            name: page.name || "Page",
            components: page.components || [],
          }))
        : [{ id: currentPageId || "page-1", name: "Home", components: comps }];

      const pubRes = await fetch(`${API}/projects/${projId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({
          name: projectName.trim().length >= 2 ? projectName.trim() : "My Project",
          components: comps,
          settings: {
            theme: "light",
            layout: "responsive",
            pages: serializedPages,
          },
        }),
      });
      const pubData = await pubRes.json();
      if (pubData.success) {
        setPublishStatus("success");
        setPublishedData({
          url: pubData.payload.publishedUrl,
          slug: pubData.payload.slug,
        });
      } else {
        setPublishStatus("error");
        setPublishError(pubData.message || "Failed to publish website.");
      }
    } catch {
      setPublishStatus("error");
      setPublishError("Connection error while publishing website. Ensure the backend server is reachable.");
    }
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
          <button className="bx-publish-btn" onClick={publishWebsite} title="Publish website to a live URL">
            🚀 Publish
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
              <button className={leftTab === "pages" ? "active" : ""} onClick={() => setLeftTab("pages")}>Pages</button>
            </div>

            <div className="bx-grid-controls">
              <div className="bx-grid-controls-row">
                <label className="bx-toggle">
                  <input type="checkbox" checked={showGrid} onChange={() => setShowGrid(v => !v)} />
                  <span>Show grid</span>
                </label>
                <label className="bx-toggle">
                  <input type="checkbox" checked={snapToGrid} onChange={() => setSnapToGrid(v => !v)} />
                  <span>Snap</span>
                </label>
              </div>
              <div className="bx-grid-controls-row">
                <button className={gridSize === 5 ? "active" : ""} onClick={() => setGridSize(5)}>5 × 5</button>
                <button className={gridSize === 10 ? "active" : ""} onClick={() => setGridSize(10)}>10 × 10</button>
              </div>
              <div className="bx-grid-controls-row custom-row">
                <label htmlFor="custom-grid-size">Custom</label>
                <input
                  id="custom-grid-size"
                  type="number"
                  min="4"
                  max="40"
                  step="1"
                  value={gridSize}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (Number.isFinite(next) && next >= 4 && next <= 40) {
                      setGridSize(next);
                    }
                  }}
                />
              </div>
              <label className="bx-toggle">
                <input type="checkbox" checked={showGuides} onChange={() => setShowGuides(v => !v)} />
                <span>Alignment guides</span>
              </label>
            </div>

            {leftTab === "pages" && (
              <div className="bx-comp-library" style={{ padding: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pages.length === 0 ? (
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>No pages yet</div>
                  ) : (
                    pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => switchPage(page.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: currentPageId === page.id ? "1px solid #818cf8" : "1px solid #e2e8f0",
                          background: currentPageId === page.id ? "rgba(129, 140, 248, 0.12)" : "#ffffff",
                          color: "#0f172a",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {page.name}
                      </button>
                    ))
                  )}
                  <button className="bx-prop-upload-btn" onClick={addPage} style={{ width: "100%" }}>+ Add Page</button>
                </div>
              </div>
            )}

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
            {!isPreview && showGrid && (
              <svg className="bx-grid" aria-hidden="true">
                <defs><pattern id="bxgrid" width={gridSize * 4} height={gridSize * 4} patternUnits="userSpaceOnUse"><circle cx="0.5" cy="0.5" r="0.5" fill="#1e1e2e"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#bxgrid)" />
              </svg>
            )}

            {/* Snap guides */}
            {!isPreview && showGuides && guides.map((g, i) =>
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
                  onPointerDown={!isPreview && !node.locked ? e => {
                    // If the user clicked inside a contentEditable element (text/heading/button),
                    // do NOT start a drag — let the browser place the text cursor.
                    if (e.target.isContentEditable) return;
                    startDrag(e, node.id);
                  } : undefined}
                  onClick={isPreview ? undefined : e => {
                    if (e.shiftKey) {
                      setMultiSelected(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]);
                    } else {
                      setSelected(node.id);
                      setMultiSelected([]);
                    }
                  }}
                >
                  {renderNodeContent(node, updateNode)}

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

      {/* ── Publish / Deployment Modal ── */}
      {publishModalOpen && (
        <div className="bx-modal-overlay" onClick={() => setPublishModalOpen(false)}>
          <div className="bx-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="bx-modal-header">
              <h3>Publish Website</h3>
              <button className="bx-modal-close-btn" onClick={() => setPublishModalOpen(false)}>✕</button>
            </div>

            <div className="bx-modal-body">
              {publishStatus === "publishing" && (
                <>
                  <div className="bx-pub-icon-wrapper bx-pub-icon-publishing">
                    <div className="bx-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                  </div>
                  <h4>Deploying Website…</h4>
                  <p>Generating standalone HTML/CSS bundle and deploying your website to a live URL.</p>
                </>
              )}

              {publishStatus === "success" && (
                <>
                  <div className="bx-pub-icon-wrapper bx-pub-icon-success">✓</div>
                  <h4>Published Successfully!</h4>
                  <p>Your website is now live and accessible globally at the unique URL below:</p>

                  <div className="bx-live-url-box">
                    <span>{publishedData?.url}</span>
                  </div>

                  <div className="bx-live-actions">
                    <a
                      href={publishedData?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bx-btn-open-live"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                      </svg>
                      Open Website
                    </a>
                    <button
                      className="bx-btn-copy-live"
                      onClick={() => {
                        if (publishedData?.url) {
                          navigator.clipboard.writeText(publishedData.url);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                      </svg>
                      {copiedUrl ? "Copied!" : "Copy URL"}
                    </button>
                  </div>
                </>
              )}

              {publishStatus === "error" && (
                <>
                  <div className="bx-pub-icon-wrapper bx-pub-icon-error">⚠</div>
                  <h4>Deployment Failed</h4>
                  <p>{publishError || "An unexpected error occurred while deploying your website."}</p>
                  <button className="bx-btn-retry" onClick={publishWebsite}>
                    Retry Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
