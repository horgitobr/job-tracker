import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ApplicationList from "./pages/ApplicationList";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationDetail from "./pages/ApplicationDetail";
import KanbanBoard from "./pages/KanbanBoard";
import CalendarView from "./pages/CalendarView";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard"               element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/applications"            element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
        <Route path="/applications/add"        element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
        <Route path="/applications/:id"        element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
        {/* ApplicationForm handles both add and edit — detects mode via :id */}
        <Route path="/applications/:id/edit"   element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
        <Route path="/board"                   element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
        <Route path="/calendar"                element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
