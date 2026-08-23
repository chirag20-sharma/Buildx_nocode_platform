import { useState, useRef, useCallback, useEffect } from "react";
import "./builder.css";

const API = "http://localhost:5000/api/v1";
const GRID = 16;
const snap = (v) => Math.round(v / GRID) * GRID;
const SNAP_THRESHOLD = 8;

function getSnapPosition(x, y, w, h, others) {
  let sx = x, sy = y;
  let guideLines = [];
  for (const o of others) {
    const xSnaps = [[x, o.x, 0],[x, o.x+o.w, 0],[x+w, o.x, -w],[x+w, o.x+o.w, -w],[x+w/2, o.x+o.w/2, -w/2]];
    for (const [mine, theirs, offset] of xSnaps) {
      if (Math.abs(mine - theirs) < SNAP_THRESHOLD) { sx = theirs + offset; guideLines.push({ type:"v", pos:theirs }); break; }
    }
    const ySnaps = [[y, o.y, 0],[y, o.y+o.h, 0],[y+h, o.y, -h],[y+h, o.y+o.h, -h],[y+h/2, o.y+o.h/2, -h/2]];
    for (const [mine, theirs, offset] of ySnaps) {
      if (Math.abs(mine - theirs) < SNAP_THRESHOLD) { sy = theirs + offset; guideLines.push({ type:"h", pos:theirs }); break; }
    }
  }
  return { sx: snap(sx), sy: snap(sy), guideLines };
}

// ── Product Grid Component ──
function ImageGrid({ grid, onUpdate, onRemove, isPreview = false }) {
  const { cols, gap, imgW, imgH, items } = grid;

  const updateItem = (idx, field, val) =>
    onUpdate({ ...grid, items: items.map((it, i) => i === idx ? { ...it, [field]: val } : it) });

  const handleUpload = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateItem(idx, "src", ev.target.result);
    reader.readAsDataURL(file);
  };

  const addItem = () => onUpdate({ ...grid, items: [...items, { src:"", name:"Product Name", price:"$0.00", btn:"Add to Cart" }] });
  const removeItem = (idx) => onUpdate({ ...grid, items: items.filter((_,i) => i !== idx) });

  if (isPreview) {
    return (
      <div className="ig-block ig-block-preview">
        <div className="ig-cells" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${Math.min(imgW, 260)}px, 1fr))`, gap }}>
          {items.map((item, idx) => (
            <div key={idx} className="ig-product-card ig-product-card-preview">
              <div className="ig-cell" style={{ height: imgH }}>
                {item.src ? (
                  <img src={item.src} alt={item.name} className="ig-img" />
                ) : (
                  <div className="ig-img-placeholder">
                    <span>🖼 No image</span>
                  </div>
                )}
              </div>
              <div className="ig-info">
                <div className="ig-preview-title">{item.name || "Product Name"}</div>
                <div className="ig-preview-price">{item.price || "$0.00"}</div>
                <button className="ig-btn-preview" onClick={() => alert(`Added "${item.name || 'Product'}" to cart!`)}>
                  {item.btn || "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ig-block">
      <div className="ig-header">
        <span className="ig-title">🛒 Product Grid</span>
        <div className="ig-controls">
          <label className="ig-ctrl">Cols
            <input type="number" min={1} max={12} value={cols}
              onChange={e => onUpdate({ ...grid, cols: +e.target.value })} />
          </label>
          <label className="ig-ctrl">Gap
            <input type="number" min={0} max={80} step={4} value={gap}
              onChange={e => onUpdate({ ...grid, gap: +e.target.value })} />
          </label>
          <label className="ig-ctrl">Img W
            <input type="number" min={80} max={600} step={8} value={imgW}
              onChange={e => onUpdate({ ...grid, imgW: +e.target.value })} />
          </label>
          <label className="ig-ctrl">Img H
            <input type="number" min={60} max={600} step={8} value={imgH}
              onChange={e => onUpdate({ ...grid, imgH: +e.target.value })} />
          </label>
        </div>
        <button className="ig-remove" onClick={onRemove}>✕ Remove</button>
      </div>

      <div className="ig-cells" style={{ gridTemplateColumns: `repeat(${cols}, ${imgW}px)`, gap }}>
        {items.map((item, idx) => (
          <div key={idx} className="ig-product-card" style={{ width: imgW }}>
            {/* image */}
            <div className="ig-cell" style={{ width: imgW, height: imgH }}>
              {item.src
                ? <img src={item.src} alt={item.name} className="ig-img" />
                : <label className="ig-upload">
                    <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>Upload</span>
                    <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleUpload(idx, e)} />
                  </label>
              }
              {item.src && (
                <label className="ig-reupload" title="Change image">
                  📁
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleUpload(idx, e)} />
                </label>
              )}
              <button className="ig-cell-del" onClick={() => removeItem(idx)}>✕</button>
            </div>
            {/* product info */}
            <div className="ig-info">
              <div className="ig-field">
                <span className="ig-label">Name</span>
                <input className="ig-name" value={item.name}
                  onChange={e => updateItem(idx, "name", e.target.value)}
                  placeholder="Product Name" />
              </div>
              <div className="ig-field">
                <span className="ig-label">Price</span>
                <input className="ig-price" value={item.price}
                  onChange={e => updateItem(idx, "price", e.target.value)}
                  placeholder="$0.00" />
              </div>
              <div className="ig-field">
                <span className="ig-label">Button</span>
                <input className="ig-btn-text" value={item.btn}
                  onChange={e => updateItem(idx, "btn", e.target.value)}
                  placeholder="Add to Cart" />
              </div>
              <div className="ig-summary">
                <span className="ig-summary-name">{item.name || "Product"}</span>
                <span className="ig-summary-price">{item.price || "$0.00"}</span>
              </div>
            </div>
          </div>
        ))}
        {/* add card */}
        <button className="ig-add" style={{ width: imgW, height: imgH + 110 }} onClick={addItem}>
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Product
        </button>
      </div>
    </div>
  );
}

const LIBRARY = {
  "Landing Page": [
    { type: "navbar",     label: "Navbar",      icon: "☰",  defaultW: 600, defaultH: 52,  props: { text: "My Brand" } },
    { type: "hero",       label: "Hero",         icon: "★",  defaultW: 500, defaultH: 120, props: { text: "Big Headline Here" } },
    { type: "button",     label: "Button",       icon: "▶",  defaultW: 160, defaultH: 44,  props: { text: "Get Started" } },
    { type: "text",       label: "Paragraph",    icon: "¶",  defaultW: 400, defaultH: 60,  props: { text: "Your description goes here." } },
    { type: "image",      label: "Image",        icon: "🖼",  defaultW: 300, defaultH: 200, props: { src: "", alt: "Image" } },
  ],
  "Portfolio": [
    { type: "header",     label: "Name Header",  icon: "H",  defaultW: 400, defaultH: 64,  props: { text: "Your Name" } },
    { type: "text",       label: "Bio",          icon: "¶",  defaultW: 360, defaultH: 60,  props: { text: "Designer & Developer" } },
    { type: "image",      label: "Avatar",       icon: "🖼",  defaultW: 160, defaultH: 160, props: { src: "", alt: "Profile" } },
    { type: "card",       label: "Project Card", icon: "▣",  defaultW: 260, defaultH: 140, props: { text: "Project Title" } },
    { type: "button",     label: "Contact",      icon: "▶",  defaultW: 160, defaultH: 44,  props: { text: "Contact Me" } },
  ],
  "E-commerce": [
    { type: "navbar",     label: "Store Nav",    icon: "☰",  defaultW: 600, defaultH: 52,  props: { text: "My Store" } },
    { type: "image",      label: "Product Img",  icon: "🖼",  defaultW: 300, defaultH: 300, props: { src: "", alt: "Product" } },
    { type: "text",       label: "Product Name", icon: "¶",  defaultW: 300, defaultH: 44,  props: { text: "Product Title" } },
    { type: "text",       label: "Price",        icon: "$",  defaultW: 160, defaultH: 44,  props: { text: "$99.99" } },
    { type: "button",     label: "Add to Cart",  icon: "▶",  defaultW: 180, defaultH: 44,  props: { text: "Add to Cart" } },
  ],
  "Blog": [
    { type: "header",     label: "Blog Title",   icon: "H",  defaultW: 500, defaultH: 64,  props: { text: "My Blog" } },
    { type: "text",       label: "Article Title",icon: "¶",  defaultW: 460, defaultH: 48,  props: { text: "Article Headline" } },
    { type: "text",       label: "Body Text",    icon: "¶",  defaultW: 460, defaultH: 100, props: { text: "Article content goes here..." } },
    { type: "image",      label: "Cover Image",  icon: "🖼",  defaultW: 460, defaultH: 220, props: { src: "", alt: "Cover" } },
    { type: "card",       label: "Sidebar",      icon: "▣",  defaultW: 220, defaultH: 160, props: { text: "Sidebar Widget" } },
  ],
};

const WEBSITE_TYPES = ["Landing Page", "Portfolio", "E-commerce", "Blog"];
const TYPE_ICONS = { "Landing Page": "🚀", "Portfolio": "💼", "E-commerce": "🛒", "Blog": "📝" };

function renderComponent(comp, selected, onSelect, onDragMove, onDragEnd, onEdit, editingId, onImageUpload, isPreview = false) {
  const isEditing = !isPreview && editingId === comp.id;

  const handlePointerDown = (e) => {
    if (isPreview) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "LABEL") return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(comp.id);
    onDragMove(e, comp.id);
  };

  const inner = () => {
    if (comp.type === "image") {
      if (comp.props.src) {
        return <img src={comp.props.src} alt={comp.props.alt || "Image"} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, display: "block" }} />;
      }
      if (isPreview) {
        return (
          <div className="comp-img-placeholder">
            <span>🖼 Image Placeholder</span>
          </div>
        );
      }
      return (
        <label className="comp-img-upload-zone" onClick={(e) => e.stopPropagation()}>
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Click to upload image</span>
          <span className="comp-img-hint">or drag an image file here</span>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => onImageUpload(comp.id, ev.target.result, file.name);
              reader.readAsDataURL(file);
            }}
          />
        </label>
      );
    }
    if (isEditing) {
      return (
        <input
          className="comp-inline-edit"
          defaultValue={comp.props.text || comp.props.alt || ""}
          autoFocus
          onBlur={(e) => onEdit(comp.id, e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }
    return <span className={`comp-label comp-label-${comp.type}`}>{comp.props.text || comp.props.alt || comp.type}</span>;
  };

  return (
    <div
      key={comp.id}
      className={`canvas-comp comp-${comp.type}${!isPreview && selected ? " selected" : ""}${isPreview ? " preview-comp" : ""}`}
      style={{ left: comp.x, top: comp.y, width: comp.w, height: comp.h }}
      onPointerDown={handlePointerDown}
      onDoubleClick={(e) => {
        if (isPreview) return;
        e.stopPropagation();
        onSelect(comp.id);
        onEdit(comp.id, null);
      }}
    >
      {inner()}
      {!isPreview && selected && (
        <>
          {["nw","n","ne","e","se","s","sw","w"].map((dir) => (
            <div key={dir} className={`resize-handle r-${dir}`}
              onPointerDown={(e) => { e.stopPropagation(); onDragMove(e, comp.id, `resize-${dir}`); }}
            />
          ))}
          <div className="comp-type-badge">{comp.type}</div>
        </>
      )}
    </div>
  );
}

export default function Builder({ token, projectId, onBack }) {
  const [websiteType, setWebsiteType] = useState(null);
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!projectId);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [guides, setGuides] = useState([]);
  const [imageGrids, setImageGrids] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(projectId || null);
  const [projectName, setProjectName] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const canvasRef = useRef(null);
  const dragState = useRef(null);

  // Load existing project if projectId provided
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
          // Detect websiteType from name or default
          const types = ["Landing Page", "Portfolio", "E-commerce", "Blog"];
          const matched = types.find(t => p.name.includes(t)) || "Landing Page";
          setWebsiteType(matched);
          
          // Restore product grids
          const savedGrids = (p.components || [])
            .filter((c) => c.type === "productGrid" && c.properties?.grid)
            .map((c) => c.properties.grid);
          if (savedGrids.length > 0) {
            setImageGrids(savedGrids);
          }

          // Map saved regular components back to canvas format
          const mapped = (p.components || [])
            .filter((c) => c.type !== "productGrid")
            .map((c, i) => ({
              id: c.id || `${c.type}-${i}`,
              type: c.type,
              x: c.position?.x ?? i * 20,
              y: c.position?.y ?? i * 60,
              w: c.styles?.width ?? 280,
              h: c.styles?.height ?? 60,
              props: c.properties || {},
            }));
          setComponents(mapped);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  const addImageGrid = () => {
    setImageGrids(prev => [...prev, {
      id: `grid-${Date.now()}`,
      cols: 3, gap: 20, imgW: 220, imgH: 220,
      items: [
        { src:"", name:"Product Name", price:"$0.00", btn:"Add to Cart" },
        { src:"", name:"Product Name", price:"$0.00", btn:"Add to Cart" },
        { src:"", name:"Product Name", price:"$0.00", btn:"Add to Cart" },
      ]
    }]);
  };

  const updateGrid = (id, updated) => setImageGrids(prev => prev.map(g => g.id === id ? updated : g));
  const removeGrid  = (id) => setImageGrids(prev => prev.filter(g => g.id !== id));

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Pointer-based drag (move & resize) ──
  const startDrag = useCallback((e, id, mode = "move") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    setComponents((prev) => {
      const comp = prev.find((c) => c.id === id);
      if (!comp) return prev;
      dragState.current = {
        id, mode,
        startX: e.clientX, startY: e.clientY,
        origX: comp.x, origY: comp.y,
        origW: comp.w, origH: comp.h,
        canvasRect,
      };
      return prev;
    });

    const onMove = (ev) => {
      if (!dragState.current) return;
      const { id, mode, startX, startY, origX, origY, origW, origH } = dragState.current;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      setComponents((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          if (mode === "move") {
            const rawX = Math.max(0, origX + dx);
            const rawY = Math.max(0, origY + dy);
            const others = prev.filter((o) => o.id !== id);
            const { sx, sy, guideLines } = getSnapPosition(rawX, rawY, c.w, c.h, others);
            setGuides(guideLines);
            return { ...c, x: sx, y: sy };
          }
          let { x, y, w, h } = { x: origX, y: origY, w: origW, h: origH };
          if (mode.includes("e"))  w = snap(Math.max(40, origW + dx));
          if (mode.includes("s"))  h = snap(Math.max(24, origH + dy));
          if (mode.includes("w")) { w = snap(Math.max(40, origW - dx)); x = snap(origX + origW - w); }
          if (mode.includes("n")) { h = snap(Math.max(24, origH - dy)); y = snap(origY + origH - h); }
          return { ...c, x, y, w, h };
        })
      );
    };

    const onUp = () => {
      dragState.current = null;
      setGuides([]);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  // ── Drop from sidebar ──
  const handleSidebarDragStart = (e, comp) => {
    e.dataTransfer.setData("compDef", JSON.stringify(comp));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData("compDef");
    if (!raw) return;
    const def = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(Math.max(0, e.clientX - rect.left - def.defaultW / 2));
    const y = snap(Math.max(0, e.clientY - rect.top - def.defaultH / 2));
    const newComp = {
      id: `${def.type}-${Date.now()}`,
      type: def.type,
      x, y,
      w: def.defaultW,
      h: def.defaultH,
      props: { ...def.props },
    };
    setComponents((prev) => [...prev, newComp]);
    setSelected(newComp.id);
  };

  const handleEdit = (id, value) => {
    if (value !== null) {
      setComponents((prev) =>
        prev.map((c) => c.id === id ? { ...c, props: { ...c.props, text: value, alt: value } } : c)
      );
    }
    setEditingId(null);
  };

  const startEdit = (id, _) => setEditingId(id);

  const handleImageUpload = (id, src, name) => {
    setComponents((prev) =>
      prev.map((c) => c.id === id ? { ...c, props: { ...c.props, src, alt: name } } : c)
    );
  };

  const duplicateSelected = () => {
    if (!selected) return;
    setComponents((prev) => {
      const orig = prev.find((c) => c.id === selected);
      if (!orig) return prev;
      const copy = { ...orig, id: `${orig.type}-${Date.now()}`, x: orig.x + 24, y: orig.y + 24, props: { ...orig.props } };
      return [...prev, copy];
    });
  };

  const deleteSelected = () => {
    if (!selected) return;
    setComponents((prev) => prev.filter((c) => c.id !== selected));
    setSelected(null);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${API}/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ prompt: aiPrompt, websiteType }),
      });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.payload.components || []).map((c, i) => ({
          id: `${c.type}-ai-${Date.now()}-${i}`,
          type: c.type,
          x: snap(c.position?.x || i * 40),
          y: snap(c.position?.y || i * 60),
          w: 280, h: 60,
          props: { text: c.properties?.content || c.properties?.text || c.properties?.title || c.type },
        }));
        setComponents(mapped);
        setAiPrompt("");
        showToast("AI layout generated");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("AI request failed", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const ALLOWED_TYPES = ["button","input","text","image","container","form","navbar","footer","hero","header","card","productGrid"];

  const saveProject = async () => {
    if (components.length === 0 && imageGrids.length === 0) { showToast("Add components or products first", "error"); return; }
    if (!token) { showToast("Not logged in", "error"); return; }
    setSaving(true);
    try {
      const name = projectName || `${websiteType} ${new Date().toLocaleDateString()}`;
      
      const regularComps = components.map((c) => ({
        id: c.id || `comp-${Date.now()}`,
        type: ALLOWED_TYPES.includes(c.type) ? c.type : "container",
        properties: c.props || {},
        position: { x: c.x || 0, y: c.y || 0 },
        styles: { width: c.w, height: c.h },
      }));

      const gridComps = imageGrids.map((g) => ({
        id: g.id || `grid-${Date.now()}`,
        type: "productGrid",
        properties: { grid: g },
        position: { x: 0, y: 0 },
        styles: { width: 1000, height: 300 },
      }));

      const body = {
        name: name.length >= 2 ? name : "My Project",
        description: "Created with BuildX builder",
        components: [...regularComps, ...gridComps],
      };

      const isUpdate = !!currentProjectId;
      const url = isUpdate ? `${API}/projects/${currentProjectId}` : `${API}/projects`;
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        // Store the id so subsequent saves use PUT
        if (!isUpdate) setCurrentProjectId(data.payload.project._id);
        showToast(isUpdate ? "Project updated!" : "Project saved!");
        setTimeout(() => onBack(), 1200);
      } else if (res.status === 401) {
        showToast("Session expired — please sign in again", "error");
      } else {
        showToast(data.message || "Save failed", "error");
      }
    } catch (err) {
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading screen (when opening existing project) ──
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f13", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 36, height: 36, border: "3px solid #1e1e2e", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#475569", fontSize: 14 }}>Loading project…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Type selector (only for new projects) ──
  if (!websiteType) {
    return (
      <div className="builder-root">
        <div className="builder-type-screen">
          <button className="builder-back-btn" onClick={onBack}>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            Dashboard
          </button>
          <div className="builder-type-content">
            <h1>What are you building?</h1>
            <p>Choose a starting point for your project</p>
            <div className="builder-type-grid">
              {WEBSITE_TYPES.map((t) => (
                <button key={t} className="builder-type-card" onClick={() => setWebsiteType(t)}>
                  <span className="builder-type-icon">{TYPE_ICONS[t]}</span>
                  <span className="builder-type-name">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedComp = components.find((c) => c.id === selected);

  return (
    <div className={`builder-root ${isPreview ? "is-preview" : ""}`}>
      {toast && <div className={`builder-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Top bar */}
      {isPreview ? (
        <header className="builder-topbar builder-topbar-preview">
          <div className="preview-topbar-left">
            <span className="preview-mode-tag">👁 Preview Mode</span>
            <span className="preview-project-name">{projectName || websiteType}</span>
          </div>

          <div className="preview-device-switcher">
            <button
              className={`preview-device-btn ${previewDevice === "desktop" ? "active" : ""}`}
              onClick={() => setPreviewDevice("desktop")}
              title="Desktop view (Full Width)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 1v6h12V5H4zm-2 9a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span>Desktop</span>
            </button>
            <button
              className={`preview-device-btn ${previewDevice === "tablet" ? "active" : ""}`}
              onClick={() => setPreviewDevice("tablet")}
              title="Tablet view (768px)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v10H6V4zm4 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Tablet (768px)</span>
            </button>
            <button
              className={`preview-device-btn ${previewDevice === "mobile" ? "active" : ""}`}
              onClick={() => setPreviewDevice("mobile")}
              title="Mobile view (375px)"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 2h6v10H7V4zm3 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Mobile (375px)</span>
            </button>
          </div>

          <div className="preview-topbar-right">
            <button className="preview-exit-btn" onClick={() => setIsPreview(false)}>
              ✕ Exit Preview
            </button>
          </div>
        </header>
      ) : (
        <header className="builder-topbar">
          <div className="builder-topbar-left">
            <button className="builder-back-btn" onClick={onBack}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            </button>
            <div className="builder-topbar-title">
              <span className="builder-topbar-icon">{TYPE_ICONS[websiteType]}</span>
              <input
                className="builder-name-input"
                value={projectName || websiteType}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="builder-ai-bar">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe a layout with AI…"
              onKeyDown={(e) => e.key === "Enter" && generateWithAI()}
            />
            <button onClick={generateWithAI} disabled={aiLoading} className="ai-gen-btn">
              {aiLoading ? <span className="spinner-sm" /> : "✦ Generate"}
            </button>
          </div>

          <div className="builder-topbar-right">
            <button className="builder-preview-btn" onClick={() => { setSelected(null); setIsPreview(true); }}>
              👁 Preview
            </button>
            <button className="builder-clear-btn" onClick={() => { setComponents([]); setSelected(null); }}>Clear</button>
            <button className="builder-save-btn" onClick={saveProject} disabled={saving}>
              {saving ? <span className="spinner-sm" /> : "Save project"}
            </button>
          </div>
        </header>
      )}

      <div className={`builder-body ${isPreview ? "preview-active" : ""}`}>
        {/* Sidebar */}
        {!isPreview && (
          <aside className="builder-sidebar">
            <div className="builder-sidebar-section">
              <div className="builder-sidebar-label">Components</div>
              {(LIBRARY[websiteType] || []).map((comp, i) => (
                <div key={i} className="sidebar-comp-item" draggable
                  onDragStart={(e) => handleSidebarDragStart(e, comp)}>
                  <span className="sidebar-comp-icon">{comp.icon}</span>
                  <span className="sidebar-comp-label">{comp.label}</span>
                  <span className="sidebar-comp-size">{comp.defaultW}×{comp.defaultH}</span>
                </div>
              ))}
              <button className="sidebar-grid-btn" onClick={addImageGrid}>
                ⊞ Add Image Grid
              </button>
            </div>

            {selectedComp && (
              <div className="builder-sidebar-section builder-props-panel">
                <div className="builder-sidebar-label">Properties</div>
                <div className="prop-row">
                  <span>Type</span>
                  <span className="prop-val">{selectedComp.type}</span>
                </div>
                <div className="prop-row">
                  <span>X</span>
                  <input type="number" value={selectedComp.x}
                    onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, x: snap(+e.target.value) } : c))}
                  />
                </div>
                <div className="prop-row">
                  <span>Y</span>
                  <input type="number" value={selectedComp.y}
                    onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, y: snap(+e.target.value) } : c))}
                  />
                </div>
                <div className="prop-row prop-row-full">
                  <div className="prop-slider-label"><span>W</span><span className="prop-val">{selectedComp.w}px</span></div>
                  <input type="range" min={40} max={900} step={16} value={selectedComp.w}
                    className="prop-slider"
                    onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, w: +e.target.value } : c))}
                  />
                </div>
                <div className="prop-row prop-row-full">
                  <div className="prop-slider-label"><span>H</span><span className="prop-val">{selectedComp.h}px</span></div>
                  <input type="range" min={24} max={800} step={16} value={selectedComp.h}
                    className="prop-slider"
                    onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, h: +e.target.value } : c))}
                  />
                </div>
                <div className="prop-section-label">Quick align</div>
                <div className="prop-align-row">
                  {[16,24,32,48].map(gap => (
                    <button key={gap} className="prop-gap-btn"
                      title={`Move right by ${gap}px`}
                      onClick={() => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, x: c.x + gap } : c))}>
                      +{gap}
                    </button>
                  ))}
                </div>
                <div className="prop-align-row" style={{marginTop:4}}>
                  <button className="prop-align-btn" title="Align left edge to 0"
                    onClick={() => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, x: 0 } : c))}>⇤ Left</button>
                  <button className="prop-align-btn" title="Center horizontally"
                    onClick={() => {
                      const cw = canvasRef.current?.offsetWidth || 800;
                      setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, x: snap((cw - c.w) / 2) } : c));
                    }}>⊕ Center</button>
                  <button className="prop-align-btn" title="Align top edge to 0"
                    onClick={() => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, y: 0 } : c))}>⇡ Top</button>
                </div>
                {selectedComp.type !== "image" && (
                  <div className="prop-row prop-row-full">
                    <span>Text</span>
                    <input
                      type="text"
                      value={selectedComp.props.text || ""}
                      onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, props: { ...c.props, text: e.target.value } } : c))}
                    />
                  </div>
                )}
                {selectedComp.type === "image" && (
                  <>
                    <div className="prop-row prop-row-full">
                      <span>Upload</span>
                      <label className="img-upload-btn">
                        📁 Browse File
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              setComponents((prev) =>
                                prev.map((c) =>
                                  c.id === selected
                                    ? { ...c, props: { ...c.props, src: ev.target.result, alt: file.name } }
                                    : c
                                )
                              );
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    <div className="prop-row prop-row-full">
                      <span>URL</span>
                      <input
                        type="text"
                        value={selectedComp.props.src?.startsWith("data:") ? "" : selectedComp.props.src || ""}
                        placeholder="https://..."
                        onChange={(e) => setComponents((prev) => prev.map((c) => c.id === selected ? { ...c, props: { ...c.props, src: e.target.value } } : c))}
                      />
                    </div>
                    {selectedComp.props.src && (
                      <div className="prop-row prop-row-full">
                        <img
                          src={selectedComp.props.src}
                          alt="preview"
                          style={{ width: "100%", borderRadius: 6, maxHeight: 100, objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="prop-action-row">
                  <button className="prop-duplicate-btn" onClick={duplicateSelected}>⧉ Duplicate</button>
                  <button className="prop-delete-btn" onClick={deleteSelected}>✕ Delete</button>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Canvas */}
        <div className={`builder-canvas-wrap ${isPreview ? `preview-mode preview-device-${previewDevice}` : ""}`}>
          <div
            ref={canvasRef}
            className={`builder-canvas ${dragOver ? "drag-over" : ""} ${isPreview ? `preview-frame-${previewDevice}` : ""}`}
            onDrop={!isPreview ? handleCanvasDrop : undefined}
            onDragOver={!isPreview ? (e) => { e.preventDefault(); setDragOver(true); } : undefined}
            onDragLeave={!isPreview ? () => setDragOver(false) : undefined}
            onPointerDown={!isPreview ? (e) => { if (e.target === canvasRef.current) { setSelected(null); setEditingId(null); } } : undefined}
          >
            {components.length === 0 && imageGrids.length === 0 && (
              <div className="canvas-empty">
                <svg viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="40" height="40" rx="8" stroke="#2a2a3e" strokeWidth="2"/><path d="M16 24h16M24 16v16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                <p>{isPreview ? "This project has no components yet" : "Drag components here · or click ⊞ Add Product Grid"}</p>
              </div>
            )}

            {/* ALL components and grids in one flow column */}
            <div className={`canvas-flow ${isPreview ? "canvas-flow-preview" : ""}`}>
              {/* free-placed components rendered absolutely inside flow */}
              <div className={`canvas-abs-layer ${isPreview ? "canvas-abs-layer-preview" : ""}`}>
                {components.map((comp) =>
                  renderComponent(comp, selected === comp.id, setSelected, startDrag, null, startEdit, editingId, handleImageUpload, isPreview)
                )}
                {!isPreview && guides.map((g, i) =>
                  g.type === "v"
                    ? <div key={i} className="guide-v" style={{ left: g.pos }} />
                    : <div key={i} className="guide-h" style={{ top: g.pos }} />
                )}
                {!isPreview && selected && components.filter(c => c.id !== selected).map((o) => {
                  const s = components.find(c => c.id === selected);
                  if (!s) return null;
                  const gapH = o.x - (s.x + s.w);
                  const gapV = o.y - (s.y + s.h);
                  const showH = gapH > 0 && gapH < 200 && Math.abs((s.y + s.h/2) - (o.y + o.h/2)) < 80;
                  const showV = gapV > 0 && gapV < 200 && Math.abs((s.x + s.w/2) - (o.x + o.w/2)) < 80;
                  return (
                    <div key={`guide-group-${o.id}`}>
                      {showH && <div key={`dh-${o.id}`} className="dist-label" style={{ left: s.x + s.w + gapH/2, top: s.y + s.h/2 }}>{gapH}px</div>}
                      {showV && <div key={`dv-${o.id}`} className="dist-label" style={{ left: s.x + s.w/2, top: s.y + s.h + gapV/2 }}>{gapV}px</div>}
                    </div>
                  );
                })}
                {!isPreview && (
                  <svg className="canvas-grid" aria-hidden="true">
                    <defs><pattern id="grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse"><circle cx="0.5" cy="0.5" r="0.5" fill="#1e1e2e" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                )}
              </div>

              {/* product grids flow below free components */}
              {imageGrids.map(g => (
                <ImageGrid key={g.id} grid={g}
                  onUpdate={(updated) => updateGrid(g.id, updated)}
                  onRemove={() => removeGrid(g.id)}
                  isPreview={isPreview}
                />
              ))}
            </div>
          </div>
          {!isPreview && (
            <div className="canvas-status">
              {components.length} component{components.length !== 1 ? "s" : ""}
              {selected && ` · ${selectedComp?.type} selected · double-click to edit`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
