
// src/dashboard/DashboardHome.jsx
import { Link as RouterLink }     from 'react-router-dom'
import {
  Box, Button, Card, CardContent, Chip,
  Divider, Grid, Stack, Typography, Avatar,
} from '@mui/material'
import ApartmentRoundedIcon        from '@mui/icons-material/ApartmentRounded'
import DirectionsCarRoundedIcon    from '@mui/icons-material/DirectionsCarRounded'
import ListAltRoundedIcon          from '@mui/icons-material/ListAltRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import AddHomeRoundedIcon          from '@mui/icons-material/AddHomeRounded'
import NoteAddRoundedIcon          from '@mui/icons-material/NoteAddRounded'
import ArrowForwardRoundedIcon     from '@mui/icons-material/ArrowForwardRounded'
import TrendingUpRoundedIcon       from '@mui/icons-material/TrendingUpRounded'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import CheckCircleRoundedIcon      from '@mui/icons-material/CheckCircleRounded'
import { useAppState }             from '../hooks/useAppState'
import { formatCurrency }          from '../utils/formatters'

// ── Weekly bar chart (Ref 4 — Knowledge dashboard) ────────────────────────────
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ACTIVITY    = [3, 7, 4, 9, 6, 5, 8]
const todayIdx    = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 })()

function ActivityChart() {
  const max = Math.max(...ACTIVITY)
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 }, height: 100, mt: 2.5 }}>
      {ACTIVITY.map((v, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: `${Math.max((v / max) * 80, 10)}px`,
              background: i === todayIdx
                ? 'linear-gradient(180deg, #4361EE 0%, #7C3AED 100%)'
                : 'rgba(67, 97, 238, 0.12)',
              borderRadius: '8px 8px 4px 4px',
              transition: 'height 0.4s ease, background 0.2s',
              cursor: 'pointer',
              '&:hover': {
                background: 'linear-gradient(180deg, #4361EE 0%, #7C3AED 100%)',
                opacity: 0.85,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: i === todayIdx ? 700 : 400,
              color: i === todayIdx ? '#4361EE' : '#CBD5E1',
              letterSpacing: '-0.01em',
            }}
          >
            {WEEK_LABELS[i]}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

// ── Stat card (Ref 1 — smmplanner top metrics) ────────────────────────────────
function StatCard({ label, value, icon, iconColor, iconBg, trend, trendPositive = true }) {
  return (
    <Card
      sx={{
        borderRadius: '20px',
        boxShadow: '0 2px 20px rgba(15,23,42,0.07)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 36px rgba(15,23,42,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          {/* Icon box */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          {/* Trend badge */}
          {trend && (
            <Chip
              icon={<TrendingUpRoundedIcon sx={{ fontSize: '13px !important', color: `${trendPositive ? '#10B981' : '#EF4444'} !important` }} />}
              label={trend}
              size="small"
              sx={{
                height: 24,
                background: trendPositive ? '#ECFDF5' : '#FEF2F2',
                color: trendPositive ? '#10B981' : '#EF4444',
                fontWeight: 700,
                fontSize: '0.7rem',
                border: 'none',
              }}
            />
          )}
        </Stack>

        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            color: '#1E293B',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            mb: 0.75,
            fontSize: { xs: '1.75rem', sm: '2rem' },
          }}
        >
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  )
}

// ── Compact listing row (Ref 1 — table rows with avatars) ─────────────────────
function ListingRow({ item, type, locked, last }) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 1.5,
          px: 1.5,
          borderRadius: '14px',
          transition: 'background 0.15s',
          cursor: 'pointer',
          '&:hover': { background: '#F8FAFC' },
        }}
      >
        {/* Type icon */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: type === 'property' ? '#EEF2FF' : '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {type === 'property'
            ? <ApartmentRoundedIcon sx={{ fontSize: 20, color: '#4361EE' }} />
            : <DirectionsCarRoundedIcon sx={{ fontSize: 20, color: '#7C3AED' }} />
          }
        </Box>

        {/* Title + location */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#1E293B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.25 }}>
            {item.location}
          </Typography>
        </Box>

        {/* Price + type chip */}
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#4361EE',
              filter: locked ? 'blur(5px)' : 'none',
              userSelect: locked ? 'none' : 'auto',
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(item.expectedPrice)}
          </Typography>
          <Chip
            label={type === 'property' ? (item.propertyType || 'Property') : (item.brand || 'Vehicle')}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.62rem',
              fontWeight: 700,
              mt: 0.25,
              background: type === 'property' ? '#EEF2FF' : '#F5F3FF',
              color: type === 'property' ? '#4361EE' : '#7C3AED',
              border: 'none',
            }}
          />
        </Box>
      </Box>
      {!last && <Divider sx={{ mx: 1.5, opacity: 0.6 }} />}
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user, properties, vehicles } = useAppState()

  const myProperties = properties.filter((p) => p.ownerId === user.id)
  const myVehicles   = vehicles.filter((v) => v.ownerId === user.id)

  const recentListings = [
    ...properties.slice(0, 3).map((p) => ({ ...p, _type: 'property' })),
    ...vehicles.slice(0, 2).map((v) => ({ ...v, _type: 'vehicle' })),
  ].slice(0, 5)

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const premiumFeatures = [
    'View price and contact details',
    'Post property & vehicle listings',
    'Unlimited listing browsing',
  ]

  return (
    <Stack spacing={3}>

      {/* ── Page Header ── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} gap={1}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ color: '#1E293B', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name?.split(' ')[0]} 👋
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem', mt: 0.5 }}>
            {todayStr}
          </Typography>
        </Box>
        {!user.isPremium && (
          <Button
            component={RouterLink}
            to="/subscription"
            variant="contained"
            size="small"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.8rem',
              boxShadow: '0 4px 16px rgba(67,97,238,0.3)',
              whiteSpace: 'nowrap',
              alignSelf: { xs: 'flex-start', sm: 'auto' },
            }}
          >
            Upgrade to Premium
          </Button>
        )}
      </Stack>

      {/* ── Stat Cards (Ref 1 — smmplanner top row) ── */}
      <Grid container spacing={2}>
        <Grid item xs={6} lg={3}>
          <StatCard
            label="Total Properties"
            value={properties.length}
            icon={<ApartmentRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#4361EE"
            iconBg="#EEF2FF"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            label="Total Vehicles"
            value={vehicles.length}
            icon={<DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#7C3AED"
            iconBg="#F5F3FF"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            label="My Listings"
            value={myProperties.length + myVehicles.length}
            icon={<ListAltRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#10B981"
            iconBg="#ECFDF5"
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard
            label={user.isPremium ? 'Premium Plan' : 'Free Plan'}
            value={user.isPremium ? 'PRO' : 'FREE'}
            icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor={user.isPremium ? '#F59E0B' : '#94A3B8'}
            iconBg={user.isPremium ? '#FFFBEB' : '#F8FAFC'}
          />
        </Grid>
      </Grid>

      {/* ── Middle Row: Activity Chart + Subscription Card ── */}
      <Grid container spacing={2.5}>

        {/* Activity Chart (Ref 4 — Knowledge bar chart) */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography fontWeight={800} sx={{ color: '#1E293B', letterSpacing: '-0.02em' }}>
                    Weekly Activity
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', mt: 0.25 }}>
                    Listing interactions this week
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #4361EE, #7C3AED)' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>Views</Typography>
                </Stack>
              </Stack>
              <ActivityChart />

              {/* Summary row */}
              <Stack
                direction="row"
                spacing={3}
                sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(226,232,240,0.7)' }}
              >
                {[
                  { label: 'Total Views', value: ACTIVITY.reduce((a, b) => a + b, 0) },
                  { label: 'Peak Day', value: WEEK_LABELS[ACTIVITY.indexOf(Math.max(...ACTIVITY))] },
                  { label: 'Today', value: ACTIVITY[todayIdx] },
                ].map((s) => (
                  <Box key={s.label}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.02em' }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8' }}>{s.label}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Card (Ref 3 — gradient premium card) */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: '20px',
              height: '100%',
              background: user.isPremium
                ? 'linear-gradient(145deg, #4361EE 0%, #7C3AED 60%, #9333EA 100%)'
                : '#ffffff',
              boxShadow: user.isPremium
                ? '0 12px 40px rgba(67,97,238,0.35)'
                : '0 2px 20px rgba(15,23,42,0.07)',
              color: user.isPremium ? '#fff' : 'inherit',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background decoration */}
            {user.isPremium && (
              <>
                <Box sx={{
                  position: 'absolute', top: -30, right: -30,
                  width: 120, height: 120, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                }} />
                <Box sx={{
                  position: 'absolute', bottom: -20, left: -20,
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                }} />
              </>
            )}

            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '14px',
                  background: user.isPremium ? 'rgba(255,255,255,0.18)' : '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <WorkspacePremiumRoundedIcon
                  sx={{
                    fontSize: 26,
                    color: user.isPremium ? '#fff' : '#F59E0B',
                  }}
                />
              </Box>

              <Typography
                fontWeight={900}
                sx={{
                  fontSize: '1.15rem',
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                  color: user.isPremium ? '#fff' : '#1E293B',
                }}
              >
                {user.isPremium ? '✓ Premium Active' : 'Upgrade to Premium'}
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.82rem',
                  opacity: user.isPremium ? 0.75 : undefined,
                  color: user.isPremium ? '#fff' : '#64748B',
                  mb: 2.5,
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                {user.isPremium
                  ? 'You have full access to all marketplace features.'
                  : 'Get full listing details, contact numbers, and posting access.'}
              </Typography>

              {/* Features list */}
              <Stack spacing={1} sx={{ mb: 2.5 }}>
                {premiumFeatures.map((f) => (
                  <Stack key={f} direction="row" spacing={1} alignItems="center">
                    {user.isPremium
                      ? <CheckCircleRoundedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
                      : <LockRoundedIcon sx={{ fontSize: 14, color: '#CBD5E1' }} />
                    }
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        color: user.isPremium ? 'rgba(255,255,255,0.85)' : '#64748B',
                        fontWeight: user.isPremium ? 500 : 400,
                      }}
                    >
                      {f}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {!user.isPremium ? (
                <Button
                  component={RouterLink}
                  to="/subscription"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                    borderRadius: '12px',
                    fontWeight: 800,
                    py: 1.25,
                    boxShadow: '0 4px 20px rgba(67,97,238,0.35)',
                    '&:hover': { boxShadow: '0 6px 28px rgba(67,97,238,0.45)' },
                  }}
                >
                  Upgrade — ₹299
                </Button>
              ) : (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
                    All features unlocked ✨
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Recent Listings (Ref 1 — clean table rows) ── */}
      <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography fontWeight={800} sx={{ color: '#1E293B', letterSpacing: '-0.02em' }}>
                Recent Listings
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8', mt: 0.25 }}>
                Latest property and vehicle listings
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/dashboard/properties"
              size="small"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{ fontWeight: 700, color: '#4361EE', fontSize: '0.8rem', minWidth: 'auto' }}
            >
              View all
            </Button>
          </Stack>

          {recentListings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <ListAltRoundedIcon sx={{ fontSize: 28, color: '#CBD5E1' }} />
              </Box>
              <Typography fontWeight={700} sx={{ color: '#1E293B' }}>No listings yet</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.5 }}>
                Premium users can add property and vehicle listings.
              </Typography>
            </Box>
          ) : (
            <Stack>
              {recentListings.map((item, i) => (
                <ListingRow
                  key={item.id}
                  item={item}
                  type={item._type}
                  locked={!user.isPremium}
                  last={i === recentListings.length - 1}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* ── Quick Actions (Ref 4 — Knowledge quick add cards) ── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card
            component={RouterLink}
            to="/dashboard/add-property"
            sx={{
              borderRadius: '20px',
              boxShadow: '0 2px 20px rgba(15,23,42,0.07)',
              background: '#EEF2FF',
              border: 'none',
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 36px rgba(67,97,238,0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={1}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '13px',
                      background: '#4361EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(67,97,238,0.35)',
                    }}
                  >
                    <AddHomeRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography fontWeight={800} sx={{ color: '#1E293B', letterSpacing: '-0.01em' }}>
                    Add Property
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {user.isPremium ? 'Post a new property listing' : 'Requires premium access'}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '11px',
                    background: '#4361EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(67,97,238,0.3)',
                  }}
                >
                  <ArrowForwardRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            component={RouterLink}
            to="/dashboard/add-vehicle"
            sx={{
              borderRadius: '20px',
              boxShadow: '0 2px 20px rgba(15,23,42,0.07)',
              background: '#F5F3FF',
              border: 'none',
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 36px rgba(124,58,237,0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={1}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '13px',
                      background: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                    }}
                  >
                    <NoteAddRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Typography fontWeight={800} sx={{ color: '#1E293B', letterSpacing: '-0.01em' }}>
                    Add Vehicle
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {user.isPremium ? 'Post a new vehicle listing' : 'Requires premium access'}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '11px',
                    background: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                  }}
                >
                  <ArrowForwardRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Stack>
  )
}