import { useState, useEffect } from "react";
import "./dashboard.css";

const API = "http://localhost:5000/api/v1";

export default function Dashboard({ token, user, onLogout, onOpenBuilder }) {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "published" | "draft"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [renameModal, setRenameModal] = useState({ isOpen: false, projectId: null, name: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null, name: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/projects`, {
        credentials: "include",
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) setProjects(data.payload.projects);
    } catch {}
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API}/templates`);
      const data = await res.json();
      if (data.success) setTemplates(data.payload.templates);
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    fetchTemplates();
  }, []);

  useEffect(() => {
    const onFocus = () => fetchProjects();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Close card action menus on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setRenameModal({ isOpen: false, projectId: null, name: "" });
        setDeleteModal({ isOpen: false, projectId: null, name: "" });
        setActiveMenuId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openNew = () => {
    onOpenBuilder(() => { fetchProjects(); setTab("projects"); }, null);
  };

  const openEdit = (projectId) => {
    onOpenBuilder(() => { fetchProjects(); setTab("projects"); }, projectId);
  };

  const useTemplate = async (id, name) => {
    try {
      const res = await fetch(`${API}/templates/${id}/use`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({ projectName: `${name} — Copy` }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project created from template");
        fetchProjects();
        setTab("projects");
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  // ── Rename Project ──
  const submitRename = async (e) => {
    e.preventDefault();
    if (!renameModal.name.trim() || renameModal.name.trim().length < 2) {
      showToast("Project name must be at least 2 characters", "error");
      return;
    }
    try {
      const res = await fetch(`${API}/projects/${renameModal.projectId}`, {
        method: "PUT",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({ name: renameModal.name.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project renamed successfully");
        setRenameModal({ isOpen: false, projectId: null, name: "" });
        fetchProjects();
      } else {
        showToast(data.message || "Failed to rename project", "error");
      }
    } catch {
      showToast("Error renaming project", "error");
    }
  };

  // ── Duplicate Project ──
  const duplicateProject = async (project) => {
    try {
      const res = await fetch(`${API}/projects`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({
          name: `${project.name} (Copy)`,
          description: project.description || "",
          components: project.components || [],
          settings: project.settings || { theme: "light", layout: "responsive" },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project duplicated");
        fetchProjects();
      } else {
        showToast(data.message || "Failed to duplicate project", "error");
      }
    } catch {
      showToast("Error duplicating project", "error");
    }
  };

  // ── Delete Project ──
  const submitDelete = async () => {
    try {
      const res = await fetch(`${API}/projects/${deleteModal.projectId}`, {
        method: "DELETE",
        headers: authHeaders,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Project deleted");
        setDeleteModal({ isOpen: false, projectId: null, name: "" });
        fetchProjects();
      } else {
        showToast(data.message || "Failed to delete project", "error");
      }
    } catch {
      showToast("Error deleting project", "error");
    }
  };

  const getLiveUrl = (p) => {
    return p.publishedUrl || (p.slug ? `http://localhost:5000/sites/${p.slug}` : `http://localhost:5000/sites/${p._id}`);
  };

  // ── Toggle Publish / Real Deploy ──
  const togglePublish = async (project) => {
    try {
      const isCurrentlyPublished = project.isPublished;
      const endpoint = isCurrentlyPublished
        ? `${API}/projects/${project._id}/unpublish`
        : `${API}/projects/${project._id}/publish`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchProjects();
      } else {
        showToast(data.message || "Failed to update publish status", "error");
      }
    } catch {
      showToast("Error toggling publish status", "error");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Filter projects by search and status
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (statusFilter === "published") return p.isPublished;
    if (statusFilter === "draft") return !p.isPublished;
    return true;
  });

  // Filter templates by search and category
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const CATEGORY_META = {
    saas:         { label: 'SaaS',        color: '#6366f1', bg: 'rgba(99,102,241,0.15)'  },
    blog:         { label: 'Blog',        color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   },
    ecommerce:    { label: 'E-commerce',  color: '#d97706', bg: 'rgba(217,119,6,0.15)'   },
    portfolio:    { label: 'Portfolio',   color: '#22d3ee', bg: 'rgba(34,211,238,0.15)'  },
    restaurant:   { label: 'Restaurant',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
    'landing-page':{ label: 'Landing',     color: '#818cf8', bg: 'rgba(129,140,248,0.15)' },
    dashboard:    { label: 'Dashboard',   color: '#34d399', bg: 'rgba(52,211,153,0.15)'  },
    other:        { label: 'Other',       color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-logo-mark">B</span>
          <span className="dash-logo-text">BuildX</span>
        </div>

        <nav className="dash-nav">
          <button className={tab === "projects" ? "active" : ""} onClick={() => { setTab("projects"); setSearchQuery(""); }}>
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 12a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2z"/></svg>
            Projects
          </button>
          <button className={tab === "templates" ? "active" : ""} onClick={() => { setTab("templates"); setSearchQuery(""); }}>
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
            Templates
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-user-info">
              <span className="dash-user-name">{user?.name || "User"}</span>
              <span className="dash-user-email">{user?.email || ""}</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={onLogout} title="Sign out">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        {toast && (
          <div className={`dash-toast ${toast.type}`}>
            <span>{toast.msg}</span>
          </div>
        )}

        {tab === "projects" && (
          <>
            <div className="dash-header">
              <div>
                <h1>My Websites</h1>
                <p>Manage, edit, and publish your websites</p>
              </div>
              <button className="dash-create-btn" onClick={openNew}>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                New Website
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="dash-toolbar">
              <div className="dash-search-box">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search projects by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="dash-clear-search" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>

              <div className="dash-filter-pills">
                <button
                  className={`dash-pill ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({projects.length})
                </button>
                <button
                  className={`dash-pill ${statusFilter === "published" ? "active" : ""}`}
                  onClick={() => setStatusFilter("published")}
                >
                  Published ({projects.filter((p) => p.isPublished).length})
                </button>
                <button
                  className={`dash-pill ${statusFilter === "draft" ? "active" : ""}`}
                  onClick={() => setStatusFilter("draft")}
                >
                  Drafts ({projects.filter((p) => !p.isPublished).length})
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon">
                  <svg viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="36" height="36" rx="6" stroke="#3b3b52" strokeWidth="2"/><path d="M16 24h16M24 16v16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3>No projects yet</h3>
                <p>Create your first project to get started</p>
                <button className="dash-cta" onClick={openNew}>Start building</button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="dash-empty">
                <h3>No matching projects</h3>
                <p>Try searching for a different name or changing the status filter</p>
                <button className="dash-pill active" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="dash-grid">
                {filteredProjects.map((p) => {
                  const liveUrl = getLiveUrl(p);
                  return (
                    <div key={p._id} className="dash-card" onClick={() => openEdit(p._id)}>
                      <div className="dash-card-preview">
                        <span>{p.name[0]}</span>
                        {/* 3-dots action button */}
                        <button
                          className="dash-card-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === p._id ? null : p._id);
                          }}
                          title="Project actions"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === p._id && (
                          <div className="dash-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => { setActiveMenuId(null); openEdit(p._id); }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit Canvas
                            </button>
                            <button onClick={() => { setActiveMenuId(null); setRenameModal({ isOpen: true, projectId: p._id, name: p.name }); }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                              </svg>
                              Rename
                            </button>
                            <button onClick={() => { setActiveMenuId(null); duplicateProject(p); }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/>
                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"/>
                              </svg>
                              Duplicate
                            </button>
                            {p.isPublished && (
                              <>
                                <button onClick={() => { setActiveMenuId(null); window.open(liveUrl, '_blank'); }}>
                                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                  </svg>
                                  View Live Site
                                </button>
                                <button onClick={() => {
                                  setActiveMenuId(null);
                                  navigator.clipboard.writeText(liveUrl);
                                  showToast("Live link copied to clipboard!");
                                }}>
                                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                                  </svg>
                                  Copy Live Link
                                </button>
                              </>
                            )}
                            <button onClick={() => { setActiveMenuId(null); togglePublish(p); }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-.2c0-1.4-1.4-2.8-2.8-2.8H7a1 1 0 01-1-1v-1a2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                              </svg>
                              {p.isPublished ? "Unpublish" : "Publish Site"}
                            </button>
                            <button className="delete-item" onClick={() => { setActiveMenuId(null); setDeleteModal({ isOpen: true, projectId: p._id, name: p.name }); }}>
                              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="dash-card-body">
                        <div className="dash-card-top">
                          <h4>{p.name}</h4>
                          <span
                            className={`dash-badge ${p.isPublished ? "pub pub-clickable" : "draft"}`}
                            onClick={(e) => {
                              if (p.isPublished) {
                                e.stopPropagation();
                                window.open(liveUrl, '_blank');
                              }
                            }}
                            title={p.isPublished ? "Click to open live published site" : "Draft"}
                          >
                            {p.isPublished ? "Published ↗" : "Draft"}
                          </span>
                        </div>
                        <p>{p.description || "No description provided"}</p>
                        <div className="dash-card-meta">
                          <span>{p.components?.length || 0} components</span>
                          {p.updatedAt && <span className="dash-card-date">{formatDate(p.updatedAt)}</span>}
                        </div>
                        <div className="dash-card-actions">
                          <button className="dash-edit-btn" onClick={(e) => { e.stopPropagation(); openEdit(p._id); }}>
                            Open Builder
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="dash-card dash-card-new" onClick={openNew}>
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span>New project</span>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "templates" && (
          <>
            <div className="dash-header">
              <div>
                <h1>Templates</h1>
                <p>Start faster with a pre-built layout</p>
              </div>
            </div>

            {/* Template Toolbar */}
            <div className="dash-toolbar">
              <div className="dash-search-box">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="dash-clear-search" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>

              <div className="dash-filter-pills">
                {["all", "saas", "blog", "ecommerce", "portfolio", "restaurant", "dashboard"].map((cat) => (
                  <button
                    key={cat}
                    className={`dash-pill ${categoryFilter === cat ? "active" : ""}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === "all" ? "All Templates" : (CATEGORY_META[cat]?.label || cat)}
                  </button>
                ))}
              </div>
            </div>

            {templates.length === 0 ? (
              <div className="dash-empty">
                <h3>No templates available</h3>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="dash-empty">
                <h3>No matching templates</h3>
                <p>Try searching for a different keyword or category</p>
                <button className="dash-pill active" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="dash-grid">
                {filteredTemplates.map((t) => {
                  const meta = CATEGORY_META[t.category] || CATEGORY_META.other;
                  const gradient = t.theme?.previewGradient || "135deg, #1e1b4b 0%, #312e81 100%";
                  return (
                    <div key={t._id} className="dash-card tpl-card">
                      <div className="dash-card-preview tpl" style={{ background: `linear-gradient(${gradient})` }}>
                        <div className="tpl-preview-inner">
                          <div className="tpl-preview-lines">
                            <div className="tpl-line tpl-line-nav" style={{ background: meta.color }} />
                            <div className="tpl-line tpl-line-hero" />
                            <div className="tpl-line tpl-line-hero tpl-line-short" />
                            <div className="tpl-line-cards">
                              <div className="tpl-mini-card" />
                              <div className="tpl-mini-card" />
                              <div className="tpl-mini-card" />
                            </div>
                          </div>
                        </div>
                        <span className="tpl-cat-badge" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="dash-card-body">
                        <div className="dash-card-top">
                          <h4>{t.name}</h4>
                        </div>
                        <p>{t.description}</p>
                        {t.features?.length > 0 && (
                          <ul className="tpl-features">
                            {t.features.slice(0, 4).map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                            {t.features.length > 4 && <li className="tpl-features-more">+{t.features.length - 4} more</li>}
                          </ul>
                        )}
                        <div className="dash-card-meta">
                          <span>{t.components?.length || 0} components</span>
                          <span>{t.usageCount || 0} uses</span>
                        </div>
                        <button className="dash-use-btn" style={{ borderColor: `${meta.color}50`, color: meta.color }} onClick={() => useTemplate(t._id, t.name)}>
                          Use this template
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Rename Modal ── */}
      {renameModal.isOpen && (
        <div className="dash-modal-backdrop" onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>Rename Project</h3>
              <button className="dash-modal-close" onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}>✕</button>
            </div>
            <form onSubmit={submitRename}>
              <div className="dash-modal-body">
                <label className="dash-modal-label">Project Name</label>
                <input
                  type="text"
                  className="dash-modal-input"
                  value={renameModal.name}
                  onChange={(e) => setRenameModal({ ...renameModal, name: e.target.value })}
                  placeholder="Enter project name"
                  autoFocus
                  required
                />
              </div>
              <div className="dash-modal-footer">
                <button type="button" className="dash-modal-btn-cancel" onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}>
                  Cancel
                </button>
                <button type="submit" className="dash-modal-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal.isOpen && (
        <div className="dash-modal-backdrop" onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3 style={{ color: "#f87171" }}>Delete Project</h3>
              <button className="dash-modal-close" onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}>✕</button>
            </div>
            <div className="dash-modal-body">
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6" }}>
                Are you sure you want to permanently delete <strong>"{deleteModal.name}"</strong>?
              </p>
              <p style={{ color: "#94a3b8", fontSize: "12.5px", marginTop: "8px" }}>
                This action cannot be undone and all saved components will be removed.
              </p>
            </div>
            <div className="dash-modal-footer">
              <button type="button" className="dash-modal-btn-cancel" onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}>
                Cancel
              </button>
              <button type="button" className="dash-modal-btn-danger" onClick={submitDelete}>
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
