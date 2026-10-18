import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, Skeleton } from '@mui/material'
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
      <Skeleton variant="circular" width={48} height={48} animation="wave" />
      <Skeleton variant="text" width={120} height={24} animation="wave" />
    </Stack>
  )
}