// src/dashboard/VehiclesPage.jsx
import { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import VehicleCard from '../components/VehicleCard'
import Loader from '../components/Loader'
import { useAppState } from '../hooks/useAppState'

export default function VehiclesPage() {
  const { vehicles } = useAppState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Vehicle Listings</Typography>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          {vehicles.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <VehicleCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}