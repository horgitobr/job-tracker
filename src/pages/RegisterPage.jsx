import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, User, Mail, Lock } from "lucide-react";
import { register } from "../auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const e = {};
    if (!fields.name.trim())            e.name     = "Full name is required.";
    if (!fields.email)                  e.email    = "Email is required.";
    else if (!EMAIL_RE.test(fields.email)) e.email = "Enter a valid email address.";
    if (!fields.password)               e.password = "Password is required.";
    else if (fields.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!fields.confirm)                e.confirm  = "Please confirm your password.";
    else if (fields.password !== fields.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = register({ name: fields.name, email: fields.email, password: fields.password });
    if (result.error) { setErrors({ form: result.error }); return; }
    navigate("/dashboard");
  }

  const inputClass = (key) => `auth-input${errors[key] ? " auth-input-err" : ""}`;

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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-sub">Start tracking your job search today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.form && <div className="auth-error-banner">{errors.form}</div>}

          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <User size={15} className="auth-input-icon" />
              <input
                type="text"
                className={inputClass("name")}
                placeholder="Jane Smith"
                autoComplete="name"
                value={fields.name}
                onChange={set("name")}
              />
            </div>
            {errors.name && <span className="auth-field-err">{errors.name}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                type="email"
                className={inputClass("email")}
                placeholder="you@example.com"
                autoComplete="email"
                value={fields.email}
                onChange={set("email")}
              />
            </div>
            {errors.email && <span className="auth-field-err">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                type="password"
                className={inputClass("password")}
                placeholder="••••••••"
                autoComplete="new-password"
                value={fields.password}
                onChange={set("password")}
              />
            </div>
            {errors.password && <span className="auth-field-err">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                type="password"
                className={inputClass("confirm")}
                placeholder="••••••••"
                autoComplete="new-password"
                value={fields.confirm}
                onChange={set("confirm")}
              />
            </div>
            {errors.confirm && <span className="auth-field-err">{errors.confirm}</span>}
          </div>

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
