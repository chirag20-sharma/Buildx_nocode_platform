import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE as API } from "./api.js";

export default function Dashboard({ token, user, onLogout, onOpenBuilder }) {
  const navigate = useNavigate();
  const activeToken = token || localStorage.getItem("token") || "";
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
    Authorization: `Bearer ${activeToken}`,
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
    if (onOpenBuilder) onOpenBuilder(() => { fetchProjects(); setTab("projects"); }, null);
    navigate("/builder");
  };

  const openEdit = (projectId) => {
    if (onOpenBuilder) onOpenBuilder(() => { fetchProjects(); setTab("projects"); }, projectId);
    navigate(`/builder/${projectId}`);
  };

  const handleUseTemplate = async (id, name) => {
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

  const SITE_BASE = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

  const getLiveUrl = (p) => {
    return p.publishedUrl || (p.slug ? `${SITE_BASE}/sites/${p.slug}` : `${SITE_BASE}/sites/${p._id}`);
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
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (statusFilter === "published") return p.isPublished;
    if (statusFilter === "draft") return !p.isPublished;
    return true;
  });

  // Filter templates by search and category
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const CATEGORY_META = {
    saas:         { label: "SaaS",        color: "#818cf8", bg: "rgba(99,102,241,0.15)" },
    blog:         { label: "Blog",        color: "#f87171", bg: "rgba(239,68,68,0.15)" },
    ecommerce:    { label: "E-Commerce",  color: "#fbbf24", bg: "rgba(245,158,11,0.15)" },
    portfolio:    { label: "Portfolio",   color: "#22d3ee", bg: "rgba(34,211,238,0.15)" },
    restaurant:   { label: "Restaurant",  color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    "landing-page":{ label: "Landing",    color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    dashboard:    { label: "Dashboard",   color: "#34d399", bg: "rgba(52,211,153,0.15)" },
    other:        { label: "Other",       color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex min-h-screen bg-[#07070c] text-[#f0f0ff] selection:bg-indigo-500 selection:text-white">
      {/* ── SIDEBAR ── */}
      <aside className="w-60 shrink-0 bg-[#0c0c16] border-r border-white/[0.08] flex flex-col p-5 sticky top-0 h-screen select-none z-20">
        <Link to="/dashboard" className="flex items-center gap-3 pb-5 border-b border-white/[0.08] mb-4 group">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-sm font-extrabold text-white shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
            B
          </span>
          <span className="text-base font-bold text-white tracking-tight">BuildX Studio</span>
        </Link>

        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer text-left w-full transition-all ${
              tab === "projects"
                ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
            onClick={() => { setTab("projects"); setSearchQuery(""); }}
          >
            <svg className="w-4 h-4 shrink-0 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 12a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2z" />
            </svg>
            My Websites
            <span className="ml-auto text-[10px] bg-white/[0.06] px-2 py-0.5 rounded-full font-mono text-slate-400">
              {projects.length}
            </span>
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer text-left w-full transition-all ${
              tab === "templates"
                ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
            onClick={() => { setTab("templates"); setSearchQuery(""); }}
          >
            <svg className="w-4 h-4 shrink-0 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </button>
        </nav>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-white/[0.08] mt-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">{user?.name || "Creator"}</span>
              <span className="text-[10px] text-slate-400 truncate">{user?.email || "Workspace"}</span>
            </div>
          </div>
          <button
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
            onClick={() => { localStorage.removeItem("token"); if (onLogout) onLogout(); navigate("/signin"); }}
            title="Sign out"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 py-8 px-8 lg:px-12 overflow-y-auto relative min-w-0">
        {toast && (
          <div
            className={`fixed top-5 right-5 px-4 py-2.5 rounded-xl text-xs font-semibold z-50 backdrop-blur-xl shadow-2xl animate-[bx-slide-in_0.2s_ease] ${
              toast.type === "error"
                ? "bg-red-950/90 text-red-200 border border-red-500/30"
                : "bg-emerald-950/90 text-emerald-200 border border-emerald-500/30"
            }`}
          >
            <span>{toast.msg}</span>
          </div>
        )}

        {tab === "projects" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">My Websites</h1>
                <p className="text-xs text-slate-400 mt-1">Build, edit, duplicate, and publish websites globally</p>
              </div>
              <button
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.98] text-white rounded-xl px-4.5 py-2.5 text-xs font-bold cursor-pointer transition shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                onClick={openNew}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Website
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="relative flex items-center flex-1 max-w-sm min-w-[220px]">
                <svg className="absolute left-3 text-slate-500 pointer-events-none w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d0d16] border border-white/[0.08] focus:border-indigo-500 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 text-slate-500 hover:text-white text-xs cursor-pointer p-1"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { id: "all", label: `All (${projects.length})` },
                  { id: "published", label: `Published (${projects.filter(p => p.isPublished).length})` },
                  { id: "draft", label: `Drafts (${projects.filter(p => !p.isPublished).length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                      statusFilter === f.id
                        ? "bg-indigo-600/25 border border-indigo-500/40 text-indigo-300"
                        : "bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white"
                    }`}
                    onClick={() => setStatusFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4 bg-[#0d0d15] border border-dashed border-white/[0.1] rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-3xl">
                  🚀
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No websites created yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">Create your first website or choose a template to get started instantly.</p>
                </div>
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  onClick={openNew}
                >
                  Start Building →
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3 bg-[#0d0d15] border border-white/[0.08] rounded-2xl">
                <h3 className="text-base font-bold text-white">No matching websites</h3>
                <p className="text-xs text-slate-400">Try adjusting your search query or status filter.</p>
                <button
                  className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer mt-2"
                  onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProjects.map((p) => {
                  const liveUrl = getLiveUrl(p);
                  return (
                    <div
                      key={p._id}
                      className="group bg-[#0d0d17] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col"
                      onClick={() => openEdit(p._id)}
                    >
                      {/* Card Preview Area */}
                      <div className="h-36 bg-gradient-to-br from-[#121226] via-[#101020] to-[#0a0a14] flex items-center justify-center text-4xl font-extrabold text-indigo-400 tracking-tight relative overflow-hidden select-none border-b border-white/[0.06]">
                        <span>{p.name ? p.name[0].toUpperCase() : "W"}</span>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(99,102,241,0.18)_0%,transparent_60%)] pointer-events-none" />

                        {/* 3-dots action button */}
                        <button
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 flex items-center justify-center cursor-pointer z-10 transition backdrop-blur-md opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === p._id ? null : p._id);
                          }}
                          title="Actions"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === p._id && (
                          <div
                            className="absolute top-11 right-2.5 bg-[#121222] border border-white/[0.12] rounded-xl p-1.5 min-w-[170px] shadow-2xl ring-1 ring-black/50 flex flex-col gap-0.5 z-30 animate-[bx-pop_0.15s_ease-out]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                              onClick={() => { setActiveMenuId(null); openEdit(p._id); }}
                            >
                              Edit in Builder
                            </button>
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                              onClick={() => { setActiveMenuId(null); setRenameModal({ isOpen: true, projectId: p._id, name: p.name }); }}
                            >
                              Rename
                            </button>
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                              onClick={() => { setActiveMenuId(null); duplicateProject(p); }}
                            >
                              Duplicate
                            </button>
                            {p.isPublished && (
                              <>
                                <button
                                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                                  onClick={() => { setActiveMenuId(null); window.open(liveUrl, "_blank"); }}
                                >
                                  View Live Site ↗
                                </button>
                                <button
                                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigator.clipboard.writeText(liveUrl);
                                    showToast("Live link copied to clipboard!");
                                  }}
                                >
                                  Copy Live URL
                                </button>
                              </>
                            )}
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white rounded-lg cursor-pointer transition text-left"
                              onClick={() => { setActiveMenuId(null); togglePublish(p); }}
                            >
                              {p.isPublished ? "Unpublish Site" : "Publish Site"}
                            </button>
                            <button
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg cursor-pointer transition text-left"
                              onClick={() => { setActiveMenuId(null); setDeleteModal({ isOpen: true, projectId: p._id, name: p.name }); }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition ${
                                p.isPublished
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/25"
                                  : "bg-white/[0.06] text-slate-400 border border-white/[0.08]"
                              }`}
                              onClick={(e) => {
                                if (p.isPublished) {
                                  e.stopPropagation();
                                  window.open(liveUrl, "_blank");
                                }
                              }}
                              title={p.isPublished ? "Click to view live site" : "Draft"}
                            >
                              {p.isPublished ? "Live ↗" : "Draft"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {p.description || "Created with BuildX visual canvas"}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                          <span>{p.components?.length || 0} nodes</span>
                          <span>{formatDate(p.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* New Project Tile */}
                <div
                  className="flex flex-col items-center justify-center gap-3 min-h-[200px] border-2 border-dashed border-white/[0.1] hover:border-indigo-500/50 hover:bg-indigo-600/5 rounded-2xl cursor-pointer transition-all group"
                  onClick={openNew}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] group-hover:bg-indigo-600/20 border border-white/[0.08] group-hover:border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg transition">
                    +
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition">
                    New Blank Project
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "templates" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Curated Templates</h1>
                <p className="text-xs text-slate-400 mt-1">Start faster with pre-architected layouts and components</p>
              </div>
            </div>

            {/* Template Filters */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {["all", "saas", "blog", "ecommerce", "portfolio", "restaurant", "dashboard"].map((cat) => (
                <button
                  key={cat}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                    categoryFilter === cat
                      ? "bg-indigo-600/25 border border-indigo-500/40 text-indigo-300"
                      : "bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white"
                  }`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === "all" ? "All Templates" : (CATEGORY_META[cat]?.label || cat)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((t) => {
                const meta = CATEGORY_META[t.category] || CATEGORY_META.other;
                const gradient = t.theme?.previewGradient || "135deg, #1e1b4b 0%, #312e81 100%";
                return (
                  <div
                    key={t._id}
                    className="group bg-[#0d0d17] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <div className="h-40 relative p-4 flex flex-col justify-between overflow-hidden" style={{ background: `linear-gradient(${gradient})` }}>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md"
                          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[10px] text-white/70 font-mono">
                          {t.components?.length || 0} nodes
                        </span>
                      </div>
                      <div className="py-2">
                        <h4 className="text-base font-bold text-white drop-shadow-sm">{t.name}</h4>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>

                      <button
                        className="w-full mt-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/20 border border-white/[0.08] hover:border-indigo-500/40 text-xs font-bold text-slate-200 hover:text-indigo-300 transition cursor-pointer"
                        onClick={() => handleUseTemplate(t._id, t.name)}
                      >
                        Use this template →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── Rename Modal ── */}
      {renameModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-[bx-fade-in_0.15s_ease]"
          onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}
        >
          <div
            className="bg-[#0e0e1a] border border-white/[0.12] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-[bx-pop_0.18s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">Rename Project</h3>
              <button
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
                onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitRename}>
              <div className="p-6">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#141424] border border-white/[0.1] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  value={renameModal.name}
                  onChange={(e) => setRenameModal({ ...renameModal, name: e.target.value })}
                  placeholder="Enter project name"
                  autoFocus
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] bg-black/20">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                  onClick={() => setRenameModal({ isOpen: false, projectId: null, name: "" })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-[bx-fade-in_0.15s_ease]"
          onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}
        >
          <div
            className="bg-[#0e0e1a] border border-white/[0.12] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-[bx-pop_0.18s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-red-400">Delete Project</h3>
              <button
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
                onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">"{deleteModal.name}"</strong>?
              </p>
              <p className="text-xs text-slate-400 mt-2">
                This action cannot be undone and will remove all canvas nodes and published URLs.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] bg-black/20">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                onClick={() => setDeleteModal({ isOpen: false, projectId: null, name: "" })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                onClick={submitDelete}
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
