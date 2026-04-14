
// src/components/Loader.jsx
import { Box, Grid, Skeleton, Stack } from '@mui/material'

function CardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: '20px',
        background: '#fff',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(15,23,42,0.06)',
      }}
    >
      <Skeleton variant="rectangular" height={180} animation="wave" sx={{ bgcolor: '#F1F5F9' }} />
      <Stack spacing={1.5} sx={{ p: 2.5 }}>
        <Skeleton variant="text" height={24} width="75%" animation="wave" sx={{ borderRadius: '8px', bgcolor: '#F1F5F9' }} />
        <Skeleton variant="text" height={16} width="50%" animation="wave" sx={{ borderRadius: '8px', bgcolor: '#F1F5F9' }} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" height={20} width={70} animation="wave" sx={{ borderRadius: '8px', bgcolor: '#F1F5F9' }} />
          <Skeleton variant="rounded" height={20} width={80} animation="wave" sx={{ borderRadius: '8px', bgcolor: '#F1F5F9' }} />
        </Stack>
        <Skeleton variant="text" height={2} animation="wave" sx={{ bgcolor: '#F1F5F9' }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" height={28} width={100} animation="wave" sx={{ borderRadius: '8px', bgcolor: '#F1F5F9' }} />
          <Skeleton variant="rounded" height={32} width={80} animation="wave" sx={{ borderRadius: '10px', bgcolor: '#F1F5F9' }} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default function Loader({ count = 6 }) {
  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}