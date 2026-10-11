import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./builder.css";
import { API_BASE as API } from "./api.js";
import { COMPONENT_GROUPS } from "./componentLibrary.js";
import { useHistory } from "./hooks/useHistory.js";
const GRID = 8;
const snap = (v, step = GRID) => Math.round(v / step) * step;

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  return String(value);
}

function parseHexOrRgb(color) {
  if (!color || typeof color !== "string") return null;
  const trimmed = color.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("#")) {
    const hex = trimmed.length === 4
      ? trimmed.split("").map(ch => ch + ch).join("").slice(1)
      : trimmed.slice(1);
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    const num = Number.parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];

  return null;
}

function getReadableTextColor(bgColor, darkFallback = "#0f172a", lightFallback = "#f8fafc") {
  const rgb = parseHexOrRgb(bgColor);
  if (!rgb) return darkFallback;
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.68 ? darkFallback : lightFallback;
}

function sanitizeComponentProps(type, props = {}) {
  const next = { ...(props || {}) };
  switch (type) {
    case "text":
      return {
        ...next,
        text: safeText(next.text, "Text"),
        fontSize: Number.isFinite(Number(next.fontSize)) ? Number(next.fontSize) : 16,
        color: safeText(next.color, getReadableTextColor(next.bg || "#ffffff", "#0f172a", "#f8fafc")),
        fontWeight: next.fontWeight || "400",
      };
    case "heading":
      return {
        ...next,
        text: safeText(next.text, "Heading"),
        fontSize: Number.isFinite(Number(next.fontSize)) ? Number(next.fontSize) : 32,
        color: safeText(next.color, getReadableTextColor(next.bg || "#ffffff", "#0f172a", "#f8fafc")),
        fontWeight: next.fontWeight || "700",
      };
    case "button":
      return {
        ...next,
        text: safeText(next.text, "Button"),
        bg: safeText(next.bg, "#6366f1"),
        color: safeText(next.color, "#ffffff"),
        radius: Number.isFinite(Number(next.radius)) ? Number(next.radius) : 8,
      };
    case "navbar":
      return {
        ...next,
        brand: safeText(next.brand, "Brand"),
        links: next.links || "Home, About, Contact",
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
      };
    case "footer":
      return {
        ...next,
        text: safeText(next.text, "© 2026 Your Company. All rights reserved."),
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
      };
    case "hero":
      return {
        ...next,
        heading: safeText(next.heading, "Your Big Headline"),
        subtext: safeText(next.subtext, "Supporting description text."),
        cta: safeText(next.cta, "Get Started"),
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
      };
    case "card":
      return {
        ...next,
        title: safeText(next.title, "Card Title"),
        body: safeText(next.body, "Card description goes here."),
        bg: safeText(next.bg, "#ffffff"),
        radius: Number.isFinite(Number(next.radius)) ? Number(next.radius) : 12,
      };
    case "badge":
      return {
        ...next,
        text: safeText(next.text, "New"),
        bg: safeText(next.bg, "#6366f1"),
        color: safeText(next.color, "#ffffff"),
      };
    case "alert":
      return {
        ...next,
        text: safeText(next.text, "This is an alert message."),
        type: next.type || "info",
      };
    case "pricingcard":
      return {
        ...next,
        plan: safeText(next.plan, "Pro"),
        price: safeText(next.price, "$49/mo"),
        features: safeText(next.features, "Feature 1, Feature 2, Feature 3"),
      };
    case "testimonial":
      return {
        ...next,
        quote: safeText(next.quote, "This product changed everything for us."),
        author: safeText(next.author, "Jane Doe"),
        role: safeText(next.role, "CEO, Acme Inc."),
      };
    case "blogcard":
      return {
        ...next,
        title: safeText(next.title, "Article Title"),
        author: safeText(next.author, "Author Name"),
        category: safeText(next.category, "Design"),
        readTime: safeText(next.readTime, "5 min read"),
      };
    case "statcard":
      return {
        ...next,
        value: safeText(next.value, "12,400"),
        label: safeText(next.label, "Monthly Users"),
        trend: safeText(next.trend, "+24%"),
      };
    case "formblock":
      return {
        ...next,
        title: safeText(next.title, "Contact Us"),
        cta: safeText(next.cta, "Send Message"),
      };
    case "loginform":
      return {
        ...next,
        title: safeText(next.title, "Welcome back"),
        subtitle: safeText(next.subtitle, "Sign in to continue"),
        emailLabel: safeText(next.emailLabel, "Email"),
        passwordLabel: safeText(next.passwordLabel, "Password"),
        buttonText: safeText(next.buttonText, "Login"),
      };
    case "input":
    case "textarea":
      return {
        ...next,
        label: safeText(next.label, "Label"),
        placeholder: safeText(next.placeholder, type === "textarea" ? "Enter message..." : "Enter text..."),
      };
    case "select":
      return {
        ...next,
        label: safeText(next.label, "Choose option"),
        options: safeText(next.options, "Option 1, Option 2, Option 3"),
      };
    case "checkbox":
      return {
        ...next,
        label: safeText(next.label, "I agree to terms"),
      };
    case "section":
    case "container":
    case "columns":
      return {
        ...next,
        bg: safeText(next.bg, type === "section" ? "#f8fafc" : type === "container" ? "#ffffff" : "#f8fafc"),
      };
    default:
      return next;
  }
}

function serializeNodeForStorage(node) {
  const safeType = ["button","input","textarea","text","heading","image","imagegrid","video","container","section","columns","formblock","navbar","footer","hero","card","badge","alert","tabs","productcard","pricingcard","testimonial","blogcard","statcard","divider","spacer","select","checkbox"].includes(node?.type) ? node.type : "container";

  return {
    id: node?.id || `node-${Date.now()}`,
    type: safeType,
    parentId: node?.parentId || null,
    properties: sanitizeComponentProps(safeType, node?.props || {}),
    position: {
      x: Number.isFinite(Number(node?.x)) ? Number(node.x) : 0,
      y: Number.isFinite(Number(node?.y)) ? Number(node.y) : 0,
    },
    styles: {
      width: Number.isFinite(Number(node?.w)) ? Number(node.w) : 280,
      height: Number.isFinite(Number(node?.h)) ? Number(node.h) : 60,
    },
  };
}

function restoreNodeFromProject(component, index = 0) {
  const type = component?.type || "container";
  return {
    id: component?.id || `node-${index}`,
    type,
    x: Number.isFinite(Number(component?.position?.x)) ? Number(component.position.x) : index * 20,
    y: Number.isFinite(Number(component?.position?.y)) ? Number(component.position.y) : index * 60,
    w: Number.isFinite(Number(component?.styles?.width)) ? Number(component.styles.width) : 280,
    h: Number.isFinite(Number(component?.styles?.height)) ? Number(component.styles.height) : 60,
    props: sanitizeComponentProps(type, component?.properties || {}),
    parentId: component?.parentId || null,
    locked: false,
    hidden: false,
    name: component?.properties?.text || component?.properties?.heading || component?.properties?.title || component?.properties?.brand || component?.type || "Component",
  };
}

// ─── History (Undo/Redo) — see hooks/useHistory.js ──────────────────────────

// ─── Component Library — see componentLibrary.js ─────────────────────────────

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

function renderNodeContent(node, updateNode, isPreview = false, allNodes = []) {
  const p = sanitizeComponentProps(node.type, node.props || {});
  const handleTextChange = (newText) => {
    if (newText !== p.text) {
      const updated = { ...node, props: { ...p, text: newText } };
      updateNode(updated);
    }
  };
  const childNodes = (allNodes || []).filter(n => n.parentId === node.id && !n.hidden);

  switch (node.type) {
    case "text":
      return (
        <span
          contentEditable
          suppressContentEditableWarning
          style={{ fontSize: p.fontSize || 16, color: p.color || "#0f172a", fontWeight: p.fontWeight || "400", lineHeight: 1.5, outline: "none", cursor: "text", userSelect: "text", display: "block", width: "100%", minHeight: 20 }}
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
      return (
        <button
          contentEditable
          suppressContentEditableWarning
          style={{ background: p.bg || "#6366f1", color: p.color || "#ffffff", border: "none", borderRadius: p.radius || 8, padding: "0 20px", height: "100%", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
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
        <div style={{ background: p.bg || "#0f172a", color: p.color || getReadableTextColor(p.bg || "#0f172a", "#0f172a", "#f8fafc"), width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", gap: 24, fontSize: 14, fontWeight: 600 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{safeText(p.brand, "Brand")}</span>
          <div style={{ display: "flex", gap: 18, alignItems: "center", opacity: 0.8, fontSize: 12 }}>
            {links.map((link, index) => <span key={`${link}-${index}`}>{link}</span>)}
          </div>
        </div>
      );
    }
    case "footer":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || getReadableTextColor(p.bg || "#0f172a", "#0f172a", "#f8fafc"), width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{safeText(p.text, "© 2026 Your Company. All rights reserved.")}</div>;
    case "hero":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", gap: 10 }}><div style={{ fontSize: Math.min(28, (p.fontSize || 36)), fontWeight: 800, lineHeight: 1.2 }}>{p.heading || "Hero Heading"}</div><div style={{ fontSize: 13, opacity: 0.7, maxWidth: 400 }}>{p.subtext || "Subtext"}</div><button style={{ marginTop: 8, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{p.cta || "Get Started"}</button></div>;
    case "card":
      return <div style={{ background: p.bg || "#ffffff", width: "100%", height: "100%", borderRadius: p.radius || 12, padding: "16px", display: "flex", flexDirection: "column", gap: 6, border: "1px solid #e2e8f0" }}><div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{p.title || "Card Title"}</div><div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{p.body || "Card description."}</div></div>;
    case "section":
      return (
        <div style={{ background: p.bg || "#f8fafc", width: "100%", height: "100%", border: "1px dashed #cbd5e1", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
          {childNodes.length > 0 ? childNodes.map((child) => (
            <div key={child.id} style={{ position: "relative", minHeight: 24 }}>
              {renderNodeContent(child, updateNode, isPreview, allNodes)}
            </div>
          )) : <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Section</span>}
        </div>
      );
    case "container":
      return (
        <div style={{ background: p.bg || "#ffffff", width: "100%", height: "100%", border: "1px dashed #cbd5e1", borderRadius: 6, padding: 10, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
          {childNodes.length > 0 ? childNodes.map((child) => (
            <div key={child.id} style={{ position: "relative", minHeight: 24 }}>
              {renderNodeContent(child, updateNode, isPreview, allNodes)}
            </div>
          )) : <span style={{ fontSize: 11, color: "#94a3b8" }}>Container</span>}
        </div>
      );
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
    case "columns": {
      const columnCount = Math.max(1, Number(p.cols || 2));
      const columnChildren = childNodes.length > 0 ? childNodes : Array.from({ length: columnCount }, (_, i) => ({ id: `${node.id}-col-${i}`, type: "container", parentId: node.id, props: { bg: "#f8fafc" } }));
      return (
        <div style={{ display: "flex", gap: 8, width: "100%", height: "100%", padding: 4 }}>
          {columnChildren.map((child, index) => (
            <div key={child.id || `${node.id}-col-${index}`} style={{ flex: 1, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 6, padding: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {child.type === "container" || child.type === "section" || child.type === "text" || child.type === "heading" || child.type === "button" ? renderNodeContent({ ...child, props: sanitizeComponentProps(child.type, child.props || {}) }, updateNode, isPreview, allNodes) : <span style={{ fontSize: 11, color: "#94a3b8" }}>Col {index + 1}</span>}
            </div>
          ))}
        </div>
      );
    }
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
export default function Builder({ token: propToken, projectId: propProjectId, onBack }) {
  const { projectId: routeProjectId } = useParams();
  const navigate = useNavigate();
  const projectId = propProjectId || routeProjectId || null;
  const token = propToken || localStorage.getItem("token") || "";

  const handleBack = () => {
    if (onBack) onBack();
    navigate("/dashboard");
  };

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
  const { state: nodes = [], push, undo, redo, canUndo, canRedo } = useHistory(initialDraft?.nodes || []);
  const [selected, setSelected] = useState(null); // single id
  const [multiSelected, setMultiSelected] = useState([]); // array of ids
  const [guides, setGuides] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [gridType, setGridType] = useState("columns");
  const [gridColumns, setGridColumns] = useState(12);
  const [gridRows, setGridRows] = useState(8);
  const [gridSquareCount, setGridSquareCount] = useState(8);
  const [gridSize, setGridSize] = useState(8);
  const [gridGap, setGridGap] = useState(24);
  const [gridMargin, setGridMargin] = useState(40);
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

  const selectedNode = (nodes || []).find(n => n.id === selected);
  const gridSnapStep = gridType === "columns"
    ? Math.max(1, (1200 - (gridMargin * 2) + gridGap) / Math.max(1, gridColumns))
    : gridType === "square"
      ? Math.max(1, (1200 - (gridMargin * 2) + ((gridSquareCount - 1) * gridGap)) / Math.max(1, gridSquareCount))
      : Math.max(1, (800 - (gridMargin * 2) + ((gridRows - 1) * gridGap)) / Math.max(1, gridRows));

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
          const mapped = (p.components || []).map((c, i) => restoreNodeFromProject(c, i));

          const projectPages = Array.isArray(p.settings?.pages) && p.settings.pages.length
            ? p.settings.pages.map((page, index) => ({
                id: page.id || `page-${index + 1}`,
                name: page.name || `Page ${index + 1}`,
                components: Array.isArray(page.components) ? page.components.map((c, j) => restoreNodeFromProject(c, j)) : [],
              }))
            : [{ id: "page-1", name: "Home", components: mapped }];

          const savedDraft = getSavedDraft();
          const draftNodes = Array.isArray(savedDraft.nodes) ? savedDraft.nodes : [];
          const lastSavedAt = Number(p.updatedAt ? new Date(p.updatedAt).getTime() : 0);
          const shouldUseDraft = draftNodes.length > 0 && savedDraft.projectId === projectId && Number(savedDraft.updatedAt || 0) > lastSavedAt;
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

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    push(prev => prev.filter(n => n.id !== selected));
    setSelected(null);
  }, [selected, push]);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    const orig = (nodes || []).find(n => n.id === selected);
    if (!orig) return;
    const copy = { ...orig, id: `${orig.type}-${Date.now()}`, x: orig.x + 24, y: orig.y + 24, props: { ...orig.props } };
    push(prev => [...prev, copy]);
    setSelected(copy.id);
  }, [selected, nodes, push]);

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
  }, [selected, nodes, undo, redo, deleteSelected, duplicateSelected, push]);

  // ── Drag to move/resize ──
  const startDrag = useCallback((e, id, mode = "move") => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    const node = (nodes || []).find(n => n.id === id);
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
          const { sx, sy, guides: g } = getSnapGuides(rawX, rawY, n.w, n.h, others, gridSnapStep);
          setGuides(g);
          return { ...n, x: snapToGrid ? sx : rawX, y: snapToGrid ? sy : rawY };
        }
        let { x, y, w, h } = { x: origX, y: origY, w: origW, h: origH };
        const resizeSnap = value => snapToGrid ? snap(value, gridSnapStep) : value;
        if (mode.includes("e"))  w = resizeSnap(Math.max(20, origW + dx));
        if (mode.includes("s"))  h = resizeSnap(Math.max(8,  origH + dy));
        if (mode.includes("w")) { w = resizeSnap(Math.max(20, origW - dx)); x = resizeSnap(origX + origW - w); }
        if (mode.includes("n")) { h = resizeSnap(Math.max(8, origH - dy)); y = resizeSnap(origY + origH - h); }
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
  }, [nodes, zoom, isPreview, push, snapToGrid, gridSnapStep]);

  // ── Drop from sidebar ──
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData("compDef");
    if (!raw) return;
    const def = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(Math.max(0, (e.clientX - rect.left) / zoom - def.defaultW / 2), snapToGrid ? gridSnapStep : 1);
    const y = snap(Math.max(0, (e.clientY - rect.top) / zoom - def.defaultH / 2), snapToGrid ? gridSnapStep : 1);
    let parentId = null;
    const parentNode = (nodes || []).find((node) => {
      if (node.type !== "section" && node.type !== "container" && node.type !== "columns") return false;
      return x >= node.x && y >= node.y && x + def.defaultW <= node.x + node.w && y + def.defaultH <= node.y + node.h;
    });
    if (parentNode) {
      parentId = parentNode.id;
    }

    const newNode = {
      id: `${def.type}-${Date.now()}`,
      type: def.type,
      x: parentNode ? 12 : x,
      y: parentNode ? 12 : y,
      w: def.defaultW,
      h: def.defaultH,
      props: sanitizeComponentProps(def.type, def.props),
      parentId,
      locked: false,
      hidden: false,
      name: def.label,
    };
    push(prev => [...prev, newNode]);
    setSelected(newNode.id);
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
    const target = (pages || []).find((page) => page.id === pageId);
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
          props: sanitizeComponentProps(baseType, c.properties || {}),
          parentId: c.parentId || null,
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
      const comps = nodes.map((n) => serializeNodeForStorage(n));
      const serializedPages = pages.length
        ? pages.map((page) => ({
            id: page.id,
            name: page.name || "Page",
            components: (page.components || []).map((component) => serializeNodeForStorage(component)),
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
        setTimeout(() => handleBack(), 1200);
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
      const comps = nodes.map((n) => serializeNodeForStorage(n));

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

  const visibleNodes = nodes.filter(n => !n.hidden && !n.parentId);
  const activeIds = multiSelected.length > 1 ? multiSelected : (selected ? [selected] : []);

  return (
    <div className={`bx-root${isPreview ? " bx-preview-mode" : ""}`}>
      {toast && <div className={`bx-toast bx-toast-${toast.type}`}>{toast.msg}</div>}

      {/* ── Top Bar ── */}
      <header className="bx-topbar">
        <div className="bx-topbar-left">
          <button className="bx-back-btn" onClick={handleBack} title="Back to Dashboard">
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
                {[["square", "Square"], ["columns", "Columns"], ["rows", "Rows"]].map(([type, label]) => (
                  <button key={type} className={gridType === type ? "active" : ""} onClick={() => setGridType(type)}>{label}</button>
                ))}
              </div>
              <div className="bx-grid-controls-row bx-grid-presets">
                <button className={gridType === "square" && gridSquareCount === 5 ? "active" : ""} onClick={() => { setGridType("square"); setGridSquareCount(5); }}>5 × 5</button>
                <button className={gridType === "square" && gridSquareCount === 8 ? "active" : ""} onClick={() => { setGridType("square"); setGridSquareCount(8); }}>8 × 8</button>
                <button className={gridType === "columns" && gridColumns === 12 ? "active" : ""} onClick={() => { setGridType("columns"); setGridColumns(12); }}>12 columns</button>
              </div>
              <div className="bx-grid-controls-row custom-row">
                <label htmlFor="custom-grid-size">Cell size</label>
                <input
                  id="custom-grid-size"
                  type="number"
                  min="4"
                  max="160"
                  step="1"
                  value={gridSize}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (Number.isFinite(next) && next >= 4 && next <= 160) {
                      setGridSize(next);
                    }
                  }}
                />
              </div>
              <div className="bx-grid-settings">
                <label>Columns <input type="number" min="2" max="24" value={gridColumns} onChange={e => setGridColumns(Math.min(24, Math.max(2, Number(e.target.value) || 2)))} /></label>
                <label>Rows <input type="number" min="2" max="40" value={gridRows} onChange={e => setGridRows(Math.min(40, Math.max(2, Number(e.target.value) || 2)))} /></label>
                <label>Gap <input type="number" min="0" max="120" value={gridGap} onChange={e => setGridGap(Math.min(120, Math.max(0, Number(e.target.value) || 0)))} /></label>
                <label>Margin <input type="number" min="0" max="240" value={gridMargin} onChange={e => setGridMargin(Math.min(240, Math.max(0, Number(e.target.value) || 0)))} /></label>
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
            {/* Editor-only layout grid. It is never part of a saved node or preview. */}
            {!isPreview && showGrid && (
              <div
                className={`bx-grid bx-grid-${gridType}`}
                aria-hidden="true"
                style={{
                  left: gridMargin,
                  right: gridMargin,
                  top: gridMargin,
                  bottom: gridMargin,
                  backgroundSize: gridType === "square" ? `calc((100% - ${(gridSquareCount - 1) * gridGap}px) / ${gridSquareCount}) calc((100% - ${(gridSquareCount - 1) * gridGap}px) / ${gridSquareCount})` : undefined,
                  backgroundImage: gridType === "square"
                    ? "linear-gradient(to right, rgba(99,102,241,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,.12) 1px, transparent 1px)"
                    : gridType === "columns"
                      ? `repeating-linear-gradient(to right, transparent 0, transparent calc((100% - ${(gridColumns - 1) * gridGap}px) / ${gridColumns} - 1px), rgba(99,102,241,.18) calc((100% - ${(gridColumns - 1) * gridGap}px) / ${gridColumns} - 1px), rgba(99,102,241,.18) calc((100% - ${(gridColumns - 1) * gridGap}px) / ${gridColumns}), transparent calc((100% - ${(gridColumns - 1) * gridGap}px) / ${gridColumns} + ${gridGap}px))`
                      : `repeating-linear-gradient(to bottom, transparent 0, transparent calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} - 1px), rgba(99,102,241,.16) calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} - 1px), rgba(99,102,241,.16) calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows}), transparent calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} + ${gridGap}px))`,
                }}
              />
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
                  {renderNodeContent(node, updateNode, false, nodes)}

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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-[bx-fade-in_0.2s_ease-out]" onClick={() => setPublishModalOpen(false)}>
          <div className="bg-bx-bg-elevated border border-bx-border-mid rounded-2xl w-[90%] max-w-[480px] shadow-2xl shadow-black ring-1 ring-white/5 overflow-hidden animate-[bx-pop_0.25s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 px-5 border-b border-bx-border">
              <h3 className="text-[15px] font-bold text-slate-100 m-0">Publish Website</h3>
              <button className="text-bx-text-muted hover:text-bx-text-primary hover:bg-bx-bg-hover rounded-md p-1 transition-colors text-base leading-none cursor-pointer" onClick={() => setPublishModalOpen(false)}>✕</button>
            </div>

            <div className="p-6 px-5 flex flex-col items-center text-center">
              {publishStatus === "publishing" && (
                <>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <div className="bx-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Deploying Website…</h4>
                  <p className="text-[13.5px] text-bx-text-secondary mb-5 leading-relaxed">Generating standalone HTML/CSS bundle and deploying your website to a live URL.</p>
                </>
              )}

              {publishStatus === "success" && (
                <>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">✓</div>
                  <h4 className="text-lg font-bold text-white mb-2">Published Successfully!</h4>
                  <p className="text-[13.5px] text-bx-text-secondary mb-5 leading-relaxed">Your website is now live and accessible globally at the unique URL below:</p>

                  <div className="w-full bg-[#0b0b10] border border-bx-border-mid rounded-xl p-3 px-3.5 flex items-center justify-between gap-2.5 mb-5">
                    <span className="font-mono text-[13px] text-sky-400 break-all text-left">{publishedData?.url}</span>
                  </div>

                  <div className="flex gap-3 w-full">
                    <a
                      href={publishedData?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-[1.2] inline-flex items-center justify-center gap-2 bg-bx-brand hover:bg-bx-brand-hover text-white py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-[0_2px_10px_rgba(99,102,241,0.35)]"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                      </svg>
                      Open Website
                    </a>
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-bx-bg-surface hover:bg-bx-bg-hover border border-bx-border-strong text-bx-text-primary py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer transition-all"
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
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 bg-red-500/15 border border-red-500/30 text-red-400">⚠</div>
                  <h4 className="text-lg font-bold text-white mb-2">Deployment Failed</h4>
                  <p className="text-[13.5px] text-bx-text-secondary mb-5 leading-relaxed">{publishError || "An unexpected error occurred while deploying your website."}</p>
                  <button className="bg-bx-brand hover:bg-bx-brand-hover text-white py-2.5 px-6 rounded-lg text-sm font-semibold border-none cursor-pointer shadow-[0_2px_10px_rgba(99,102,241,0.35)] transition-colors" onClick={publishWebsite}>
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
