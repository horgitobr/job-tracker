import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../auth";

// Redirect guests away from private pages
export function ProtectedRoute({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
}

// Send logged-in users back to dashboard if they land on login or register
export function PublicRoute({ children }) {
  return getCurrentUser() ? <Navigate to="/dashboard" replace /> : children;
}
