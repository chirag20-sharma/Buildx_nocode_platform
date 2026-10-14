import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./builder.css";
import { API_BASE as API } from "./api.js";
import { COMPONENT_GROUPS, SUPPORTED_COMPONENT_TYPES } from "./componentLibrary.js";
import { useHistory } from "./hooks/useHistory.js";
const GRID = 8;
const snap = (v, step = GRID) => Math.round(v / step) * step;

export function toCSSJustify(val) {
  if (val === "between") return "space-between";
  if (val === "around") return "space-around";
  if (val === "evenly") return "space-evenly";
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  return val || "flex-start";
}

export function toCSSAlign(val) {
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  if (val === "stretch") return "stretch";
  if (val === "baseline") return "baseline";
  return val || "stretch";
}

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
        href: safeText(next.href, ""),
        target: next.target || "_self",
      };
    case "heading":
      return {
        ...next,
        text: safeText(next.text, "Heading"),
        fontSize: Number.isFinite(Number(next.fontSize)) ? Number(next.fontSize) : 32,
        color: safeText(next.color, getReadableTextColor(next.bg || "#ffffff", "#0f172a", "#f8fafc")),
        fontWeight: next.fontWeight || "700",
        href: safeText(next.href, ""),
        target: next.target || "_self",
      };
    case "button":
      return {
        ...next,
        text: safeText(next.text, "Button"),
        href: safeText(next.href, ""),
        target: next.target || "_self",
        bg: safeText(next.bg, "#6366f1"),
        color: safeText(next.color, "#ffffff"),
        radius: Number.isFinite(Number(next.radius)) ? Number(next.radius) : 8,
      };
    case "navbar":
      return {
        ...next,
        brand: safeText(next.brand, "Brand"),
        brandUrl: safeText(next.brandUrl, ""),
        links: next.links || "Home, About, Contact",
        linkUrls: safeText(next.linkUrls, ""),
        target: next.target || "_self",
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
      };
    case "footer":
      return {
        ...next,
        text: safeText(next.text, "© 2026 Your Company. All rights reserved."),
        href: safeText(next.href, ""),
        target: next.target || "_self",
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
        pinBottom: next.pinBottom !== undefined ? Boolean(next.pinBottom) : true,
        position: next.position || (next.pinBottom !== false ? "push-bottom" : "normal"),
        marginTop: next.marginTop !== undefined ? next.marginTop : undefined,
        marginBottom: next.marginBottom !== undefined ? next.marginBottom : undefined,
      };
    case "hero":
      return {
        ...next,
        heading: safeText(next.heading, "Your Big Headline"),
        subtext: safeText(next.subtext, "Supporting description text."),
        cta: safeText(next.cta, "Get Started"),
        ctaHref: safeText(next.ctaHref, ""),
        target: next.target || "_self",
        bg: safeText(next.bg, "#0f172a"),
        color: safeText(next.color, getReadableTextColor(next.bg || "#0f172a", "#0f172a", "#f8fafc")),
      };
    case "card":
      return {
        ...next,
        title: safeText(next.title, "Card Title"),
        body: safeText(next.body, "Card description goes here."),
        href: safeText(next.href, ""),
        target: next.target || "_self",
        bg: safeText(next.bg, "#ffffff"),
        radius: Number.isFinite(Number(next.radius)) ? Number(next.radius) : 12,
      };
    case "badge":
      return {
        ...next,
        text: safeText(next.text, "New"),
        href: safeText(next.href, ""),
        target: next.target || "_self",
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
        layout: ["stack", "row", "grid", "freeform"].includes(next.layout) ? next.layout : (type === "columns" ? "grid" : "stack"),
        gap: Number.isFinite(Number(next.gap)) ? Number(next.gap) : 16,
        padding: Number.isFinite(Number(next.padding)) ? Number(next.padding) : (type === "section" ? 32 : 16),
        align: ["start", "center", "end", "stretch"].includes(next.align) ? next.align : "stretch",
        justify: ["start", "center", "end", "between", "around", "evenly"].includes(next.justify) ? next.justify : "start",
        cols: Math.max(1, Math.min(6, Number(next.cols || (type === "columns" ? 2 : 3)))),
        maxWidth: next.maxWidth ? String(next.maxWidth) : (type === "container" ? "1200px" : "100%"),
        radius: Number.isFinite(Number(next.radius)) ? Number(next.radius) : (type === "container" ? 8 : 0),
        borderColor: safeText(next.borderColor, "transparent"),
        position: next.position || (next.pinBottom ? "push-bottom" : "normal"),
        pinBottom: Boolean(next.pinBottom || next.position === "push-bottom"),
        flexGrow: Boolean(next.flexGrow),
        marginTop: next.marginTop !== undefined ? next.marginTop : undefined,
        marginBottom: next.marginBottom !== undefined ? next.marginBottom : undefined,
      };
    default:
      return {
        ...next,
        pinBottom: Boolean(next.pinBottom || next.position === "push-bottom"),
        position: next.position || (next.pinBottom ? "push-bottom" : "normal"),
      };
  }
}

function serializeNodeForStorage(node, index = 0) {
  const safeType = SUPPORTED_COMPONENT_TYPES.includes(node?.type) ? node.type : "container";

  return {
    id: node?.id || `node-${Date.now()}-${index}`,
    type: safeType,
    parentId: node?.parentId || null,
    order: Number.isFinite(Number(node?.order)) ? Number(node.order) : index,
    properties: sanitizeComponentProps(safeType, node?.props || {}),
    position: {
      x: Number.isFinite(Number(node?.x)) ? Number(node.x) : 0,
      y: Number.isFinite(Number(node?.y)) ? Number(node.y) : 0,
    },
    styles: {
      width: Number.isFinite(Number(node?.w)) ? Number(node.w) : (safeType === "section" ? 1200 : 280),
      height: Number.isFinite(Number(node?.h)) ? Number(node.h) : (safeType === "section" ? 200 : 60),
    },
  };
}

function restoreNodeFromProject(component, index = 0) {
  const type = SUPPORTED_COMPONENT_TYPES.includes(component?.type) ? component.type : "container";
  return {
    id: component?.id || `node-${index}`,
    type,
    x: Number.isFinite(Number(component?.position?.x)) ? Number(component.position.x) : 0,
    y: Number.isFinite(Number(component?.position?.y)) ? Number(component.position.y) : 0,
    w: Number.isFinite(Number(component?.styles?.width)) ? Number(component.styles.width) : (type === "section" ? 1200 : 280),
    h: Number.isFinite(Number(component?.styles?.height)) ? Number(component.styles.height) : (type === "section" ? 200 : 60),
    props: sanitizeComponentProps(type, component?.properties || {}),
    parentId: component?.parentId || null,
    order: Number.isFinite(Number(component?.order)) ? Number(component.order) : index,
    locked: false,
    hidden: false,
    name: component?.properties?.text || component?.properties?.heading || component?.properties?.title || component?.properties?.brand || component?.type || "Component",
  };
}

// ─── Hierarchy & Tree Helpers ─────────────────────────────────────────────

// Check if targetId is a descendant of ancestorId (prevents circular nesting)
function isDescendant(nodes, ancestorId, targetId) {
  if (!ancestorId || !targetId) return false;
  if (ancestorId === targetId) return true;
  let curr = (nodes || []).find(n => n.id === targetId);
  while (curr && curr.parentId) {
    if (curr.parentId === ancestorId) return true;
    curr = (nodes || []).find(n => n.id === curr.parentId);
  }
  return false;
}

// Get all descendant IDs of a node (including nested children)
function getAllDescendantIds(nodes, nodeId) {
  const ids = new Set();
  function collect(id) {
    const children = (nodes || []).filter(n => n.parentId === id);
    for (const c of children) {
      ids.add(c.id);
      collect(c.id);
    }
  }
  collect(nodeId);
  return ids;
}

// Recursively duplicate a node and all its descendants with unique IDs
function duplicateNodeRecursive(nodes, rootId) {
  const root = (nodes || []).find(n => n.id === rootId);
  if (!root) return { updatedNodes: nodes, newRootId: null };

  const time = Date.now();
  let counter = 0;

  function clone(node, newParentId) {
    const newId = `${node.type}-${time}-${++counter}`;
    const clonedNode = {
      ...node,
      id: newId,
      parentId: newParentId,
      order: Number(node.order ?? 0) + 1,
      name: `${node.name || node.type} (Copy)`,
      x: node.x + 20,
      y: node.y + 20,
      props: JSON.parse(JSON.stringify(node.props || {})),
    };

    const children = (nodes || []).filter(n => n.parentId === node.id);
    const clonedChildren = children.flatMap(c => clone(c, newId));
    return [clonedNode, ...clonedChildren];
  }

  const newNodes = clone(root, root.parentId);
  const rootIndex = nodes.findIndex(n => n.id === rootId);
  const result = [...nodes];
  result.splice(rootIndex + 1, 0, ...newNodes);

  // Normalize sibling orders for root's parent
  const parentId = root.parentId ?? null;
  const parentSiblings = result.filter(n => (n.parentId ?? null) === parentId);
  parentSiblings.forEach((s, idx) => { s.order = idx; });

  return { updatedNodes: result, newRootId: newNodes[0].id };
}

// Reparent and reorder nodes safely
function reorderNodes(nodes, movedId, targetParentId, insertIndex = null) {
  if (!movedId) return nodes;
  if (targetParentId && (movedId === targetParentId || isDescendant(nodes, movedId, targetParentId))) {
    return nodes; // Prevent self-nesting and circular nesting
  }

  const movedNode = (nodes || []).find(n => n.id === movedId);
  if (!movedNode) return nodes;

  const oldParentId = movedNode.parentId ?? null;
  const isSameParent = oldParentId === targetParentId;

  if (isSameParent) {
    const currentSiblings = (nodes || [])
      .filter(n => (n.parentId ?? null) === targetParentId)
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

    const oldIndex = currentSiblings.findIndex(n => n.id === movedId);
    if (oldIndex === -1) return nodes;

    // Adjust for same-parent forward move off-by-one bug
    const effectiveInsertIndex = insertIndex !== null && insertIndex !== undefined
      ? (insertIndex > oldIndex ? insertIndex - 1 : insertIndex)
      : currentSiblings.length - 1;

    const remainingSiblings = currentSiblings.filter(n => n.id !== movedId);
    const targetIdx = Math.max(0, Math.min(effectiveInsertIndex, remainingSiblings.length));

    const updatedMoved = { ...movedNode, parentId: targetParentId, order: targetIdx };
    remainingSiblings.splice(targetIdx, 0, updatedMoved);

    const orderMap = new Map();
    remainingSiblings.forEach((s, idx) => orderMap.set(s.id, idx));

    return (nodes || []).map(n => orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id) } : n);
  }

  // Cross-parent reparenting: normalize BOTH previous and destination parent siblings
  const oldSiblings = (nodes || [])
    .filter(n => (n.parentId ?? null) === oldParentId && n.id !== movedId)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const targetSiblings = (nodes || [])
    .filter(n => (n.parentId ?? null) === targetParentId && n.id !== movedId)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const targetIdx = insertIndex !== null && insertIndex !== undefined
    ? Math.max(0, Math.min(insertIndex, targetSiblings.length))
    : targetSiblings.length;

  const updatedMovedNode = {
    ...movedNode,
    parentId: targetParentId,
    order: targetIdx,
  };

  targetSiblings.splice(targetIdx, 0, updatedMovedNode);

  const orderMap = new Map();
  oldSiblings.forEach((s, idx) => orderMap.set(s.id, idx));
  targetSiblings.forEach((s, idx) => orderMap.set(s.id, idx));

  return (nodes || []).map(n => {
    if (n.id === movedId) {
      return { ...updatedMovedNode, order: orderMap.get(n.id) ?? targetIdx };
    }
    if (orderMap.has(n.id)) {
      return { ...n, order: orderMap.get(n.id) };
    }
    return n;
  });
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
          contentEditable={!isPreview}
          suppressContentEditableWarning
          style={{ background: p.bg || "#6366f1", color: p.color || "#ffffff", border: "none", borderRadius: p.radius || 8, padding: "0 20px", height: "100%", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          onClick={e => {
            if (!isPreview) return;
            if (p.href) {
              if (p.target === "_blank") window.open(p.href, "_blank", "noopener,noreferrer");
              else window.location.href = p.href;
            }
          }}
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
      const linkUrls = typeof p.linkUrls === "string" ? p.linkUrls.split(",").map(l => l.trim()) : [];
      return (
        <div style={{ background: p.bg || "#0f172a", color: p.color || getReadableTextColor(p.bg || "#0f172a", "#0f172a", "#f8fafc"), width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", gap: 24, fontSize: 14, fontWeight: 600 }}>
          <a
            href={p.brandUrl || "#"}
            onClick={e => { if (!isPreview) e.preventDefault(); }}
            target={p.target || "_self"}
            rel={p.target === "_blank" ? "noopener noreferrer" : undefined}
            style={{ fontWeight: 800, fontSize: 16, color: "inherit", textDecoration: "none", cursor: isPreview ? "pointer" : "default" }}
          >
            {safeText(p.brand, "Brand")}
          </a>
          <div style={{ display: "flex", gap: 18, alignItems: "center", opacity: 0.8, fontSize: 12 }}>
            {links.map((link, index) => {
              const url = linkUrls[index] || `#${link.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <a
                  key={`${link}-${index}`}
                  href={url}
                  onClick={e => { if (!isPreview) e.preventDefault(); }}
                  target={p.target || "_self"}
                  rel={p.target === "_blank" ? "noopener noreferrer" : undefined}
                  style={{ color: "inherit", textDecoration: "none", cursor: isPreview ? "pointer" : "default" }}
                >
                  {link}
                </a>
              );
            })}
          </div>
        </div>
      );
    }
    case "footer":
      return <div style={{ background: p.bg || "#0f172a", color: p.color || getReadableTextColor(p.bg || "#0f172a", "#0f172a", "#f8fafc"), width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{safeText(p.text, "© 2026 Your Company. All rights reserved.")}</div>;
    case "hero":
      return (
        <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", gap: 10 }}>
          <div style={{ fontSize: Math.min(28, (p.fontSize || 36)), fontWeight: 800, lineHeight: 1.2 }}>{p.heading || "Hero Heading"}</div>
          <div style={{ fontSize: 13, opacity: 0.7, maxWidth: 400 }}>{p.subtext || "Subtext"}</div>
          <button
            onClick={e => {
              if (!isPreview) return;
              if (p.ctaHref) {
                if (p.target === "_blank") window.open(p.ctaHref, "_blank", "noopener,noreferrer");
                else window.location.href = p.ctaHref;
              }
            }}
            style={{ marginTop: 8, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {p.cta || "Get Started"}
          </button>
        </div>
      );
    case "card":
      return <div style={{ background: p.bg || "#ffffff", width: "100%", height: "100%", borderRadius: p.radius || 12, padding: "16px", display: "flex", flexDirection: "column", gap: 6, border: "1px solid #e2e8f0" }}><div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{p.title || "Card Title"}</div><div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{p.body || "Card description."}</div></div>;
    case "section": {
      const isRow = p.layout === "row";
      const isGrid = p.layout === "grid";
      const cols = Math.max(1, Number(p.cols || 3));
      return (
        <div style={{
          background: p.bg || "#f8fafc",
          width: "100%",
          minHeight: 100,
          border: isPreview ? (p.borderColor && p.borderColor !== "transparent" ? `1px solid ${p.borderColor}` : undefined) : "1px dashed #cbd5e1",
          borderRadius: p.radius ? `${p.radius}px` : 10,
          padding: p.padding ?? 24,
          display: isGrid ? "grid" : "flex",
          gridTemplateColumns: isGrid ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
          flexDirection: isRow ? "row" : "column",
          flexWrap: isRow ? "wrap" : undefined,
          alignItems: p.align || "stretch",
          justifyContent: p.justify || "start",
          gap: p.gap ?? 16,
          overflow: "hidden",
        }}>
          {childNodes.length > 0 ? childNodes.map((child) => (
            <div key={child.id} style={{ position: "relative", minHeight: 24, width: isRow ? "auto" : "100%" }}>
              {renderNodeContent(child, updateNode, isPreview, allNodes)}
            </div>
          )) : (!isPreview && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Section</span>)}
        </div>
      );
    }
    case "container": {
      const isRow = p.layout === "row";
      const isGrid = p.layout === "grid";
      const cols = Math.max(1, Number(p.cols || 3));
      return (
        <div style={{
          background: p.bg || "#ffffff",
          width: "100%",
          maxWidth: p.maxWidth || "1200px",
          margin: "0 auto",
          minHeight: 60,
          border: isPreview ? (p.borderColor && p.borderColor !== "transparent" ? `1px solid ${p.borderColor}` : undefined) : "1px dashed #cbd5e1",
          borderRadius: p.radius ? `${p.radius}px` : 8,
          padding: p.padding ?? 16,
          display: isGrid ? "grid" : "flex",
          gridTemplateColumns: isGrid ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
          flexDirection: isRow ? "row" : "column",
          flexWrap: isRow ? "wrap" : undefined,
          alignItems: p.align || "stretch",
          justifyContent: p.justify || "start",
          gap: p.gap ?? 12,
          overflow: "hidden",
        }}>
          {childNodes.length > 0 ? childNodes.map((child) => (
            <div key={child.id} style={{ position: "relative", minHeight: 24, width: isRow ? "auto" : "100%" }}>
              {renderNodeContent(child, updateNode, isPreview, allNodes)}
            </div>
          )) : (!isPreview && <span style={{ fontSize: 11, color: "#94a3b8" }}>Container</span>)}
        </div>
      );
    }
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
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: p.gap ?? 12, width: "100%", padding: p.padding ?? 8 }}>
          {columnChildren.map((child, index) => (
            <div key={child.id || `${node.id}-col-${index}`} style={{ minWidth: 0, background: child.props?.bg || "#f8fafc", border: isPreview ? undefined : "1px dashed #cbd5e1", borderRadius: 6, padding: child.props?.padding ?? 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {renderNodeContent({ ...child, props: sanitizeComponentProps(child.type, child.props || {}) }, updateNode, isPreview, allNodes)}
            </div>
          ))}
        </div>
      );
    }
    default:
      return <span style={{ fontSize: 12, color: "#94a3b8", padding: "0 8px" }}>{node.type}</span>;
  }
}

// ─── Properties Panel Context & Control Components ───────────────────────
const PropContext = createContext({ p: {}, set: () => {} });

function PropRow({ label, children }) {
  return (
    <div className="bx-prop-row">
      <span className="bx-prop-label">{label}</span>
      <div className="bx-prop-control">{children}</div>
    </div>
  );
}

function TextInput({ k, placeholder, type = "text" }) {
  const { p, set } = useContext(PropContext);
  return (
    <input
      type={type}
      className="bx-prop-input"
      value={p[k] ?? ""}
      placeholder={placeholder || k}
      onChange={e => set(k, e.target.value)}
    />
  );
}

function NumberInput({ k, min = 0, max = 9999, step = 1 }) {
  const { p, set } = useContext(PropContext);
  return (
    <input
      className="bx-prop-input bx-prop-number"
      type="number"
      value={p[k] ?? ""}
      min={min}
      max={max}
      step={step}
      onChange={e => {
        const raw = e.target.value;
        if (raw === "") {
          set(k, "");
          return;
        }
        const val = Number(raw);
        set(k, Number.isFinite(val) ? val : min);
      }}
      onBlur={() => {
        if (p[k] === "" || p[k] === undefined) {
          set(k, min);
        } else {
          const val = Number(p[k]);
          if (Number.isFinite(val)) {
            set(k, Math.max(min, Math.min(max, val)));
          }
        }
      }}
    />
  );
}

function ColorInput({ k }) {
  const { p, set } = useContext(PropContext);
  const colorVal = p[k] || "#000000";
  const safeHex = typeof colorVal === "string" && colorVal.startsWith("#") && (colorVal.length === 7 || colorVal.length === 4)
    ? colorVal
    : "#000000";
  return (
    <div className="bx-prop-color-row">
      <input
        type="color"
        className="bx-prop-color"
        value={safeHex}
        onChange={e => set(k, e.target.value)}
      />
      <input
        className="bx-prop-input"
        value={p[k] ?? ""}
        placeholder="#000000"
        onChange={e => set(k, e.target.value)}
      />
    </div>
  );
}

function PropertiesPanel({ node, nodes, onChange, onDelete, onDuplicate }) {
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
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
        </>;
      case "button":
        return <>
          <PropRow label="Text"><TextInput k="text" /></PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={50} /></PropRow>
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://..." /></PropRow>
          <PropRow label="Open in">
            <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
              <option value="_self">Same tab (_self)</option>
              <option value="_blank">New tab (_blank)</option>
            </select>
          </PropRow>
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
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
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
          <PropRow label="Brand Link"><TextInput k="brandUrl" placeholder="/ or https://..." /></PropRow>
          <PropRow label="Links"><TextInput k="links" placeholder="Home, About, Contact" /></PropRow>
          <PropRow label="Link URLs"><TextInput k="linkUrls" placeholder="/home, /about, /contact" /></PropRow>
          <PropRow label="Open in">
            <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
              <option value="_self">Same tab (_self)</option>
              <option value="_blank">New tab (_blank)</option>
            </select>
          </PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "hero":
        return <>
          <PropRow label="Heading"><TextInput k="heading" /></PropRow>
          <PropRow label="Subtext"><TextInput k="subtext" /></PropRow>
          <PropRow label="CTA Text"><TextInput k="cta" /></PropRow>
          <PropRow label="CTA Link"><TextInput k="ctaHref" placeholder="https://... or #section" /></PropRow>
          <PropRow label="Open in">
            <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
              <option value="_self">Same tab (_self)</option>
              <option value="_blank">New tab (_blank)</option>
            </select>
          </PropRow>
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "card":
        return <>
          <PropRow label="Title"><TextInput k="title" /></PropRow>
          <PropRow label="Body"><TextInput k="body" /></PropRow>
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Radius"><NumberInput k="radius" min={0} max={40} /></PropRow>
        </>;
      case "productcard":
        return <>
          <PropRow label="Name"><TextInput k="name" /></PropRow>
          <PropRow label="Brand"><TextInput k="brand" /></PropRow>
          <PropRow label="Price"><TextInput k="price" /></PropRow>
          <PropRow label="Rating"><NumberInput k="rating" min={0} max={5} step={0.1} /></PropRow>
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
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
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
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
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
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
          <PropRow label="Pin to Bottom">
            <div className="bx-prop-segmented">
              {[
                { k: "off", label: "Off", action: () => { set("pinBottom", false); set("position", "normal"); } },
                { k: "push", label: "Push", action: () => { set("pinBottom", true); set("position", "push-bottom"); } },
                { k: "sticky", label: "Sticky", action: () => { set("pinBottom", true); set("position", "sticky-bottom"); } },
                { k: "fixed", label: "Fixed", action: () => { set("pinBottom", true); set("position", "fixed-bottom"); } },
              ].map(opt => {
                const currentPos = p.position || (p.pinBottom ? "push-bottom" : "normal");
                const isActive = opt.k === "off"
                  ? (!p.pinBottom && currentPos === "normal")
                  : (opt.k === "push" ? (currentPos === "push-bottom" || (p.pinBottom && currentPos === "normal")) : currentPos === `${opt.k}-bottom`);
                return (
                  <button
                    key={opt.k}
                    type="button"
                    className={`bx-prop-segment-btn${isActive ? " active" : ""}`}
                    onClick={opt.action}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </PropRow>
          <PropRow label="Link (href)"><TextInput k="href" placeholder="https://... (optional)" /></PropRow>
          {p.href && (
            <PropRow label="Open in">
              <select className="bx-prop-select" value={p.target || "_self"} onChange={e => set("target", e.target.value)}>
                <option value="_self">Same tab (_self)</option>
                <option value="_blank">New tab (_blank)</option>
              </select>
            </PropRow>
          )}
          <PropRow label="BG"><ColorInput k="bg" /></PropRow>
          <PropRow label="Color"><ColorInput k="color" /></PropRow>
        </>;
      case "section":
      case "container":
      case "columns": {
        const layout = p.layout || (node.type === "columns" ? "grid" : "stack");
        return <>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--bx-text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Layout Mode</span>
            <div className="bx-prop-layout-selector">
              {[
                { m: "stack", label: "Stack", icon: "↕" },
                { m: "row", label: "Row", icon: "↔" },
                { m: "grid", label: "Grid", icon: "⊞" },
                { m: "freeform", label: "Free", icon: "⤢" },
              ].map(item => (
                <button
                  key={item.m}
                  type="button"
                  className={`bx-prop-layout-btn${layout === item.m ? " active" : ""}`}
                  onClick={() => set("layout", item.m)}
                  title={`Layout: ${item.label}`}
                >
                  <span style={{ fontSize: 13 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          {layout === "grid" && (
            <PropRow label="Columns">
              <div className="bx-prop-segmented">
                {[1, 2, 3, 4, 6].map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`bx-prop-segment-btn${(p.cols || 2) === c ? " active" : ""}`}
                    onClick={() => set("cols", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </PropRow>
          )}
          {layout !== "freeform" && (
            <>
              <PropRow label="Gap">
                <NumberInput k="gap" min={0} max={64} step={4} />
              </PropRow>
              <PropRow label="Padding">
                <NumberInput k="padding" min={0} max={80} step={4} />
              </PropRow>
              <PropRow label="Align Items">
                <div className="bx-prop-segmented">
                  {[
                    { a: "start", label: "Start" },
                    { a: "center", label: "Center" },
                    { a: "end", label: "End" },
                    { a: "stretch", label: "Fill" },
                  ].map(item => (
                    <button
                      key={item.a}
                      type="button"
                      className={`bx-prop-segment-btn${(p.align || "stretch") === item.a ? " active" : ""}`}
                      onClick={() => set("align", item.a)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </PropRow>
              {(layout === "row" || layout === "stack") && (
                <PropRow label="Justify">
                  <div className="bx-prop-segmented">
                    {[
                      { j: "start", label: "Start" },
                      { j: "center", label: "Center" },
                      { j: "end", label: "End" },
                      { j: "between", label: "Space" },
                      { j: "around", label: "Around" },
                    ].map(item => (
                      <button
                        key={item.j}
                        type="button"
                        className={`bx-prop-segment-btn${(p.justify || "start") === item.j ? " active" : ""}`}
                        onClick={() => set("justify", item.j)}
                        title={layout === "stack" ? `Vertical Justify: ${item.label}` : `Horizontal Justify: ${item.label}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </PropRow>
              )}
            </>
          )}
          <PropRow label="Background"><ColorInput k="bg" /></PropRow>
          {node.type === "container" && (
            <>
              <PropRow label="Max Width">
                <select className="bx-prop-select" value={p.maxWidth || "1200px"} onChange={e => set("maxWidth", e.target.value)}>
                  {["100%", "1200px", "1024px", "800px", "600px", "480px"].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </PropRow>
              <PropRow label="Radius"><NumberInput k="radius" min={0} max={32} /></PropRow>
              <PropRow label="Border"><ColorInput k="borderColor" /></PropRow>
            </>
          )}
        </>;
      }
      case "divider":
        return <PropRow label="Color"><ColorInput k="color" /></PropRow>;
      default:
        return <p style={{ fontSize: 12, color: "#475569", padding: "8px 0" }}>No editable properties.</p>;
    }
  };

  const parentNode = node.parentId ? (nodes || []).find(n => n.id === node.parentId) : null;
  const isInsideFreeform = parentNode?.props?.layout === "freeform";
  const isLayoutContainer = node.type === "section" || node.type === "container" || node.type === "columns";

  return (
    <PropContext.Provider value={{ p, set }}>
      <div className="bx-props-panel">
        <div className="bx-props-header">
          <span className="bx-props-type">{node.type}</span>
          <span className="bx-props-id">{node.id?.slice(-6)}</span>
        </div>

        <div className="bx-props-section">
          <div className="bx-props-section-title">
            {isInsideFreeform ? "Freeform Position & Size" : "Dimensions & Sizing"}
          </div>
          {isInsideFreeform ? (
            <div className="bx-prop-xywh">
              <div className="bx-prop-xywh-item"><span>X</span><input type="number" value={node.x ?? 0} onChange={e => onChange({ ...node, x: e.target.value === "" ? 0 : Number(e.target.value) })} onBlur={() => onChange({ ...node, x: snap(Number(node.x) || 0) })} /></div>
              <div className="bx-prop-xywh-item"><span>Y</span><input type="number" value={node.y ?? 0} onChange={e => onChange({ ...node, y: e.target.value === "" ? 0 : Number(e.target.value) })} onBlur={() => onChange({ ...node, y: snap(Number(node.y) || 0) })} /></div>
              <div className="bx-prop-xywh-item"><span>W</span><input type="number" value={node.w ?? 20} onChange={e => onChange({ ...node, w: e.target.value === "" ? 20 : Number(e.target.value) })} onBlur={() => onChange({ ...node, w: Math.max(20, Number(node.w) || 20) })} /></div>
              <div className="bx-prop-xywh-item"><span>H</span><input type="number" value={node.h ?? 8} onChange={e => onChange({ ...node, h: e.target.value === "" ? 8 : Number(e.target.value) })} onBlur={() => onChange({ ...node, h: Math.max(8, Number(node.h) || 8) })} /></div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {!isLayoutContainer && (
                <PropRow label="Width Mode">
                  <div className="bx-prop-segmented">
                    {[
                      { k: "auto", label: "Auto" },
                      { k: "full", label: "Full" },
                      { k: "custom", label: "Custom" },
                    ].map(item => {
                      const isFull = p.fullWidth === true;
                      const isCustom = !p.fullWidth && Number.isFinite(node.w) && node.w > 0 && node.type !== "button" && node.type !== "badge";
                      const isAuto = !isFull && !isCustom;
                      const active = item.k === "full" ? isFull : (item.k === "custom" ? isCustom : isAuto);
                      return (
                        <button
                          key={item.k}
                          type="button"
                          className={`bx-prop-segment-btn${active ? " active" : ""}`}
                          onClick={() => {
                            if (item.k === "full") {
                              onChange({ ...node, props: { ...p, fullWidth: true } });
                            } else if (item.k === "custom") {
                              onChange({ ...node, w: node.w || 280, props: { ...p, fullWidth: false } });
                            } else {
                              onChange({ ...node, props: { ...p, fullWidth: false } });
                            }
                          }}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </PropRow>
              )}
              {!isLayoutContainer && !p.fullWidth && (
                <PropRow label="Width (px)">
                  <input
                    type="number"
                    className="bx-prop-input bx-prop-number"
                    value={node.w ?? ""}
                    placeholder="auto"
                    min={20}
                    max={2000}
                    step={10}
                    onChange={e => {
                      const raw = e.target.value;
                      if (raw === "") {
                        onChange({ ...node, w: undefined });
                      } else {
                        const val = Number(raw);
                        if (Number.isFinite(val)) onChange({ ...node, w: val });
                      }
                    }}
                    onBlur={() => {
                      if (node.w !== undefined && node.w !== "") {
                        onChange({ ...node, w: Math.max(20, Math.min(2000, Number(node.w) || 20)) });
                      }
                    }}
                  />
                </PropRow>
              )}
              <PropRow label="Min Height">
                <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                  <input
                    type="number"
                    className="bx-prop-input bx-prop-number"
                    value={node.h ?? ""}
                    placeholder={isLayoutContainer ? (node.type === "section" ? "160" : "100") : "auto"}
                    min={0}
                    max={2000}
                    step={8}
                    onChange={e => {
                      const raw = e.target.value;
                      if (raw === "") {
                        onChange({ ...node, h: undefined });
                      } else {
                        const val = Number(raw);
                        if (Number.isFinite(val)) onChange({ ...node, h: val });
                      }
                    }}
                    onBlur={() => {
                      if (node.h !== undefined && node.h !== "") {
                        onChange({ ...node, h: Math.max(0, Math.min(2000, Number(node.h) || 0)) });
                      }
                    }}
                  />
                  {isLayoutContainer && (
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        { label: "Auto", h: undefined },
                        { label: "300px", h: 300 },
                        { label: "600px", h: 600 },
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          className={`bx-prop-segment-btn${node.h === preset.h ? " active" : ""}`}
                          style={{ flex: 1, padding: "2px 4px", fontSize: 10 }}
                          onClick={() => onChange({ ...node, h: preset.h })}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </PropRow>

              <PropRow label="Position">
                <select
                  className="bx-prop-select"
                  value={p.position || (p.pinBottom ? "push-bottom" : "normal")}
                  onChange={e => {
                    const val = e.target.value;
                    set("position", val);
                    set("pinBottom", val === "push-bottom" || val.endsWith("bottom"));
                  }}
                >
                  <option value="normal">Normal (Flow)</option>
                  <option value="push-bottom">Push to Bottom (margin: auto)</option>
                  <option value="sticky-bottom">Sticky Bottom</option>
                  <option value="fixed-bottom">Fixed Bottom</option>
                  <option value="sticky-top">Sticky Top</option>
                  <option value="fixed-top">Fixed Top</option>
                </select>
              </PropRow>

              {!isInsideFreeform && (
                <PropRow label="Align Self">
                  <div className="bx-prop-segmented">
                    {[
                      { a: "auto", label: "Auto" },
                      { a: "flex-start", label: "Start" },
                      { a: "center", label: "Center" },
                      { a: "flex-end", label: "End" },
                      { a: "stretch", label: "Fill" },
                    ].map(item => (
                      <button
                        key={item.a}
                        type="button"
                        className={`bx-prop-segment-btn${(p.alignSelf || "auto") === item.a ? " active" : ""}`}
                        onClick={() => set("alignSelf", item.a === "auto" ? undefined : item.a)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </PropRow>
              )}

              {!isInsideFreeform && (
                <PropRow label="Margin Top">
                  <div style={{ display: "flex", gap: 6, alignItems: "center", width: "100%" }}>
                    <input
                      type="text"
                      className="bx-prop-input"
                      value={p.marginTop ?? ""}
                      placeholder="e.g. 40 or auto"
                      onChange={e => set("marginTop", e.target.value)}
                    />
                    <button
                      type="button"
                      className={`bx-prop-segment-btn${p.marginTop === "auto" ? " active" : ""}`}
                      style={{ flex: "0 0 auto", padding: "4px 8px" }}
                      onClick={() => set("marginTop", p.marginTop === "auto" ? "" : "auto")}
                    >
                      Auto
                    </button>
                  </div>
                </PropRow>
              )}

              {isLayoutContainer && (
                <PropRow label="Fill Space">
                  <div className="bx-prop-segmented">
                    <button
                      type="button"
                      className={`bx-prop-segment-btn${!p.flexGrow ? " active" : ""}`}
                      onClick={() => set("flexGrow", false)}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      className={`bx-prop-segment-btn${p.flexGrow ? " active" : ""}`}
                      onClick={() => set("flexGrow", true)}
                      title="Expand to take available vertical space (flex: 1)"
                    >
                      Expand (Flex 1)
                    </button>
                  </div>
                </PropRow>
              )}
            </div>
          )}
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
    </PropContext.Provider>
  );
}

// ─── Hierarchical Tree Item in Layers Panel ───────────────────────────────
function TreeItem({ node, nodes, depth = 0, selected, setSelected, toggleHide, toggleLock, collapsedIds, setCollapsedIds }) {
  const children = (nodes || []).filter(n => n.parentId === node.id).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const isContainer = node.type === "section" || node.type === "container" || node.type === "columns";
  const isCollapsed = collapsedIds.has(node.id);
  const isSel = selected === node.id;

  const iconMap = {
    section: "▬",
    container: "▭",
    columns: "⊟",
    heading: "H",
    text: "T",
    button: "▶",
    image: "🖼",
    card: "▣",
    hero: "★",
    navbar: "☰",
    footer: "▬",
    input: "▭",
    formblock: "📋",
  };

  return (
    <>
      <div
        className={`bx-tree-node${isSel ? " active" : ""}${node.locked ? " locked" : ""}${node.hidden ? " hidden" : ""}`}
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => setSelected(node.id)}
      >
        {isContainer && children.length > 0 ? (
          <button
            type="button"
            className={`bx-tree-toggle${isCollapsed ? " collapsed" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCollapsedIds(prev => {
                const next = new Set(prev);
                next.has(node.id) ? next.delete(node.id) : next.add(node.id);
                return next;
              });
            }}
          >
            ▾
          </button>
        ) : (
          <span style={{ width: 14 }} />
        )}
        <span className="bx-tree-icon">{iconMap[node.type] || "•"}</span>
        <span className="bx-tree-label">{node.name || node.type}</span>
        <div className="bx-tree-actions">
          <button
            type="button"
            className="bx-tree-action-btn"
            onClick={e => { e.stopPropagation(); toggleHide(node.id); }}
            title={node.hidden ? "Show" : "Hide"}
          >
            {node.hidden ? "○" : "●"}
          </button>
          <button
            type="button"
            className="bx-tree-action-btn"
            onClick={e => { e.stopPropagation(); toggleLock(node.id); }}
            title={node.locked ? "Unlock" : "Lock"}
          >
            {node.locked ? "🔒" : "🔓"}
          </button>
        </div>
      </div>
      {!isCollapsed && children.map(child => (
        <TreeItem
          key={child.id}
          node={child}
          nodes={nodes}
          depth={depth + 1}
          selected={selected}
          setSelected={setSelected}
          toggleHide={toggleHide}
          toggleLock={toggleLock}
          collapsedIds={collapsedIds}
          setCollapsedIds={setCollapsedIds}
        />
      ))}
    </>
  );
}

// ─── Recursive Canvas Node ────────────────────────────────────────────────
function CanvasNode({
  node,
  nodes,
  selected,
  setSelected,
  multiSelected,
  setMultiSelected,
  updateNode,
  startDrag,
  isPreview,
  previewDevice,
  dragTarget,
  setDragTarget,
  onDropItem,
  onStartNodeDrag,
  onDragEnd,
  draggingNodeId,
}) {
  const p = sanitizeComponentProps(node.type, node.props || {});
  const isContainer = node.type === "section" || node.type === "container" || node.type === "columns";
  const isSel = selected === node.id || (multiSelected || []).includes(node.id);
  const isChildSel = !isSel && (nodes || []).some(n => n.id === selected && isDescendant(nodes, node.id, n.id));
  const isDirectDropTarget = dragTarget?.parentId === node.id;

  const children = (nodes || [])
    .filter(n => n.parentId === node.id && !n.hidden)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const layout = p.layout || (node.type === "columns" ? "grid" : "stack");
  const gap = p.gap ?? 16;
  const padding = p.padding ?? (node.type === "section" ? 32 : 16);
  const alignCSS = toCSSAlign(p.align);
  const justifyCSS = toCSSJustify(p.justify);
  const cols = Math.max(1, Number(p.cols || (node.type === "columns" ? 2 : 3)));

  let containerLayoutStyles = {};
  if (isContainer) {
    if (layout === "stack") {
      containerLayoutStyles = {
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
        padding: `${padding}px`,
        alignItems: alignCSS,
        justifyContent: justifyCSS,
      };
    } else if (layout === "row") {
      containerLayoutStyles = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: `${gap}px`,
        padding: `${padding}px`,
        alignItems: alignCSS,
        justifyContent: justifyCSS,
      };
    } else if (layout === "grid") {
      const gridCols = previewDevice === "mobile" ? "1fr" : (previewDevice === "tablet" ? `repeat(${Math.min(2, cols)}, minmax(0, 1fr))` : `repeat(${cols}, minmax(0, 1fr))`);
      containerLayoutStyles = {
        display: "grid",
        gridTemplateColumns: gridCols,
        gap: `${gap}px`,
        padding: `${padding}px`,
        alignItems: alignCSS,
      };
    } else if (layout === "freeform") {
      containerLayoutStyles = {
        position: "relative",
        minHeight: `${Math.max(120, Number(node.h || 240))}px`,
        padding: 0,
      };
    }
  }

  const nodeStyles = {
    background: p.bg || (node.type === "section" ? "#f8fafc" : node.type === "container" ? "#ffffff" : "transparent"),
    borderRadius: p.radius ? `${p.radius}px` : undefined,
    border: p.borderColor && p.borderColor !== "transparent" ? `1px solid ${p.borderColor}` : undefined,
    opacity: draggingNodeId === node.id ? 0.35 : undefined,
    ...containerLayoutStyles,
  };

  const parentNode = (nodes || []).find(n => n.id === node.parentId);

  if (node.type === "section") {
    nodeStyles.width = "100%";
    nodeStyles.minHeight = `${Math.max(100, Number(node.h || 160))}px`;
  } else if (node.type === "container") {
    nodeStyles.width = "100%";
    nodeStyles.maxWidth = p.maxWidth || "1200px";
    nodeStyles.minHeight = `${Math.max(60, Number(node.h || 100))}px`;
  } else if (!isContainer) {
    if (parentNode?.props?.layout === "freeform") {
      nodeStyles.position = "absolute";
      nodeStyles.left = `${node.x}px`;
      nodeStyles.top = `${node.y}px`;
      nodeStyles.width = `${node.w}px`;
      nodeStyles.height = `${node.h}px`;
    } else {
      if (node.type === "heading" || node.type === "text" || node.type === "divider" || node.type === "spacer" || node.type === "input" || node.type === "textarea" || node.type === "hero" || node.type === "navbar" || node.type === "footer") {
        nodeStyles.width = "100%";
      } else if (node.type === "button" || node.type === "badge") {
        nodeStyles.width = p.fullWidth ? "100%" : "auto";
        nodeStyles.display = "inline-flex";
      } else {
        nodeStyles.width = p.fullWidth ? "100%" : (node.w ? `${node.w}px` : "100%");
        nodeStyles.maxWidth = "100%";
      }
      if (node.h) nodeStyles.minHeight = `${node.h}px`;
    }
  }

  // ── Positioning & Pin to Bottom ──
  const pos = p.position || (p.pinBottom ? "push-bottom" : "normal");
  if (pos === "push-bottom" || p.pinBottom) {
    nodeStyles.marginTop = "auto";
  } else if (pos === "sticky-bottom") {
    nodeStyles.position = "sticky";
    nodeStyles.bottom = 0;
    nodeStyles.zIndex = 30;
  } else if (pos === "fixed-bottom") {
    nodeStyles.position = "fixed";
    nodeStyles.bottom = 0;
    nodeStyles.left = 0;
    nodeStyles.width = "100%";
    nodeStyles.zIndex = 30;
  } else if (pos === "sticky-top") {
    nodeStyles.position = "sticky";
    nodeStyles.top = 0;
    nodeStyles.zIndex = 30;
  } else if (pos === "fixed-top") {
    nodeStyles.position = "fixed";
    nodeStyles.top = 0;
    nodeStyles.left = 0;
    nodeStyles.width = "100%";
    nodeStyles.zIndex = 30;
  }

  // ── Custom Margins ──
  if (node.type === "container") {
    const topMargin = p.marginTop !== undefined && p.marginTop !== "" ? (p.marginTop === "auto" ? "auto" : `${Number(p.marginTop) || 0}px`) : ((pos === "push-bottom" || p.pinBottom) ? "auto" : "0px");
    const btmMargin = p.marginBottom !== undefined && p.marginBottom !== "" ? (p.marginBottom === "auto" ? "auto" : `${Number(p.marginBottom) || 0}px`) : "0px";
    nodeStyles.margin = `${topMargin} auto ${btmMargin}`;
  } else {
    if (p.marginTop !== undefined && p.marginTop !== "") {
      nodeStyles.marginTop = p.marginTop === "auto" ? "auto" : `${Number(p.marginTop) || 0}px`;
    }
    if (p.marginBottom !== undefined && p.marginBottom !== "") {
      nodeStyles.marginBottom = p.marginBottom === "auto" ? "auto" : `${Number(p.marginBottom) || 0}px`;
    }
  }

  // ── Flex Grow / Fill Space ──
  if (p.flexGrow) {
    nodeStyles.flex = "1 1 auto";
  }

  // ── Align Self ──
  if (p.alignSelf && p.alignSelf !== "auto") {
    nodeStyles.alignSelf = p.alignSelf;
  }

  const handleDragOver = (e, index) => {
    if (isPreview || node.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setDragTarget({ parentId: node.id, index });
  };

  const handleDrop = (e, index) => {
    if (isPreview || node.locked) return;
    e.preventDefault();
    e.stopPropagation();
    onDropItem(e, node.id, index);
  };

  return (
    <div
      id={`node-${node.id}`}
      className={`bx-layout-node bx-node-${node.type} bx-layout-${layout}${isSel && !isPreview ? " selected" : ""}${isChildSel && !isPreview ? " child-selected" : ""}${isDirectDropTarget && !isPreview ? " bx-drop-target-active" : ""}${isPreview ? " preview" : ""}`}
      style={nodeStyles}
      draggable={!isPreview && !node.locked && parentNode?.props?.layout !== "freeform"}
      onDragStart={!isPreview && !node.locked && parentNode?.props?.layout !== "freeform" ? (e) => {
        if (e.target.isContentEditable) {
          e.preventDefault();
          return;
        }
        onStartNodeDrag(e, node);
      } : undefined}
      onDragEnd={!isPreview ? onDragEnd : undefined}
      onDragOver={isContainer && !isPreview && !node.locked ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragTarget?.parentId !== node.id) {
          setDragTarget({ parentId: node.id, index: children.length });
        }
      } : (!isContainer && !isPreview && !node.locked && node.parentId ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentSiblings = (nodes || []).filter(n => n.parentId === node.parentId).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
        const myIndex = parentSiblings.findIndex(n => n.id === node.id);
        setDragTarget({ parentId: node.parentId, index: myIndex >= 0 ? myIndex + 1 : 0 });
      } : undefined)}
      onDrop={isContainer && !isPreview && !node.locked ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dropIndex = dragTarget?.parentId === node.id ? dragTarget.index : children.length;
        onDropItem(e, node.id, dropIndex);
      } : (!isContainer && !isPreview && !node.locked && node.parentId ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentSiblings = (nodes || []).filter(n => n.parentId === node.parentId).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
        const myIndex = parentSiblings.findIndex(n => n.id === node.id);
        onDropItem(e, node.parentId, myIndex >= 0 ? myIndex + 1 : 0);
      } : undefined)}
      onClick={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        if (e.shiftKey) {
          setMultiSelected(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]);
        } else {
          setSelected(node.id);
          setMultiSelected([]);
        }
      }}
      onPointerDown={(e) => {
        if (isPreview || node.locked) return;
        if (e.target.isContentEditable) return;
        if (parentNode?.props?.layout === "freeform") {
          startDrag(e, node.id);
        }
      }}
    >
      {/* Selection Header Badge & Breadcrumbs */}
      {isSel && !isPreview && !node.locked && (
        <div className="bx-node-badge" onClick={e => e.stopPropagation()}>
          {node.parentId && (
            <button
              type="button"
              className="bx-node-parent-btn"
              onClick={() => setSelected(node.parentId)}
              title="Select parent container"
            >
              ⬆ {parentNode?.name || parentNode?.type || "Parent"}
            </button>
          )}
          <span
            className="bx-node-drag-handle"
            draggable
            onDragStart={(e) => onStartNodeDrag(e, node)}
            onDragEnd={onDragEnd}
            title="Drag to reorder or move into another container"
          >
            ⠿ {node.name || node.type}
          </span>
        </div>
      )}

      {/* Resize handles (in freeform mode) */}
      {isSel && !isPreview && !node.locked && parentNode?.props?.layout === "freeform" && (
        <>
          {["nw","n","ne","e","se","s","sw","w"].map(dir => (
            <div
              key={dir}
              className={`bx-handle bx-handle-${dir}`}
              onPointerDown={e => { e.stopPropagation(); startDrag(e, node.id, `resize-${dir}`); }}
            />
          ))}
        </>
      )}

      {/* Container rendering: recursive child nodes + drop zones */}
      {isContainer ? (
        <>
          {children.length === 0 ? (
            !isPreview && (
              <div
                className={`bx-empty-container${isDirectDropTarget && dragTarget?.index === 0 ? " drop-hover" : ""}`}
                onDragOver={(e) => handleDragOver(e, 0)}
                onDrop={(e) => handleDrop(e, 0)}
              >
                <span style={{ fontSize: 16 }}>{node.type === "section" ? "▬" : node.type === "columns" ? "⊟" : "▭"}</span>
                <span>Empty {node.type} · Drop components here</span>
              </div>
            )
          ) : (
            children.map((child, idx) => (
              <div key={child.id} style={{ display: "contents" }}>
                {/* Insertion slot before child */}
                {!isPreview && (
                  <div
                    style={{
                      height: layout === "row" ? "100%" : 8,
                      width: layout === "row" ? 8 : "100%",
                      margin: layout === "row" ? "0 2px" : "2px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                  >
                    {isDirectDropTarget && dragTarget?.index === idx && (
                      <div className={`bx-drop-indicator-line${layout === "row" ? " vertical" : ""}`} />
                    )}
                  </div>
                )}

                <CanvasNode
                  node={child}
                  nodes={nodes}
                  selected={selected}
                  setSelected={setSelected}
                  multiSelected={multiSelected}
                  setMultiSelected={setMultiSelected}
                  updateNode={updateNode}
                  startDrag={startDrag}
                  isPreview={isPreview}
                  previewDevice={previewDevice}
                  dragTarget={dragTarget}
                  setDragTarget={setDragTarget}
                  onDropItem={onDropItem}
                  onStartNodeDrag={onStartNodeDrag}
                  onDragEnd={onDragEnd}
                  draggingNodeId={draggingNodeId}
                />

                {/* Insertion slot after last child */}
                {!isPreview && idx === children.length - 1 && (
                  <div
                    style={{
                      height: layout === "row" ? "100%" : 8,
                      width: layout === "row" ? 8 : "100%",
                      margin: layout === "row" ? "0 2px" : "2px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onDragOver={(e) => handleDragOver(e, idx + 1)}
                    onDrop={(e) => handleDrop(e, idx + 1)}
                  >
                    {isDirectDropTarget && dragTarget?.index === idx + 1 && (
                      <div className={`bx-drop-indicator-line${layout === "row" ? " vertical" : ""}`} />
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      ) : (
        renderNodeContent(node, updateNode, isPreview, nodes)
      )}
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
    if (!projectId) {
      try { localStorage.removeItem("buildx-draft-new"); } catch {}
    }
    if (onBack) onBack();
    navigate("/dashboard");
  };

  const draftKey = projectId ? `buildx-draft-${projectId}` : "buildx-draft-new";
  const getSavedDraft = () => {
    try {
      if (!projectId) return { projectId: null, updatedAt: 0, nodes: [] };
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

  const { state: nodes = [], push, undo, redo, reset, canUndo, canRedo } = useHistory([]);
  const isInitializedRef = useRef(!projectId);
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
  const [activeTool, setActiveTool] = useState("select"); // "select" | "hand"
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });
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
  const [pages, setPages] = useState([{ id: "page-1", name: "Home", components: [] }]);
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
  const lastDropTimeRef = useRef(0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetToCenter = useCallback(() => {
    if (wrapRef.current) {
      const wrapW = wrapRef.current.clientWidth;
      if (wrapW > 0 && wrapW < 1240) {
        const fitZoom = Math.max(0.4, Math.min(1, +((wrapW - 48) / 1200).toFixed(2)));
        setZoom(fitZoom);
      } else {
        setZoom(1);
      }
    } else {
      setZoom(1);
    }
    setPan({ x: 0, y: 0 });
  }, []);

  // Adapt initial zoom to viewport width if smaller than 1240px artboard width
  useEffect(() => {
    const timer = setTimeout(() => {
      if (wrapRef.current) {
        const wrapW = wrapRef.current.clientWidth;
        if (wrapW > 0 && wrapW < 1240) {
          const fitZoom = Math.max(0.4, Math.min(1, +((wrapW - 48) / 1200).toFixed(2)));
          setZoom(fitZoom);
        }
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [projectId]);

  const selectedNode = (nodes || []).find(n => n.id === selected);
  const gridSnapStep = gridType === "columns"
    ? Math.max(1, (1200 - (gridMargin * 2) + gridGap) / Math.max(1, gridColumns))
    : gridType === "square"
      ? Math.max(1, (1200 - (gridMargin * 2) + ((gridSquareCount - 1) * gridGap)) / Math.max(1, gridSquareCount))
      : Math.max(1, (800 - (gridMargin * 2) + ((gridRows - 1) * gridGap)) / Math.max(1, gridRows));

  useEffect(() => {
    if (!isInitializedRef.current) return;
    try {
      if (projectId && nodes.length > 0) {
        localStorage.setItem(draftKey, JSON.stringify({
          projectId,
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

  // ── Load existing project or reset for new blank project ──
  useEffect(() => {
    if (!projectId) {
      setCurrentProjectId(null);
      setProjectName("Untitled Project");
      setPages([{ id: "page-1", name: "Home", components: [] }]);
      setCurrentPageId("page-1");
      setSelected(null);
      setMultiSelected([]);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setActiveTool("select");
      reset([]);
      try {
        localStorage.removeItem("buildx-draft-new");
      } catch {}
      isInitializedRef.current = true;
      setLoading(false);
      return;
    }
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
            ? p.settings.pages.map((page, index) => {
                const pageComps = Array.isArray(page.components) ? page.components.map((c, j) => restoreNodeFromProject(c, j)) : [];
                return {
                  id: page.id || `page-${index + 1}`,
                  name: page.name || `Page ${index + 1}`,
                  components: (index === 0 && mapped.length > 0) ? mapped : pageComps,
                };
              })
            : [{ id: "page-1", name: "Home", components: mapped }];

          const serverNodes = mapped.length > 0 ? mapped : (projectPages[0]?.components || []);
          // Server components take full precedence for existing projects to prevent stale draft overrides
          const initialNodes = serverNodes;
          const initialPageId = projectPages[0]?.id || "page-1";
          const lastSavedAt = Number(p.updatedAt ? new Date(p.updatedAt).getTime() : Date.now());

          setPages(projectPages);
          setCurrentPageId(initialPageId);
          push(initialNodes);

          localStorage.setItem(draftKey, JSON.stringify({
            projectId,
            updatedAt: lastSavedAt,
            nodes: initialNodes,
          }));
        }
      } catch {}
      finally {
        isInitializedRef.current = true;
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const [dragTarget, setDragTarget] = useState(null); // { parentId: string | null, index: number }
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());
  const isPanMode = !isPreview && (activeTool === "hand" || isSpacePressed);

  const handleCanvasPointerDown = useCallback((e) => {
    if (isPreview) return;
    if (e.target.closest?.(".bx-canvas-pan-indicator") || e.target.closest?.(".bx-align-bar")) {
      return;
    }
    const isMiddleClick = e.button === 1;
    const isHandActive = activeTool === "hand" || isSpacePressed;

    if (isHandActive || isMiddleClick) {
      e.preventDefault();
      e.stopPropagation();
      isPanningRef.current = true;
      setIsPanning(true);
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      };

      const handlePointerMove = (ev) => {
        if (!isPanningRef.current) return;
        ev.preventDefault();
        const dx = ev.clientX - panStartRef.current.startX;
        const dy = ev.clientY - panStartRef.current.startY;
        setPan({
          x: Math.round(panStartRef.current.initialPanX + dx),
          y: Math.round(panStartRef.current.initialPanY + dy),
        });
      };

      const handlePointerUp = () => {
        isPanningRef.current = false;
        setIsPanning(false);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("pointercancel", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove, { passive: false });
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("pointercancel", handlePointerUp);
      return;
    }

    if (e.target === canvasRef.current || e.target === wrapRef.current) {
      setSelected(null);
      setMultiSelected([]);
    }
  }, [isPreview, activeTool, isSpacePressed, pan]);

  // Non-passive wheel listener on wrapRef to smoothly pan or zoom
  useEffect(() => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;

    const onWheel = (e) => {
      if (isPreview) return;
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomStep = e.deltaY < 0 ? 0.05 : -0.05;
        setZoom(z => Math.min(3, Math.max(0.25, +(z + zoomStep).toFixed(2))));
      } else {
        setPan(prev => ({
          x: Math.round(prev.x - e.deltaX),
          y: Math.round(prev.y - e.deltaY),
        }));
      }
    };

    wrapEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrapEl.removeEventListener("wheel", onWheel);
    };
  }, [isPreview]);

  // Keyboard shortcuts: Space (temporary Hand pan), H (Hand Tool), V / Esc (Select Tool)
  useEffect(() => {
    const isTextInput = (target) => {
      if (!target) return false;
      const tag = target.tagName?.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable ||
        Boolean(target.closest?.('[contenteditable="true"]'))
      );
    };

    const handleKeyDown = (e) => {
      if (isTextInput(e.target)) return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      } else if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setActiveTool("hand");
      } else if ((e.key === "v" || e.key === "V" || e.key === "Escape") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setActiveTool("select");
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    const handleBlur = () => {
      setIsSpacePressed(false);
      isPanningRef.current = false;
      setIsPanning(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Global cursor feedback while dragging/panning
  useEffect(() => {
    if (isPanning) {
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isPanning]);

  // ── Drag to move/resize (Freeform layout) ──
  const startDrag = useCallback((e, id, mode = "move") => {
    if (isPreview || isPanMode) return;
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
      const { id: dragId, mode: dragMode, startX, startY, origX, origY, origW, origH } = dragState.current;
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;
      push(prev => prev.map(n => {
        if (n.id !== dragId) return n;
        if (dragMode === "move") {
          const rawX = Math.max(0, origX + dx);
          const rawY = Math.max(0, origY + dy);
          const others = prev.filter(o => o.id !== dragId);
          const { sx, sy, guides: g } = getSnapGuides(rawX, rawY, n.w, n.h, others, gridSnapStep);
          setGuides(g);
          return { ...n, x: snapToGrid ? sx : rawX, y: snapToGrid ? sy : rawY };
        }
        let { x, y, w, h } = { x: origX, y: origY, w: origW, h: origH };
        const resizeSnap = value => snapToGrid ? snap(value, gridSnapStep) : value;
        if (dragMode.includes("e"))  w = resizeSnap(Math.max(20, origW + dx));
        if (dragMode.includes("s"))  h = resizeSnap(Math.max(8,  origH + dy));
        if (dragMode.includes("w")) { w = resizeSnap(Math.max(20, origW - dx)); x = resizeSnap(origX + origW - w); }
        if (dragMode.includes("n")) { h = resizeSnap(Math.max(8, origH - dy)); y = resizeSnap(origY + origH - h); }
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
  }, [nodes, zoom, isPreview, push, snapToGrid, gridSnapStep, isPanMode]);

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    const toDelete = (nodes || []).find(n => n.id === selected);
    const parentId = toDelete?.parentId ?? null;
    const descendantIds = getAllDescendantIds(nodes, selected);
    descendantIds.add(selected);

    push(prev => {
      const remaining = prev.filter(n => !descendantIds.has(n.id));
      const siblings = remaining
        .filter(n => (n.parentId ?? null) === parentId)
        .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
      const orderMap = new Map();
      siblings.forEach((s, idx) => orderMap.set(s.id, idx));

      return remaining.map(n => orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id) } : n);
    });

    setSelected(null);
    setMultiSelected([]);
    showToast("Deleted element and contents");
  }, [selected, nodes, push]);

  const duplicateSelected = useCallback(() => {
    if (!selected) return;
    const { updatedNodes, newRootId } = duplicateNodeRecursive(nodes, selected);
    push(updatedNodes);
    if (newRootId) setSelected(newRootId);
    showToast("Duplicated element and contents");
  }, [selected, nodes, push]);

  const handleDragEnd = useCallback(() => {
    setDragOver(false);
    setDragTarget(null);
    setDraggingNodeId(null);
  }, []);

  const handleNodeDragStart = useCallback((e, node) => {
    e.stopPropagation();
    e.dataTransfer.setData("application/json", JSON.stringify({ source: "canvas", id: node.id }));
    e.dataTransfer.setData("nodeId", node.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingNodeId(node.id);
  }, []);

  const insertSidebarComponent = useCallback((def, targetParentId, insertIndex = null) => {
    const newNodeId = `${def.type}-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: def.type,
      name: def.label || def.type,
      parentId: targetParentId,
      order: insertIndex ?? 0,
      x: 0,
      y: 0,
      w: def.defaultW || (def.type === "section" ? 1200 : 280),
      h: def.defaultH || (def.type === "section" ? 180 : 60),
      props: sanitizeComponentProps(def.type, def.props || (def.type === "section" ? { bg: "#f8fafc", layout: "stack" } : {})),
      locked: false,
      hidden: false,
    };

    push(prev => {
      const siblings = prev
        .filter(n => n.parentId === targetParentId)
        .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
      const idx = insertIndex !== null && insertIndex !== undefined
        ? Math.min(insertIndex, siblings.length)
        : siblings.length;
      const newSiblings = [...siblings];
      newSiblings.splice(idx, 0, newNode);
      const orderMap = new Map();
      newSiblings.forEach((s, i) => orderMap.set(s.id, i));

      const updated = prev.map(n => orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id) } : n);
      return [...updated, { ...newNode, order: idx }];
    });

    setSelected(newNodeId);
    showToast(`Added ${def.label || def.type}`);
  }, [push]);

  const handleDropItem = useCallback((e, targetParentId, insertIndex = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (Date.now() - lastDropTimeRef.current < 250) return;
    lastDropTimeRef.current = Date.now();
    setDragTarget(null);
    setDraggingNodeId(null);

    try {
      const rawJson = e.dataTransfer.getData("application/json");
      const rawComp = e.dataTransfer.getData("compDef");
      const nodeId = e.dataTransfer.getData("nodeId");

      let payload = null;
      if (rawJson) {
        try { payload = JSON.parse(rawJson); } catch {}
      }
      if (!payload && rawComp) {
        try { payload = { source: "sidebar", def: JSON.parse(rawComp) }; } catch {}
      }
      if (!payload && nodeId) {
        payload = { source: "canvas", id: nodeId };
      }
      if (!payload) return;

      if (payload.source === "sidebar" || payload.def) {
        insertSidebarComponent(payload.def || payload, targetParentId, insertIndex);
      } else if (payload.source === "canvas" && payload.id) {
        const movedId = payload.id;
        if (targetParentId && (movedId === targetParentId || isDescendant(nodes, movedId, targetParentId))) {
          showToast("Cannot place a container inside its own descendant", "error");
          return;
        }

        push(prev => reorderNodes(prev, movedId, targetParentId, insertIndex));
        setSelected(movedId);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  }, [nodes, push, insertSidebarComponent]);

  const handleRootDrop = useCallback((e, insertIndex = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (Date.now() - lastDropTimeRef.current < 250) return;
    lastDropTimeRef.current = Date.now();
    setDragOver(false);
    setDragTarget(null);
    setDraggingNodeId(null);

    try {
      const rawJson = e.dataTransfer.getData("application/json");
      const rawComp = e.dataTransfer.getData("compDef");
      const nodeId = e.dataTransfer.getData("nodeId");

      let payload = null;
      if (rawJson) {
        try { payload = JSON.parse(rawJson); } catch {}
      }
      if (!payload && rawComp) {
        try { payload = { source: "sidebar", def: JSON.parse(rawComp) }; } catch {}
      }
      if (!payload && nodeId) {
        payload = { source: "canvas", id: nodeId };
      }
      if (!payload) return;

      if (payload.source === "sidebar" || payload.def) {
        const def = payload.def || payload;
        if (def.type === "section") {
          insertSidebarComponent(def, null, insertIndex);
        } else {
          const rootSections = (nodes || [])
            .filter(n => n.type === "section" && !n.parentId)
            .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

          const sectionIdx = insertIndex !== null && insertIndex !== undefined
            ? Math.min(insertIndex, rootSections.length)
            : rootSections.length;

          const sectionId = `section-${Date.now()}`;
          const newSection = {
            id: sectionId,
            type: "section",
            name: "Section",
            parentId: null,
            order: sectionIdx,
            x: 0,
            y: 0,
            w: 1200,
            h: 200,
            props: sanitizeComponentProps("section", { bg: "#f8fafc", layout: "stack" }),
            locked: false,
            hidden: false,
          };
          const childId = `${def.type}-${Date.now() + 1}`;
          const newChild = {
            id: childId,
            type: def.type,
            name: def.label || def.type,
            parentId: sectionId,
            order: 0,
            x: 0,
            y: 0,
            w: def.defaultW || 280,
            h: def.defaultH || 60,
            props: sanitizeComponentProps(def.type, def.props || {}),
            locked: false,
            hidden: false,
          };

          push(prev => {
            const currentRootSections = prev
              .filter(n => n.type === "section" && !n.parentId)
              .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
            const newRootSections = [...currentRootSections];
            newRootSections.splice(sectionIdx, 0, newSection);
            const orderMap = new Map();
            newRootSections.forEach((s, i) => orderMap.set(s.id, i));

            const updated = prev.map(n => orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id) } : n);
            return [...updated, { ...newSection, order: sectionIdx }, newChild];
          });
          setSelected(childId);
          showToast(`Added ${def.label || def.type} in new Section`);
        }
      } else if (payload.source === "canvas" && payload.id) {
        const movedNode = (nodes || []).find(n => n.id === payload.id);
        if (movedNode?.type === "section") {
          push(prev => reorderNodes(prev, payload.id, null, insertIndex));
        } else {
          const sectionId = `section-${Date.now()}`;
          const rootSecs = (nodes || []).filter(n => n.type === "section" && !n.parentId);
          const sectionIdx = insertIndex !== null && insertIndex !== undefined
            ? Math.min(insertIndex, rootSecs.length)
            : rootSecs.length;

          const newSection = {
            id: sectionId,
            type: "section",
            name: "Section",
            parentId: null,
            order: sectionIdx,
            x: 0,
            y: 0,
            w: 1200,
            h: 200,
            props: sanitizeComponentProps("section", { bg: "#f8fafc", layout: "stack" }),
            locked: false,
            hidden: false,
          };

          push(prev => {
            const currentRootSections = prev
              .filter(n => n.type === "section" && !n.parentId)
              .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
            const newRootSections = [...currentRootSections];
            newRootSections.splice(sectionIdx, 0, newSection);
            const orderMap = new Map();
            newRootSections.forEach((s, i) => orderMap.set(s.id, i));

            const reparented = reorderNodes(prev, payload.id, sectionId, 0);
            const updated = reparented.map(n => orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id) } : n);
            return [...updated, { ...newSection, order: sectionIdx }];
          });
        }
        setSelected(payload.id);
      }
    } catch (err) {
      console.error("Root drop error:", err);
    }
  }, [nodes, push, insertSidebarComponent]);

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
      const ALLOWED = SUPPORTED_COMPONENT_TYPES;
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
      const ALLOWED = SUPPORTED_COMPONENT_TYPES;
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
            components: (page.components || []).map((component) => serializeNodeForStorage(component)),
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

  const rootNodes = (nodes || []).filter(n => !n.hidden && !n.parentId).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
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

          <div className="bx-tool-selector" role="group" aria-label="Editor Tools">
            <button
              type="button"
              className={`bx-tool-btn${activeTool === "select" && !isSpacePressed ? " active" : ""}`}
              onClick={() => setActiveTool("select")}
              title="Select tool (V)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                <path d="M6.672 1.512a1 1 0 00-1.638.749v14.478a1 1 0 001.697.728l3.96-3.805 2.502 5.004a1 1 0 001.789-.894l-2.483-4.966 5.17-.414a1 1 0 00.672-1.675L6.672 1.512z" />
              </svg>
              <span>Select</span>
            </button>
            <button
              type="button"
              className={`bx-tool-btn${activeTool === "hand" || isSpacePressed ? " active" : ""}`}
              onClick={() => setActiveTool("hand")}
              title="Hand tool (H) — Drag to pan canvas (or hold Space)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M13.5 1.5a1.5 1.5 0 00-3 0v8.25H9.25V4a1.5 1.5 0 00-3 0v7.25H5A1.5 1.5 0 003.5 12v3.75a8.25 8.25 0 008.25 8.25h.5a8.25 8.25 0 008.25-8.25V7a1.5 1.5 0 00-3 0v4.25h-1.25V2.5a1.5 1.5 0 00-3 0v8.75h-1.25V1.5z" />
              </svg>
              <span>Hand</span>
            </button>
          </div>

          <div className="bx-zoom-ctrl">
            <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}>−</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}>+</button>
            <button onClick={resetToCenter} title="Reset view to center (⊙)">⊙</button>
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
                        onDragStart={e => {
                          e.dataTransfer.setData("application/json", JSON.stringify({ source: "sidebar", def: item }));
                          e.dataTransfer.setData("compDef", JSON.stringify(item));
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        onDragEnd={handleDragEnd}>
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
                  {layerSearch ? (
                    nodes
                      .filter(n => n.name?.toLowerCase().includes(layerSearch.toLowerCase()) || n.type.includes(layerSearch.toLowerCase()))
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
                      ))
                  ) : (
                    <div className="bx-tree-view">
                      {rootNodes.map(n => (
                        <TreeItem
                          key={n.id}
                          node={n}
                          nodes={nodes}
                          depth={0}
                          selected={selected}
                          setSelected={setSelected}
                          toggleHide={toggleHide}
                          toggleLock={toggleLock}
                          collapsedIds={collapsedIds}
                          setCollapsedIds={setCollapsedIds}
                        />
                      ))}
                    </div>
                  )}
                  {nodes.length === 0 && <div className="bx-layers-empty">No elements yet</div>}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* ── Canvas ── */}
        <div
          className={`bx-canvas-wrap${isPanMode ? " is-hand-mode" : ""}${isPanning ? " is-panning" : ""}`}
          ref={wrapRef}
          onPointerDown={handleCanvasPointerDown}
        >
          {/* Alignment toolbar */}
          {!isPreview && activeIds.length > 0 && !isPanMode && (
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
            style={!isPreview ? {
              width: 1200,
              minWidth: 1200,
              maxWidth: 1200,
              minHeight: "100%",
              flexShrink: 0,
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: "top center",
            } : {}}
            onDrop={!isPreview && !isPanMode ? (e) => { e.preventDefault(); e.stopPropagation(); handleRootDrop(e, rootNodes.length); } : undefined}
            onDragOver={!isPreview && !isPanMode ? e => { e.preventDefault(); setDragOver(true); } : undefined}
            onDragLeave={!isPreview && !isPanMode ? (e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setDragOver(false); setDragTarget(null); } } : undefined}
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
                      : `repeating-linear-gradient(to bottom, transparent 0, transparent calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} - 1px), rgba(99,102,241,.16) calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} - 1px), rgba(99,102,241,.16) calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows}), transparent calc((100% - ${(gridRows - 1) * gridGap}px) / ${gridRows} + ${gridGap}px))`
                }}
              />
            )}

            {/* Snap guides */}
            {!isPreview && showGuides && guides.map((g, i) =>
              g.type === "v"
                ? <div key={i} className="bx-guide-v" style={{ left: g.pos }} />
                : <div key={i} className="bx-guide-h" style={{ top: g.pos }} />
            )}

            <div className={`bx-canvas-flow${nodes.length === 0 ? " is-empty" : ""}`}>
              {/* Empty state */}
              {nodes.length === 0 && !isPreview && (
                <div
                  className="bx-empty-container"
                  style={{
                    margin: "auto",
                    maxWidth: 640,
                    width: "100%",
                    minHeight: 220,
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragTarget({ parentId: null, index: 0 }); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleRootDrop(e, 0); }}
                >
                  <svg viewBox="0 0 48 48" fill="none" width="48" height="48"><rect x="4" y="4" width="40" height="40" rx="8" stroke="#2a2a3e" strokeWidth="2"/><path d="M16 24h16M24 16v16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>Drag sections or components here</p>
                  <span style={{ color: "#64748b" }}>Drop any component to begin building your page layout</span>
                </div>
              )}

              {/* Recursive Hierarchical Root Nodes */}
              {rootNodes.map((rootNode, idx) => (
                <div key={rootNode.id} style={{ display: "contents" }}>
                  {/* Root insertion slot before rootNode */}
                  {!isPreview && (
                    <div
                      style={{ height: 10, width: "100%", margin: "2px 0", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragTarget({ parentId: null, index: idx }); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleRootDrop(e, idx); }}
                    >
                      {dragTarget?.parentId === null && dragTarget?.index === idx && (
                        <div className="bx-drop-indicator-line" />
                      )}
                    </div>
                  )}

                  <CanvasNode
                    node={rootNode}
                    nodes={nodes}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelected={multiSelected}
                    setMultiSelected={setMultiSelected}
                    updateNode={updateNode}
                    startDrag={startDrag}
                    isPreview={isPreview}
                    previewDevice={previewDevice}
                    dragTarget={dragTarget}
                    setDragTarget={setDragTarget}
                    onDropItem={handleDropItem}
                    onStartNodeDrag={handleNodeDragStart}
                    onDragEnd={handleDragEnd}
                    draggingNodeId={draggingNodeId}
                  />

                  {/* Root insertion slot after the last rootNode */}
                  {!isPreview && idx === rootNodes.length - 1 && (
                    <div
                      style={{ height: 10, width: "100%", margin: "2px 0", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragTarget({ parentId: null, index: idx + 1 }); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleRootDrop(e, idx + 1); }}
                    >
                      {dragTarget?.parentId === null && dragTarget?.index === idx + 1 && (
                        <div className="bx-drop-indicator-line" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Pan Indicator */}
          {!isPreview && (pan.x !== 0 || pan.y !== 0) && (
            <div className="bx-canvas-pan-indicator">
              <span>Pan: {pan.x}px, {pan.y}px</span>
              <button
                type="button"
                className="bx-canvas-pan-reset-btn"
                onClick={() => setPan({ x: 0, y: 0 })}
                title="Reset pan to center"
              >
                Center
              </button>
            </div>
          )}

          {/* Status bar */}
          {!isPreview && (
            <div className="bx-statusbar">
              <span>{nodes.length} element{nodes.length !== 1 ? "s" : ""}</span>
              {selectedNode && <span>· {selectedNode.type} · {selectedNode.w}×{selectedNode.h} at ({selectedNode.x}, {selectedNode.y})</span>}
              {multiSelected.length > 1 && <span>· {multiSelected.length} selected</span>}
              <span className="bx-statusbar-right">V: Select · H: Hand (Pan) · Space+Drag: Pan · Ctrl+Z: Undo</span>
            </div>
          )}
        </div>

        {/* ── Right Panel ── */}
        {!isPreview && (
          <aside className="bx-right-panel">
            <PropertiesPanel
              key={selectedNode?.id || "empty"}
              node={selectedNode}
              nodes={nodes}
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
