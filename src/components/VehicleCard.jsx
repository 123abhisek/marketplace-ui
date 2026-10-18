// src/components/VehicleCard.jsx
import React from 'react'
import {
  Box, Button, Card, CardContent, Chip,
  Divider, Stack, Tooltip, Typography,
} from '@mui/material'
import DirectionsCarRoundedIcon  from '@mui/icons-material/DirectionsCarRounded'
import TwoWheelerRoundedIcon      from '@mui/icons-material/TwoWheelerRounded'
import SpeedRoundedIcon          from '@mui/icons-material/SpeedRounded'
import CalendarTodayRoundedIcon  from '@mui/icons-material/CalendarTodayRounded'
import LocationOnRoundedIcon     from '@mui/icons-material/LocationOnRounded'
import LocalGasStationRoundedIcon from '@mui/icons-material/LocalGasStationRounded'
import TuneRoundedIcon           from '@mui/icons-material/TuneRounded'
import AssignmentIndRoundedIcon  from '@mui/icons-material/AssignmentIndRounded'
import ShieldRoundedIcon         from '@mui/icons-material/ShieldRounded'
import ElectricBoltRoundedIcon   from '@mui/icons-material/ElectricBoltRounded'
import PhoneRoundedIcon          from '@mui/icons-material/PhoneRounded'
import WhatsAppIcon              from '@mui/icons-material/WhatsApp'
import LockRoundedIcon           from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon     from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon           from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon  from '@mui/icons-material/DeleteOutlineRounded'
import PhotoCameraRoundedIcon    from '@mui/icons-material/PhotoCameraRounded'
import CheckCircleRoundedIcon    from '@mui/icons-material/CheckCircleRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppState }           from '../hooks/useAppState'
import { formatCurrency }        from '../utils/formatters'
import { getDisplayCity }        from '../utils/permissions'

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

  // Safe Category Normalization & Styling
  const rawCat = String(item.category || item.vehicle_type || item.vehicleType || '').trim().toLowerCase()
  let catStyle = { label: 'Vehicle', bg: '#F5F3FF', color: '#7C3AED', icon: <DirectionsCarRoundedIcon sx={{ fontSize: 13 }} /> }

  if (rawCat.includes('bike') || rawCat.includes('motorcycle')) {
    catStyle = { label: 'Bike', bg: '#F5F3FF', color: '#7C3AED', icon: <TwoWheelerRoundedIcon sx={{ fontSize: 13 }} /> }
  } else if (rawCat.includes('scooter')) {
    catStyle = { label: 'Scooter', bg: '#F0FDFA', color: '#0D9488', icon: <TwoWheelerRoundedIcon sx={{ fontSize: 13 }} /> }
  } else if (rawCat.includes('car')) {
    catStyle = { label: 'Car', bg: '#EFF6FF', color: '#2563EB', icon: <DirectionsCarRoundedIcon sx={{ fontSize: 13 }} /> }
  } else if (rawCat.includes('commercial') || rawCat.includes('truck') || rawCat.includes('bus') || rawCat.includes('auto')) {
    catStyle = { label: 'Commercial', bg: '#FFF7ED', color: '#C2410C', icon: <DirectionsCarRoundedIcon sx={{ fontSize: 13 }} /> }
  } else if (item.brand) {
    catStyle = { label: item.brand, bg: '#F5F3FF', color: '#7C3AED', icon: <DirectionsCarRoundedIcon sx={{ fontSize: 13 }} /> }
  }

  // Fuel Type Normalization & Badge
  const fuelType = String(item.fuelType || item.fuel_type || '').trim()
  const fuelLower = fuelType.toLowerCase()
  let fuelBadge = null
  if (fuelLower) {
    if (fuelLower.includes('electric') || fuelLower.includes('ev')) {
      fuelBadge = { label: 'Electric', bg: '#ECFDF5', color: '#047857', icon: <ElectricBoltRoundedIcon sx={{ fontSize: 12 }} /> }
    } else if (fuelLower.includes('diesel')) {
      fuelBadge = { label: 'Diesel', bg: '#F1F5F9', color: '#334155', icon: <LocalGasStationRoundedIcon sx={{ fontSize: 12 }} /> }
    } else if (fuelLower.includes('cng')) {
      fuelBadge = { label: 'CNG', bg: '#F0FDF4', color: '#15803D', icon: <LocalGasStationRoundedIcon sx={{ fontSize: 12 }} /> }
    } else {
      fuelBadge = { label: fuelType || 'Petrol', bg: '#FFF7ED', color: '#C2410C', icon: <LocalGasStationRoundedIcon sx={{ fontSize: 12 }} /> }
    }
  }

  // Location string
  const displayCity = getDisplayCity(item)
  const locationLabel = hasFullAccess
    ? (item.localAddress || item.local_address
        ? `${item.localAddress || item.local_address}, ${displayCity || item.city || ''}`.replace(/^,\s*|,\s*$/g, '')
        : (item.location || item.city || displayCity || 'Karnataka'))
    : (displayCity || item.city || 'Karnataka')

  const itemPrice = item.price ?? item.expectedPrice ?? item.expected_price

  // Contact info
  const contactNumber = item.contactNumber || item.contact || item.owner?.phone || ''
  const whatsappUrl = contactNumber
    ? `https://wa.me/91${contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi! I am interested in your vehicle "${item.title}" on EasyDeal.`
      )}`
    : null

  // Status for management views
  const statusStr = String(item.status || 'approved').toLowerCase()
  const isPending = statusStr === 'pending'
  const isRejected = statusStr === 'rejected'
  const isSuspended = statusStr === 'suspended'
  const isApproved = statusStr === 'approved' || (!isPending && !isRejected && !isSuspended)

  // Images list
  const images = Array.isArray(item.images) ? item.images : []
  const hasImages = images.length > 0 && Boolean(images[0])

  // Key Specifications
  const year = item.year || null
  const kmDriven = item.kmDriven ?? item.km_driven ?? null
  const transmission = item.transmission || null
  const ownership = item.ownership || null
  const rtoCode = item.rtoCode || item.rto_code || null
  const insuranceValidity = item.insuranceValidity || item.insurance_validity || null

  // Extract Top Highlights from details
  const details = item.details || {}
  const amenitiesObj = details.amenities || {}
  const highlightTags = []

  if (rtoCode) highlightTags.push(`RTO: ${rtoCode}`)
  if (amenitiesObj.loan_pending === 'No') highlightTags.push('✅ No Loan')
  if (amenitiesObj.accident_free === 'Yes' || amenitiesObj.no_accident === 'Yes') highlightTags.push('🛡️ Non-Accidental')
  if (amenitiesObj.service_history === 'Yes') highlightTags.push('📋 Full Service')
  if (amenitiesObj.single_owner === 'Yes') highlightTags.push('👤 1st Owner')
  if (insuranceValidity) highlightTags.push(`Ins: ${insuranceValidity}`)

  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        height: '100%',
        minHeight: locked ? 520 : 480,
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
      {/* ── Image / Header Section (Fixed Height 200px) ── */}
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
        {hasImages ? (
          <Box
            component="img"
            src={images[0]}
            alt={item.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: locked ? 'blur(6px)' : 'none',
              transform: locked ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s ease, filter 0.4s ease',
              '&:hover': { transform: locked ? 'scale(1.1)' : 'scale(1.04)' },
            }}
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
              <DirectionsCarRoundedIcon sx={{ fontSize: 28, color: '#7C3AED' }} />
            </Box>
            <Typography sx={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>
              No Photo Available
            </Typography>
          </Box>
        )}

        {/* Lock Overlay for Non-Premium */}
        {locked && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15,23,42,0.45)',
              backdropFilter: 'blur(3px)',
              color: '#fff',
            }}
          >
            <LockRoundedIcon sx={{ fontSize: 24, mb: 0.5 }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 800 }}>Photos Locked</Typography>
            <Typography sx={{ fontSize: '0.68rem', opacity: 0.88 }}>Click to view details</Typography>
          </Box>
        )}

        {/* Top-Left Category & Fuel Badges */}
        <Stack
          direction="row"
          spacing={0.8}
          alignItems="center"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
          }}
        >
          {/* Category Chip */}
          <Chip
            icon={catStyle.icon}
            label={catStyle.label}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.68rem',
              fontWeight: 800,
              background: catStyle.bg,
              color: catStyle.color,
              border: `1px solid ${catStyle.color}33`,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '& .MuiChip-icon': { color: catStyle.color, ml: 0.5 },
            }}
          />

          {/* Fuel Type Pill */}
          {fuelBadge && (
            <Chip
              icon={fuelBadge.icon}
              label={fuelBadge.label}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.68rem',
                fontWeight: 800,
                background: fuelBadge.bg,
                color: fuelBadge.color,
                border: `1px solid ${fuelBadge.color}33`,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '& .MuiChip-icon': { color: fuelBadge.color, ml: 0.5 },
              }}
            />
          )}
        </Stack>

        {/* Top-Right Status or Access Badge */}
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
                ? 'rgba(16,185,129,0.95)'
                : isPending
                ? 'rgba(245,158,11,0.95)'
                : isRejected
                ? 'rgba(239,68,68,0.95)'
                : 'rgba(100,116,139,0.95)',
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

        {/* Bottom-Right Photo Counter */}
        {images.length > 0 && !locked && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              px: 1,
              py: 0.3,
              borderRadius: '6px',
              background: 'rgba(15,23,42,0.7)',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 2,
            }}
          >
            <PhotoCameraRoundedIcon sx={{ fontSize: 12 }} />
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </Box>
        )}
      </Box>

      {/* ── Card Content Body ── */}
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
        <Stack spacing={1.5}>
          {/* Title (2 lines clamp) */}
          <Typography
            component={RouterLink}
            to={detailUrl}
            fontWeight={800}
            sx={{
              fontSize: '0.98rem',
              color: '#0F172A',
              textDecoration: 'none',
              letterSpacing: '-0.015em',
              lineHeight: 1.35,
              minHeight: 42,
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

          {/* Subtitle: Brand • Model */}
          {(item.brand || item.model) && (
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: '#64748B',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                mt: '-6px !important',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {[item.brand, item.model].filter(Boolean).join(' • ')}
            </Typography>
          )}

          {/* Location line */}
          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ overflow: 'hidden' }}>
            <LocationOnRoundedIcon sx={{ fontSize: 16, color: '#7C3AED', flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#64748B',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {locationLabel}
            </Typography>
          </Stack>

          {/* Description snippet */}
          {Boolean(item.description?.trim()) && (
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: '#64748B',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
              }}
            >
              {item.description.trim()}
            </Typography>
          )}

          {/* Key Vehicle Specifications Grid (Year, Km, Fuel/Transmission, Ownership) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 0.8,
              p: 1.2,
              borderRadius: '12px',
              bgcolor: '#F8FAFC',
              border: '1px solid #F1F5F9',
            }}
          >
            {/* Spec 1: Manufacturing Year */}
            <Stack direction="row" spacing={0.7} alignItems="center">
              <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: '#4361EE' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                {year ? `Year ${year}` : 'Recent Model'}
              </Typography>
            </Stack>

            {/* Spec 2: Kilometers Driven */}
            <Stack direction="row" spacing={0.7} alignItems="center">
              <SpeedRoundedIcon sx={{ fontSize: 15, color: '#7C3AED' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                {kmDriven ? `${Number(kmDriven).toLocaleString('en-IN')} km` : 'Low km'}
              </Typography>
            </Stack>

            {/* Spec 3: Transmission */}
            <Stack direction="row" spacing={0.7} alignItems="center">
              <TuneRoundedIcon sx={{ fontSize: 15, color: '#0F766E' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                {transmission || 'Manual'}
              </Typography>
            </Stack>

            {/* Spec 4: Ownership History */}
            <Stack direction="row" spacing={0.7} alignItems="center">
              <AssignmentIndRoundedIcon sx={{ fontSize: 15, color: '#D97706' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                {ownership || '1st Owner'}
              </Typography>
            </Stack>
          </Box>

          {/* Quick Highlight Pills */}
          {highlightTags.length > 0 && (
            <Stack direction="row" spacing={0.6} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {highlightTags.slice(0, 3).map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#475569',
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>

        {/* ── Bottom Section: Price + Action Buttons ── */}
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Divider sx={{ opacity: 0.7, mb: 1.5 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* Price block */}
            <Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Asking Price
              </Typography>
              <Typography
                fontWeight={900}
                sx={{
                  fontSize: '1.12rem',
                  color: '#7C3AED',
                  letterSpacing: '-0.02em',
                }}
              >
                {itemPrice != null && itemPrice !== '' ? formatCurrency(itemPrice) : 'Price on Request'}
              </Typography>
            </Box>

            {/* Actions block */}
            {locked ? (
              <Button
                component={RouterLink}
                to={detailUrl}
                size="small"
                startIcon={<VisibilityRoundedIcon sx={{ fontSize: '15px !important' }} />}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  bgcolor: '#7C3AED',
                  color: '#FFFFFF',
                  px: 1.8,
                  py: 0.7,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#6D28D9' },
                }}
              >
                Details
              </Button>
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
              <Stack direction="row" spacing={0.8} alignItems="center">
                {/* WhatsApp Chat Button */}
                {whatsappUrl && (
                  <Tooltip title="Chat on WhatsApp">
                    <Box
                      component="a"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        background: '#DCFCE7',
                        color: '#15803D',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { background: '#BBF7D0', transform: 'scale(1.05)' },
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 18 }} />
                    </Box>
                  </Tooltip>
                )}

                {/* Call Button */}
                {contactNumber && (
                  <Tooltip title={`Call ${contactNumber}`}>
                    <Box
                      component="a"
                      href={`tel:${contactNumber}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        background: '#EEF2FF',
                        color: '#4361EE',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { background: '#E0E7FF', transform: 'scale(1.05)' },
                      }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: 17 }} />
                    </Box>
                  </Tooltip>
                )}

                {/* View Details Button */}
                <Button
                  component={RouterLink}
                  to={detailUrl}
                  size="small"
                  startIcon={<VisibilityRoundedIcon sx={{ fontSize: '15px !important' }} />}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    bgcolor: '#7C3AED',
                    color: '#FFFFFF',
                    px: 1.6,
                    py: 0.7,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#6D28D9' },
                  }}
                >
                  Details
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Upgrade CTA for Non-Premium Members */}
          {locked && (
            <Button
              component={RouterLink}
              to="/subscription"
              variant="outlined"
              size="small"
              startIcon={<LockRoundedIcon sx={{ fontSize: '14px !important', flexShrink: 0 }} />}
              fullWidth
              sx={{
                borderRadius: '10px',
                borderColor: '#FDE68A',
                background: '#FFFBEB',
                color: '#B45309',
                fontWeight: 700,
                fontSize: '0.73rem',
                lineHeight: 1.35,
                minHeight: 36,
                height: 'auto',
                py: 0.8,
                px: 1.2,
                mt: 1.2,
                textTransform: 'none',
                textAlign: 'center',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& .MuiButton-startIcon': {
                  mr: 0.8,
                  ml: 0,
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'center',
                },
                '&:hover': {
                  background: '#FEF3C7',
                  borderColor: '#F59E0B',
                  color: '#92400E',
                },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  lineHeight: 'inherit',
                  color: 'inherit',
                  textAlign: 'center',
                }}
              >
                Upgrade to unlock seller contact & HD photos
              </Typography>
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
