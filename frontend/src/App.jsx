import { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Builder from "./Builder";
import PublishedPage from "./PublishedPage";
import LandingPage from "./LandingPage";
import Onboarding from "./Onboarding";
import TemplatePreviewPage from "./TemplatePreviewPage";
import TailwindTestPage from "./TailwindTestPage";
import { API_BASE as API } from "./api.js";


export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8fb" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e0e0ec", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

function PublicAuthRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8fb" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e0e0ec", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function BuilderRoute({ token, onBack }) {
  const { projectId } = useParams();
  return <Builder key={projectId || "new-project"} projectId={projectId} token={token} onBack={onBack} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check URL params for Google OAuth callback (?token=...&googleAuth=success)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleToken = params.get("token");
    if (googleToken) {
      localStorage.setItem("token", googleToken);
      setToken(googleToken);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  // Validate stored token against API
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setLoading(false);
      return;
    }

    fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${currentToken}` },
      credentials: "include",
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAuth = (t, u, isNewSignup = false) => {
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
    navigate(isNewSignup ? "/onboarding" : "/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, handleAuth, handleLogout, setToken, setUser }}>
      <Routes>
        <Route path="/tailwind-test" element={<TailwindTestPage />} />
        <Route
          path="/"
          element={
            <LandingPage
              onGetStarted={() => navigate("/signup")}
              onSignIn={() => navigate("/signin")}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <PublicAuthRoute>
              <SignIn onAuth={handleAuth} goToSignUp={() => navigate("/signup")} />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicAuthRoute>
              <SignUp onAuth={handleAuth} goToSignIn={() => navigate("/signin")} />
            </PublicAuthRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding user={user} onComplete={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                token={token}
                user={user}
                onLogout={handleLogout}
                onOpenBuilder={(_cb, id) => navigate(id ? `/builder/${id}` : "/builder")}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder key="new-project" token={token} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/:projectId"
          element={
            <ProtectedRoute>
              <BuilderRoute token={token} onBack={() => navigate("/dashboard")} />
            </ProtectedRoute>
          }
        />
        <Route path="/p/:projectId" element={<PublishedPage />} />
        <Route
          path="/templates/:id"
          element={<TemplatePreviewPage onClose={() => navigate("/dashboard")} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}
