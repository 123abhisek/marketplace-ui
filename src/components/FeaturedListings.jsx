
// src/components/FeaturedListings.jsx
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink }               from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import PlaceRoundedIcon            from '@mui/icons-material/PlaceRounded'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import ArrowOutwardRoundedIcon     from '@mui/icons-material/ArrowOutwardRounded'
import HomeWorkRoundedIcon         from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon    from '@mui/icons-material/DirectionsCarRounded'
import FavoriteBorderRoundedIcon   from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon         from '@mui/icons-material/FavoriteRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import SpeedRoundedIcon            from '@mui/icons-material/SpeedRounded'
import SquareFootRoundedIcon       from '@mui/icons-material/SquareFootRounded'
import RefreshRoundedIcon          from '@mui/icons-material/RefreshRounded'
import ApartmentRoundedIcon        from '@mui/icons-material/ApartmentRounded'
import StorefrontRoundedIcon       from '@mui/icons-material/StorefrontRounded'
import GrassRoundedIcon            from '@mui/icons-material/GrassRounded'

import { useAppState }              from '../hooks/useAppState'
import { propertyService, vehicleService } from '../services/api'
import { formatCurrency }           from '../utils/formatters'

// ─── Design tokens per listing type ──────────────────────────────────────────

const TYPE = {
  Property: {
    accent:       '#5b4cf0',
    accentLight:  'rgba(91,76,240,0.09)',
    accentBorder: 'rgba(91,76,240,0.18)',
    icon:         <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
    fallback:     'linear-gradient(145deg,#ede9ff 0%,#f4f3ff 100%)',
    pillBg:       'rgba(91,76,240,0.10)',
  },
  Vehicle: {
    accent:       '#0f766e',
    accentLight:  'rgba(15,118,110,0.08)',
    accentBorder: 'rgba(15,118,110,0.20)',
    icon:         <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    fallback:     'linear-gradient(145deg,#d1fae5 0%,#f0fdf9 100%)',
    pillBg:       'rgba(15,118,110,0.09)',
  },
}

// Map property_type → a small readable tag + icon
const PROP_TAG = {
  Residential: { label: 'Residential', icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} /> },
  Commercial:  { label: 'Commercial',  icon: <StorefrontRoundedIcon sx={{ fontSize: 14 }} /> },
  Agricultural:{ label: 'Agricultural',icon: <GrassRoundedIcon sx={{ fontSize: 14 }} /> },
  Site:        { label: 'Site',        icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} /> },
  Flat:        { label: 'Flat',        icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} /> },
}

// ─── Normalise raw API objects → unified card shape ────────────────────────

function toCard(raw, kind) {
  if (kind === 'Property') {
    const tag    = PROP_TAG[raw.propertyType] ?? PROP_TAG.Residential
    const meta   = [
      raw.area       ? `${raw.area} sq.ft`  : null,
      raw.bedrooms   ? `${raw.bedrooms} BHK` : null,
      raw.floor      ? `Floor ${raw.floor}`  : null,
      raw.landArea   ? raw.landArea           : null,
    ].filter(Boolean).join(' • ')

    return {
      id:            raw.id,
      type:          'Property',
      tag:           tag.label,
      tagIcon:       tag.icon,
      title:         raw.title    || 'Property listing',
      location:      raw.location || '',
      price:         raw.expectedPrice,
      meta:          meta || raw.propertyType || '',
      metaIcon:      'sqft',
      isPremiumOnly: !!raw.message,   // API sends a "message" on teaser when premium-locked
      image:         raw.images?.[0] ?? '',
      raw,
    }
  }
  // Vehicle
  const meta = [
    raw.kmDriven  ? `${Number(raw.kmDriven).toLocaleString('en-IN')} km` : null,
    raw.brand     ? raw.brand  : null,
    raw.rtoCode   ? raw.rtoCode : null,
  ].filter(Boolean).join(' • ')

  return {
    id:            raw.id,
    type:          'Vehicle',
    tag:           raw.brand || 'Vehicle',
    tagIcon:       <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    title:         raw.title    || `${raw.brand} ${raw.model}`,
    location:      raw.location || '',
    price:         raw.expectedPrice,
    meta:          meta || '',
    metaIcon:      'km',
    isPremiumOnly: !!raw.message,
    image:         raw.images?.[0] ?? '',
    raw,
  }
}

// ─── Meta pill ────────────────────────────────────────────────────────────────

function MetaPill({ icon, label, bg, color }) {
  if (!label) return null
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 1.1,
        py: 0.4,
        borderRadius: '8px',
        background: bg,
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {icon}
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color, lineHeight: 1 }}>
        {label}
      </Typography>
    </Stack>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(226,232,240,0.85)' }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '4/3', width: '100%' }} animation="wave" />
      <CardContent sx={{ p: '16px 18px 18px !important' }}>
        <Skeleton variant="text" width="75%" height={22} sx={{ mb: 0.5 }} animation="wave" />
        <Skeleton variant="text" width="50%" height={16} sx={{ mb: 1.5 }} animation="wave" />
        <Stack direction="row" spacing={0.8} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={70} height={22} animation="wave" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width={60} height={22} animation="wave" sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width={50} height={22} animation="wave" sx={{ borderRadius: '8px' }} />
        </Stack>
        <Skeleton variant="text" width="100%" height={1} sx={{ mb: 1.5 }} animation="wave" />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={90} height={28} animation="wave" />
          <Skeleton variant="rounded" width={34} height={34} sx={{ borderRadius: '11px' }} animation="wave" />
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Listing card ─────────────────────────────────────────────────────────────

function ListingCard({ item }) {
  const { user }          = useAppState()
  const [liked, setLiked] = useState(false)

  // A listing is locked when:
  //  (a) the API teaser included a "message" (premium gate), OR
  //  (b) the user is not premium and the listing is flagged as premium-only
  const locked = !user?.isPremium && item.isPremiumOnly
  const cfg    = TYPE[item.type]

  const parts = item.meta
    ? item.meta.split('•').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '20px',
        border: '1px solid rgba(226,232,240,0.85)',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(15,23,42,0.055)',
        overflow: 'hidden',
        transition: 'transform .24s cubic-bezier(.16,1,.3,1), box-shadow .24s cubic-bezier(.16,1,.3,1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 48px rgba(15,23,42,0.11)',
        },
      }}
    >
      {/* ── Image ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          background: cfg.fallback,
          flexShrink: 0,
        }}
      >
        {item.image ? (
          <Box
            component="img"
            src={item.image}
            alt={item.title}
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform .38s cubic-bezier(.16,1,.3,1)',
              '.MuiCard-root:hover &': { transform: 'scale(1.06)' },
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.type === 'Property' ? '#a78bfa' : '#34d399',
            }}
          >
            {item.type === 'Property'
              ? <HomeWorkRoundedIcon sx={{ fontSize: 64, opacity: 0.4 }} />
              : <DirectionsCarRoundedIcon sx={{ fontSize: 64, opacity: 0.4 }} />}
          </Box>
        )}

        {/* Bottom gradient for legibility */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.32) 0%,transparent 52%)', pointerEvents: 'none' }} />

        {/* Premium blur overlay */}
        {locked && (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
              background: 'rgba(15,23,42,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}
          >
            <Stack
              alignItems="center"
              spacing={0.8}
              sx={{ px: 2.5, py: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)' }}
            >
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LockRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                Premium only
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Type chip — top left */}
        <Chip
          icon={item.tagIcon ?? cfg.icon}
          label={item.tag}
          size="small"
          sx={{
            position: 'absolute', top: 11, left: 11, zIndex: 3,
            height: 26, pl: 0.3, borderRadius: '999px',
            fontWeight: 800, fontSize: '0.71rem',
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(10px)',
            color: cfg.accent,
            border: `1px solid ${cfg.accentBorder}`,
            '& .MuiChip-icon': { color: cfg.accent },
            '& .MuiChip-label': { px: 1 },
          }}
        />

        {/* Premium badge + heart — top right */}
        <Stack direction="row" spacing={0.6} alignItems="center" sx={{ position: 'absolute', top: 11, right: 11, zIndex: 3 }}>
          {item.isPremiumOnly && (
            <Chip
              icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 12 }} />}
              label="Premium"
              size="small"
              sx={{
                height: 26, pl: 0.25, borderRadius: '999px',
                fontWeight: 800, fontSize: '0.68rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                color: '#fff', border: 'none',
                boxShadow: '0 4px 12px rgba(108,99,255,0.30)',
                '& .MuiChip-icon': { color: 'rgba(255,255,255,0.88)' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}

          <IconButton
            size="small"
            onClick={() => setLiked((p) => !p)}
            sx={{
              width: 30, height: 30,
              background: 'rgba(255,255,255,0.93)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(226,232,240,0.7)',
              transition: 'transform .18s ease',
              '&:hover': { background: '#fff', transform: 'scale(1.12)' },
              '&:active': { transform: 'scale(0.94)' },
            }}
          >
            {liked
              ? <FavoriteRoundedIcon       sx={{ fontSize: 14, color: '#ef4444' }} />
              : <FavoriteBorderRoundedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />}
          </IconButton>
        </Stack>
      </Box>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: '16px 18px 18px !important', gap: 0 }}>
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 800, fontSize: '0.97rem', lineHeight: 1.33,
            color: '#0f172a', mb: 0.65,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {item.title}
        </Typography>

        {/* Location */}
        {item.location && (
          <Stack direction="row" spacing={0.45} alignItems="center" sx={{ mb: 1.2 }}>
            <PlaceRoundedIcon sx={{ fontSize: 13, color: '#94a3b8', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.79rem', color: '#64748b', fontWeight: 600, lineHeight: 1 }}>
              {item.location}
            </Typography>
          </Stack>
        )}

        {/* Meta pills */}
        {parts.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.7} sx={{ mb: 1.8 }}>
            {parts.map((part, i) => (
              <MetaPill
                key={i}
                icon={
                  i === 0 && item.metaIcon === 'km'
                    ? <SpeedRoundedIcon       sx={{ fontSize: 11, color: cfg.accent }} />
                    : i === 0 && item.metaIcon === 'sqft'
                    ? <SquareFootRoundedIcon  sx={{ fontSize: 11, color: cfg.accent }} />
                    : null
                }
                label={part}
                bg={cfg.accentLight}
                color={cfg.accent}
              />
            ))}
          </Stack>
        )}

        {/* Divider */}
        <Box sx={{ height: '1px', background: 'rgba(226,232,240,0.85)', mb: 1.6, mt: 'auto' }} />

        {/* Price row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {locked ? (
            <Button
              component={RouterLink}
              to="/subscription"
              size="small"
              startIcon={<LockRoundedIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: '10px', px: 1.5, py: 0.7,
                fontWeight: 800, fontSize: '0.75rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                color: '#fff',
                boxShadow: '0 6px 16px rgba(108,99,255,0.22)',
                '&:hover': { background: 'linear-gradient(135deg,#6b59f5,#4c75ff)', boxShadow: '0 8px 22px rgba(108,99,255,0.30)' },
              }}
            >
              Unlock — ₹299
            </Button>
          ) : (
            <>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.12rem', color: cfg.accent, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                  {item.price ? formatCurrency(item.price) : '—'}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                  {item.type === 'Property' ? 'Expected price' : 'Asking price'}
                </Typography>
              </Box>

             

              <IconButton
                component={RouterLink}
                to={`/dashboard/${item.type === 'Property' ? 'property' : 'vehicle'}/${item.id}`}
                size="small"
                sx={{
                  width: 34, height: 34, borderRadius: '11px',
                  background: cfg.accentLight,
                  border: `1px solid ${cfg.accentBorder}`,
                  color: cfg.accent,
                  transition: 'all .18s ease',
                  '&:hover': { background: cfg.accent, color: '#fff', transform: 'scale(1.08)', boxShadow: `0 6px 16px ${cfg.accentBorder}` },
                }}
              >
                <ArrowOutwardRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = ['All', 'Property', 'Vehicle']

function TabBar({ active, onChange }) {
  return (
    <Stack direction="row" spacing={1}>
      {TABS.map((t) => (
        <Button
          key={t}
          onClick={() => onChange(t)}
          size="small"
          sx={{
            borderRadius: '999px',
            px: 2, py: 0.75,
            fontWeight: 700,
            fontSize: '0.82rem',
            whiteSpace: 'nowrap',
            ...(active === t
              ? { background: '#0f172a', color: '#fff', '&:hover': { background: '#1e293b' } }
              : { background: 'rgba(148,163,184,0.10)', color: '#475569', border: '1px solid rgba(148,163,184,0.25)', '&:hover': { background: 'rgba(148,163,184,0.18)' } }),
          }}
        >
          {t}
        </Button>
      ))}
    </Stack>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function FeaturedListings() {
  const [properties, setProperties] = useState([])
  const [vehicles,   setVehicles]   = useState([])
  const [status,     setStatus]     = useState('idle')   // idle | loading | success | error
  const [errorMsg,   setErrorMsg]   = useState('')
  const [activeTab,  setActiveTab]  = useState('All')

  // ── Fetch both lists in parallel ──────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const [props, vehs] = await Promise.all([
        propertyService.getAll({ limit: 6 }),
        vehicleService.getAll({ limit: 6 }),
      ])

console.log('Featured props:', props)
console.log('Featured vehs:', vehs)

      setProperties(props)
      setVehicles(vehs)
      setStatus('success')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setErrorMsg(
        typeof detail === 'string'
          ? detail
          : 'Could not load listings. Please try again.',
      )
      setStatus('error')
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Merge and filter by tab ───────────────────────────────────────────────
  const propCards = properties.map((p) => toCard(p, 'Property'))
  const vehCards  = vehicles.map((v)   => toCard(v, 'Vehicle'))

  const allCards =
    activeTab === 'All'     ? [...propCards, ...vehCards].slice(0, 8) :
    activeTab === 'Property' ? propCards.slice(0, 8) :
    vehCards.slice(0, 8)

  const isLoading = status === 'loading'
  const isError   = status === 'error'
  const isEmpty   = status === 'success' && allCards.length === 0

  return (
    <Box
      id="featured"
      sx={{ py: { xs: 7, md: 11 }, background: 'linear-gradient(180deg,#f8fafc 0%,#fff 55%,#f8fafc 100%)' }}
    >
      <Container maxWidth="xl">

        {/* ── Section header ──────────────────────────────────────────── */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          spacing={2}
          sx={{ mb: { xs: 4, md: 5.5 } }}
        >
          <Box>
            {/* Eyebrow */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#7c6cff,#5e87ff)', boxShadow: '0 0 0 3px rgba(108,99,255,0.14)' }} />
              <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, color: '#5b4cf0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Marketplace Preview
              </Typography>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.035em', lineHeight: 1.08, color: '#0f172a', mb: 1.1 }}>
              Featured listings
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.93rem', maxWidth: 460, lineHeight: 1.7 }}>
              Properties and vehicles curated for quality. Premium unlocks full contact details, pricing, and posting access.
            </Typography>
          </Box>

          {/* Right controls */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} flexShrink={0}>
            <TabBar active={activeTab} onChange={setActiveTab} />
            {isError && (
              <IconButton size="small" onClick={fetchAll} title="Retry"
                sx={{ border: '1px solid rgba(226,232,240,0.9)', borderRadius: '10px', width: 34, height: 34 }}>
                <RefreshRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            <Button
              component={RouterLink}
              to="/dashboard/properties"
              variant="outlined"
              endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                borderRadius: '999px', px: 2.4, py: 1.05,
                fontWeight: 700, fontSize: '0.87rem',
                borderColor: 'rgba(148,163,184,0.45)', color: '#475569',
                whiteSpace: 'nowrap',
                transition: 'all .18s ease',
                '&:hover': { borderColor: '#5b4cf0', color: '#5b4cf0', backgroundColor: 'rgba(91,76,240,0.04)' },
              }}
            >
              View all listings
            </Button>
          </Stack>
        </Stack>

        {/* ── Error banner ─────────────────────────────────────────────── */}
        {isError && (
          <Alert
            severity="error"
            action={<Button size="small" onClick={fetchAll} startIcon={<RefreshRoundedIcon />}>Retry</Button>}
            sx={{ mb: 3, borderRadius: '14px' }}
          >
            {errorMsg}
          </Alert>
        )}

        {/* ── Cards grid ───────────────────────────────────────────────── */}
        {isLoading ? (
          <Grid container spacing={{ xs: 2.5, sm: 3 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : isEmpty ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <HomeWorkRoundedIcon sx={{ fontSize: 52, color: '#cbd5e1', mb: 2 }} />
            <Typography fontWeight={800} color="#475569">No listings found</Typography>
            <Typography fontSize="0.88rem" color="#94a3b8">Check back soon — new listings are added daily.</Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2.5, sm: 3 }}>
            {allCards.map((item) => (
              <Grid item xs={12} sm={6} lg={3} key={`${item.type}-${item.id}`}>
                <ListingCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Live data attribution strip ────────────────────────────── */}
        {status === 'success' && allCards.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 3.5, mb: { xs: 4, md: 5 } }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.18)' }} />
            <Typography sx={{ fontSize: '0.77rem', color: '#94a3b8', fontWeight: 600 }}>
              {propCards.length} propert{propCards.length === 1 ? 'y' : 'ies'} · {vehCards.length} vehicle{vehCards.length === 1 ? '' : 's'} loaded live from API
            </Typography>
          </Stack>
        )}

        {/* ── Premium CTA strip ───────────────────────────────────────── */}
        <Box
          sx={{
            mt: { xs: 2, md: 3 },
            p: { xs: '28px 24px', md: '32px 40px' },
            borderRadius: '24px',
            background: '#fff',
            border: '1px solid rgba(226,232,240,0.9)',
            boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blob */}
          <Box aria-hidden sx={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(108,99,255,0.07) 0%,transparent 72%)', pointerEvents: 'none' }} />

          {/* Left text */}
          <Stack spacing={0.7} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: '12px', background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(94,135,255,0.08))', border: '1px solid rgba(108,99,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <WorkspacePremiumRoundedIcon sx={{ color: '#5b4cf0', fontSize: 19 }} />
              </Box>
              <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.02rem', lineHeight: 1.2 }}>
                Unlock all listing details with Premium
              </Typography>
            </Stack>
            <Typography sx={{ color: '#64748b', fontSize: '0.87rem', maxWidth: 500, lineHeight: 1.68, pl: '48px' }}>
              Free users see images only. Upgrade to ₹299 premium to view price, contact details, and post your own property or vehicle listings.
            </Typography>
          </Stack>

          {/* Right CTAs */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3} flexShrink={0} sx={{ position: 'relative', zIndex: 1 }}>
            <Button
              component={RouterLink}
              to="/subscription"
              variant="contained"
              sx={{
                borderRadius: '999px', px: 2.6, py: 1.1,
                fontWeight: 800, fontSize: '0.88rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                boxShadow: '0 10px 28px rgba(108,99,255,0.28)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                transition: 'all .18s ease',
                '&:hover': { background: 'linear-gradient(135deg,#6b59f5,#4c75ff)', boxShadow: '0 14px 36px rgba(108,99,255,0.34)', transform: 'translateY(-1px)' },
              }}
            >
              Get Premium — ₹299
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                borderRadius: '999px', px: 2.3, py: 1.05,
                fontWeight: 700, fontSize: '0.88rem',
                borderColor: 'rgba(108,99,255,0.28)',
                color: '#5b4cf0', whiteSpace: 'nowrap',
                '&:hover': { borderColor: '#5b4cf0', backgroundColor: 'rgba(91,76,240,0.05)' },
              }}
            >
              Login to explore
            </Button>
          </Stack>
        </Box>

      </Container>
    </Box>
  )
}