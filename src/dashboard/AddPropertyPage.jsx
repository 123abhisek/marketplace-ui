// src/dashboard/AddPropertyPage.jsx
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import PropertyForm from '../forms/PropertyForm'
import PremiumLockCard from '../components/PremiumLockCard'
import { useAppState } from '../hooks/useAppState'

export default function AddPropertyPage() {
  const { user, addProperty } = useAppState()
  const navigate = useNavigate()

  const submit = (data) => {
    const ok = addProperty(data)
    if (ok) navigate('/dashboard/my-listings')
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Add Property</Typography>
      {!user.isPremium && <PremiumLockCard />}
      <Card className="rounded-3xl">
        <CardContent>
          <PropertyForm onSubmit={submit} />
        </CardContent>
      </Card>
    </Stack>
  )
}