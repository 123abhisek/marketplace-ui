
// src/components/PremiumLockCard.jsx
import { Box, Button, Stack, Typography } from '@mui/material'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import ArrowForwardRoundedIcon     from '@mui/icons-material/ArrowForwardRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Link as RouterLink }      from 'react-router-dom'

export default function PremiumLockCard({ compact = false }) {
  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1px solid #FDE68A',
        }}
      >
        <LockRoundedIcon sx={{ fontSize: 18, color: '#F59E0B', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 700, flex: 1 }}>
          Upgrade to Premium to view this
        </Typography>
        <Button
          component={RouterLink}
          to="/subscription"
          size="small"
          sx={{
            borderRadius: '10px',
            background: '#F59E0B',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.72rem',
            px: 1.5,
            minWidth: 'auto',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
            '&:hover': { background: '#D97706' },
          }}
        >
          Upgrade
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(67,97,238,0.06) 0%, rgba(124,58,237,0.06) 100%)',
        border: '1.5px dashed rgba(67,97,238,0.25)',
        textAlign: 'center',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(67,97,238,0.30)',
          }}
        >
          <WorkspacePremiumRoundedIcon sx={{ fontSize: 30, color: '#fff' }} />
        </Box>

        <Box>
          <Typography
            fontWeight={900}
            sx={{ fontSize: '1.1rem', color: '#1E293B', letterSpacing: '-0.02em', mb: 0.5 }}
          >
            Premium Feature
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748B', maxWidth: 360, mx: 'auto', lineHeight: 1.6 }}>
            Upgrade to Premium (₹299) to post listings, view prices, and access full contact details.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            component={RouterLink}
            to="/subscription"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
              fontWeight: 800,
              boxShadow: '0 4px 16px rgba(67,97,238,0.35)',
              '&:hover': { boxShadow: '0 6px 24px rgba(67,97,238,0.45)' },
            }}
          >
            Upgrade — ₹299
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="outlined"
            sx={{
              borderRadius: '12px',
              borderColor: 'rgba(67,97,238,0.3)',
              color: '#4361EE',
              fontWeight: 700,
              '&:hover': { borderColor: '#4361EE', background: '#EEF2FF' },
            }}
          >
            Browse Free Listings
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}