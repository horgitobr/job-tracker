# JobTrackr — Internship & Job Application Tracker

A full-stack React application for tracking job and internship applications throughout the hiring process. Built as a final university project for the Web Programming course at Polis University.

All data is stored in the browser using LocalStorage — no account or backend required.

---

## About the Project

Job searching as a student is disorganized by default — applications scattered across browser tabs, emails, and notes. JobTrackr solves this by giving you one place to log every application, track its status, and understand what is and is not working.

The project was chosen to demonstrate real-world React skills on a problem that is directly relevant to students entering the job market.

---

## Course Requirements Coverage

This project was built to satisfy the final project requirements for the Web Programming course.

### React concepts demonstrated

| Concept | Where it is used |
|---|---|
| Components | 9 page components + 2 shared components (Sidebar, ProtectedRoute) |
| State management | `useReducer`-style logic inside `useApplications` hook; local `useState` in forms and UI |
| Props | `useApplications` data and handlers passed as props to ApplicationCard, KanbanColumn, StatusBadge |
| Hooks | `useState`, `useEffect`, `useNavigate`, `useParams`, `useLocation`, custom `useApplications` |
| Routing | React Router v7 with 10 routes, protected route wrapper, and redirect logic |
| Forms | ApplicationForm with controlled inputs, validation, and edit/create modes |
| API integration | LocalStorage used as the persistence layer (no external API required per the spec) |
| Code organization | Feature-based folder structure: `pages/`, `components/`, `hooks/` |
| UI design | Custom CSS with variables for consistent theming across all views |

### Minimum requirements checklist

- [x] At least 5 React components — **9 pages + 2 shared components = 11 total**
- [x] `useState` — used in ApplicationForm, ApplicationList, KanbanBoard, CalendarView, and more
- [x] `useEffect` — used in `useApplications` to sync state to LocalStorage on every change, and in ApplicationForm to load existing data when editing
- [x] A form for data input — ApplicationForm at `/applications/add` and `/applications/:id/edit`
- [x] Data listing — ApplicationList with search, filter by status, and sort by date or company
- [x] CRUD — Create, Read, Update, Delete (see CRUD section below)
- [x] React Router navigation — 10 routes with protected route wrapper
- [x] Data persistence — LocalStorage via `useApplications` hook
- [x] Clean UI — custom CSS design with sidebar, kanban board, calendar, and stat cards
- [x] Clean project structure — `src/pages/`, `src/components/`, `src/hooks/`
- [x] README — this file

---

## Features

- **Dashboard** — pipeline overview with stat cards, a status breakdown bar chart, and a tip of the day
- **Application list** — searchable, filterable, sortable table of all applications with star support
- **Kanban board** — drag-and-drop cards across Applied, Interview, Offer, and Rejected columns
- **Calendar view** — applications plotted on a monthly calendar by submission date
- **Application form** — add and edit applications with fields for company, role, status, salary, location, contact, URL, and notes
- **Application detail** — full view of a single application with edit and delete actions
- **Starred applications** — mark important applications to highlight them in the list
- **Auth system** — register and log in with email and password; session persists across page refreshes
- **Protected routes** — unauthenticated users are redirected to login
- **Responsive sidebar** — collapses to a hamburger menu on smaller screens

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool | Vite |
| Routing | React Router v7 |
| Icons | Lucide React |
| Styling | CSS variables + custom CSS |
| Persistence | Browser LocalStorage |

No external UI library was used. All styles are written with CSS custom properties for consistent theming across the application.

---

## Project Structure

```
src/
├── auth.js                  # LocalStorage-based auth helpers (register, login, logout)
├── App.jsx                  # Route definitions and protected route wrapper
├── index.css                # Global styles and CSS variable definitions
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar with responsive collapse
│   └── ProtectedRoute.jsx   # Redirects unauthenticated users to /login
├── hooks/
│   └── useApplications.js   # Shared state, CRUD operations, and LocalStorage sync
└── pages/
    ├── LandingPage.jsx       # Public landing page
    ├── LoginPage.jsx         # Login form
    ├── RegisterPage.jsx      # Registration form
    ├── Dashboard.jsx         # Stats, chart, and recent applications
    ├── ApplicationList.jsx   # Full list with search, filter, and sort
    ├── ApplicationForm.jsx   # Add / edit form with validation
    ├── ApplicationDetail.jsx # Single application detail view
    ├── KanbanBoard.jsx       # Drag-and-drop status board
    └── CalendarView.jsx      # Monthly calendar with application markers
```

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public (guests only) | Log in to an existing account |
| `/register` | Public (guests only) | Create a new account |
| `/dashboard` | Protected | Overview and recent activity |
| `/applications` | Protected | Full application list |
| `/applications/add` | Protected | Add a new application |
| `/applications/:id` | Protected | Application detail view |
| `/applications/:id/edit` | Protected | Edit an existing application |
| `/board` | Protected | Kanban board |
| `/calendar` | Protected | Monthly calendar view |

---

## CRUD Functionality

All application data is managed through the `useApplications` custom hook, which keeps React state in sync with LocalStorage automatically via `useEffect` on every change.

| Operation | How it is implemented |
|---|---|
| **Create** | ApplicationForm at `/applications/add` calls `addApplication()` |
| **Read** | Dashboard, ApplicationList, KanbanBoard, CalendarView, and ApplicationDetail all read from the shared hook |
| **Update** | ApplicationForm at `/applications/:id/edit` calls `updateApplication()`; dragging a card on the Kanban board calls `updateStatus()` |
| **Delete** | ApplicationDetail calls `deleteApplication()` with a confirmation step |

---

## Authentication

User accounts are stored in LocalStorage as a JSON array. On login, a session object (id, name, email — no password) is written to a separate LocalStorage key. That session is read on every protected route by `ProtectedRoute.jsx`. Logging out removes the session key.

> **Note:** Passwords are stored as plain text. This is acceptable for a local, client-side university project but would not be appropriate for a production application.

---

## Installation

```bash
git clone https://github.com/horgitobr/job-tracker.git
cd job-tracker
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

```bash
npm run build   # production build → dist/
```

---

## Future Improvements

- Per-user data isolation (currently all users on the same device share the same application list)
- Cloud sync so data persists across devices
- Interview reminders and deadline notifications
- Export to CSV or PDF
- Real backend API with a database
- Password hashing on the client side at minimum