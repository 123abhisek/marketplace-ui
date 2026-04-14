
// // src/dashboard/PropertiesPage.jsx
// import { useEffect, useState } from 'react'
// import {
//   Box, Button, Chip, Grid, InputAdornment,
//   MenuItem, Stack, TextField, Typography,
// } from '@mui/material'
// import SearchRoundedIcon     from '@mui/icons-material/SearchRounded'
// import TuneRoundedIcon       from '@mui/icons-material/TuneRounded'
// import ApartmentRoundedIcon  from '@mui/icons-material/ApartmentRounded'
// import AddHomeRoundedIcon    from '@mui/icons-material/AddHomeRounded'
// import { Link as RouterLink } from 'react-router-dom'
// import PropertyCard          from '../components/PropertyCard'
// import Loader                from '../components/Loader'
// import EmptyState            from '../components/EmptyState'
// import { useAppState }       from '../hooks/useAppState'

// const TYPES = ['All', 'Residential', 'Commercial', 'Agricultural', 'Site', 'Flat']

// export default function PropertiesPage() {
//   const { properties } = useAppState()
//   const [loading, setLoading]     = useState(true)
//   const [search, setSearch]       = useState('')
//   const [typeFilter, setType]     = useState('All')
//   const [sortBy, setSortBy]       = useState('latest')

//   useEffect(() => {
//     const t = setTimeout(() => setLoading(false), 900)
//     return () => clearTimeout(t)
//   }, [])

//   const filtered = properties
//     .filter((p) => {
//       const q = search.toLowerCase()
//       const matchQ = !q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)
//       const matchT = typeFilter === 'All' || p.propertyType === typeFilter
//       return matchQ && matchT
//     })
//     .sort((a, b) => {
//       if (sortBy === 'price-asc') return Number(a.expectedPrice) - Number(b.expectedPrice)
//       if (sortBy === 'price-desc') return Number(b.expectedPrice) - Number(a.expectedPrice)
//       return b.id - a.id
//     })

//   return (
//     <Stack spacing={3}>
//       {/* ── Header ── */}
//       <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
//         <Box>
//           <Typography
//             variant="h5"
//             fontWeight={900}
//             sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}
//           >
//             Property Listings
//           </Typography>
//           <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
//             {properties.length} listings available
//           </Typography>
//         </Box>
//         <Button
//           component={RouterLink}
//           to="/dashboard/add-property"
//           variant="contained"
//           startIcon={<AddHomeRoundedIcon />}
//           sx={{
//             borderRadius: '12px',
//             fontWeight: 800,
//             background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
//             boxShadow: '0 4px 16px rgba(67,97,238,0.30)',
//             alignSelf: { xs: 'flex-start', sm: 'auto' },
//           }}
//         >
//           Add Property
//         </Button>
//       </Stack>

//       {/* ── Filters Bar ── */}
//       <Box
//         sx={{
//           p: 2,
//           borderRadius: '16px',
//           background: '#fff',
//           boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
//           display: 'flex',
//           gap: 2,
//           flexWrap: 'wrap',
//           alignItems: 'center',
//         }}
//       >
//         {/* Search */}
//         <TextField
//           placeholder="Search by title or location..."
//           size="small"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{
//             flex: 1,
//             minWidth: 200,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '12px',
//               background: '#F8FAFC',
//               fontSize: '0.875rem',
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchRoundedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Sort */}
//         <TextField
//           select
//           size="small"
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           sx={{
//             minWidth: 140,
//             '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC', fontSize: '0.875rem' },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <TuneRoundedIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
//               </InputAdornment>
//             ),
//           }}
//         >
//           <MenuItem value="latest">Latest</MenuItem>
//           <MenuItem value="price-asc">Price ↑</MenuItem>
//           <MenuItem value="price-desc">Price ↓</MenuItem>
//         </TextField>
//       </Box>

//       {/* ── Type Filter Chips ── */}
//       <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//         {TYPES.map((t) => (
//           <Chip
//             key={t}
//             label={t}
//             onClick={() => setType(t)}
//             sx={{
//               fontWeight: 700,
//               fontSize: '0.78rem',
//               borderRadius: '10px',
//               height: 32,
//               cursor: 'pointer',
//               background: typeFilter === t ? '#4361EE' : '#F1F5F9',
//               color: typeFilter === t ? '#fff' : '#64748B',
//               border: 'none',
//               transition: 'all 0.15s',
//               '&:hover': {
//                 background: typeFilter === t ? '#2D44C4' : '#E2E8F0',
//               },
//             }}
//           />
//         ))}
//       </Stack>

//       {/* ── Results Count ── */}
//       {!loading && (
//         <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>
//           Showing <strong style={{ color: '#1E293B' }}>{filtered.length}</strong> of {properties.length} properties
//         </Typography>
//       )}

//       {/* ── Grid ── */}
//       {loading ? (
//         <Loader count={6} />
//       ) : filtered.length === 0 ? (
//         <EmptyState
//           title="No properties found"
//           description="Try adjusting your search or filter to see more results."
//           icon={<ApartmentRoundedIcon sx={{ fontSize: 32, color: '#4361EE' }} />}
//           iconBg="#EEF2FF"
//         />
//       ) : (
//         <Grid container spacing={2.5}>
//           {filtered.map((item) => (
//             <Grid item xs={12} sm={6} xl={4} key={item.id}>
//               <PropertyCard item={item} />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Stack>
//   )
// }








// src/dashboard/PropertiesPage.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert, Box, Button, Chip, Grid, InputAdornment,
  MenuItem, Stack, TextField, Typography,
} from '@mui/material'
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon      from '@mui/icons-material/TuneRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AddHomeRoundedIcon   from '@mui/icons-material/AddHomeRounded'
import RefreshRoundedIcon   from '@mui/icons-material/RefreshRounded'
import { Link as RouterLink } from 'react-router-dom'
import PropertyCard         from '../components/PropertyCard'
import Loader               from '../components/Loader'
import EmptyState           from '../components/EmptyState'
import { propertyService }  from '../services/api'
import { mapProperty, extractError } from '../utils/mappers'

const TYPES = ['All', 'Residential', 'Commercial', 'Agricultural', 'Site', 'Flat']

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [typeFilter, setType]       = useState('All')
  const [sortBy,     setSortBy]     = useState('latest')
  const abortRef                    = useRef(null)

  const fetchProperties = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError('')
    try {
      const raw = await propertyService.getAll({ limit: 100 })
      setProperties(raw.map(mapProperty))
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
      const matchT = typeFilter === 'All' || p.propertyType === typeFilter
      return matchQ && matchT
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return Number(a.expectedPrice) - Number(b.expectedPrice)
      if (sortBy === 'price-desc') return Number(b.expectedPrice) - Number(a.expectedPrice)
      return b.id - a.id // latest first
    })

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900}
            sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Property Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {loading ? 'Loading…' : `${properties.length} listings available`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={fetchProperties}
            disabled={loading}
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
            to="/dashboard/add-property"
            variant="contained"
            startIcon={<AddHomeRoundedIcon />}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
              boxShadow: '0 4px 16px rgba(67,97,238,0.30)',
            }}
          >
            Add Property
          </Button>
        </Stack>
      </Stack>

      {/* ── API Error ── */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}
          action={
            <Button color="inherit" size="small" onClick={fetchProperties}>
              Retry
            </Button>
          }>
          {error}
        </Alert>
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
          <Chip key={t} label={t} onClick={() => setType(t)} sx={{
            fontWeight: 700, fontSize: '0.78rem', borderRadius: '10px', height: 32,
            cursor: 'pointer',
            background: typeFilter === t ? '#4361EE' : '#F1F5F9',
            color:      typeFilter === t ? '#fff'    : '#64748B',
            border: 'none', transition: 'all 0.15s',
            '&:hover': { background: typeFilter === t ? '#2D44C4' : '#E2E8F0' },
          }} />
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

      {/* ── Grid ── */}
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
        <Grid container spacing={2.5}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} xl={4} key={item.id}>
              <PropertyCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}