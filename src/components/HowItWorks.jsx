

// src/components/HowItWorks.jsx
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
} from '@mui/material'
import PersonAddAlt1RoundedIcon    from '@mui/icons-material/PersonAddAlt1Rounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import PhoneInTalkRoundedIcon      from '@mui/icons-material/PhoneInTalkRounded'
import HandshakeRoundedIcon        from '@mui/icons-material/HandshakeRounded'
import ArrowForwardRoundedIcon     from '@mui/icons-material/ArrowForwardRounded'

// ─── Step data ─────────────────────────────────────────────────────────────────

const steps = [
  {
    title: 'Create Account',
    desc: 'Sign up in minutes, fill your buyer or seller profile, and upload your photo.',
    icon: <PersonAddAlt1RoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #6d5bff 0%, #4f8cff 100%)',
    glowColor: 'rgba(109,91,255,0.20)',
    chipColor: '#6d5bff',
    chipBg: 'rgba(109,91,255,0.09)',
    chipBorder: 'rgba(109,91,255,0.18)',
    number: '01',
  },
  {
    title: 'Choose a Plan',
    desc: 'Browse for free or unlock Premium access for ₹299 — one time, no recurring charges.',
    icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    glowColor: 'rgba(249,115,22,0.18)',
    chipColor: '#b45309',
    chipBg: 'rgba(245,158,11,0.09)',
    chipBorder: 'rgba(245,158,11,0.22)',
    number: '02',
  },
  {
    title: 'Contact Sellers',
    desc: 'Premium members instantly unlock phone numbers and full listing details.',
    icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glowColor: 'rgba(16,185,129,0.18)',
    chipColor: '#0f766e',
    chipBg: 'rgba(16,185,129,0.09)',
    chipBorder: 'rgba(16,185,129,0.22)',
    number: '03',
  },
  {
    title: 'Close the Deal',
    desc: 'Buy, rent, or sell property and vehicles directly through the marketplace.',
    icon: <HandshakeRoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    glowColor: 'rgba(168,85,247,0.18)',
    chipColor: '#7e22ce',
    chipBg: 'rgba(168,85,247,0.09)',
    chipBorder: 'rgba(168,85,247,0.20)',
    number: '04',
  },
]

// ─── Single step card ──────────────────────────────────────────────────────────

function StepCard({ step, isLast }) {
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* Connector arrow — hidden on last card and mobile */}
      {!isLast && (
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            position: 'absolute',
            top: 36,
            right: -18,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#f1f5f9',
            border: '1.5px solid rgba(226,232,240,0.9)',
            color: '#94a3b8',
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
        </Box>
      )}

      {/* Card surface */}
      <Box
        sx={{
          height: '100%',
          borderRadius: '24px',
          background: '#fff',
          border: '1.5px solid rgba(226,232,240,0.85)',
          boxShadow: '0 4px 18px rgba(15,23,42,0.06)',
          p: { xs: 3, md: 3.5 },
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform .22s ease, box-shadow .22s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 18px 48px ${step.glowColor}, 0 4px 12px rgba(15,23,42,0.06)`,
          },
        }}
      >
        {/* Step number watermark */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: -14,
            right: 10,
            fontSize: '5.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'rgba(226,232,240,0.55)',
            userSelect: 'none',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
          }}
        >
          {step.number}
        </Typography>

        {/* Icon circle */}
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '18px',
            background: step.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            mb: 2.5,
            boxShadow: `0 10px 24px ${step.glowColor}`,
          }}
        >
          {step.icon}
        </Box>

        {/* Step badge */}
        <Chip
          label={`Step ${parseInt(step.number, 10)}`}
          size="small"
          sx={{
            height: 24,
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            background: step.chipBg,
            color: step.chipColor,
            border: `1px solid ${step.chipBorder}`,
            mb: 1.2,
          }}
        />

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.05rem',
            color: '#0f172a',
            lineHeight: 1.25,
            mb: 1,
          }}
        >
          {step.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: '0.84rem',
            color: '#64748b',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          {step.desc}
        </Typography>
      </Box>
    </Box>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 3, md: 1 },
        position: 'relative',
        overflow: 'hidden',
        /* soft purple glow behind the section */
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(109,91,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          right: '-8%',
          width: '40vw',
          height: '40vw',
          maxWidth: 480,
          maxHeight: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section header ──────────────────────────────────────────────── */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: { xs: 5, md: 7 } }}>
          <Chip
            label="How it works"
            size="small"
            sx={{
              height: 29,
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.73rem',
              background: 'rgba(109,91,255,0.08)',
              color: '#6d5bff',
              border: '1px solid rgba(109,91,255,0.16)',
            }}
          />

          <Typography
            align="center"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#0f172a',
            }}
          >
            Get started in 4 simple steps
          </Typography>

          <Typography
            align="center"
            sx={{
              color: '#64748b',
              fontSize: '0.95rem',
              maxWidth: 460,
              lineHeight: 1.7,
            }}
          >
            From sign-up to closing the deal — the whole marketplace journey
            built for speed and simplicity.
          </Typography>
        </Stack>

        {/* ── Steps grid ──────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} lg={3} key={step.number}>
              <StepCard step={step} isLast={index === steps.length - 1} />
            </Grid>
          ))}
        </Grid>

        {/* ── Bottom trust bar ────────────────────────────────────────────── */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            py: 2.5,
            px: { xs: 3, md: 5 },
            borderRadius: '20px',
            background: 'rgba(248,250,252,0.9)',
            border: '1.5px solid rgba(226,232,240,0.8)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, sm: 5 },
          }}
        >
          {[
            { emoji: '⚡', label: 'Instant access after payment' },
            { emoji: '🔒', label: 'Secure UPI payment flow' },
            { emoji: '🏠', label: 'Properties + vehicles in one place' },
            { emoji: '🆓', label: 'Free to browse, no card required' },
          ].map((item) => (
            <Stack key={item.label} direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '1.1rem' }}>{item.emoji}</Typography>
              <Typography
                sx={{
                  fontSize: '0.83rem',
                  fontWeight: 700,
                  color: '#475569',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>

      </Container>
    </Box>
  )
}