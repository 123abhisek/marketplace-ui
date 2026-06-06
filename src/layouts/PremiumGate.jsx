
// // src/layouts/PremiumGate.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAppState } from "../hooks/useAppState";

// export default function PremiumGate() {
//   const { user, isPremium } = useAppState();

//   if (user?.role === "admin") {
//     return <Navigate to="/admin" replace />;
//   }

//   if (!isPremium) {
//     return <Navigate to="/free-dashboard" replace />;
//   }else {
//     return <Navigate to="/premium-dashboard" replace />;
//   }

//   return children || <Outlet />;
// }










import { Navigate } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

export default function PremiumGate({ children }) {
  const { user, isPremium } = useAppState();

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!isPremium) {
    return <Navigate to="/free-dashboard" replace />;
  }

  return children;
}