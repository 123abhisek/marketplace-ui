// src/components/FeaturedListings.jsx
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import PlaceRoundedIcon            from '@mui/icons-material/PlaceRounded'
import LockRoundedIcon             from '@mui/icons-material/LockRounded'
import ArrowOutwardRoundedIcon     from '@mui/icons-material/ArrowOutwardRounded'
import HomeWorkRoundedIcon         from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon    from '@mui/icons-material/DirectionsCarRounded'
import FavoriteBorderRoundedIcon   from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon         from '@mui/icons-material/FavoriteRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import SpeedRoundedIcon            from '@mui/icons-material/SpeedRounded'
import SquareFootRoundedIcon       from '@mui/icons-material/SquareFootRounded'

import { useAppState } from '../hooks/useAppState'

// ─── Listings data ─────────────────────────────────────────────────────────────

const listings = [
  {
    id: 1,
    type: 'Property',
    tag: 'Residential',
    title: 'Luxury 2BHK Apartment',
    location: 'Whitefield, Bengaluru',
    price: '₹68,00,000',
    meta: '1,250 sq.ft • 2 BHK • 5th floor',
    metaIcon: 'sqft',
    premium: true,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 2,
    type: 'Property',
    tag: 'Commercial',
    title: 'Premium Office Space',
    location: 'Hitech City, Hyderabad',
    price: '₹1,20,00,000',
    meta: '3,200 sq.ft • Open plan • 11th floor',
    metaIcon: 'sqft',
    premium: true,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 3,
    type: 'Vehicle',
    tag: 'Car',
    title: 'Hyundai Creta 2022',
    location: 'Indiranagar, Bengaluru',
    price: '₹12,80,000',
    meta: '42,000 km • Diesel • KA-03',
    metaIcon: 'km',
    premium: false,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 4,
    type: 'Vehicle',
    tag: 'Bike',
    title: 'Royal Enfield Classic 350',
    location: 'Jayanagar, Bengaluru',
    price: '₹1,75,000',
    meta: '29,000 km • Petrol • KA-05',
    metaIcon: 'km',
    premium: true,
    image:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=75',
  },
]

// ─── Type design tokens ────────────────────────────────────────────────────────

const TYPE = {
  Property: {
    accent:      '#5b4cf0',
    accentLight: 'rgba(91,76,240,0.09)',
    accentBorder:'rgba(91,76,240,0.18)',
    icon:        <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
    fallback:    'linear-gradient(145deg,#ede9ff 0%,#f4f3ff 100%)',
    pillBg:      'rgba(91,76,240,0.10)',
  },
  Vehicle: {
    accent:      '#0f766e',
    accentLight: 'rgba(15,118,110,0.08)',
    accentBorder:'rgba(15,118,110,0.20)',
    icon:        <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    fallback:    'linear-gradient(145deg,#d1fae5 0%,#f0fdf9 100%)',
    pillBg:      'rgba(15,118,110,0.09)',
  },
}

// ─── Tag pills ─────────────────────────────────────────────────────────────────

const MetaPill = ({ icon, label, bg, color }) => (
  <Stack
    direction="row"
    spacing={0.5}
    alignItems="center"
    sx={{
      px: 1.1,
      py: 0.4,
      borderRadius: '8px',
      background: bg,
      border: '1px solid rgba(0,0,0,0.05)',
    }}
  >
    {icon}
    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color, lineHeight: 1 }}>
      {label}
    </Typography>
  </Stack>
)

// ─── Card ─────────────────────────────────────────────────────────────────────

function ListingCard({ item }) {
  const { user }          = useAppState()
  const [liked, setLiked] = useState(false)
  const locked            = !user?.isPremium && item.premium
  const cfg               = TYPE[item.type]

  // Split meta string into up to 3 tokens
  const parts = item.meta.split('•').map(s => s.trim()).filter(Boolean)

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '20px',
        border: '1px solid rgba(226,232,240,0.85)',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(15,23,42,0.055)',
        overflow: 'hidden',
        transition: 'transform .24s cubic-bezier(.16,1,.3,1), box-shadow .24s cubic-bezier(.16,1,.3,1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 48px rgba(15,23,42,0.11)',
        },
      }}
    >
      {/* ─── Image ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          background: cfg.fallback,
          flexShrink: 0,
        }}
      >
        {/* Actual image */}
        <Box
          component="img"
          src={item.image}
          alt={item.title}
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform .38s cubic-bezier(.16,1,.3,1)',
            '.MuiCard-root:hover &': { transform: 'scale(1.06)' },
          }}
        />

        {/* Subtle bottom gradient for text legibility */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(15,23,42,0.32) 0%, transparent 52%)',
            pointerEvents: 'none',
          }}
        />

        {/* Premium blurred overlay — only for locked premium listings */}
        {locked && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              background: 'rgba(15,23,42,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <Stack
              alignItems="center"
              spacing={0.8}
              sx={{
                px: 2.5,
                py: 2,
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.13)',
                border: '1px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LockRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography
                sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}
              >
                Premium only
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Type chip — top left */}
        <Chip
          icon={cfg.icon}
          label={item.tag}
          size="small"
          sx={{
            position: 'absolute',
            top: 11,
            left: 11,
            zIndex: 3,
            height: 26,
            pl: 0.3,
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.71rem',
            background: 'rgba(255,255,255,0.93)',
            backdropFilter: 'blur(10px)',
            color: cfg.accent,
            border: `1px solid ${cfg.accentBorder}`,
            '& .MuiChip-icon': { color: cfg.accent },
            '& .MuiChip-label': { px: 1 },
          }}
        />

        {/* Premium badge + heart — top right */}
        <Stack
          direction="row"
          spacing={0.6}
          alignItems="center"
          sx={{ position: 'absolute', top: 11, right: 11, zIndex: 3 }}
        >
          {item.premium && (
            <Chip
              icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 12 }} />}
              label="Premium"
              size="small"
              sx={{
                height: 26,
                pl: 0.25,
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.68rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 12px rgba(108,99,255,0.30)',
                '& .MuiChip-icon': { color: 'rgba(255,255,255,0.88)' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}

          <IconButton
            size="small"
            onClick={() => setLiked(p => !p)}
            sx={{
              width: 30,
              height: 30,
              background: 'rgba(255,255,255,0.93)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(226,232,240,0.7)',
              transition: 'transform .18s ease',
              '&:hover': { background: '#fff', transform: 'scale(1.12)' },
              '&:active': { transform: 'scale(0.94)' },
            }}
          >
            {liked
              ? <FavoriteRoundedIcon       sx={{ fontSize: 14, color: '#ef4444' }} />
              : <FavoriteBorderRoundedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />}
          </IconButton>
        </Stack>
      </Box>

      {/* ─── Content ───────────────────────────────────────────────── */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: '16px 18px 18px !important',
          gap: 0,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '0.97rem',
            lineHeight: 1.33,
            color: '#0f172a',
            mb: 0.65,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </Typography>

        {/* Location */}
        <Stack direction="row" spacing={0.45} alignItems="center" sx={{ mb: 1.2 }}>
          <PlaceRoundedIcon sx={{ fontSize: 13, color: '#94a3b8', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: '0.79rem', color: '#64748b', fontWeight: 600, lineHeight: 1 }}
          >
            {item.location}
          </Typography>
        </Stack>

        {/* Meta pills */}
        <Stack direction="row" flexWrap="wrap" gap={0.7} sx={{ mb: 1.8 }}>
          {parts.map((part, i) => (
            <MetaPill
              key={i}
              icon={
                i === 0 && item.metaIcon === 'km'
                  ? <SpeedRoundedIcon sx={{ fontSize: 11, color: cfg.accent }} />
                  : i === 0 && item.metaIcon === 'sqft'
                  ? <SquareFootRoundedIcon sx={{ fontSize: 11, color: cfg.accent }} />
                  : null
              }
              label={part}
              bg={cfg.accentLight}
              color={cfg.accent}
            />
          ))}
        </Stack>

        {/* Divider */}
        <Box sx={{ height: '1px', background: 'rgba(226,232,240,0.85)', mb: 1.6 }} />

        {/* Price row + action ─ always at the bottom */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 'auto' }}
        >
          {/* Price / locked state */}
          {locked ? (
            <Button
              component={RouterLink}
              to="/subscription"
              size="small"
              startIcon={<LockRoundedIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: '10px',
                px: 1.5,
                py: 0.7,
                fontWeight: 800,
                fontSize: '0.75rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                color: '#fff',
                boxShadow: '0 6px 16px rgba(108,99,255,0.22)',
                '&:hover': { background: 'linear-gradient(135deg,#6b59f5,#4c75ff)', boxShadow: '0 8px 22px rgba(108,99,255,0.30)' },
              }}
            >
              Unlock — ₹299
            </Button>
          ) : (
            <>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.12rem',
                    color: cfg.accent,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.price}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                  {item.type === 'Property' ? 'Expected price' : 'Asking price'}
                </Typography>
              </Box>

              <IconButton
                component={RouterLink}
                to={`/dashboard/${item.type === 'Property' ? 'properties' : 'vehicles'}`}
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '11px',
                  background: cfg.accentLight,
                  border: `1px solid ${cfg.accentBorder}`,
                  color: cfg.accent,
                  transition: 'all .18s ease',
                  '&:hover': {
                    background: cfg.accent,
                    color: '#fff',
                    transform: 'scale(1.08)',
                    boxShadow: `0 6px 16px ${cfg.accentBorder}`,
                  },
                }}
              >
                <ArrowOutwardRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturedListings() {
  return (
    <Box
      id="featured"
      sx={{
        py: { xs: 7, md: 11 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #fff 55%, #f8fafc 100%)',
      }}
    >
      <Container maxWidth="xl">

        {/* ── Section header ─────────────────────────────────────────── */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          spacing={2}
          sx={{ mb: { xs: 4, md: 5.5 } }}
        >
          <Box>
            {/* Eyebrow pill */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                  boxShadow: '0 0 0 3px rgba(108,99,255,0.14)',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#5b4cf0',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Marketplace Preview
              </Typography>
            </Stack>

            {/* Heading */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#0f172a',
                mb: 1.1,
              }}
            >
              Featured listings
            </Typography>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.93rem',
                maxWidth: 460,
                lineHeight: 1.7,
              }}
            >
              Properties and vehicles curated for quality. Premium unlocks full contact
              details, pricing, and posting access.
            </Typography>
          </Box>

          {/* View all button */}
          <Button
            component={RouterLink}
            to="/dashboard/properties"
            variant="outlined"
            endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              borderRadius: '999px',
              px: 2.4,
              py: 1.05,
              fontWeight: 700,
              fontSize: '0.87rem',
              borderColor: 'rgba(148,163,184,0.45)',
              color: '#475569',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all .18s ease',
              '&:hover': {
                borderColor: '#5b4cf0',
                color: '#5b4cf0',
                backgroundColor: 'rgba(91,76,240,0.04)',
              },
            }}
          >
            View all listings
          </Button>
        </Stack>

        {/* ── Cards grid — 4 col XL / 2 col MD / 1 col mobile ────────── */}
        <Grid container spacing={{ xs: 2.5, sm: 3 }}>
          {listings.map(item => (
            <Grid item xs={12} sm={6} lg={3} key={item.id}>
              <ListingCard item={item} />
            </Grid>
          ))}
        </Grid>

        {/* ── Premium CTA strip ───────────────────────────────────────── */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            p: { xs: '28px 24px', md: '32px 40px' },
            borderRadius: '24px',
            background: '#fff',
            border: '1px solid rgba(226,232,240,0.9)',
            boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative gradient blob — purely aesthetic */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(108,99,255,0.07) 0%,transparent 72%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left text */}
          <Stack spacing={0.7} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(94,135,255,0.08))',
                  border: '1px solid rgba(108,99,255,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WorkspacePremiumRoundedIcon sx={{ color: '#5b4cf0', fontSize: 19 }} />
              </Box>
              <Typography
                sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.02rem', lineHeight: 1.2 }}
              >
                Unlock all listing details with Premium
              </Typography>
            </Stack>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.87rem',
                maxWidth: 500,
                lineHeight: 1.68,
                pl: '48px',
              }}
            >
              Free users see images only. Upgrade to ₹299 premium to view price, contact
              details, and post your own property or vehicle listings.
            </Typography>
          </Stack>

          {/* Right CTAs */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.3}
            flexShrink={0}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Button
              component={RouterLink}
              to="/subscription"
              variant="contained"
              sx={{
                borderRadius: '999px',
                px: 2.6,
                py: 1.1,
                fontWeight: 800,
                fontSize: '0.88rem',
                background: 'linear-gradient(135deg,#7c6cff,#5e87ff)',
                boxShadow: '0 10px 28px rgba(108,99,255,0.28)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                '&:hover': {
                  background: 'linear-gradient(135deg,#6b59f5,#4c75ff)',
                  boxShadow: '0 14px 36px rgba(108,99,255,0.34)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all .18s ease',
              }}
            >
              Get Premium — ₹299
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                borderRadius: '999px',
                px: 2.3,
                py: 1.05,
                fontWeight: 700,
                fontSize: '0.88rem',
                borderColor: 'rgba(108,99,255,0.28)',
                color: '#5b4cf0',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#5b4cf0',
                  backgroundColor: 'rgba(91,76,240,0.05)',
                },
              }}
            >
              Login to explore
            </Button>
          </Stack>
        </Box>

      </Container>
    </Box>
  )
}