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
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

import { useAppState } from "../hooks/useAppState";

const C = {
  surface: "rgba(255,255,255,0.92)",
  surfaceStrong: "rgba(255,255,255,0.99)",
  border: "rgba(15,23,42,0.08)",
  borderHover: "rgba(15,23,42,0.16)",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.07)",
  premiumGold: "#b45309",
  premiumSoft: "rgba(180,83,9,0.08)",
  adminRed: "#b91c1c",
  adminSoft: "rgba(185,28,28,0.07)",
  freePurple: "#6d28d9",
  freeSoft: "rgba(109,40,217,0.08)",
  shadow: "0 1px 3px rgba(15,23,42,0.06), 0 8px 32px rgba(15,23,42,0.06)",
  shadowLifted: "0 2px 8px rgba(15,23,42,0.08), 0 20px 48px rgba(15,23,42,0.10)",
};

function resolveRole(user) {
  if (!user?.loggedIn) return "guest";
  if (user?.role === "admin") return "admin";
  if (
    user?.isPremium === true ||
    user?.role === "premium" ||
    user?.subscription === "active"
  ) {
    return "premium";
  }
  return "free";
}

function getNavConfig() {
  return {
    guest: {
      desktop: [
        { label: "Pricing", to: "/subscription" },
        { label: "About Us", to: "/about" },
        { label: "How It Works", to: "/how-it-works" },
        { label: "FAQ", to: "/faq" },
        { label: "Contact Us", to: "/contact" },
      ],
      mobile: [
        { label: "Pricing", to: "/subscription", icon: <CurrencyRupeeRoundedIcon fontSize="small" /> },
        { label: "About Us", to: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
        { label: "How It Works", to: "/how-it-works", icon: <LightbulbOutlinedIcon fontSize="small" /> },
        { label: "FAQ", to: "/faq", icon: <HelpOutlineRoundedIcon fontSize="small" /> },
        { label: "Blog", to: "/blog", icon: <ArticleOutlinedIcon fontSize="small" /> },
        { label: "Contact Us", to: "/contact", icon: <ContactSupportRoundedIcon fontSize="small" /> },
        { label: "Login", to: "/login", icon: <LoginRoundedIcon fontSize="small" /> },
        { label: "Register", to: "/register", icon: <PersonAddAlt1RoundedIcon fontSize="small" /> },
      ],
      dropdown: [],
    },

    free: {
      desktop: [
        { label: "Dashboard", to: "/free-dashboard" },
        { label: "Pricing", to: "/subscription" },
        { label: "About Us", to: "/about" },
        { label: "How It Works", to: "/how-it-works" },
        { label: "FAQ", to: "/faq" },
        { label: "Blog", to: "/blog" },
        { label: "Contact Us", to: "/contact" },
      ],
      mobile: [
        { label: "Dashboard", to: "/free-dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Upgrade", to: "/subscription", icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
        { label: "About Us", to: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
        { label: "How It Works", to: "/how-it-works", icon: <LightbulbOutlinedIcon fontSize="small" /> },
        { label: "FAQ", to: "/faq", icon: <HelpOutlineRoundedIcon fontSize="small" /> },
        { label: "Blog", to: "/blog", icon: <ArticleOutlinedIcon fontSize="small" /> },
        { label: "Contact Us", to: "/contact", icon: <ContactSupportRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "My Dashboard", to: "/free-dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Upgrade Premium", to: "/subscription", icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
      ],
    },

    premium: {
      desktop: [
        { label: "Dashboard", to: "/dashboard" },
        { label: "My Listings", to: "/dashboard/my-listings" },
        { label: "About Us", to: "/about" },
        { label: "How It Works", to: "/how-it-works" },
        { label: "FAQ", to: "/faq" },
        { label: "Blog", to: "/blog" },
        { label: "Contact Us", to: "/contact" },
      ],
      mobile: [
        { label: "Dashboard", to: "/dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "Post Listing", to: "/dashboard/add-property", icon: <AddCircleOutlineRoundedIcon fontSize="small" /> },
        { label: "My Listings", to: "/dashboard/my-listings", icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Profile", to: "/dashboard/profile", icon: <PersonRoundedIcon fontSize="small" /> },
        { label: "About Us", to: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
        { label: "How It Works", to: "/how-it-works", icon: <LightbulbOutlinedIcon fontSize="small" /> },
        { label: "FAQ", to: "/faq", icon: <HelpOutlineRoundedIcon fontSize="small" /> },
        { label: "Blog", to: "/blog", icon: <ArticleOutlinedIcon fontSize="small" /> },
        { label: "Contact Us", to: "/contact", icon: <ContactSupportRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "Dashboard", to: "/dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: "My Listings", to: "/dashboard/my-listings", icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Subscription", to: "/dashboard/subscription", icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
        { label: "Profile", to: "/dashboard/profile", icon: <PersonRoundedIcon fontSize="small" /> },
      ],
    },

    admin: {
      desktop: [
        { label: "Overview", to: "/admin" },
        { label: "Users", to: "/admin/users" },
        { label: "Listings", to: "/admin/listings" },
        { label: "Reports", to: "/admin/reports" },
      ],
      mobile: [
        { label: "Overview", to: "/admin", icon: <SpaceDashboardRoundedIcon fontSize="small" /> },
        { label: "Users", to: "/admin/users", icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: "Listings", to: "/admin/listings", icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: "Reports", to: "/admin/reports", icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: "Settings", to: "/admin/settings", icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: "Admin Panel", to: "/admin", icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
        { label: "Manage Users", to: "/admin/users", icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: "Reports", to: "/admin/reports", icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: "Settings", to: "/admin/settings", icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
    },
  };
}

const ROLE_BADGE = {
  guest: null,
  free: {
    label: "Free",
    color: C.freePurple,
    bg: C.freeSoft,
    border: "rgba(109,40,217,0.15)",
  },
  premium: {
    label: "Premium",
    color: C.premiumGold,
    bg: C.premiumSoft,
    border: "rgba(180,83,9,0.15)",
  },
  admin: {
    label: "Administrator",
    color: C.adminRed,
    bg: C.adminSoft,
    border: "rgba(185,28,28,0.15)",
  },
};

const AVATAR_COLORS = {
  guest: { bg: "#e2e8f0", color: "#64748b" },
  free: { bg: C.freePurple, color: "#fff" },
  premium: { bg: "#d97706", color: "#fff" },
  admin: { bg: "#dc2626", color: "#fff" },
};

function RoleBadge({ roleKey }) {
  const cfg = ROLE_BADGE[roleKey];
  if (!cfg) return null;

  return (
    <Chip
      size="small"
      icon={
        roleKey === "admin" ? (
          <VerifiedUserRoundedIcon sx={{ fontSize: "12px !important" }} />
        ) : (
          <WorkspacePremiumRoundedIcon sx={{ fontSize: "12px !important" }} />
        )
      }
      label={cfg.label}
      sx={{
        height: 22,
        borderRadius: "6px",
        px: 0.5,
        fontWeight: 700,
        fontSize: "0.68rem",
        letterSpacing: "0.02em",
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        "& .MuiChip-icon": { color: cfg.color, ml: "6px" },
        "& .MuiChip-label": { px: "6px" },
      }}
    />
  );
}

function UserAvatar({ initials, photo, roleKey, size = 36 }) {
  const tone = AVATAR_COLORS[roleKey] || AVATAR_COLORS.free;
  return (
    <Avatar
      src={photo || undefined}
      sx={{
        width: size,
        height: size,
        bgcolor: tone.bg,
        color: tone.color,
        fontWeight: 800,
        fontSize: size * 0.36,
        letterSpacing: "-0.01em",
      }}
    >
      {!photo && initials}
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
      spacing={1}
      sx={{ textDecoration: "none", flexShrink: 0 }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="EasyDeal"
        sx={{ height: 36, width: "auto", objectFit: "contain" }}
      />
    </Stack>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.5,
        py: 0.875,
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: active ? 700 : 500,
        fontSize: "0.875rem",
        color: active ? C.text : C.muted,
        backgroundColor: active ? "rgba(15,23,42,0.05)" : "transparent",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        "&:hover": {
          color: C.text,
          backgroundColor: "rgba(15,23,42,0.04)",
        },
      }}
    >
      {label}
    </Box>
  );
}

function MobileNavItem({ item, active, onClick }) {
  return (
    <Box
      component={RouterLink}
      to={item.to}
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.25,
        py: 1,
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: active ? 700 : 500,
        fontSize: "0.9rem",
        color: active ? C.primary : C.text,
        backgroundColor: active ? C.primarySoft : "transparent",
        transition: "all 0.15s ease",
        "&:hover": { backgroundColor: "rgba(15,23,42,0.04)", color: C.text },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          bgcolor: active ? C.primary : "rgba(15,23,42,0.05)",
          color: active ? "#fff" : C.muted,
          "& svg": { fontSize: 16 },
        }}
      >
        {item.icon}
      </Box>
      <span style={{ flex: 1 }}>{item.label}</span>
      {active && <ChevronRightRoundedIcon sx={{ fontSize: 16, color: C.primary, opacity: 0.6 }} />}
    </Box>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAppState();

  const roleKey = resolveRole(user);
  const loggedIn = roleKey !== "guest";
  const menuOpen = Boolean(anchorEl);
  const navCfg = useMemo(() => getNavConfig()[roleKey], [roleKey]);
  const dropdownItems = navCfg?.dropdown ?? [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAnchorEl(null);
  }, [location.pathname]);

  const initials = useMemo(() => {
    const name = user?.name?.trim() || "U";
    const parts = name.split(" ").filter(Boolean);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  }, [user?.name]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (["/dashboard", "/admin", "/free-dashboard"].includes(path)) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeMenu = () => setAnchorEl(null);
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    closeMenu();
    closeMobile();
    logout();
    navigate("/");
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: scrolled ? C.surfaceStrong : C.surface,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.2s ease",
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" sx={{ minHeight: { xs: 60, md: 66 }, gap: { xs: 1, md: 2 } }}>
            <Logo />

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.25}
              sx={{
                display: { xs: "none", lg: "flex" },
                flex: 1,
                px: 2,
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {navCfg.desktop.map((item) => (
                <NavLink key={item.to + item.label} to={item.to} label={item.label} active={isActive(item.to)} />
              ))}
            </Stack>

            <Box sx={{ flex: 1, display: { xs: "flex", lg: "none" } }} />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
            >
              {roleKey === "guest" && (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
                    sx={{
                      minHeight: 38,
                      px: 1.75,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: C.muted,
                      "&:hover": { bgcolor: "rgba(15,23,42,0.04)", color: C.text },
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    sx={{
                      minHeight: 38,
                      px: 1.75,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderColor: C.border,
                      color: C.text,
                      "&:hover": { borderColor: C.borderHover, bgcolor: "rgba(15,23,42,0.03)" },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}

              {roleKey === "free" && (
                <>
                  <RoleBadge roleKey="free" />
                  <Button
                    component={RouterLink}
                    to="/subscription"
                    variant="contained"
                    startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: "15px !important" }} />}
                    sx={{
                      minHeight: 38,
                      px: 2,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      bgcolor: C.freePurple,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#5b21b6", boxShadow: "none" },
                    }}
                  >
                    Upgrade ₹299
                  </Button>
                  <Tooltip title="Account" arrow placement="bottom">
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      size="small"
                      sx={{ p: 0.375, borderRadius: "10px", border: `1.5px solid ${C.border}`, "&:hover": { borderColor: C.borderHover } }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="free" size={32} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {roleKey === "premium" && (
                <>
                  <RoleBadge roleKey="premium" />
                  <Button
                    component={RouterLink}
                    to="/dashboard/add-property"
                    variant="contained"
                    startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      minHeight: 38,
                      px: 2,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      bgcolor: C.primary,
                      boxShadow: "none",
                      "&:hover": { bgcolor: C.primaryHover, boxShadow: "none" },
                    }}
                  >
                    Post Listing
                  </Button>
                  <Tooltip title="Account" arrow placement="bottom">
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      size="small"
                      sx={{ p: 0.375, borderRadius: "10px", border: `1.5px solid ${C.border}`, "&:hover": { borderColor: C.borderHover } }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="premium" size={32} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {roleKey === "admin" && (
                <>
                  <RoleBadge roleKey="admin" />
                  <Button
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      minHeight: 38,
                      px: 1.75,
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      borderColor: "rgba(185,28,28,0.25)",
                      color: C.adminRed,
                      "&:hover": { borderColor: C.adminRed, bgcolor: C.adminSoft },
                    }}
                  >
                    Admin
                  </Button>
                  <Tooltip title="Admin account" arrow placement="bottom">
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      size="small"
                      sx={{ p: 0.375, borderRadius: "10px", border: "1.5px solid rgba(185,28,28,0.18)", "&:hover": { borderColor: C.adminRed } }}
                    >
                      <UserAvatar initials={initials} photo={user?.photo} roleKey="admin" size={32} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>

            <IconButton
              onClick={() => setMobileOpen(true)}
              size="small"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: `1.5px solid ${C.border}`,
                color: C.text,
                "&:hover": { borderColor: C.borderHover, bgcolor: "rgba(15,23,42,0.03)" },
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Container>
      </Box>

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
              mt: 1,
              minWidth: 240,
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadowLifted,
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <UserAvatar initials={initials} photo={user?.photo} roleKey={roleKey} size={40} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: C.text, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.name || "User"}
                </Typography>
                {user?.email && (
                  <Typography sx={{ fontSize: "0.72rem", color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", mt: 0.2, mb: 0.5 }}>
                    {user.email}
                  </Typography>
                )}
                <RoleBadge roleKey={roleKey} />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: C.border }} />

          {dropdownItems.map((item) => (
            <MenuItem
              key={item.label}
              component={RouterLink}
              to={item.to}
              onClick={closeMenu}
              sx={{ py: 1.25, px: 2, fontSize: "0.875rem", fontWeight: 500, color: C.text, gap: 0.5, "&:hover": { bgcolor: "rgba(15,23,42,0.04)" } }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: C.muted, "& svg": { fontSize: 17 } }}>
                {item.icon}
              </ListItemIcon>
              {item.label}
            </MenuItem>
          ))}

          <Divider sx={{ borderColor: C.border }} />

          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.25, px: 2, fontSize: "0.875rem", fontWeight: 600, color: "#ef4444", gap: 0.5, "&:hover": { bgcolor: "rgba(239,68,68,0.04)" } }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#ef4444", "& svg": { fontSize: 17 } }}>
              <LogoutRoundedIcon />
            </ListItemIcon>
            Log out
          </MenuItem>
        </Menu>
      )}

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: 300,
            maxWidth: "85vw",
            backgroundColor: "#ffffff",
            boxShadow: "-8px 0 40px rgba(15,23,42,0.12)",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.75, borderBottom: `1px solid ${C.border}` }}>
            <Logo />
            <IconButton
              onClick={closeMobile}
              size="small"
              sx={{ width: 36, height: 36, borderRadius: "9px", border: `1.5px solid ${C.border}`, color: C.muted, "&:hover": { borderColor: C.borderHover, color: C.text } }}
            >
              <CloseRoundedIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Stack>

          {loggedIn && (
            <Box sx={{ px: 2, py: 2, borderBottom: `1px solid ${C.border}` }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <UserAvatar initials={initials} photo={user?.photo} roleKey={roleKey} size={42} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: C.text, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name || "User"}
                  </Typography>
                  {user?.email && (
                    <Typography sx={{ fontSize: "0.72rem", color: C.muted, mt: 0.2, mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </Typography>
                  )}
                  <RoleBadge roleKey={roleKey} />
                </Box>
              </Stack>
            </Box>
          )}

          <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1.5 }}>
            <Stack spacing={0.25}>
              {navCfg.mobile.map((item) => (
                <MobileNavItem key={item.label} item={item} active={isActive(item.to)} onClick={closeMobile} />
              ))}
            </Stack>

            {roleKey === "free" && (
              <Box
                component={RouterLink}
                to="/subscription"
                onClick={closeMobile}
                sx={{
                  mt: 2,
                  p: 1.75,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  borderRadius: "12px",
                  textDecoration: "none",
                  bgcolor: C.freePurple,
                  color: "#ffffff",
                  boxShadow: "0 4px 16px rgba(109,40,217,0.24)",
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 20, flexShrink: 0 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#fff", lineHeight: 1.3 }}>
                    Upgrade to Premium
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.72)", mt: 0.25 }}>
                    Post listings &amp; unlock contacts — ₹299
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon sx={{ ml: "auto", fontSize: 18, flexShrink: 0, opacity: 0.7 }} />
              </Box>
            )}

            {!loggedIn && (
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  onClick={closeMobile}
                  variant="outlined"
                  startIcon={<LoginRoundedIcon />}
                  fullWidth
                  sx={{
                    minHeight: 44,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    borderColor: C.border,
                    color: C.text,
                    "&:hover": { borderColor: C.borderHover, bgcolor: "rgba(15,23,42,0.03)" },
                  }}
                >
                  Log in
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  onClick={closeMobile}
                  variant="contained"
                  startIcon={<PersonAddAlt1RoundedIcon />}
                  fullWidth
                  sx={{
                    minHeight: 44,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    bgcolor: C.text,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1e293b", boxShadow: "none" },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            )}
          </Box>

          {loggedIn && (
            <Box sx={{ px: 1.5, py: 2, borderTop: `1px solid ${C.border}` }}>
              <Button
                onClick={handleLogout}
                fullWidth
                variant="text"
                startIcon={<LogoutRoundedIcon sx={{ fontSize: "17px !important" }} />}
                sx={{
                  minHeight: 42,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#ef4444",
                  justifyContent: "flex-start",
                  px: 1.5,
                  "&:hover": { bgcolor: "rgba(239,68,68,0.05)" },
                }}
              >
                Log out
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </>
  );
}