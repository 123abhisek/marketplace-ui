
// src/components/FeaturedListings.jsx
import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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

import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import SquareFootRoundedIcon from '@mui/icons-material/SquareFootRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'

import { useAppState } from '../hooks/useAppState'
import { propertyService, vehicleService } from '../services/api'
import { formatCurrency } from '../utils/formatters'

const TYPE = {
  Property: {
    accent: '#5b4cf0',
    accentLight: 'rgba(91,76,240,0.09)',
    accentBorder: 'rgba(91,76,240,0.18)',
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
    fallback: 'linear-gradient(145deg,#ede9ff 0%,#f4f3ff 100%)',
    pillBg: 'rgba(91,76,240,0.10)',
  },
  Vehicle: {
    accent: '#0f766e',
    accentLight: 'rgba(15,118,110,0.08)',
    accentBorder: 'rgba(15,118,110,0.20)',
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    fallback: 'linear-gradient(145deg,#d1fae5 0%,#f0fdf9 100%)',
    pillBg: 'rgba(15,118,110,0.09)',
  },
}

const PROP_TAG = {
  Residential: {
    label: 'Residential',
    icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Commercial: {
    label: 'Commercial',
    icon: <StorefrontRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Agricultural: {
    label: 'Agricultural',
    icon: <GrassRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Site: {
    label: 'Site',
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Flat: {
    label: 'Flat',
    icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} />,
  },
}

function toCard(raw, kind) {
  if (kind === 'Property') {
    const tag = PROP_TAG[raw.propertyType] ?? PROP_TAG.Residential
    const meta = [
      raw.area ? `${raw.area} sq.ft` : null,
      raw.bedrooms ? `${raw.bedrooms} BHK` : null,
      raw.floor ? `Floor ${raw.floor}` : null,
      raw.landArea ? raw.landArea : null,
    ]
      .filter(Boolean)
      .join(' • ')

    return {
      id: raw.id,
      type: 'Property',
      tag: tag.label,
      tagIcon: tag.icon,
      title: raw.title || 'Property listing',
      location: raw.location || '',
      price: raw.expectedPrice,
      meta: meta || raw.propertyType || '',
      metaIcon: 'sqft',
      isPremiumOnly: !!raw.message,
      image: raw.images?.[0] ?? '',
      raw,
    }
  }

  const meta = [
    raw.kmDriven ? `${Number(raw.kmDriven).toLocaleString('en-IN')} km` : null,
    raw.brand ? raw.brand : null,
    raw.rtoCode ? raw.rtoCode : null,
  ]
    .filter(Boolean)
    .join(' • ')

  return {
    id: raw.id,
    type: 'Vehicle',
    tag: raw.brand || 'Vehicle',
    tagIcon: <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    title: raw.title || `${raw.brand} ${raw.model}`,
    location: raw.location || '',
    price: raw.expectedPrice,
    meta: meta || '',
    metaIcon: 'km',
    isPremiumOnly: !!raw.message,
    image: raw.images?.[0] ?? '',
    raw,
  }
}

function MetaPill({ icon, label, bg, color }) {
  if (!label) return null

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 1.1,
        py: 0.45,
        borderRadius: '999px',
        background: bg,
        border: '1px solid rgba(0,0,0,0.05)',
        minHeight: 28,
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Stack>
  )
}

function SkeletonCard() {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 340,
        minHeight: 470,
        height: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(226,232,240,0.85)',
        background: '#fff',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ aspectRatio: '4/3', width: '100%' }}
        animation="wave"
      />
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: '18px 18px 18px !important',
        }}
      >
        <Skeleton
          variant="text"
          width="75%"
          height={24}
          sx={{ mb: 0.5 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="40%"
          height={16}
          sx={{ mb: 1.5 }}
          animation="wave"
        />
        <Stack direction="row" spacing={0.8} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Skeleton
            variant="rounded"
            width={78}
            height={28}
            animation="wave"
            sx={{ borderRadius: '999px' }}
          />
          <Skeleton
            variant="rounded"
            width={68}
            height={28}
            animation="wave"
            sx={{ borderRadius: '999px' }}
          />
          <Skeleton
            variant="rounded"
            width={56}
            height={28}
            animation="wave"
            sx={{ borderRadius: '999px' }}
          />
        </Stack>
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Skeleton
            variant="text"
            width="100%"
            height={1}
            sx={{ mb: 1.5 }}
            animation="wave"
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width={110} height={30} animation="wave" />
            <Skeleton
              variant="rounded"
              width={110}
              height={38}
              sx={{ borderRadius: '12px' }}
              animation="wave"
            />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

function ListingCard({ item }) {
  const { user } = useAppState()
  const [liked, setLiked] = useState(false)

  const cfg = TYPE[item.type]
  const locked = !user?.isPremium && item.isPremiumOnly
  const detailPath = `/dashboard/${item.type === 'Property' ? 'properties' : 'vehicles'}/${item.id}`

  const parts = item.meta
    ? item.meta
        .split('•')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    : []

  const title = item.title || `${item.type} listing`
  const location = item.location || 'Location not available'
  const priceLabel = item.type === 'Property' ? 'Expected price' : 'Asking price'

  const primaryMetaIcon =
    item.metaIcon === 'km' ? (
      <SpeedRoundedIcon sx={{ fontSize: 12, color: cfg.accent }} />
    ) : item.metaIcon === 'sqft' ? (
      <SquareFootRoundedIcon sx={{ fontSize: 12, color: cfg.accent }} />
    ) : null

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 340,
        minHeight: 470,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(226,232,240,0.95)',
        boxShadow: '0 10px 30px rgba(15,23,42,0.055)',
        transition:
          'transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s cubic-bezier(.16,1,.3,1), border-color .22s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 22px 50px rgba(15,23,42,0.10)',
          borderColor: cfg.accentBorder,
        },
      }}
    >
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
            alt={title}
            loading="lazy"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform .45s cubic-bezier(.16,1,.3,1)',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.06)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              color: cfg.accent,
              opacity: 0.28,
            }}
          >
            {item.type === 'Property' ? (
              <HomeWorkRoundedIcon sx={{ fontSize: 68 }} />
            ) : (
              <DirectionsCarRoundedIcon sx={{ fontSize: 68 }} />
            )}
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(15,23,42,0.48) 0%, rgba(15,23,42,0.18) 28%, transparent 62%)',
            pointerEvents: 'none',
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            zIndex: 3,
          }}
        >
          <Chip
            icon={item.tagIcon ?? cfg.icon}
            label={item.tag || item.type}
            size="small"
            sx={{
              maxWidth: '70%',
              height: 28,
              borderRadius: '999px',
              pl: 0.3,
              fontWeight: 900,
              fontSize: '0.71rem',
              background: 'rgba(255,255,255,0.92)',
              color: cfg.accent,
              border: `1px solid ${cfg.accentBorder}`,
              backdropFilter: 'blur(10px)',
              '& .MuiChip-icon': { color: cfg.accent },
              '& .MuiChip-label': {
                px: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />

          <Stack direction="row" spacing={0.7} alignItems="center">
            {item.isPremiumOnly && (
              <Chip
                icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 12 }} />}
                label="Premium"
                size="small"
                sx={{
                  height: 28,
                  pl: 0.25,
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '0.68rem',
                  background: 'rgba(15,23,42,0.78)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}

            <IconButton
              size="small"
              onClick={() => setLiked((prev) => !prev)}
              sx={{
                width: 32,
                height: 32,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(226,232,240,0.8)',
                transition: 'all .18s ease',
                '&:hover': {
                  background: '#fff',
                  transform: 'scale(1.08)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              {liked ? (
                <FavoriteRoundedIcon sx={{ fontSize: 15, color: '#ef4444' }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 15, color: '#64748b' }} />
              )}
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 14,
            zIndex: 2,
          }}
        >
          <Chip
            size="small"
            icon={<PlaceRoundedIcon sx={{ fontSize: 13 }} />}
            label={location}
            sx={{
              maxWidth: '100%',
              height: 28,
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.14)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.16)',
              '& .MuiChip-icon': { color: 'rgba(255,255,255,0.92)' },
              '& .MuiChip-label': {
                px: 0.9,
                fontWeight: 700,
                fontSize: '0.72rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Box>

        {locked && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15,23,42,0.16)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            <Box
              sx={{
                px: 2.3,
                py: 1.8,
                borderRadius: '20px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 12px 30px rgba(15,23,42,0.18)',
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  mx: 'auto',
                  mb: 1,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.16)',
                }}
              >
                <LockRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '.03em',
                }}
              >
                Premium only
              </Typography>

              <Typography
                sx={{
                  mt: 0.45,
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.88)',
                  fontWeight: 600,
                }}
              >
                Unlock full details and pricing
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: '18px 18px 18px !important',
        }}
      >
        <Stack spacing={1.2} sx={{ flex: 1 }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1rem',
                lineHeight: 1.32,
                color: '#0f172a',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 0.8,
                minHeight: '2.64em',
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                fontWeight: 800,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              {item.type}
            </Typography>
          </Box>

          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap sx={{ minHeight: 34 }}>
            {parts.length > 0 ? (
              parts.map((part, index) => (
                <MetaPill
                  key={`${part}-${index}`}
                  icon={index === 0 ? primaryMetaIcon : null}
                  label={part}
                  bg={cfg.accentLight}
                  color={cfg.accent}
                />
              ))
            ) : (
              <Box sx={{ height: 28 }} />
            )}
          </Stack>

          <Box
            sx={{
              mt: 'auto',
              pt: 1.5,
              borderTop: '1px solid rgba(226,232,240,0.85)',
            }}
          >
            {locked ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '.07em',
                    }}
                  >
                    Access
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.98rem',
                      color: '#0f172a',
                      fontWeight: 900,
                    }}
                  >
                    Premium required
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to="/subscription"
                  size="small"
                  startIcon={<LockRoundedIcon sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    flexShrink: 0,
                    borderRadius: '12px',
                    px: 1.5,
                    py: 0.85,
                    fontWeight: 900,
                    fontSize: '0.76rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(108,99,255,0.24)',
                    '&:hover': {
                      background: 'linear-gradient(135deg,#6b59f5,#4c75ff)',
                    },
                  }}
                >
                  Unlock ₹299
                </Button>
              </Stack>
            ) : (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '.07em',
                    }}
                  >
                    {priceLabel}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '1.16rem',
                      color: cfg.accent,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.price ? formatCurrency(item.price) : '—'}
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to={detailPath}
                  endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flexShrink: 0,
                    borderRadius: '12px',
                    px: 1.45,
                    py: 0.9,
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    textTransform: 'none',
                    color: cfg.accent,
                    background: cfg.accentLight,
                    border: `1px solid ${cfg.accentBorder}`,
                    '&:hover': {
                      background: cfg.accent,
                      color: '#fff',
                    },
                  }}
                >
                  View details
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

const TABS = ['All', 'Property', 'Vehicle']

function TabBar({ active, onChange }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {TABS.map((t) => (
        <Button
          key={t}
          onClick={() => onChange(t)}
          size="small"
          sx={{
            borderRadius: '999px',
            px: 2,
            py: 0.75,
            fontWeight: 700,
            fontSize: '0.82rem',
            whiteSpace: 'nowrap',
            ...(active === t
              ? {
                  background: '#0f172a',
                  color: '#fff',
                  '&:hover': { background: '#1e293b' },
                }
              : {
                  background: 'rgba(148,163,184,0.10)',
                  color: '#475569',
                  border: '1px solid rgba(148,163,184,0.25)',
                  '&:hover': { background: 'rgba(148,163,184,0.18)' },
                }),
          }}
        >
          {t}
        </Button>
      ))}
    </Stack>
  )
}

export default function FeaturedListings() {
  const [properties, setProperties] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const fetchAll = useCallback(async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const [props, vehs] = await Promise.all([
        propertyService.getAll({ limit: 6 }),
        vehicleService.getAll({ limit: 6 }),
      ])

      setProperties(props)
      setVehicles(vehs)
      setStatus('success')
    } catch (err) {
      const detail = err?.response?.data?.detail
      setErrorMsg(
        typeof detail === 'string'
          ? detail
          : 'Could not load listings. Please try again.'
      )
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const propCards = properties.map((p) => toCard(p, 'Property'))
  const vehCards = vehicles.map((v) => toCard(v, 'Vehicle'))

  const allCards =
    activeTab === 'All'
      ? [...propCards, ...vehCards].slice(0, 8)
      : activeTab === 'Property'
      ? propCards.slice(0, 8)
      : vehCards.slice(0, 8)

  const isLoading = status === 'loading'
  const isError = status === 'error'
  const isEmpty = status === 'success' && allCards.length === 0

  return (
    <Box
      id="featured"
      sx={{
        py: { xs: 7, md: 11 },
        background: 'linear-gradient(180deg,#f8fafc 0%,#fff 55%,#f8fafc 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          spacing={2}
          sx={{ mb: { xs: 4, md: 5.5 } }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                  boxShadow: '0 0 0 3px rgba(108,99,255,0.14)',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#5b4cf0',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Marketplace Preview
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#0f172a',
                mb: 1.1,
              }}
            >
              Featured listings
            </Typography>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.93rem',
                maxWidth: 460,
                lineHeight: 1.7,
              }}
            >
              Properties and vehicles curated for quality. Premium unlocks full
              contact details, pricing, and posting access.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexShrink={0}
          >
            <TabBar active={activeTab} onChange={setActiveTab} />
            {isError && (
              <IconButton
                size="small"
                onClick={fetchAll}
                title="Retry"
                sx={{
                  border: '1px solid rgba(226,232,240,0.9)',
                  borderRadius: '10px',
                  width: 34,
                  height: 34,
                }}
              >
                <RefreshRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            <Button
              component={RouterLink}
              to="/dashboard/properties"
              variant="outlined"
              endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                borderRadius: '999px',
                px: 2.4,
                py: 1.05,
                fontWeight: 700,
                fontSize: '0.87rem',
                borderColor: 'rgba(148,163,184,0.45)',
                color: '#475569',
                whiteSpace: 'nowrap',
                transition: 'all .18s ease',
                '&:hover': {
                  borderColor: '#5b4cf0',
                  color: '#5b4cf0',
                  backgroundColor: 'rgba(91,76,240,0.04)',
                },
              }}
            >
              View all listings
            </Button>
          </Stack>
        </Stack>

        {isError && (
          <Alert
            severity="error"
            action={
              <Button
                size="small"
                onClick={fetchAll}
                startIcon={<RefreshRoundedIcon />}
              >
                Retry
              </Button>
            }
            sx={{ mb: 3, borderRadius: '14px' }}
          >
            {errorMsg}
          </Alert>
        )}

        {isLoading ? (
          <Grid
            container
            spacing={{ xs: 2.5, sm: 3 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}
              >
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : isEmpty ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <HomeWorkRoundedIcon sx={{ fontSize: 52, color: '#cbd5e1', mb: 2 }} />
            <Typography fontWeight={800} color="#475569">
              No listings found
            </Typography>
            <Typography fontSize="0.88rem" color="#94a3b8">
              Check back soon — new listings are added daily.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={{ xs: 2.5, sm: 3 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {allCards.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={`${item.type}-${item.id}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}
              >
                <ListingCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}

        {status === 'success' && allCards.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 3.5, mb: { xs: 4, md: 5 } }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 0 3px rgba(34,197,94,0.18)',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.77rem',
                color: '#94a3b8',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {propCards.length} propert{propCards.length === 1 ? 'y' : 'ies'} ·{' '}
              {vehCards.length} vehicle{vehCards.length === 1 ? '' : 's'} loaded
              live from API
            </Typography>
          </Stack>
        )}

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
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(108,99,255,0.07) 0%,transparent 72%)',
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={0.7} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(94,135,255,0.08))',
                  border: '1px solid rgba(108,99,255,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ color: '#5b4cf0', fontSize: 19 }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  fontSize: '1.02rem',
                  lineHeight: 1.2,
                }}
              >
                Unlock all listing details with Premium
              </Typography>
            </Stack>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.87rem',
                maxWidth: 500,
                lineHeight: 1.68,
                pl: '48px',
              }}
            >
              Free users see images only. Upgrade to ₹299 premium to view price,
              contact details, and post your own property or vehicle listings.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.3}
            flexShrink={0}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Button
              component={RouterLink}
              to="/subscription"
              variant="contained"
              sx={{
                borderRadius: '999px',
                px: 2.6,
                py: 1.1,
                fontWeight: 800,
                fontSize: '0.88rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                boxShadow: '0 10px 28px rgba(108,99,255,0.28)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                transition: 'all .18s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg,#6b59f5,#4c75ff)',
                  boxShadow: '0 14px 36px rgba(108,99,255,0.34)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Get Premium — ₹299
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                borderRadius: '999px',
                px: 2.3,
                py: 1.05,
                fontWeight: 700,
                fontSize: '0.88rem',
                borderColor: 'rgba(108,99,255,0.28)',
                color: '#5b4cf0',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#5b4cf0',
                  backgroundColor: 'rgba(91,76,240,0.05)',
                },
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