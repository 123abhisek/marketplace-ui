
// src/components/HowItWorks.jsx
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
} from '@mui/material'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    title: 'Create Account',
    desc: 'Sign up in minutes, complete your buyer or seller profile, and get started without any complicated setup.',
    icon: <PersonAddAlt1RoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #6d5bff 0%, #4f8cff 100%)',
    glowColor: 'rgba(109,91,255,0.20)',
    chipColor: '#5b4cf0',
    chipBg: 'rgba(109,91,255,0.09)',
    chipBorder: 'rgba(109,91,255,0.18)',
    number: '01',
  },
  {
    title: 'Choose a Plan',
    desc: 'Browse for free or unlock Premium access for ₹299 with a one-time payment and no recurring charges.',
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
    desc: 'Premium members unlock contact details and full listing access instantly, so conversations can begin right away.',
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
    desc: 'Buy, rent, or sell properties and vehicles directly through a simple marketplace flow built for faster decisions.',
    icon: <HandshakeRoundedIcon sx={{ fontSize: 28 }} />,
    iconBg: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    glowColor: 'rgba(168,85,247,0.18)',
    chipColor: '#7e22ce',
    chipBg: 'rgba(168,85,247,0.09)',
    chipBorder: 'rgba(168,85,247,0.20)',
    number: '04',
  },
]

const trustItems = [
  {
    icon: <BoltRoundedIcon sx={{ fontSize: 18 }} />,
    label: 'Instant access after payment',
  },
  {
    icon: <LockRoundedIcon sx={{ fontSize: 18 }} />,
    label: 'Secure payment flow',
  },
  {
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 18 }} />,
    label: 'Property and vehicle listings',
  },
  {
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />,
    label: 'Free browsing to start',
  },
]

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({ step, isLast }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {!isLast && (
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            position: 'absolute',
            top: 44,
            right: -18,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#f8fafc',
            border: '1.5px solid rgba(226,232,240,0.92)',
            color: '#94a3b8',
            boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
        </Box>
      )}

      <Box
        sx={{
          height: '100%',
          minHeight: { xs: 300, sm: 320, md: 330 },
          borderRadius: '24px',
          background: '#fff',
          border: '1.5px solid rgba(226,232,240,0.92)',
          boxShadow: '0 8px 28px rgba(15,23,42,0.05)',
          p: { xs: 3, md: 3.25 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          transition:
            'transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s cubic-bezier(.16,1,.3,1), border-color .2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 18px 40px ${step.glowColor}, 0 8px 18px rgba(15,23,42,0.05)`,
            borderColor: step.chipBorder,
          },
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            bottom: -12,
            right: 12,
            fontSize: '5.25rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'rgba(226,232,240,0.58)',
            userSelect: 'none',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
          }}
        >
          {step.number}
        </Typography>

        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: '100%', width: '100%' }}
        >
          <Box
            sx={{
              width: 62,
              height: 62,
              borderRadius: '20px',
              background: step.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: `0 12px 26px ${step.glowColor}`,
              mt: 0.5,
            }}
          >
            {step.icon}
          </Box>

          <Chip
            label={`Step ${parseInt(step.number, 10)}`}
            size="small"
            sx={{
              height: 26,
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.68rem',
              letterSpacing: '0.05em',
              background: step.chipBg,
              color: step.chipColor,
              border: `1px solid ${step.chipBorder}`,
            }}
          />

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.05rem',
              color: '#0f172a',
              lineHeight: 1.25,
              maxWidth: '16ch',
            }}
          >
            {step.title}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#64748b',
              lineHeight: 1.72,
              fontWeight: 500,
              maxWidth: '28ch',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {step.desc}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

// ─── Trust tile ───────────────────────────────────────────────────────────────

function TrustTile({ item, accent = 'purple' }) {
  const cfg =
    accent === 'teal'
      ? {
          bg: 'rgba(15,118,110,0.06)',
          border: 'rgba(15,118,110,0.14)',
          color: '#0f766e',
        }
      : {
          bg: 'rgba(109,91,255,0.06)',
          border: 'rgba(109,91,255,0.14)',
          color: '#5b4cf0',
        }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 112,
        borderRadius: '18px',
        background: '#fff',
        border: '1.5px solid rgba(226,232,240,0.9)',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
        px: 2,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </Box>

        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#475569',
            lineHeight: 1.45,
            maxWidth: '18ch',
          }}
        >
          {item.label}
        </Typography>
      </Stack>
    </Box>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 7, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#ffffff 0%,#f8fafc 52%,#ffffff 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '18%',
          left: '-10%',
          width: '52vw',
          height: '52vw',
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(109,91,255,0.05) 0%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '8%',
          right: '-8%',
          width: '40vw',
          height: '40vw',
          maxWidth: 480,
          maxHeight: 480,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack alignItems="center" spacing={1.5} sx={{ mb: { xs: 5, md: 6.5 } }}>
          <Chip
            label="How it works"
            size="small"
            sx={{
              height: 29,
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.73rem',
              background: 'rgba(109,91,255,0.08)',
              color: '#5b4cf0',
              border: '1px solid rgba(109,91,255,0.16)',
            }}
          />

          <Typography
            align="center"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.85rem', md: '2.4rem' },
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#0f172a',
              maxWidth: 700,
            }}
          >
            Get started in 4 simple steps
          </Typography>

          <Typography
            align="center"
            sx={{
              color: '#64748b',
              fontSize: '0.94rem',
              maxWidth: 560,
              lineHeight: 1.75,
            }}
          >
            From sign-up to closing the deal, the complete marketplace journey is
            designed to feel fast, clear, and easy to follow.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center">
          {steps.map((step, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              key={step.number}
              sx={{ display: 'flex' }}
            >
              <StepCard step={step} isLast={index === steps.length - 1} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: { xs: 5, md: 6.5 } }}>
          <Grid container spacing={{ xs: 2, md: 2.5 }} justifyContent="center">
            {trustItems.map((item, index) => (
              <Grid
                item
                xs={6}
                md={3}
                key={item.label}
                sx={{ display: 'flex' }}
              >
                <TrustTile
                  item={item}
                  accent={index % 2 === 0 ? 'purple' : 'teal'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
