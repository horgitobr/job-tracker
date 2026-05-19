import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useApplications, STATUS_CONFIG, formatDate } from "../hooks/useApplications";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarView() {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const { year, month } = current;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1},
    );
    // Clear the detail panel when switching months
    setSelectedDay(null);
  };
  const next = () => {
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1},
    );
    setSelectedDay(null);
  };

  // Map applications to their dates
  const byDate = {};
  applications.forEach((app) => {
    if (!app.date) return;
    const d = new Date(app.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!byDate[day]) byDate[day] = [];
      byDate[day].push(app);
    }
  });

  // Pad the start with nulls so day 1 lands on the correct weekday column
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <div className="page-header">
          <div>
            <div className="page-title">Application Timeline</div>
            <div className="page-subtitle">
              Applications plotted by submission date
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/applications/add")}
          >
            + Add Application
          </button>
        </div>

        <div style={{ padding: "20px 32px 40px" }}>
          {/* Month nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div
              style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.4px" }}
            >
              {MONTHS[month]}{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>
                {year}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn-sec"
                style={{ padding: "7px 10px", display: "flex", alignItems: "center" }}
                onClick={prev}
                aria-label="Previous month"
              >
                <ChevronLeft size={15} strokeWidth={1.75} />
              </button>
              <button
                className="btn-sec"
                style={{ padding: "7px 14px", fontSize: 13 }}
                onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
              >
                Today
              </button>
              <button
                className="btn-sec"
                style={{ padding: "7px 10px", display: "flex", alignItems: "center" }}
                onClick={next}
                aria-label="Next month"
              >
                <ChevronRight size={15} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {/* Day headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    padding: "10px 0",
                    textAlign: "center",
                    fontSize: 11.5,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
            >
              {cells.map((day, idx) => {
                const apps = day ? byDate[day] || [] : [];
                const todayCell = day && isToday(day);
                const isSelected = day && selectedDay === day;
                const hasApps = apps.length > 0;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (day && hasApps) setSelectedDay(isSelected ? null : day);
                    }}
                    style={{
                      minHeight: 90,
                      padding: "10px 10px 8px",
                      borderRight:
                        (idx + 1) % 7 !== 0
                          ? "1px solid var(--border)"
                          : "none",
                      borderBottom: "1px solid var(--border)",
                      background: isSelected
                        ? "rgba(59,130,246,.06)"
                        : todayCell
                        ? "rgba(59,130,246,.04)"
                        : "transparent",
                      transition: "background .15s",
                      cursor: day && hasApps ? "pointer" : "default",
                      outline: isSelected ? "inset 1px solid rgba(59,130,246,.2)" : "none",
                    }}
                  >
                    {day && (
                      <>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: todayCell ? 700 : 400,
                            color: todayCell
                              ? "var(--blue)"
                              : "var(--text-muted)",
                            marginBottom: 5,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: todayCell
                              ? "rgba(59,130,246,.15)"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {day}
                        </div>
                        {apps.slice(0, 2).map((app) => {
                          const s = STATUS_CONFIG[app.status];
                          return (
                            <div
                              key={app.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/applications/${app.id}`);
                              }}
                              style={{
                                background: s.bg,
                                borderLeft: `2px solid ${s.color}`,
                                borderRadius: 4,
                                padding: "3px 7px",
                                marginBottom: 3,
                                cursor: "pointer",
                                transition: "opacity .15s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = ".7")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "1")
                              }
                            >
                              <div
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 500,
                                  color: s.color,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {app.company}
                              </div>
                            </div>
                          );
                        })}
                        {apps.length > 2 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDay(day);
                            }}
                            style={{
                              fontSize: 10,
                              color: "var(--blue)",
                              paddingLeft: 4,
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            +{apps.length - 2} more
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: cfg.color,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {cfg.label}
                </span>
              </div>
            ))}
          </div>

          {/* Day detail panel */}
          {selectedDay && byDate[selectedDay] && (
            <div style={{
              marginTop: 16,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                  {MONTHS[month]} {selectedDay}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)", marginLeft: 8 }}>
                    {byDate[selectedDay].length} application{byDate[selectedDay].length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}
                >
                  <X size={14} strokeWidth={1.75} />
                </button>
              </div>
              <div style={{ padding: "6px 8px" }}>
                {byDate[selectedDay].map((app) => {
                  const s = STATUS_CONFIG[app.status];
                  return (
                    <div
                      key={app.id}
                      onClick={() => navigate(`/applications/${app.id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{app.company}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.role}</span>
                      </div>
                      <span style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                        fontWeight: 500,
                        flexShrink: 0,
                      }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {applications.length === 0 && (
            <div style={{
              marginTop: 24,
              padding: "32px 24px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              textAlign: "center",
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <CalendarDays size={18} color="var(--text-muted)" strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                No applications tracked yet
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18, maxWidth: 320, margin: "0 auto 18px" }}>
                Add your first application to see it plotted on the timeline.
              </div>
              <button className="btn-primary" onClick={() => navigate("/applications/add")}>
                Add first application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
