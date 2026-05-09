
// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Container,
//   Grid,
//   Stack,
//   Typography,
// } from '@mui/material'
// import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
// import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
// import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
// import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded'
// import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
// import TwoWheelerRoundedIcon from '@mui/icons-material/TwoWheelerRounded'
// import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
// import VillaRoundedIcon from '@mui/icons-material/VillaRounded'
// import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

// const items = [
//   {
//     title: 'Property',
//     icon: <ApartmentRoundedIcon />,
//     desc: 'Discover residential and investment-ready property listings.',
//     tag: 'Popular',
//     color: 'linear-gradient(135deg, #eef2ff 0%, #f8faff 100%)',
//   },
//   {
//     title: 'Apartments',
//     icon: <VillaRoundedIcon />,
//     desc: 'Modern apartments with gated and premium housing options.',
//     tag: 'Urban',
//     color: 'linear-gradient(135deg, #f5f3ff 0%, #fcfcff 100%)',
//   },
//   {
//     title: 'Houses',
//     icon: <HouseRoundedIcon />,
//     desc: 'Independent houses, villas, and family homes.',
//     tag: 'Family',
//     color: 'linear-gradient(135deg, #eff6ff 0%, #f9fcff 100%)',
//   },
//   {
//     title: 'Commercial',
//     icon: <BusinessRoundedIcon />,
//     desc: 'Office spaces, retail shops, and business locations.',
//     tag: 'Business',
//     color: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
//   },
//   {
//     title: 'Land',
//     icon: <TerrainRoundedIcon />,
//     desc: 'Plots, sites, and agricultural land for sale.',
//     tag: 'Investment',
//     color: 'linear-gradient(135deg, #ecfeff 0%, #f8ffff 100%)',
//   },
//   {
//     title: 'Cars',
//     icon: <DirectionsCarRoundedIcon />,
//     desc: 'Used cars with polished discovery and detail views.',
//     tag: 'Top Deals',
//     color: 'linear-gradient(135deg, #eef2ff 0%, #fbfcff 100%)',
//   },
//   {
//     title: 'Bikes',
//     icon: <TwoWheelerRoundedIcon />,
//     desc: 'Second-hand bikes and premium two-wheeler listings.',
//     tag: 'Fast Moving',
//     color: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
//   },
//   {
//     title: 'Trucks',
//     icon: <LocalShippingRoundedIcon />,
//     desc: 'Transport and utility vehicle inventory.',
//     tag: 'Utility',
//     color: 'linear-gradient(135deg, #eff6ff 0%, #fcfdff 100%)',
//   },
// ]

// export default function Categories() {
//   return (
//     <Box
//       id="categories"
//       sx={{
//         py: { xs: 10, md: 14 },
//         position: 'relative',
//         overflow: 'hidden',
//       }}
//     >

//       <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
//         <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 7 }}>
//           <Chip
//             label="Marketplace Categories"
//             sx={{
//               borderRadius: '999px',
//               fontWeight: 800,
//               px: 1,
//               color: '#5b4cf0',
//               backgroundColor: 'rgba(108,99,255,0.08)',
//               border: '1px solid rgba(108,99,255,0.12)',
//             }}
//           />

//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: 900,
//               letterSpacing: '-0.04em',
//               fontSize: { xs: '2rem', md: '3.4rem' },
//               maxWidth: 780,
//               color: '#0f172a',
//             }}
//           >
//             Explore categories designed for{' '}
//             <Box component="span" sx={{ color: '#6C63FF' }}>
//               premium discovery
//             </Box>
//           </Typography>

//           <Typography
//             sx={{
//               color: 'text.secondary',
//               maxWidth: 700,
//               fontSize: { xs: '0.98rem', md: '1.08rem' },
//               lineHeight: 1.8,
//             }}
//           >
//             Browse properties and vehicles through a centered premium grid layout with
//             modern cards, soft gradients, and a cleaner marketplace browsing experience.
//           </Typography>
//         </Stack>

//         <Grid container spacing={3} justifyContent="center">
//           {items.map((item, index) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={item.title} sx={{ display: 'flex' }}>
//               <Card
//                 sx={{
//                   width: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   minHeight: 280,
//                   position: 'relative',
//                   overflow: 'hidden',
//                   borderRadius: '30px',
//                   background: item.color,
//                   border: '1px solid rgba(255,255,255,0.85)',
//                   boxShadow: '0 18px 50px rgba(15, 23, 42, 0.07)',
//                   transition: 'transform .35s ease, box-shadow .35s ease',
//                   '&:hover': {
//                     transform: 'translateY(-8px)',
//                     boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12)',
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: -30,
//                     right: -30,
//                     width: 120,
//                     height: 120,
//                     borderRadius: '50%',
//                     background: 'rgba(108,99,255,0.10)',
//                     filter: 'blur(12px)',
//                   }}
//                 />

//                 <CardContent
//                   sx={{
//                     p: 3,
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                   }}
//                 >
//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     sx={{ mb: 3 }}
//                   >
//                     <Box
//                       sx={{
//                         width: 62,
//                         height: 62,
//                         borderRadius: '22px',
//                         display: 'grid',
//                         placeItems: 'center',
//                         color: '#5b4cf0',
//                         background:
//                           'linear-gradient(135deg, rgba(124,108,255,0.16), rgba(130,230,213,0.18))',
//                         border: '1px solid rgba(255,255,255,0.9)',
//                         boxShadow: '0 10px 24px rgba(108,99,255,0.10)',
//                       }}
//                     >
//                       {item.icon}
//                     </Box>

//                     <Stack spacing={1} alignItems="flex-end">
//                       <Chip
//                         label={item.tag}
//                         size="small"
//                         sx={{
//                           fontWeight: 800,
//                           borderRadius: '999px',
//                           backgroundColor: 'rgba(255,255,255,0.92)',
//                           color: '#334155',
//                         }}
//                       />
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           fontWeight: 800,
//                           color: 'rgba(15,23,42,0.25)',
//                           fontSize: '0.78rem',
//                         }}
//                       >
//                         0{index + 1}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 900,
//                       color: '#0f172a',
//                       mb: 1.3,
//                     }}
//                   >
//                     {item.title}
//                   </Typography>

//                   <Typography
//                     sx={{
//                       color: 'text.secondary',
//                       lineHeight: 1.75,
//                       mb: 3,
//                     }}
//                   >
//                     {item.desc}
//                   </Typography>

//                   <Box sx={{ mt: 'auto' }}>
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       justifyContent="space-between"
//                       sx={{
//                         pt: 2,
//                         borderTop: '1px solid rgba(148,163,184,0.16)',
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: '0.95rem',
//                           fontWeight: 800,
//                           color: '#5b4cf0',
//                         }}
//                       >
//                         Explore now
//                       </Typography>

//                       <Box
//                         sx={{
//                           width: 38,
//                           height: 38,
//                           borderRadius: '999px',
//                           display: 'grid',
//                           placeItems: 'center',
//                           color: '#5b4cf0',
//                           backgroundColor: 'rgba(108,99,255,0.08)',
//                         }}
//                       >
//                         <ArrowOutwardRoundedIcon fontSize="small" />
//                       </Box>
//                     </Stack>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   )
// }











// src/components/Categories.jsx
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
    icon: <ApartmentRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Discover residential and investment-ready property listings.',
    tag: 'Popular',
    accent: '#4f46e5',
    soft: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
    glow: 'rgba(79,70,229,0.10)',
  },
  {
    title: 'Apartments',
    icon: <VillaRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Modern apartments with gated and premium housing options.',
    tag: 'Urban',
    accent: '#7c3aed',
    soft: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
    glow: 'rgba(124,58,237,0.10)',
  },
  {
    title: 'Houses',
    icon: <HouseRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Independent houses, villas, and family homes.',
    tag: 'Family',
    accent: '#2563eb',
    soft: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
    glow: 'rgba(37,99,235,0.10)',
  },
  {
    title: 'Commercial',
    icon: <BusinessRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Office spaces, retail shops, and business locations.',
    tag: 'Business',
    accent: '#0f766e',
    soft: 'linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)',
    glow: 'rgba(15,118,110,0.10)',
  },
  {
    title: 'Land',
    icon: <TerrainRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Plots, sites, and agricultural land for sale.',
    tag: 'Investment',
    accent: '#0891b2',
    soft: 'linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)',
    glow: 'rgba(8,145,178,0.10)',
  },
  {
    title: 'Cars',
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Used cars with polished discovery and detail views.',
    tag: 'Top Deals',
    accent: '#1d4ed8',
    soft: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
    glow: 'rgba(29,78,216,0.10)',
  },
  {
    title: 'Bikes',
    icon: <TwoWheelerRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Second-hand bikes and premium two-wheeler listings.',
    tag: 'Fast Moving',
    accent: '#0f766e',
    soft: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
    glow: 'rgba(15,118,110,0.10)',
  },
  {
    title: 'Trucks',
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 28 }} />,
    desc: 'Transport and utility vehicle inventory.',
    tag: 'Utility',
    accent: '#475569',
    soft: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
    glow: 'rgba(71,85,105,0.10)',
  },
]

function CategoryCard({ item, index }) {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 320,
        height: '100%',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        overflow: 'hidden',
        background: item.soft,
        border: '1px solid rgba(226,232,240,0.95)',
        boxShadow: '0 16px 40px rgba(15,23,42,0.06)',
        position: 'relative',
        transition:
          'transform .22s cubic-bezier(.16,1,.3,1), box-shadow .22s cubic-bezier(.16,1,.3,1), border-color .22s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 24px 54px rgba(15,23,42,0.10)',
          borderColor: item.glow,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -34,
          right: -34,
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: item.glow,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      <CardContent
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Stack alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Chip
              label={item.tag}
              size="small"
              sx={{
                height: 28,
                borderRadius: '999px',
                px: 0.6,
                fontWeight: 800,
                color: item.accent,
                backgroundColor: '#fff',
                border: `1px solid ${item.glow}`,
              }}
            />

            <Typography
              sx={{
                fontSize: '0.78rem',
                fontWeight: 900,
                color: 'rgba(15,23,42,0.22)',
                letterSpacing: '.04em',
              }}
            >
              0{index + 1}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '22px',
              display: 'grid',
              placeItems: 'center',
              color: item.accent,
              background: '#fff',
              border: '1px solid rgba(255,255,255,0.95)',
              boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
            }}
          >
            {item.icon}
          </Box>
        </Stack>

        <Typography
          sx={{
            fontWeight: 900,
            color: '#0f172a',
            fontSize: '1.18rem',
            lineHeight: 1.2,
            mb: 1.1,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            color: '#64748b',
            lineHeight: 1.75,
            fontSize: '0.92rem',
            maxWidth: 240,
            mx: 'auto',
          }}
        >
          {item.desc}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 2.5 }}>
          <Box
            sx={{
              pt: 2,
              borderTop: '1px solid rgba(148,163,184,0.14)',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  Browse category
                </Typography>

                <Typography
                  sx={{
                    mt: 0.45,
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    color: item.accent,
                  }}
                >
                  Explore now
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  color: item.accent,
                  background: '#fff',
                  border: `1px solid ${item.glow}`,
                  boxShadow: '0 8px 18px rgba(15,23,42,0.05)',
                  transition: 'all .18s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    background: item.accent,
                    color: '#fff',
                  },
                }}
              >
                <ArrowOutwardRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Categories() {
  return (
    <Box
      id="categories"
      sx={{
        py: { xs: 9, md: 13 },
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #ffffff 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 15% 18%, rgba(79,70,229,0.06), transparent 20%), radial-gradient(circle at 86% 22%, rgba(15,118,110,0.06), transparent 18%), radial-gradient(circle at 50% 100%, rgba(37,99,235,0.05), transparent 24%)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          <Chip
            label="Marketplace Categories"
            sx={{
              height: 34,
              borderRadius: '999px',
              fontWeight: 900,
              px: 1,
              color: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.08)',
              border: '1px solid rgba(15,118,110,0.12)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.045em',
              fontSize: { xs: '2rem', md: '3.2rem' },
              maxWidth: 820,
              color: '#0f172a',
              lineHeight: { xs: 1.12, md: 1.02 },
            }}
          >
            Explore categories built for
            <Box component="span" sx={{ color: '#0f766e' }}>
              {' '}cleaner discovery
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#64748b',
              maxWidth: 720,
              fontSize: { xs: '0.98rem', md: '1.05rem' },
              lineHeight: 1.85,
            }}
          >
            Browse properties and vehicles through a polished category grid with
            softer surfaces, stronger hierarchy, and equal-size centered cards.
          </Typography>
        </Stack>

        <Grid
          container
          spacing={{ xs: 2.5, sm: 2.8, md: 3 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.title}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              <CategoryCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}