// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import { useAppState } from "../hooks/useAppState";

const MAIN_NAV = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} />,
    end: true,
  },
  {
    to: "/dashboard/properties",
    label: "Properties",
    icon: <ApartmentRoundedIcon sx={{ fontSize: 20 }} />,
  },
  {
    to: "/dashboard/vehicles",
    label: "Vehicles",
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />,
  },
  {
    to: "/dashboard/add-property",
    label: "Add Property",
    icon: <AddHomeRoundedIcon sx={{ fontSize: 20 }} />,
  },
  {
    to: "/dashboard/add-vehicle",
    label: "Add Vehicle",
    icon: <NoteAddRoundedIcon sx={{ fontSize: 20 }} />,
  },
  // {
  //   to: "/dashboard/my-listings",
  //   label: "My Listings",
  //   icon: <ListAltRoundedIcon sx={{ fontSize: 20 }} />,
  // },
];

const BOTTOM_NAV = [
  {
    to: "/dashboard/profile",
    label: "Profile",
    icon: <PersonRoundedIcon sx={{ fontSize: 20 }} />,
  },
  {
    to: "/dashboard/subscription",
    label: "Subscription",
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 20 }} />,
  },
  {
    to: "/dashboard/logout",
    label: "Logout",
    icon: <LogoutRoundedIcon sx={{ fontSize: 20 }} />,
  },
];

function NavItem({ to, label, icon, end = false }) {
  return (
    <NavLink to={to} end={end} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            background: isActive ? "#4361EE" : "transparent",
            color: isActive ? "#ffffff" : "#64748B",
            "&:hover": {
              background: isActive ? "#4361EE" : "#F1F5F9",
              color: isActive ? "#ffffff" : "#1E293B",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isActive ? 1 : 0.7,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAppState();

  return (
    <Box
      sx={{
        height: "100%",
        background: "#ffffff",
        borderRadius: "20px",
        p: 2,
        boxShadow: "0 2px 24px rgba(15, 23, 42, 0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        overflow: "hidden",
      }}
    >
      {/* ── Brand ── */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: 0.5, py: 1, mb: 0.5 }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Easydeal Logo"
          sx={{ height: 46, width: "auto", objectFit: "contain" }}
        />
      </Stack>

      <Divider />

      {/* ── Main Navigation ── */}
      <Stack spacing={0.5} sx={{ flex: 1, py: 1 }}>
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#CBD5E1",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            mb: 0.5,
          }}
        >
          Navigation
        </Typography>
        {MAIN_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </Stack>

      <Divider />

      {/* ── Settings / Bottom Navigation ── */}
      <Stack spacing={0.5} sx={{ py: 1 }}>
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#CBD5E1",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            mb: 0.5,
          }}
        >
          Account
        </Typography>
        {BOTTOM_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </Stack>

      <Divider />

      {/* ── User Profile Card (Ref 1 — smmplanner bottom profile) ── */}
      <Box
        sx={{
          mt: 0.5,
          p: 1.5,
          borderRadius: "14px",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          border: "1px solid rgba(226,232,240,0.8)",
        }}
      >
        <Avatar
          src={user.photo || user.avatar_url}
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
            fontSize: "0.85rem",
            fontWeight: 800,
            boxShadow: "0 2px 8px rgba(67,97,238,0.25)",
          }}
        >
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#1E293B",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
            }}
          >
            {user.name || "User"}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#94A3B8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.isPremium ? "Premium Member" : "Free Member"}
          </Typography>
        </Box>

        <Chip
          label={user.isPremium ? "PRO" : "FREE"}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
            flexShrink: 0,
            background: user.isPremium
              ? "linear-gradient(135deg, #10B981, #059669)"
              : "#E2E8F0",
            color: user.isPremium ? "#fff" : "#64748B",
            border: "none",
            boxShadow: user.isPremium
              ? "0 2px 8px rgba(16,185,129,0.3)"
              : "none",
          }}
        />
      </Box>
    </Box>
  );
}
