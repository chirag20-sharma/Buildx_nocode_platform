import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./published.css";
import { API_BASE as API } from "./api.js";
function toCSSJustify(val) {
  if (val === "between") return "space-between";
  if (val === "around") return "space-around";
  if (val === "evenly") return "space-evenly";
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  return val || "flex-start";
}

function toCSSAlign(val) {
  if (val === "start") return "flex-start";
  if (val === "end") return "flex-end";
  if (val === "center") return "center";
  if (val === "stretch") return "stretch";
  if (val === "baseline") return "baseline";
  return val || "stretch";
}

export default function PublishedPage({ projectId }) {
  const { projectId: routeProjectId } = useParams();
  const activeProjectId = projectId || routeProjectId;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublishedProject = async () => {
      try {
        const res = await fetch(`${API}/projects/public/${activeProjectId}`);
        const data = await res.json();
        if (data.success && data.payload?.project) {
          setProject(data.payload.project);
          document.title = data.payload.project.name || "Published Website";
        } else {
          setError(data.message || "Website not found or is unpublished.");
        }
      } catch {
        setError("Unable to connect to the website server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (activeProjectId) {
      fetchPublishedProject();
    } else {
      setError("No website ID specified in the URL.");
      setLoading(false);
    }
  }, [activeProjectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f13] text-slate-100 text-center p-8 gap-4">
        <div style={{ width: 36, height: 36, border: "3px solid #1e1e2e", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <h2 className="text-2xl font-bold text-slate-100">Loading website…</h2>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f13] text-slate-100 text-center p-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/12 border border-indigo-500/25 flex items-center justify-center text-3xl mb-2">🔒</div>
        <h2 className="text-2xl font-bold text-slate-100">Website Not Available</h2>
        <p className="text-[14.5px] text-slate-400 max-w-[420px] leading-relaxed">{error || "This website is either private, unpublished, or does not exist."}</p>
        <Link to="/" className="mt-3 bg-bx-brand hover:bg-bx-brand-hover text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition active:scale-[0.98]">
          Go to BuildX Platform
        </Link>
      </div>
    );
  }

  const allComponents = Array.isArray(project.components) ? project.components : [];
  const regularComponents = allComponents
    .filter((c) => c.type !== "productGrid" && !c.parentId)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  const productGridComponents = allComponents.filter((c) => c.type === "productGrid");

  const renderPublishedComponent = (comp, depth = 0, parentLayout = "stack") => {
    const p = comp.properties || {};
    const text = p.text || p.content || p.title || p.brand || p.heading || "";
    const children = allComponents
      .filter((child) => child.parentId === comp.id)
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

    if (comp.type === "section" || comp.type === "container") {
      const layout = p.layout || "stack";
      const gap = p.gap ?? (comp.type === "section" ? 16 : 12);
      const padding = p.padding ?? (comp.type === "section" ? 32 : 16);
      const alignCSS = toCSSAlign(p.align);
      const justifyCSS = toCSSJustify(p.justify);
      const cols = Math.max(1, Number(p.cols || 3));

      let layoutStyles = {};
      if (layout === "stack") {
        layoutStyles = { display: "flex", flexDirection: "column", gap, padding, alignItems: alignCSS, justifyContent: justifyCSS };
      } else if (layout === "row") {
        layoutStyles = { display: "flex", flexDirection: "row", flexWrap: "wrap", gap, padding, alignItems: alignCSS, justifyContent: justifyCSS };
      } else if (layout === "grid") {
        layoutStyles = { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap, padding, alignItems: alignCSS };
      } else if (layout === "freeform") {
        layoutStyles = { position: "relative", minHeight: comp.styles?.height || 200, padding: 0 };
      }

      const pos = p.position || (p.pinBottom ? "push-bottom" : "normal");
      let cMargin = comp.type === "container" ? "0 auto" : undefined;
      let cPosStyles = {};
      if (pos === "push-bottom" || p.pinBottom) {
        cPosStyles.marginTop = "auto";
      } else if (pos === "sticky-bottom") {
        cPosStyles.position = "sticky";
        cPosStyles.bottom = 0;
        cPosStyles.zIndex = 30;
      } else if (pos === "fixed-bottom") {
        cPosStyles.position = "fixed";
        cPosStyles.bottom = 0;
        cPosStyles.left = 0;
        cPosStyles.width = "100%";
        cPosStyles.zIndex = 30;
      }
      if (comp.type === "container") {
        const topM = p.marginTop !== undefined && p.marginTop !== "" ? (p.marginTop === "auto" ? "auto" : `${Number(p.marginTop) || 0}px`) : ((pos === "push-bottom" || p.pinBottom) ? "auto" : "0px");
        const btmM = p.marginBottom !== undefined && p.marginBottom !== "" ? (p.marginBottom === "auto" ? "auto" : `${Number(p.marginBottom) || 0}px`) : "0px";
        cMargin = `${topM} auto ${btmM}`;
      } else {
        if (p.marginTop !== undefined && p.marginTop !== "") cPosStyles.marginTop = p.marginTop === "auto" ? "auto" : `${Number(p.marginTop) || 0}px`;
        if (p.marginBottom !== undefined && p.marginBottom !== "") cPosStyles.marginBottom = p.marginBottom === "auto" ? "auto" : `${Number(p.marginBottom) || 0}px`;
      }
      if (p.flexGrow) cPosStyles.flex = "1 1 auto";
      if (p.alignSelf && p.alignSelf !== "auto") cPosStyles.alignSelf = p.alignSelf;

      return (
        <div
          key={comp.id}
          className={`pub-comp pub-comp-${comp.type}`}
          style={{
            background: p.bg || (comp.type === "section" ? "#f8fafc" : "#ffffff"),
            width: "100%",
            maxWidth: comp.type === "container" ? (p.maxWidth || "1200px") : "100%",
            margin: cMargin,
            borderRadius: p.radius ? `${p.radius}px` : undefined,
            border: p.borderColor && p.borderColor !== "transparent" ? `1px solid ${p.borderColor}` : undefined,
            minHeight: comp.styles?.height || (comp.type === "section" ? 100 : 60),
            boxSizing: "border-box",
            ...cPosStyles,
            ...layoutStyles,
          }}
        >
          {children.length > 0 ? children.map((child) => renderPublishedComponent(child, depth + 1, layout)) : (text ? <span>{text}</span> : null)}
        </div>
      );
    }

    if (comp.type === "columns") {
      const cols = Math.max(1, Number(p.cols || children.length || 2));
      const gap = p.gap ?? 12;
      const padding = p.padding ?? 8;
      return (
        <div
          key={comp.id}
          className="pub-comp pub-comp-columns"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap,
            padding,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children.length > 0 ? children.map((child) => renderPublishedComponent(child, depth + 1, "stack")) : null}
        </div>
      );
    }

    const isFreeform = parentLayout === "freeform";
    const isBtnOrBadge = comp.type === "button" || comp.type === "badge";
    const leafStyles = {
      boxSizing: "border-box",
      width: isFreeform ? (comp.styles?.width ?? 280) : (isBtnOrBadge ? (p.fullWidth ? "100%" : "auto") : (comp.styles?.width ? `${comp.styles.width}px` : "100%")),
      maxWidth: "100%",
    };
    if (isFreeform) {
      leafStyles.position = "absolute";
      leafStyles.left = comp.position?.x ?? 0;
      leafStyles.top = comp.position?.y ?? 0;
      leafStyles.height = comp.styles?.height ?? 60;
    } else {
      if (parentLayout === "stack" && isBtnOrBadge) {
        leafStyles.alignSelf = p.fullWidth ? "stretch" : "flex-start";
      }
      if (comp.styles?.height) {
        leafStyles.minHeight = comp.styles.height;
      }
      const leafPos = p.position || (p.pinBottom ? "push-bottom" : "normal");
      if (leafPos === "push-bottom" || p.pinBottom) {
        leafStyles.marginTop = "auto";
      } else if (leafPos === "sticky-bottom") {
        leafStyles.position = "sticky";
        leafStyles.bottom = 0;
        leafStyles.zIndex = 30;
      } else if (leafPos === "fixed-bottom") {
        leafStyles.position = "fixed";
        leafStyles.bottom = 0;
        leafStyles.left = 0;
        leafStyles.width = "100%";
        leafStyles.zIndex = 30;
      }
      if (p.marginTop !== undefined && p.marginTop !== "") {
        leafStyles.marginTop = p.marginTop === "auto" ? "auto" : `${Number(p.marginTop) || 0}px`;
      }
      if (p.marginBottom !== undefined && p.marginBottom !== "") {
        leafStyles.marginBottom = p.marginBottom === "auto" ? "auto" : `${Number(p.marginBottom) || 0}px`;
      }
      if (p.alignSelf && p.alignSelf !== "auto") {
        leafStyles.alignSelf = p.alignSelf;
      }
    }

    const renderInner = () => {
      switch (comp.type) {
        case "heading": {
          const hEl = <h2 style={{ fontSize: p.fontSize ? `${p.fontSize}px` : 28, fontWeight: p.fontWeight || 700, color: p.color || "#0f172a", margin: 0, textAlign: p.textAlign || "left" }}>{text || "Heading"}</h2>;
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ color: "inherit", textDecoration: "none" }}>{hEl}</a> : hEl;
        }
        case "text": {
          const tEl = <p style={{ fontSize: p.fontSize ? `${p.fontSize}px` : 15, color: p.color || "#475569", margin: 0, lineHeight: 1.6, textAlign: p.textAlign || "left" }}>{text || "Text content"}</p>;
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ color: "inherit", textDecoration: "none" }}>{tEl}</a> : tEl;
        }
        case "image": {
          const imgEl = p.src ? <img src={p.src} alt={p.alt || "Image"} style={{ width: "100%", height: "100%", objectFit: p.fit || "cover", borderRadius: p.radius ? `${p.radius}px` : 0 }} /> : <div style={{ height: 160, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", borderRadius: p.radius ? `${p.radius}px` : 0 }}>🖼 Image</div>;
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}>{imgEl}</a> : imgEl;
        }
        case "video":
          return p.src ? <video src={p.src} controls style={{ width: "100%", borderRadius: 8 }} /> : <div style={{ height: 200, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", borderRadius: 8 }}>▶ Video player</div>;
        case "button":
          return (
            <button
              className="pub-comp-button"
              style={{
                background: p.bg || "#6366f1",
                color: p.color || "#ffffff",
                borderRadius: p.radius ? `${p.radius}px` : 8,
                padding: "10px 20px",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                width: p.fullWidth ? "100%" : undefined,
              }}
              onClick={() => {
                if (p.href) {
                  if (p.target === "_blank") window.open(p.href, "_blank", "noopener,noreferrer");
                  else window.location.href = p.href;
                } else {
                  alert(`Clicked: ${text || "Button"}`);
                }
              }}
            >
              {text || "Button"}
            </button>
          );
        case "badge": {
          const badgeEl = <span style={{ background: p.bg || "#6366f1", color: p.color || "#ffffff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>{text || "Badge"}</span>;
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", display: "inline-block" }}>{badgeEl}</a> : badgeEl;
        }
        case "alert":
          return <div style={{ background: p.type === "error" ? "#fef2f2" : p.type === "success" ? "#f0fdf4" : "#eff6ff", border: `1px solid ${p.type === "error" ? "#fecaca" : p.type === "success" ? "#bbf7d0" : "#bfdbfe"}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: p.type === "error" ? "#dc2626" : p.type === "success" ? "#16a34a" : "#2563eb" }}>{text || "Alert message"}</div>;
        case "divider":
          return <hr style={{ border: "none", borderTop: `1px solid ${p.color || "#e2e8f0"}`, margin: "8px 0", width: "100%" }} />;
        case "spacer":
          return <div style={{ height: comp.styles?.height || 40, width: "100%" }} />;
        case "input":
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {p.label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{p.label}</label>}
              <input type={p.inputType || "text"} placeholder={p.placeholder || "Enter text..."} style={{ height: 40, padding: "0 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" }} />
            </div>
          );
        case "textarea":
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {p.label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{p.label}</label>}
              <textarea placeholder={p.placeholder || "Enter message..."} rows={3} style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box", resize: "none" }} />
            </div>
          );
        case "select": {
          const options = typeof p.options === "string" ? p.options.split(",").map(o => o.trim()) : ["Option 1", "Option 2"];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {p.label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{p.label}</label>}
              <select style={{ height: 40, padding: "0 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" }}>
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            </div>
          );
        }
        case "checkbox":
          return (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151", cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} />
              <span>{p.label || "I agree to terms"}</span>
            </label>
          );
        case "loginform":
          return (
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
              <div style={{ width: "100%", maxWidth: 380, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{p.title || "Welcome back"}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{p.subtitle || "Sign in to continue"}</div>
                </div>
                <form onSubmit={e => { e.preventDefault(); alert("Login submitted"); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{p.emailLabel || "Email"}</label>
                    <input type="email" placeholder="you@example.com" style={{ width: "100%", height: 40, border: "1px solid #dbe2ea", borderRadius: 8, padding: "0 12px", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{p.passwordLabel || "Password"}</label>
                    <input type="password" placeholder="••••••••" style={{ width: "100%", height: 40, border: "1px solid #dbe2ea", borderRadius: 8, padding: "0 12px", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                  <button type="submit" style={{ width: "100%", height: 42, border: "none", borderRadius: 10, background: "#4f46e5", color: "#ffffff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                    {p.buttonText || "Login"}
                  </button>
                </form>
              </div>
            </div>
          );
        case "formblock":
          return (
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{p.title || "Contact Us"}</div>
              <input placeholder="Name" style={{ height: 38, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px" }} />
              <input placeholder="Email" style={{ height: 38, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px" }} />
              <textarea placeholder="Message" rows={3} style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 10px", resize: "none" }} />
              <button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontWeight: 600, cursor: "pointer" }}>{p.cta || "Send Message"}</button>
            </div>
          );
        case "navbar": {
          const links = typeof p.links === "string" ? p.links.split(",").map(l => l.trim()) : ["Home", "About", "Contact"];
          const linkUrls = typeof p.linkUrls === "string" ? p.linkUrls.split(",").map(l => l.trim()) : [];
          return (
            <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 8, width: "100%", boxSizing: "border-box" }}>
              <a href={p.brandUrl || "#"} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ fontWeight: 700, fontSize: 18, color: "inherit", textDecoration: "none" }}>{p.brand || "My Brand"}</a>
              <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
                {links.map((link, i) => {
                  const url = linkUrls[i] || `#${link.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <a key={i} href={url} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ color: p.color || "#f1f5f9", textDecoration: "none", cursor: "pointer" }}>{link}</a>
                  );
                })}
              </div>
            </div>
          );
        }
        case "footer": {
          const footerEl = (
            <footer style={{ background: p.bg || "#0f172a", color: p.color || "#94a3b8", padding: "24px", textAlign: "center", fontSize: 13, borderRadius: 8, width: "100%", boxSizing: "border-box" }}>
              {p.text || "© 2025 My Company. All rights reserved."}
            </footer>
          );
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", display: "block" }}>{footerEl}</a> : footerEl;
        }
        case "hero":
          return (
            <div style={{ background: p.bg || "#0f172a", color: p.color || "#f1f5f9", padding: "48px 32px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 16, alignItems: "center", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
              <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>{p.heading || "Your Big Headline"}</h1>
              <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 600, margin: 0 }}>{p.subtext || "Supporting description text."}</p>
              {p.cta && (
                <button
                  onClick={() => {
                    if (p.ctaHref) {
                      if (p.target === "_blank") window.open(p.ctaHref, "_blank", "noopener,noreferrer");
                      else window.location.href = p.ctaHref;
                    }
                  }}
                  style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
                >
                  {p.cta}
                </button>
              )}
            </div>
          );
        case "card": {
          const cardEl = (
            <div style={{ background: p.bg || "#ffffff", borderRadius: p.radius ? `${p.radius}px` : 12, padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>{p.title || "Card Title"}</h3>
              <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.5 }}>{p.body || "Card description goes here."}</p>
            </div>
          );
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{cardEl}</a> : cardEl;
        }
        case "productcard": {
          const pcardEl = (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 160, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Product Image</div>
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>{p.brand || "Brand"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name || "Product Name"}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>{p.price || "$99.99"}</span>
                <button
                  style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  onClick={e => {
                    if (p.href) {
                      e.stopPropagation();
                      if (p.target === "_blank") window.open(p.href, "_blank", "noopener,noreferrer");
                      else window.location.href = p.href;
                    }
                  }}
                >Add to Cart</button>
              </div>
            </div>
          );
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{pcardEl}</a> : pcardEl;
        }
        case "pricingcard": {
          const features = typeof p.features === "string" ? p.features.split(",").map(f => f.trim()) : ["Feature 1", "Feature 2"];
          return (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{p.plan || "Pro"}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{p.price || "$49/mo"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {features.map((f, i) => <div key={i} style={{ fontSize: 13, color: "#475569", display: "flex", gap: 6 }}><span style={{ color: "#22c55e" }}>✓</span>{f}</div>)}
              </div>
              <button style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Get Started</button>
            </div>
          );
        }
        case "testimonial":
          return (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{p.quote || "Great product!"}"</p>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{p.author || "Jane Doe"} <span style={{ color: "#94a3b8", fontWeight: 400 }}>— {p.role || "CEO"}</span></div>
            </div>
          );
        case "blogcard": {
          const bcardEl = (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 140, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12 }}>Cover Image</div>
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase" }}>{p.category || "Design"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.title || "Article Title"}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{p.author || "Author"} · {p.readTime || "5 min read"}</span>
              </div>
            </div>
          );
          return p.href ? <a href={p.href} target={p.target || "_self"} rel={p.target === "_blank" ? "noopener noreferrer" : undefined} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{bcardEl}</a> : bcardEl;
        }
        case "statcard":
          return (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{p.value || "12,400"}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.label || "Monthly Users"}</div>
              {p.trend && <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>{p.trend}</div>}
            </div>
          );
        default:
          return <span>{text || comp.type}</span>;
      }
    };

    return (
      <div key={comp.id} className={`pub-comp pub-comp-${comp.type}${isFreeform ? " freeform-item" : ""}`} style={leafStyles}>
        {renderInner()}
      </div>
    );
  };

  return (
    <div className="pub-root">
      <main className="pub-container">
        {/* Absolute-positioned components layer */}
        {regularComponents.length > 0 && (
          <div className="pub-canvas-layer">
            {regularComponents.map((comp) => renderPublishedComponent(comp, 0))}
          </div>
        )}

        {/* Product Grid Sections */}
        {productGridComponents.map((gridComp, gIdx) => {
          const grid = gridComp.properties?.grid || { items: [] };
          const imgW = grid.imgW || 240;
          const imgH = grid.imgH || 200;
          const gap = grid.gap || 20;

          return (
            <section key={gridComp.id || `grid-${gIdx}`} className="pub-product-grid-section">
              <div
                className="pub-product-grid"
                style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${Math.min(imgW, 280)}px, 1fr))`, gap }}
              >
                {(grid.items || []).map((item, i) => (
                  <div key={i} className="pub-product-card">
                    <div className="pub-product-img" style={{ height: imgH }}>
                      {item.src ? (
                        <img src={item.src} alt={item.name || "Product"} />
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: 13 }}>🖼 No image</span>
                      )}
                    </div>
                    <div className="pub-product-info">
                      <div className="pub-product-title">{item.name || "Product Name"}</div>
                      <div className="pub-product-price">{item.price || "$0.00"}</div>
                      <button
                        className="pub-product-btn"
                        onClick={() => alert(`Added "${item.name || 'Product'}" to cart!`)}
                      >
                        {item.btn || "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating "Built with BuildX" Badge */}
      <Link
        to="/"
        className="fixed bottom-5 right-5 flex items-center gap-2 bg-[#0f0f13] text-slate-100 border border-[#1e1e2e] hover:border-bx-brand rounded-full py-1.5 px-3.5 pl-2.5 text-xs font-semibold shadow-2xl transition hover:-translate-y-0.5 z-[9999]"
        target="_blank"
        rel="noopener noreferrer"
        title="Build your website with BuildX"
      >
        <span className="w-5 h-5 bg-bx-brand rounded-full flex items-center justify-center text-[11px] font-extrabold text-white">
          B
        </span>
        <span>Built with BuildX</span>
      </Link>
    </div>
  );
}

