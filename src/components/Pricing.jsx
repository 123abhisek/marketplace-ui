// src/components/Pricing.jsx
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import { useAppState } from '../hooks/useAppState'

const plans = [
  {
    key: 'free',
    icon: <LockRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'Free',
    subtitle: 'For casual browsers',
    price: '₹0',
    period: 'forever',
    cta: 'Get started free',
    highlighted: false,
    features: [
      { text: 'Browse marketplace categories', ok: true },
      { text: 'View listing preview images', ok: true },
      { text: 'See listing titles & locations', ok: true },
      { text: 'View full price details', ok: false },
      { text: 'View seller contact number', ok: false },
      { text: 'Post property listings', ok: false },
      { text: 'Post vehicle listings', ok: false },
    ],
  },
  {
    key: 'premium',
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 28 }} />,
    title: 'Premium',
    subtitle: 'For serious buyers & sellers',
    price: '₹299',
    period: 'one-time unlock',
    cta: 'Get Premium now',
    highlighted: true,
    features: [
      { text: 'Everything in Free', ok: true },
      { text: 'View full price of every listing', ok: true },
      { text: 'Unlock seller contact number', ok: true },
      { text: 'Post unlimited property listings', ok: true },
      { text: 'Post unlimited vehicle listings', ok: true },
      { text: 'Premium badge on your listings', ok: true },
      { text: 'Priority listing visibility', ok: true },
    ],
  },
]

function FeatureRow({ text, ok, highlighted }) {
  return (
    <Stack direction="row" spacing={1.4} alignItems="center" sx={{ py: 0.9 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: ok
            ? highlighted
              ? 'rgba(255,255,255,0.20)'
              : 'rgba(15,118,110,0.10)'
            : 'rgba(148,163,184,0.12)',
        }}
      >
        {ok ? (
          <CheckRoundedIcon
            sx={{
              fontSize: 14,
              color: highlighted ? '#fff' : '#0f766e',
            }}
          />
        ) : (
          <CloseRoundedIcon sx={{ fontSize: 13, color: '#cbd5e1' }} />
        )}
      </Box>

      <Typography
        sx={{
          fontSize: '0.88rem',
          fontWeight: ok ? 600 : 400,
          color: highlighted
            ? ok
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.40)'
            : ok
            ? '#1e293b'
            : '#94a3b8',
        }}
      >
        {text}
      </Typography>
    </Stack>
  )
}

function PlanCard({ plan, isLoggedIn, isPremium }) {
  const isHighlighted = plan.highlighted

  const getCTA = () => {
    if (plan.key === 'free') {
      if (isLoggedIn) return { label: 'Continue browsing', to: '/properties' }
      return { label: 'Get started free', to: '/register' }
    }

    if (isPremium) {
      return { label: 'Premium Active', to: '/dashboard/subscription' }
    }

    if (isLoggedIn) {
      return { label: 'Get Premium now', to: '/subscription' }
    }

    return { label: 'Sign in to upgrade', to: '/register' }
  }

  const cta = getCTA()

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        height: '100%',
        ...(isHighlighted
          ? {
              background: 'linear-gradient(145deg, #0f766e 0%, #0d9488 55%, #0369a1 100%)',
              boxShadow:
                '0 30px 80px rgba(15,118,110,0.30), 0 8px 24px rgba(15,118,110,0.18)',
              transform: { md: 'scale(1.025)' },
            }
          : {
              background: '#fff',
              border: '1.5px solid rgba(226,232,240,0.9)',
              boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
            }),
      }}
    >
      {isHighlighted && (
        <Box
          sx={{
            position: 'absolute',
            top: 22,
            right: -28,
            transform: 'rotate(45deg)',
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(6px)',
            px: 5,
            py: 0.55,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '0.12em',
            }}
          >
            POPULAR
          </Typography>
        </Box>
      )}

      {isHighlighted && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }}
        />
      )}

      <Box sx={{ p: { xs: 3.5, md: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2.5 }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isHighlighted ? 'rgba(255,255,255,0.18)' : 'rgba(15,118,110,0.08)',
              color: isHighlighted ? '#fff' : '#0f766e',
              backdropFilter: isHighlighted ? 'blur(8px)' : 'none',
            }}
          >
            {plan.icon}
          </Box>

          <Chip
            label={
              isHighlighted
                ? isPremium
                  ? 'Active'
                  : 'Recommended'
                : 'Basic'
            }
            size="small"
            sx={{
              height: 26,
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.68rem',
              letterSpacing: '0.04em',
              ...(isHighlighted
                ? {
                    background: 'rgba(255,255,255,0.20)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.30)',
                  }
                : {
                    background: 'rgba(15,118,110,0.07)',
                    color: '#0f766e',
                    border: '1px solid rgba(15,118,110,0.16)',
                  }),
            }}
          />
        </Stack>

        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.35rem',
            color: isHighlighted ? '#fff' : '#0f172a',
            lineHeight: 1.2,
          }}
        >
          {plan.title}
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: '0.82rem',
            fontWeight: 500,
            color: isHighlighted ? 'rgba(255,255,255,0.65)' : '#64748b',
          }}
        >
          {plan.subtitle}
        </Typography>

        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mt: 2.5, mb: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '3rem',
              lineHeight: 1,
              color: isHighlighted ? '#fff' : '#0f172a',
              letterSpacing: '-0.03em',
            }}
          >
            {plan.price}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: isHighlighted ? 'rgba(255,255,255,0.60)' : '#94a3b8',
              mb: 0.6,
              pb: 0.3,
            }}
          >
            {plan.period}
          </Typography>
        </Stack>

        <Divider
          sx={{
            my: 2.5,
            borderColor: isHighlighted ? 'rgba(255,255,255,0.18)' : 'rgba(226,232,240,0.8)',
          }}
        />

        <Stack spacing={0}>
          {plan.features.map((f) => (
            <FeatureRow key={f.text} text={f.text} ok={f.ok} highlighted={isHighlighted} />
          ))}
        </Stack>

        <Button
          component={RouterLink}
          to={cta.to}
          fullWidth
          size="large"
          startIcon={
            plan.key === 'premium' ? (
              isPremium ? (
                <VerifiedRoundedIcon />
              ) : (
                <RocketLaunchRoundedIcon />
              )
            ) : undefined
          }
          sx={{
            mt: 3.5,
            py: 1.4,
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.95rem',
            textTransform: 'none',
            ...(isHighlighted
              ? {
                  background: '#fff',
                  color: isPremium ? '#0f766e' : '#0f766e',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.92)',
                    boxShadow: '0 14px 36px rgba(0,0,0,0.18)',
                  },
                }
              : {
                  border: '1.5px solid rgba(15,118,110,0.24)',
                  color: '#0f766e',
                  background: 'transparent',
                  '&:hover': {
                    background: 'rgba(15,118,110,0.04)',
                    borderColor: '#0f766e',
                  },
                }),
          }}
        >
          {cta.label}
        </Button>
      </Box>
    </Box>
  )
}

export default function Pricing() {
  const { user } = useAppState()

  const isLoggedIn = Boolean(user?.loggedIn || user?.is_logged_in)
  const isPremium = Boolean(user?.is_premium || user?.isPremium)

  return (
    <Box
      id="pricing"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '70vw',
          maxWidth: 800,
          maxHeight: 800,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(15,118,110,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack alignItems="center" spacing={1.5} sx={{ mb: { xs: 5, md: 7 } }}>
          <Chip
            label="Pricing"
            size="small"
            sx={{
              height: 29,
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.73rem',
              background: 'rgba(15,118,110,0.08)',
              color: '#0f766e',
              border: '1px solid rgba(15,118,110,0.16)',
            }}
          />

          <Typography
            align="center"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.8rem', md: '2.6rem' },
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#0f172a',
            }}
          >
            Simple, transparent pricing
          </Typography>

          <Typography
            align="center"
            sx={{
              color: '#64748b',
              fontSize: '0.96rem',
              maxWidth: 440,
              lineHeight: 1.7,
            }}
          >
            One-time ₹299 unlock for full marketplace access — no monthly fees,
            no hidden charges.
          </Typography>
        </Stack>

        <Grid
          container
          spacing={{ xs: 3, md: 2 }}
          alignItems="stretch"
          justifyContent="center"
        >
          {plans.map((plan) => (
            <Grid item xs={12} sm={10} md={6} key={plan.key}>
              <PlanCard
                plan={plan}
                isLoggedIn={isLoggedIn}
                isPremium={isPremium}
              />
            </Grid>
          ))}
        </Grid>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          spacing={{ xs: 1.5, sm: 4 }}
          sx={{ mt: { xs: 5, md: 7 } }}
        >
          {[
            '✅ No monthly subscription',
            '✅ Instant access after payment',
            '✅ UPI, cards & net banking supported',
          ].map((text) => (
            <Typography
              key={text}
              align="center"
              sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}
            >
              {text}
            </Typography>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}