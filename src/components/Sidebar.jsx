// // src/components/Sidebar.jsx
// import { NavLink } from 'react-router-dom'
// import { Box, Chip, Stack, Typography } from '@mui/material'
// import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
// import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
// import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
// import AddHomeRoundedIcon from '@mui/icons-material/AddHomeRounded'
// import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded'
// import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
// import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
// import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
// import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
// import { useAppState } from '../hooks/useAppState'

// const items = [
//   { to: '/dashboard', label: 'Home', icon: <DashboardRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/properties', label: 'Properties', icon: <ApartmentRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/vehicles', label: 'Vehicles', icon: <DirectionsCarRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/add-property', label: 'Add Property', icon: <AddHomeRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/add-vehicle', label: 'Add Vehicle', icon: <NoteAddRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/my-listings', label: 'My Listings', icon: <ListAltRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/profile', label: 'Profile', icon: <PersonRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/subscription', label: 'Subscription', icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
//   { to: '/dashboard/logout', label: 'Logout', icon: <LogoutRoundedIcon fontSize="small" /> },
// ]

// export default function Sidebar() {
//   const { user } = useAppState()

//   return (
//     <Box className="h-full rounded-[28px] border border-slate-200/70 bg-white/90 p-4 shadow-sm">
//       <Stack spacing={2}>
//         <Box>
//           <Typography variant="h6" fontWeight={800}>
//             Easydeal
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Marketplace dashboard
//           </Typography>
//         </Box>

//         <Chip
//           color={user.isPremium ? 'success' : 'default'}
//           label={user.isPremium ? 'Premium Active' : 'Free Access'}
//         />

//         <Stack spacing={1}>
//           {items.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.to === '/dashboard'}
//               className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </Stack>
//       </Stack>
//     </Box>
//   )
// }







// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  Avatar, Box, Chip, Divider, Stack, Tooltip, Typography,
} from '@mui/material'
import DashboardRoundedIcon       from '@mui/icons-material/DashboardRounded'
import ApartmentRoundedIcon       from '@mui/icons-material/ApartmentRounded'
import DirectionsCarRoundedIcon   from '@mui/icons-material/DirectionsCarRounded'
import AddHomeRoundedIcon         from '@mui/icons-material/AddHomeRounded'
import NoteAddRoundedIcon         from '@mui/icons-material/NoteAddRounded'
import ListAltRoundedIcon         from '@mui/icons-material/ListAltRounded'
import PersonRoundedIcon          from '@mui/icons-material/PersonRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import LogoutRoundedIcon          from '@mui/icons-material/LogoutRounded'
import HomeWorkRoundedIcon        from '@mui/icons-material/HomeWorkRounded'
import { useAppState }            from '../hooks/useAppState'

const MAIN_NAV = [
  { to: '/dashboard',              label: 'Dashboard',    icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} />,     end: true },
  { to: '/dashboard/properties',   label: 'Properties',   icon: <ApartmentRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/vehicles',     label: 'Vehicles',     icon: <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/add-property', label: 'Add Property', icon: <AddHomeRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/add-vehicle',  label: 'Add Vehicle',  icon: <NoteAddRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/my-listings',  label: 'My Listings',  icon: <ListAltRoundedIcon sx={{ fontSize: 20 }} /> },
]

const BOTTOM_NAV = [
  { to: '/dashboard/profile',      label: 'Profile',      icon: <PersonRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/subscription', label: 'Subscription', icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 20 }} /> },
  { to: '/dashboard/logout',       label: 'Logout',       icon: <LogoutRoundedIcon sx={{ fontSize: 20 }} /> },
]

function NavItem({ to, label, icon, end = false }) {
  return (
    <NavLink to={to} end={end} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1.25,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: isActive ? '#4361EE' : 'transparent',
            color: isActive ? '#ffffff' : '#64748B',
            '&:hover': {
              background: isActive ? '#4361EE' : '#F1F5F9',
              color: isActive ? '#ffffff' : '#1E293B',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isActive ? 1 : 0.7,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user } = useAppState()

  return (
    <Box
      sx={{
        height: '100%',
        background: '#ffffff',
        borderRadius: '20px',
        p: 2,
        boxShadow: '0 2px 24px rgba(15, 23, 42, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        overflow: 'hidden',
      }}
    >
      {/* ── Brand ── */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 0.5, py: 1, mb: 0.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(67,97,238,0.35)',
          }}
        >
          <HomeWorkRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#1E293B',
              lineHeight: 1,
            }}
          >
            Easydeal
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
            Marketplace
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* ── Main Navigation ── */}
      <Stack spacing={0.5} sx={{ flex: 1, py: 1 }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#CBD5E1',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
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
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#CBD5E1',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
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
          borderRadius: '14px',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          border: '1px solid rgba(226,232,240,0.8)',
        }}
      >
        <Avatar
          src={user.photo || user.avatar_url}
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
            fontSize: '0.85rem',
            fontWeight: 800,
            boxShadow: '0 2px 8px rgba(67,97,238,0.25)',
          }}
        >
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1E293B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {user.name || 'User'}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.7rem',
              color: '#94A3B8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.isPremium ? 'Premium Member' : 'Free Member'}
          </Typography>
        </Box>

        <Chip
          label={user.isPremium ? 'PRO' : 'FREE'}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.6rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            flexShrink: 0,
            background: user.isPremium
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : '#E2E8F0',
            color: user.isPremium ? '#fff' : '#64748B',
            border: 'none',
            boxShadow: user.isPremium ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
          }}
        />
      </Box>
    </Box>
  )
}