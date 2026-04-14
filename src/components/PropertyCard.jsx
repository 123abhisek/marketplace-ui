
// src/components/PropertyCard.jsx
import {
  Box, Button, Card, CardContent, Chip,
  Divider, Stack, Tooltip, Typography,
} from '@mui/material'
import ApartmentRoundedIcon      from '@mui/icons-material/ApartmentRounded'
import LocationOnRoundedIcon     from '@mui/icons-material/LocationOnRounded'
import BedRoundedIcon            from '@mui/icons-material/BedRounded'
import SquareFootRoundedIcon     from '@mui/icons-material/SquareFootRounded'
import PhoneRoundedIcon          from '@mui/icons-material/PhoneRounded'
import LockRoundedIcon           from '@mui/icons-material/LockRounded'
import ArrowForwardRoundedIcon   from '@mui/icons-material/ArrowForwardRounded'
import { Link as RouterLink }    from 'react-router-dom'
import { useAppState }           from '../hooks/useAppState'
import { formatCurrency }        from '../utils/formatters'

const TYPE_COLORS = {
  Residential: { bg: '#EEF2FF', color: '#4361EE' },
  Commercial:  { bg: '#FFF7ED', color: '#EA580C' },
  Agricultural:{ bg: '#ECFDF5', color: '#10B981' },
  Site:        { bg: '#F5F3FF', color: '#7C3AED' },
  Flat:        { bg: '#EFF6FF', color: '#2563EB' },
}

export default function PropertyCard({ item }) {
  const { user } = useAppState()
  const locked = !user.isPremium
  const typeStyle = TYPE_COLORS[item.propertyType] || { bg: '#F1F5F9', color: '#64748B' }

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 2px 20px rgba(15,23,42,0.07)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 48px rgba(15,23,42,0.14)',
        },
      }}
    >
      {/* ── Image / Placeholder ── */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: `linear-gradient(135deg, ${typeStyle.bg} 0%, #F8FAFC 100%)`,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {item.images?.[0] ? (
          <Box
            component="img"
            src={item.images[0]}
            alt={item.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: typeStyle.color + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ApartmentRoundedIcon sx={{ fontSize: 28, color: typeStyle.color }} />
            </Box>
            <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
              No Image
            </Typography>
          </Box>
        )}

        {/* Property Type Chip */}
        <Chip
          label={item.propertyType || 'Property'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            background: typeStyle.bg,
            color: typeStyle.color,
            border: 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />

        {/* Lock icon for free users */}
        {locked && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
          </Box>
        )}
      </Box>

      {/* ── Card Content ── */}
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Title */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: '0.95rem',
            color: '#1E293B',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </Typography>

        {/* Location */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <LocationOnRoundedIcon sx={{ fontSize: 14, color: '#94A3B8', flexShrink: 0 }} />
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: '#94A3B8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.location || item.apartmentName || '—'}
          </Typography>
        </Stack>

        {/* Quick specs */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {item.bedrooms && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BedRoundedIcon sx={{ fontSize: 14, color: '#4361EE' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                {item.bedrooms} Bed
              </Typography>
            </Stack>
          )}
          {(item.area || item.landArea) && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <SquareFootRoundedIcon sx={{ fontSize: 14, color: '#7C3AED' }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                {item.area ? `${item.area} sq.ft` : item.landArea}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ opacity: 0.6 }} />

        {/* Price + Contact row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, mb: 0.25 }}>
              Expected Price
            </Typography>
            <Typography
              fontWeight={900}
              sx={{
                fontSize: '1rem',
                color: '#4361EE',
                letterSpacing: '-0.02em',
                filter: locked ? 'blur(6px)' : 'none',
                userSelect: locked ? 'none' : 'auto',
                transition: 'filter 0.2s',
              }}
            >
              {formatCurrency(item.expectedPrice)}
            </Typography>
          </Box>

          {locked ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.75,
                borderRadius: '10px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
              }}
            >
              <LockRoundedIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>
                Locked
              </Typography>
            </Box>
          ) : (
            <Tooltip title={item.contactNumber}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '10px',
                  background: '#ECFDF5',
                  cursor: 'pointer',
                  '&:hover': { background: '#D1FAE5' },
                  transition: 'background 0.15s',
                }}
              >
                <PhoneRoundedIcon sx={{ fontSize: 13, color: '#10B981' }} />
                <Typography sx={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                  Call
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Stack>

        {/* Upgrade CTA for locked */}
        {locked && (
          <Button
            component={RouterLink}
            to="/subscription"
            variant="outlined"
            size="small"
            startIcon={<LockRoundedIcon sx={{ fontSize: '14px !important' }} />}
            fullWidth
            sx={{
              borderRadius: '12px',
              borderColor: '#FDE68A',
              background: '#FFFBEB',
              color: '#D97706',
              fontWeight: 700,
              fontSize: '0.78rem',
              mt: 'auto',
              '&:hover': { background: '#FEF3C7', borderColor: '#F59E0B' },
            }}
          >
            Upgrade to unlock details
          </Button>
        )}
      </CardContent>
    </Card>
  )
}