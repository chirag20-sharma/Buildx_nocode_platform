import { useState, useEffect } from "react";
import "./dashboard.css";

const API = "http://localhost:5000/api/v1";

export default function Dashboard({ token, user, onLogout, onOpenBuilder }) {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [toast, setToast] = useState(null);

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
          <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 12a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2z"/></svg>
            Projects
          </button>
          <button className={tab === "templates" ? "active" : ""} onClick={() => setTab("templates")}>
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
          <button className="dash-logout" onClick={onLogout} title="Sign out">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 000-2H4V5h6a1 1 0 000-2H3zm11.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 11H9a1 1 0 010-2h6.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        {toast && <div className={`dash-toast ${toast.type}`}>{toast.msg}</div>}

        {tab === "projects" && (
          <>
            <div className="dash-header">
              <div>
                <h1>Projects</h1>
                <p>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
              </div>
              <button className="dash-cta" onClick={openNew}>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                New project
              </button>
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
            ) : (
              <div className="dash-grid">
                {projects.map((p) => (
                  <div key={p._id} className="dash-card" onClick={() => openEdit(p._id)}>
                    <div className="dash-card-preview">
                      <span>{p.name[0]}</span>
                    </div>
                    <div className="dash-card-body">
                      <h4>{p.name}</h4>
                      <p>{p.description || "No description"}</p>
                      <div className="dash-card-meta">
                        <span>{p.components?.length || 0} components</span>
                        <span className={`dash-badge ${p.isPublished ? "pub" : "draft"}`}>
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="dash-card-actions">
                        <button className="dash-edit-btn" onClick={(e) => { e.stopPropagation(); openEdit(p._id); }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

            {templates.length === 0 ? (
              <div className="dash-empty">
                <h3>No templates available</h3>
              </div>
            ) : (
              <div className="dash-grid">
                {templates.map((t) => (
                  <div key={t._id} className="dash-card">
                    <div className="dash-card-preview tpl">
                      <span>{t.name[0]}</span>
                    </div>
                    <div className="dash-card-body">
                      <div className="dash-card-top">
                        <h4>{t.name}</h4>
                        <span className="dash-tag">{t.category}</span>
                      </div>
                      <p>{t.description}</p>
                      <div className="dash-card-meta">
                        <span>{t.components?.length || 0} components</span>
                        <span>{t.usageCount || 0} uses</span>
                      </div>
                      <button className="dash-use-btn" onClick={() => useTemplate(t._id, t.name)}>
                        Use template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
