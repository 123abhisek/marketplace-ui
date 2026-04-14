
// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, IconButton, InputAdornment, Stack, TextField, Typography,
} from '@mui/material'
import HomeWorkRoundedIcon         from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon    from '@mui/icons-material/DirectionsCarRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import PersonRoundedIcon           from '@mui/icons-material/PersonRounded'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon       from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon    from '@mui/icons-material/VisibilityOffRounded'
import ArrowForwardRoundedIcon     from '@mui/icons-material/ArrowForwardRounded'
import { useAppState }             from '../hooks/useAppState'


// ─── Left brand / social-proof panel ──────────────────────────────────────────


function BrandPanel() {
  const feats = [
    { icon: <HomeWorkRoundedIcon sx={{ fontSize: 17 }} />,         text: 'Properties & land listings' },
    { icon: <DirectionsCarRoundedIcon sx={{ fontSize: 17 }} />,    text: 'Second-hand vehicle market' },
    { icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 17 }} />, text: 'Premium unlock for ₹299' },
    { icon: <LockRoundedIcon sx={{ fontSize: 17 }} />,             text: 'Price & contact for premium users' },
  ]
  const stats = [
    { value: '2,400+', label: 'Properties listed' },
    { value: '1,800+', label: 'Vehicles listed' },
    { value: '₹299',   label: 'Premium one-time' },
  ]

  return (
    <Box sx={{
      flex: '0 0 44%',
      position: 'relative',
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      justifyContent: 'space-between',
      p: '48px 44px',
      background: 'linear-gradient(150deg,#0f766e 0%,#0e4d6a 55%,#1e1b4b 100%)',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      {[
        { top: -80,  right: -80, size: 260, opacity: 0.12 },
        { bottom: -60, left: -60, size: 220, opacity: 0.10 },
        { top: '38%', right: -40, size: 140, opacity: 0.08 },
      ].map((b, i) => (
        <Box key={i} aria-hidden sx={{
          position: 'absolute',
          width: b.size, height: b.size,
          top: b.top ?? 'auto', bottom: b.bottom ?? 'auto',
          left: b.left ?? 'auto', right: b.right ?? 'auto',
          borderRadius: '50%',
          background: `rgba(255,255,255,${b.opacity})`,
          filter: 'blur(1px)',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Logo */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '14px',
          background: 'rgba(255,255,255,0.16)',
          border: '1px solid rgba(255,255,255,0.24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HomeWorkRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' }}>
          MarketPlus
        </Typography>
      </Stack>

      {/* Headline */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontWeight: 900, fontSize: '2.1rem', color: '#fff',
          lineHeight: 1.1, letterSpacing: '-0.04em', mb: 1.6,
        }}>
          India's premium<br />property & vehicle<br />marketplace
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 320 }}>
          Browse thousands of verified listings. Premium members unlock prices,
          contact details, and posting access.
        </Typography>
      </Box>

      {/* Feature bullets */}
      <Stack spacing={1.3} sx={{ position: 'relative', zIndex: 1 }}>
        {feats.map((f, i) => (
          <Stack key={i} direction="row" spacing={1.3} alignItems="center">
            <Box sx={{
              width: 32, height: 32, borderRadius: '10px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: 'rgba(255,255,255,0.88)',
            }}>
              {f.icon}
            </Box>
            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.80)', fontWeight: 600 }}>
              {f.text}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Stats row */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1,
        pt: 2, borderTop: '1px solid rgba(255,255,255,0.12)',
      }}>
        {stats.map((s) => (
          <Box key={s.label}>
            <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>{s.value}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}


// ─── Main page ────────────────────────────────────────────────────────────────


export default function LoginPage() {
  const [showPw, setShowPw]   = useState(false)
  const [apiErr, setApiErr]   = useState('')
  const { login, loading }    = useAppState()
  const navigate              = useNavigate()

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setApiErr('')
    const result = await login({ email: data.email, password: data.password })
    if (result.success) {
      navigate('/dashboard')
    } else {
      setApiErr(result.error || 'Login failed.')
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      '& fieldset': { borderColor: 'rgba(226,232,240,0.9)' },
      '&:hover fieldset': { borderColor: '#0f766e' },
      '&.Mui-focused fieldset': { borderColor: '#0f766e', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#0f766e' },
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: '#f1f5f9' }}>
      <BrandPanel />

      <Box sx={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        p: { xs: '32px 20px', sm: '48px 32px', md: '48px 56px' },
        overflowY: 'auto',
      }}>
        {/* Mobile logo */}
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 4, display: { md: 'none' } }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '12px', background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HomeWorkRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
            MarketPlus
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Chip
              label="Welcome back"
              size="small"
              sx={{
                mb: 1.5, height: 27, borderRadius: '999px',
                fontWeight: 800, fontSize: '0.71rem',
                background: 'rgba(15,118,110,0.09)', color: '#0f766e',
                border: '1px solid rgba(15,118,110,0.16)',
              }}
            />
            <Typography sx={{
              fontWeight: 900,
              fontSize: { xs: '1.65rem', sm: '2rem' },
              color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.035em', mb: 0.9,
            }}>
              Sign in to<br />MarketPlus
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.89rem', lineHeight: 1.65 }}>
              New here?{' '}
              <Box component={RouterLink} to="/register" sx={{
                color: '#0f766e', fontWeight: 700, textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}>
                Create an account
              </Box>
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'rgba(226,232,240,0.8)' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', px: 1 }}>
              Enter your credentials
            </Typography>
          </Divider>

          {/* API error banner */}
          {apiErr && (
            <Box sx={{
              mb: 2.5, px: 2, py: 1.5, borderRadius: '12px',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.20)',
            }}>
              <Typography sx={{ fontSize: '0.83rem', color: '#dc2626', fontWeight: 700 }}>
                {apiErr}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.2}>
              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email address"
                    type="email"
                    disabled={loading}
                    error={!!errors.email}
                    helperText={errors.email?.message || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    disabled={loading}
                    error={!!errors.password}
                    helperText={errors.password?.message || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small" edge="end"
                            onClick={() => setShowPw((p) => !p)}
                            disabled={loading}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#475569' } }}
                          >
                            {showPw
                              ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                              : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={17} color="inherit" /> : <ArrowForwardRoundedIcon />}
                sx={{
                  mt: 0.5, borderRadius: '14px', py: 1.55,
                  fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg,#0f766e,#0e8e7f)',
                  color: '#fff',
                  boxShadow: '0 10px 28px rgba(15,118,110,0.26)',
                  transition: 'all .18s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg,#0a5c55,#0c7a6e)',
                    boxShadow: '0 14px 36px rgba(15,118,110,0.32)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&.Mui-disabled': { background: 'rgba(15,118,110,0.40)', color: '#fff' },
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </form>

          {/* Footer link */}
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5} sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Don't have an account?
            </Typography>
            <Box component={RouterLink} to="/register" sx={{
              fontSize: '0.82rem', color: '#0f766e', fontWeight: 700,
              textDecoration: 'none', '&:hover': { textDecoration: 'underline' },
            }}>
              Register free
            </Box>
          </Stack>

          {/* Premium nudge card */}
          <Card variant="outlined" sx={{
            mt: 3, borderRadius: '16px',
            border: '1px solid rgba(124,108,255,0.18)',
            background: 'linear-gradient(135deg,rgba(124,108,255,0.05),rgba(94,135,255,0.03))',
          }}>
            <CardContent sx={{ p: '14px 18px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{
                  width: 34, height: 34, borderRadius: '11px',
                  background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>
                    Unlock premium for ₹299
                  </Typography>
                  <Typography sx={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.4 }}>
                    View prices, contacts & post your own listings.
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/subscription"
                  size="small"
                  sx={{
                    flexShrink: 0, borderRadius: '10px', fontWeight: 800, fontSize: '0.72rem',
                    px: 1.4, py: 0.65,
                    background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                    color: '#fff', minWidth: 0,
                    '&:hover': { background: 'linear-gradient(135deg,#6b59f5,#4c75ff)' },
                  }}
                >
                  Upgrade
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}