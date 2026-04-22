// src/layouts/PremiumGate.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'

export default function PremiumGate() {
  const { user } = useAppState()

  if (!user.isPremium) return <Navigate to="/free-dashboard" replace />

  return <Outlet />
}