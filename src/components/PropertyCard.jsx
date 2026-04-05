// src/components/PropertyCard.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import PremiumLockCard from './PremiumLockCard'
import { useAppState } from '../hooks/useAppState'
import { formatCurrency } from '../utils/formatters'

export default function PropertyCard({ item }) {
  const { user } = useAppState()
  const locked = !user.isPremium

  return (
    <Card className="h-full overflow-hidden rounded-3xl">
      <Box className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-50">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <Box className="flex h-full items-center justify-center text-teal-700">
            <ApartmentRoundedIcon sx={{ fontSize: 56 }} />
          </Box>
        )}
        <Chip
          label={item.propertyType}
          color="primary"
          size="small"
          className="!absolute left-4 top-4"
        />
      </Box>

      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={800}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.location}
          </Typography>

          <Typography className={locked ? 'blur-premium' : ''} fontWeight={800} color="primary">
            {formatCurrency(item.expectedPrice)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {item.bedrooms ? `${item.bedrooms} Bedrooms • ` : ''}
            {item.area ? `${item.area} sq.ft` : item.landArea}
          </Typography>

          <Typography className={locked ? 'blur-premium' : ''} variant="body2">
            Contact: {item.contactNumber}
          </Typography>

          {locked ? (
            <PremiumLockCard compact />
          ) : (
            <Button variant="outlined">View Full Details</Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}