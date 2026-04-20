
// src/dashboard/SubscriptionStatusPage.jsx
import { useState }               from 'react'
import { Link as RouterLink }     from 'react-router-dom'
import {
  Box, Button, Card, CardContent,
  Chip, Divider, Grid, LinearProgress,
  Stack, Typography,
} from '@mui/material'
import WorkspacePremiumRoundedIcon  from '@mui/icons-material/WorkspacePremiumRounded'
import CheckCircleRoundedIcon       from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon            from '@mui/icons-material/CancelRounded'
import ArrowForwardRoundedIcon      from '@mui/icons-material/ArrowForwardRounded'
import LockOpenRoundedIcon          from '@mui/icons-material/LockOpenRounded'
import ApartmentRoundedIcon         from '@mui/icons-material/ApartmentRounded'
import DirectionsCarRoundedIcon     from '@mui/icons-material/DirectionsCarRounded'
import PhoneRoundedIcon             from '@mui/icons-material/PhoneRounded'
import AddCircleOutlineRoundedIcon  from '@mui/icons-material/AddCircleOutlineRounded'
import LocalOfferRoundedIcon        from '@mui/icons-material/LocalOfferRounded'
import VerifiedRoundedIcon          from '@mui/icons-material/VerifiedRounded'
import { useAppState }              from '../hooks/useAppState'

/* ─── Feature list data ─────────────────────────────── */
const FREE_FEATURES = [
  { icon: <ApartmentRoundedIcon sx={{ fontSize: 17 }} />, label: 'Browse property listings',         allowed: true },
  { icon: <DirectionsCarRoundedIcon sx={{ fontSize: 17 }} />, label: 'Browse vehicle listings',      allowed: true },
  { icon: <LocalOfferRoundedIcon sx={{ fontSize: 17 }} />, label: 'View listing images',             allowed: true },
  { icon: <PhoneRoundedIcon sx={{ fontSize: 17 }} />, label: 'View price & contact details',        allowed: false },
  { icon: <AddCircleOutlineRoundedIcon sx={{ fontSize: 17 }} />, label: 'Post property listings',   allowed: false },
  { icon: <AddCircleOutlineRoundedIcon sx={{ fontSize: 17 }} />, label: 'Post vehicle listings',    allowed: false },
  { icon: <VerifiedRoundedIcon sx={{ fontSize: 17 }} />, label: 'Premium badge on profile',         allowed: false },
]

const PREMIUM_FEATURES = [
  { icon: <ApartmentRoundedIcon sx={{ fontSize: 17 }} />, label: 'Browse all property listings',    allowed: true },
  { icon: <DirectionsCarRoundedIcon sx={{ fontSize: 17 }} />, label: 'Browse all vehicle listings', allowed: true },
  { icon: <LocalOfferRoundedIcon sx={{ fontSize: 17 }} />, label: 'View listing images',            allowed: true },
  { icon: <PhoneRoundedIcon sx={{ fontSize: 17 }} />, label: 'Full price & contact details',        allowed: true },
  { icon: <AddCircleOutlineRoundedIcon sx={{ fontSize: 17 }} />, label: 'Post property listings',   allowed: true },
  { icon: <AddCircleOutlineRoundedIcon sx={{ fontSize: 17 }} />, label: 'Post vehicle listings',    allowed: true },
  { icon: <VerifiedRoundedIcon sx={{ fontSize: 17 }} />, label: 'Premium badge on profile',         allowed: true },
]

/* ─── Reusable feature row ──────────────────────────── */
function FeatureRow({ icon, label, allowed }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '9px',
          background: allowed ? '#ECFDF5' : '#FEF2F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: allowed ? '#10B981' : '#EF4444',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: '0.85rem',
          color: allowed ? '#374151' : '#9CA3AF',
          fontWeight: allowed ? 600 : 400,
          textDecoration: allowed ? 'none' : 'none',
          flex: 1,
        }}
      >
        {label}
      </Typography>
      {allowed ? (
        <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10B981', flexShrink: 0 }} />
      ) : (
        <CancelRoundedIcon sx={{ fontSize: 16, color: '#D1D5DB', flexShrink: 0 }} />
      )}
    </Stack>
  )
}

/* ─── Stat mini-card ────────────────────────────────── */
function StatCard({ value, label, color = '#4361EE', bg = '#EEF2FF' }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 80,
        p: 2,
        borderRadius: '16px',
        background: bg,
        textAlign: 'center',
      }}
    >
      <Typography
        fontWeight={900}
        sx={{ fontSize: '1.5rem', color, letterSpacing: '-0.03em', lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  )
}

/* ─── Main page ─────────────────────────────────────── */
export default function SubscriptionStatusPage() {
  const { user, upgradePremium, properties, vehicles } = useAppState()
  const [activating, setActivating] = useState(false)

  const myProperties = properties.filter((p) => p.ownerId === user.id).length
  const myVehicles   = vehicles.filter((v) => v.ownerId === user.id).length

  const handleDemoActivate = async () => {
    setActivating(true)
    await new Promise((r) => setTimeout(r, 1200))
    upgradePremium()
    setActivating(false)
  }

  return (
    <Stack spacing={3}>

      {/* ── Page header ── */}
      <Box>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}
        >
          Subscription
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
          Manage your plan and marketplace access
        </Typography>
      </Box>

      {/* ── Status hero card ── */}
      {user.isPremium ? (
        /* ─ Active Premium ─ */
        <Card
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
            boxShadow: '0 16px 48px rgba(67,97,238,0.35)',
            position: 'relative',
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                      }}
                    >
                      <WorkspacePremiumRoundedIcon sx={{ fontSize: 26, color: '#FFD700' }} />
                    </Box>
                    <Box>
                      <Typography
                        fontWeight={900}
                        sx={{ color: '#fff', fontSize: '1.35rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}
                      >
                        Premium Active
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600 }}>
                        Full marketplace access unlocked
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={<CheckCircleRoundedIcon sx={{ fontSize: '14px !important', color: '#10B981 !important' }} />}
                      label="Listings: Active"
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(6px)',
                      }}
                    />
                    <Chip
                      icon={<LockOpenRoundedIcon sx={{ fontSize: '14px !important', color: '#60A5FA !important' }} />}
                      label="Details: Visible"
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(6px)',
                      }}
                    />
                    <Chip
                      label="Plan: ₹299 One-time"
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(6px)',
                      }}
                    />
                  </Stack>

                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.83rem', lineHeight: 1.6 }}>
                    You have full access to post and view all property and vehicle listings,
                    including pricing and contact information.
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={1.5}>
                  <StatCard value={myProperties} label="My Properties" color="#fff" bg="rgba(255,255,255,0.14)" />
                  <StatCard value={myVehicles}   label="My Vehicles"   color="#fff" bg="rgba(255,255,255,0.14)" />
                  <StatCard value="∞"            label="Access"        color="#FFD700" bg="rgba(255,255,255,0.14)" />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        /* ─ Free / Inactive ─ */
        <Card
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            border: '1.5px dashed rgba(67,97,238,0.22)',
            boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        background: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <WorkspacePremiumRoundedIcon sx={{ fontSize: 26, color: '#4361EE' }} />
                    </Box>
                    <Box>
                      <Typography
                        fontWeight={900}
                        sx={{ color: '#1E293B', fontSize: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}
                      >
                        Free Plan
                      </Typography>
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.78rem', fontWeight: 600 }}>
                        Limited marketplace access
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label="Premium Not Activated"
                    size="small"
                    sx={{
                      width: 'fit-content',
                      background: '#FEF3C7',
                      color: '#D97706',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      border: '1px solid #FDE68A',
                    }}
                  />

                  <Typography sx={{ color: '#64748B', fontSize: '0.83rem', lineHeight: 1.6 }}>
                    Upgrade to Premium for a one-time payment of ₹299 and unlock full listing
                    visibility, contact details, and the ability to post your own listings.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      component={RouterLink}
                      to="/subscription"
                      variant="contained"
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        borderRadius: '12px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                        boxShadow: '0 4px 16px rgba(67,97,238,0.3)',
                        '&:hover': { boxShadow: '0 6px 24px rgba(67,97,238,0.4)' },
                      }}
                    >
                      Upgrade — ₹299
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleDemoActivate}
                      disabled={activating}
                      sx={{
                        borderRadius: '12px',
                        fontWeight: 700,
                        borderColor: 'rgba(67,97,238,0.3)',
                        color: '#4361EE',
                        '&:hover': { borderColor: '#4361EE', background: '#EEF2FF' },
                      }}
                    >
                      {activating ? 'Activating…' : 'Demo Activate'}
                    </Button>
                  </Stack>

                  {activating && (
                    <LinearProgress
                      sx={{
                        borderRadius: '8px',
                        height: 6,
                        background: '#EEF2FF',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4361EE, #7C3AED)',
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack direction="row" spacing={1.5}>
                  <StatCard value={properties.length} label="Properties"  color="#4361EE" bg="#EEF2FF" />
                  <StatCard value={vehicles.length}   label="Vehicles"    color="#7C3AED" bg="#F5F3FF" />
                  <StatCard value="Free"              label="Plan"        color="#F59E0B" bg="#FFFBEB" />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* ── Plan comparison ── */}
      <Grid container spacing={2.5}>

        {/* Free Plan card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              boxShadow: user.isPremium
                ? '0 2px 16px rgba(15,23,42,0.06)'
                : '0 2px 16px rgba(15,23,42,0.06)',
              border: !user.isPremium ? '2px solid #E2E8F0' : '1.5px solid #E2E8F0',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Plan header */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography fontWeight={900} sx={{ fontSize: '1rem', color: '#1E293B' }}>
                      Free Plan
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      Browse listings only
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography fontWeight={900} sx={{ fontSize: '1.6rem', color: '#1E293B', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      ₹0
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>Forever</Typography>
                  </Box>
                </Stack>

                {!user.isPremium && (
                  <Chip
                    label="Current Plan"
                    size="small"
                    sx={{
                      width: 'fit-content',
                      background: '#F1F5F9',
                      color: '#64748B',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}

                <Divider sx={{ opacity: 0.6 }} />

                <Stack spacing={1.5}>
                  {FREE_FEATURES.map((f, i) => (
                    <FeatureRow key={i} {...f} />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Premium Plan card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              height: '100%',
              border: user.isPremium
                ? '2px solid #7C3AED'
                : '2px solid rgba(67,97,238,0.30)',
              boxShadow: user.isPremium
                ? '0 8px 32px rgba(124,58,237,0.18)'
                : '0 4px 20px rgba(67,97,238,0.10)',
              position: 'relative',
            }}
          >
            {/* Top gradient accent bar */}
            <Box
              sx={{
                height: 5,
                background: 'linear-gradient(90deg, #4361EE 0%, #7C3AED 100%)',
              }}
            />

            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Plan header */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={900} sx={{ fontSize: '1rem', color: '#1E293B' }}>
                        Premium Plan
                      </Typography>
                      <WorkspacePremiumRoundedIcon sx={{ fontSize: 18, color: '#7C3AED' }} />
                    </Stack>
                    <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      Full marketplace access
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography fontWeight={900} sx={{ fontSize: '1.6rem', color: '#4361EE', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      ₹299
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8' }}>One-time</Typography>
                  </Box>
                </Stack>

                <Chip
                  label={user.isPremium ? '✓ Current Plan' : 'Most Popular'}
                  size="small"
                  sx={{
                    width: 'fit-content',
                    background: user.isPremium
                      ? 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)'
                      : '#EEF2FF',
                    color: user.isPremium ? '#fff' : '#4361EE',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                  }}
                />

                <Divider sx={{ opacity: 0.6 }} />

                <Stack spacing={1.5}>
                  {PREMIUM_FEATURES.map((f, i) => (
                    <FeatureRow key={i} {...f} />
                  ))}
                </Stack>

                {!user.isPremium && (
                  <Button
                    component={RouterLink}
                    to="/subscription"
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    fullWidth
                    sx={{
                      mt: 1,
                      borderRadius: '14px',
                      fontWeight: 800,
                      py: 1.3,
                      background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                      boxShadow: '0 6px 20px rgba(67,97,238,0.32)',
                      '&:hover': { boxShadow: '0 8px 28px rgba(67,97,238,0.42)' },
                    }}
                  >
                    Upgrade to Premium — ₹299
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── How payment works ── */}
      {!user.isPremium && (
        <Card
          sx={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FFF4 100%)',
            border: '1px solid #A7F3D0',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: '#D1FAE5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 18 }}>💳</span>
                </Box>
                <Typography fontWeight={800} sx={{ color: '#065F46', fontSize: '0.95rem' }}>
                  How to activate Premium
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                {[
                  { step: '01', title: 'Pay via UPI', desc: 'Send ₹299 to easydeal@upi. Add your registered mobile in the payment note.' },
                  { step: '02', title: 'Upload screenshot', desc: 'Go to the Payment page and upload your UPI payment screenshot.' },
                  { step: '03', title: 'Instant activation', desc: 'Once verified, your Premium access is activated immediately.' },
                ].map((s) => (
                  <Grid item xs={12} sm={4} key={s.step}>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '10px',
                          background: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography fontWeight={900} sx={{ color: '#fff', fontSize: '0.72rem' }}>
                          {s.step}
                        </Typography>
                      </Box>
                      <Typography fontWeight={800} sx={{ color: '#065F46', fontSize: '0.85rem' }}>
                        {s.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#6EE7B7', color: '#047857', lineHeight: 1.5 }}>
                        {s.desc}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      )}

    </Stack>
  )
}