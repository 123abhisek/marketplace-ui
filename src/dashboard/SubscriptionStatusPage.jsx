// src/dashboard/SubscriptionStatusPage.jsx
import { Link as RouterLink } from 'react-router-dom'
import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useAppState } from '../hooks/useAppState'

export default function SubscriptionStatusPage() {
  const { user, upgradePremium } = useAppState()

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Subscription Status</Typography>
      <Card className="rounded-3xl">
        <CardContent>
          <Stack spacing={2}>
            <Chip
              label={user.isPremium ? 'Premium Active' : 'Premium Inactive'}
              color={user.isPremium ? 'success' : 'default'}
              className="w-fit"
            />
            <Typography variant="h5" fontWeight={800}>₹299 Premium Plan</Typography>
            <Typography color="text.secondary">
              {user.isPremium
                ? 'You can view full listing details and post your own marketplace listings.'
                : 'Upgrade to unlock price, contact numbers, and posting permissions.'}
            </Typography>
            {!user.isPremium ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} to="/subscription">Go to Payment Page</Button>
                <Button variant="outlined" onClick={upgradePremium}>Demo Activate</Button>
              </Stack>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}