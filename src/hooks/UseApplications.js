import { useState, useEffect } from "react";

const STORAGE_KEY = "jobtrackr_applications";

const SAMPLE_DATA = [
  {
    id: "1",
    company: "Stripe",
    role: "Software Engineer",
    location: "Remote",
    status: "interview",
    date: "2026-05-01",
    salary: "$120,000",
    url: "https://stripe.com",
    contact: "hiring@stripe.com",
    notes: "Had a great first call. Technical round next week.",
    starred: true,
  },
  {
    id: "2",
    company: "Vercel",
    role: "Frontend Developer",
    location: "San Francisco, CA",
    status: "applied",
    date: "2026-05-05",
    salary: "$110,000",
    url: "https://vercel.com",
    contact: "",
    notes: "Applied via LinkedIn.",
    starred: false,
  },
  {
    id: "3",
    company: "Linear",
    role: "Product Engineer",
    location: "Remote",
    status: "applied",
    date: "2026-05-08",
    salary: "$130,000",
    url: "https://linear.app",
    contact: "",
    notes: "",
    starred: false,
  },
  {
    id: "4",
    company: "Figma",
    role: "React Developer",
    location: "New York, NY",
    status: "offer",
    date: "2026-04-20",
    salary: "$140,000",
    url: "https://figma.com",
    contact: "recruiter@figma.com",
    notes: "Offer received! Deadline to respond: May 20.",
    starred: true,
  },
  {
    id: "5",
    company: "Notion",
    role: "Full Stack Engineer",
    location: "Remote",
    status: "rejected",
    date: "2026-04-15",
    salary: "$115,000",
    url: "https://notion.so",
    contact: "",
    notes: "Rejected after final round. Good experience overall.",
    starred: false,
  },
  {
    id: "6",
    company: "Loom",
    role: "Junior Developer",
    location: "Remote",
    status: "applied",
    date: "2026-05-10",
    salary: "$90,000",
    url: "https://loom.com",
    contact: "",
    notes: "",
    starred: false,
  },
];

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function useApplications() {
  const [applications, setApplications] = useState([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApplications(JSON.parse(stored));
      } else {
        // First time: load sample data
        setApplications(SAMPLE_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      }
    } catch {
      setApplications(SAMPLE_DATA);
    }
  }, []);

  // Save to LocalStorage whenever data changes
  const save = (data) => {
    setApplications(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // CREATE
  const addApplication = (app) => {
    const newApp = {
      ...app,
      id: Date.now().toString(),
      date: app.date || new Date().toISOString().split("T")[0],
      starred: false,
    };
    // Newest entry at the front so recent activity shows first
    save([newApp, ...applications]);
    return newApp;
  };

  // UPDATE
  const updateApplication = (id, updates) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, ...updates } : a,
    );
    save(updated);
  };

  // DELETE
  const deleteApplication = (id) => {
    save(applications.filter((a) => a.id !== id));
  };

  // TOGGLE STAR
  const toggleStar = (id) => {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, starred: !a.starred } : a,
    );
    save(updated);
  };

  // UPDATE STATUS (for kanban drag)
  const updateStatus = (id, status) => {
    updateApplication(id, { status });
  };

  // GET BY ID
  const getById = (id) => applications.find((a) => a.id === id);

  // STATS
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    starred: applications.filter((a) => a.starred).length,
    // Anything past "applied" counts as a response from the company
    responseRate: applications.length
      ? Math.round(
          (applications.filter((a) => a.status !== "applied").length /
            applications.length) *
            100,
        )
      : 0,
  };

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    toggleStar,
    updateStatus,
    getById,
    stats,
  };
}

export const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    color: "#3b82f6",
    bg: "rgba(59,130,246,.1)",
    border: "rgba(59,130,246,.2)",
  },
  interview: {
    label: "Interview",
    color: "#a78bfa",
    bg: "rgba(167,139,250,.1)",
    border: "rgba(167,139,250,.2)",
  },
  offer: {
    label: "Offer",
    color: "#34d399",
    bg: "rgba(52,211,153,.1)",
    border: "rgba(52,211,153,.2)",
  },
  rejected: {
    label: "Rejected",
    color: "#f87171",
    bg: "rgba(248,113,113,.1)",
    border: "rgba(248,113,113,.2)",
  },
};
