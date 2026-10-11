import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./published.css";
import { API_BASE as API } from "./api.js";

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
  const regularComponents = allComponents.filter((c) => c.type !== "productGrid" && !c.parentId);
  const productGridComponents = allComponents.filter((c) => c.type === "productGrid");

  const renderPublishedComponent = (comp, depth = 0) => {
    const text = comp.properties?.text || comp.properties?.content || comp.properties?.title || comp.properties?.brand || comp.properties?.heading || "";
    const children = allComponents.filter((child) => child.parentId === comp.id);

    if (comp.type === "section" || comp.type === "container") {
      return (
        <div
          key={comp.id}
          className={`pub-comp pub-comp-${comp.type}`}
          style={{
            background: comp.properties?.bg || "#f8fafc",
            padding: 12,
            borderRadius: 8,
            width: "100%",
            minHeight: comp.styles?.height || 120,
          }}
        >
          {children.length > 0 ? children.map((child) => renderPublishedComponent(child, depth + 1)) : (text ? <span>{text}</span> : null)}
        </div>
      );
    }

    if (comp.type === "columns") {
      const cols = Math.max(1, Number(comp.properties?.cols || children.length || 2));
      return (
        <div key={comp.id} className="pub-comp pub-comp-columns" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 12, width: "100%" }}>
          {children.length > 0 ? children.map((child) => renderPublishedComponent(child, depth + 1)) : null}
        </div>
      );
    }

    return (
      <div
        key={comp.id}
        className={`pub-comp pub-comp-${comp.type}`}
        style={{ left: comp.position?.x ?? 0, top: comp.position?.y ?? 0, width: comp.styles?.width ?? 280, height: comp.styles?.height ?? 60 }}
      >
        {comp.type === "image" ? (
          comp.properties?.src ? <img src={comp.properties.src} alt={comp.properties.alt || "Image"} /> : null
        ) : comp.type === "button" ? (
          <button className="pub-comp-button" style={{ width: "100%", height: "100%" }} onClick={() => alert(`Clicked: ${text || "Button"}`)}>
            {text || "Button"}
          </button>
        ) : (
          <span>{text || comp.type}</span>
        )}
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

