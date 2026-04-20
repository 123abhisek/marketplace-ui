
// src/components/Hero.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  InputBase,
  MenuItem,
  Stack,
  Typography,
  Select,
  FormControl,
  Popper,
  Paper,
  ClickAwayListener,
  Fade,
} from '@mui/material'
import SearchRoundedIcon          from '@mui/icons-material/SearchRounded'
import PlaceRoundedIcon           from '@mui/icons-material/PlaceRounded'
import CurrencyRupeeRoundedIcon   from '@mui/icons-material/CurrencyRupeeRounded'
import HomeWorkRoundedIcon        from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon   from '@mui/icons-material/DirectionsCarRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import VerifiedRoundedIcon        from '@mui/icons-material/VerifiedRounded'
import ArrowOutwardRoundedIcon    from '@mui/icons-material/ArrowOutwardRounded'
import TuneRoundedIcon            from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon           from '@mui/icons-material/CloseRounded'
import { useAppState }            from '../hooks/useAppState'

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { value: 'all',      label: 'All Categories' },
  { value: 'property', label: 'Properties' },
  { value: 'vehicle',  label: 'Vehicles' },
]

const BUDGET_OPTIONS = [
  { value: '',              label: 'Any Budget' },
  { value: '0-5000',        label: 'Under ₹5K' },
  { value: '5000-20000',    label: '₹5K – ₹20K' },
  { value: '20000-50000',   label: '₹20K – ₹50K' },
  { value: '50000-100000',  label: '₹50K – ₹1L' },
  { value: '100000-300000', label: '₹1L – ₹3L' },
  { value: '300000-500000', label: '₹3L – ₹5L' },
  { value: '500000-999999999', label: 'Above ₹5L' },
]

const STATS = ['10k+ active listings', '₹299 premium access', 'Trusted seller flow']

// ── Price parser — handles "₹68L", "₹12.5L", "₹1.2Cr", bare numbers ──────────
function parsePrice(raw) {
  if (!raw && raw !== 0) return null
  if (typeof raw === 'number') return raw
  const s = String(raw).replace(/[₹,\s]/g, '').toLowerCase()
  if (s.endsWith('cr'))  return parseFloat(s) * 1e7
  if (s.endsWith('lac') || s.endsWith('lakh')) return parseFloat(s) * 1e5
  if (s.endsWith('l'))   return parseFloat(s) * 1e5
  if (s.endsWith('k'))   return parseFloat(s) * 1e3
  return parseFloat(s) || null
}

// ── Highlight matching text ────────────────────────────────────────────────────
function Highlight({ text = '', query = '' }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <Box component="mark" sx={{ bgcolor: 'rgba(91,76,240,0.13)', color: 'inherit', borderRadius: '3px', px: '2px' }}>
        {text.slice(idx, idx + query.length)}
      </Box>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── Featured card shown in the browser preview ─────────────────────────────────
function FeaturedCard({ item, onView }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '24px',
        background: item.bg,
        border: '1px solid rgba(226,232,240,0.9)',
        boxShadow: 'none',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 16px 40px rgba(15,23,42,0.10)' },
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Box
          sx={{
            mb: 2, height: 190, borderRadius: '20px',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(255,255,255,0.9)',
            display: 'grid', placeItems: 'center', color: '#334155',
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 68, height: 68, borderRadius: '20px',
                display: 'grid', placeItems: 'center',
                background: '#fff', boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
              }}
            >
              {item.icon}
            </Box>
            <Typography variant="body2" color="text.secondary">Featured listing preview</Typography>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography fontWeight={800}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{item.location}</Typography>
          </Box>
          <Chip
            size="small"
            label={item.type}
            sx={{ fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.82)', color: '#475569' }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 900 }}>{item.price}</Typography>
          <Button
            endIcon={<ArrowOutwardRoundedIcon />}
            onClick={() => onView && onView(item)}
            sx={{ fontWeight: 800 }}
          >
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ── Search result row in dropdown ──────────────────────────────────────────────
function ResultRow({ result, query, onClick }) {
  const isProperty = result._type === 'property'
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 2, py: 1.4, cursor: 'pointer',
        transition: 'background .14s',
        '&:hover': { background: 'rgba(91,76,240,0.05)' },
      }}
    >
      <Box
        sx={{
          width: 36, height: 36, borderRadius: '11px', flexShrink: 0,
          display: 'grid', placeItems: 'center',
          background: isProperty ? 'rgba(91,76,240,0.09)' : 'rgba(15,118,110,0.09)',
          color: isProperty ? '#5b4cf0' : '#0f766e',
        }}
      >
        {isProperty
          ? <HomeWorkRoundedIcon sx={{ fontSize: 18 }} />
          : <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography fontWeight={700} fontSize="0.88rem" noWrap>
          <Highlight text={result.title || result.name || result.brand || 'Listing'} query={query} />
        </Typography>
        <Typography fontSize="0.76rem" color="text.secondary" noWrap>
          <Highlight text={result.location || result.city || result.state || ''} query={query} />
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography fontWeight={800} fontSize="0.85rem" color={isProperty ? '#5b4cf0' : '#0f766e'}>
          {result.price ? `₹${result.price}` : '—'}
        </Typography>
        <Chip
          label={isProperty ? 'Property' : 'Vehicle'}
          size="small"
          sx={{
            height: 18, fontSize: '0.65rem', fontWeight: 700,
            bgcolor: isProperty ? 'rgba(91,76,240,0.08)' : 'rgba(15,118,110,0.08)',
            color: isProperty ? '#5b4cf0' : '#0f766e',
          }}
        />
      </Box>
    </Box>
  )
}

// ── Main Hero component ────────────────────────────────────────────────────────
export default function Hero() {
  const navigate = useNavigate()
  const { properties, vehicles, listingsLoading } = useAppState()

  // Search state
  const [query,      setQuery]      = useState('')
  const [category,   setCategory]   = useState('all')
  const [budget,     setBudget]     = useState('')
  const [anchorEl,   setAnchorEl]   = useState(null)
  const [activeTab,  setActiveTab]  = useState('Properties')

  // Which cards to show in the featured preview
  const previewCards = useMemo(() => {
    const propCards = properties.slice(0, 1).map((p) => ({
      ...p,
      _type: 'property',
      type: 'Property',
      title: p.title || p.name || '2 BHK Flat',
      location: p.location || p.city || 'Bengaluru',
      price: p.price ? `₹${p.price}` : '₹68L',
      bg: 'linear-gradient(135deg, #e9e7ff 0%, #f4f7ff 100%)',
      icon: <HomeWorkRoundedIcon sx={{ fontSize: 28 }} />,
    }))
    const vehCards = vehicles.slice(0, 1).map((v) => ({
      ...v,
      _type: 'vehicle',
      type: 'Vehicle',
      title: v.title || v.name || v.brand || 'Hyundai Creta',
      location: v.location || v.city || 'Bengaluru',
      price: v.price ? `₹${v.price}` : '₹12.5L',
      bg: 'linear-gradient(135deg, #e1f5ef 0%, #f3fbf8 100%)',
      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
    }))

    // Fallback to static if API hasn't returned yet
    const fallback = [
      {
        _type: 'property', type: 'Property', title: '2 BHK Flat',
        location: 'Whitefield, Bengaluru', price: '₹68L',
        bg: 'linear-gradient(135deg, #e9e7ff 0%, #f4f7ff 100%)',
        icon: <HomeWorkRoundedIcon sx={{ fontSize: 28 }} />,
      },
      {
        _type: 'vehicle', type: 'Vehicle', title: 'Hyundai Creta',
        location: 'Indiranagar, Bengaluru', price: '₹12.5L',
        bg: 'linear-gradient(135deg, #e1f5ef 0%, #f3fbf8 100%)',
        icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
      },
    ]
    const combined = [...propCards, ...vehCards]
    return combined.length >= 2 ? combined.slice(0, 2) : fallback
  }, [properties, vehicles])

  // ── Live search results ──────────────────────────────────────────────────────
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
        item.title, item.name, item.brand, item.model,
        item.location, item.city, item.state, item.type,
        item.property_type, item.vehicle_type,
      ].some((f) => f && String(f).toLowerCase().includes(q))
    }

    let results = []

    if (category === 'all' || category === 'property') {
      const propMatches = properties
        .filter((p) => matchesQuery(p) && matchesBudget(p.price))
        .map((p) => ({ ...p, _type: 'property' }))
      results.push(...propMatches)
    }

    if (category === 'all' || category === 'vehicle') {
      const vehMatches = vehicles
        .filter((v) => matchesQuery(v) && matchesBudget(v.price))
        .map((v) => ({ ...v, _type: 'vehicle' }))
      results.push(...vehMatches)
    }

    return results.slice(0, 8)
  }, [query, category, budget, properties, vehicles])

  const showDropdown = Boolean(anchorEl) && (query.trim().length > 0 || budget !== '')

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSearchInput = (e) => {
    setQuery(e.target.value)
    if (!anchorEl) setAnchorEl(e.currentTarget.closest('[data-searchbar]'))
  }

  const handleFocus = (e) => {
    setAnchorEl(e.currentTarget.closest('[data-searchbar]'))
  }

  const handleClickAway = () => setAnchorEl(null)

  const navigateToResult = (result) => {
    setAnchorEl(null)
    if (result._type === 'property') {
      navigate(`/dashboard/properties/${result.id}`)
    } else {
      navigate(`/dashboard/vehicles/${result.id}`)
    }
  }

  const handleSearch = () => {
    setAnchorEl(null)
    const params = new URLSearchParams()
    if (query.trim())   params.set('q', query.trim())
    if (category !== 'all') params.set('category', category)
    if (budget)         params.set('budget', budget)
    navigate(`/browse?${params.toString()}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setQuery('')
    setAnchorEl(null)
  }

  const handleExploreProperties = () => navigate('/dashboard/properties')
  const handleExploreVehicles   = () => navigate('/dashboard/vehicles')

  const handleViewCard = (item) => {
    if (!item.id) return
    if (item._type === 'property') navigate(`/dashboard/properties/${item.id}`)
    else navigate(`/dashboard/vehicles/${item.id}`)
  }

  // Tab-filtered preview cards
  const displayedCards = activeTab === 'Properties'
    ? previewCards.filter((c) => c._type === 'property').concat(
        previewCards.filter((c) => c._type === 'vehicle')
      ).slice(0, 2)
    : previewCards.filter((c) => c._type === 'vehicle').concat(
        previewCards.filter((c) => c._type === 'property')
      ).slice(0, 2)

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #f6f7fb 0%, #f2f5fb 100%)',
      }}
    >
      {/* Background radial blobs */}
      <Box
        sx={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(circle at 12% 18%, rgba(108,99,255,0.10), transparent 18%), ' +
            'radial-gradient(circle at 88% 20%, rgba(107,211,180,0.10), transparent 20%), ' +
            'radial-gradient(circle at 50% 100%, rgba(124,108,255,0.06), transparent 24%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: '30px', md: '42px' },
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 4, md: 6 },
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 24px 80px rgba(15,23,42,0.07)',
          }}
        >
          <Stack alignItems="center" textAlign="center" spacing={3}>
            {/* Badge */}
            <Chip
              icon={<WorkspacePremiumRoundedIcon />}
              label="Subscription-based property + vehicle marketplace"
              sx={{
                height: 38, borderRadius: '999px', px: 1,
                fontWeight: 800, color: '#5b4cf0',
                backgroundColor: 'rgba(91,76,240,0.08)',
                border: '1px solid rgba(91,76,240,0.12)',
                '& .MuiChip-icon': { color: '#5b4cf0' },
              }}
            />

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                maxWidth: 880, fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: { xs: 1.06, md: 0.98 },
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5.2rem' },
                color: '#111827',
              }}
            >
              Discover properties and vehicles in one{' '}
              <Box component="span" sx={{ color: '#5b4cf0' }}>premium</Box>{' '}
              marketplace
            </Typography>

            <Typography
              sx={{
                maxWidth: 720, color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.08rem' },
                lineHeight: 1.85,
              }}
            >
              Search flats, land, houses, cars, bikes, and commercial listings through a
              cleaner marketplace experience built for faster browsing and better buyer trust.
            </Typography>

            {/* ── Search bar ─────────────────────────────────────────────── */}
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ width: '100%', maxWidth: 860, position: 'relative' }}>
                <Card
                  data-searchbar=""
                  sx={{
                    width: '100%', borderRadius: '22px',
                    background: '#fff',
                    border: showDropdown
                      ? '1.5px solid rgba(91,76,240,0.35)'
                      : '1px solid rgba(226,232,240,0.95)',
                    boxShadow: showDropdown
                      ? '0 16px 40px rgba(91,76,240,0.10)'
                      : '0 16px 40px rgba(15,23,42,0.06)',
                    transition: 'border .18s, box-shadow .18s',
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.4, md: 1.6 }, '&:last-child': { pb: { xs: 1.4, md: 1.6 } } }}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems={{ xs: 'stretch', md: 'center' }}
                      divider={
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(226,232,240,0.95)' }}
                        />
                      }
                    >
                      {/* Category selector */}
                      <Stack sx={{ flex: '0 0 auto', px: { md: 1.5 }, py: 0.5 }} spacing={0.3}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <TuneRoundedIcon sx={{ color: '#64748b', fontSize: 18 }} />
                          <Typography fontWeight={800} fontSize="0.82rem" color="#64748b">Category</Typography>
                        </Stack>
                        <FormControl variant="standard" size="small">
                          <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disableUnderline
                            sx={{
                              fontWeight: 700, fontSize: '0.88rem', color: '#0f172a',
                              '& .MuiSelect-select': { py: 0, px: 0 },
                            }}
                          >
                            {CATEGORY_OPTIONS.map((o) => (
                              <MenuItem key={o.value} value={o.value} sx={{ fontWeight: 700 }}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>

                      {/* Keyword input */}
                      <Stack sx={{ flex: 1, px: { md: 2 }, py: 1.1 }} spacing={0.4}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <SearchRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                          <Typography fontWeight={800}>Search</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                          <InputBase
                            value={query}
                            onChange={handleSearchInput}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            placeholder="City, locality, property type, brand…"
                            fullWidth
                            inputProps={{ 'aria-label': 'Search listings' }}
                            sx={{
                              fontSize: '0.88rem', color: '#0f172a',
                              '& input::placeholder': { color: '#94a3b8', opacity: 1 },
                            }}
                          />
                          {query && (
                            <Box
                              onClick={handleClear}
                              sx={{
                                cursor: 'pointer', color: '#94a3b8', display: 'flex',
                                '&:hover': { color: '#475569' }, transition: 'color .14s',
                              }}
                            >
                              <CloseRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                          )}
                        </Stack>
                      </Stack>

                      {/* Budget selector */}
                      <Stack sx={{ flex: '0 0 auto', px: { md: 1.5 }, py: 1.1 }} spacing={0.4}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                          <CurrencyRupeeRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                          <Typography fontWeight={800}>Budget</Typography>
                        </Stack>
                        <FormControl variant="standard" size="small">
                          <Select
                            value={budget}
                            onChange={(e) => {
                              setBudget(e.target.value)
                              setAnchorEl(document.querySelector('[data-searchbar]'))
                            }}
                            disableUnderline
                            displayEmpty
                            sx={{
                              fontWeight: 700, fontSize: '0.88rem', color: '#0f172a',
                              '& .MuiSelect-select': { py: 0, px: 0 },
                            }}
                          >
                            {BUDGET_OPTIONS.map((o) => (
                              <MenuItem key={o.value} value={o.value} sx={{ fontWeight: 700 }}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>

                      {/* Search button */}
                      <Box sx={{ p: { xs: 0, md: 0.8 }, pt: { xs: 1.5, md: 0 } }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          startIcon={<SearchRoundedIcon />}
                          onClick={handleSearch}
                          sx={{
                            height: 54, minWidth: 150, borderRadius: '16px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #14123b 0%, #2d2a72 100%)',
                            boxShadow: '0 14px 32px rgba(20,18,59,0.22)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #0f0e31 0%, #262261 100%)',
                            },
                          }}
                        >
                          Search
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* ── Live results dropdown ───────────────────────────────── */}
                {showDropdown && (
                  <Paper
                    elevation={0}
                    sx={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0, right: 0,
                      zIndex: 1300,
                      borderRadius: '18px',
                      border: '1px solid rgba(226,232,240,0.95)',
                      boxShadow: '0 24px 60px rgba(15,23,42,0.12)',
                      overflow: 'hidden',
                      bgcolor: '#fff',
                    }}
                  >
                    {listingsLoading ? (
                      <Box sx={{ px: 3, py: 2.5, textAlign: 'center' }}>
                        <Typography fontSize="0.85rem" color="text.secondary">
                          Loading listings…
                        </Typography>
                      </Box>
                    ) : searchResults.length > 0 ? (
                      <>
                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                          <Typography fontSize="0.72rem" fontWeight={800} color="#94a3b8" letterSpacing="0.06em" textTransform="uppercase">
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
                            px: 2, py: 1.4, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 1,
                            '&:hover': { background: 'rgba(91,76,240,0.04)' },
                          }}
                        >
                          <SearchRoundedIcon sx={{ fontSize: 16, color: '#5b4cf0' }} />
                          <Typography fontSize="0.84rem" fontWeight={800} color="#5b4cf0">
                            See all results for "{query || 'selected filters'}"
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ px: 3, py: 3, textAlign: 'center' }}>
                        <Typography fontSize="0.88rem" fontWeight={700} color="#334155" mb={0.5}>
                          No listings found
                        </Typography>
                        <Typography fontSize="0.78rem" color="text.secondary">
                          Try a different keyword, location, or budget range
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeWorkRoundedIcon />}
                onClick={handleExploreProperties}
                sx={{
                  px: 2.6, py: 1.35, borderRadius: '16px', fontWeight: 800,
                  background: 'linear-gradient(135deg, #6d5ef6 0%, #4f8cff 100%)',
                  boxShadow: '0 14px 30px rgba(108,99,255,0.24)',
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
                  px: 2.6, py: 1.35, borderRadius: '16px', fontWeight: 800,
                  borderColor: 'rgba(148,163,184,0.4)',
                  color: '#0f172a',
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                Explore Vehicles
              </Button>
            </Stack>

            {/* Stats pills */}
            <Stack
              direction="row"
              spacing={1.2}
              flexWrap="wrap"
              useFlexGap
              justifyContent="center"
            >
              {STATS.map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.7, py: 0.95, borderRadius: '999px',
                    background: 'rgba(255,255,255,0.88)',
                    border: '1px solid rgba(226,232,240,0.95)',
                    color: '#475569', fontSize: '0.9rem', fontWeight: 700,
                  }}
                >
                  {item}
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* ── Marketplace preview card ───────────────────────────────────── */}
          <Box
            sx={{
              position: 'relative',
              mt: { xs: 5, md: 7 },
              maxWidth: 980, mx: 'auto',
              px: { xs: 0, md: 4 },
            }}
          >
            <Card
              sx={{
                position: 'relative', overflow: 'hidden',
                borderRadius: { xs: '26px', md: '34px' },
                background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,255,0.98))',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                      sx={{
                        width: 44, height: 44, borderRadius: '14px',
                        display: 'grid', placeItems: 'center',
                        background: 'rgba(91,76,240,0.08)', color: '#5b4cf0',
                      }}
                    >
                      <SearchRoundedIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800}>Browse Marketplace</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {listingsLoading
                          ? 'Loading listings…'
                          : `${properties.length} properties · ${vehicles.length} vehicles`}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Tab switcher */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {['Properties', 'Vehicles'].map((tab) => (
                      <Chip
                        key={tab}
                        label={tab}
                        onClick={() => setActiveTab(tab)}
                        sx={{
                          fontWeight: 800, borderRadius: '999px', cursor: 'pointer',
                          background: activeTab === tab
                            ? 'linear-gradient(135deg, #6d5ef6 0%, #4f8cff 100%)'
                            : 'rgba(241,245,249,1)',
                          color: activeTab === tab ? '#fff' : '#475569',
                          transition: 'all .18s',
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Grid container spacing={2.2}>
                  {displayedCards.map((item, idx) => (
                    <Grid item xs={12} md={6} key={item.id || item.title || idx}>
                      <FeaturedCard item={item} onView={handleViewCard} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Floating Premium badge */}
            <Card
              sx={{
                position: 'absolute',
                left: { xs: 10, md: 0 }, top: { xs: -18, md: 34 },
                width: { xs: 170, md: 210 },
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.1} alignItems="center">
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '14px',
                      display: 'grid', placeItems: 'center',
                      color: '#047857', background: 'rgba(16,185,129,0.10)',
                    }}
                  >
                    <WorkspacePremiumRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800}>Premium</Typography>
                    <Typography variant="body2" color="text.secondary">Unlock full details</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Floating Verified badge */}
            <Card
              sx={{
                position: 'absolute',
                right: { xs: 10, md: 0 }, bottom: { xs: -18, md: 28 },
                width: { xs: 172, md: 220 },
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.1} alignItems="center">
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '14px',
                      display: 'grid', placeItems: 'center',
                      color: '#7c3aed', background: 'rgba(124,58,237,0.10)',
                    }}
                  >
                    <VerifiedRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800}>Verified sellers</Typography>
                    <Typography variant="body2" color="text.secondary">Cleaner buyer trust</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}