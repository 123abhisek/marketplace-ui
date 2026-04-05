// src/dashboard/MyListingsPage.jsx
import { useNavigate } from 'react-router-dom'
import { Grid, Stack, Typography } from '@mui/material'
import PropertyCard from '../components/PropertyCard'
import VehicleCard from '../components/VehicleCard'
import EmptyState from '../components/EmptyState'
import { useAppState } from '../hooks/useAppState'

export default function MyListingsPage() {
  const { user, properties, vehicles } = useAppState()
  const navigate = useNavigate()

  const mineProperties = properties.filter((item) => item.ownerId === user.id)
  const mineVehicles = vehicles.filter((item) => item.ownerId === user.id)
  const empty = mineProperties.length === 0 && mineVehicles.length === 0

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>My Listings</Typography>

      {empty ? (
        <EmptyState
          title="No listings yet"
          description="Premium users can add property and vehicle listings from the dashboard."
          actionLabel="Add Property"
          onAction={() => navigate('/dashboard/add-property')}
        />
      ) : (
        <>
          <Typography variant="h6" fontWeight={800}>My Properties</Typography>
          <Grid container spacing={3}>
            {mineProperties.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <PropertyCard item={item} />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" fontWeight={800}>My Vehicles</Typography>
          <Grid container spacing={3}>
            {mineVehicles.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <VehicleCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Stack>
  )
}