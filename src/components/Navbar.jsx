
// src/components/Navbar.jsx
import { useMemo, useState, useEffect } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
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
} from '@mui/material'

import MenuRoundedIcon               from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon              from '@mui/icons-material/CloseRounded'
import HomeWorkRoundedIcon           from '@mui/icons-material/HomeWorkRounded'
import ExploreRoundedIcon            from '@mui/icons-material/ExploreRounded'
import SellRoundedIcon               from '@mui/icons-material/SellRounded'
import LoginRoundedIcon              from '@mui/icons-material/LoginRounded'
import PersonAddAlt1RoundedIcon      from '@mui/icons-material/PersonAddAlt1Rounded'
import DashboardRoundedIcon          from '@mui/icons-material/DashboardRounded'
import PersonRoundedIcon             from '@mui/icons-material/PersonRounded'
import ListAltRoundedIcon            from '@mui/icons-material/ListAltRounded'
import WorkspacePremiumRoundedIcon   from '@mui/icons-material/WorkspacePremiumRounded'
import LogoutRoundedIcon             from '@mui/icons-material/LogoutRounded'
import CurrencyRupeeRoundedIcon      from '@mui/icons-material/CurrencyRupeeRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import PeopleAltRoundedIcon          from '@mui/icons-material/PeopleAltRounded'
import BarChartRoundedIcon           from '@mui/icons-material/BarChartRounded'
import SettingsRoundedIcon           from '@mui/icons-material/SettingsRounded'
import VerifiedUserRoundedIcon       from '@mui/icons-material/VerifiedUserRounded'
import SpaceDashboardRoundedIcon     from '@mui/icons-material/SpaceDashboardRounded'
import ChevronRightRoundedIcon       from '@mui/icons-material/ChevronRightRounded'
import LocalOfferRoundedIcon         from '@mui/icons-material/LocalOfferRounded'

import { useAppState } from '../hooks/useAppState'

// ─── Nav config (function so JSX icons are created inside React tree) ─────────
function getNavConfig() {
  return {
    guest: {
      desktop: [
        { label: 'Browse',  to: '/browse' },
        { label: 'Pricing', to: '/subscription' },
      ],
      mobile: [
        { label: 'Browse',       to: '/browse',       icon: <ExploreRoundedIcon fontSize="small" /> },
        { label: 'Pricing',      to: '/subscription', icon: <CurrencyRupeeRoundedIcon fontSize="small" /> },
        { label: 'Post Listing', to: '/register',     icon: <SellRoundedIcon fontSize="small" /> },
        { label: 'Login',        to: '/login',        icon: <LoginRoundedIcon fontSize="small" /> },
        { label: 'Register',     to: '/register',     icon: <PersonAddAlt1RoundedIcon fontSize="small" /> },
      ],
      dropdown: [],
    },
    free: {
      desktop: [
        { label: 'Browse',    to: '/browse' },
        { label: 'Dashboard', to: '/dashboard' },
      ],
      mobile: [
        { label: 'Browse',       to: '/browse',                 icon: <ExploreRoundedIcon fontSize="small" /> },
        { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: 'Subscription', to: '/dashboard/subscription',icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
        { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: 'Subscription', to: '/dashboard/subscription',icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
        { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
      ],
    },
    premium: {
      desktop: [
        { label: 'Browse',    to: '/browse' },
        { label: 'Dashboard', to: '/dashboard' },
      ],
      mobile: [
        { label: 'Browse',       to: '/browse',                 icon: <ExploreRoundedIcon fontSize="small" /> },
        { label: 'Post Listing', to: '/dashboard/add-property', icon: <SellRoundedIcon fontSize="small" /> },
        { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: 'Dashboard',   to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
        { label: 'My Listings', to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: 'Profile',     to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
      ],
    },
    admin: {
      desktop: [
        { label: 'Overview', to: '/admin' },
        { label: 'Users',    to: '/admin/users' },
        { label: 'Listings', to: '/admin/listings' },
        { label: 'Reports',  to: '/admin/reports' },
      ],
      mobile: [
        { label: 'Overview', to: '/admin',          icon: <SpaceDashboardRoundedIcon fontSize="small" /> },
        { label: 'Users',    to: '/admin/users',    icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: 'Listings', to: '/admin/listings', icon: <ListAltRoundedIcon fontSize="small" /> },
        { label: 'Reports',  to: '/admin/reports',  icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: 'Settings', to: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
      dropdown: [
        { label: 'Admin Panel',  to: '/admin',          icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
        { label: 'Manage Users', to: '/admin/users',    icon: <PeopleAltRoundedIcon fontSize="small" /> },
        { label: 'Reports',      to: '/admin/reports',  icon: <BarChartRoundedIcon fontSize="small" /> },
        { label: 'Settings',     to: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
      ],
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function resolveRole(user) {
  if (!user?.loggedIn)        return 'guest'
  if (user?.role === 'admin') return 'admin'
  if (user?.isPremium)        return 'premium'
  return 'free'
}

const ROLE_BADGE = {
  guest:   null,
  free:    {
    label: 'Free',
    bg: 'rgba(109,91,255,0.09)',
    color: '#5b4cf0',
    border: 'rgba(109,91,255,0.18)',
  },
  premium: {
    label: 'Premium Active',
    bg: 'rgba(16,185,129,0.09)',
    color: '#047857',
    border: 'rgba(16,185,129,0.20)',
  },
  admin: {
    label: 'Admin',
    bg: 'rgba(239,68,68,0.09)',
    color: '#b91c1c',
    border: 'rgba(239,68,68,0.20)',
  },
}

const AVATAR_GRADIENT = {
  guest:   'linear-gradient(135deg, #94a3b8, #64748b)',
  free:    'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
  premium: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  admin:   'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
}

// ─── Small components ─────────────────────────────────────────────────────────
function RoleBadge({ roleKey }) {
  const cfg = ROLE_BADGE[roleKey]
  if (!cfg) return null

  const icon = roleKey === 'admin'
    ? <VerifiedUserRoundedIcon sx={{ fontSize: 13 }} />
    : <WorkspacePremiumRoundedIcon sx={{ fontSize: 13 }} />

  return (
    <Chip
      icon={icon}
      label={cfg.label}
      size="small"
      sx={{
        height: 28,
        pl: 0.3,
        borderRadius: '999px',
        fontWeight: 800,
        fontSize: '0.73rem',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        '& .MuiChip-icon': { color: cfg.color },
      }}
    />
  )
}

function UserAvatar({ initials, photo, roleKey, size = 38 }) {
  return (
    <Avatar
      src={photo || undefined}
      sx={{
        width: size,
        height: size,
        background: AVATAR_GRADIENT[roleKey] || AVATAR_GRADIENT.free,
        color: '#fff',
        fontWeight: 900,
        fontSize: size * 0.34,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      }}
    >
      {initials}
    </Avatar>
  )
}

function Logo({ compact = false }) {
  return (
    <Stack
      component={RouterLink}
      to="/"
      direction="row"
      alignItems="center"
      spacing={1.3}
      sx={{ flexShrink: 0, textDecoration: 'none' }}
    >
      <Box
        sx={{
          width: compact ? 38 : 44,
          height: compact ? 38 : 44,
          borderRadius: compact ? '14px' : '16px',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #c3f53c 0%, #7ee846 55%, #3dd68c 100%)',
          color: '#14532d',
          flexShrink: 0,
          boxShadow: '0 8px 22px rgba(125,232,70,0.30)',
        }}
      >
        <HomeWorkRoundedIcon sx={{ fontSize: compact ? 20 : 23 }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: compact ? '0.97rem' : '1.05rem',
            lineHeight: 1.1,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          MarketPlus
        </Typography>
        {!compact && (
          <Typography
            sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', lineHeight: 1 }}
          >
            Property &amp; Vehicles
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 1.8,
        py: 1,
        borderRadius: '14px',
        fontSize: '0.91rem',
        fontWeight: 700,
        textDecoration: 'none',
        color: active ? '#5b4cf0' : '#475569',
        background: active ? 'rgba(109,91,255,0.07)' : 'transparent',
        transition: 'all .20s ease',
        '&:hover': { color: '#0f172a', background: 'rgba(15,23,42,0.05)' },
      }}
    >
      {label}
      {active && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#7c6cff',
          }}
        />
      )}
    </Box>
  )
}

function AnnouncementBar({ onClose }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 55%, #38c2ff 100%)',
        py: 0.9,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        position: 'relative',
      }}
    >
      <LocalOfferRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }} />
      <Typography
        sx={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.01em',
        }}
      >
        🎉 Unlock full marketplace access for just ₹299 — one-time premium upgrade.
      </Typography>
      <Box
        component={RouterLink}
        to="/subscription"
        sx={{
          ml: 1,
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.2,
          textDecoration: 'none',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          px: 1.2,
          py: 0.35,
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'background .2s',
          '&:hover': { background: 'rgba(255,255,255,0.28)' },
        }}
      >
        Upgrade now <ChevronRightRoundedIcon sx={{ fontSize: 13 }} />
      </Box>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          color: 'rgba(255,255,255,0.75)',
          p: 0.5,
          '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.12)' },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen,       setMobileOpen]       = useState(false)
  const [anchorEl,         setAnchorEl]         = useState(null)
  const [scrolled,         setScrolled]         = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAppState()

  // Resolve role + nav config inside the component (safe for JSX icons)
  const roleKey       = resolveRole(user)
  const loggedIn      = roleKey !== 'guest'
  const menuOpen      = Boolean(anchorEl)
  const navCfg        = useMemo(() => getNavConfig()[roleKey], [roleKey])
  const dropdownItems = navCfg?.dropdown ?? []

  // Only show announcement bar for guest and free users (not premium or admin)
  const showBar =
    showAnnouncement && (roleKey === 'guest' || roleKey === 'free')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const initials = useMemo(() => {
    const name  = user?.name?.trim() || 'U'
    const parts = name.split(' ')
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : `${parts[0][0]}`.toUpperCase()
  }, [user?.name])

  // FIX: correctly handles both /dashboard and /admin prefixes
  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const closeMenu    = () => setAnchorEl(null)
  const closeMobile  = () => setMobileOpen(false)
  const handleLogout = () => {
    closeMenu()
    closeMobile()
    logout()
    navigate('/')
  }

  return (
    <>
      {showBar && (
        <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
      )}

      {/* Sticky wrapper — transparent so nothing leaks around the pill */}
      <Box
        sx={{
          position: 'sticky',
          top: 10,
          zIndex: 1200,
          px: { xs: 1.5, md: 2.5 },
          pt: 1.2,
          pb: 0.5,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ pointerEvents: 'auto' }}>
          {/* Pill card */}
          <Box
            sx={{
              borderRadius: '999px',
              background: scrolled
                ? 'rgba(255,255,255,0.98)'
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: scrolled
                ? '1px solid rgba(226,232,240,0.95)'
                : '1px solid rgba(226,232,240,0.75)',
              boxShadow: scrolled
                ? '0 22px 60px rgba(15,23,42,0.10), 0 4px 14px rgba(15,23,42,0.05)'
                : '0 12px 40px rgba(15,23,42,0.07)',
              transition: 'all .3s cubic-bezier(.16,1,.3,1)',
              display: 'flex',
              alignItems: 'center',
              minHeight: { xs: 64, md: 70 },
              px: { xs: 1.8, sm: 2.4, md: 3.2 },
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box sx={{ flex: '1 1 0', display: 'flex', alignItems: 'center' }}>
              <Logo />
            </Box>

            {/* Centre nav pill */}
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{
                flex: '0 0 auto',
                display: { xs: 'none', lg: 'flex' },
                background: 'rgba(248,250,252,0.8)',
                border: '1px solid rgba(226,232,240,0.8)',
                borderRadius: '999px',
                px: 0.7,
                py: 0.6,
              }}
            >
              {navCfg.desktop.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  active={isActive(item.to)}
                />
              ))}
            </Stack>

            {/* Right actions */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                flex: '1 1 0',
                justifyContent: 'flex-end',
                display: { xs: 'none', md: 'flex' },
                gap: 1,
              }}
            >
              {/* GUEST */}
              {roleKey === 'guest' && (
                <>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="text"
                    color="inherit"
                    startIcon={<SellRoundedIcon />}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: '#475569',
                      borderRadius: '999px',
                      px: 2,
                      py: 1,
                      '&:hover': { background: 'rgba(15,23,42,0.05)', color: '#0f172a' },
                    }}
                  >
                    Post Listing
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      borderRadius: '999px',
                      px: 2.2,
                      py: 0.95,
                      borderColor: 'rgba(148,163,184,0.5)',
                      color: '#475569',
                      '&:hover': {
                        borderColor: '#7c6cff',
                        color: '#5b4cf0',
                        background: 'rgba(109,91,255,0.04)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      borderRadius: '999px',
                      px: 2.4,
                      py: 1,
                      background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
                      boxShadow: '0 10px 28px rgba(109,91,255,0.30)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6b59f5 0%, #4c75ff 100%)',
                        boxShadow: '0 14px 36px rgba(109,91,255,0.38)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* FREE or PREMIUM */}
              {(roleKey === 'free' || roleKey === 'premium') && (
                <>
                  <RoleBadge roleKey={roleKey} />

                  {roleKey === 'premium' && (
                    <Button
                      component={RouterLink}
                      to="/dashboard/add-property"
                      variant="outlined"
                      startIcon={<SellRoundedIcon />}
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        borderRadius: '999px',
                        px: 2,
                        py: 0.95,
                        borderColor: 'rgba(148,163,184,0.45)',
                        color: '#475569',
                        '&:hover': {
                          borderColor: '#7c6cff',
                          color: '#5b4cf0',
                          background: 'rgba(109,91,255,0.04)',
                        },
                      }}
                    >
                      Post Listing
                    </Button>
                  )}

                  {roleKey === 'free' && (
                    <Button
                      component={RouterLink}
                      to="/subscription"
                      variant="contained"
                      startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        borderRadius: '999px',
                        px: 2.2,
                        py: 0.95,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                        boxShadow: '0 10px 28px rgba(249,115,22,0.28)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                          boxShadow: '0 14px 36px rgba(249,115,22,0.36)',
                        },
                      }}
                    >
                      Upgrade ₹299
                    </Button>
                  )}

                  <Tooltip title="Account menu" arrow>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        p: 0.45,
                        border: '2px solid rgba(226,232,240,0.9)',
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          borderColor: '#7c6cff',
                          boxShadow: '0 0 0 3px rgba(109,91,255,0.12)',
                        },
                      }}
                    >
                      <UserAvatar
                        initials={initials}
                        photo={user?.photo}
                        roleKey={roleKey}
                        size={36}
                      />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* ADMIN */}
              {roleKey === 'admin' && (
                <>
                  <RoleBadge roleKey="admin" />
                  <Button
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsRoundedIcon />}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      borderRadius: '999px',
                      px: 2,
                      py: 0.95,
                      borderColor: 'rgba(239,68,68,0.35)',
                      color: '#b91c1c',
                      '&:hover': {
                        borderColor: '#ef4444',
                        background: 'rgba(239,68,68,0.05)',
                      },
                    }}
                  >
                    Admin Panel
                  </Button>
                  <Tooltip title="Admin account" arrow>
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        p: 0.45,
                        border: '2px solid rgba(239,68,68,0.25)',
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          borderColor: '#ef4444',
                          boxShadow: '0 0 0 3px rgba(239,68,68,0.10)',
                        },
                      }}
                    >
                      <UserAvatar
                        initials={initials}
                        photo={user?.photo}
                        roleKey="admin"
                        size={36}
                      />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>

            {/* Hamburger */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                border: '1.5px solid rgba(226,232,240,0.9)',
                background: 'rgba(255,255,255,0.9)',
                p: 1,
                borderRadius: '14px',
                '&:hover': { borderColor: '#7c6cff' },
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* ── Avatar dropdown ──────────────────────────────────────────────────── */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.6,
            minWidth: 248,
            borderRadius: '22px',
            boxShadow:
              '0 24px 60px rgba(15,23,42,0.13), 0 4px 16px rgba(15,23,42,0.06)',
            border: '1px solid rgba(226,232,240,0.85)',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -6,
              right: 20,
              width: 12,
              height: 12,
              background: roleKey === 'admin' ? '#fef2f2' : '#eef2ff',
              border: '1px solid rgba(226,232,240,0.8)',
              transform: 'rotate(45deg)',
              borderBottom: 'none',
              borderRight: 'none',
              zIndex: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2.4,
            py: 2,
            background:
              roleKey === 'admin'
                ? 'linear-gradient(135deg, rgba(254,242,242,0.9), rgba(255,237,213,0.6))'
                : 'linear-gradient(135deg, rgba(238,242,255,0.9), rgba(219,234,254,0.6))',
            borderRadius: '22px 22px 0 0',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <UserAvatar
              initials={initials}
              photo={user?.photo}
              roleKey={roleKey}
              size={46}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '0.97rem',
                  lineHeight: 1.2,
                  color: '#0f172a',
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography
                sx={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, mb: 0.6 }}
              >
                {user?.email || ''}
              </Typography>
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
              py: 1.4,
              px: 2.2,
              fontWeight: 600,
              fontSize: '0.88rem',
              color: '#334155',
              gap: 0.5,
              '&:hover': { background: 'rgba(109,91,255,0.05)', color: '#5b4cf0' },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 36, '& svg': { fontSize: 18, color: '#94a3b8' } }}
            >
              {item.icon}
            </ListItemIcon>
            {item.label}
            <ChevronRightRoundedIcon
              sx={{ ml: 'auto', fontSize: 16, color: '#cbd5e1' }}
            />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.4,
            px: 2.2,
            fontWeight: 700,
            fontSize: '0.88rem',
            color: '#ef4444',
            gap: 0.5,
            borderRadius: '0 0 22px 22px',
            '&:hover': { background: 'rgba(239,68,68,0.05)' },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 36, '& svg': { fontSize: 18, color: '#ef4444' } }}
          >
            <LogoutRoundedIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: 330,
            borderRadius: '28px 0 0 28px',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            boxShadow: '-20px 0 60px rgba(15,23,42,0.12)',
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          {/* Drawer header */}
          <Box
            sx={{
              px: 2.5,
              pt: 2.5,
              pb: 2,
              borderBottom: '1px solid rgba(226,232,240,0.7)',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Logo compact />
              <IconButton
                onClick={closeMobile}
                sx={{
                  border: '1.5px solid rgba(226,232,240,0.9)',
                  borderRadius: '14px',
                  p: 0.8,
                  '&:hover': { borderColor: '#ef4444', color: '#ef4444' },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            {loggedIn && (
              <Box
                sx={{
                  p: 1.8,
                  borderRadius: '18px',
                  background:
                    roleKey === 'admin'
                      ? 'linear-gradient(135deg, rgba(254,242,242,0.8), rgba(255,237,213,0.5))'
                      : 'linear-gradient(135deg, rgba(238,242,255,0.8), rgba(219,234,254,0.5))',
                  border:
                    roleKey === 'admin'
                      ? '1px solid rgba(239,68,68,0.12)'
                      : '1px solid rgba(109,91,255,0.12)',
                }}
              >
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <UserAvatar
                    initials={initials}
                    photo={user?.photo}
                    roleKey={roleKey}
                    size={44}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        color: '#0f172a',
                        lineHeight: 1.2,
                      }}
                    >
                      {user?.name || 'User'}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '0.72rem', color: '#64748b', mb: 0.5 }}
                    >
                      {user?.email || ''}
                    </Typography>
                    <RoleBadge roleKey={roleKey} />
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          {/* Drawer nav links */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
            <Stack spacing={0.4}>
              {navCfg.mobile.map((item) => {
                const active = isActive(item.to)
                return (
                  <Box
                    key={item.label}
                    component={RouterLink}
                    to={item.to}
                    onClick={closeMobile}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.3,
                      px: 1.8,
                      py: 1.45,
                      borderRadius: '18px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      color: active ? '#5b4cf0' : '#334155',
                      background: active
                        ? 'linear-gradient(135deg, rgba(109,91,255,0.09), rgba(94,135,255,0.07))'
                        : 'transparent',
                      border: active
                        ? '1px solid rgba(109,91,255,0.14)'
                        : '1px solid transparent',
                      transition: 'all .2s ease',
                      '&:hover': {
                        background: 'rgba(109,91,255,0.06)',
                        color: '#5b4cf0',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        background: active
                          ? 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)'
                          : 'rgba(241,245,249,1)',
                        color: active ? '#fff' : '#64748b',
                        boxShadow: active
                          ? '0 6px 16px rgba(109,91,255,0.25)'
                          : 'none',
                        transition: 'all .2s',
                      }}
                    >
                      {item.icon}
                    </Box>
                    {item.label}
                    {active && (
                      <ChevronRightRoundedIcon
                        sx={{ ml: 'auto', fontSize: 16, color: '#a5b4fc' }}
                      />
                    )}
                  </Box>
                )
              })}
            </Stack>

            {/* Upgrade CTA in drawer for free users only */}
            {roleKey === 'free' && (
              <Box
                component={RouterLink}
                to="/subscription"
                onClick={closeMobile}
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  p: 2,
                  borderRadius: '18px',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  boxShadow: '0 10px 28px rgba(249,115,22,0.25)',
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      color: '#fff',
                      lineHeight: 1.2,
                    }}
                  >
                    Upgrade to Premium
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.82)' }}
                  >
                    Unlock contacts, prices &amp; post listings — ₹299
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon
                  sx={{ ml: 'auto', color: '#fff', fontSize: 18 }}
                />
              </Box>
            )}
          </Box>

          {/* Logout at bottom */}
          {loggedIn && (
            <Box
              sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(226,232,240,0.7)' }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: '18px',
                  fontSize: '0.88rem',
                  borderColor: 'rgba(239,68,68,0.30)',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#ef4444',
                    background: 'rgba(239,68,68,0.05)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>
    </>
  )
}