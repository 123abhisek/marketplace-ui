
// src/layouts/PremiumGate.jsx

import { Navigate } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

export default function PremiumGate({ children }) {
  const { user, isPremium } = useAppState();

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!isPremium) {
    return <Navigate to="/" replace />;
  }

  return children;
}