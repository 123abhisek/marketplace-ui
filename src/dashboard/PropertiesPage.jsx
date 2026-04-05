// src/dashboard/PropertiesPage.jsx
import { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import PropertyCard from '../components/PropertyCard'
import Loader from '../components/Loader'
import { useAppState } from '../hooks/useAppState'

export default function PropertiesPage() {
  const { properties } = useAppState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Property Listings</Typography>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          {properties.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <PropertyCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}