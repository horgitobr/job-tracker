import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Star, Edit, Trash2, MapPin, DollarSign } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/DeleteModal";
import { useApplications, STATUS_CONFIG, formatDate } from "../hooks/useApplications";

const STATUS_TABS = ["all", "starred", "applied", "interview", "offer", "rejected"];

export default function ApplicationList() {
  const navigate = useNavigate();
  const { applications, deleteApplication, toggleStar } = useApplications();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [sort, setSort]       = useState("date-desc");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = applications
    .filter((a) => {
      const matchStatus =
        filter === "all" ? true :
        filter === "starred" ? Boolean(a.starred) :
        a.status === filter;
      const q = search.toLowerCase();
      return (
        matchStatus &&
        (!q ||
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          (a.location || "").toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sort === "date-asc")  return new Date(a.date) - new Date(b.date);
      if (sort === "company")   return a.company.localeCompare(b.company);
      return 0;
    });

  const counts = {};
  STATUS_TABS.forEach((c) => {
    if (c === "all") counts[c] = applications.length;
    else if (c === "starred") counts[c] = applications.filter((a) => a.starred).length;
    else counts[c] = applications.filter((a) => a.status === c).length;
  });

  const appToDelete = deleteId ? applications.find((a) => a.id === deleteId) : null;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">

        {deleteId && (
          <DeleteModal
            title="Delete application?"
            description={`"${appToDelete?.company} — ${appToDelete?.role}" will be permanently removed. This cannot be undone.`}
            onConfirm={() => { deleteApplication(deleteId); setDeleteId(null); }}
            onCancel={() => setDeleteId(null)}
          />
        )}

        {/* Header */}
        <div className="list-header">
          <div className="list-header-row">
            <div>
              <div className="page-title">Applications</div>
              <div className="page-subtitle">
                {filtered.length} of {applications.length} shown
              </div>
            </div>
            <button className="btn-primary" onClick={() => navigate("/applications/add")}>
              + New Application
            </button>
          </div>

          {/* Status tabs */}
          <div className="list-tabs">
            {STATUS_TABS.map((c) => {
              const cfg = STATUS_CONFIG[c];
              const active = filter === c;
              const isStarred = c === "starred";
              const isAll = c === "all";
              const label = isAll ? "All" : isStarred ? "Starred" : cfg.label;
              const badgeBg = active
                ? isAll ? "rgba(255,255,255,.1)"
                : isStarred ? "rgba(245,158,11,.15)"
                : cfg.bg
                : "var(--surface2)";
              const badgeColor = active
                ? isAll ? "var(--text)"
                : isStarred ? "#f59e0b"
                : cfg.color
                : "var(--text-muted)";
              const activeBorder = isStarred && active ? "#f59e0b" : "var(--blue)";

              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: "10px 18px",
                    background: "none",
                    border: "none",
                    borderBottom: active ? `2px solid ${activeBorder}` : "2px solid transparent",
                    color: active
                      ? isStarred ? "#f59e0b" : "var(--text)"
                      : "var(--text-muted)",
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    cursor: "pointer",
                    fontFamily: "Geist, sans-serif",
                    transition: "color .15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  {isStarred && (
                    <Star
                      size={11}
                      strokeWidth={1.75}
                      fill={active ? "#f59e0b" : "none"}
                      color={active ? "#f59e0b" : "currentColor"}
                    />
                  )}
                  {label}
                  <span style={{
                    background: badgeBg,
                    color: badgeColor,
                    padding: "1px 7px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500,
                  }}>
                    {counts[c]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + sort toolbar */}
        <div className="list-toolbar">
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={14}
              strokeWidth={1.75}
              style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
            />
            <input
              className="f-input"
              placeholder="Search companies, roles, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34, paddingRight: search ? 34 : 13 }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 2 }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <select
            className="f-select"
            style={{ width: 160 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {filter === "starred"
                ? <Star size={20} color="var(--text-muted)" strokeWidth={1.5} />
                : <Search size={20} color="var(--text-muted)" strokeWidth={1.5} />
              }
            </div>
            <div className="empty-title">
              {search
                ? "No results found"
                : filter === "starred"
                ? "No starred applications"
                : "No applications yet"}
            </div>
            <div className="empty-desc">
              {search
                ? `No applications match "${search}". Try a different search term.`
                : filter === "starred"
                ? "Star applications to highlight the ones you care about most."
                : "Add your first application to start tracking your job search."}
            </div>
            {!search && filter !== "starred" && (
              <button className="btn-primary" onClick={() => navigate("/applications/add")}>
                Add first application
              </button>
            )}
          </div>
        ) : (
          <div className="app-cards-grid">
            {filtered.map((app) => {
              const s = STATUS_CONFIG[app.status];
              return (
                <div
                  key={app.id}
                  className="app-card"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  {/* Top row: avatar + badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: `${s.color}18`,
                      border: `1px solid ${s.color}28`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      color: s.color,
                      flexShrink: 0,
                    }}>
                      {app.company[0]}
                    </div>
                    <span style={{
                      fontSize: 11,
                      padding: "3px 9px",
                      borderRadius: 5,
                      background: s.bg,
                      color: s.color,
                      border: `1px solid ${s.border}`,
                      fontWeight: 500,
                    }}>
                      {s.label}
                    </span>
                  </div>

                  <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3, letterSpacing: "-.2px" }}>
                    {app.company}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, fontWeight: 300 }}>
                    {app.role}
                  </div>

                  {/* Meta */}
                  {(app.location || app.salary) && (
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)", marginBottom: 14, flexWrap: "wrap" }}>
                      {app.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} strokeWidth={1.75} />
                          {app.location}
                        </span>
                      )}
                      {app.salary && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <DollarSign size={11} strokeWidth={1.75} />
                          {app.salary.replace(/^\$/, "")}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      {formatDate(app.date)}
                    </span>
                    <div
                      style={{ display: "flex", gap: 2, alignItems: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="icon-btn"
                        onClick={() => toggleStar(app.id)}
                        title={app.starred ? "Unstar" : "Star"}
                        style={{ color: app.starred ? "#f59e0b" : undefined }}
                      >
                        <Star
                          size={13}
                          strokeWidth={1.75}
                          fill={app.starred ? "#f59e0b" : "none"}
                          color={app.starred ? "#f59e0b" : "currentColor"}
                        />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => navigate(`/applications/${app.id}/edit`)}
                        title="Edit"
                      >
                        <Edit size={13} strokeWidth={1.75} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => setDeleteId(app.id)}
                        title="Delete"
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
