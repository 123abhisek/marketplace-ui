
// src/components/EmptyState.jsx
import { Box, Button, Stack, Typography } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Create your first listing to get started.',
  actionLabel,
  onAction,
  icon,
  iconColor = '#94A3B8',
  iconBg = '#F1F5F9',
}) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '20px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {icon || <InboxRoundedIcon sx={{ fontSize: 34, color: iconColor }} />}
      </Box>

      <Stack spacing={0.75} alignItems="center">
        <Typography
          fontWeight={800}
          sx={{ fontSize: '1.05rem', color: '#1E293B', letterSpacing: '-0.02em' }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.85rem',
            color: '#94A3B8',
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Stack>

      {actionLabel && (
        <Button
          onClick={onAction}
          variant="contained"
          sx={{
            mt: 0.5,
            borderRadius: '12px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
            boxShadow: '0 4px 16px rgba(67,97,238,0.3)',
            '&:hover': { boxShadow: '0 6px 24px rgba(67,97,238,0.4)' },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}