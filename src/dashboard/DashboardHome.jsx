// src/dashboard/DashboardHome.jsx
import { Link as RouterLink } from 'react-router-dom'
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useAppState } from '../hooks/useAppState'

export default function DashboardHome() {
  const { user, properties, vehicles } = useAppState()

  const stats = [
    { label: 'Properties', value: properties.length },
    { label: 'Vehicles', value: vehicles.length },
    { label: 'Role', value: user.isPremium ? 'Premium' : 'Free' },
  ]

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Dashboard Home</Typography>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Card className="rounded-3xl">
              <CardContent>
                <Typography color="text.secondary">{item.label}</Typography>
                <Typography variant="h4" fontWeight={900}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="rounded-3xl">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={800}>Quick actions</Typography>
                <Button component={RouterLink} to="/dashboard/add-property">Add Property</Button>
                <Button component={RouterLink} to="/dashboard/add-vehicle" variant="outlined">Add Vehicle</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="rounded-3xl">
            <CardContent>
              <Typography variant="h6" fontWeight={800}>Subscription status</Typography>
              <Typography color="text.secondary">
                {user.isPremium ? 'Your premium access is active.' : 'Upgrade to unlock full marketplace features.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}