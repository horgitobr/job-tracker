import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useApplications, STATUS_CONFIG } from "../hooks/useApplications";

const empty = {
  company: "",
  role: "",
  location: "",
  status: "applied",
  date: new Date().toISOString().split("T")[0],
  salary: "",
  url: "",
  contact: "",
  notes: "",
};

const STATUS_OPTS = Object.entries(STATUS_CONFIG).map(([val, cfg]) => ({
  val,
  label: cfg.label,
  color: cfg.color,
  desc: val === "applied" ? "Just submitted the application"
      : val === "interview" ? "Scheduled or completed interview"
      : val === "offer" ? "Received a job offer"
      : "Application not selected",
}));

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const { addApplication, updateApplication, getById } = useApplications();

  const statusParam = searchParams.get("status");
  const initialStatus =
    !isEdit && statusParam && STATUS_CONFIG[statusParam] ? statusParam : "applied";

  const [form, setForm] = useState({ ...empty, status: initialStatus });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const found = getById(id);
      if (found) setForm(found);
    }
  }, [id]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.role.trim()) e.role = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (isEdit) {
      updateApplication(id, form);
      navigate(`/applications/${id}`);
    } else {
      const n = addApplication(form);
      navigate(`/applications/${n.id}`);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <div>
            <div className="page-title">
              {isEdit ? "Edit Application" : "New Application"}
            </div>
            <div className="page-subtitle">
              {isEdit
                ? "Update the application details"
                : "Track a new job you applied to"}
            </div>
          </div>
          <button
            className="btn-sec"
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            Back
          </button>
        </div>

        <div style={{ padding: "24px 32px 48px", maxWidth: 700 }}>
          {/* Section: Core info */}
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Job Information
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "22px 24px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                {[
                  {
                    label: "Company *",
                    k: "company",
                    placeholder: "e.g. Stripe, Vercel, Linear",
                  },
                  {
                    label: "Role *",
                    k: "role",
                    placeholder: "e.g. Software Engineer",
                  },
                ].map((f) => (
                  <div key={f.k}>
                    <label className="f-label">{f.label}</label>
                    <input
                      className="f-input"
                      placeholder={f.placeholder}
                      value={form[f.k]}
                      onChange={set(f.k)}
                      style={
                        errors[f.k]
                          ? { borderColor: "rgba(248,113,113,.5)" }
                          : {}
                      }
                    />
                    {errors[f.k] && (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#f87171",
                          marginTop: 4,
                        }}
                      >
                        {errors[f.k]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label className="f-label">Location</label>
                  <input
                    className="f-input"
                    placeholder="Remote, New York, London..."
                    value={form.location}
                    onChange={set("location")}
                  />
                </div>
                <div>
                  <label className="f-label">Salary / Range</label>
                  <input
                    className="f-input"
                    placeholder="$120,000 · €60k · Competitive"
                    value={form.salary}
                    onChange={set("salary")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div style={{ marginTop: 20, marginBottom: 8 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Status
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 8,
              }}
            >
              {STATUS_OPTS.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setForm((f) => ({ ...f, status: opt.val }))}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 10,
                    border: "1px solid",
                    background:
                      form.status === opt.val
                        ? `${opt.color}12`
                        : "var(--surface)",
                    borderColor:
                      form.status === opt.val
                        ? `${opt.color}40`
                        : "var(--border)",
                    cursor: "pointer",
                    fontFamily: "Geist, sans-serif",
                    textAlign: "center",
                    transition: "all .15s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color:
                        form.status === opt.val
                          ? opt.color
                          : "var(--text-muted)",
                      marginBottom: 4,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "var(--text-muted)",
                      lineHeight: 1.4,
                      fontWeight: 300,
                    }}
                  >
                    {opt.desc}
                  </div>
                  {form.status === opt.val && (
                    <div
                      style={{ fontSize: 11, color: opt.color, marginTop: 5 }}
                    >
                      ✓ Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Details */}
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Additional Details
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "22px 24px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label className="f-label">Date Applied</label>
                  <input
                    className="f-input"
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                  />
                </div>
                <div>
                  <label className="f-label">Contact Email</label>
                  <input
                    className="f-input"
                    placeholder="recruiter@company.com"
                    value={form.contact}
                    onChange={set("contact")}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="f-label">Job URL</label>
                <input
                  className="f-input"
                  placeholder="https://..."
                  value={form.url}
                  onChange={set("url")}
                />
              </div>
              <div>
                <label className="f-label">Notes</label>
                <textarea
                  className="f-textarea"
                  placeholder="Interview impressions, follow-up dates, referrals, anything relevant..."
                  value={form.notes}
                  onChange={set("notes")}
                  style={{ minHeight: 100 }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
              justifyContent: "flex-end",
            }}
          >
            <button className="btn-sec" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              style={{ minWidth: 160 }}
            >
              {isEdit ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
