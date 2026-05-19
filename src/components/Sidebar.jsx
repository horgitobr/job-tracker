import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  LayoutGrid,
  Calendar,
  Plus,
  Briefcase,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { getCurrentUser, logout } from "../auth";

const NAV_ITEMS = [
  { path: "/dashboard",    Icon: LayoutDashboard, label: "Dashboard",    end: true },
  { path: "/applications", Icon: FileText,        label: "Applications"           },
  { path: "/board",        Icon: LayoutGrid,      label: "Board",        end: true },
  { path: "/calendar",     Icon: Calendar,        label: "Timeline",     end: true },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Re-read on each render so the name updates immediately after login/logout
  const user = getCurrentUser();

  const close = () => setOpen(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* Mobile hamburger — only visible on small screens via CSS */}
      <button
        className="sb-hamburger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open navigation"
      >
        <Menu size={16} strokeWidth={1.75} />
      </button>

      {/* Backdrop */}
      <div
        className={`sb-overlay${open ? " active" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <aside className={`sidebar${open ? " mobile-open" : ""}`}>
        {/* Logo row */}
        <div
          className="sb-logo"
          onClick={() => { navigate("/"); close(); }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Briefcase size={13} color="#fff" strokeWidth={2} />
            </div>
            JobTrackr
          </div>
          <button
            className="sb-close-btn"
            // Stop the logo row's onClick from also firing when this button is clicked
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close navigation"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map(({ path, Icon, label, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}
            onClick={close}
          >
            <Icon size={15} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}

        <div className="sb-section" style={{ marginTop: 16 }}>Actions</div>

        <button
          className="sb-item"
          onClick={() => { navigate("/applications/add"); close(); }}
        >
          <Plus size={15} strokeWidth={1.75} />
          New Application
        </button>

        {user && (
          <div className="sb-footer">
            <div className="sb-user-greeting">Hi, {user.name.split(" ")[0]}</div>
            <div className="sb-user-email">{user.email}</div>
            <button className="sb-logout" onClick={handleLogout}>
              <LogOut size={13} strokeWidth={1.75} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
