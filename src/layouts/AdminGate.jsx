import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

export default function AdminGate() {
  const { isLoggedIn, user } = useAppState();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/free-dashboard" replace />;
  }

  return <Outlet />;
}