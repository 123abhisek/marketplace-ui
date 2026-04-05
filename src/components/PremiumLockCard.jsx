// src/components/PremiumLockCard.jsx
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { Link as RouterLink } from 'react-router-dom'

export default function PremiumLockCard({ compact = false }) {
  return (
    <Card className="mt-3 rounded-3xl border border-amber-200 bg-amber-50">
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <LockRoundedIcon color="warning" />
          <div>
            <Typography fontWeight={700}>
              Upgrade to Premium to Unlock
            </Typography>
            {!compact && (
              <Typography variant="body2" color="text.secondary">
                View full price, contact details, and post your own listings.
              </Typography>
            )}
          </div>
          <Button component={RouterLink} to="/subscription" size="small">
            Upgrade
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}