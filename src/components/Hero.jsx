
// src/components/Hero.jsx
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Container,
  Divider,
  Fade,
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Paper,
  Popper,
  Select,
  Stack,
  Typography,
} from '@mui/material'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { useAppState } from '../hooks/useAppState'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'property', label: 'Properties' },
  { value: 'vehicle', label: 'Vehicles' },
]

const BUDGET_OPTIONS = [
  { value: '', label: 'Any Budget' },
  { value: '0-5000', label: 'Under ₹5K' },
  { value: '5000-20000', label: '₹5K – ₹20K' },
  { value: '20000-50000', label: '₹20K – ₹50K' },
  { value: '50000-100000', label: '₹50K – ₹1L' },
  { value: '100000-300000', label: '₹1L – ₹3L' },
  { value: '300000-500000', label: '₹3L – ₹5L' },
  { value: '500000-999999999', label: 'Above ₹5L' },
]

const STATS = [
  '10k+ active listings',
  'Premium-only access',
  'Verified seller workflows',
]

function parsePrice(raw) {
  if (!raw && raw !== 0) return null
  if (typeof raw === 'number') return raw

  const s = String(raw).replace(/[₹,\s]/g, '').toLowerCase()
  if (s.endsWith('cr')) return parseFloat(s) * 1e7
  if (s.endsWith('lac') || s.endsWith('lakh')) return parseFloat(s) * 1e5
  if (s.endsWith('l')) return parseFloat(s) * 1e5
  if (s.endsWith('k')) return parseFloat(s) * 1e3

  return parseFloat(s) || null
}

function formatDisplayPrice(value, fallback = '₹—') {
  if (value === null || value === undefined || value === '') return fallback
  const s = String(value)
  return s.startsWith('₹') ? s : `₹${s}`
}

function Highlight({ text = '', query = '' }) {
  if (!query.trim()) return <>{text}</>

  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, idx)}
      <Box
        component="mark"
        sx={{
          px: '2px',
          borderRadius: '4px',
          bgcolor: 'rgba(15,118,110,0.12)',
          color: 'inherit',
        }}
      >
        {text.slice(idx, idx + query.length)}
      </Box>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchMetric({ label, value }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.1,
        borderRadius: '999px',
        border: '1px solid #e2e8f0',
        background: 'rgba(255,255,255,0.92)',
        color: '#475569',
        fontWeight: 700,
        fontSize: '0.86rem',
      }}
    >
      <Box component="span" sx={{ color: '#0f172a', fontWeight: 900 }}>
        {value}
      </Box>{' '}
      {label}
    </Box>
  )
}

function FeaturedCard({ item, onView }) {
  const isProperty = item._type === 'property'
  const accent = isProperty ? '#0f766e' : '#2563eb'
  const softBg = isProperty
    ? 'linear-gradient(180deg, #effcf7 0%, #ffffff 100%)'
    : 'linear-gradient(180deg, #eef5ff 0%, #ffffff 100%)'

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        background: softBg,
        boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 18px 42px rgba(15,23,42,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Box
          sx={{
            mb: 2,
            height: 184,
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.9)',
            background: isProperty
              ? 'linear-gradient(135deg, rgba(15,118,110,0.10), rgba(20,184,166,0.05))'
              : 'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(96,165,250,0.05))',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7), transparent 26%), radial-gradient(circle at 85% 85%, rgba(255,255,255,0.6), transparent 22%)',
            }}
          />

          <Stack alignItems="center" spacing={1.2} sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '22px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#fff',
                color: accent,
                boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
              }}
            >
              {isProperty ? (
                <HomeWorkRoundedIcon sx={{ fontSize: 30 }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 30 }} />
              )}
            </Box>

            <Chip
              label={isProperty ? 'Curated property pick' : 'Curated vehicle pick'}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: '#fff',
                color: accent,
                border: '1px solid rgba(255,255,255,0.95)',
              }}
            />
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="flex-start">
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: '1rem',
              }}
            >
              {item.title}
            </Typography>

            <Stack direction="row" spacing={0.7} alignItems="center" sx={{ mt: 0.6 }}>
              <PlaceRoundedIcon sx={{ fontSize: 15, color: '#94a3b8' }} />
              <Typography
                noWrap
                sx={{
                  fontSize: '0.82rem',
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                {item.location}
              </Typography>
            </Stack>
          </Box>

          <Chip
            size="small"
            label={item.type}
            sx={{
              fontWeight: 800,
              bgcolor: '#fff',
              color: accent,
              border: '1px solid #dbeafe',
            }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2.2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                color: '#94a3b8',
                fontWeight: 800,
                letterSpacing: '.07em',
                textTransform: 'uppercase',
              }}
            >
              Starting from
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              {item.price}
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowOutwardRoundedIcon />}
            onClick={() => onView?.(item)}
            sx={{
              px: 1.5,
              py: 0.9,
              borderRadius: '14px',
              fontWeight: 800,
              color: accent,
              background: 'rgba(255,255,255,0.92)',
              '&:hover': { background: '#fff' },
            }}
          >
            View
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

function ResultRow({ result, query, onClick }) {
  const isProperty = result._type === 'property'
  const accent = isProperty ? '#0f766e' : '#2563eb'
  const title = result.title || result.name || result.brand || 'Listing'
  const location = result.location || result.city || result.state || 'Location not available'
  const price = formatDisplayPrice(result.price, '—')

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.4,
        px: 2,
        py: 1.35,
        cursor: 'pointer',
        transition: 'background .14s ease',
        '&:hover': {
          background: isProperty ? 'rgba(15,118,110,0.04)' : 'rgba(37,99,235,0.04)',
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: isProperty ? 'rgba(15,118,110,0.08)' : 'rgba(37,99,235,0.08)',
          color: accent,
        }}
      >
        {isProperty ? (
          <HomeWorkRoundedIcon sx={{ fontSize: 19 }} />
        ) : (
          <DirectionsCarRoundedIcon sx={{ fontSize: 19 }} />
        )}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
          <Highlight text={title} query={query} />
        </Typography>

        <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.25 }}>
          <PlaceRoundedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
          <Typography noWrap sx={{ fontSize: '0.77rem', color: '#64748b' }}>
            <Highlight text={location} query={query} />
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 900, fontSize: '0.86rem', color: accent }}>
          {price}
        </Typography>
        <Chip
          size="small"
          label={isProperty ? 'Property' : 'Vehicle'}
          sx={{
            mt: 0.5,
            height: 20,
            fontSize: '0.66rem',
            fontWeight: 800,
            bgcolor: isProperty ? 'rgba(15,118,110,0.08)' : 'rgba(37,99,235,0.08)',
            color: accent,
          }}
        />
      </Box>
    </Box>
  )
}

export default function Hero() {
  const navigate = useNavigate()
  const appState = useAppState() || {}
  const properties = Array.isArray(appState.properties) ? appState.properties : []
  const vehicles = Array.isArray(appState.vehicles) ? appState.vehicles : []
  const listingsLoading = Boolean(appState.listingsLoading)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [budget, setBudget] = useState('')
  const [activeTab, setActiveTab] = useState('Properties')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const searchShellRef = useRef(null)

  const previewCards = useMemo(() => {
    const propCards = properties.slice(0, 1).map((p) => ({
      ...p,
      _type: 'property',
      type: 'Property',
      title: p.title || p.name || '2 BHK Flat',
      location: p.location || p.city || 'Bengaluru',
      price: formatDisplayPrice(p.price, '₹68L'),
    }))

    const vehCards = vehicles.slice(0, 1).map((v) => ({
      ...v,
      _type: 'vehicle',
      type: 'Vehicle',
      title: v.title || v.name || v.brand || 'Hyundai Creta',
      location: v.location || v.city || 'Bengaluru',
      price: formatDisplayPrice(v.price, '₹12.5L'),
    }))

    const fallback = [
      {
        id: 'fallback-property',
        _type: 'property',
        type: 'Property',
        title: '2 BHK Flat',
        location: 'Whitefield, Bengaluru',
        price: '₹68L',
      },
      {
        id: 'fallback-vehicle',
        _type: 'vehicle',
        type: 'Vehicle',
        title: 'Hyundai Creta',
        location: 'Indiranagar, Bengaluru',
        price: '₹12.5L',
      },
    ]

    const combined = [...propCards, ...vehCards]
    return combined.length >= 2 ? combined.slice(0, 2) : fallback
  }, [properties, vehicles])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q && !budget) return []

    const [budgetMin, budgetMax] = budget
      ? budget.split('-').map(Number)
      : [0, Infinity]

    const matchesBudget = (raw) => {
      if (!budget) return true
      const val = parsePrice(raw)
      if (val === null) return true
      return val >= budgetMin && val <= budgetMax
    }

    const matchesQuery = (item) => {
      if (!q) return true
      return [
        item.title,
        item.name,
        item.brand,
        item.model,
        item.location,
        item.city,
        item.state,
        item.type,
        item.property_type,
        item.vehicle_type,
      ].some((f) => f && String(f).toLowerCase().includes(q))
    }

    const results = []

    if (category === 'all' || category === 'property') {
      results.push(
        ...properties
          .filter((p) => matchesQuery(p) && matchesBudget(p.price))
          .map((p) => ({ ...p, _type: 'property' }))
      )
    }

    if (category === 'all' || category === 'vehicle') {
      results.push(
        ...vehicles
          .filter((v) => matchesQuery(v) && matchesBudget(v.price))
          .map((v) => ({ ...v, _type: 'vehicle' }))
      )
    }

    return results.slice(0, 8)
  }, [query, category, budget, properties, vehicles])

  const showDropdown = dropdownOpen && Boolean(searchShellRef.current) && (query.trim().length > 0 || budget !== '')

  const displayedCards =
    activeTab === 'Properties'
      ? previewCards
          .filter((c) => c._type === 'property')
          .concat(previewCards.filter((c) => c._type === 'vehicle'))
          .slice(0, 2)
      : previewCards
          .filter((c) => c._type === 'vehicle')
          .concat(previewCards.filter((c) => c._type === 'property'))
          .slice(0, 2)

  const handleSearchInput = (e) => {
    setQuery(e.target.value)
    setDropdownOpen(true)
  }

  const handleFocus = () => {
    setDropdownOpen(true)
  }

  const handleClickAway = () => {
    setDropdownOpen(false)
  }

  const navigateToResult = (result) => {
    setDropdownOpen(false)
    if (result._type === 'property') {
      navigate(`/dashboard/properties/${result.id}`)
    } else {
      navigate(`/dashboard/vehicles/${result.id}`)
    }
  }

  const handleSearch = () => {
    setDropdownOpen(false)

    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category !== 'all') params.set('category', category)
    if (budget) params.set('budget', budget)

    const qs = params.toString()
    navigate(qs ? `/browse?${qs}` : '/browse')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setQuery('')
    setDropdownOpen(false)
  }

  const handleExploreProperties = () => navigate('/dashboard/properties')
  const handleExploreVehicles = () => navigate('/dashboard/vehicles')

  const handleViewCard = (item) => {
    if (!item?.id) return
    if (item._type === 'property') navigate(`/dashboard/properties/${item.id}`)
    else navigate(`/dashboard/vehicles/${item.id}`)
  }

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 5, md: 7 },
        pb: { xs: 8, md: 11 },
        background:
          'linear-gradient(180deg, #f8fafc 0%, #f0fdfa 48%, #eff6ff 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 12% 12%, rgba(15,118,110,0.10), transparent 18%), radial-gradient(circle at 86% 14%, rgba(37,99,235,0.08), transparent 18%), radial-gradient(circle at 50% 100%, rgba(15,23,42,0.04), transparent 26%)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            borderRadius: { xs: '28px', md: '40px' },
            px: { xs: 2, sm: 3, md: 4.5 },
            py: { xs: 2.5, md: 4.5 },
            background: 'rgba(255,255,255,0.74)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 28px 80px rgba(15,23,42,0.08)',
          }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={2.4} sx={{ pr: { md: 2 } }}>
                <Chip
                  icon={<WorkspacePremiumRoundedIcon />}
                  label="Premium property + vehicle marketplace"
                  sx={{
                    alignSelf: { xs: 'center', md: 'flex-start' },
                    height: 38,
                    borderRadius: '999px',
                    px: 1,
                    fontWeight: 900,
                    color: '#0f766e',
                    background: 'rgba(15,118,110,0.08)',
                    border: '1px solid rgba(15,118,110,0.14)',
                    '& .MuiChip-icon': { color: '#0f766e' },
                  }}
                />

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography
                    variant="h1"
                    sx={{
                      maxWidth: 760,
                      mx: { xs: 'auto', md: 0 },
                      fontWeight: 900,
                      letterSpacing: '-0.05em',
                      lineHeight: { xs: 1.05, md: 0.98 },
                      fontSize: { xs: '2.45rem', sm: '3.5rem', md: '4.9rem' },
                      color: '#0f172a',
                    }}
                  >
                    Find trusted
                    <Box component="span" sx={{ color: '#0f766e' }}>
                      {' '}properties
                    </Box>
                    {' '}and
                    <Box component="span" sx={{ color: '#2563eb' }}>
                      {' '}vehicles
                    </Box>
                    {' '}in one marketplace
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      maxWidth: 660,
                      mx: { xs: 'auto', md: 0 },
                      color: '#64748b',
                      fontSize: { xs: '1rem', md: '1.05rem' },
                      lineHeight: 1.8,
                    }}
                  >
                    Explore flats, plots, houses, cars, and bikes through a cleaner
                    browsing experience with sharper filters, verified seller flows,
                    and faster access to listing details.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.4}
                  sx={{
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeWorkRoundedIcon />}
                    onClick={handleExploreProperties}
                    sx={{
                      px: 2.6,
                      py: 1.35,
                      borderRadius: '16px',
                      textTransform: 'none',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #0f766e, #0d9488)',
                      boxShadow: '0 14px 30px rgba(15,118,110,0.24)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0b5f59, #0f766e)',
                      },
                    }}
                  >
                    Explore Properties
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DirectionsCarRoundedIcon />}
                    onClick={handleExploreVehicles}
                    sx={{
                      px: 2.6,
                      py: 1.35,
                      borderRadius: '16px',
                      textTransform: 'none',
                      fontWeight: 900,
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        borderColor: '#94a3b8',
                        bgcolor: '#fff',
                      },
                    }}
                  >
                    Explore Vehicles
                  </Button>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  {STATS.map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 1.6,
                        py: 0.95,
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.92)',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: '28px',
                  border: '1px solid #e2e8f0',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 20px 44px rgba(15,23,42,0.06)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 2.4 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: '#0f172a' }}>
                        Marketplace preview
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mt: 0.4 }}>
                        Curated cards from current listings
                      </Typography>
                    </Box>

                    <Chip
                      icon={<VerifiedRoundedIcon />}
                      label="Verified"
                      sx={{
                        fontWeight: 900,
                        bgcolor: 'rgba(37,99,235,0.08)',
                        color: '#2563eb',
                        '& .MuiChip-icon': { color: '#2563eb' },
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {['Properties', 'Vehicles'].map((tab) => {
                      const active = activeTab === tab
                      return (
                        <Button
                          key={tab}
                          size="small"
                          onClick={() => setActiveTab(tab)}
                          sx={{
                            flex: 1,
                            py: 1,
                            borderRadius: '999px',
                            textTransform: 'none',
                            fontWeight: active ? 900 : 800,
                            color: active ? '#fff' : '#475569',
                            background: active
                              ? tab === 'Properties'
                                ? 'linear-gradient(135deg, #0f766e, #0d9488)'
                                : 'linear-gradient(135deg, #2563eb, #3b82f6)'
                              : '#f8fafc',
                            border: active ? 'none' : '1px solid #e2e8f0',
                            '&:hover': {
                              background: active
                                ? undefined
                                : '#f1f5f9',
                            },
                          }}
                        >
                          {tab}
                        </Button>
                      )
                    })}
                  </Stack>

                  <Grid container spacing={1.8}>
                    {displayedCards.map((item, idx) => (
                      <Grid item xs={12} key={item.id || item.title || idx}>
                        <FeaturedCard item={item} onView={handleViewCard} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ mt: { xs: 3.2, md: 4 } }}>
              <Box
                ref={searchShellRef}
                data-search-shell
                sx={{
                  position: 'relative',
                  maxWidth: 1140,
                  mx: 'auto',
                }}
              >
                <Card
                  sx={{
                    borderRadius: '28px',
                    background: '#fff',
                    border: showDropdown
                      ? '1.5px solid rgba(15,118,110,0.28)'
                      : '1px solid rgba(226,232,240,0.95)',
                    boxShadow: showDropdown
                      ? '0 20px 44px rgba(15,118,110,0.10)'
                      : '0 16px 36px rgba(15,23,42,0.06)',
                    transition: 'border .18s ease, box-shadow .18s ease',
                    overflow: 'visible',
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.4, md: 1.6 } }}>
                    <Stack
                      direction={{ xs: 'column', lg: 'row' }}
                      alignItems={{ xs: 'stretch', lg: 'center' }}
                      spacing={{ xs: 1.3, lg: 0 }}
                      divider={
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            display: { xs: 'none', lg: 'block' },
                            borderColor: '#e2e8f0',
                          }}
                        />
                      }
                    >
                      <Box sx={{ px: { lg: 1.5 }, py: 0.9, minWidth: { lg: 170 } }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6 }}>
                          <TuneRoundedIcon sx={{ color: '#64748b', fontSize: 18 }} />
                          <Typography sx={{ fontSize: '0.77rem', fontWeight: 900, color: '#64748b' }}>
                            Category
                          </Typography>
                        </Stack>

                        <FormControl variant="standard" fullWidth>
                          <Select
                            value={category}
                            onChange={(e) => {
                              setCategory(e.target.value)
                              setDropdownOpen(true)
                            }}
                            disableUnderline
                            inputProps={{ 'aria-label': 'Select category' }}
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.92rem',
                              color: '#0f172a',
                              '& .MuiSelect-select': { py: 0 },
                            }}
                          >
                            {CATEGORY_OPTIONS.map((o) => (
                              <MenuItem key={o.value} value={o.value} sx={{ fontWeight: 700 }}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ flex: 1, px: { lg: 2 }, py: 0.9 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6 }}>
                          <SearchRoundedIcon sx={{ color: '#64748b', fontSize: 18 }} />
                          <Typography sx={{ fontSize: '0.77rem', fontWeight: 900, color: '#64748b' }}>
                            Search listings
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <InputBase
                            value={query}
                            onChange={handleSearchInput}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            placeholder="City, locality, property type, brand..."
                            fullWidth
                            inputProps={{ 'aria-label': 'Search listings' }}
                            sx={{
                              fontSize: '0.94rem',
                              color: '#0f172a',
                              '& input::placeholder': {
                                color: '#94a3b8',
                                opacity: 1,
                              },
                            }}
                          />

                          {query && (
                            <Box
                              onClick={handleClear}
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '999px',
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                                color: '#94a3b8',
                                '&:hover': {
                                  color: '#475569',
                                  background: '#f1f5f9',
                                },
                              }}
                            >
                              <CloseRoundedIcon sx={{ fontSize: 17 }} />
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ px: { lg: 1.5 }, py: 0.9, minWidth: { lg: 170 } }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6 }}>
                          <CurrencyRupeeRoundedIcon sx={{ color: '#64748b', fontSize: 18 }} />
                          <Typography sx={{ fontSize: '0.77rem', fontWeight: 900, color: '#64748b' }}>
                            Budget
                          </Typography>
                        </Stack>

                        <FormControl variant="standard" fullWidth>
                          <Select
                            value={budget}
                            onChange={(e) => {
                              setBudget(e.target.value)
                              setDropdownOpen(true)
                            }}
                            disableUnderline
                            displayEmpty
                            inputProps={{ 'aria-label': 'Select budget range' }}
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.92rem',
                              color: '#0f172a',
                              '& .MuiSelect-select': { py: 0 },
                            }}
                          >
                            {BUDGET_OPTIONS.map((o) => (
                              <MenuItem key={o.value} value={o.value} sx={{ fontWeight: 700 }}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ px: { lg: 1 }, pt: { xs: 0.4, lg: 0 } }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<SearchRoundedIcon />}
                          onClick={handleSearch}
                          sx={{
                            height: 54,
                            minWidth: 160,
                            borderRadius: '16px',
                            textTransform: 'none',
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                            boxShadow: '0 14px 30px rgba(15,23,42,0.18)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #020617, #0f172a)',
                            },
                          }}
                        >
                          Search
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Popper
                  open={showDropdown}
                  anchorEl={searchShellRef.current}
                  placement="bottom-start"
                  transition
                  sx={{
                    zIndex: 1400,
                    width: searchShellRef.current?.clientWidth || 320,
                  }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={160}>
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 1,
                          borderRadius: '20px',
                          border: '1px solid rgba(226,232,240,0.95)',
                          boxShadow: '0 24px 60px rgba(15,23,42,0.12)',
                          overflow: 'hidden',
                          bgcolor: '#fff',
                        }}
                      >
                        {listingsLoading ? (
                          <Box sx={{ px: 3, py: 2.8, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 700 }}>
                              Loading listings...
                            </Typography>
                          </Box>
                        ) : searchResults.length > 0 ? (
                          <>
                            <Box
                              sx={{
                                px: 2,
                                pt: 1.5,
                                pb: 0.8,
                                background: '#fcfcfd',
                                borderBottom: '1px solid #f1f5f9',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.72rem',
                                  fontWeight: 900,
                                  color: '#94a3b8',
                                  letterSpacing: '0.07em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                              </Typography>
                            </Box>

                            {searchResults.map((r, i) => (
                              <ResultRow
                                key={r.id || i}
                                result={r}
                                query={query}
                                onClick={() => navigateToResult(r)}
                              />
                            ))}

                            <Divider />

                            <Box
                              onClick={handleSearch}
                              sx={{
                                px: 2,
                                py: 1.4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                color: '#0f766e',
                                '&:hover': {
                                  background: 'rgba(15,118,110,0.04)',
                                },
                              }}
                            >
                              <SearchRoundedIcon sx={{ fontSize: 17 }} />
                              <Typography sx={{ fontSize: '0.86rem', fontWeight: 900 }}>
                                See all results for "{query || 'selected filters'}"
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <Box sx={{ px: 3, py: 3, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>
                              No listings found
                            </Typography>
                            <Typography sx={{ mt: 0.6, fontSize: '0.8rem', color: '#64748b' }}>
                              Try another keyword, location, category, or budget range.
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </Box>
          </ClickAwayListener>

          <Stack
            direction="row"
            spacing={1.1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              mt: 2.2,
              justifyContent: 'center',
            }}
          >
            <SearchMetric label="properties" value={properties.length || '0'} />
            <SearchMetric label="vehicles" value={vehicles.length || '0'} />
            <SearchMetric label="live categories" value="2" />
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}