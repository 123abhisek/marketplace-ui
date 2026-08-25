
import {
  Box, Button, Chip, Grid, InputAdornment,
  MenuItem, Skeleton, Stack, TextField, Typography,
} from '@mui/material'
import SearchRoundedIcon        from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon          from '@mui/icons-material/TuneRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import NoteAddRoundedIcon       from '@mui/icons-material/NoteAddRounded'
import RefreshRoundedIcon       from '@mui/icons-material/RefreshRounded'
import { Link as RouterLink }   from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import VehicleCard              from '../components/VehicleCard'
import EmptyState               from '../components/EmptyState'
import { useAppState }          from '../hooks/useAppState'
import { vehicleService }       from '../services/api'

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
      setVehicles(list)
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
        || v.brand?.toLowerCase().includes(q)
      const matchB = brand === 'All' || v.brand === brand
      return matchQ && matchB
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return Number(a.expectedPrice) - Number(b.expectedPrice)
      if (sortBy === 'price-desc') return Number(b.expectedPrice) - Number(a.expectedPrice)
      if (sortBy === 'km-asc')     return Number(a.kmDriven) - Number(b.kmDriven)
      return b.id - a.id
    })

  const hasFullAccess = Boolean(
    user?.isPremium ||
    user?.is_premium ||
    user?.role === 'premium' ||
    user?.role === 'admin' ||
    user?.role === 'seller' ||
    user?.is_admin ||
    user?.isAdmin
  )

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Vehicle Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {loading ? 'Loading…' : `${vehicles.length} vehicles available`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            label={hasFullAccess ? "👑 Premium Access Active" : "Free Plan — View Limited"}
            sx={{
              fontWeight: 800,
              fontSize: "0.78rem",
              background: hasFullAccess ? "#ECFDF5" : "#FEF3C7",
              color: hasFullAccess ? "#059669" : "#D97706",
              border: hasFullAccess ? "1px solid #A7F3D0" : "1px solid #FDE68A",
              borderRadius: "10px",
            }}
          />
          <Button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              color: '#64748B',
              '&:hover': { background: '#F1F5F9' },
            }}
          >
            Refresh
          </Button>
        </Stack>

      </Stack>

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