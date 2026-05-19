import { useNavigate } from "react-router-dom";
import {
  Send,
  Users,
  CheckCircle,
  TrendingUp,
  Plus,
  Briefcase,
  Info,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useApplications, STATUS_CONFIG, formatDate } from "../hooks/useApplications";

const STAT_CARDS = [
  { label: "Total Applied",  key: "total",     Icon: Send,        color: "#e2e8f0", sub: "all time"  },
  { label: "Interviewing",   key: "interview",  Icon: Users,       color: "#a78bfa", sub: "active"    },
  { label: "Offers",         key: "offer",      Icon: CheckCircle, color: "#34d399", sub: "received"  },
  { label: "Rejected",       key: "rejected",   Icon: TrendingUp,  color: "#f87171", sub: "closed"    },
];

// Nudge the user when applications have been sitting idle for too long
function getInsight(apps) {
  if (!apps.length) return null;

  const now     = Date.now();
  const MS_10D  = 10 * 24 * 60 * 60 * 1000;
  const MS_7D   =  7 * 24 * 60 * 60 * 1000;

  const stale = apps.filter(
    (a) => a.status === "applied" && now - new Date(a.date).getTime() > MS_10D,
  );
  if (stale.length >= 2) {
    return `${stale.length} application${stale.length > 1 ? "s" : ""} have been in "Applied" for 10+ days — consider following up.`;
  }

  const active = apps.filter((a) => a.status !== "rejected");
  if (active.length >= 3 && active.every((a) => a.status === "applied")) {
    return "All your active applications are still in the Applied stage. Following up can improve your chances.";
  }

  const recent = apps.filter((a) => now - new Date(a.date).getTime() < MS_7D);
  if (!recent.length) {
    return "No applications added in the past 7 days.";
  }

  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { applications, stats } = useApplications();

  const recent = [...applications]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Minimum of 1 prevents division by zero when there are no applications yet
  const barMax = Math.max(stats.applied, stats.interview, stats.offer, stats.rejected, 1);
  const bars = [
    { label: "Applied",   val: stats.applied,   color: "#3b82f6" },
    { label: "Interview", val: stats.interview,  color: "#a78bfa" },
    { label: "Offer",     val: stats.offer,      color: "#34d399" },
    { label: "Rejected",  val: stats.rejected,   color: "#f87171" },
  ];

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const insight  = getInsight(applications);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">{greeting}</div>
            <div className="page-subtitle">
              {stats.total === 0
                ? "Start by adding your first application."
                : `${stats.interview} active interview${stats.interview !== 1 ? "s" : ""} · ${stats.offer} offer${stats.offer !== 1 ? "s" : ""} in pipeline`}
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/applications/add")}
          >
            <Plus size={14} strokeWidth={2} style={{ marginRight: 4 }} />
            New Application
          </button>
        </div>

        {/* Empty state */}
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Briefcase size={22} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <div className="empty-title">Your dashboard is empty</div>
            <div className="empty-desc">
              Add your first job application to start tracking your pipeline,
              stats, and progress.
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate("/applications/add")}
            >
              Add first application
            </button>
          </div>
        ) : (
          <>
            {/* Data-driven insight */}
            {insight && (
              <div className="insight-box">
                <Info
                  size={14}
                  color="var(--blue)"
                  strokeWidth={1.75}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>{insight}</span>
              </div>
            )}

            {/* 4 stat cards */}
            <div className="dash-stat-grid">
              {STAT_CARDS.map(({ label, key, Icon, color, sub }) => (
                <div key={key} className="stat-card">
                  <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.18 }}>
                    <Icon size={22} color={color} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 500 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 800, color, letterSpacing: "-1.5px", lineHeight: 1 }}>
                    {stats[key]}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                    {sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline chart + recent activity */}
            <div className="dash-charts-grid">

              {/* Pipeline bar chart */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px", marginBottom: 20 }}>
                  Pipeline breakdown
                </div>
                {bars.map((b) => (
                  <div key={b.label} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 7 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: b.color, display: "inline-block", flexShrink: 0 }} />
                        {b.label}
                      </span>
                      <span style={{ color: b.color, fontWeight: 500 }}>
                        {b.val}
                        {" "}
                        <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>
                          ({stats.total > 0 ? Math.round((b.val / stats.total) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(b.val / barMax) * 100}%`,
                        background: b.color,
                        borderRadius: 2,
                        transition: "width .8s cubic-bezier(.16,1,.3,1)",
                        minWidth: b.val > 0 ? 4 : 0,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.2px" }}>Recent applications</div>
                  <button
                    className="btn-sec"
                    style={{ fontSize: 11, padding: "5px 12px" }}
                    onClick={() => navigate("/applications")}
                  >
                    View all
                  </button>
                </div>

                {recent.map((app, i) => {
                  const s = STATUS_CONFIG[app.status];
                  return (
                    <div
                      key={app.id}
                      className="row-link"
                      onClick={() => navigate(`/applications/${app.id}`)}
                      style={{ borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none" }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: `${s.color}18`,
                        border: `1px solid ${s.color}28`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: s.color, flexShrink: 0,
                      }}>
                        {app.company[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {app.company}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 300 }}>
                          {app.role}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, padding: "3px 9px", borderRadius: 5,
                        background: s.bg, color: s.color,
                        border: `1px solid ${s.border}`,
                        fontWeight: 500, flexShrink: 0,
                      }}>
                        {s.label}
                      </span>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", minWidth: 90, textAlign: "right", flexShrink: 0 }}>
                        {formatDate(app.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
