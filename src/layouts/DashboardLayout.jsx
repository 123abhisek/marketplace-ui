// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Sidebar from "../components/Sidebar";
import { useAppState } from "../hooks/useAppState";

const PAGE_TITLES = {
  "/dashboard": {
    title: "Dashboard",
    sub: "Welcome back to your Easydeal Hub",
  },
  "/dashboard/properties": {
    title: "Properties",
    sub: "Browse all property listings",
  },
  "/dashboard/vehicles": {
    title: "Vehicles",
    sub: "Browse all vehicle listings",
  },
  "/dashboard/add-property": {
    title: "Add Property",
    sub: "Create a new property listing",
  },
  "/dashboard/add-vehicle": {
    title: "Add Vehicle",
    sub: "Create a new vehicle listing",
  },
  "/dashboard/my-listings": {
    title: "My Listings",
    sub: "Manage your posted listings",
  },
  "/dashboard/profile": {
    title: "Profile",
    sub: "Manage your account details",
  },
  "/dashboard/subscription": {
    title: "Subscription",
    sub: "Manage your plan & billing",
  },
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  const { title, sub } =
    PAGE_TITLES[location.pathname] || PAGE_TITLES["/dashboard"];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#F0F4F8",
      }}
    >
      {/* ── Desktop Sticky Sidebar ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: 256,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          p: 2,
          flexDirection: "column",
        }}
      >
        <Sidebar />
      </Box>

      {/* ── Main Content Area ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          maxWidth: "100%",
        }}
      >
        {/* ── Top Bar (Ref 1 — smmplanner header) ── */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(240, 244, 248, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            px: { xs: 2, md: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid rgba(226,232,240,0.6)",
          }}
        >
          {/* Mobile menu trigger */}
          <IconButton
            size="small"
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { md: "none" },
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              "&:hover": { background: "#F8FAFC" },
            }}
          >
            <MenuRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Page title (hidden on mobile, shown on md+) */}
          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: "#1E293B",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}
            >
              {sub}
            </Typography>
          </Box>

          {/* Mobile: just show title */}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              display: { xs: "block", md: "none" },
              flex: 1,
              color: "#1E293B",
            }}
          >
            {title}
          </Typography>

          {/* ── Search Bar (Ref 1 inspiration) ── */}
          <TextField
            placeholder="Search listings..."
            size="small"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{
              display: { xs: "none", lg: "flex" },
              width: searchFocused ? 280 : 220,
              transition: "width 0.3s ease",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                background: "#fff",
                fontSize: "0.875rem",
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(67,97,238,0.12)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
                "& fieldset": {
                  borderColor: searchFocused
                    ? "#4361EE"
                    : "rgba(226,232,240,0.6)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Right icons */}

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Live Button */}
            <Button
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "6px 14px",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(34,197,94,0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                },
              }}
            >
              Live
            </Button>
            <IconButton
              sx={{
                background: "#fff",
                borderRadius: "12px",
                width: 40,
                height: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                "&:hover": {
                  background: "#F8FAFC",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Badge
                badgeContent={2}
                sx={{
                  "& .MuiBadge-badge": {
                    background: "#EF4444",
                    color: "#fff",
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <NotificationsNoneRoundedIcon
                  sx={{ fontSize: 20, color: "#64748B" }}
                />
              </Badge>
            </IconButton>

            {/* User Avatar */}
            <Avatar
              src={user.photo || user.avatar_url}
              sx={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                fontSize: "0.9rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(67,97,238,0.3)",
                border: "2px solid rgba(255,255,255,0.9)",
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
          </Stack>
        </Box>

        {/* ── Page Content ── */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 3 },
            pt: 3,
            pb: 5,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: "none",
            p: 2,
            width: 280,
          },
        }}
      >
        <Sidebar />
      </Drawer>
    </Box>
  );
}
