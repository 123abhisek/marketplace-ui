// src/layouts/SellerGate.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppState } from "../hooks/useAppState";

export default function SellerGate() {
  const { hydrated, isLoggedIn } = useAppState();
  const location = useLocation();

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
        <CircularProgress sx={{ color: "#0f766e" }} />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}