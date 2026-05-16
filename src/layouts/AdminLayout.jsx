
// src/layouts/AdminLayout.jsx
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Navbar from "../components/Navbar";

const navItems = [
  { label: "Overview", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Listings", path: "/admin/listings" },
  { label: "Reports", path: "/admin/reports" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    
    <Box sx={{ minHeight: "100vh", display: "flex", background: "#f8fafc" }}>
   
      <Box
        sx={{
          width: 260,
          borderRight: "1px solid rgba(15,23,42,0.08)",
          background: "#fff",
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.2rem",
            color: "#0f172a",
            mb: 2,
          }}
        >
          Admin Panel
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 1.5,
                  py: 1.1,
                  fontWeight: active ? 800 : 700,
                  color: active ? "#0f172a" : "#64748b",
                  background: active ? "rgba(15,118,110,0.08)" : "transparent",
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}