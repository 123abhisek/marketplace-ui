
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert, Box, Button, Chip, Grid, InputAdornment,
  MenuItem, Skeleton, Stack, TextField, Typography,
} from '@mui/material'
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon      from '@mui/icons-material/TuneRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AddHomeRoundedIcon   from '@mui/icons-material/AddHomeRounded'
import RefreshRoundedIcon   from '@mui/icons-material/RefreshRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Link as RouterLink } from 'react-router-dom'
import PropertyCard         from '../components/PropertyCard'
import Loader               from '../components/Loader'
import EmptyState           from '../components/EmptyState'
import { propertyService }  from '../services/api'
import { extractError, normalizeProperty } from '../utils/mappers'
import { useAppState }      from '../hooks/useAppState'

const TYPES = [
  'All', 'Residential', 'Commercial', 'Agricultural',
  'Site', 'Flat', 'Apartment', 'Villa', 'Land',
]

export default function PropertiesPage() {
  const { user } = useAppState()
  const [properties, setProperties] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [typeFilter, setType]       = useState('All')
  const [sortBy,     setSortBy]     = useState('latest')
  const abortRef                    = useRef(null)

  const hasFullAccess = Boolean(
    user?.isPremium ||
    user?.is_premium ||
    user?.role === 'premium' ||
    user?.role === 'admin' ||
    user?.role === 'seller' ||
    user?.is_admin ||
    user?.isAdmin
  )

  const fetchProperties = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError('')
    try {
      const res = await propertyService.getAll({ limit: 100 })
      const list = Array.isArray(res) ? res : res?.data || res?.items || []
      setProperties(list.map(normalizeProperty))
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
    return () => abortRef.current?.abort()
  }, [fetchProperties])

  // ── Client-side filter + sort ─────────────────────────────────────────────
  const filtered = properties
    .filter((p) => {
      const q      = search.toLowerCase()
      const matchQ = !q
        || p.title?.toLowerCase().includes(q)
        || p.location?.toLowerCase().includes(q)
        || p.city?.toLowerCase().includes(q)
        || p.localAddress?.toLowerCase().includes(q)
      
      const pType = String(p.propertyType || p.property_type || '').toLowerCase()
      const tFilter = typeFilter.toLowerCase()
      const matchT = typeFilter === 'All'
        || pType === tFilter
        || (tFilter === 'site' && pType.includes('site'))
        || (tFilter === 'agricultural' && (pType.includes('agri') || pType.includes('farm')))
        || pType.includes(tFilter)

      return matchQ && matchT
    })
    .sort((a, b) => {
      const priceA = Number(a.price ?? a.expectedPrice ?? 0)
      const priceB = Number(b.price ?? b.expectedPrice ?? 0)
      if (sortBy === 'price-asc')  return priceA - priceB
      if (sortBy === 'price-desc') return priceB - priceA
      return 0 // API returns newest first; preserve order for 'latest'
    })

  return (
    <Stack spacing={3} sx={{ pb: { xs: 10, sm: 4 } }}>
      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="h5" fontWeight={900}
            sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Property Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {loading ? <Skeleton variant="text" width={110} height={18} animation="wave" /> : `${properties.length} listings available`}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
        >
          <Chip
            label={hasFullAccess ? "👑 Premium Active" : "Free Plan"}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: "0.74rem",
              background: hasFullAccess ? "#ECFDF5" : "#FEF3C7",
              color: hasFullAccess ? "#059669" : "#D97706",
              border: hasFullAccess ? "1px solid #A7F3D0" : "1px solid #FDE68A",
              borderRadius: "10px",
            }}
          />
          <Button
            onClick={fetchProperties}
            disabled={loading}
            size="small"
            startIcon={<RefreshRoundedIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              borderRadius: '10px',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'none',
              '&:hover': { background: '#F1F5F9' },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {/* ── API Error ── */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}
          action={
            <Button color="inherit" size="small" onClick={fetchProperties}>Retry</Button>
          }>
          {error}
        </Alert>
      )}

      {/* ── Non-Premium Plan Notice Banner ── */}
      {!hasFullAccess && (
        <Box
          sx={{
            p: 2,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '11px',
                bgcolor: '#F59E0B',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
            >
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#92400E' }}>
                Browsing as Free Member
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#B45309' }}>
                Seller phone numbers, exact addresses & HD photos are locked. Upgrade to unlock full access.
              </Typography>
            </Box>
          </Stack>
          <Button
            component={RouterLink}
            to="/subscription"
            variant="contained"
            size="small"
            sx={{
              background: '#B45309',
              color: '#fff',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'none',
              px: 2.2,
              py: 0.8,
              boxShadow: '0 2px 8px rgba(180,83,9,0.25)',
              '&:hover': { background: '#92400E' },
            }}
          >
            Upgrade to Premium — ₹299
          </Button>
        </Box>
      )}

      {/* ── Filters Bar ── */}
      <Box sx={{
        p: 2, borderRadius: '16px', background: '#fff',
        boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <TextField
          placeholder="Search by title or location…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1, minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', background: '#F8FAFC', fontSize: '0.875rem',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select size="small" value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', background: '#F8FAFC', fontSize: '0.875rem',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TuneRoundedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="price-asc">Price ↑</MenuItem>
          <MenuItem value="price-desc">Price ↓</MenuItem>
        </TextField>
      </Box>

      {/* ── Type Filter Chips ── */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {TYPES.map((t) => (
          <Chip
            key={t}
            label={t}
            onClick={() => setType(t)}
            sx={{
              fontWeight: 700, fontSize: '0.78rem', borderRadius: '10px', height: 32,
              cursor: 'pointer',
              background: typeFilter === t ? '#4361EE' : '#F1F5F9',
              color:      typeFilter === t ? '#fff'    : '#64748B',
              border: 'none', transition: 'all 0.15s',
              '&:hover': { background: typeFilter === t ? '#2D44C4' : '#E2E8F0' },
            }}
          />
        ))}
      </Stack>

      {/* ── Results count ── */}
      {!loading && !error && (
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>
          Showing{' '}
          <strong style={{ color: '#1E293B' }}>{filtered.length}</strong> of{' '}
          {properties.length} properties
        </Typography>
      )}

      {/* ── Grid — xl removed (MUI v5 Grid doesn't support xl) ── */}
      {loading ? (
        <Loader count={6} />
      ) : filtered.length === 0 && !error ? (
        <EmptyState
          title="No properties found"
          description="Try adjusting your search or filter to see more results."
          icon={<ApartmentRoundedIcon sx={{ fontSize: 32, color: '#4361EE' }} />}
          iconBg="#EEF2FF"
        />
      ) : (
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} alignItems="stretch">
          {filtered.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={item.id} sx={{ display: 'flex' }}>
              <PropertyCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}