// src/layouts/DashboardLayout.jsx
import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Sidebar from '../components/Sidebar'
import { useAppState } from '../hooks/useAppState'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAppState()

  if (!user.loggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <Box className="min-h-screen bg-slate-50">
      <AppBar position="sticky" color="inherit" elevation={0} className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <Toolbar>
          <IconButton className="md:!hidden" onClick={() => setMobileOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <Stack>
            <Typography variant="h6" fontWeight={800}>
              Welcome, {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.isPremium ? 'Premium member' : 'Free member'}
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="py-6">
        <Box className="grid gap-6 md:grid-cols-[280px_1fr]">
          <Box className="hidden md:block">
            <Sidebar />
          </Box>

          <Box className="min-w-0">
            <Outlet />
          </Box>
        </Box>
      </Container>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box className="w-80 p-4">
          <Sidebar />
        </Box>
      </Drawer>
    </Box>
  )
}