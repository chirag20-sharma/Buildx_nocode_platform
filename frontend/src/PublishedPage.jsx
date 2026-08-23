import { useState, useEffect } from "react";
import "./published.css";

const API = "http://localhost:5000/api/v1";

export default function PublishedPage({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublishedProject = async () => {
      try {
        const res = await fetch(`${API}/projects/public/${projectId}`);
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

    if (projectId) {
      fetchPublishedProject();
    } else {
      setError("No website ID specified in the URL.");
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="pub-status-screen">
        <div style={{ width: 36, height: 36, border: "3px solid #1e1e2e", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <h2>Loading website…</h2>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pub-status-screen">
        <div className="pub-status-icon">🔒</div>
        <h2>Website Not Available</h2>
        <p>{error || "This website is either private, unpublished, or does not exist."}</p>
        <a href="/" className="pub-home-btn">Go to BuildX Platform</a>
      </div>
    );
  }

  // Separate regular canvas components and product grids
  const regularComponents = (project.components || []).filter((c) => c.type !== "productGrid");
  const productGridComponents = (project.components || []).filter((c) => c.type === "productGrid");

  return (
    <div className="pub-root">
      <main className="pub-container">
        {/* Absolute-positioned components layer */}
        {regularComponents.length > 0 && (
          <div className="pub-canvas-layer">
            {regularComponents.map((comp, idx) => {
              const x = comp.position?.x ?? 0;
              const y = comp.position?.y ?? 0;
              const w = comp.styles?.width ?? 280;
              const h = comp.styles?.height ?? 60;
              const text = comp.properties?.text || comp.properties?.content || comp.properties?.title || "";

              return (
                <div
                  key={comp.id || `comp-${idx}`}
                  className={`pub-comp pub-comp-${comp.type}`}
                  style={{ left: x, top: y, width: w, height: h }}
                >
                  {comp.type === "image" ? (
                    comp.properties?.src ? (
                      <img src={comp.properties.src} alt={comp.properties.alt || "Image"} />
                    ) : null
                  ) : comp.type === "button" ? (
                    <button
                      className="pub-comp-button"
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => alert(`Clicked: ${text || "Button"}`)}
                    >
                      {text || "Button"}
                    </button>
                  ) : (
                    <span>{text}</span>
                  )}
                </div>
              );
            })}
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
      <a href="/" className="pub-badge" target="_blank" rel="noopener noreferrer" title="Build your website with BuildX">
        <span className="pub-badge-logo">B</span>
        <span>Built with BuildX</span>
      </a>
    </div>
  );
}

