// src/components/Loader.jsx
import { Grid, Skeleton, Stack } from '@mui/material'

export default function Loader({ count = 6 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={220} />
            <Skeleton variant="text" height={36} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}