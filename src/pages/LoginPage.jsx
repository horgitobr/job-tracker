import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Lock } from "lucide-react";
import { login } from "../auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const user = login(email, password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="auth-root">
      <div className="auth-card anim-0">
        <div className="auth-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="nav-logo-mark">
            <Briefcase size={13} color="#fff" strokeWidth={2} />
          </div>
          <span className="auth-logo-text">JobTrackr</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error-banner">{error}</div>}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
