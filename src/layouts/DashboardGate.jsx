
// // src/layouts/DashboardGate.jsx
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { Box, CircularProgress } from "@mui/material";
// import { useAppState } from "../hooks/useAppState";

// export default function DashboardGate() {
//   const { hydrated, isLoggedIn, user } = useAppState();
//   const location = useLocation();

//   if (!hydrated) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "grid",
//           placeItems: "center",
//           background: "#f8fafc",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
//     return <Navigate to="/admin" replace />;
//   }

//    return children || <Outlet />;
// }





import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppState } from "../hooks/useAppState";

export default function DashboardGate({ children }) {
  const { hydrated, isLoggedIn, user } = useAppState();
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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}