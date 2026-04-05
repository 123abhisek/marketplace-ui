// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { Box, Chip, Stack, Typography } from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import AddHomeRoundedIcon from '@mui/icons-material/AddHomeRounded'
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { useAppState } from '../hooks/useAppState'

const items = [
  { to: '/dashboard', label: 'Home', icon: <DashboardRoundedIcon fontSize="small" /> },
  { to: '/dashboard/properties', label: 'Properties', icon: <ApartmentRoundedIcon fontSize="small" /> },
  { to: '/dashboard/vehicles', label: 'Vehicles', icon: <DirectionsCarRoundedIcon fontSize="small" /> },
  { to: '/dashboard/add-property', label: 'Add Property', icon: <AddHomeRoundedIcon fontSize="small" /> },
  { to: '/dashboard/add-vehicle', label: 'Add Vehicle', icon: <NoteAddRoundedIcon fontSize="small" /> },
  { to: '/dashboard/my-listings', label: 'My Listings', icon: <ListAltRoundedIcon fontSize="small" /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <PersonRoundedIcon fontSize="small" /> },
  { to: '/dashboard/subscription', label: 'Subscription', icon: <WorkspacePremiumRoundedIcon fontSize="small" /> },
  { to: '/dashboard/logout', label: 'Logout', icon: <LogoutRoundedIcon fontSize="small" /> },
]

export default function Sidebar() {
  const { user } = useAppState()

  return (
    <Box className="h-full rounded-[28px] border border-slate-200/70 bg-white/90 p-4 shadow-sm">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            MarketPlus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Marketplace dashboard
          </Typography>
        </Box>

        <Chip
          color={user.isPremium ? 'success' : 'default'}
          label={user.isPremium ? 'Premium Active' : 'Free Access'}
        />

        <Stack spacing={1}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}