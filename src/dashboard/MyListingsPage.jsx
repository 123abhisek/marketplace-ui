

// src/dashboard/MyListingsPage.jsx
import { useNavigate }           from 'react-router-dom'
import {
  Box, Button, Card, CardContent, Chip,
  Grid, Stack, Tab, Tabs, Typography,
} from '@mui/material'
import { useState }              from 'react'
import ApartmentRoundedIcon      from '@mui/icons-material/ApartmentRounded'
import DirectionsCarRoundedIcon  from '@mui/icons-material/DirectionsCarRounded'
import AddHomeRoundedIcon        from '@mui/icons-material/AddHomeRounded'
import NoteAddRoundedIcon        from '@mui/icons-material/NoteAddRounded'
import PropertyCard              from '../components/PropertyCard'
import VehicleCard               from '../components/VehicleCard'
import EmptyState                from '../components/EmptyState'
import PremiumLockCard           from '../components/PremiumLockCard'
import { useAppState }           from '../hooks/useAppState'

export default function MyListingsPage() {
  const { user, properties, vehicles } = useAppState()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const mineProperties = properties.filter((p) => p.ownerId === user.id)
  const mineVehicles   = vehicles.filter((v) => v.ownerId === user.id)
  const totalCount     = mineProperties.length + mineVehicles.length

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            My Listings
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
            {totalCount} total listing{totalCount !== 1 ? 's' : ''} posted by you
          </Typography>
        </Box>
        {user.isPremium && (
          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => navigate('/dashboard/add-property')}
              startIcon={<AddHomeRoundedIcon />}
              variant="outlined"
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                borderColor: '#4361EE',
                color: '#4361EE',
                '&:hover': { background: '#EEF2FF' },
              }}
            >
              Add Property
            </Button>
            <Button
              onClick={() => navigate('/dashboard/add-vehicle')}
              startIcon={<NoteAddRoundedIcon />}
              variant="contained"
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                boxShadow: '0 4px 16px rgba(67,97,238,0.28)',
              }}
            >
              Add Vehicle
            </Button>
          </Stack>
        )}
      </Stack>

      {/* ── Summary Stat Cards ── */}
      <Grid container spacing={2}>
        {[
          { label: 'Property Listings', value: mineProperties.length, icon: <ApartmentRoundedIcon sx={{ fontSize: 20 }} />, color: '#4361EE', bg: '#EEF2FF' },
          { label: 'Vehicle Listings',  value: mineVehicles.length,   icon: <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />, color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Total Listings',    value: totalCount,             icon: <span style={{ fontSize: 16 }}>📋</span>, color: '#10B981', bg: '#ECFDF5' },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card sx={{ borderRadius: '18px', boxShadow: '0 2px 16px rgba(15,23,42,0.07)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: s.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.color,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography fontWeight={900} sx={{ fontSize: '1.6rem', color: '#1E293B', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.25 }}>
                      {s.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Premium lock ── */}
      {!user.isPremium && <PremiumLockCard />}

      {totalCount === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Premium users can post property and vehicle listings. Upgrade to start listing."
          actionLabel={user.isPremium ? 'Add Property' : 'Upgrade to Premium'}
          onAction={() => navigate(user.isPremium ? '/dashboard/add-property' : '/subscription')}
          icon={<ApartmentRoundedIcon sx={{ fontSize: 32, color: '#4361EE' }} />}
          iconBg="#EEF2FF"
        />
      ) : (
        <>
          {/* ── Tabs ── */}
          <Box
            sx={{
              background: '#fff',
              borderRadius: '16px',
              p: 0.5,
              boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
              display: 'inline-flex',
              alignSelf: 'flex-start',
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                minHeight: 40,
                '& .MuiTab-root': {
                  minHeight: 36,
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  color: '#94A3B8',
                  px: 2.5,
                  letterSpacing: '-0.01em',
                  transition: 'all 0.2s',
                },
                '& .Mui-selected': {
                  color: '#fff !important',
                  background: '#4361EE',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(67,97,238,0.3)',
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <ApartmentRoundedIcon sx={{ fontSize: 15 }} />
                    <span>Properties</span>
                    <Chip
                      label={mineProperties.length}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        background: tab === 0 ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                        color: tab === 0 ? '#fff' : '#64748B',
                        border: 'none',
                        ml: 0.25,
                      }}
                    />
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <DirectionsCarRoundedIcon sx={{ fontSize: 15 }} />
                    <span>Vehicles</span>
                    <Chip
                      label={mineVehicles.length}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        background: tab === 1 ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                        color: tab === 1 ? '#fff' : '#64748B',
                        border: 'none',
                        ml: 0.25,
                      }}
                    />
                  </Stack>
                }
              />
            </Tabs>
          </Box>

          {/* ── Tab Panels ── */}
          {tab === 0 && (
            mineProperties.length === 0 ? (
              <EmptyState
                title="No property listings"
                description="You haven't posted any properties yet."
                actionLabel="Add Property"
                onAction={() => navigate('/dashboard/add-property')}
                icon={<ApartmentRoundedIcon sx={{ fontSize: 28, color: '#4361EE' }} />}
                iconBg="#EEF2FF"
              />
            ) : (
              <Grid container spacing={2.5}>
                {mineProperties.map((item) => (
                  <Grid item xs={12} sm={6} xl={4} key={item.id}>
                    <PropertyCard item={item} />
                  </Grid>
                ))}
              </Grid>
            )
          )}

          {tab === 1 && (
            mineVehicles.length === 0 ? (
              <EmptyState
                title="No vehicle listings"
                description="You haven't posted any vehicles yet."
                actionLabel="Add Vehicle"
                onAction={() => navigate('/dashboard/add-vehicle')}
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 28, color: '#7C3AED' }} />}
                iconBg="#F5F3FF"
              />
            ) : (
              <Grid container spacing={2.5}>
                {mineVehicles.map((item) => (
                  <Grid item xs={12} sm={6} xl={4} key={item.id}>
                    <VehicleCard item={item} />
                  </Grid>
                ))}
              </Grid>
            )
          )}
        </>
      )}
    </Stack>
  )
}