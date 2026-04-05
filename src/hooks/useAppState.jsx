// src/hooks/useAppState.jsx
import { createContext, useContext, useMemo, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { propertyMock, vehicleMock } from '../data/mockData'

const AppContext = createContext(null)

const defaultUser = {
  id: 1,
  name: 'Guest User',
  email: 'guest@example.com',
  mobile: '9876543210',
  gender: '',
  dob: '',
  location: 'Bengaluru',
  state: 'Karnataka',
  city: 'Bengaluru',
  pincode: '',
  occupation: '',
  photo: null,
  role: 'free',
  isPremium: false,
  subscription: 'inactive',
  loggedIn: false,
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(defaultUser)
  const [properties, setProperties] = useState(propertyMock)
  const [vehicles, setVehicles] = useState(vehicleMock)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const notify = (message, severity = 'success') =>
    setToast({ open: true, message, severity })

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }))

  const login = ({ email, role = 'free' }) => {
    const premium = role === 'premium'
    setUser((prev) => ({
      ...prev,
      name: email?.split('@')[0] || 'Marketplace User',
      email,
      role: premium ? 'premium' : 'free',
      isPremium: premium,
      subscription: premium ? 'active' : 'inactive',
      loggedIn: true,
    }))
    notify(`Logged in as ${premium ? 'Premium' : 'Free'} user`)
  }

  const logout = () => {
    setUser(defaultUser)
    notify('Logged out', 'info')
  }

  const register = (data) => {
    setUser((prev) => ({
      ...prev,
      ...data,
      loggedIn: true,
      role: 'free',
      isPremium: false,
      subscription: 'inactive',
    }))
    notify('Registration successful')
  }

  const upgradePremium = () => {
    setUser((prev) => ({
      ...prev,
      role: 'premium',
      isPremium: true,
      subscription: 'active',
      loggedIn: true,
    }))
    notify('Premium subscription activated')
  }

  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }))
    notify('Profile updated')
  }

  const addProperty = (payload) => {
    if (!user.isPremium) {
      notify('Upgrade to Premium to post property listings', 'warning')
      return false
    }
    setProperties((prev) => [{ ...payload, id: Date.now(), ownerId: user.id }, ...prev])
    notify('Property added successfully')
    return true
  }

  const addVehicle = (payload) => {
    if (!user.isPremium) {
      notify('Upgrade to Premium to post vehicle listings', 'warning')
      return false
    }
    setVehicles((prev) => [{ ...payload, id: Date.now(), ownerId: user.id }, ...prev])
    notify('Vehicle added successfully')
    return true
  }

  const value = useMemo(
    () => ({
      user,
      properties,
      vehicles,
      login,
      logout,
      register,
      upgradePremium,
      updateProfile,
      addProperty,
      addVehicle,
      notify,
    }),
    [user, properties, vehicles],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={closeToast}>
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext)