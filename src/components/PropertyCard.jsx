// src/components/PropertyCard.jsx
import React from 'react'
import {
  Box, Button, Card, CardContent, Chip,
  Divider, Stack, Tooltip, Typography,
} from '@mui/material'
import ApartmentRoundedIcon      from '@mui/icons-material/ApartmentRounded'
import LocationOnRoundedIcon     from '@mui/icons-material/LocationOnRounded'
import BedRoundedIcon            from '@mui/icons-material/BedRounded'
import BathtubRoundedIcon        from '@mui/icons-material/BathtubRounded'
import SquareFootRoundedIcon     from '@mui/icons-material/SquareFootRounded'
import AgricultureRoundedIcon    from '@mui/icons-material/AgricultureRounded'
import WeekendRoundedIcon        from '@mui/icons-material/WeekendRounded'
import ExploreRoundedIcon        from '@mui/icons-material/ExploreRounded'
import LayersRoundedIcon         from '@mui/icons-material/LayersRounded'
import PhoneRoundedIcon          from '@mui/icons-material/PhoneRounded'
import WhatsAppIcon              from '@mui/icons-material/WhatsApp'
import LockRoundedIcon           from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon     from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon           from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon  from '@mui/icons-material/DeleteOutlineRounded'
import PhotoCameraRoundedIcon    from '@mui/icons-material/PhotoCameraRounded'
import CheckCircleRoundedIcon    from '@mui/icons-material/CheckCircleRounded'
import VerifiedRoundedIcon       from '@mui/icons-material/VerifiedRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppState }           from '../hooks/useAppState'
import { formatCurrency }        from '../utils/formatters'
import { formatLandArea, formatBuiltupArea } from '../utils/landUnits'
import { getDisplayCity }        from '../utils/permissions'

const TYPE_CONFIG = {
  Apartment:                  { bg: '#E0F2FE', color: '#0369A1', label: 'Apartment' },
  Flat:                       { bg: '#E0F2FE', color: '#0369A1', label: 'Flat' },
  Residential:                { bg: '#EEF2FF', color: '#4361EE', label: 'Residential' },
  'Agricultural / Farm Land': { bg: '#ECFDF5', color: '#047857', label: 'Agricultural Land' },
  Agricultural:               { bg: '#ECFDF5', color: '#047857', label: 'Agricultural Land' },
  'Site / Plot':              { bg: '#F5F3FF', color: '#6D28D9', label: 'Site / Plot' },
  Site:                       { bg: '#F5F3FF', color: '#6D28D9', label: 'Site / Plot' },
  Commercial:                 { bg: '#FFF7ED', color: '#C2410C', label: 'Commercial' },
  'Villa / Independent House':{ bg: '#FFF1F2', color: '#BE123C', label: 'Villa / House' },
  Villa:                      { bg: '#FFF1F2', color: '#BE123C', label: 'Villa' },
  Land:                       { bg: '#F0FDFA', color: '#0F766E', label: 'Land' },
}

export default function PropertyCard({ item, editUrl, onDelete }) {
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
  const detailUrl = `/properties/${item.id}`

  // Safe Property Type Normalization & Styling
  const rawType = item.propertyType || item.property_type || 'Property'
  let matchedKey = Object.keys(TYPE_CONFIG).find(
    (k) => rawType.toLowerCase().includes(k.toLowerCase())
  )
  const typeStyle = matchedKey ? TYPE_CONFIG[matchedKey] : { bg: '#F1F5F9', color: '#475569', label: rawType }

  // Transaction Type (Sale / Rent / Lease)
  const rentLeaseStr = String(item.rentLease || item.rent_lease || '').toLowerCase()
  const isRent = rentLeaseStr.includes('rent')
  const isLease = rentLeaseStr.includes('lease')
  const transBadge = isRent
    ? { label: 'For Rent', bg: '#EFF6FF', color: '#1D4ED8' }
    : isLease
    ? { label: 'For Lease', bg: '#FEF3C7', color: '#B45309' }
    : { label: 'For Sale', bg: '#ECFDF5', color: '#047857' }

  // Location string
  const displayCity = getDisplayCity(item)
  const locationLabel = hasFullAccess
    ? (item.localAddress || item.local_address
        ? `${item.localAddress || item.local_address}, ${displayCity || item.city || ''}`.replace(/^,\s*|,\s*$/g, '')
        : (item.location || displayCity || 'Karnataka'))
    : (displayCity || item.city || 'Karnataka')

  const itemPrice = item.price ?? item.expectedPrice ?? item.expected_price
  const rentAdvance = item.rentAdvanceAmount ?? item.rent_advance_amount

  // Contact info
  const contactNumber = item.contactNumber || item.contact || item.owner?.phone || ''
  const whatsappUrl = contactNumber
    ? `https://wa.me/91${contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hi! I am interested in your property "${item.title}" on EasyDeal.`
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
  const bedrooms = item.bedrooms ?? item.rooms ?? null
  const bathrooms = item.bathrooms ?? null
  const details = item.details || {}
  const acresGuntas = item.acres_guntas || details.acres_guntas || item.acresGuntas || null
  const landArea = item.landArea || item.land_area || acresGuntas || null
  const builtupArea = item.area || null
  const formattedArea = formatLandArea(landArea) || formatBuiltupArea(builtupArea) || acresGuntas
  const furnishing = item.furnishing || null
  const facing = item.facing || null
  const floor = item.floor || null
  const cropsGrown = item.cropsGrown || item.crops_grown || (details.suitable_crops ? (Array.isArray(details.suitable_crops) ? details.suitable_crops.join(', ') : details.suitable_crops) : null)
  const soilType = details.soil ? (Array.isArray(details.soil) ? details.soil.join(', ') : details.soil) : null
  const ownershipType = details.ownership || item.ownership || null

  // Extract Top 2-3 Amenities / Highlights from details
  const amenitiesObj = details.amenities || {}
  const highlightTags = []

  if (amenitiesObj.gated === 'Yes' || details.gated_community === 'Yes') highlightTags.push('🛡️ Gated')
  if (amenitiesObj.parking === 'Yes' || item.parking) highlightTags.push('🚗 Parking')
  if (amenitiesObj.water_supply === 'Yes' || item.waterSupply || item.water_supply) highlightTags.push('💧 Water')
  if (amenitiesObj.lift === 'Yes') highlightTags.push('🛗 Lift')
  if (amenitiesObj.power_backup === 'Yes') highlightTags.push('⚡ Backup')
  if (amenitiesObj.borewell === 'Yes') highlightTags.push('🚰 Borewell')
  if (amenitiesObj.clear_title === 'Yes' || amenitiesObj.registered === 'Yes') highlightTags.push('✅ Clear Title')
  if (amenitiesObj.khata_rtc === 'Yes') highlightTags.push('📜 RTC / Khata')

  // Full list of verified amenities for dynamic hover preview
  const verifiedAmenitiesList = []
  const AMENITY_MAP = {
    water_supply: 'Water Supply',
    borewell: 'Borewell',
    electricity: 'Electricity',
    road_access: 'Road Access',
    clear_title: 'Clear Title',
    registered: 'Registered',
    khata_rtc: 'Khata / RTC',
    fenced: 'Fenced',
    gated: 'Gated',
    parking: 'Parking',
    lift: 'Elevator',
    power_backup: 'Power Backup',
    market: 'Market Nearby',
    school: 'School Nearby',
    hospital: 'Hospital Nearby',
    bank_atm: 'ATM Nearby',
    public_transport: 'Public Transit',
  }
  Object.entries(amenitiesObj).forEach(([k, v]) => {
    if (v === 'Yes' || v === true) {
      verifiedAmenitiesList.push(AMENITY_MAP[k] || k.replace(/_/g, ' '))
    }
  })

  // Dynamic Hover Details Tooltip
  const renderHoverPreview = () => (
    <Box sx={{ p: 0.5, maxWidth: 320 }}>
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
        <Chip
          label={typeStyle.label}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.62rem',
            fontWeight: 800,
            bgcolor: 'rgba(20,184,166,0.2)',
            color: '#2DD4BF',
            border: '1px solid rgba(45,212,191,0.35)',
          }}
        />
        <Chip
          label={transBadge.label}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.62rem',
            fontWeight: 800,
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#F8FAFC',
          }}
        />
      </Stack>

      <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', mb: 0.4, lineHeight: 1.35 }}>
        {item.title}
      </Typography>

      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <LocationOnRoundedIcon sx={{ fontSize: 13, color: '#14B8A6', flexShrink: 0 }} />
        {locationLabel}
      </Typography>

      {/* Dynamic Key Specs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 0.6,
          p: 0.8,
          borderRadius: '8px',
          bgcolor: 'rgba(255,255,255,0.06)',
          mb: 1,
        }}
      >
        {bedrooms && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🛏️ <strong>{bedrooms}</strong> BHK
          </Typography>
        )}
        {bathrooms && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🚿 <strong>{bathrooms}</strong> Baths
          </Typography>
        )}
        {floor && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🏢 Floor: <strong>{floor}</strong>
          </Typography>
        )}
        {formattedArea && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            📐 <strong>{formattedArea}</strong>
          </Typography>
        )}
        {acresGuntas && formattedArea !== acresGuntas && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🌾 <strong>{acresGuntas}</strong>
          </Typography>
        )}
        {cropsGrown && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            🌱 <strong>{cropsGrown.split(',')[0]}</strong>
          </Typography>
        )}
        {soilType && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🧱 Soil: <strong>{soilType}</strong>
          </Typography>
        )}
        {furnishing && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🛋️ <strong>{furnishing}</strong>
          </Typography>
        )}
        {facing && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            🧭 <strong>{facing}</strong> Facing
          </Typography>
        )}
        {ownershipType && (
          <Typography sx={{ fontSize: '0.7rem', color: '#E2E8F0' }}>
            📜 <strong>{ownershipType}</strong>
          </Typography>
        )}
      </Box>

      {/* Verified Amenities */}
      {verifiedAmenitiesList.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '0.64rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', mb: 0.4 }}>
            Verified Amenities
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.4 }}>
            {verifiedAmenitiesList.slice(0, 5).map((am, i) => (
              <Chip
                key={i}
                label={`✔ ${am}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(20,184,166,0.15)',
                  color: '#2DD4BF',
                  border: '1px solid rgba(45,212,191,0.25)',
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Price row */}
      <Box sx={{ pt: 0.6, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8' }}>
          {isRent ? 'Monthly Rent' : isLease ? 'Lease Deposit' : 'Asking Price'}:
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 900, color: '#2DD4BF' }}>
          {itemPrice != null && itemPrice !== '' ? formatCurrency(itemPrice) : 'Contact'} {isRent ? '/ mo' : ''}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '0.62rem', color: '#64748B', textAlign: 'center', mt: 0.6 }}>
        💡 Click Details to view HD photos, verify documents & contact owner
      </Typography>
    </Box>
  )

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
          background: `linear-gradient(135deg, ${typeStyle.bg} 0%, #F8FAFC 100%)`,
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
                background: typeStyle.color + '1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ApartmentRoundedIcon sx={{ fontSize: 28, color: typeStyle.color }} />
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

        {/* Top-Left Category & Transaction Badges */}
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
          {/* Specific Property Type */}
          <Chip
            label={typeStyle.label}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.68rem',
              fontWeight: 800,
              background: typeStyle.bg,
              color: typeStyle.color,
              border: `1px solid ${typeStyle.color}33`,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />

          {/* Transaction Pill (Sale / Rent) */}
          <Chip
            label={transBadge.label}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.68rem',
              fontWeight: 800,
              background: transBadge.bg,
              color: transBadge.color,
              border: `1px solid ${transBadge.color}33`,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
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
              background: 'rgba(16,185,129,0.92)',
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
              '&:hover': { color: '#0F766E' },
            }}
          >
            {item.title}
          </Typography>

          {/* Location line */}
          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ overflow: 'hidden' }}>
            <LocationOnRoundedIcon sx={{ fontSize: 16, color: '#0F766E', flexShrink: 0 }} />
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

          {/* Key Specifications Grid (Bedrooms, Bathrooms, Area, Furnishing/Facing) */}
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
            {/* Spec 1: Configuration / Bedrooms / Crops */}
            {bedrooms ? (
              <Tooltip title={`Configuration: ${bedrooms} Bedrooms`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <BedRoundedIcon sx={{ fontSize: 16, color: '#4361EE' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                    {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : cropsGrown ? (
              <Tooltip title={`Suitable Crops: ${cropsGrown}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <AgricultureRoundedIcon sx={{ fontSize: 16, color: '#047857' }} />
                  <Typography sx={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cropsGrown.split(',')[0]}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : (
              <Tooltip title={`Property Category: ${typeStyle.label}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <ApartmentRoundedIcon sx={{ fontSize: 16, color: '#0284C7' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                    {typeStyle.label}
                  </Typography>
                </Stack>
              </Tooltip>
            )}

            {/* Spec 2: Bathrooms or Floor */}
            {bathrooms ? (
              <Tooltip title={`Bathrooms: ${bathrooms}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <BathtubRoundedIcon sx={{ fontSize: 15, color: '#0284C7' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                    {bathrooms} {bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : floor ? (
              <Tooltip title={`Floor Level: Floor ${floor}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <LayersRoundedIcon sx={{ fontSize: 15, color: '#6366F1' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                    Floor {floor}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : (
              <Tooltip title="Verified Property Listing" arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <VerifiedRoundedIcon sx={{ fontSize: 15, color: '#059669' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Verified
                  </Typography>
                </Stack>
              </Tooltip>
            )}

            {/* Spec 3: Area / Land Size */}
            {formattedArea ? (
              <Tooltip title={`Total Area / Land Size: ${formattedArea}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <SquareFootRoundedIcon sx={{ fontSize: 16, color: '#7C3AED' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700 }}>
                    {formattedArea}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : (
              <Tooltip title="Plot / Site Area available on request" arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <SquareFootRoundedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                  <Typography sx={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                    Plot / Site
                  </Typography>
                </Stack>
              </Tooltip>
            )}

            {/* Spec 4: Furnishing or Facing */}
            {furnishing ? (
              <Tooltip title={`Furnishing Status: ${furnishing}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <WeekendRoundedIcon sx={{ fontSize: 15, color: '#EA580C' }} />
                  <Typography sx={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {furnishing}
                  </Typography>
                </Stack>
              </Tooltip>
            ) : facing ? (
              <Tooltip title={`Facing: ${facing}`} arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <ExploreRoundedIcon sx={{ fontSize: 15, color: '#D97706' }} />
                  <Typography sx={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 700 }}>
                    {facing} Facing
                  </Typography>
                </Stack>
              </Tooltip>
            ) : (
              <Tooltip title="Possession: Ready to Move" arrow>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  <CheckCircleRoundedIcon sx={{ fontSize: 15, color: '#0F766E' }} />
                  <Typography sx={{ fontSize: '0.76rem', color: '#0F766E', fontWeight: 700 }}>
                    Ready to Move
                  </Typography>
                </Stack>
              </Tooltip>
            )}
          </Box>

          {/* Quick Highlight Pills (if any amenities matched) */}
          {highlightTags.length > 0 && (
            <Stack direction="row" spacing={0.6} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {highlightTags.slice(0, 3).map((tag, idx) => (
                <Tooltip key={idx} title={`Verified Feature: ${tag}`} arrow>
                  <Chip
                    label={tag}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      color: '#475569',
                      cursor: 'default',
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          )}
        </Stack>

        {/* ── Bottom Section: Price + Action Buttons ── */}
        <Box sx={{ mt: 'auto', pt: 1.5 }}>
          <Divider sx={{ opacity: 0.7, mb: 1.5 }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            {/* Price block */}
            <Box sx={{ minWidth: 0, flexShrink: 1, pr: 0.5 }}>
              <Typography sx={{ fontSize: '0.66rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isRent ? 'Monthly Rent' : isLease ? 'Lease Deposit' : 'Expected Price'}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.4} sx={{ flexWrap: 'nowrap' }}>
                <Typography
                  fontWeight={900}
                  sx={{
                    fontSize: { xs: '1.02rem', sm: '1.08rem' },
                    color: '#0F766E',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {itemPrice != null && itemPrice !== '' ? formatCurrency(itemPrice) : 'Contact for Price'}
                </Typography>
                {isRent && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    / mo
                  </Typography>
                )}
              </Stack>
              {rentAdvance && isRent && (
                <Typography sx={{ fontSize: '0.64rem', color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Advance: {formatCurrency(rentAdvance)}
                </Typography>
              )}
            </Box>

            {/* Actions block */}
            {locked ? (
              <Tooltip
                arrow
                placement="top"
                enterDelay={120}
                leaveDelay={200}
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#0F172A',
                      color: '#F8FAFC',
                      borderRadius: '14px',
                      p: 1.5,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    },
                  },
                  arrow: { sx: { color: '#0F172A' } },
                }}
                title={renderHoverPreview()}
              >
                <Button
                  component={RouterLink}
                  to={detailUrl}
                  size="small"
                  startIcon={<VisibilityRoundedIcon sx={{ fontSize: '15px !important' }} />}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    bgcolor: '#0F766E',
                    color: '#FFFFFF',
                    px: 1.6,
                    py: 0.65,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: '#0D655E',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(15,118,110,0.35)',
                    },
                  }}
                >
                  Details
                </Button>
              </Tooltip>
            ) : (editUrl || onDelete) ? (
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ ml: 'auto', flexShrink: 0 }}>
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
                      whiteSpace: 'nowrap',
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
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: '#FEE2E2', borderColor: '#FCA5A5' },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
            ) : (
              <Stack direction="row" spacing={0.7} alignItems="center" sx={{ ml: 'auto', flexShrink: 0 }}>
                {/* WhatsApp Chat Button */}
                {whatsappUrl && (
                  <Tooltip title="Chat with seller on WhatsApp">
                    <Box
                      component="a"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: '#DCFCE7',
                        color: '#15803D',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                        '&:hover': { background: '#BBF7D0', transform: 'scale(1.05)' },
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 17 }} />
                    </Box>
                  </Tooltip>
                )}

                {/* Call Button */}
                {contactNumber && (
                  <Tooltip title={`Call seller: ${contactNumber}`}>
                    <Box
                      component="a"
                      href={`tel:${contactNumber}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: '#EEF2FF',
                        color: '#4361EE',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                        '&:hover': { background: '#E0E7FF', transform: 'scale(1.05)' },
                      }}
                    >
                      <PhoneRoundedIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Tooltip>
                )}

                {/* View Details Button with Dynamic Hover Tooltip */}
                <Tooltip
                  arrow
                  placement="top"
                  enterDelay={120}
                  leaveDelay={200}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#0F172A',
                        color: '#F8FAFC',
                        borderRadius: '14px',
                        p: 1.5,
                        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      },
                    },
                    arrow: { sx: { color: '#0F172A' } },
                  }}
                  title={renderHoverPreview()}
                >
                  <Button
                    component={RouterLink}
                    to={detailUrl}
                    size="small"
                    startIcon={<VisibilityRoundedIcon sx={{ fontSize: '15px !important' }} />}
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                      bgcolor: '#0F766E',
                      color: '#FFFFFF',
                      px: 1.5,
                      py: 0.65,
                      minWidth: 'auto',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        bgcolor: '#0D655E',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(15,118,110,0.35)',
                      },
                    }}
                  >
                    Details
                  </Button>
                </Tooltip>
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
