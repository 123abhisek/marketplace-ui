
import {
  Box, Button, Chip, Grid, InputAdornment,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material'
import SearchRoundedIcon        from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon          from '@mui/icons-material/TuneRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import NoteAddRoundedIcon       from '@mui/icons-material/NoteAddRounded'
import RefreshRoundedIcon       from '@mui/icons-material/RefreshRounded'
import { Link as RouterLink }   from 'react-router-dom'
import { useState }             from 'react'
import VehicleCard              from '../components/VehicleCard'
import Loader                   from '../components/Loader'
import EmptyState               from '../components/EmptyState'
import { useAppState }          from '../hooks/useAppState'

const BRANDS = ['All', 'Maruti', 'Hyundai', 'Honda', 'Toyota', 'Royal Enfield', 'Bajaj', 'Hero']

export default function VehiclesPage() {
  const { vehicles = [], vehiclesLoading, refreshVehicles } = useAppState()
  const [search,  setSearch]  = useState('')
  const [brand,   setBrand]   = useState('All')
  const [sortBy,  setSortBy]  = useState('latest')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try { await refreshVehicles() } finally { setRefreshing(false) }
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
            {vehiclesLoading ? 'Loading…' : `${vehicles.length} vehicles available`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            onClick={handleRefresh}
            disabled={refreshing || vehiclesLoading}
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
          <Button
            component={RouterLink}
            to="/dashboard/add-vehicle"
            variant="contained"
            startIcon={<NoteAddRoundedIcon />}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7C3AED 0%, #4361EE 100%)',
              boxShadow: '0 4px 16px rgba(124,58,237,0.30)',
              alignSelf: { xs: 'flex-start', sm: 'auto' },
            }}
          >
            Add Vehicle
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

      {!vehiclesLoading && (
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>
          Showing <strong style={{ color: '#1E293B' }}>{filtered.length}</strong> of {vehicles.length} vehicles
        </Typography>
      )}

      {/* ── Grid ── */}
      {vehiclesLoading ? (
        <Loader count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description="Try adjusting your search or filter criteria."
          icon={<DirectionsCarRoundedIcon sx={{ fontSize: 32, color: '#7C3AED' }} />}
          iconBg="#F5F3FF"
        />
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} xl={4} key={item.id}>
              <VehicleCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}