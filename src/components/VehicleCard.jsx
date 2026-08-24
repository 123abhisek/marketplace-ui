
// src/components/VehicleCard.jsx
import {
  Box, Card, CardContent, Chip, Divider,
  Stack, Tooltip, Typography, Button,
} from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import SpeedRoundedIcon          from '@mui/icons-material/SpeedRounded'
import CalendarTodayRoundedIcon  from '@mui/icons-material/CalendarTodayRounded'
import LocationOnRoundedIcon     from '@mui/icons-material/LocationOnRounded'
import PhoneRoundedIcon          from '@mui/icons-material/PhoneRounded'
import LockRoundedIcon           from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon     from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon           from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon  from '@mui/icons-material/DeleteOutlineRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppState }           from '../hooks/useAppState'
import { formatCurrency }        from '../utils/formatters'

export default function VehicleCard({ item, editUrl, onDelete }) {
  const { user } = useAppState()
  const navigate = useNavigate()

  // Full access for premium, admin, and seller roles
  const hasFullAccess = Boolean(
    user?.isPremium ||
    user?.is_premium ||
    user?.role === 'premium' ||
    user?.role === 'admin' ||
    user?.role === 'seller' ||
    user?.is_admin ||
    user?.isAdmin
  )
  const locked = !hasFullAccess && !editUrl
  const detailUrl = `/vehicles/${item.id}`
  const itemPrice = item.price ?? item.expectedPrice ?? item.expected_price

  // Format status badge if this is an owner/management view
  const statusStr = String(item.status || 'approved').toLowerCase()
  const isPending = statusStr === 'pending'
  const isRejected = statusStr === 'rejected'
  const isSuspended = statusStr === 'suspended'
  const isApproved = statusStr === 'approved' || (!isPending && !isRejected && !isSuspended)

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        height: '100%',
        minHeight: locked ? 475 : 430,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
        },
      }}
    >
      {/* ── Image / Placeholder (Strict Fixed Height) ── */}
      <Box
        component={RouterLink}
        to={detailUrl}
        sx={{
          position: 'relative',
          height: 200,
          minHeight: 200,
          maxHeight: 200,
          width: '100%',
          background: 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'block',
          cursor: 'pointer',
        }}
      >
        {item.images?.[0] ? (
          <Box
            component="img"
            src={item.images[0]}
            alt={item.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.04)' } }}
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
                width: 52,
                height: 52,
                borderRadius: '16px',
                background: 'rgba(124,58,237,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsCarRoundedIcon sx={{ fontSize: 26, color: '#7C3AED' }} />
            </Box>
            <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
              No Image
            </Typography>
          </Box>
        )}

        {/* Brand + Model Chip */}
        <Chip
          label={`${item.brand || ''} ${item.model || ''}`.trim() || 'Vehicle'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            background: '#F5F3FF',
            color: '#7C3AED',
            border: 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 2,
          }}
        />

        {/* Status / Access Badge on Top-Right */}
        {editUrl || onDelete ? (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              px: 1.2,
              py: 0.35,
              borderRadius: '8px',
              background: isApproved
                ? 'rgba(16,185,129,0.92)'
                : isPending
                ? 'rgba(245,158,11,0.92)'
                : isRejected
                ? 'rgba(239,68,68,0.92)'
                : 'rgba(100,116,139,0.92)',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 2,
            }}
          >
            {isApproved ? 'Approved & Live' : isPending ? 'Under Review' : isRejected ? 'Rejected' : 'Suspended'}
          </Box>
        ) : locked ? (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              px: 1.2,
              py: 0.35,
              borderRadius: '8px',
              background: 'rgba(124,58,237,0.92)',
              color: '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 2,
            }}
          >
            Full Access
          </Box>
        )}
      </Box>

      {/* ── Card Content (Strict Sizing & Alignment) ── */}
      <CardContent
        sx={{
          p: 2.2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: 2.2 },
        }}
      >
        {/* Top details group */}
        <Stack spacing={1.2}>
          {/* Title (Fixed 2 lines, Clickable) */}
          <Typography
            component={RouterLink}
            to={detailUrl}
            fontWeight={800}
            sx={{
              fontSize: '0.96rem',
              color: '#1E293B',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              lineHeight: 1.35,
              height: 42,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': { color: '#7C3AED' },
            }}
          >
            {item.title}
          </Typography>

          {/* Location (Fixed 1 line) */}
          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ height: 20, overflow: 'hidden' }}>
            <LocationOnRoundedIcon sx={{ fontSize: 15, color: '#94A3B8', flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: '#94A3B8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.location || 'Karnataka'}
            </Typography>
          </Stack>

          {/* Specs row (Fixed height) */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: 24, overflow: 'hidden' }}>
            {item.year && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: '#4361EE' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {item.year}
                </Typography>
              </Stack>
            )}
            {item.kmDriven && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SpeedRoundedIcon sx={{ fontSize: 13, color: '#7C3AED' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  {Number(item.kmDriven).toLocaleString('en-IN')} km
                </Typography>
              </Stack>
            )}
            {item.rtoCode && (
              <Chip
                label={item.rtoCode}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: '#F1F5F9',
                  color: '#64748B',
                  border: 'none',
                }}
              />
            )}
          </Stack>
        </Stack>

        {/* Bottom group */}
        <Box sx={{ mt: 'auto', pt: 1.2 }}>
          <Divider sx={{ opacity: 0.6, mb: 1.2 }} />

          {/* Price + Contact / View row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 40 }}>
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, mb: 0.2 }}>
                Asking Price
              </Typography>
              <Typography
                fontWeight={900}
                sx={{
                  fontSize: '1.02rem',
                  color: hasFullAccess ? '#7C3AED' : '#94A3B8',
                  letterSpacing: '-0.02em',
                }}
              >
                {hasFullAccess ? (itemPrice != null ? formatCurrency(itemPrice) : 'Contact for Price') : '---'}
              </Typography>
            </Box>

            {locked ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.4,
                  py: 0.65,
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
            ) : (editUrl || onDelete) ? (
              <Stack direction="row" spacing={1} alignItems="center">
                {editUrl && (
                  <Button
                    component={RouterLink}
                    to={editUrl}
                    size="small"
                    startIcon={<EditRoundedIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      bgcolor: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid #BFDBFE',
                      px: 1.4,
                      py: 0.6,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#DBEAFE' },
                    }}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={onDelete}
                    size="small"
                    startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      bgcolor: '#FEF2F2',
                      color: '#EF4444',
                      border: '1px solid #FECACA',
                      px: 1.4,
                      py: 0.6,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#FEE2E2', borderColor: '#FCA5A5' },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                {item.contactNumber && (
                  <Tooltip title={`Call ${item.contactNumber}`}>
                    <Box
                      component="a"
                      href={`tel:${item.contactNumber}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.3,
                        py: 0.65,
                        borderRadius: '10px',
                        background: '#ECFDF5',
                        color: '#059669',
                        textDecoration: 'none',
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
                <Button
                  component={RouterLink}
                  to={detailUrl}
                  size="small"
                  startIcon={<VisibilityRoundedIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    bgcolor: '#7C3AED',
                    color: '#FFFFFF',
                    px: 1.5,
                    py: 0.6,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Details
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Upgrade CTA for locked */}
          {locked && (
            <Button
              component={RouterLink}
              to="/subscription"
              variant="outlined"
              size="small"
              startIcon={<LockRoundedIcon sx={{ fontSize: '13px !important' }} />}
              fullWidth
              sx={{
                borderRadius: '10px',
                borderColor: '#FDE68A',
                background: '#FFFBEB',
                color: '#D97706',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 34,
                mt: 1.2,
                '&:hover': { background: '#FEF3C7', borderColor: '#F59E0B' },
              }}
            >
              Upgrade to unlock
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

