
// src/components/Navbar.jsx
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

import { useAppState } from "../hooks/useAppState";

const COLORS = {
  bg: "#f8fafc",
  surface: "rgba(255,255,255,0.9)",
  surfaceStrong: "rgba(255,255,255,0.98)",
  border: "rgba(148,163,184,0.22)",
  borderStrong: "rgba(148,163,184,0.32)",
  text: "#0f172a",
  muted: "#64748b",
  primary: "#0f766e",
  primaryHover: "#0d665d",
  primarySoft: "rgba(15,118,110,0.08)",
  premium: "#b45309",
  premiumSoft: "rgba(245,158,11,0.10)",
  admin: "#b91c1c",
  adminSoft: "rgba(239,68,68,0.10)",
  shadow: "0 18px 48px rgba(15,23,42,0.08)",
  shadowStrong: "0 24px 60px rgba(15,23,42,0.12)",
};

// ── Role resolver — covers all actual localStorage field combinations ────────
//
//  localStorage "userData" shape:
//    { loggedIn, role, isPremium, subscription, ... }
//
//  Priority:
//    1. Not logged in                    → "guest"
//    2. role === "admin"                 → "admin"
//    3. isPremium === true               → "premium"
//       OR role === "premium"            → "premium"
//       OR subscription === "active"     → "premium"
//    4. Everything else (free / inactive)→ "free"
//
function resolveRole(user) {
  if (!user?.loggedIn) return "guest";
  if (user?.role === "admin") return "admin";
  if (
    user?.isPremium === true ||
    user?.role === "premium" ||
    user?.subscription === "active"
  ) return "premium";
  return "free";
}

// ── Nav config — routes aligned with src/router/index.jsx ───────────────────
// Public:           /   /subscription   /login   /register
// Free gate:        /free-dashboard
// Any logged-in:    /dashboard/properties/:id   /dashboard/vehicles/:id
// Premium only:     /dashboard  /dashboard/properties  /dashboard/vehicles
//                   /dashboard/add-property  /dashboard/add-vehicle
//                   /dashboard/my-listings   /dashboard/profile
//                   /dashboard/subscription  /dashboard/logout
// Admin (future):   /admin  /admin/users  /admin/listings  /admin/reports  /admin/settings

function getNavConfig() {
  return {
    // ── Guest ────────────────────────────────────────────────────────────
    guest: {
      desktop: [
        { label: "Home",    to: "/" },
        { label: "Pricing", to: "/subscription" },
      ],
      mobile: [
        { label: "Home",         to: "/",             icon: <HomeWorkRoundedIcon fontSize="small" /> },
        { label: "Pricing",      to: "/subscription", icon: <CurrencyRupeeRoundedIcon fontSize="small" /> },
        { label: "Post Listing", to: "/register",     icon: <SellRoundedIcon fontSize="small" /> },
        { label: "Login",        to: "/login",        icon: <LoginRoundedIcon fontSize="small" /> },
        { label: "Register",     to: "/register",     icon: <PersonAddAlt1RoundedIcon fontSize="small" /> },
      ],
      dropdown: [],
    },

    // ── Free user — only /free-dashboard is accessible ───────────────────
    free: {
      desktop: [
        { label: "Home",         to: "/" },
        { label: "My Dashboard", to: "/free-dashboard" },
        { label: "Upgrade ₹299", to: "/subscription" },
      ],
      mobile: [
        { label: "Home",         to: "/",               icon: <ExploreRoundedIcon fontSize="small" /> },
        { label: "My Dashboard", to: "/free-dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Upgrade ₹299", to: "/subscription",   icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "My Dashboard",       to: "/free-dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Upgrade to Premium", to: "/subscription",   icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
      ],
    },

    // ── Premium user — full /dashboard/* access ──────────────────────────
    premium: {
      desktop: [
        { label: "Home",      to: "/" },
        { label: "Dashboard", to: "/dashboard" },
      ],
      mobile: [
        { label: "Home",         to: "/",                       icon: <ExploreRoundedIcon fontSize="small" /> },
        { label: "Post Listing", to: "/dashboard/add-property", icon: <SellRoundedIcon fontSize="small" /> },
        { label: "Dashboard",    to: "/dashboard",              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Properties",   to: "/dashboard/properties",   icon: <HomeWorkRoundedIcon fontSize="small" /> },
        { label: "My Listings",  to: "/dashboard/my-listings",  icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Profile",      to: "/dashboard/profile",      icon: <PersonRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "Dashboard",    to: "/dashboard",              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "My Listings",  to: "/dashboard/my-listings",  icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Subscription", to: "/dashboard/subscription", icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
        { label: "Profile",      to: "/dashboard/profile",      icon: <PersonRoundedIcon fontSize="small" /> },
      ],
    },

    // ── Admin ─────────────────────────────────────────────────────────────
    admin: {
      desktop: [
        { label: "Overview", to: "/admin" },
        { label: "Users",    to: "/admin/users" },
        { label: "Listings", to: "/admin/listings" },
        { label: "Reports",  to: "/admin/reports" },
      ],
      mobile: [
        { label: "Overview", to: "/admin",          icon: <SpaceDashboardRoundedIcon fontSize="small" /> },
        { label: "Users",    to: "/admin/users",    icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: "Listings", to: "/admin/listings", icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Reports",  to: "/admin/reports",  icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: "Settings", to: "/admin/settings", icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "Admin Panel",  to: "/admin",          icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
        { label: "Manage Users", to: "/admin/users",    icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: "Reports",      to: "/admin/reports",  icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: "Settings",     to: "/admin/settings", icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
    },
  };
}

const ROLE_BADGE = {
  guest: null,
  free: {
    label: "Free",
    color: "#5b4cf0",
    bg: "rgba(91,76,240,0.10)",
    border: "rgba(91,76,240,0.18)",
  },
  premium: {
    label: "Premium Active",
    color: COLORS.premium,
    bg: COLORS.premiumSoft,
    border: "rgba(180,83,9,0.18)",
  },
  admin: {
    label: "Admin",
    color: COLORS.admin,
    bg: COLORS.adminSoft,
    border: "rgba(185,28,28,0.18)",
  },
};

const AVATAR_STYLE = {
  guest:   { bg: "#94a3b8", color: "#ffffff" },
  free:    { bg: "#5b4cf0", color: "#ffffff" },
  premium: { bg: "#d97706", color: "#ffffff" },
  admin:   { bg: "#dc2626", color: "#ffffff" },
};

function RoleBadge({ roleKey }) {
  const cfg = ROLE_BADGE[roleKey];
  if (!cfg) return null;
  const icon =
    roleKey === "admin" ? (
      <VerifiedUserRoundedIcon sx={{ fontSize: 14 }} />
    ) : (
      <WorkspacePremiumRoundedIcon sx={{ fontSize: 14 }} />
    );
  return (
    <Chip
      size="small"
      icon={icon}
      label={cfg.label}
      sx={{
        height: 30,
        borderRadius: "999px",
        px: 0.5,
        fontWeight: 800,
        fontSize: "0.74rem",
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        "& .MuiChip-icon": { color: cfg.color },
      }}
    />
  );
}

function UserAvatar({ initials, photo, roleKey, size = 38 }) {
  const tone = AVATAR_STYLE[roleKey] || AVATAR_STYLE.free;
  return (
    <Avatar
      src={photo || undefined}
      sx={{
        width: size,
        height: size,
        bgcolor: tone.bg,
        color: tone.color,
        fontWeight: 900,
        fontSize: size * 0.34,
        boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
      }}
    >
      {initials}
    </Avatar>
  );
}

function Logo() {
  return (
    <Stack
      component={RouterLink}
      to="/"
      direction="row"
      alignItems="center"
      spacing={1.3}
      sx={{ textDecoration: "none", minWidth: 0, flexShrink: 0 }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="Easydeal Logo"
        sx={{ height: 46, width: "auto", objectFit: "contain" }}
      />
    </Stack>
  );
}

function DesktopNavLink({ to, label, active }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 1,
        minHeight: 42,
        borderRadius: "999px",
        textDecoration: "none",
        fontWeight: 800,
        fontSize: "0.9rem",
        color: active ? COLORS.primary : COLORS.muted,
        backgroundColor: active ? COLORS.primarySoft : "transparent",
        transition: "all .2s ease",
        "&:hover": { color: COLORS.text, backgroundColor: "rgba(15,23,42,0.05)" },
      }}
    >
      {label}
      {active && (
        <Box sx={{ position: "absolute", bottom: 6, width: 4, height: 4, borderRadius: "50%", bgcolor: COLORS.primary }} />
      )}
    </Box>
  );
}

function MobileNavLink({ item, active, onClick }) {
  return (
    <Box
      component={RouterLink}
      to={item.to}
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 1.6,
        py: 1.35,
        borderRadius: "18px",
        textDecoration: "none",
        fontWeight: 800,
        fontSize: "0.92rem",
        color: active ? COLORS.primary : "#334155",
        backgroundColor: active ? COLORS.primarySoft : "transparent",
        border: active ? "1px solid rgba(15,118,110,0.14)" : "1px solid transparent",
        transition: "all .2s ease",
        "&:hover": { backgroundColor: "rgba(15,118,110,0.06)", color: COLORS.primary },
      }}
    >
      <Box
        sx={{
          width: 36, height: 36, borderRadius: "12px",
          display: "grid", placeItems: "center", flexShrink: 0,
          bgcolor: active ? COLORS.primary : "#f1f5f9",
          color: active ? "#ffffff" : COLORS.muted,
          boxShadow: active ? "0 8px 18px rgba(15,118,110,0.18)" : "none",
        }}
      >
        {item.icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>{item.label}</Box>
      {active && (
        <ChevronRightRoundedIcon sx={{ ml: "auto", fontSize: 18, color: COLORS.primary }} />
      )}
    </Box>
  );
}

function AnnouncementBar({ onClose }) {
  return (
    <Box sx={{ backgroundColor: COLORS.primary, color: "#ffffff", px: { xs: 2, md: 3 }, py: 0.9 }}>
      <Container maxWidth="xl" disableGutters>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ position: "relative", minHeight: 28 }}
        >
          <LocalOfferRoundedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }} />
          <Typography sx={{ fontSize: { xs: "0.74rem", sm: "0.78rem" }, fontWeight: 800, textAlign: "center", pr: { xs: 4, sm: 0 } }}>
            Unlock full marketplace access for just ₹299 — one-time premium upgrade.
          </Typography>
          <Box
            component={RouterLink}
            to="/subscription"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center", gap: 0.2, ml: 1, px: 1.25, py: 0.45,
              borderRadius: "999px", textDecoration: "none",
              fontSize: "0.75rem", fontWeight: 900,
              color: COLORS.primary, bgcolor: "#ffffff",
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            Upgrade now <ChevronRightRoundedIcon sx={{ fontSize: 14 }} />
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              position: "absolute", right: 0,
              color: "rgba(255,255,255,0.82)",
              "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.10)" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [anchorEl, setAnchorEl]                 = useState(null);
  const [scrolled, setScrolled]                 = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAppState();

  // ── Derive role from actual localStorage userData fields ─────────────────
  // Handles: { role, isPremium, subscription, loggedIn }
  const roleKey       = resolveRole(user);
  const loggedIn      = roleKey !== "guest";
  const menuOpen      = Boolean(anchorEl);
  const navCfg        = useMemo(() => getNavConfig()[roleKey], [roleKey]);
  const dropdownItems = navCfg?.dropdown ?? [];

  const showBar = showAnnouncement && (roleKey === "guest" || roleKey === "free");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAnchorEl(null);
  }, [location.pathname]);

  const initials = useMemo(() => {
    const name  = user?.name?.trim() || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return `${parts[0][0] || "U"}`.toUpperCase();
  }, [user?.name]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (["/dashboard", "/admin", "/free-dashboard"].includes(path))
      return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeMenu   = () => setAnchorEl(null);
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    closeMenu();
    closeMobile();
    logout();
    navigate("/");
  };

  return (
    <>
      {showBar && <AnnouncementBar onClose={() => setShowAnnouncement(false)} />}

      <Box
        sx={{
          position: "sticky", top: 8, zIndex: 1200,
          px: { xs: 1.5, md: 2.5 }, pt: 1.2, pb: 0.5,
          pointerEvents: "none", backgroundColor: "transparent",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ pointerEvents: "auto" }}>
          <Box
            sx={{
              minHeight: { xs: 64, md: 72 },
              px: { xs: 1.6, sm: 2.2, md: 2.8 }, py: 1,
              display: "flex", alignItems: "center", gap: 1.5,
              borderRadius: "999px",
              backgroundColor: scrolled ? COLORS.surfaceStrong : COLORS.surface,
              backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              border: `1px solid ${scrolled ? COLORS.borderStrong : COLORS.border}`,
              boxShadow: scrolled ? COLORS.shadowStrong : COLORS.shadow,
              transition: "all .28s cubic-bezier(.16,1,.3,1)",
            }}
          >
            {/* Logo */}
            <Box sx={{ flex: "1 1 0", display: "flex", alignItems: "center", minWidth: 0 }}>
              <Logo />
            </Box>

            {/* Desktop nav pills */}
            <Stack
              direction="row" alignItems="center" spacing={0.4}
              sx={{
                display: { xs: "none", lg: "flex" },
                px: 0.6, py: 0.6, borderRadius: "999px",
                backgroundColor: "rgba(248,250,252,0.96)",
                border: `1px solid ${COLORS.border}`, flex: "0 0 auto",
              }}
            >
              {navCfg.desktop.map((item) => (
                <DesktopNavLink key={item.to} to={item.to} label={item.label} active={isActive(item.to)} />
              ))}
            </Stack>

            {/* Right CTAs */}
            <Stack
              direction="row" alignItems="center" justifyContent="flex-end" spacing={1}
              sx={{ flex: "1 1 0", display: { xs: "none", md: "flex" }, minWidth: 0 }}
            >

              {/* ── Guest ─────────────────────────────────────────────────── */}
              {roleKey === "guest" && (
                <>
                  <Button
                    component={RouterLink} to="/register" variant="text"
                    startIcon={<SellRoundedIcon />}
                    sx={{
                      minHeight: 44, px: 2, borderRadius: "999px",
                      textTransform: "none", fontWeight: 800, fontSize: "0.88rem",
                      color: COLORS.muted,
                      "&:hover": { backgroundColor: "rgba(15,23,42,0.05)", color: COLORS.text },
                    }}
                  >
                    Post Listing
                  </Button>
                  <Button
                    component={RouterLink} to="/login" variant="outlined"
                    sx={{
                      minHeight: 44, px: 2.2, borderRadius: "999px",
                      textTransform: "none", fontWeight: 800, fontSize: "0.88rem",
                      borderColor: COLORS.borderStrong, color: COLORS.muted,
                      "&:hover": { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft, color: COLORS.primary },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink} to="/register" variant="contained"
                    sx={{
                      minHeight: 44, px: 2.4, borderRadius: "999px",
                      textTransform: "none", fontWeight: 900, fontSize: "0.88rem",
                      backgroundColor: COLORS.text,
                      boxShadow: "0 12px 24px rgba(15,23,42,0.16)",
                      "&:hover": { backgroundColor: "#1e293b", boxShadow: "0 16px 28px rgba(15,23,42,0.22)" },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* ── Free user (isPremium:false, subscription:inactive) ─────── */}
              {roleKey === "free" && (
                <>
                  <RoleBadge roleKey="free" />
                  <Button
                    component={RouterLink} to="/subscription" variant="contained"
                    startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      minHeight: 44, px: 2.3, borderRadius: "999px",
                      textTransform: "none", fontWeight: 900, fontSize: "0.86rem",
                      backgroundColor: "#111827",
                      boxShadow: "0 12px 24px rgba(17,24,39,0.14)",
                      "&:hover": { backgroundColor: "#0f172a", boxShadow: "0 16px 28px rgba(17,24,39,0.20)" },
                    }}
                  >
                    Upgrade ₹299
                  </Button>
                  <Tooltip title="Account menu" arrow>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        p: 0.45, borderRadius: "999px",
                        border: `2px solid ${COLORS.border}`, backgroundColor: "#ffffff",
                        "&:hover": { borderColor: COLORS.primary, boxShadow: "0 0 0 4px rgba(15,118,110,0.10)" },
                      }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="free" size={36} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* ── Premium user (isPremium:true OR subscription:active) ─────── */}
              {roleKey === "premium" && (
                <>
                  <RoleBadge roleKey="premium" />
                  <Button
                    component={RouterLink} to="/dashboard/add-property" variant="outlined"
                    startIcon={<SellRoundedIcon />}
                    sx={{
                      minHeight: 44, px: 2, borderRadius: "999px",
                      textTransform: "none", fontWeight: 800, fontSize: "0.88rem",
                      borderColor: COLORS.borderStrong, color: COLORS.muted,
                      "&:hover": { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft, color: COLORS.primary },
                    }}
                  >
                    Post Listing
                  </Button>
                  <Tooltip title="Account menu" arrow>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        p: 0.45, borderRadius: "999px",
                        border: `2px solid ${COLORS.border}`, backgroundColor: "#ffffff",
                        "&:hover": { borderColor: COLORS.primary, boxShadow: "0 0 0 4px rgba(15,118,110,0.10)" },
                      }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="premium" size={36} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* ── Admin (role:"admin") ───────────────────────────────────── */}
              {roleKey === "admin" && (
                <>
                  <RoleBadge roleKey="admin" />
                  <Button
                    component={RouterLink} to="/admin" variant="outlined"
                    startIcon={<AdminPanelSettingsRoundedIcon />}
                    sx={{
                      minHeight: 44, px: 2, borderRadius: "999px",
                      textTransform: "none", fontWeight: 800, fontSize: "0.88rem",
                      borderColor: "rgba(185,28,28,0.28)", color: COLORS.admin,
                      "&:hover": { borderColor: COLORS.admin, backgroundColor: COLORS.adminSoft },
                    }}
                  >
                    Admin Panel
                  </Button>
                  <Tooltip title="Admin account" arrow>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        p: 0.45, borderRadius: "999px",
                        border: "2px solid rgba(185,28,28,0.16)", backgroundColor: "#ffffff",
                        "&:hover": { borderColor: COLORS.admin, boxShadow: "0 0 0 4px rgba(239,68,68,0.10)" },
                      }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="admin" size={36} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>

            {/* Hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 44, height: 44, borderRadius: "14px",
                border: `1px solid ${COLORS.borderStrong}`, backgroundColor: "#ffffff",
                color: COLORS.text,
                "&:hover": { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft, color: COLORS.primary },
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* ── Desktop dropdown Menu ────────────────────────────────────────────── */}
      {loggedIn && (
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.4, minWidth: 260, borderRadius: "22px", overflow: "visible",
              border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadowStrong,
              "&::before": {
                content: '""', position: "absolute", top: -7, right: 20,
                width: 14, height: 14, backgroundColor: "#ffffff",
                borderLeft: `1px solid ${COLORS.border}`, borderTop: `1px solid ${COLORS.border}`,
                transform: "rotate(45deg)",
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2.4, py: 2,
              backgroundColor: roleKey === "admin" ? "rgba(254,242,242,0.8)" : "rgba(248,250,252,0.95)",
              borderRadius: "22px 22px 0 0",
            }}
          >
            <Stack direction="row" spacing={1.4} alignItems="center">
              <UserAvatar initials={initials} photo={user?.photo} roleKey={roleKey} size={46} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, fontSize: "0.97rem", lineHeight: 1.2, color: COLORS.text }}>
                  {user?.name || "User"}
                </Typography>
                {!!user?.email && (
                  <Typography sx={{ fontSize: "0.74rem", color: COLORS.muted, fontWeight: 500, mb: 0.7 }}>
                    {user.email}
                  </Typography>
                )}
                <RoleBadge roleKey={roleKey} />
              </Box>
            </Stack>
          </Box>

          <Divider />

          {dropdownItems.map((item) => (
            <MenuItem
              key={item.label}
              component={RouterLink}
              to={item.to}
              onClick={closeMenu}
              sx={{
                py: 1.4, px: 2.2, gap: 0.5, fontWeight: 700, fontSize: "0.88rem", color: "#334155",
                "&:hover": { backgroundColor: COLORS.primarySoft, color: COLORS.primary },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: COLORS.muted, "& svg": { fontSize: 18 } }}>
                {item.icon}
              </ListItemIcon>
              {item.label}
              <ChevronRightRoundedIcon sx={{ ml: "auto", fontSize: 16, color: "#cbd5e1" }} />
            </MenuItem>
          ))}

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.4, px: 2.2, gap: 0.5, fontWeight: 800, fontSize: "0.88rem",
              color: "#ef4444", borderRadius: "0 0 22px 22px",
              "&:hover": { backgroundColor: "rgba(239,68,68,0.05)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#ef4444", "& svg": { fontSize: 18 } }}>
              <LogoutRoundedIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: 334, maxWidth: "100%", borderRadius: "28px 0 0 28px",
            backgroundColor: "#ffffff", boxShadow: "-20px 0 60px rgba(15,23,42,0.14)",
            overflow: "hidden",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Box sx={{ px: 2.5, pt: 2.5, pb: 2, borderBottom: `1px solid ${COLORS.border}` }}>
            <Stack
              direction="row" alignItems="center" justifyContent="space-between"
              spacing={1.2} mb={loggedIn ? 2 : 0}
            >
              <Logo />
              <IconButton
                onClick={closeMobile}
                sx={{
                  width: 42, height: 42, borderRadius: "14px",
                  border: `1px solid ${COLORS.borderStrong}`, color: COLORS.text,
                  "&:hover": { color: COLORS.admin, borderColor: COLORS.admin, backgroundColor: COLORS.adminSoft },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            {loggedIn && (
              <Box
                sx={{
                  p: 1.8, borderRadius: "18px",
                  backgroundColor: roleKey === "admin" ? "rgba(254,242,242,0.72)" : "rgba(248,250,252,0.9)",
                  border: roleKey === "admin" ? "1px solid rgba(239,68,68,0.12)" : "1px solid rgba(148,163,184,0.18)",
                }}
              >
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <UserAvatar initials={initials} photo={user?.photo} roleKey={roleKey} size={44} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", lineHeight: 1.2, color: COLORS.text }}>
                      {user?.name || "User"}
                    </Typography>
                    {!!user?.email && (
                      <Typography sx={{ fontSize: "0.72rem", color: COLORS.muted, mb: 0.55 }}>
                        {user.email}
                      </Typography>
                    )}
                    <RoleBadge roleKey={roleKey} />
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5 }}>
            <Stack spacing={0.45}>
              {navCfg.mobile.map((item) => (
                <MobileNavLink
                  key={item.label}
                  item={item}
                  active={isActive(item.to)}
                  onClick={closeMobile}
                />
              ))}
            </Stack>

            {roleKey === "free" && (
              <Box
                component={RouterLink}
                to="/subscription"
                onClick={closeMobile}
                sx={{
                  mt: 2, p: 2, display: "flex", alignItems: "center", gap: 1.2,
                  borderRadius: "18px", textDecoration: "none",
                  backgroundColor: "#111827", color: "#ffffff",
                  boxShadow: "0 14px 28px rgba(17,24,39,0.14)",
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: "0.88rem", lineHeight: 1.2, color: "#ffffff" }}>
                    Upgrade to Premium
                  </Typography>
                  <Typography sx={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.76)" }}>
                    Unlock contacts, prices &amp; post listings — ₹299
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon sx={{ ml: "auto", fontSize: 18, color: "#ffffff" }} />
              </Box>
            )}

            {!loggedIn && (
              <Stack spacing={1.1} sx={{ mt: 2 }}>
                <Button
                  component={RouterLink} to="/login" onClick={closeMobile}
                  variant="outlined" startIcon={<LoginRoundedIcon />} fullWidth
                  sx={{
                    minHeight: 48, borderRadius: "16px",
                    textTransform: "none", fontWeight: 800,
                    borderColor: COLORS.borderStrong, color: COLORS.text,
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink} to="/register" onClick={closeMobile}
                  variant="contained" startIcon={<PersonAddAlt1RoundedIcon />} fullWidth
                  sx={{
                    minHeight: 48, borderRadius: "16px",
                    textTransform: "none", fontWeight: 900,
                    backgroundColor: COLORS.text,
                    "&:hover": { backgroundColor: "#1e293b" },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            )}
          </Box>

          {loggedIn && (
            <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${COLORS.border}` }}>
              <Button
                onClick={handleLogout} fullWidth variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  minHeight: 48, borderRadius: "18px",
                  textTransform: "none", fontWeight: 800, fontSize: "0.9rem",
                  borderColor: "rgba(239,68,68,0.28)", color: "#ef4444",
                  "&:hover": { borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.05)" },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
