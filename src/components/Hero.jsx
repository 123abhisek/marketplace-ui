
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

const stats = ['10k+ active listings', '₹299 premium access', 'Trusted seller flow']

const tabs = [
  { label: 'Properties', active: true },
  { label: 'Vehicles', active: false },
]

const featuredCards = [
  {
    title: '2 BHK Flat',
    location: 'Whitefield, Bengaluru',
    price: '₹68L',
    type: 'Property',
    bg: 'linear-gradient(135deg, #e9e7ff 0%, #f4f7ff 100%)',
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 28 }} />,
  },
  {
    title: 'Hyundai Creta',
    location: 'Indiranagar, Bengaluru',
    price: '₹12.5L',
    type: 'Vehicle',
    bg: 'linear-gradient(135deg, #e1f5ef 0%, #f3fbf8 100%)',
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
  },
]

export default function Hero() {
  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 },
        background:
          'linear-gradient(180deg, #f6f7fb 0%, #f2f5fb 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 12% 18%, rgba(108,99,255,0.10), transparent 18%), radial-gradient(circle at 88% 20%, rgba(107,211,180,0.10), transparent 20%), radial-gradient(circle at 50% 100%, rgba(124,108,255,0.06), transparent 24%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: '30px', md: '42px' },
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 4, md: 6 },
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 24px 80px rgba(15,23,42,0.07)',
          }}
        >
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Chip
              icon={<WorkspacePremiumRoundedIcon />}
              label="Subscription-based property + vehicle marketplace"
              sx={{
                height: 38,
                borderRadius: '999px',
                px: 1,
                fontWeight: 800,
                color: '#5b4cf0',
                backgroundColor: 'rgba(91,76,240,0.08)',
                border: '1px solid rgba(91,76,240,0.12)',
                '& .MuiChip-icon': {
                  color: '#5b4cf0',
                },
              }}
            />

            <Typography
              variant="h1"
              sx={{
                maxWidth: 880,
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: { xs: 1.06, md: 0.98 },
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5.2rem' },
                color: '#111827',
              }}
            >
              Discover properties and vehicles in one{' '}
              <Box component="span" sx={{ color: '#5b4cf0' }}>
                premium
              </Box>{' '}
              marketplace
            </Typography>

            <Typography
              sx={{
                maxWidth: 720,
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.08rem' },
                lineHeight: 1.85,
              }}
            >
              Search flats, land, houses, cars, bikes, and commercial listings through a
              cleaner marketplace experience built for faster browsing and better buyer trust.
            </Typography>

            <Card
              sx={{
                width: '100%',
                maxWidth: 860,
                borderRadius: '22px',
                background: '#fff',
                border: '1px solid rgba(226,232,240,0.95)',
                boxShadow: '0 16px 40px rgba(15,23,42,0.06)',
              }}
            >
              <CardContent sx={{ p: { xs: 1.4, md: 1.6 } }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ xs: 'stretch', md: 'center' }}
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        borderColor: 'rgba(226,232,240,0.95)',
                      }}
                    />
                  }
                >
                  <Stack sx={{ flex: 1, px: { md: 2 }, py: 1.1 }} spacing={0.4}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <PlaceRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography fontWeight={800}>Location</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Bengaluru / Hyderabad / Chennai
                    </Typography>
                  </Stack>

                  <Stack sx={{ flex: 1, px: { md: 2 }, py: 1.1 }} spacing={0.4}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <SearchRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography fontWeight={800}>Browse</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Flats, plots, cars, bikes
                    </Typography>
                  </Stack>

                  <Stack sx={{ flex: 1, px: { md: 2 }, py: 1.1 }} spacing={0.4}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <CurrencyRupeeRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography fontWeight={800}>Budget</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Set your expected range
                    </Typography>
                  </Stack>

                  <Box sx={{ p: { xs: 0, md: 0.8 }, pt: { xs: 1.5, md: 0 } }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<SearchRoundedIcon />}
                      sx={{
                        height: 54,
                        minWidth: 150,
                        borderRadius: '16px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #14123b 0%, #2d2a72 100%)',
                        boxShadow: '0 14px 32px rgba(20,18,59,0.22)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0f0e31 0%, #262261 100%)',
                        },
                      }}
                    >
                      Search
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeWorkRoundedIcon />}
                sx={{
                  px: 2.6,
                  py: 1.35,
                  borderRadius: '16px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6d5ef6 0%, #4f8cff 100%)',
                  boxShadow: '0 14px 30px rgba(108,99,255,0.24)',
                }}
              >
                Explore Properties
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<DirectionsCarRoundedIcon />}
                sx={{
                  px: 2.6,
                  py: 1.35,
                  borderRadius: '16px',
                  fontWeight: 800,
                  borderColor: 'rgba(148,163,184,0.4)',
                  color: '#0f172a',
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                Explore Vehicles
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1.2}
              flexWrap="wrap"
              useFlexGap
              justifyContent="center"
            >
              {stats.map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.7,
                    py: 0.95,
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.88)',
                    border: '1px solid rgba(226,232,240,0.95)',
                    color: '#475569',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {item}
                </Box>
              ))}
            </Stack>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              mt: { xs: 5, md: 7 },
              maxWidth: 980,
              mx: 'auto',
              px: { xs: 0, md: 4 },
            }}
          >
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: { xs: '26px', md: '34px' },
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,255,0.98))',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 28px 80px rgba(15,23,42,0.10)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(91,76,240,0.08)',
                        color: '#5b4cf0',
                      }}
                    >
                      <SearchRoundedIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={800}>Browse Marketplace</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Properties and vehicles
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {tabs.map((item) => (
                      <Chip
                        key={item.label}
                        label={item.label}
                        sx={{
                          fontWeight: 800,
                          borderRadius: '999px',
                          background: item.active
                            ? 'linear-gradient(135deg, #6d5ef6 0%, #4f8cff 100%)'
                            : 'rgba(241,245,249,1)',
                          color: item.active ? '#fff' : '#475569',
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Grid container spacing={2.2}>
                  {featuredCards.map((item) => (
                    <Grid item xs={12} md={6} key={item.title}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: '24px',
                          background: item.bg,
                          border: '1px solid rgba(226,232,240,0.9)',
                          boxShadow: 'none',
                        }}
                      >
                        <CardContent sx={{ p: 2.2 }}>
                          <Box
                            sx={{
                              mb: 2,
                              height: 190,
                              borderRadius: '20px',
                              background: 'rgba(255,255,255,0.72)',
                              border: '1px solid rgba(255,255,255,0.9)',
                              display: 'grid',
                              placeItems: 'center',
                              color: '#334155',
                            }}
                          >
                            <Stack alignItems="center" spacing={1}>
                              <Box
                                sx={{
                                  width: 68,
                                  height: 68,
                                  borderRadius: '20px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  background: '#fff',
                                  boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
                                }}
                              >
                                {item.icon}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                Featured listing preview
                              </Typography>
                            </Stack>
                          </Box>

                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Box>
                              <Typography fontWeight={800}>{item.title}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {item.location}
                              </Typography>
                            </Box>

                            <Chip
                              size="small"
                              label={item.type}
                              sx={{
                                fontWeight: 700,
                                backgroundColor: 'rgba(255,255,255,0.82)',
                                color: '#475569',
                              }}
                            />
                          </Stack>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mt: 2 }}
                          >
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 900 }}>
                              {item.price}
                            </Typography>

                            <Button endIcon={<ArrowOutwardRoundedIcon />} sx={{ fontWeight: 800 }}>
                              View details
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card
              sx={{
                position: 'absolute',
                left: { xs: 10, md: 0 },
                top: { xs: -18, md: 34 },
                width: { xs: 170, md: 210 },
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.1} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#047857',
                      background: 'rgba(16,185,129,0.10)',
                    }}
                  >
                    <WorkspacePremiumRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800}>Premium</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unlock full details
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                position: 'absolute',
                right: { xs: 10, md: 0 },
                bottom: { xs: -18, md: 28 },
                width: { xs: 172, md: 220 },
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid rgba(255,255,255,0.95)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.1} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#7c3aed',
                      background: 'rgba(124,58,237,0.10)',
                    }}
                  >
                    <VerifiedRoundedIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800}>Verified sellers</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cleaner buyer trust
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}