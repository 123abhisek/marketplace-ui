
// src/layouts/SellerGate.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppState } from "../hooks/useAppState";

export default function SellerGate() {
  const {
    hydrated,
    isLoggedIn,
    user,
  } = useAppState();

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
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const userRole = String(user?.role ?? "")
    .trim()
    .toLowerCase();

  const isSeller =
    userRole === "seller" ||
    user?.is_seller === true ||
    user?.isSeller === true;

  if (!isSeller) {
    return (
      <Navigate
        to={user?.isPremium ? "/dashboard" : "/"}
        replace
      />
    );
  }

  return <Outlet />;
}