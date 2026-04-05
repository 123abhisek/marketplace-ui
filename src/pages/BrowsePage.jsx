// src/pages/BrowsePage.jsx
import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

const propertyItems = [
  { title: '2 BHK Apartment', location: 'Whitefield, Bengaluru', price: '₹68,00,000' },
  { title: 'Commercial Office', location: 'Madhapur, Hyderabad', price: '₹1,20,00,000' },
  { title: 'Residential Plot', location: 'Mysuru Road, Bengaluru', price: '₹42,00,000' },
]

const vehicleItems = [
  { title: 'Hyundai Creta', location: 'Indiranagar, Bengaluru', price: '₹12,80,000' },
  { title: 'Royal Enfield Classic 350', location: 'Jayanagar, Bengaluru', price: '₹1,75,000' },
  { title: 'Tata Ace Gold', location: 'Yeshwanthpur, Bengaluru', price: '₹4,20,000' },
]

export default function BrowsePage() {
  const [tab, setTab] = useState(0)
  const items = tab === 0 ? propertyItems : vehicleItems

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={900}>
        Browse Marketplace
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Explore properties and vehicles from one clean browse page.
      </Typography>

      <Box
        sx={{
          p: 1,
          mb: 4,
          borderRadius: 999,
          display: 'inline-flex',
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(226,232,240,0.9)',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab
            label="Properties"
            sx={{
              minHeight: 'auto',
              borderRadius: 999,
              px: 3,
              fontWeight: 800,
              '&.Mui-selected': {
                color: '#fff',
                background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
              },
            }}
          />
          <Tab
            label="Vehicles"
            sx={{
              minHeight: 'auto',
              borderRadius: 999,
              px: 3,
              fontWeight: 800,
              '&.Mui-selected': {
                color: '#fff',
                background: 'linear-gradient(135deg, #7c6cff 0%, #5e87ff 100%)',
              },
            }}
          />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.title}>
            <Card>
              <CardContent>
                <Chip label={tab === 0 ? 'Property' : 'Vehicle'} size="small" />
                <Typography variant="h6" fontWeight={800} sx={{ mt: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.location}
                </Typography>
                <Typography color="primary" fontWeight={900} sx={{ mt: 1.5 }}>
                  {item.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}