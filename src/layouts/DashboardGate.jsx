
// src/layouts/DashboardGate.jsx
// Protects all /dashboard routes — redirects unauthenticated users to /login.
// Admin users are redirected to /admin.
// ALL other authenticated users (free, premium, seller) access /dashboard.

import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppState } from "../hooks/useAppState";

export default function DashboardGate({ children }) {
  const { hydrated, isLoggedIn, user } = useAppState();
  const location = useLocation();

  // Wait until app state is hydrated from localStorage
  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not logged in → redirect to login, preserve intended destination
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Admin → redirect to admin panel
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // All other roles (free, premium, seller) → allow through
  return children;
}