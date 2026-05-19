import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  Activity,
  FileText,
  Pencil,
  Filter,
  Briefcase,
} from "lucide-react";
import { getCurrentUser } from "../auth";

const features = [
  {
    Icon: LayoutGrid,
    title: "Kanban Board",
    desc: "Drag and drop applications between stages. See your full pipeline in one view.",
  },
  {
    Icon: Calendar,
    title: "Application Timeline",
    desc: "Browse your applications on a monthly calendar, organized by the date you applied.",
  },
  {
    Icon: Activity,
    title: "Dashboard Overview",
    desc: "See how many applications are in each stage with a clear visual breakdown.",
  },
  {
    Icon: FileText,
    title: "Application Manager",
    desc: "Add, edit, and remove applications in seconds. Your data is saved automatically to your browser.",
  },
  {
    Icon: Pencil,
    title: "Notes & Log",
    desc: "Add timestamped notes to any application to track conversations and next steps.",
  },
  {
    Icon: Filter,
    title: "Search & Filter",
    desc: "Search by company, role, or location. Filter by status to focus on what matters.",
  },
];

const kanban = [
  {
    id: "applied",
    label: "Applied",
    color: "#3b82f6",
    bg: "rgba(59,130,246,.08)",
    tc: "#60a5fa",
    cards: [
      { c: "Stripe", r: "Software Engineer" },
      { c: "Vercel", r: "Frontend Developer" },
    ],
  },
  {
    id: "interview",
    label: "Interview",
    color: "#a78bfa",
    bg: "rgba(167,139,250,.08)",
    tc: "#a78bfa",
    cards: [{ c: "Linear", r: "Product Engineer" }],
  },
  {
    id: "offer",
    label: "Offer",
    color: "#34d399",
    bg: "rgba(52,211,153,.08)",
    tc: "#34d399",
    cards: [{ c: "Figma", r: "Product Designer" }],
  },
  {
    id: "rejected",
    label: "Rejected",
    color: "#f87171",
    bg: "rgba(248,113,113,.07)",
    tc: "#f87171",
    cards: [{ c: "Notion", r: "Full Stack Engineer" }],
  },
];

export default function LandingPage() {
  const navigate     = useNavigate();
  const authed       = !!getCurrentUser();
  const appDest      = authed ? "/dashboard" : "/login";
  const cursorRef    = useRef(null);
  const ringRef      = useRef(null);
  const spotlightRef = useRef(null);
  const featuresRef  = useRef(null);
  const posRef       = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const p = posRef.current;
    let running = true;
    // Custom cursor only applies to this page — remove it on cleanup
    document.body.classList.add("landing-cursor");

    const onMove = (e) => {
      p.mx = e.clientX;
      p.my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = p.mx + "px";
        cursorRef.current.style.top  = p.my + "px";
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--mx", p.mx + "px");
        spotlightRef.current.style.setProperty("--my", p.my + "px");
      }
    };

    const tick = () => {
      if (!running) return;
      // Lerp so the ring trails the cursor smoothly instead of snapping to it
      p.rx += (p.mx - p.rx) * 0.1;
      p.ry += (p.my - p.ry) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = p.rx + "px";
        ringRef.current.style.top  = p.ry + "px";
      }
      requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    tick();
    return () => {
      running = false;
      document.removeEventListener("mousemove", onMove);
      document.body.classList.remove("landing-cursor");
    };
  }, []);

  const scrollToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div id="cursor"    ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
      <div id="spotlight" ref={spotlightRef} />
      <div id="grid" />

      {/* NAV */}
      <nav className="nav">
        <a className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="nav-logo-mark">
            <Briefcase size={13} color="#fff" strokeWidth={2} />
          </div>
          JobTrackr
        </a>
        <div className="nav-center">
          <a className="nav-link" onClick={scrollToFeatures} style={{ cursor: "pointer" }}>
            Features
          </a>
          <a className="nav-link" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            Dashboard
          </a>
          <a className="nav-link" onClick={() => navigate("/board")} style={{ cursor: "pointer" }}>
            Board
          </a>
        </div>
        <div className="nav-right">
          <button className="nav-sign" onClick={() => navigate(appDest)}>
            {authed ? "Dashboard" : "Login"}
          </button>
          <button className="nav-cta" onClick={() => navigate(authed ? "/dashboard" : "/register")}>
            {authed ? "Go to app →" : "Sign up →"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow anim-0">
          <span className="hero-eyebrow-dot" />
          Free · No sign-up required
        </div>

        <h1 className="hero-h1 anim-1">
          Your job search,
          <br />
          <em>finally organized.</em>
        </h1>

        <p className="hero-p anim-2">
          Track every application, update statuses, and know exactly where
          each opportunity stands — all in your browser, no account needed.
        </p>

        <div className="hero-actions anim-3">
          <button className="btn-cta" onClick={() => navigate(appDest)}>
            {authed ? "Go to dashboard →" : "Get started →"}
          </button>
          <button className="btn-outline" onClick={scrollToFeatures}>
            See how it works
          </button>
        </div>

        <div className="hero-logos anim-4">
          {[
            "Kanban board",
            "Calendar view",
            "Search & filter",
            "Auto-save",
            "No sign-up",
          ].map((t) => (
            <span key={t} className="hero-logo-tag">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hiw-section">
        <div className="label-pill">How it works</div>
        <h2 className="section-h2">Simple by design.</h2>
        <p className="section-sub">Three steps to a more organized job search.</p>
        <div className="hiw-grid">
          {[
            {
              num: "01",
              title: "Add your applications",
              desc: "Log any job you apply to — company, role, status, location, and notes. Done in a few seconds.",
            },
            {
              num: "02",
              title: "Track your pipeline",
              desc: "View applications as a list, a kanban board, or a monthly timeline. Stay on top of every opportunity.",
            },
            {
              num: "03",
              title: "Stay on top of it all",
              desc: "Update statuses, log interview notes, and know exactly where each application stands at a glance.",
            },
          ].map((s) => (
            <div key={s.num} className="hiw-step">
              <div className="hiw-num">{s.num}</div>
              <div className="hiw-title">{s.title}</div>
              <div className="hiw-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" ref={featuresRef}>
        <div className="label-pill">Features</div>
        <h2 className="section-h2">Built to keep you focused.</h2>
        <p className="section-sub">
          Track every application from first click to final decision.
        </p>
        <div className="feat-grid">
          {features.map((f, i) => (
            <div key={i} className="feat-cell">
              <div className="feat-cell-icon">
                <f.Icon size={17} color="var(--blue)" strokeWidth={1.75} />
              </div>
              <div className="feat-cell-title">{f.title}</div>
              <div className="feat-cell-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* KANBAN PREVIEW */}
      <section className="preview-section">
        <div className="label-pill" style={{ marginBottom: 14 }}>
          Live preview
        </div>
        <h2 className="section-h2" style={{ marginBottom: 8 }}>
          Your pipeline, visualized.
        </h2>
        <p className="section-sub">
          Drag applications between stages as you progress.
        </p>
        <div className="window-frame">
          <div className="window-chrome">
            <div className="wc-dot" style={{ background: "#ff5f57" }} />
            <div className="wc-dot" style={{ background: "#febc2e" }} />
            <div className="wc-dot" style={{ background: "#28c840" }} />
            <div className="wc-url">jobtrackr.app/board</div>
          </div>
          <div className="window-body">
            {kanban.map((col) => (
              <div key={col.id} className="kb-col">
                <div className="kb-col-head">
                  <span style={{ color: col.color }}>{col.label}</span>
                  <span className="kb-count">{col.cards.length}</span>
                </div>
                {col.cards.map((card, ki) => (
                  <div key={ki} className="kb-card">
                    <div className="kb-company">{card.c}</div>
                    <div className="kb-role">{card.r}</div>
                    <div className="kb-tag" style={{ background: col.bg, color: col.tc }}>
                      {col.label}
                    </div>
                  </div>
                ))}
                <div className="kb-add">+ Add card</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-h2">Start tracking today.</h2>
          <p className="cta-p">
            Add your first application. No account, no subscription — your data
            stays in your browser.
          </p>
          <button className="btn-cta" onClick={() => navigate(appDest)}>
            {authed ? "Go to dashboard →" : "Get started →"}
          </button>
        </div>
      </section>

      <footer className="footer">
        <span>© 2025 JobTrackr</span>
        <span>Your data stays in your browser · No account required</span>
      </footer>
    </div>
  );
}
