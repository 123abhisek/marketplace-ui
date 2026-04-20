

// src/components/Testimonials.jsx
import {
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import StarRoundedIcon        from '@mui/icons-material/StarRounded'

// ─── Data ─────────────────────────────────────────────────────────────────────

const reviews = [
  {
    name: 'Rohit Sharma',
    role: 'Property Buyer',
    location: 'Bengaluru',
    rating: 5,
    review:
      'The premium unlock instantly gave me access to seller contacts and full pricing — I shortlisted three properties in a single evening. Far better than typical classifieds.',
    avatarGradient: 'linear-gradient(135deg, #6d5bff 0%, #4f8cff 100%)',
    glowColor: 'rgba(109,91,255,0.18)',
    featured: true,
  },
  {
    name: 'Sneha Patil',
    role: 'Vehicle Seller',
    location: 'Pune',
    rating: 5,
    review:
      'The listing cards look polished and build instant trust with buyers. I got three serious calls within a day of posting my car.',
    avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    glowColor: 'rgba(249,115,22,0.15)',
    featured: false,
  },
  {
    name: 'Arjun Menon',
    role: 'Real Estate Investor',
    location: 'Hyderabad',
    rating: 5,
    review:
      'Clean discovery flow, modern visuals, and a pricing model that makes sense for serious leads. Best ₹299 I have spent this year.',
    avatarGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glowColor: 'rgba(16,185,129,0.15)',
    featured: false,
  },
  {
    name: 'Divya Reddy',
    role: 'Land Seller',
    location: 'Chennai',
    rating: 5,
    review:
      'Very simple to post my agricultural plot listing. The image upload drag-and-drop saved a lot of time and the dashboard layout is clean.',
    avatarGradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    glowColor: 'rgba(168,85,247,0.15)',
    featured: false,
  },
]

const stats = [
  { value: '2,400+', label: 'Active listings' },
  { value: '₹299',  label: 'One-time premium' },
  { value: '4.9★',  label: 'User rating' },
  { value: '98%',   label: 'Satisfaction rate' },
]

// ─── Star row ─────────────────────────────────────────────────────────────────

function Stars({ count = 5, color = '#f59e0b', size = 18 }) {
  return (
    <Stack direction="row" spacing={0.2}>
      {Array.from({ length: count }).map((_, i) => (
        <StarRoundedIcon key={i} sx={{ fontSize: size, color }} />
      ))}
    </Stack>
  )
}

// ─── Avatar circle ────────────────────────────────────────────────────────────

function AvatarCircle({ name, gradient, glow, size = 46 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        boxShadow: `0 8px 20px ${glow}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#fff',
        fontWeight: 900,
        fontSize: size * 0.38,
        letterSpacing: '-0.01em',
        userSelect: 'none',
      }}
    >
      {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
    </Box>
  )
}

// ─── Featured card (large) ────────────────────────────────────────────────────

function FeaturedCard({ item }) {
  return (
    <Box
      sx={{
        borderRadius: '28px',
        background: 'linear-gradient(145deg, #6d5bff 0%, #4f8cff 55%, #38c2ff 100%)',
        boxShadow: '0 28px 72px rgba(109,91,255,0.32), 0 8px 24px rgba(109,91,255,0.18)',
        p: { xs: 3.5, md: 4.5 },
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Decorative blob */}
      <Box sx={{
        position: 'absolute', bottom: -70, right: -70,
        width: 240, height: 240, borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', top: -40, left: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
      }} />

      {/* Quote icon */}
      <Box
        sx={{
          width: 48, height: 48, borderRadius: '14px',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 3,
        }}
      >
        <FormatQuoteRoundedIcon sx={{ fontSize: 26, color: '#fff' }} />
      </Box>

      {/* Stars */}
      <Stars color="rgba(255,255,255,0.90)" size={20} />

      {/* Review text */}
      <Typography
        sx={{
          mt: 2,
          fontSize: { xs: '1rem', md: '1.08rem' },
          fontWeight: 500,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.75,
          flex: 1,
          display: 'flex', alignItems: 'center',
        }}
      >
        "{item.review}"
      </Typography>

      {/* Divider */}
      <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.18)', my: 3 }} />

      {/* Author */}
      <Stack direction="row" spacing={1.8} alignItems="center">
        <AvatarCircle
          name={item.name}
          gradient="rgba(255,255,255,0.22)"
          glow="rgba(255,255,255,0.10)"
          size={48}
        />
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '0.97rem', color: '#fff' }}>
            {item.name}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
            {item.role} · {item.location}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

// ─── Regular card ─────────────────────────────────────────────────────────────

function ReviewCard({ item }) {
  return (
    <Box
      sx={{
        borderRadius: '22px',
        background: '#fff',
        border: '1.5px solid rgba(226,232,240,0.9)',
        boxShadow: '0 4px 18px rgba(15,23,42,0.05)',
        p: { xs: 3, md: 3.2 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .22s ease, box-shadow .22s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 18px 48px ${item.glowColor}, 0 4px 12px rgba(15,23,42,0.05)`,
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark quote */}
      <FormatQuoteRoundedIcon
        sx={{
          position: 'absolute', bottom: -10, right: 8,
          fontSize: '7rem', color: 'rgba(226,232,240,0.55)',
          pointerEvents: 'none', transform: 'rotate(180deg)',
        }}
      />

      {/* Stars */}
      <Stars size={16} />

      {/* Review */}
      <Typography
        sx={{
          mt: 1.8,
          mb: 2.5,
          fontSize: '0.87rem',
          color: '#475569',
          lineHeight: 1.75,
          fontWeight: 400,
          flex: 1,
        }}
      >
        "{item.review}"
      </Typography>

      {/* Divider */}
      <Box sx={{ height: '1px', background: 'rgba(226,232,240,0.8)', mb: 2 }} />

      {/* Author row */}
      <Stack direction="row" spacing={1.4} alignItems="center">
        <AvatarCircle
          name={item.name}
          gradient={item.avatarGradient}
          glow={item.glowColor}
          size={42}
        />
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
            {item.name}
          </Typography>
          <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500 }}>
            {item.role} · {item.location}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const [featured, ...rest] = reviews

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '15%', right: '-12%',
          width: '50vw', height: '50vw',
          maxWidth: 580, maxHeight: 580,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,91,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Stack alignItems="center" spacing={1.5} sx={{ mb: { xs: 5, md: 7 } }}>
          <Chip
            label="Testimonials"
            size="small"
            sx={{
              height: 29, borderRadius: '999px',
              fontWeight: 800, fontSize: '0.73rem',
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
            Trusted by buyers &amp; sellers
          </Typography>
          <Typography
            align="center"
            sx={{ color: '#64748b', fontSize: '0.95rem', maxWidth: 440, lineHeight: 1.7 }}
          >
            Real experiences from people who found their property and vehicle deals
            through Easydeal premium access.
          </Typography>
        </Stack>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch">

          {/* Featured — left col, spans 2 rows on md */}
          <Grid item xs={12} md={5}>
            <FeaturedCard item={featured} />
          </Grid>

          {/* Three regular cards — right col, 3 rows stacked */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ height: '100%' }}>
              {rest.map(item => (
                <Grid item xs={12} sm={6} key={item.name}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  <ReviewCard item={item} />
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            borderRadius: '22px',
            background: 'linear-gradient(135deg, rgba(109,91,255,0.06) 0%, rgba(79,140,255,0.05) 100%)',
            border: '1.5px solid rgba(109,91,255,0.12)',
            py: { xs: 3, md: 3.5 },
            px: { xs: 3, md: 5 },
          }}
        >
          <Grid container spacing={{ xs: 3, md: 0 }} justifyContent="space-around">
            {stats.map((stat, i) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <Stack
                  alignItems="center"
                  sx={{
                    borderRight: {
                      sm: i < stats.length - 1 ? '1px solid rgba(109,91,255,0.12)' : 'none',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '1.7rem', md: '2rem' },
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, #6d5bff, #4f8cff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, mt: 0.5 }}
                  >
                    {stat.label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  )
}