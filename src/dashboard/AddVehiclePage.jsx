// src/dashboard/AddVehiclePage.jsx
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import VehicleForm from '../forms/VehicleForm'
import PremiumLockCard from '../components/PremiumLockCard'
import { useAppState } from '../hooks/useAppState'

export default function AddVehiclePage() {
  const { user, addVehicle } = useAppState()
  const navigate = useNavigate()

  const submit = (data) => {
    const ok = addVehicle(data)
    if (ok) navigate('/dashboard/my-listings')
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Add Vehicle</Typography>
      {!user.isPremium && <PremiumLockCard />}
      <Card className="rounded-3xl">
        <CardContent>
          <VehicleForm onSubmit={submit} />
        </CardContent>
      </Card>
    </Stack>
  )
}