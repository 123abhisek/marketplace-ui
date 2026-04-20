// src/pages/FreeDashboard.jsx
import {
  Avatar, Box, Button, Card, CardContent, Chip,
  Divider, Grid, Stack, Typography, LinearProgress,
} from '@mui/material'
import HomeWorkRoundedIcon       from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon  from '@mui/icons-material/DirectionsCarRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LockRoundedIcon           from '@mui/icons-material/LockRounded'
import StarRoundedIcon           from '@mui/icons-material/StarRounded'
import LogoutRoundedIcon         from '@mui/icons-material/LogoutRounded'
import CheckRoundedIcon          from '@mui/icons-material/CheckRounded'
import ArrowForwardRoundedIcon   from '@mui/icons-material/ArrowForwardRounded'
import { useAppState }           from '../hooks/useAppState'
import { useNavigate }           from 'react-router-dom'

// ─── Styles ───────────────────────────────────────────────────────────────────
const cardSx = {
  borderRadius: '18px',
  border: '1px solid rgba(226,232,240,0.9)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  background: '#fff',
}

const upgradeBtnSx = {
  borderRadius: '12px',
  py: 1.4,
  fontWeight: 800,
  fontSize: '0.9rem',
  background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
  color: '#fff',
  boxShadow: '0 8px 24px rgba(124,58,237,0.28)',
  '&:hover': {
    background: 'linear-gradient(135deg,#6d28d9,#9333ea)',
    boxShadow: '0 12px 32px rgba(124,58,237,0.36)',
    transform: 'translateY(-1px)',
  },
  transition: 'all .18s ease',
}

const PREMIUM_PERKS = [
  'Post unlimited property listings',
  'Post unlimited vehicle listings',
  'Priority placement in search results',
  'Direct contact with buyers & sellers',
  'Verified seller badge on your profile',
]

// ─── Locked feature card ──────────────────────────────────────────────────────
function LockedCard({ icon, title, desc }) {
  return (
    <Card sx={{ ...cardSx, position: 'relative', overflow: 'hidden' }}>
      {/* Frosted lock overlay */}
      <Box
        sx={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'rgba(255,255,255,0.70)',
          backdropFilter: 'blur(3px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0.8,
        }}
      >
        <Box
          sx={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(124,58,237,0.10)',
            border: '1.5px solid rgba(124,58,237,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <LockRoundedIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
        </Box>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
          Premium only
        </Typography>
      </Box>

      {/* Blurred background content */}
      <CardContent sx={{ p: 2.5, filter: 'blur(1.5px)', userSelect: 'none' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'rgba(226,232,240,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8',
            }}
          >
            {icon}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
            {title}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
          {desc}
        </Typography>
      </CardContent>
    </Card>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FreeDashboard() {
  const { user, logout, upgradePremium, properties, vehicles } = useAppState()
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── Top nav ── */}
      <Box
        sx={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226,232,240,0.8)',
          px: { xs: 2, sm: 4 }, py: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 34, height: 34, borderRadius: '10px',
                background: '#0f766e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <HomeWorkRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Easydeal
            </Typography>
            <Chip
              label="Free"
              size="small"
              sx={{
                height: 22, borderRadius: '999px',
                fontWeight: 800, fontSize: '0.65rem',
                background: 'rgba(100,116,139,0.10)',
                color: '#64748b',
                border: '1px solid rgba(100,116,139,0.20)',
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              size="small"
              onClick={upgradePremium}
              startIcon={<StarRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: '10px', px: 1.8, py: 0.7,
                fontWeight: 800, fontSize: '0.78rem',
                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                color: '#fff',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { background: 'linear-gradient(135deg,#6d28d9,#9333ea)' },
              }}
            >
              Upgrade
            </Button>
            <Avatar
              src={user.photo || undefined}
              sx={{ width: 34, height: 34, fontSize: '0.85rem', background: '#0f766e', cursor: 'pointer' }}
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Button
              size="small"
              onClick={logout}
              sx={{ color: '#94a3b8', minWidth: 0, p: 0.5 }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 4 }, py: 4 }}>

        {/* ── Welcome banner ── */}
        <Card
          sx={{
            ...cardSx,
            mb: 3,
            background: 'linear-gradient(135deg,#0f172a 0%,#0e4d6a 60%,#0f766e 100%)',
            border: 'none',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Decorative blobs */}
          {[
            { top: -40, right: -40, size: 180 },
            { bottom: -30, left: 60, size: 120 },
          ].map((b, i) => (
            <Box key={i} aria-hidden sx={{
              position: 'absolute',
              width: b.size, height: b.size,
              top: b.top ?? 'auto', bottom: b.bottom ?? 'auto',
              left: b.left ?? 'auto', right: b.right ?? 'auto',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
          ))}
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', mb: 0.5 }}>
                  Welcome back
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.4rem', sm: '1.7rem' }, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 1 }}>
                  {user.name || 'Explorer'} 👋
                </Typography>
                <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.65, maxWidth: 380 }}>
                  You're on the <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free plan</strong>. Browse all listings — upgrade to post your own.
                </Typography>
              </Box>
              <Button
                onClick={upgradePremium}
                startIcon={<WorkspacePremiumRoundedIcon />}
                sx={{
                  ...upgradeBtnSx,
                  flexShrink: 0,
                  px: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                Upgrade to Premium
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* ── Stats row ── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Properties available', value: properties.length, icon: <HomeWorkRoundedIcon sx={{ fontSize: 20 }} />, color: '#0f766e', bg: 'rgba(15,118,110,0.09)' },
            { label: 'Vehicles available',   value: vehicles.length,   icon: <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />, color: '#0e4d6a', bg: 'rgba(14,77,106,0.09)' },
            { label: 'Your listings',        value: '0 / 0',           icon: <LockRoundedIcon sx={{ fontSize: 20 }} />, color: '#7c3aed', bg: 'rgba(124,58,237,0.09)', locked: true },
          ].map((s) => (
            <Grid item xs={12} sm={4} key={s.label}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{
                      width: 42, height: 42, borderRadius: '12px',
                      background: s.bg, color: s.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {s.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#0f172a', lineHeight: 1 }}>
                        {s.value}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mt: 0.3 }}>
                        {s.label}
                      </Typography>
                      {s.locked && (
                        <Typography sx={{ fontSize: '0.68rem', color: '#7c3aed', fontWeight: 700, mt: 0.2 }}>
                          Premium required to post
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Browse listings ── */}
        <Card sx={{ ...cardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                Browse Listings
              </Typography>
              <Chip
                label="Free access"
                size="small"
                sx={{
                  height: 24, borderRadius: '999px',
                  fontWeight: 700, fontSize: '0.68rem',
                  background: 'rgba(15,118,110,0.09)', color: '#0f766e',
                  border: '1px solid rgba(15,118,110,0.18)',
                }}
              />
            </Stack>
            <Grid container spacing={2}>
              {[
                {
                  icon: <HomeWorkRoundedIcon sx={{ fontSize: 22 }} />,
                  label: 'Properties',
                  count: properties.length,
                  sub: 'Flats, houses, plots & more',
                  color: '#0f766e',
                  bg: 'rgba(15,118,110,0.08)',
                  path: '/properties',
                },
                {
                  icon: <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />,
                  label: 'Vehicles',
                  count: vehicles.length,
                  sub: 'Cars, bikes, trucks & more',
                  color: '#0e4d6a',
                  bg: 'rgba(14,77,106,0.08)',
                  path: '/vehicles',
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} key={item.label}>
                  <Box
                    onClick={() => navigate(item.path)}
                    sx={{
                      p: 2.5, borderRadius: '14px',
                      border: '1.5px solid rgba(226,232,240,0.9)',
                      cursor: 'pointer', transition: 'all .18s ease',
                      '&:hover': {
                        borderColor: item.color,
                        background: item.bg,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{
                          width: 44, height: 44, borderRadius: '12px',
                          background: item.bg, color: item.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {item.count} listings · {item.sub}
                          </Typography>
                        </Box>
                      </Stack>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* ── Locked features row ── */}
        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#64748b', mb: 1.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Premium features — locked
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <LockedCard
              icon={<HomeWorkRoundedIcon sx={{ fontSize: 18 }} />}
              title="Post Property Listing"
              desc="List your property for sale or rent and reach thousands of buyers."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LockedCard
              icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
              title="Post Vehicle Listing"
              desc="Sell your car, bike, or truck by posting directly to the marketplace."
            />
          </Grid>
        </Grid>

        {/* ── Upgrade CTA card ── */}
        <Card
          sx={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg,#faf5ff 0%,#f3e8ff 100%)',
            border: '1.5px solid rgba(124,58,237,0.20)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <WorkspacePremiumRoundedIcon sx={{ color: '#7c3aed', fontSize: 22 }} />
                  <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#3b0764', letterSpacing: '-0.02em' }}>
                    Unlock Premium for ₹299
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: '0.84rem', color: '#6b21a8', lineHeight: 1.7, mb: 2 }}>
                  Everything you need to buy, sell, and connect on India's fastest-growing marketplace.
                </Typography>
                <Stack spacing={0.9}>
                  {PREMIUM_PERKS.map((perk) => (
                    <Stack key={perk} direction="row" spacing={1} alignItems="center">
                      <Box sx={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'rgba(124,58,237,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <CheckRoundedIcon sx={{ fontSize: 11, color: '#7c3aed' }} />
                      </Box>
                      <Typography sx={{ fontSize: '0.82rem', color: '#4c1d95', fontWeight: 600 }}>
                        {perk}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(124,58,237,0.15)' }} />

              <Box sx={{ textAlign: { xs: 'left', md: 'center' }, flexShrink: 0 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', mb: 0.3 }}>
                  ONE-TIME PAYMENT
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '2.8rem', color: '#3b0764', lineHeight: 1, letterSpacing: '-0.04em' }}>
                  ₹299
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b21a8', mb: 2 }}>
                  Lifetime premium access
                </Typography>

                {/* Progress bar teaser */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed' }}>
                      Limited slots
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed' }}>
                      73% filled
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={73}
                    sx={{
                      height: 6, borderRadius: 999,
                      backgroundColor: 'rgba(124,58,237,0.15)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 999,
                        background: 'linear-gradient(90deg,#7c3aed,#a855f7)',
                      },
                    }}
                  />
                </Box>

                <Button fullWidth onClick={upgradePremium} sx={upgradeBtnSx}>
                  Upgrade Now →
                </Button>
                <Typography sx={{ fontSize: '0.68rem', color: '#9333ea', mt: 1, fontWeight: 600 }}>
                  Instant activation · No hidden fees
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

      </Box>
    </Box>
  )
}