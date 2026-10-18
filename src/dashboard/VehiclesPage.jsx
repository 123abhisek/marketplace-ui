
import {
  Box, Button, Chip, Grid, InputAdornment,
  MenuItem, Skeleton, Stack, TextField, Typography,
} from '@mui/material'
import SearchRoundedIcon        from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon          from '@mui/icons-material/TuneRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import NoteAddRoundedIcon       from '@mui/icons-material/NoteAddRounded'
import RefreshRoundedIcon       from '@mui/icons-material/RefreshRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { Link as RouterLink }   from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import VehicleCard              from '../components/VehicleCard'
import EmptyState               from '../components/EmptyState'
import { useAppState }          from '../hooks/useAppState'
import { vehicleService }       from '../services/api'
import { isUserPremium }        from '../utils/permissions'
import { normalizeVehicle }     from '../utils/mappers'

const BRANDS = ['All', 'Maruti', 'Hyundai', 'Honda', 'Toyota', 'Royal Enfield', 'Bajaj', 'Hero']

function VehicleCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: '20px',
        boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        height: '100%',
        minHeight: 440,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        animation="wave"
        sx={{ bgcolor: 'rgba(226,232,240,0.6)' }}
      />
      <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1, justifyContent: 'space-between' }}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Skeleton variant="text" height={26} width="70%" animation="wave" />
            <Skeleton variant="rounded" height={24} width={50} sx={{ borderRadius: '999px' }} animation="wave" />
          </Stack>
          <Skeleton variant="text" height={18} width="45%" animation="wave" sx={{ mt: 0.5 }} />

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Skeleton variant="rounded" height={22} width={65} sx={{ borderRadius: '8px' }} animation="wave" />
            <Skeleton variant="rounded" height={22} width={75} sx={{ borderRadius: '8px' }} animation="wave" />
            <Skeleton variant="rounded" height={22} width={60} sx={{ borderRadius: '8px' }} animation="wave" />
          </Stack>
        </Box>

        <Box sx={{ pt: 1 }}>
          <Skeleton variant="text" height={1} animation="wave" sx={{ mb: 1.5, bgcolor: '#E2E8F0' }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Skeleton variant="text" height={14} width={40} animation="wave" />
              <Skeleton variant="text" height={28} width={90} animation="wave" />
            </Box>
            <Skeleton
              variant="rounded"
              height={40}
              width={110}
              animation="wave"
              sx={{ borderRadius: '12px' }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default function VehiclesPage() {
  const { user } = useAppState()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('All')
  const [sortBy, setSortBy] = useState('latest')
  const [refreshing, setRefreshing] = useState(false)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await vehicleService.getAll()
      const list = Array.isArray(data) ? data : data?.data || data?.items || []
      setVehicles(list.map(normalizeVehicle))
    } catch (err) {
      console.error("Failed to load vehicles:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleRefresh = async () => {
    setRefreshing(true)
    try { await fetchVehicles() } finally { setRefreshing(false) }
  }


  const filtered = vehicles
    .filter((v) => {
      const q      = search.toLowerCase()
      const matchQ = !q
        || v.title?.toLowerCase().includes(q)
        || v.location?.toLowerCase().includes(q)
        || v.city?.toLowerCase().includes(q)
        || v.brand?.toLowerCase().includes(q)
        || v.model?.toLowerCase().includes(q)
        || v.category?.toLowerCase().includes(q)
      const vBrand = String(v.brand || '').toLowerCase()
      const matchB = brand === 'All' || vBrand.includes(brand.toLowerCase())
      return matchQ && matchB
    })
    .sort((a, b) => {
      const priceA = Number(a.price ?? a.expectedPrice ?? 0)
      const priceB = Number(b.price ?? b.expectedPrice ?? 0)
      const kmA = Number(a.kmDriven ?? a.km_driven ?? 0)
      const kmB = Number(b.kmDriven ?? b.km_driven ?? 0)
      if (sortBy === 'price-asc')  return priceA - priceB
      if (sortBy === 'price-desc') return priceB - priceA
      if (sortBy === 'km-asc')     return kmA - kmB
      return (b.id ?? 0) - (a.id ?? 0)
    })

  const hasFullAccess = isUserPremium(user)

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
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Vehicle Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {loading ? <Skeleton variant="text" width={110} height={18} animation="wave" /> : `${vehicles.length} vehicles available`}
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
            onClick={handleRefresh}
            disabled={refreshing || loading}
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
                Seller phone numbers, inspection details & HD photos are locked. Upgrade to unlock full access.
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
      <Box
        sx={{
          p: 2, borderRadius: '16px', background: '#fff',
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
          display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Search brand, model, or location..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1, minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC', fontSize: '0.875rem' },
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
          select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC', fontSize: '0.875rem' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TuneRoundedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="latest">Latest First</MenuItem>
          <MenuItem value="price-asc">Price: Low → High</MenuItem>
          <MenuItem value="price-desc">Price: High → Low</MenuItem>
          <MenuItem value="km-asc">Low KM First</MenuItem>
        </TextField>
      </Box>

      {/* ── Brand Filter Chips ── */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {BRANDS.map((b) => (
          <Chip
            key={b}
            label={b}
            onClick={() => setBrand(b)}
            sx={{
              fontWeight: 700, fontSize: '0.78rem',
              borderRadius: '10px', height: 32, cursor: 'pointer',
              background: brand === b ? '#7C3AED' : '#F1F5F9',
              color: brand === b ? '#fff' : '#64748B',
              border: 'none', transition: 'all 0.15s',
              '&:hover': { background: brand === b ? '#5B21B6' : '#E2E8F0' },
            }}
          />
        ))}
      </Stack>

      {!loading && (
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>
          Showing <strong style={{ color: '#1E293B' }}>{filtered.length}</strong> of {vehicles.length} vehicles
        </Typography>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} alignItems="stretch">
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={`vehicle-skel-${i}`} sx={{ display: 'flex' }}>
              <VehicleCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description="Try adjusting your search or filter criteria."
          icon={<DirectionsCarRoundedIcon sx={{ fontSize: 32, color: '#7C3AED' }} />}
          iconBg="#F5F3FF"
        />
      ) : (
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} alignItems="stretch">
          {filtered.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={item.id} sx={{ display: 'flex' }}>
              <VehicleCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}

    </Stack>
  )
}