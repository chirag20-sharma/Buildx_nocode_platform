import { useState, useRef, useEffect } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Builder from "./Builder";
import PublishedPage from "./PublishedPage";

const API = "http://localhost:5000/api/v1";

export default function App() {
  // Check if current path is a public published website (/p/:id)
  const pathname = window.location.pathname;
  const isPublicView = pathname.startsWith("/p/");
  const publicProjectId = isPublicView ? pathname.replace("/p/", "").split("/")[0] : null;

  const storedToken = localStorage.getItem("token") || "";
  const [page, setPage] = useState(isPublicView ? "published" : storedToken ? "checking" : "signin");
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(null);
  const [editProjectId, setEditProjectId] = useState(null);
  const onBackCallback = useRef(null);

  useEffect(() => {
    if (isPublicView) return; // Do not check auth for public visitors
    if (page !== "checking") return;
    fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${storedToken}` },
      credentials: "include",
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("token");
          setToken("");
          setPage("signin");
        } else {
          setPage("dashboard");
        }
      })
      .catch(() => setPage("dashboard"));
  }, []);

  const handleAuth = (t, u) => {
    setToken(t);
    setUser(u);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setPage("signin");
  };

  // projectId = null means new project, string means edit existing
  const handleOpenBuilder = (onReturnCallback, projectId = null) => {
    onBackCallback.current = onReturnCallback || null;
    setEditProjectId(projectId);
    setPage("builder");
  };

  const handleBuilderBack = () => {
    setPage("dashboard");
    setEditProjectId(null);
    if (onBackCallback.current) {
      onBackCallback.current();
      onBackCallback.current = null;
    }
  };

  if (page === "published")
    return <PublishedPage projectId={publicProjectId} />;

  if (page === "checking")
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f13" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #1e1e2e", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (page === "signin")
    return <SignIn onAuth={handleAuth} goToSignUp={() => setPage("signup")} />;

  if (page === "signup")
    return <SignUp onAuth={handleAuth} goToSignIn={() => setPage("signin")} />;

  if (page === "builder")
    return <Builder token={token} projectId={editProjectId} onBack={handleBuilderBack} />;

  return (
    <Dashboard
      token={token}
      user={user}
      onLogout={handleLogout}
      onOpenBuilder={handleOpenBuilder}
    />
  );
}
