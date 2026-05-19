import { useState, useEffect } from "react";

const STORAGE_KEY = "jobtrackr_applications";

const SAMPLE_DATA = [
  {
    id: "1",
    company: "Credins Bank",
    role: "Junior Web Developer",
    location: "Tiranë, Shqipëri",
    status: "interview",
    date: "2026-05-01",
    salary: "80,000 ALL",
    url: "https://credinsbank.com",
    contact: "hr@credinsbank.com",
    notes: "Intervista e parë shkoi mirë. Presin përgjigje javën tjetër.",
    starred: true,
  },
  {
    id: "2",
    company: "Vodafone Albania",
    role: "Frontend Developer",
    location: "Tiranë, Shqipëri",
    status: "applied",
    date: "2026-05-05",
    salary: "90,000 ALL",
    url: "https://vodafone.al",
    contact: "",
    notes: "Aplikova përmes faqes zyrtare.",
    starred: false,
  },
  {
    id: "3",
    company: "Intech",
    role: "React Developer Intern",
    location: "Tiranë, Shqipëri",
    status: "applied",
    date: "2026-05-08",
    salary: "50,000 ALL",
    url: "https://intech.al",
    contact: "",
    notes: "",
    starred: false,
  },
  {
    id: "4",
    company: "Balfin Group",
    role: "IT Intern",
    location: "Tiranë, Shqipëri",
    status: "offer",
    date: "2026-04-20",
    salary: "60,000 ALL",
    url: "https://balfin.al",
    contact: "careers@balfin.al",
    notes: "Ofertë pranuar. Filloj më 1 Qershor.",
    starred: true,
  },
  {
    id: "5",
    company: "ALBtelecom",
    role: "Full Stack Intern",
    location: "Tiranë, Shqipëri",
    status: "rejected",
    date: "2026-04-15",
    salary: "55,000 ALL",
    url: "https://albtelecom.al",
    contact: "",
    notes: "Refuzuan pas intervistës teknike.",
    starred: false,
  },
  {
    id: "6",
    company: "Telekom Albania",
    role: "Software Engineer",
    location: "Tiranë, Shqipëri",
    status: "applied",
    date: "2026-05-10",
    salary: "85,000 ALL",
    url: "https://telekom.al",
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
