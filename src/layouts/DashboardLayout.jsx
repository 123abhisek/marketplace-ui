
// src/layouts/DashboardLayout.jsx
import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {
  AppBar, Box, Chip, Container, Drawer,
  IconButton, Stack, Toolbar, Typography,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Sidebar from '../components/Sidebar'
import { useAppState } from '../hooks/useAppState'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAppState()

  // Redirect to login if not authenticated
  if (!user.loggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <Box className="min-h-screen bg-slate-50">
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(226,232,240,0.8)', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.85)' }}
      >
        <Toolbar>
          <IconButton
            sx={{ display: { md: 'none' }, mr: 1 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flex: 1 }}>
            <Stack>
              <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
                Welcome, {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                {user.email}
              </Typography>
            </Stack>
            <Chip
              label={user.isPremium ? 'Premium Active' : 'Free Access'}
              color={user.isPremium ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 800, borderRadius: '999px' }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '280px 1fr' } }}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Sidebar />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Outlet />
          </Box>
        </Box>
      </Container>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Sidebar />
        </Box>
      </Drawer>
    </Box>
  )
}
