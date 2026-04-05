// src/dashboard/LogoutPage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { useAppState } from '../hooks/useAppState'

export default function LogoutPage() {
  const { logout } = useAppState()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate('/', { replace: true })
  }, [logout, navigate])

  return (
    <Stack alignItems="center" spacing={2} className="py-12">
      <CircularProgress />
      <Typography>Logging out...</Typography>
    </Stack>
  )
}