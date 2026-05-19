import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  ExternalLink,
  Send,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/DeleteModal";
import { useApplications, STATUS_CONFIG, formatDate } from "../hooks/useApplications";

const TIMELINE = [
  { status: "applied",   label: "Applied",    Icon: Send         },
  { status: "interview", label: "Interview",   Icon: Users        },
  { status: "offer",     label: "Offer",       Icon: CheckCircle  },
];

const DETAIL_FIELDS = (app) => [
  { label: "Location", val: app.location,           Icon: MapPin       },
  { label: "Salary",   val: app.salary,             Icon: DollarSign   },
  { label: "Applied",  val: formatDate(app.date),   Icon: Calendar     },
  { label: "Contact",  val: app.contact,            Icon: Mail         },
];

export default function ApplicationDetail() {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const { getById, deleteApplication, updateApplication, toggleStar } = useApplications();
  const [note, setNote]           = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const app = getById(id);

  if (!app) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Application not found</div>
            <button className="btn-primary" onClick={() => navigate("/applications")}>
              Back to list
            </button>
          </div>
        </div>
      </div>
    );
  }

  const s           = STATUS_CONFIG[app.status];
  const statusOrder = ["applied", "interview", "offer", "rejected"];

  const handleNoteAdd = () => {
    if (!note.trim()) return;
    const ts      = new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const updated = app.notes ? `${app.notes}\n\n[${ts}]\n${note}` : `[${ts}]\n${note}`;
    updateApplication(id, { notes: updated });
    setNote("");
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">

        {showDelete && (
          <DeleteModal
            title="Delete application?"
            description={`"${app.company} — ${app.role}" will be permanently removed. This cannot be undone.`}
            onConfirm={() => { deleteApplication(id); navigate("/applications"); }}
            onCancel={() => setShowDelete(false)}
          />
        )}

        {/* Header */}
        <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <button
            className="btn-sec"
            style={{ fontSize: 12, padding: "5px 11px", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={() => navigate("/applications")}
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: `${s.color}18`,
                border: `1px solid ${s.color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: s.color,
                flexShrink: 0,
              }}>
                {app.company[0]}
              </div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.4px", display: "flex", alignItems: "center", gap: 8 }}>
                  {app.company}
                  <button
                    className="icon-btn"
                    onClick={() => toggleStar(id)}
                    title={app.starred ? "Unstar" : "Star"}
                    style={{ color: app.starred ? "#f59e0b" : undefined }}
                  >
                    <Star
                      size={14}
                      strokeWidth={1.75}
                      fill={app.starred ? "#f59e0b" : "none"}
                      color={app.starred ? "#f59e0b" : "currentColor"}
                    />
                  </button>
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-muted)", fontWeight: 300 }}>{app.role}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-sec"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={() => navigate(`/applications/${id}/edit`)}
              >
                <Edit size={13} strokeWidth={1.75} />
                Edit
              </button>
              <button
                className="btn-danger"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                onClick={() => setShowDelete(true)}
              >
                <Trash2 size={13} strokeWidth={1.75} />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="detail-grid">

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Progress timeline */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px", marginBottom: 20 }}>
                Application progress
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {TIMELINE.map((step, i) => {
                  const done = statusOrder.indexOf(app.status) >= statusOrder.indexOf(step.status) && app.status !== "rejected";
                  const current = app.status === step.status;
                  const cfg = STATUS_CONFIG[step.status];
                  return (
                    <div key={step.status} style={{ display: "flex", alignItems: "center", flex: i < TIMELINE.length - 1 ? 1 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: done ? `${cfg.color}20` : "var(--surface2)",
                          border: `2px solid ${done ? cfg.color : "var(--border)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: current ? `0 0 12px ${cfg.color}40` : "none",
                          transition: "all .3s",
                        }}>
                          <step.Icon
                            size={14}
                            strokeWidth={1.75}
                            color={done ? cfg.color : "var(--text-muted)"}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: done ? cfg.color : "var(--text-muted)", fontWeight: done ? 500 : 300, whiteSpace: "nowrap" }}>
                          {step.label}
                        </span>
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: done ? STATUS_CONFIG.interview.color : "var(--border)",
                          margin: "0 6px",
                          marginBottom: 22,
                          transition: "background .3s",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {app.status === "rejected" && (
                <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: 8, fontSize: 12, color: "var(--danger)" }}>
                  Application rejected — every rejection is one step closer to the right role.
                </div>
              )}
            </div>

            {/* Update status */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px", marginBottom: 14 }}>Update status</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => updateApplication(id, { status: key })}
                    style={{
                      padding: "9px 14px",
                      borderRadius: 8,
                      border: "1px solid",
                      fontSize: 12.5,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "Geist, sans-serif",
                      textAlign: "left",
                      background: app.status === key ? cfg.bg : "transparent",
                      color: app.status === key ? cfg.color : "var(--text-muted)",
                      borderColor: app.status === key ? cfg.border : "var(--border)",
                      transition: "all .15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                    {cfg.label}
                    {app.status === key && (
                      <span style={{ marginLeft: "auto", fontSize: 10, opacity: .7 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px", marginBottom: 16 }}>Details</div>
              {DETAIL_FIELDS(app).map(({ label, val, Icon }) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 13, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} color="var(--text-muted)" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2, fontWeight: 500 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 13.5, color: val ? "var(--text)" : "var(--text-muted)", fontWeight: val ? 400 : 300 }}>
                      {val || "—"}
                    </div>
                  </div>
                </div>
              ))}

              {app.url && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ExternalLink size={13} color="var(--text-muted)" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2, fontWeight: 500 }}>
                      Job URL
                    </div>
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "var(--blue)", textDecoration: "none" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.url.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column — Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px", marginBottom: 16 }}>
                Notes & Log
              </div>

              <div style={{ marginBottom: 16 }}>
                <textarea
                  className="f-textarea"
                  placeholder="Add interview notes, follow-up reminders, impressions..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ minHeight: 80, marginBottom: 8 }}
                />
                <button
                  className="btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleNoteAdd}
                  disabled={!note.trim()}
                >
                  Add note
                </button>
              </div>

              <div style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "14px 16px",
                minHeight: 180,
                maxHeight: 420,
                overflowY: "auto",
              }}>
                {app.notes ? (
                  app.notes.split("\n\n").map((block, i, arr) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: 14,
                        paddingBottom: 14,
                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      {block.split("\n").map((line, j) => (
                        <div
                          key={j}
                          style={{
                            fontSize: line.startsWith("[") ? 11 : 13.5,
                            color: line.startsWith("[") ? "var(--text-muted)" : "var(--text)",
                            fontWeight: line.startsWith("[") ? 400 : 300,
                            lineHeight: 1.6,
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 300, fontStyle: "italic" }}>
                    No notes yet. Use the field above to log your progress.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
