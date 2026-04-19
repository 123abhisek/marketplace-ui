
// src/pages/PropertyDetailPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Alert, Box, Button, Chip, CircularProgress, Divider,
  Grid, IconButton, Paper, Stack, Typography,
} from '@mui/material'
import ArrowBackRoundedIcon        from '@mui/icons-material/ArrowBackRounded'
import PlaceRoundedIcon            from '@mui/icons-material/PlaceRounded'
import BedRoundedIcon              from '@mui/icons-material/BedRounded'
import SquareFootRoundedIcon       from '@mui/icons-material/SquareFootRounded'
import LayersRoundedIcon           from '@mui/icons-material/LayersRounded'
import MeetingRoomRoundedIcon      from '@mui/icons-material/MeetingRoomRounded'
import PhoneRoundedIcon            from '@mui/icons-material/PhoneRounded'
import HomeWorkRoundedIcon         from '@mui/icons-material/HomeWorkRounded'
import CheckCircleRoundedIcon      from '@mui/icons-material/CheckCircleRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import TrendingUpRoundedIcon       from '@mui/icons-material/TrendingUpRounded'
import AgricultureRoundedIcon      from '@mui/icons-material/AgricultureRounded'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import CloseRoundedIcon            from '@mui/icons-material/CloseRounded'
import ChevronLeftRoundedIcon      from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon     from '@mui/icons-material/ChevronRightRounded'
import { propertyService }         from '../services/api'
import { useAppState }             from '../hooks/useAppState'
import { formatCurrency }          from '../utils/formatters'
import BookingModal                from '../components/BookingModal'

// ─── SpecRow ──────────────────────────────────────────────────────────────────
const SpecRow = ({ label, value }) =>
  value ? (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        py: 1.3,
        borderBottom: '1px solid rgba(226,232,240,0.6)',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, minWidth: 130 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>
        {value}
      </Typography>
    </Stack>
  ) : null

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, active, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed', inset: 0, zIndex: 1400,
        background: 'rgba(10,14,26,0.94)',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Close */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute', top: 16, right: 16,
          color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.06)',
          '&:hover': { background: 'rgba(255,255,255,0.14)' },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      {/* Counter */}
      <Typography sx={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
        {active + 1} / {images.length}
      </Typography>

      {/* Prev */}
      <IconButton
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        sx={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.06)',
          '&:hover': { background: 'rgba(255,255,255,0.14)' },
        }}
      >
        <ChevronLeftRoundedIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {/* Image */}
      <Box
        component="img"
        src={images[active]}
        alt={`Photo ${active + 1}`}
        onClick={(e) => e.stopPropagation()}
        sx={{
          maxWidth: '90vw', maxHeight: '80vh',
          objectFit: 'contain', borderRadius: '12px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      />

      {/* Next */}
      <IconButton
        onClick={(e) => { e.stopPropagation(); onNext() }}
        sx={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.06)',
          '&:hover': { background: 'rgba(255,255,255,0.14)' },
        }}
      >
        <ChevronRightRoundedIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {/* Thumbnail strip */}
      <Stack
        direction="row" spacing={1}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'absolute', bottom: 20,
          maxWidth: '90vw', overflowX: 'auto', pb: 0.5,
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.3)', borderRadius: 2 },
        }}
      >
        {images.map((img, i) => (
          <Box
            key={i}
            component="img"
            src={img}
            alt=""
            onClick={() => { /* handled by parent onPrev/onNext, or add onSelect prop */ }}
            sx={{
              width: 60, height: 44, objectFit: 'cover', borderRadius: '7px',
              flexShrink: 0, cursor: 'pointer',
              border: active === i ? '2px solid #0d9488' : '2px solid rgba(255,255,255,0.15)',
              opacity: active === i ? 1 : 0.55,
              transition: 'all .15s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { user }     = useAppState()

  const [property,     setProperty]     = useState(null)
  const [activeImg,    setActiveImg]    = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [bookingOpen,  setBookingOpen]  = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    propertyService.getOne(id)
      .then((data) => { setProperty(data); setActiveImg(0) })
      .catch(() => setError('Could not load property. Please try again.'))
      .finally(() => setLoading(false))
  }, [id])

  const images = property?.images?.filter(Boolean) ?? []
  const price  = property?.price ?? property?.expected_price

  const prevImg = useCallback(() => setActiveImg(i => (i - 1 + images.length) % images.length), [images.length])
  const nextImg = useCallback(() => setActiveImg(i => (i + 1) % images.length), [images.length])

  // Premium gate: contact & full details hidden for free users
  const isPremium    = user?.is_premium || user?.isPremium
  const ownerName    = property?.owner?.name    ?? property?.owner_name    ?? 'Owner'
  const ownerPhone   = property?.owner?.phone   ?? property?.contact        ?? null
  const premiumMsg   = property?.message        ?? null
  const contactVisible = isPremium || !premiumMsg  // show contact only if premium OR no gate

  if (loading) return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: '#0f766e' }} />
    </Box>
  )

  if (error) return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, px: 3 }}>
      <Alert severity="error" sx={{ borderRadius: '14px' }}>{error}</Alert>
      <Button onClick={() => navigate(-1)} startIcon={<ArrowBackRoundedIcon />} sx={{ mt: 2, color: '#0f766e' }}>
        Go back
      </Button>
    </Box>
  )

  if (!property) return null

  const listingLabel = property.rent_lease === 'Rent' ? 'Monthly Rent' : 'Expected Price'

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', pb: 10 }}>

      {/* ── Sticky Top Bar ── */}
      <Box sx={{
        background: '#fff',
        borderBottom: '1px solid rgba(226,232,240,0.9)',
        px: { xs: 2, sm: 4 }, py: 1.5,
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              onClick={() => navigate(-1)} size="small"
              sx={{ border: '1px solid rgba(226,232,240,0.9)', borderRadius: '10px' }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Stack direction="row" spacing={1} alignItems="center">
              <HomeWorkRoundedIcon sx={{ fontSize: 18, color: '#0f766e' }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                Property Details
              </Typography>
            </Stack>
          </Stack>
          {property.property_type && (
            <Chip
              label={property.property_type}
              size="small"
              sx={{
                height: 24, borderRadius: '7px', fontWeight: 700, fontSize: '0.72rem',
                background: 'rgba(15,118,110,0.08)', color: '#0f766e',
                border: '1px solid rgba(15,118,110,0.18)',
              }}
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 1160, mx: 'auto', px: { xs: 2, sm: 4 }, pt: 4 }}>
        <Grid container spacing={4}>

          {/* ──────────────── LEFT COLUMN ──────────────── */}
          <Grid item xs={12} md={7}>

            {/* Photo grid: 1 large + up to 3 side */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: images.length > 1 ? '1.35fr 1fr' : '1fr',
              gridTemplateRows: '260px 130px',
              gap: '6px',
              borderRadius: '18px',
              overflow: 'hidden',
              mb: 2,
            }}>
              {/* Main hero */}
              <Box
                onClick={() => images.length > 0 && setLightboxOpen(true)}
                sx={{
                  gridRow: '1 / 3',
                  background: 'linear-gradient(145deg,#ede9ff,#f4f3ff)',
                  cursor: images.length > 0 ? 'zoom-in' : 'default',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {images.length > 0 ? (
                  <Box
                    component="img" src={images[activeImg]} alt={property.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HomeWorkRoundedIcon sx={{ fontSize: 80, color: '#a78bfa', opacity: 0.35 }} />
                  </Box>
                )}
                {images.length > 1 && (
                  <Box sx={{
                    position: 'absolute', bottom: 10, right: 12,
                    background: 'rgba(15,23,42,0.62)', backdropFilter: 'blur(6px)',
                    borderRadius: '999px', px: 1.5, py: 0.35,
                  }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>
                      {activeImg + 1} / {images.length}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Side thumbnails (up to 3) */}
              {images.length > 1 && [1, 2, 3].map((idx) => {
                if (!images[idx] && idx !== 3) return null
                const isLast = idx === 3
                const remaining = images.length - 3
                return (
                  <Box
                    key={idx}
                    onClick={() => { if (images[idx]) { setActiveImg(idx); setLightboxOpen(true) } }}
                    sx={{
                      background: '#e2e8f0', cursor: 'pointer',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {images[idx] && (
                      <Box component="img" src={images[idx]} alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    {isLast && remaining > 0 && (
                      <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(15,23,42,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                          +{remaining} more
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>

            {/* Thumbnail scroll strip */}
            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1, mb: 2,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 2 },
              }}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setActiveImg(i)}
                    component="img" src={img} alt={`Image ${i + 1}`}
                    sx={{
                      width: 76, height: 56, objectFit: 'cover',
                      borderRadius: '10px', flexShrink: 0, cursor: 'pointer',
                      border: activeImg === i ? '2.5px solid #0f766e' : '2.5px solid transparent',
                      opacity: activeImg === i ? 1 : 0.6,
                      transition: 'all .15s ease',
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Title + location */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip
                label={property.property_type || 'Property'}
                size="small"
                icon={<HomeWorkRoundedIcon sx={{ fontSize: 12 }} />}
                sx={{
                  height: 24, borderRadius: '999px', fontWeight: 800, fontSize: '0.7rem',
                  background: 'rgba(15,118,110,0.08)', color: '#0f766e',
                  border: '1px solid rgba(15,118,110,0.18)',
                  '& .MuiChip-icon': { color: '#0f766e' },
                }}
              />
              {property.rent_lease && (
                <Chip
                  label={property.rent_lease}
                  size="small"
                  sx={{
                    height: 24, borderRadius: '999px', fontWeight: 800, fontSize: '0.7rem',
                    background: 'rgba(14,77,106,0.08)', color: '#0e4d6a',
                    border: '1px solid rgba(14,77,106,0.18)',
                  }}
                />
              )}
            </Stack>

            <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.03em', mb: 0.8, mt: 1 }}>
              {property.title}
            </Typography>

            {property.apartment_name && (
              <Typography sx={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, mb: 0.5 }}>
                {property.apartment_name}
              </Typography>
            )}

            {property.location && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2.5 }}>
                <PlaceRoundedIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  {property.location}
                </Typography>
              </Stack>
            )}

            <Divider sx={{ borderColor: 'rgba(226,232,240,0.7)', mb: 3 }} />

            {/* Property Details Table */}
            <Box sx={{ background: '#fff', borderRadius: '18px', border: '1.5px solid rgba(226,232,240,0.9)', overflow: 'hidden', mb: 3 }}>
              <Box sx={{ px: 2.5, py: 1.8, background: '#f8fafc', borderBottom: '1px solid rgba(226,232,240,0.7)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                  Property Details
                </Typography>
              </Box>
              <Box sx={{ px: 2.5, py: 0.5 }}>
                <SpecRow label="Property Type"  value={property.property_type} />
                <SpecRow label="Listing Type"   value={property.rent_lease} />
                <SpecRow label="Bedrooms"       value={property.bedrooms} />
                <SpecRow label="Rooms"          value={property.rooms} />
                <SpecRow label="Area"           value={property.area ? `${property.area}` : null} />
                <SpecRow label="Floor"          value={property.floor} />
                <SpecRow label="Apartment"      value={property.apartment_name} />
                <SpecRow label="Location"       value={property.location} />
                <SpecRow label="City"           value={property.city} />
                <SpecRow label="State"          value={property.state} />
                <SpecRow label="Pincode"        value={property.pincode} />
                <SpecRow
                  label="Listed On"
                  value={property.created_at
                    ? new Date(property.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                    : null}
                />
              </Box>
            </Box>

            {/* Agricultural Info */}
            {(property.land_area || property.crops_grown) && (
              <Box sx={{ background: '#fff', borderRadius: '18px', border: '1.5px solid rgba(226,232,240,0.9)', overflow: 'hidden', mb: 3 }}>
                <Box sx={{ px: 2.5, py: 1.8, background: '#f8fafc', borderBottom: '1px solid rgba(226,232,240,0.7)' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AgricultureRoundedIcon sx={{ fontSize: 17, color: '#0f766e' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      Agricultural Info
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ px: 2.5, py: 0.5 }}>
                  <SpecRow label="Land Area"   value={property.land_area} />
                  <SpecRow label="Crops Grown" value={property.crops_grown} />
                </Box>
              </Box>
            )}

            {/* Popularity banner */}
            <Box sx={{
              borderRadius: '14px', px: 2.5, py: 1.8,
              background: 'rgba(15,118,110,0.05)',
              border: '1.5px solid rgba(15,118,110,0.14)',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <TrendingUpRoundedIcon sx={{ fontSize: 22, color: '#0f766e', flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontSize: '0.87rem', fontWeight: 800, color: '#0f766e' }}>
                  This property is popular
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#0f766e', opacity: 0.75 }}>
                  Added to 12 wishlists this week. Explore virtually!
                </Typography>
              </Box>
            </Box>

          </Grid>

          {/* ──────────────── RIGHT COLUMN — STICKY BOOKING CARD ──────────────── */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 70 } }}>

              {/* Quick stat badges */}
              <Stack direction="row" spacing={1.2} sx={{ mb: 2.5 }} flexWrap="wrap">
                {[
                  { icon: <BedRoundedIcon sx={{ fontSize: 16 }} />,          value: property.bedrooms, label: 'Beds' },
                  { icon: <MeetingRoomRoundedIcon sx={{ fontSize: 16 }} />,   value: property.rooms,    label: 'Rooms' },
                  { icon: <SquareFootRoundedIcon sx={{ fontSize: 16 }} />,    value: property.area,     label: 'Area' },
                  { icon: <LayersRoundedIcon sx={{ fontSize: 16 }} />,        value: property.floor,    label: 'Floor' },
                ].filter(d => d.value).map((d, i) => (
                  <Box key={i} sx={{
                    flex: 1, minWidth: 64, px: 1.2, py: 1.4,
                    borderRadius: '14px', background: '#fff',
                    border: '1.5px solid rgba(226,232,240,0.9)',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                  }}>
                    <Box sx={{ color: '#0f766e', display: 'flex', justifyContent: 'center', mb: 0.4 }}>{d.icon}</Box>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{d.value}</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.3 }}>{d.label}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Main booking card */}
              <Paper variant="outlined" sx={{ borderRadius: '22px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(15,23,42,0.09)', border: '1.5px solid rgba(226,232,240,0.9)' }}>

                {/* Price header */}
                <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: '1px solid rgba(226,232,240,0.7)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                        {listingLabel}
                      </Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: '2.1rem', color: '#0f172a', letterSpacing: '-0.05em', lineHeight: 1 }}>
                        {price ? formatCurrency(price) : '—'}
                      </Typography>
                    </Box>
                    <Chip
                      label={property.rent_lease || 'For Sale'}
                      size="small"
                      sx={{
                        height: 24, borderRadius: '7px', fontWeight: 800, fontSize: '0.66rem',
                        background: 'rgba(34,197,94,0.09)', color: '#16a34a',
                        border: '1px solid rgba(34,197,94,0.22)',
                      }}
                    />
                  </Stack>
                </Box>

                {/* Quick info grid */}
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(226,232,240,0.7)' }}>
                  <Grid container rowSpacing={1.5} columnSpacing={2}>
                    {[
                      { icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,     label: property.property_type || '—' },
                      { icon: <LayersRoundedIcon sx={{ fontSize: 14 }} />,        label: property.floor || '—' },
                      { icon: <SquareFootRoundedIcon sx={{ fontSize: 14 }} />,    label: property.area  || '—' },
                      { icon: <PlaceRoundedIcon sx={{ fontSize: 14 }} />,         label: property.location || '—' },
                    ].map((d, i) => (
                      <Grid item xs={6} key={i}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Box sx={{ color: '#0f766e', flexShrink: 0 }}>{d.icon}</Box>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{d.label}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Seller section */}
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(226,232,240,0.7)' }}>
                  <Typography sx={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.2 }}>
                    Listed By
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                      width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg,#0f766e,#0d9488)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem' }}>
                        {ownerName.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                          {ownerName}
                        </Typography>
                        <CheckCircleRoundedIcon sx={{ fontSize: 14, color: '#0f766e' }} />
                      </Stack>
                      <Typography sx={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 500 }}>
                        Verified Owner
                      </Typography>
                    </Box>
                    {contactVisible && ownerPhone ? (
                      <Button
                        component="a" href={`tel:${ownerPhone}`}
                        size="small"
                        startIcon={<PhoneRoundedIcon sx={{ fontSize: 14 }} />}
                        variant="outlined"
                        sx={{
                          borderRadius: '10px', px: 1.5, py: 0.7,
                          fontSize: '0.75rem', fontWeight: 700, textTransform: 'none',
                          borderColor: 'rgba(15,118,110,0.35)', color: '#0f766e',
                          '&:hover': { borderColor: '#0f766e', background: 'rgba(15,118,110,0.04)' },
                        }}
                      >
                        Call
                      </Button>
                    ) : (
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        px: 1.5, py: 0.7, borderRadius: '10px',
                        background: 'rgba(124,58,237,0.07)',
                        border: '1px solid rgba(124,58,237,0.2)',
                      }}>
                        <LockRoundedIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                        <Typography sx={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>Premium</Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Premium gate message */}
                  {premiumMsg && !isPremium && (
                    <Box sx={{
                      mt: 1.5, px: 1.8, py: 1.2, borderRadius: '10px',
                      background: 'rgba(124,58,237,0.05)',
                      border: '1px solid rgba(124,58,237,0.18)',
                    }}>
                      <Typography sx={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600, lineHeight: 1.5 }}>
                        {premiumMsg}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Price breakdown */}
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(226,232,240,0.7)', background: '#fafbfc' }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.81rem', color: '#64748b', fontWeight: 500 }}>Property Price</Typography>
                      <Typography sx={{ fontSize: '0.81rem', color: '#0f172a', fontWeight: 700 }}>{price ? formatCurrency(price) : '—'}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.81rem', color: '#64748b', fontWeight: 500 }}>Booking Fee</Typography>
                      <Typography sx={{ fontSize: '0.81rem', color: '#0f172a', fontWeight: 700 }}>₹499</Typography>
                    </Stack>
                    <Divider sx={{ my: 0.4, borderColor: 'rgba(226,232,240,0.8)' }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontSize: '0.87rem', color: '#0f172a', fontWeight: 800 }}>Total Now</Typography>
                      <Typography sx={{ fontSize: '0.87rem', color: '#0f766e', fontWeight: 900 }}>₹499</Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* CTA buttons */}
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Stack spacing={1.2}>
                    <Button
                      fullWidth
                      onClick={() => setBookingOpen(true)}
                      startIcon={<CheckCircleRoundedIcon sx={{ fontSize: 17 }} />}
                      sx={{
                        borderRadius: '12px', py: 1.45,
                        fontWeight: 800, fontSize: '0.95rem', textTransform: 'none',
                        background: 'linear-gradient(135deg,#0f766e,#0d9488)',
                        color: '#fff', boxShadow: '0 8px 24px rgba(15,118,110,0.28)',
                        '&:hover': { background: 'linear-gradient(135deg,#0a5c55,#0f766e)', transform: 'translateY(-1px)' },
                        transition: 'all .18s ease',
                      }}
                    >
                      Book & Pay Now
                    </Button>

                    {contactVisible && ownerPhone && (
                      <Button
                        fullWidth component="a" href={`tel:${ownerPhone}`}
                        startIcon={<PhoneRoundedIcon sx={{ fontSize: 16 }} />}
                        variant="outlined"
                        sx={{
                          borderRadius: '12px', py: 1.35,
                          fontWeight: 700, fontSize: '0.9rem', textTransform: 'none',
                          borderColor: 'rgba(15,118,110,0.30)', color: '#0f766e',
                          '&:hover': { borderColor: '#0f766e', background: 'rgba(15,118,110,0.04)' },
                        }}
                      >
                        Call Owner
                      </Button>
                    )}

                    {!isPremium && (
                      <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="center" sx={{ pt: 0.5 }}>
                        <WorkspacePremiumRoundedIcon sx={{ fontSize: 13, color: '#7c3aed' }} />
                        <Typography sx={{ fontSize: '0.73rem', color: '#7c3aed', fontWeight: 700 }}>
                          <Box component={RouterLink} to="/subscription" sx={{ color: 'inherit', textDecoration: 'underline' }}>
                            Upgrade to Premium
                          </Box>
                          {' '}to unlock full details
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Paper>

            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          active={activeImg}
          onClose={() => setLightboxOpen(false)}
          onPrev={prevImg}
          onNext={nextImg}
        />
      )}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        listing={{ id, title: property.title, type: 'property' }}
        amount={499}
      />
    </Box>
  )
}