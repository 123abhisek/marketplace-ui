
// src/dashboard/MyListingsPage.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Box, Button, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, Stack, Typography,
} from '@mui/material'
import ApartmentRoundedIcon      from '@mui/icons-material/ApartmentRounded'
import AddHomeRoundedIcon        from '@mui/icons-material/AddHomeRounded'
import DeleteOutlineRoundedIcon  from '@mui/icons-material/DeleteOutlineRounded'
import RefreshRoundedIcon        from '@mui/icons-material/RefreshRounded'
import PropertyCard              from '../components/PropertyCard'
import Loader                    from '../components/Loader'
import EmptyState                from '../components/EmptyState'
import { propertyService }       from '../services/api'
import { mapProperty, extractError } from '../utils/mappers'
import { useAppState }           from '../hooks/useAppState'

export default function MyListingsPage() {
  const { user, notify }              = useAppState()
  const navigate                      = useNavigate()
  const [listings,   setListings]     = useState([])
  const [loading,    setLoading]      = useState(true)
  const [error,      setError]        = useState('')
  const [deleteId,   setDeleteId]     = useState(null)   // property id pending delete
  const [deleting,   setDeleting]     = useState(false)
  const abortRef                      = useRef(null)

  const fetchMyListings = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError('')
    try {
      const raw = await propertyService.myListings()
      console.log('Fetched my listings:', raw)
      setListings(raw.map(mapProperty))
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMyListings()
    return () => abortRef.current?.abort()
  }, [fetchMyListings])

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await propertyService.deleteOne(deleteId)
      setListings((prev) => prev.filter((p) => p.id !== deleteId))
      notify('Listing deleted')
    } catch (err) {
      notify(extractError(err), 'error')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900}
            sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            My Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {loading ? 'Loading…' : `${listings.length} listings posted by you`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={fetchMyListings}
            disabled={loading}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              borderRadius: '12px', fontWeight: 700, color: '#64748B',
              '&:hover': { background: '#F1F5F9' },
            }}
          >
            Refresh
          </Button>
          <Button
            onClick={() => navigate('/dashboard/add-property')}
            variant="contained"
            startIcon={<AddHomeRoundedIcon />}
            sx={{
              borderRadius: '12px', fontWeight: 800,
              background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
              boxShadow: '0 4px 16px rgba(67,97,238,0.28)',
            }}
          >
            Add Listing
          </Button>
        </Stack>
      </Stack>

      {/* ── Premium chip ── */}
      <Chip
        label={user.isPremium ? 'Premium — posting enabled' : 'Free — upgrade to post listings'}
        sx={{
          width: 'fit-content', fontWeight: 700, fontSize: '0.78rem',
          background: user.isPremium ? '#ECFDF5' : '#FEF3C7',
          color:      user.isPremium ? '#059669' : '#D97706',
          border: 'none',
        }}
      />

      {/* ── API Error ── */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}
          action={
            <Button color="inherit" size="small" onClick={fetchMyListings}>
              Retry
            </Button>
          }>
          {error}
        </Alert>
      )}

      {/* ── Content ── */}
      {loading ? (
        <Loader count={3} />
      ) : listings.length === 0 && !error ? (
        <EmptyState
          title="No listings yet"
          description={
            user.isPremium
              ? 'Post your first property or vehicle listing to see it here.'
              : 'Upgrade to Premium to post and manage your own listings.'
          }
          icon={<ApartmentRoundedIcon sx={{ fontSize: 32, color: '#4361EE' }} />}
          iconBg="#EEF2FF"
          actionLabel={user.isPremium ? 'Add Property' : 'Upgrade to Premium'}
          onAction={() =>
            navigate(user.isPremium ? '/dashboard/add-property' : '/subscription')
          }
        />
      ) : (
        <>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1E293B' }}>
            My Properties
          </Typography>
          <Grid container spacing={2.5}>
            {listings.map((item) => (
              <Grid item xs={12} sm={6} xl={4} key={item.id}>
                {/* Wrap card in a relative box so delete button can sit on top */}
                <Box sx={{ position: 'relative' }}>
                  <PropertyCard item={item} />
                  <Button
                    size="small"
                    onClick={() => setDeleteId(item.id)}
                    startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: '15px !important' }} />}
                    sx={{
                      position: 'absolute',
                      bottom: 14,
                      right: 14,
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      background: '#FEF2F2',
                      color: '#EF4444',
                      border: '1px solid #FCA5A5',
                      zIndex: 2,
                      '&:hover': { background: '#FEE2E2' },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* ── Confirm delete dialog ── */}
      <Dialog
        open={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete listing?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748B', fontSize: '0.88rem' }}>
            This will permanently remove the listing. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setDeleteId(null)}
            disabled={deleting}
            sx={{ borderRadius: '12px', fontWeight: 700, color: '#64748B' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              borderRadius: '12px', fontWeight: 800,
              background: '#EF4444',
              '&:hover': { background: '#DC2626' },
              boxShadow: 'none',
            }}
          >
            {deleting ? 'Deleting…' : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  )
}