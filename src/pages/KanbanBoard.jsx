import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Users, CheckCircle, XCircle, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useApplications, STATUS_CONFIG, formatDate } from "../hooks/useApplications";

const COLS = ["applied", "interview", "offer", "rejected"];

const COL_ICONS = {
  applied:   Send,
  interview: Users,
  offer:     CheckCircle,
  rejected:  XCircle,
};

export default function KanbanBoard() {
  const navigate = useNavigate();
  const { applications, updateStatus, stats } = useApplications();
  const [dragging, setDragging] = useState(null);
  const [overCol,  setOverCol]  = useState(null);
  // Prevents the card's onClick from firing right after a drag ends
  const didDrag = useRef(false);

  const byStatus = (s) => applications.filter((a) => a.status === s);

  const onDragStart = (e, app) => {
    didDrag.current = true;
    setDragging(app);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, col) => {
    e.preventDefault();
    setOverCol(col);
  };
  const onDrop = (e, col) => {
    e.preventDefault();
    if (dragging && dragging.status !== col) updateStatus(dragging.id, col);
    setDragging(null);
    setOverCol(null);
  };
  const onDragEnd = () => {
    setDragging(null);
    setOverCol(null);
    // Small delay because the browser fires click right after dragend
    setTimeout(() => { didDrag.current = false; }, 80);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-title">Board</div>
            <div className="page-subtitle">
              Drag cards between columns to update status · {applications.length} total
            </div>
          </div>
          <button className="btn-primary" onClick={() => navigate("/applications/add")}>
            <Plus size={14} strokeWidth={2} style={{ marginRight: 4 }} />
            New Application
          </button>
        </div>

        {/* Board */}
        <div className="kanban-outer">
        <div className="kanban-grid">
          {COLS.map((col) => {
            const cfg    = STATUS_CONFIG[col];
            const cards  = byStatus(col);
            const isOver = overCol === col;
            const Icon   = COL_ICONS[col];

            return (
              <div
                key={col}
                onDragOver={(e) => onDragOver(e, col)}
                onDrop={(e) => onDrop(e, col)}
                style={{
                  background: isOver ? `${cfg.color}06` : "var(--surface)",
                  border: `1px solid ${isOver ? cfg.border : "var(--border)"}`,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color .15s, background .15s",
                  minHeight: 300,
                }}
              >
                {/* Column header */}
                <div style={{ padding: "13px 14px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon size={14} color={cfg.color} strokeWidth={1.75} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      padding: "1px 7px",
                      fontSize: 11,
                      color: "var(--text-muted)",
                    }}>
                      {cards.length}
                    </span>
                    {stats.total > 0 && (
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                        {Math.round((cards.length / stats.total) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div style={{ padding: 10, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {cards.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, app)}
                      onDragEnd={onDragEnd}
                      onClick={() => { if (!didDrag.current) navigate(`/applications/${app.id}`); }}
                      className="kb-app-card"
                      style={{
                        opacity: dragging?.id === app.id ? 0.3 : 1,
                        "--col-border": cfg.border,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          background: `${cfg.color}18`,
                          border: `1px solid ${cfg.color}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: cfg.color,
                          flexShrink: 0,
                        }}>
                          {app.company[0]}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {app.company}
                        </div>
                      </div>

                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 300, marginBottom: 10, lineHeight: 1.4 }}>
                        {app.role}
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {formatDate(app.date)}
                        </span>
                      </div>

                      {app.salary && (
                        <div style={{
                          marginTop: 8,
                          fontSize: 10.5,
                          color: cfg.color,
                          background: cfg.bg,
                          padding: "2px 7px",
                          borderRadius: 4,
                          display: "inline-block",
                          fontWeight: 500,
                        }}>
                          {app.salary}
                        </div>
                      )}

                      {app.notes && (
                        <div style={{
                          marginTop: 8,
                          fontSize: 11,
                          color: "var(--text-muted)",
                          background: "var(--surface2)",
                          padding: "5px 9px",
                          borderRadius: 5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}>
                          {app.notes.replace(/\[.*?\]\n/g, "").slice(0, 80)}
                        </div>
                      )}
                    </div>
                  ))}

                  {cards.length === 0 && (
                    <div style={{
                      flex: 1,
                      border: `1px dashed ${isOver ? cfg.color + "55" : "rgba(255,255,255,.06)"}`,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 72,
                      fontSize: 12,
                      color: isOver ? cfg.color : "var(--text-muted)",
                      transition: "all .15s",
                    }}>
                      {isOver ? "Drop here" : "No applications"}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/applications/add?status=${col}`)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: 7,
                      background: "transparent",
                      border: "1px dashed rgba(255,255,255,.07)",
                      color: "var(--text-muted)",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "Geist, sans-serif",
                      transition: "border-color .15s, color .15s",
                      marginTop: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cfg.color + "55";
                      e.currentTarget.style.color = cfg.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    + Add card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}