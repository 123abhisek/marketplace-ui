// // // src/components/Navbar.jsx
// // import { useMemo, useState, useEffect } from 'react'
// // import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
// // import {
// //   Avatar,
// //   Box,
// //   Button,
// //   Chip,
// //   Container,
// //   Divider,
// //   Drawer,
// //   IconButton,
// //   ListItemIcon,
// //   Menu,
// //   MenuItem,
// //   Stack,
// //   Tooltip,
// //   Typography,
// // } from '@mui/material'

// // import MenuRoundedIcon               from '@mui/icons-material/MenuRounded'
// // import CloseRoundedIcon              from '@mui/icons-material/CloseRounded'
// // import HomeWorkRoundedIcon           from '@mui/icons-material/HomeWorkRounded'
// // import ExploreRoundedIcon            from '@mui/icons-material/ExploreRounded'
// // import SellRoundedIcon               from '@mui/icons-material/SellRounded'
// // import LoginRoundedIcon              from '@mui/icons-material/LoginRounded'
// // import PersonAddAlt1RoundedIcon      from '@mui/icons-material/PersonAddAlt1Rounded'
// // import DashboardRoundedIcon          from '@mui/icons-material/DashboardRounded'
// // import PersonRoundedIcon             from '@mui/icons-material/PersonRounded'
// // import ListAltRoundedIcon            from '@mui/icons-material/ListAltRounded'
// // import WorkspacePremiumRoundedIcon   from '@mui/icons-material/WorkspacePremiumRounded'
// // import LogoutRoundedIcon             from '@mui/icons-material/LogoutRounded'
// // import CurrencyRupeeRoundedIcon      from '@mui/icons-material/CurrencyRupeeRounded'
// // import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
// // import PeopleAltRoundedIcon          from '@mui/icons-material/PeopleAltRounded'
// // import BarChartRoundedIcon           from '@mui/icons-material/BarChartRounded'
// // import SettingsRoundedIcon           from '@mui/icons-material/SettingsRounded'
// // import VerifiedUserRoundedIcon       from '@mui/icons-material/VerifiedUserRounded'
// // import SpaceDashboardRoundedIcon     from '@mui/icons-material/SpaceDashboardRounded'
// // import ChevronRightRoundedIcon       from '@mui/icons-material/ChevronRightRounded'
// // import LocalOfferRoundedIcon         from '@mui/icons-material/LocalOfferRounded'

// // import { useAppState } from '../hooks/useAppState'

// // // ─── Nav config (function so JSX icons are created inside React tree) ─────────
// // function getNavConfig() {
// //   return {
// //     guest: {
// //       desktop: [
// //         { label: 'Browse',  to: '/browse' },
// //         { label: 'Pricing', to: '/subscription' },
// //       ],
// //       mobile: [
// //         { label: 'Browse',       to: '/browse',       icon: <ExploreRoundedIcon fontSize="small" /> },
// //         { label: 'Pricing',      to: '/subscription', icon: <CurrencyRupeeRoundedIcon fontSize="small" /> },
// //         { label: 'Post Listing', to: '/register',     icon: <SellRoundedIcon fontSize="small" /> },
// //         { label: 'Login',        to: '/login',        icon: <LoginRoundedIcon fontSize="small" /> },
// //         { label: 'Register',     to: '/register',     icon: <PersonAddAlt1RoundedIcon fontSize="small" /> },
// //       ],
// //       dropdown: [],
// //     },
// //     free: {
// //       desktop: [
// //         { label: 'Browse',    to: '/browse' },
// //         { label: 'Dashboard', to: '/dashboard' },
// //       ],
// //       mobile: [
// //         { label: 'Browse',       to: '/browse',                 icon: <ExploreRoundedIcon fontSize="small" /> },
// //         { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
// //         { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
// //         { label: 'Subscription', to: '/dashboard/subscription',icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
// //         { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
// //       ],
// //       dropdown: [
// //         { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
// //         { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
// //         { label: 'Subscription', to: '/dashboard/subscription',icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
// //         { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
// //       ],
// //     },
// //     premium: {
// //       desktop: [
// //         { label: 'Browse',    to: '/browse' },
// //         { label: 'Dashboard', to: '/dashboard' },
// //       ],
// //       mobile: [
// //         { label: 'Browse',       to: '/browse',                 icon: <ExploreRoundedIcon fontSize="small" /> },
// //         { label: 'Post Listing', to: '/dashboard/add-property', icon: <SellRoundedIcon fontSize="small" /> },
// //         { label: 'Dashboard',    to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
// //         { label: 'My Listings',  to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
// //         { label: 'Profile',      to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
// //       ],
// //       dropdown: [
// //         { label: 'Dashboard',   to: '/dashboard',              icon: <DashboardRoundedIcon fontSize="small" /> },
// //         { label: 'My Listings', to: '/dashboard/my-listings', icon: <ListAltRoundedIcon fontSize="small" /> },
// //         { label: 'Profile',     to: '/dashboard/profile',     icon: <PersonRoundedIcon fontSize="small" /> },
// //       ],
// //     },
// //     admin: {
// //       desktop: [
// //         { label: 'Overview', to: '/admin' },
// //         { label: 'Users',    to: '/admin/users' },
// //         { label: 'Listings', to: '/admin/listings' },
// //         { label: 'Reports',  to: '/admin/reports' },
// //       ],
// //       mobile: [
// //         { label: 'Overview', to: '/admin',          icon: <SpaceDashboardRoundedIcon fontSize="small" /> },
// //         { label: 'Users',    to: '/admin/users',    icon: <PeopleAltRoundedIcon fontSize="small" /> },
// //         { label: 'Listings', to: '/admin/listings', icon: <ListAltRoundedIcon fontSize="small" /> },
// //         { label: 'Reports',  to: '/admin/reports',  icon: <BarChartRoundedIcon fontSize="small" /> },
// //         { label: 'Settings', to: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
// //       ],
// //       dropdown: [
// //         { label: 'Admin Panel',  to: '/admin',          icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
// //         { label: 'Manage Users', to: '/admin/users',    icon: <PeopleAltRoundedIcon fontSize="small" /> },
// //         { label: 'Reports',      to: '/admin/reports',  icon: <BarChartRoundedIcon fontSize="small" /> },
// //         { label: 'Settings',     to: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
// //       ],
// //     },
// //   }
// // }

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // function resolveRole(user) {
// //   if (!user?.loggedIn)        return 'guest'
// //   if (user?.role === 'admin') return 'admin'
// //   if (user?.isPremium)        return 'premium'
// //   return 'free'
// // }

// // const ROLE_BADGE = {
// //   guest:   null,
// //   free:    {
// //     label: 'Free',
// //     bg: 'rgba(109,91,255,0.09)',
// //     color: '#5b4cf0',
// //     border: 'rgba(109,91,255,0.18)',
// //   },
// //   premium: {
// //     label: 'Premium Active',
// //     bg: 'rgba(16,185,129,0.09)',
// //     color: '#047857',
// //     border: 'rgba(16,185,129,0.20)',
// //   },
// //   admin: {
// //     label: 'Admin',
// //     bg: 'rgba(239,68,68,0.09)',
// //     color: '#b91c1c',
// //     border: 'rgba(239,68,68,0.20)',
// //   },
// // }

// // const AVATAR_GRADIENT = {
// //   guest:   'linear-gradient(135deg, #94a3b8, #64748b)',
// //   free:    'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
// //   premium: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
// //   admin:   'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
// // }

// // // ─── Small components ─────────────────────────────────────────────────────────
// // function RoleBadge({ roleKey }) {
// //   const cfg = ROLE_BADGE[roleKey]
// //   if (!cfg) return null

// //   const icon = roleKey === 'admin'
// //     ? <VerifiedUserRoundedIcon sx={{ fontSize: 13 }} />
// //     : <WorkspacePremiumRoundedIcon sx={{ fontSize: 13 }} />

// //   return (
// //     <Chip
// //       icon={icon}
// //       label={cfg.label}
// //       size="small"
// //       sx={{
// //         height: 28,
// //         pl: 0.3,
// //         borderRadius: '999px',
// //         fontWeight: 800,
// //         fontSize: '0.73rem',
// //         background: cfg.bg,
// //         color: cfg.color,
// //         border: `1px solid ${cfg.border}`,
// //         '& .MuiChip-icon': { color: cfg.color },
// //       }}
// //     />
// //   )
// // }

// // function UserAvatar({ initials, photo, roleKey, size = 38 }) {
// //   return (
// //     <Avatar
// //       src={photo || undefined}
// //       sx={{
// //         width: size,
// //         height: size,
// //         background: AVATAR_GRADIENT[roleKey] || AVATAR_GRADIENT.free,
// //         color: '#fff',
// //         fontWeight: 900,
// //         fontSize: size * 0.34,
// //         boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
// //       }}
// //     >
// //       {initials}
// //     </Avatar>
// //   )
// // }

// // function Logo({ compact = false }) {
// //   return (
// //     <Stack
// //       component={RouterLink}
// //       to="/"
// //       direction="row"
// //       alignItems="center"
// //       spacing={1.3}
// //       sx={{ flexShrink: 0, textDecoration: 'none' }}
// //     >
// //       <Box
// //         sx={{
// //           width: compact ? 38 : 44,
// //           height: compact ? 38 : 44,
// //           borderRadius: compact ? '14px' : '16px',
// //           display: 'grid',
// //           placeItems: 'center',
// //           background: 'linear-gradient(135deg, #c3f53c 0%, #7ee846 55%, #3dd68c 100%)',
// //           color: '#14532d',
// //           flexShrink: 0,
// //           boxShadow: '0 8px 22px rgba(125,232,70,0.30)',
// //         }}
// //       >
// //         <HomeWorkRoundedIcon sx={{ fontSize: compact ? 20 : 23 }} />
// //       </Box>
// //       <Box>
// //         <Typography
// //           sx={{
// //             fontWeight: 900,
// //             fontSize: compact ? '0.97rem' : '1.05rem',
// //             lineHeight: 1.1,
// //             color: '#0f172a',
// //             letterSpacing: '-0.02em',
// //           }}
// //         >
// //           Easydeal
// //         </Typography>
// //         {!compact && (
// //           <Typography
// //             sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', lineHeight: 1 }}
// //           >
// //             Property &amp; Vehicles
// //           </Typography>
// //         )}
// //       </Box>
// //     </Stack>
// //   )
// // }

// // function NavLink({ to, label, active }) {
// //   return (
// //     <Box
// //       component={RouterLink}
// //       to={to}
// //       sx={{
// //         position: 'relative',
// //         display: 'inline-flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         px: 1.8,
// //         py: 1,
// //         borderRadius: '14px',
// //         fontSize: '0.91rem',
// //         fontWeight: 700,
// //         textDecoration: 'none',
// //         color: active ? '#5b4cf0' : '#475569',
// //         background: active ? 'rgba(109,91,255,0.07)' : 'transparent',
// //         transition: 'all .20s ease',
// //         '&:hover': { color: '#0f172a', background: 'rgba(15,23,42,0.05)' },
// //       }}
// //     >
// //       {label}
// //       {active && (
// //         <Box
// //           sx={{
// //             position: 'absolute',
// //             bottom: 4,
// //             width: 4,
// //             height: 4,
// //             borderRadius: '50%',
// //             background: '#7c6cff',
// //           }}
// //         />
// //       )}
// //     </Box>
// //   )
// // }

// // function AnnouncementBar({ onClose }) {
// //   return (
// //     <Box
// //       sx={{
// //         background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 55%, #38c2ff 100%)',
// //         py: 0.9,
// //         px: 2,
// //         display: 'flex',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         gap: 1,
// //         position: 'relative',
// //       }}
// //     >
// //       <LocalOfferRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }} />
// //       <Typography
// //         sx={{
// //           fontSize: '0.78rem',
// //           fontWeight: 700,
// //           color: '#fff',
// //           letterSpacing: '0.01em',
// //         }}
// //       >
// //         🎉 Unlock full marketplace access for just ₹299 — one-time premium upgrade.
// //       </Typography>
// //       <Box
// //         component={RouterLink}
// //         to="/subscription"
// //         sx={{
// //           ml: 1,
// //           fontSize: '0.75rem',
// //           fontWeight: 800,
// //           color: '#fff',
// //           display: 'inline-flex',
// //           alignItems: 'center',
// //           gap: 0.2,
// //           textDecoration: 'none',
// //           background: 'rgba(255,255,255,0.18)',
// //           backdropFilter: 'blur(8px)',
// //           px: 1.2,
// //           py: 0.35,
// //           borderRadius: '999px',
// //           border: '1px solid rgba(255,255,255,0.25)',
// //           transition: 'background .2s',
// //           '&:hover': { background: 'rgba(255,255,255,0.28)' },
// //         }}
// //       >
// //         Upgrade now <ChevronRightRoundedIcon sx={{ fontSize: 13 }} />
// //       </Box>
// //       <IconButton
// //         size="small"
// //         onClick={onClose}
// //         sx={{
// //           position: 'absolute',
// //           right: 8,
// //           color: 'rgba(255,255,255,0.75)',
// //           p: 0.5,
// //           '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.12)' },
// //         }}
// //       >
// //         <CloseRoundedIcon sx={{ fontSize: 14 }} />
// //       </IconButton>
// //     </Box>
// //   )
// // }

// // // ─── Main Navbar ──────────────────────────────────────────────────────────────
// // export default function Navbar() {
// //   const [mobileOpen,       setMobileOpen]       = useState(false)
// //   const [anchorEl,         setAnchorEl]         = useState(null)
// //   const [scrolled,         setScrolled]         = useState(false)
// //   const [showAnnouncement, setShowAnnouncement] = useState(true)

// //   const location = useLocation()
// //   const navigate = useNavigate()
// //   const { user, logout } = useAppState()

// //   // Resolve role + nav config inside the component (safe for JSX icons)
// //   const roleKey       = resolveRole(user)
// //   const loggedIn      = roleKey !== 'guest'
// //   const menuOpen      = Boolean(anchorEl)
// //   const navCfg        = useMemo(() => getNavConfig()[roleKey], [roleKey])
// //   const dropdownItems = navCfg?.dropdown ?? []

// //   // Only show announcement bar for guest and free users (not premium or admin)
// //   const showBar =
// //     showAnnouncement && (roleKey === 'guest' || roleKey === 'free')

// //   useEffect(() => {
// //     const onScroll = () => setScrolled(window.scrollY > 18)
// //     window.addEventListener('scroll', onScroll, { passive: true })
// //     return () => window.removeEventListener('scroll', onScroll)
// //   }, [])

// //   // Close mobile drawer whenever route changes
// //   useEffect(() => {
// //     setMobileOpen(false)
// //   }, [location.pathname])

// //   const initials = useMemo(() => {
// //     const name  = user?.name?.trim() || 'U'
// //     const parts = name.split(' ')
// //     return parts.length > 1
// //       ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
// //       : `${parts[0][0]}`.toUpperCase()
// //   }, [user?.name])

// //   // FIX: correctly handles both /dashboard and /admin prefixes
// //   const isActive = (path) => {
// //     if (path === '/dashboard' || path === '/admin') {
// //       return location.pathname === path
// //     }
// //     return location.pathname.startsWith(path)
// //   }

// //   const closeMenu    = () => setAnchorEl(null)
// //   const closeMobile  = () => setMobileOpen(false)
// //   const handleLogout = () => {
// //     closeMenu()
// //     closeMobile()
// //     logout()
// //     navigate('/')
// //   }

// //   return (
// //     <>
// //       {showBar && (
// //         <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
// //       )}

// //       {/* Sticky wrapper — transparent so nothing leaks around the pill */}
// //       <Box
// //         sx={{
// //           position: 'sticky',
// //           top: 10,
// //           zIndex: 1200,
// //           px: { xs: 1.5, md: 2.5 },
// //           pt: 1.2,
// //           pb: 0.5,
// //           backgroundColor: 'transparent',
// //           pointerEvents: 'none',
// //         }}
// //       >
// //         <Container maxWidth="xl" disableGutters sx={{ pointerEvents: 'auto' }}>
// //           {/* Pill card */}
// //           <Box
// //             sx={{
// //               borderRadius: '999px',
// //               background: scrolled
// //                 ? 'rgba(255,255,255,0.98)'
// //                 : 'rgba(255,255,255,0.95)',
// //               backdropFilter: 'blur(22px)',
// //               WebkitBackdropFilter: 'blur(22px)',
// //               border: scrolled
// //                 ? '1px solid rgba(226,232,240,0.95)'
// //                 : '1px solid rgba(226,232,240,0.75)',
// //               boxShadow: scrolled
// //                 ? '0 22px 60px rgba(15,23,42,0.10), 0 4px 14px rgba(15,23,42,0.05)'
// //                 : '0 12px 40px rgba(15,23,42,0.07)',
// //               transition: 'all .3s cubic-bezier(.16,1,.3,1)',
// //               display: 'flex',
// //               alignItems: 'center',
// //               minHeight: { xs: 64, md: 70 },
// //               px: { xs: 1.8, sm: 2.4, md: 3.2 },
// //               gap: 2,
// //             }}
// //           >
// //             {/* Logo */}
// //             <Box sx={{ flex: '1 1 0', display: 'flex', alignItems: 'center' }}>
// //               <Logo />
// //             </Box>

// //             {/* Centre nav pill */}
// //             <Stack
// //               direction="row"
// //               spacing={0.4}
// //               alignItems="center"
// //               sx={{
// //                 flex: '0 0 auto',
// //                 display: { xs: 'none', lg: 'flex' },
// //                 background: 'rgba(248,250,252,0.8)',
// //                 border: '1px solid rgba(226,232,240,0.8)',
// //                 borderRadius: '999px',
// //                 px: 0.7,
// //                 py: 0.6,
// //               }}
// //             >
// //               {navCfg.desktop.map((item) => (
// //                 <NavLink
// //                   key={item.to}
// //                   to={item.to}
// //                   label={item.label}
// //                   active={isActive(item.to)}
// //                 />
// //               ))}
// //             </Stack>

// //             {/* Right actions */}
// //             <Stack
// //               direction="row"
// //               alignItems="center"
// //               sx={{
// //                 flex: '1 1 0',
// //                 justifyContent: 'flex-end',
// //                 display: { xs: 'none', md: 'flex' },
// //                 gap: 1,
// //               }}
// //             >
// //               {/* GUEST */}
// //               {roleKey === 'guest' && (
// //                 <>
// //                   <Button
// //                     component={RouterLink}
// //                     to="/register"
// //                     variant="text"
// //                     color="inherit"
// //                     startIcon={<SellRoundedIcon />}
// //                     sx={{
// //                       fontWeight: 700,
// //                       fontSize: '0.88rem',
// //                       color: '#475569',
// //                       borderRadius: '999px',
// //                       px: 2,
// //                       py: 1,
// //                       '&:hover': { background: 'rgba(15,23,42,0.05)', color: '#0f172a' },
// //                     }}
// //                   >
// //                     Post Listing
// //                   </Button>
// //                   <Button
// //                     component={RouterLink}
// //                     to="/login"
// //                     variant="outlined"
// //                     sx={{
// //                       fontWeight: 700,
// //                       fontSize: '0.88rem',
// //                       borderRadius: '999px',
// //                       px: 2.2,
// //                       py: 0.95,
// //                       borderColor: 'rgba(148,163,184,0.5)',
// //                       color: '#475569',
// //                       '&:hover': {
// //                         borderColor: '#7c6cff',
// //                         color: '#5b4cf0',
// //                         background: 'rgba(109,91,255,0.04)',
// //                       },
// //                     }}
// //                   >
// //                     Login
// //                   </Button>
// //                   <Button
// //                     component={RouterLink}
// //                     to="/register"
// //                     variant="contained"
// //                     sx={{
// //                       fontWeight: 800,
// //                       fontSize: '0.88rem',
// //                       borderRadius: '999px',
// //                       px: 2.4,
// //                       py: 1,
// //                       background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
// //                       boxShadow: '0 10px 28px rgba(109,91,255,0.30)',
// //                       '&:hover': {
// //                         background: 'linear-gradient(135deg, #6b59f5 0%, #4c75ff 100%)',
// //                         boxShadow: '0 14px 36px rgba(109,91,255,0.38)',
// //                       },
// //                     }}
// //                   >
// //                     Register
// //                   </Button>
// //                 </>
// //               )}

// //               {/* FREE or PREMIUM */}
// //               {(roleKey === 'free' || roleKey === 'premium') && (
// //                 <>
// //                   <RoleBadge roleKey={roleKey} />

// //                   {roleKey === 'premium' && (
// //                     <Button
// //                       component={RouterLink}
// //                       to="/dashboard/add-property"
// //                       variant="outlined"
// //                       startIcon={<SellRoundedIcon />}
// //                       sx={{
// //                         fontWeight: 700,
// //                         fontSize: '0.88rem',
// //                         borderRadius: '999px',
// //                         px: 2,
// //                         py: 0.95,
// //                         borderColor: 'rgba(148,163,184,0.45)',
// //                         color: '#475569',
// //                         '&:hover': {
// //                           borderColor: '#7c6cff',
// //                           color: '#5b4cf0',
// //                           background: 'rgba(109,91,255,0.04)',
// //                         },
// //                       }}
// //                     >
// //                       Post Listing
// //                     </Button>
// //                   )}

// //                   {roleKey === 'free' && (
// //                     <Button
// //                       component={RouterLink}
// //                       to="/subscription"
// //                       variant="contained"
// //                       startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />}
// //                       sx={{
// //                         fontWeight: 800,
// //                         fontSize: '0.85rem',
// //                         borderRadius: '999px',
// //                         px: 2.2,
// //                         py: 0.95,
// //                         background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
// //                         boxShadow: '0 10px 28px rgba(249,115,22,0.28)',
// //                         '&:hover': {
// //                           background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
// //                           boxShadow: '0 14px 36px rgba(249,115,22,0.36)',
// //                         },
// //                       }}
// //                     >
// //                       Upgrade ₹299
// //                     </Button>
// //                   )}

// //                   <Tooltip title="Account menu" arrow>
// //                     <IconButton
// //                       onClick={(e) => setAnchorEl(e.currentTarget)}
// //                       sx={{
// //                         p: 0.45,
// //                         border: '2px solid rgba(226,232,240,0.9)',
// //                         background: 'rgba(255,255,255,0.9)',
// //                         '&:hover': {
// //                           borderColor: '#7c6cff',
// //                           boxShadow: '0 0 0 3px rgba(109,91,255,0.12)',
// //                         },
// //                       }}
// //                     >
// //                       <UserAvatar
// //                         initials={initials}
// //                         photo={user?.photo}
// //                         roleKey={roleKey}
// //                         size={36}
// //                       />
// //                     </IconButton>
// //                   </Tooltip>
// //                 </>
// //               )}

// //               {/* ADMIN */}
// //               {roleKey === 'admin' && (
// //                 <>
// //                   <RoleBadge roleKey="admin" />
// //                   <Button
// //                     component={RouterLink}
// //                     to="/admin"
// //                     variant="outlined"
// //                     startIcon={<AdminPanelSettingsRoundedIcon />}
// //                     sx={{
// //                       fontWeight: 700,
// //                       fontSize: '0.88rem',
// //                       borderRadius: '999px',
// //                       px: 2,
// //                       py: 0.95,
// //                       borderColor: 'rgba(239,68,68,0.35)',
// //                       color: '#b91c1c',
// //                       '&:hover': {
// //                         borderColor: '#ef4444',
// //                         background: 'rgba(239,68,68,0.05)',
// //                       },
// //                     }}
// //                   >
// //                     Admin Panel
// //                   </Button>
// //                   <Tooltip title="Admin account" arrow>
// //                     <IconButton
// //                       onClick={(e) => setAnchorEl(e.currentTarget)}
// //                       sx={{
// //                         p: 0.45,
// //                         border: '2px solid rgba(239,68,68,0.25)',
// //                         background: 'rgba(255,255,255,0.9)',
// //                         '&:hover': {
// //                           borderColor: '#ef4444',
// //                           boxShadow: '0 0 0 3px rgba(239,68,68,0.10)',
// //                         },
// //                       }}
// //                     >
// //                       <UserAvatar
// //                         initials={initials}
// //                         photo={user?.photo}
// //                         roleKey="admin"
// //                         size={36}
// //                       />
// //                     </IconButton>
// //                   </Tooltip>
// //                 </>
// //               )}
// //             </Stack>

// //             {/* Hamburger */}
// //             <IconButton
// //               onClick={() => setMobileOpen(true)}
// //               sx={{
// //                 display: { xs: 'inline-flex', md: 'none' },
// //                 border: '1.5px solid rgba(226,232,240,0.9)',
// //                 background: 'rgba(255,255,255,0.9)',
// //                 p: 1,
// //                 borderRadius: '14px',
// //                 '&:hover': { borderColor: '#7c6cff' },
// //               }}
// //             >
// //               <MenuRoundedIcon sx={{ fontSize: 20 }} />
// //             </IconButton>
// //           </Box>
// //         </Container>
// //       </Box>

// //       {/* ── Avatar dropdown ──────────────────────────────────────────────────── */}
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={menuOpen}
// //         onClose={closeMenu}
// //         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
// //         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
// //         PaperProps={{
// //           elevation: 0,
// //           sx: {
// //             mt: 1.6,
// //             minWidth: 248,
// //             borderRadius: '22px',
// //             boxShadow:
// //               '0 24px 60px rgba(15,23,42,0.13), 0 4px 16px rgba(15,23,42,0.06)',
// //             border: '1px solid rgba(226,232,240,0.85)',
// //             overflow: 'visible',
// //             '&::before': {
// //               content: '""',
// //               position: 'absolute',
// //               top: -6,
// //               right: 20,
// //               width: 12,
// //               height: 12,
// //               background: roleKey === 'admin' ? '#fef2f2' : '#eef2ff',
// //               border: '1px solid rgba(226,232,240,0.8)',
// //               transform: 'rotate(45deg)',
// //               borderBottom: 'none',
// //               borderRight: 'none',
// //               zIndex: 1,
// //             },
// //           },
// //         }}
// //       >
// //         <Box
// //           sx={{
// //             px: 2.4,
// //             py: 2,
// //             background:
// //               roleKey === 'admin'
// //                 ? 'linear-gradient(135deg, rgba(254,242,242,0.9), rgba(255,237,213,0.6))'
// //                 : 'linear-gradient(135deg, rgba(238,242,255,0.9), rgba(219,234,254,0.6))',
// //             borderRadius: '22px 22px 0 0',
// //           }}
// //         >
// //           <Stack direction="row" spacing={1.5} alignItems="center">
// //             <UserAvatar
// //               initials={initials}
// //               photo={user?.photo}
// //               roleKey={roleKey}
// //               size={46}
// //             />
// //             <Box>
// //               <Typography
// //                 sx={{
// //                   fontWeight: 900,
// //                   fontSize: '0.97rem',
// //                   lineHeight: 1.2,
// //                   color: '#0f172a',
// //                 }}
// //               >
// //                 {user?.name || 'User'}
// //               </Typography>
// //               <Typography
// //                 sx={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, mb: 0.6 }}
// //               >
// //                 {user?.email || ''}
// //               </Typography>
// //               <RoleBadge roleKey={roleKey} />
// //             </Box>
// //           </Stack>
// //         </Box>

// //         <Divider />

// //         {dropdownItems.map((item) => (
// //           <MenuItem
// //             key={item.label}
// //             component={RouterLink}
// //             to={item.to}
// //             onClick={closeMenu}
// //             sx={{
// //               py: 1.4,
// //               px: 2.2,
// //               fontWeight: 600,
// //               fontSize: '0.88rem',
// //               color: '#334155',
// //               gap: 0.5,
// //               '&:hover': { background: 'rgba(109,91,255,0.05)', color: '#5b4cf0' },
// //             }}
// //           >
// //             <ListItemIcon
// //               sx={{ minWidth: 36, '& svg': { fontSize: 18, color: '#94a3b8' } }}
// //             >
// //               {item.icon}
// //             </ListItemIcon>
// //             {item.label}
// //             <ChevronRightRoundedIcon
// //               sx={{ ml: 'auto', fontSize: 16, color: '#cbd5e1' }}
// //             />
// //           </MenuItem>
// //         ))}

// //         <Divider />

// //         <MenuItem
// //           onClick={handleLogout}
// //           sx={{
// //             py: 1.4,
// //             px: 2.2,
// //             fontWeight: 700,
// //             fontSize: '0.88rem',
// //             color: '#ef4444',
// //             gap: 0.5,
// //             borderRadius: '0 0 22px 22px',
// //             '&:hover': { background: 'rgba(239,68,68,0.05)' },
// //           }}
// //         >
// //           <ListItemIcon
// //             sx={{ minWidth: 36, '& svg': { fontSize: 18, color: '#ef4444' } }}
// //           >
// //             <LogoutRoundedIcon />
// //           </ListItemIcon>
// //           Logout
// //         </MenuItem>
// //       </Menu>

// //       {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
// //       <Drawer
// //         anchor="right"
// //         open={mobileOpen}
// //         onClose={closeMobile}
// //         PaperProps={{
// //           sx: {
// //             width: 330,
// //             borderRadius: '28px 0 0 28px',
// //             background: 'rgba(255,255,255,0.98)',
// //             backdropFilter: 'blur(20px)',
// //             border: 'none',
// //             boxShadow: '-20px 0 60px rgba(15,23,42,0.12)',
// //           },
// //         }}
// //       >
// //         <Stack sx={{ height: '100%' }}>
// //           {/* Drawer header */}
// //           <Box
// //             sx={{
// //               px: 2.5,
// //               pt: 2.5,
// //               pb: 2,
// //               borderBottom: '1px solid rgba(226,232,240,0.7)',
// //             }}
// //           >
// //             <Stack
// //               direction="row"
// //               alignItems="center"
// //               justifyContent="space-between"
// //               mb={2}
// //             >
// //               <Logo compact />
// //               <IconButton
// //                 onClick={closeMobile}
// //                 sx={{
// //                   border: '1.5px solid rgba(226,232,240,0.9)',
// //                   borderRadius: '14px',
// //                   p: 0.8,
// //                   '&:hover': { borderColor: '#ef4444', color: '#ef4444' },
// //                 }}
// //               >
// //                 <CloseRoundedIcon sx={{ fontSize: 18 }} />
// //               </IconButton>
// //             </Stack>

// //             {loggedIn && (
// //               <Box
// //                 sx={{
// //                   p: 1.8,
// //                   borderRadius: '18px',
// //                   background:
// //                     roleKey === 'admin'
// //                       ? 'linear-gradient(135deg, rgba(254,242,242,0.8), rgba(255,237,213,0.5))'
// //                       : 'linear-gradient(135deg, rgba(238,242,255,0.8), rgba(219,234,254,0.5))',
// //                   border:
// //                     roleKey === 'admin'
// //                       ? '1px solid rgba(239,68,68,0.12)'
// //                       : '1px solid rgba(109,91,255,0.12)',
// //                 }}
// //               >
// //                 <Stack direction="row" spacing={1.4} alignItems="center">
// //                   <UserAvatar
// //                     initials={initials}
// //                     photo={user?.photo}
// //                     roleKey={roleKey}
// //                     size={44}
// //                   />
// //                   <Box>
// //                     <Typography
// //                       sx={{
// //                         fontWeight: 900,
// //                         fontSize: '0.95rem',
// //                         color: '#0f172a',
// //                         lineHeight: 1.2,
// //                       }}
// //                     >
// //                       {user?.name || 'User'}
// //                     </Typography>
// //                     <Typography
// //                       sx={{ fontSize: '0.72rem', color: '#64748b', mb: 0.5 }}
// //                     >
// //                       {user?.email || ''}
// //                     </Typography>
// //                     <RoleBadge roleKey={roleKey} />
// //                   </Box>
// //                 </Stack>
// //               </Box>
// //             )}
// //           </Box>

// //           {/* Drawer nav links */}
// //           <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
// //             <Stack spacing={0.4}>
// //               {navCfg.mobile.map((item) => {
// //                 const active = isActive(item.to)
// //                 return (
// //                   <Box
// //                     key={item.label}
// //                     component={RouterLink}
// //                     to={item.to}
// //                     onClick={closeMobile}
// //                     sx={{
// //                       display: 'flex',
// //                       alignItems: 'center',
// //                       gap: 1.3,
// //                       px: 1.8,
// //                       py: 1.45,
// //                       borderRadius: '18px',
// //                       fontWeight: 700,
// //                       fontSize: '0.92rem',
// //                       textDecoration: 'none',
// //                       color: active ? '#5b4cf0' : '#334155',
// //                       background: active
// //                         ? 'linear-gradient(135deg, rgba(109,91,255,0.09), rgba(94,135,255,0.07))'
// //                         : 'transparent',
// //                       border: active
// //                         ? '1px solid rgba(109,91,255,0.14)'
// //                         : '1px solid transparent',
// //                       transition: 'all .2s ease',
// //                       '&:hover': {
// //                         background: 'rgba(109,91,255,0.06)',
// //                         color: '#5b4cf0',
// //                       },
// //                     }}
// //                   >
// //                     <Box
// //                       sx={{
// //                         width: 36,
// //                         height: 36,
// //                         borderRadius: '12px',
// //                         display: 'grid',
// //                         placeItems: 'center',
// //                         flexShrink: 0,
// //                         background: active
// //                           ? 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)'
// //                           : 'rgba(241,245,249,1)',
// //                         color: active ? '#fff' : '#64748b',
// //                         boxShadow: active
// //                           ? '0 6px 16px rgba(109,91,255,0.25)'
// //                           : 'none',
// //                         transition: 'all .2s',
// //                       }}
// //                     >
// //                       {item.icon}
// //                     </Box>
// //                     {item.label}
// //                     {active && (
// //                       <ChevronRightRoundedIcon
// //                         sx={{ ml: 'auto', fontSize: 16, color: '#a5b4fc' }}
// //                       />
// //                     )}
// //                   </Box>
// //                 )
// //               })}
// //             </Stack>

// //             {/* Upgrade CTA in drawer for free users only */}
// //             {roleKey === 'free' && (
// //               <Box
// //                 component={RouterLink}
// //                 to="/subscription"
// //                 onClick={closeMobile}
// //                 sx={{
// //                   mt: 2,
// //                   display: 'flex',
// //                   alignItems: 'center',
// //                   gap: 1.2,
// //                   p: 2,
// //                   borderRadius: '18px',
// //                   textDecoration: 'none',
// //                   background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
// //                   boxShadow: '0 10px 28px rgba(249,115,22,0.25)',
// //                 }}
// //               >
// //                 <WorkspacePremiumRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
// //                 <Box>
// //                   <Typography
// //                     sx={{
// //                       fontWeight: 900,
// //                       fontSize: '0.88rem',
// //                       color: '#fff',
// //                       lineHeight: 1.2,
// //                     }}
// //                   >
// //                     Upgrade to Premium
// //                   </Typography>
// //                   <Typography
// //                     sx={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.82)' }}
// //                   >
// //                     Unlock contacts, prices &amp; post listings — ₹299
// //                   </Typography>
// //                 </Box>
// //                 <ChevronRightRoundedIcon
// //                   sx={{ ml: 'auto', color: '#fff', fontSize: 18 }}
// //                 />
// //               </Box>
// //             )}
// //           </Box>

// //           {/* Logout at bottom */}
// //           {loggedIn && (
// //             <Box
// //               sx={{ px: 2.5, py: 2, borderTop: '1px solid rgba(226,232,240,0.7)' }}
// //             >
// //               <Button
// //                 fullWidth
// //                 variant="outlined"
// //                 startIcon={<LogoutRoundedIcon />}
// //                 onClick={handleLogout}
// //                 sx={{
// //                   py: 1.5,
// //                   fontWeight: 700,
// //                   borderRadius: '18px',
// //                   fontSize: '0.88rem',
// //                   borderColor: 'rgba(239,68,68,0.30)',
// //                   color: '#ef4444',
// //                   '&:hover': {
// //                     borderColor: '#ef4444',
// //                     background: 'rgba(239,68,68,0.05)',
// //                   },
// //                 }}
// //               >
// //                 Logout
// //               </Button>
// //             </Box>
// //           )}
// //         </Stack>
// //       </Drawer>
// //     </>
// //   )
// // }

// // src/components/Navbar.jsx
// import { useMemo, useState } from "react";
// import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Box,
//   Button,
//   Chip,
//   Container,
//   Divider,
//   Drawer,
//   IconButton,
//   Stack,
//   Toolbar,
//   Typography,
// } from "@mui/material";

// import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
// import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
// import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
// import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
// import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

// import { useAppState } from "../hooks/useAppState";

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAppState();

//   const isLoggedIn = Boolean(user?.loggedIn);
//   const isPremium = Boolean(user?.isPremium);

//   const navItems = useMemo(() => {
//     const common = [
//       { label: "Home", to: "/" },
//       { label: "Premium", to: "/subscription" },
//     ];

//     if (isLoggedIn) {
//       return [...common, { label: "Dashboard", to: "/dashboard" }];
//     }

//     return common;
//   }, [isLoggedIn]);

//   const isActive = (to) => {
//     if (to === "/") return location.pathname === "/";
//     if (to === "/dashboard") return location.pathname.startsWith("/dashboard");
//     return location.pathname === to;
//   };

//   const closeDrawer = () => setMobileOpen(false);

//   const handleLogout = () => {
//     closeDrawer();
//     logout();
//     navigate("/");
//   };

//   const NavLinkButton = ({ item, mobile = false }) => (
//     <Button
//       component={RouterLink}
//       to={item.to}
//       onClick={closeDrawer}
//       color="inherit"
//       variant={isActive(item.to) ? "contained" : "text"}
//       size={mobile ? "large" : "medium"}
//       sx={{
//         justifyContent: mobile ? "flex-start" : "center",
//         px: mobile ? 2 : 1.5,
//         py: mobile ? 1.2 : 0.9,
//         borderRadius: "14px",
//         textTransform: "none",
//         fontWeight: 700,
//         fontSize: mobile ? "0.98rem" : "0.9rem",
//         color: isActive(item.to) ? "#ffffff" : "#475569",
//         bgcolor: isActive(item.to) ? "#0f766e" : "transparent",
//         "&:hover": {
//           bgcolor: isActive(item.to) ? "#0d665d" : "rgba(15, 118, 110, 0.08)",
//           color: isActive(item.to) ? "#ffffff" : "#0f766e",
//         },
//       }}
//       fullWidth={mobile}
//     >
//       {item.label}
//     </Button>
//   );

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         elevation={0}
//         color="transparent"
//         sx={{
//           top: 0,
//           backdropFilter: "blur(16px)",
//           background: "rgba(255,255,255,0.82)",
//           borderBottom: "1px solid rgba(226,232,240,0.8)",
//         }}
//       >
//         <Container maxWidth="xl">
//           <Toolbar
//             disableGutters
//             sx={{
//               minHeight: 78,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             <Box
//               component={RouterLink}
//               to="/"
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.4,
//                 textDecoration: "none",
//                 color: "inherit",
//                 minWidth: 0,
//               }}
//             >
//               <Box
//                 component="img"
//                 src="/logo.png"
//                 alt="Easydeal Logo"
//                 sx={{
//                   height: 46,
//                   width: "auto",
//                   objectFit: "contain",
//                 }}
//               />
//             </Box>

//             <Stack
//               direction="row"
//               spacing={0.8}
//               alignItems="center"
//               sx={{ display: { xs: "none", md: "flex" } }}
//             >
//               {navItems.map((item) => (
//                 <NavLinkButton key={item.to} item={item} />
//               ))}
//             </Stack>

//             <Stack
//               direction="row"
//               spacing={1.2}
//               alignItems="center"
//               sx={{ display: { xs: "none", md: "flex" } }}
//             >
//               <Chip
//                 size="small"
//                 icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />}
//                 label={isPremium ? "Premium" : "Free User"}
//                 sx={{
//                   height: 32,
//                   borderRadius: "999px",
//                   fontWeight: 800,
//                   bgcolor: isPremium
//                     ? "rgba(34,197,94,0.12)"
//                     : "rgba(148,163,184,0.12)",
//                   color: isPremium ? "#15803d" : "#475569",
//                   border: isPremium
//                     ? "1px solid rgba(34,197,94,0.22)"
//                     : "1px solid rgba(148,163,184,0.25)",
//                 }}
//               />

//               {!isLoggedIn ? (
//                 <>
//                   <Button
//                     component={RouterLink}
//                     to="/login"
//                     startIcon={<LoginRoundedIcon />}
//                     color="inherit"
//                     sx={{
//                       borderRadius: "14px",
//                       px: 2,
//                       py: 1,
//                       textTransform: "none",
//                       fontWeight: 700,
//                       color: "#475569",
//                     }}
//                   >
//                     Login
//                   </Button>

//                   <Button
//                     component={RouterLink}
//                     to="/register"
//                     variant="contained"
//                     startIcon={<PersonAddRoundedIcon />}
//                     sx={{
//                       borderRadius: "14px",
//                       px: 2.2,
//                       py: 1.05,
//                       textTransform: "none",
//                       fontWeight: 800,
//                       bgcolor: "#0f172a",
//                       boxShadow: "0 10px 24px rgba(15,23,42,0.18)",
//                       "&:hover": {
//                         bgcolor: "#1e293b",
//                         boxShadow: "0 14px 30px rgba(15,23,42,0.24)",
//                       },
//                     }}
//                   >
//                     Register
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     component={RouterLink}
//                     to="/dashboard"
//                     variant="outlined"
//                     startIcon={<DashboardRoundedIcon />}
//                     sx={{
//                       borderRadius: "14px",
//                       px: 2,
//                       py: 1,
//                       textTransform: "none",
//                       fontWeight: 800,
//                       borderColor: "rgba(15,118,110,0.25)",
//                       color: "#0f766e",
//                       "&:hover": {
//                         borderColor: "#0f766e",
//                         bgcolor: "rgba(15,118,110,0.04)",
//                       },
//                     }}
//                   >
//                     Dashboard
//                   </Button>

//                   <Button
//                     onClick={handleLogout}
//                     startIcon={<LogoutRoundedIcon />}
//                     color="inherit"
//                     sx={{
//                       borderRadius: "14px",
//                       px: 2,
//                       py: 1,
//                       textTransform: "none",
//                       fontWeight: 700,
//                       color: "#475569",
//                     }}
//                   >
//                     Logout
//                   </Button>
//                 </>
//               )}
//             </Stack>

//             <IconButton
//               onClick={() => setMobileOpen(true)}
//               sx={{
//                 display: { xs: "inline-flex", md: "none" },
//                 border: "1px solid rgba(226,232,240,0.9)",
//                 borderRadius: "14px",
//                 color: "#0f172a",
//               }}
//             >
//               <MenuRoundedIcon />
//             </IconButton>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={closeDrawer}
//         PaperProps={{
//           sx: {
//             width: 320,
//             p: 2,
//             background: "#ffffff",
//           },
//         }}
//       >
//         <Stack spacing={2}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 1,
//               pt: 0.5,
//             }}
//           >
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
//               <Box
//                 sx={{
//                   width: 42,
//                   height: 42,
//                   borderRadius: "14px",
//                   display: "grid",
//                   placeItems: "center",
//                   color: "#ffffff",
//                   background: "linear-gradient(135deg, #0f766e, #14b8a6)",
//                 }}
//               >
//                 <ApartmentRoundedIcon sx={{ fontSize: 22 }} />
//               </Box>

//               <Box>
//                 <Typography
//                   sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}
//                 >
//                   Easydeal
//                 </Typography>
//                 <Typography
//                   sx={{ fontSize: "0.72rem", color: "#64748b", mt: 0.3 }}
//                 >
//                   Navigation
//                 </Typography>
//               </Box>
//             </Box>

//             <Chip
//               size="small"
//               label={isPremium ? "Premium" : "Free"}
//               sx={{
//                 fontWeight: 800,
//                 bgcolor: isPremium
//                   ? "rgba(34,197,94,0.12)"
//                   : "rgba(148,163,184,0.12)",
//                 color: isPremium ? "#15803d" : "#475569",
//               }}
//             />
//           </Box>

//           <Divider />

//           <Stack spacing={1}>
//             {navItems.map((item) => (
//               <NavLinkButton key={item.to} item={item} mobile />
//             ))}
//           </Stack>

//           <Divider />

//           {!isLoggedIn ? (
//             <Stack spacing={1.2}>
//               <Button
//                 component={RouterLink}
//                 to="/login"
//                 onClick={closeDrawer}
//                 startIcon={<LoginRoundedIcon />}
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderRadius: "14px",
//                   py: 1.2,
//                   textTransform: "none",
//                   fontWeight: 800,
//                 }}
//               >
//                 Login
//               </Button>

//               <Button
//                 component={RouterLink}
//                 to="/register"
//                 onClick={closeDrawer}
//                 startIcon={<PersonAddRoundedIcon />}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   borderRadius: "14px",
//                   py: 1.25,
//                   textTransform: "none",
//                   fontWeight: 800,
//                   bgcolor: "#0f172a",
//                   "&:hover": { bgcolor: "#1e293b" },
//                 }}
//               >
//                 Create Account
//               </Button>
//             </Stack>
//           ) : (
//             <Stack spacing={1.2}>
//               <Button
//                 component={RouterLink}
//                 to="/dashboard"
//                 onClick={closeDrawer}
//                 startIcon={<DashboardRoundedIcon />}
//                 variant="contained"
//                 fullWidth
//                 sx={{
//                   borderRadius: "14px",
//                   py: 1.25,
//                   textTransform: "none",
//                   fontWeight: 800,
//                   bgcolor: "#0f766e",
//                   "&:hover": { bgcolor: "#0d665d" },
//                 }}
//               >
//                 Open Dashboard
//               </Button>

//               <Button
//                 onClick={handleLogout}
//                 startIcon={<LogoutRoundedIcon />}
//                 variant="outlined"
//                 fullWidth
//                 sx={{
//                   borderRadius: "14px",
//                   py: 1.2,
//                   textTransform: "none",
//                   fontWeight: 800,
//                 }}
//               >
//                 Logout
//               </Button>
//             </Stack>
//           )}
//         </Stack>
//       </Drawer>
//     </>
//   );
// }

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

function getNavConfig() {
  return {
    guest: {
      desktop: [
        { label: "Browse", to: "/browse" },
        { label: "Pricing", to: "/subscription" },
      ],
      mobile: [
        {
          label: "Browse",
          to: "/browse",
          icon: <ExploreRoundedIcon fontSize="small" />,
        },
        {
          label: "Pricing",
          to: "/subscription",
          icon: <CurrencyRupeeRoundedIcon fontSize="small" />,
        },
        {
          label: "Post Listing",
          to: "/register",
          icon: <SellRoundedIcon fontSize="small" />,
        },
        {
          label: "Login",
          to: "/login",
          icon: <LoginRoundedIcon fontSize="small" />,
        },
        {
          label: "Register",
          to: "/register",
          icon: <PersonAddAlt1RoundedIcon fontSize="small" />,
        },
      ],
      dropdown: [],
    },
    free: {
      desktop: [
        { label: "Browse", to: "/browse" },
        { label: "Dashboard", to: "/dashboard" },
      ],
      mobile: [
        {
          label: "Browse",
          to: "/browse",
          icon: <ExploreRoundedIcon fontSize="small" />,
        },
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <DashboardRoundedIcon fontSize="small" />,
        },
        {
          label: "My Listings",
          to: "/dashboard/my-listings",
          icon: <ListAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Subscription",
          to: "/dashboard/subscription",
          icon: <WorkspacePremiumRoundedIcon fontSize="small" />,
        },
        {
          label: "Profile",
          to: "/dashboard/profile",
          icon: <PersonRoundedIcon fontSize="small" />,
        },
      ],
      dropdown: [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <DashboardRoundedIcon fontSize="small" />,
        },
        {
          label: "My Listings",
          to: "/dashboard/my-listings",
          icon: <ListAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Subscription",
          to: "/dashboard/subscription",
          icon: <WorkspacePremiumRoundedIcon fontSize="small" />,
        },
        {
          label: "Profile",
          to: "/dashboard/profile",
          icon: <PersonRoundedIcon fontSize="small" />,
        },
      ],
    },
    premium: {
      desktop: [
        { label: "Browse", to: "/browse" },
        { label: "Dashboard", to: "/dashboard" },
      ],
      mobile: [
        {
          label: "Browse",
          to: "/browse",
          icon: <ExploreRoundedIcon fontSize="small" />,
        },
        {
          label: "Post Listing",
          to: "/dashboard/add-property",
          icon: <SellRoundedIcon fontSize="small" />,
        },
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <DashboardRoundedIcon fontSize="small" />,
        },
        {
          label: "My Listings",
          to: "/dashboard/my-listings",
          icon: <ListAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Profile",
          to: "/dashboard/profile",
          icon: <PersonRoundedIcon fontSize="small" />,
        },
      ],
      dropdown: [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: <DashboardRoundedIcon fontSize="small" />,
        },
        {
          label: "My Listings",
          to: "/dashboard/my-listings",
          icon: <ListAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Profile",
          to: "/dashboard/profile",
          icon: <PersonRoundedIcon fontSize="small" />,
        },
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
        {
          label: "Overview",
          to: "/admin",
          icon: <SpaceDashboardRoundedIcon fontSize="small" />,
        },
        {
          label: "Users",
          to: "/admin/users",
          icon: <PeopleAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Listings",
          to: "/admin/listings",
          icon: <ListAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Reports",
          to: "/admin/reports",
          icon: <BarChartRoundedIcon fontSize="small" />,
        },
        {
          label: "Settings",
          to: "/admin/settings",
          icon: <SettingsRoundedIcon fontSize="small" />,
        },
      ],
      dropdown: [
        {
          label: "Admin Panel",
          to: "/admin",
          icon: <AdminPanelSettingsRoundedIcon fontSize="small" />,
        },
        {
          label: "Manage Users",
          to: "/admin/users",
          icon: <PeopleAltRoundedIcon fontSize="small" />,
        },
        {
          label: "Reports",
          to: "/admin/reports",
          icon: <BarChartRoundedIcon fontSize="small" />,
        },
        {
          label: "Settings",
          to: "/admin/settings",
          icon: <SettingsRoundedIcon fontSize="small" />,
        },
      ],
    },
  };
}

function resolveRole(user) {
  if (!user?.loggedIn) return "guest";
  if (user?.role === "admin") return "admin";
  if (user?.isPremium) return "premium";
  return "free";
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
  guest: { bg: "#94a3b8", color: "#ffffff" },
  free: { bg: "#5b4cf0", color: "#ffffff" },
  premium: { bg: "#d97706", color: "#ffffff" },
  admin: { bg: "#dc2626", color: "#ffffff" },
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
        "& .MuiChip-icon": {
          color: cfg.color,
        },
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

function Logo({ compact = false }) {
  return (
    <Stack
      component={RouterLink}
      to="/"
      direction="row"
      alignItems="center"
      spacing={1.3}
      sx={{
        textDecoration: "none",
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      {/* <Box
        sx={{
          width: compact ? 40 : 44,
          height: compact ? 40 : 44,
          borderRadius: compact ? '14px' : '16px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: COLORS.primary,
          color: '#ffffff',
          boxShadow: '0 12px 24px rgba(15,118,110,0.24)',
          flexShrink: 0,
        }}
      >
        <HomeWorkRoundedIcon sx={{ fontSize: compact ? 20 : 22 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: compact ? '0.98rem' : '1.06rem',
            fontWeight: 900,
            lineHeight: 1.05,
            color: COLORS.text,
            letterSpacing: '-0.02em',
          }}
        >
          Easydeal
        </Typography>

        {!compact && (
          <Typography
            sx={{
              fontSize: '0.68rem',
              lineHeight: 1.1,
              color: COLORS.muted,
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            Property &amp; Vehicles
          </Typography>
        )}
      </Box> */}

      <Box
        component="img"
        src="/logo.png"
        alt="Easydeal Logo"
        sx={{
          height: 46,
          width: "auto",
          objectFit: "contain",
        }}
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
        "&:hover": {
          color: COLORS.text,
          backgroundColor: "rgba(15,23,42,0.05)",
        },
      }}
    >
      {label}
      {active && (
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            width: 4,
            height: 4,
            borderRadius: "50%",
            bgcolor: COLORS.primary,
          }}
        />
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
        border: active
          ? `1px solid rgba(15,118,110,0.14)`
          : "1px solid transparent",
        transition: "all .2s ease",
        "&:hover": {
          backgroundColor: "rgba(15,118,110,0.06)",
          color: COLORS.primary,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          bgcolor: active ? COLORS.primary : "#f1f5f9",
          color: active ? "#ffffff" : COLORS.muted,
          boxShadow: active ? "0 8px 18px rgba(15,118,110,0.18)" : "none",
        }}
      >
        {item.icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>{item.label}</Box>

      {active && (
        <ChevronRightRoundedIcon
          sx={{ ml: "auto", fontSize: 18, color: COLORS.primary }}
        />
      )}
    </Box>
  );
}

function AnnouncementBar({ onClose }) {
  return (
    <Box
      sx={{
        backgroundColor: COLORS.primary,
        color: "#ffffff",
        px: { xs: 2, md: 3 },
        py: 0.9,
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ position: "relative", minHeight: 28 }}
        >
          <LocalOfferRoundedIcon
            sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }}
          />

          <Typography
            sx={{
              fontSize: { xs: "0.74rem", sm: "0.78rem" },
              fontWeight: 800,
              textAlign: "center",
              pr: { xs: 4, sm: 0 },
            }}
          >
            Unlock full marketplace access for just ₹299 — one-time premium
            upgrade.
          </Typography>

          <Box
            component={RouterLink}
            to="/subscription"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              gap: 0.2,
              ml: 1,
              px: 1.25,
              py: 0.45,
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "0.75rem",
              fontWeight: 900,
              color: COLORS.primary,
              bgcolor: "#ffffff",
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            Upgrade now <ChevronRightRoundedIcon sx={{ fontSize: 14 }} />
          </Box>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              color: "rgba(255,255,255,0.82)",
              "&:hover": {
                color: "#ffffff",
                bgcolor: "rgba(255,255,255,0.10)",
              },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAppState();

  const roleKey = resolveRole(user);
  const loggedIn = roleKey !== "guest";
  const menuOpen = Boolean(anchorEl);
  const navCfg = useMemo(() => getNavConfig()[roleKey], [roleKey]);
  const dropdownItems = navCfg?.dropdown ?? [];

  const showBar =
    showAnnouncement && (roleKey === "guest" || roleKey === "free");

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
    const name = user?.name?.trim() || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return `${parts[0][0] || "U"}`.toUpperCase();
  }, [user?.name]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/dashboard" || path === "/admin")
      return location.pathname === path;
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
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
      {showBar && (
        <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
      )}

      <Box
        sx={{
          position: "sticky",
          top: 8,
          zIndex: 1200,
          px: { xs: 1.5, md: 2.5 },
          pt: 1.2,
          pb: 0.5,
          pointerEvents: "none",
          backgroundColor: "transparent",
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ pointerEvents: "auto" }}>
          <Box
            sx={{
              minHeight: { xs: 64, md: 72 },
              px: { xs: 1.6, sm: 2.2, md: 2.8 },
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderRadius: "999px",
              backgroundColor: scrolled ? COLORS.surfaceStrong : COLORS.surface,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: `1px solid ${scrolled ? COLORS.borderStrong : COLORS.border}`,
              boxShadow: scrolled ? COLORS.shadowStrong : COLORS.shadow,
              transition: "all .28s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <Box
              sx={{
                flex: "1 1 0",
                display: "flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Logo />
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.4}
              sx={{
                display: { xs: "none", lg: "flex" },
                px: 0.6,
                py: 0.6,
                borderRadius: "999px",
                backgroundColor: "rgba(248,250,252,0.96)",
                border: `1px solid ${COLORS.border}`,
                flex: "0 0 auto",
              }}
            >
              {navCfg.desktop.map((item) => (
                <DesktopNavLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  active={isActive(item.to)}
                />
              ))}
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
              sx={{
                flex: "1 1 0",
                display: { xs: "none", md: "flex" },
                minWidth: 0,
              }}
            >
              {roleKey === "guest" && (
                <>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="text"
                    startIcon={<SellRoundedIcon />}
                    sx={{
                      minHeight: 44,
                      px: 2,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      color: COLORS.muted,
                      "&:hover": {
                        backgroundColor: "rgba(15,23,42,0.05)",
                        color: COLORS.text,
                      },
                    }}
                  >
                    Post Listing
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      minHeight: 44,
                      px: 2.2,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      borderColor: COLORS.borderStrong,
                      color: COLORS.muted,
                      "&:hover": {
                        borderColor: COLORS.primary,
                        backgroundColor: COLORS.primarySoft,
                        color: COLORS.primary,
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
                      minHeight: 44,
                      px: 2.4,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 900,
                      fontSize: "0.88rem",
                      backgroundColor: COLORS.text,
                      boxShadow: "0 12px 24px rgba(15,23,42,0.16)",
                      "&:hover": {
                        backgroundColor: "#1e293b",
                        boxShadow: "0 16px 28px rgba(15,23,42,0.22)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {(roleKey === "free" || roleKey === "premium") && (
                <>
                  <RoleBadge roleKey={roleKey} />

                  {roleKey === "premium" && (
                    <Button
                      component={RouterLink}
                      to="/dashboard/add-property"
                      variant="outlined"
                      startIcon={<SellRoundedIcon />}
                      sx={{
                        minHeight: 44,
                        px: 2,
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        borderColor: COLORS.borderStrong,
                        color: COLORS.muted,
                        "&:hover": {
                          borderColor: COLORS.primary,
                          backgroundColor: COLORS.primarySoft,
                          color: COLORS.primary,
                        },
                      }}
                    >
                      Post Listing
                    </Button>
                  )}

                  {roleKey === "free" && (
                    <Button
                      component={RouterLink}
                      to="/subscription"
                      variant="contained"
                      startIcon={
                        <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
                      }
                      sx={{
                        minHeight: 44,
                        px: 2.3,
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 900,
                        fontSize: "0.86rem",
                        backgroundColor: "#111827",
                        boxShadow: "0 12px 24px rgba(17,24,39,0.14)",
                        "&:hover": {
                          backgroundColor: "#0f172a",
                          boxShadow: "0 16px 28px rgba(17,24,39,0.20)",
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
                        borderRadius: "999px",
                        border: `2px solid ${COLORS.border}`,
                        backgroundColor: "#ffffff",
                        "&:hover": {
                          borderColor: COLORS.primary,
                          boxShadow: "0 0 0 4px rgba(15,118,110,0.10)",
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

              {roleKey === "admin" && (
                <>
                  <RoleBadge roleKey="admin" />

                  <Button
                    component={RouterLink}
                    to="/admin"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsRoundedIcon />}
                    sx={{
                      minHeight: 44,
                      px: 2,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      borderColor: "rgba(185,28,28,0.28)",
                      color: COLORS.admin,
                      "&:hover": {
                        borderColor: COLORS.admin,
                        backgroundColor: COLORS.adminSoft,
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
                        borderRadius: "999px",
                        border: "2px solid rgba(185,28,28,0.16)",
                        backgroundColor: "#ffffff",
                        "&:hover": {
                          borderColor: COLORS.admin,
                          boxShadow: "0 0 0 4px rgba(239,68,68,0.10)",
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

            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 44,
                height: 44,
                borderRadius: "14px",
                border: `1px solid ${COLORS.borderStrong}`,
                backgroundColor: "#ffffff",
                color: COLORS.text,
                "&:hover": {
                  borderColor: COLORS.primary,
                  backgroundColor: COLORS.primarySoft,
                  color: COLORS.primary,
                },
              }}
            >
              <MenuRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
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
              mt: 1.4,
              minWidth: 260,
              borderRadius: "22px",
              overflow: "visible",
              border: `1px solid ${COLORS.border}`,
              boxShadow: COLORS.shadowStrong,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -7,
                right: 20,
                width: 14,
                height: 14,
                backgroundColor: "#ffffff",
                borderLeft: `1px solid ${COLORS.border}`,
                borderTop: `1px solid ${COLORS.border}`,
                transform: "rotate(45deg)",
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2.4,
              py: 2,
              backgroundColor:
                roleKey === "admin"
                  ? "rgba(254,242,242,0.8)"
                  : "rgba(248,250,252,0.95)",
              borderRadius: "22px 22px 0 0",
            }}
          >
            <Stack direction="row" spacing={1.4} alignItems="center">
              <UserAvatar
                initials={initials}
                photo={user?.photo}
                roleKey={roleKey}
                size={46}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.97rem",
                    lineHeight: 1.2,
                    color: COLORS.text,
                  }}
                >
                  {user?.name || "User"}
                </Typography>

                {!!user?.email && (
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      color: COLORS.muted,
                      fontWeight: 500,
                      mb: 0.7,
                    }}
                  >
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
                py: 1.4,
                px: 2.2,
                gap: 0.5,
                fontWeight: 700,
                fontSize: "0.88rem",
                color: "#334155",
                "&:hover": {
                  backgroundColor: COLORS.primarySoft,
                  color: COLORS.primary,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: COLORS.muted,
                  "& svg": { fontSize: 18 },
                }}
              >
                {item.icon}
              </ListItemIcon>

              {item.label}

              <ChevronRightRoundedIcon
                sx={{ ml: "auto", fontSize: 16, color: "#cbd5e1" }}
              />
            </MenuItem>
          ))}

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.4,
              px: 2.2,
              gap: 0.5,
              fontWeight: 800,
              fontSize: "0.88rem",
              color: "#ef4444",
              borderRadius: "0 0 22px 22px",
              "&:hover": {
                backgroundColor: "rgba(239,68,68,0.05)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: "#ef4444",
                "& svg": { fontSize: 18 },
              }}
            >
              <LogoutRoundedIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobile}
        PaperProps={{
          sx: {
            width: 334,
            maxWidth: "100%",
            borderRadius: "28px 0 0 28px",
            backgroundColor: "#ffffff",
            boxShadow: "-20px 0 60px rgba(15,23,42,0.14)",
            overflow: "hidden",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              px: 2.5,
              pt: 2.5,
              pb: 2,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1.2}
              mb={loggedIn ? 2 : 0}
            >
              <Logo compact />

              <IconButton
                onClick={closeMobile}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  border: `1px solid ${COLORS.borderStrong}`,
                  color: COLORS.text,
                  "&:hover": {
                    color: COLORS.admin,
                    borderColor: COLORS.admin,
                    backgroundColor: COLORS.adminSoft,
                  },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            {loggedIn && (
              <Box
                sx={{
                  p: 1.8,
                  borderRadius: "18px",
                  backgroundColor:
                    roleKey === "admin"
                      ? "rgba(254,242,242,0.72)"
                      : "rgba(248,250,252,0.9)",
                  border:
                    roleKey === "admin"
                      ? "1px solid rgba(239,68,68,0.12)"
                      : "1px solid rgba(148,163,184,0.18)",
                }}
              >
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <UserAvatar
                    initials={initials}
                    photo={user?.photo}
                    roleKey={roleKey}
                    size={44}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: "0.95rem",
                        lineHeight: 1.2,
                        color: COLORS.text,
                      }}
                    >
                      {user?.name || "User"}
                    </Typography>

                    {!!user?.email && (
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: COLORS.muted,
                          mb: 0.55,
                        }}
                      >
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
                  mt: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  borderRadius: "18px",
                  textDecoration: "none",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  boxShadow: "0 14px 28px rgba(17,24,39,0.14)",
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "0.88rem",
                      lineHeight: 1.2,
                      color: "#ffffff",
                    }}
                  >
                    Upgrade to Premium
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.73rem",
                      color: "rgba(255,255,255,0.76)",
                    }}
                  >
                    Unlock contacts, prices &amp; post listings — ₹299
                  </Typography>
                </Box>

                <ChevronRightRoundedIcon
                  sx={{ ml: "auto", fontSize: 18, color: "#ffffff" }}
                />
              </Box>
            )}

            {!loggedIn && (
              <Stack spacing={1.1} sx={{ mt: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  onClick={closeMobile}
                  variant="outlined"
                  startIcon={<LoginRoundedIcon />}
                  fullWidth
                  sx={{
                    minHeight: 48,
                    borderRadius: "16px",
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: COLORS.borderStrong,
                    color: COLORS.text,
                  }}
                >
                  Login
                </Button>

                <Button
                  component={RouterLink}
                  to="/register"
                  onClick={closeMobile}
                  variant="contained"
                  startIcon={<PersonAddAlt1RoundedIcon />}
                  fullWidth
                  sx={{
                    minHeight: 48,
                    borderRadius: "16px",
                    textTransform: "none",
                    fontWeight: 900,
                    backgroundColor: COLORS.text,
                    "&:hover": {
                      backgroundColor: "#1e293b",
                    },
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            )}
          </Box>

          {loggedIn && (
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <Button
                onClick={handleLogout}
                fullWidth
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  minHeight: 48,
                  borderRadius: "18px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  borderColor: "rgba(239,68,68,0.28)",
                  color: "#ef4444",
                  "&:hover": {
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239,68,68,0.05)",
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
  );
}
