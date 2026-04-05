
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import TwoWheelerRoundedIcon from '@mui/icons-material/TwoWheelerRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import VillaRoundedIcon from '@mui/icons-material/VillaRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

const items = [
  {
    title: 'Property',
    icon: <ApartmentRoundedIcon />,
    desc: 'Discover residential and investment-ready property listings.',
    tag: 'Popular',
    color: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 100%)',
  },
  {
    title: 'Apartments',
    icon: <VillaRoundedIcon />,
    desc: 'Modern apartments with gated and premium housing options.',
    tag: 'Urban',
    color: 'linear-gradient(135deg, #f5f3ff 0%, #fcfcff 100%)',
  },
  {
    title: 'Houses',
    icon: <HouseRoundedIcon />,
    desc: 'Independent houses, villas, and family homes.',
    tag: 'Family',
    color: 'linear-gradient(135deg, #eff6ff 0%, #f9fcff 100%)',
  },
  {
    title: 'Commercial',
    icon: <BusinessRoundedIcon />,
    desc: 'Office spaces, retail shops, and business locations.',
    tag: 'Business',
    color: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  },
  {
    title: 'Land',
    icon: <TerrainRoundedIcon />,
    desc: 'Plots, sites, and agricultural land for sale.',
    tag: 'Investment',
    color: 'linear-gradient(135deg, #ecfeff 0%, #f8ffff 100%)',
  },
  {
    title: 'Cars',
    icon: <DirectionsCarRoundedIcon />,
    desc: 'Used cars with polished discovery and detail views.',
    tag: 'Top Deals',
    color: 'linear-gradient(135deg, #eef2ff 0%, #fbfcff 100%)',
  },
  {
    title: 'Bikes',
    icon: <TwoWheelerRoundedIcon />,
    desc: 'Second-hand bikes and premium two-wheeler listings.',
    tag: 'Fast Moving',
    color: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
  },
  {
    title: 'Trucks',
    icon: <LocalShippingRoundedIcon />,
    desc: 'Transport and utility vehicle inventory.',
    tag: 'Utility',
    color: 'linear-gradient(135deg, #eff6ff 0%, #fcfdff 100%)',
  },
]

export default function Categories() {
  return (
    <Box
      id="categories"
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 7 }}>
          <Chip
            label="Marketplace Categories"
            sx={{
              borderRadius: '999px',
              fontWeight: 800,
              px: 1,
              color: '#5b4cf0',
              backgroundColor: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.12)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.04em',
              fontSize: { xs: '2rem', md: '3.4rem' },
              maxWidth: 780,
              color: '#0f172a',
            }}
          >
            Explore categories designed for{' '}
            <Box component="span" sx={{ color: '#6C63FF' }}>
              premium discovery
            </Box>
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              fontSize: { xs: '0.98rem', md: '1.08rem' },
              lineHeight: 1.8,
            }}
          >
            Browse properties and vehicles through a centered premium grid layout with
            modern cards, soft gradients, and a cleaner marketplace browsing experience.
          </Typography>
        </Stack>

        <Grid container spacing={3} justifyContent="center">
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.title} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 280,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '30px',
                  background: item.color,
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.07)',
                  transition: 'transform .35s ease, box-shadow .35s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(108,99,255,0.10)',
                    filter: 'blur(12px)',
                  }}
                />

                <CardContent
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 3 }}
                  >
                    <Box
                      sx={{
                        width: 62,
                        height: 62,
                        borderRadius: '22px',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#5b4cf0',
                        background:
                          'linear-gradient(135deg, rgba(124,108,255,0.16), rgba(130,230,213,0.18))',
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 10px 24px rgba(108,99,255,0.10)',
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Stack spacing={1} alignItems="flex-end">
                      <Chip
                        label={item.tag}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255,255,255,0.92)',
                          color: '#334155',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: 'rgba(15,23,42,0.25)',
                          fontSize: '0.78rem',
                        }}
                      >
                        0{index + 1}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: '#0f172a',
                      mb: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.75,
                      mb: 3,
                    }}
                  >
                    {item.desc}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        pt: 2,
                        borderTop: '1px solid rgba(148,163,184,0.16)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#5b4cf0',
                        }}
                      >
                        Explore now
                      </Typography>

                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '999px',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#5b4cf0',
                          backgroundColor: 'rgba(108,99,255,0.08)',
                        }}
                      >
                        <ArrowOutwardRoundedIcon fontSize="small" />
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}