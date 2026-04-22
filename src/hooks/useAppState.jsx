
// src/hooks/useAppState.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Alert, Snackbar } from '@mui/material'
import {
  authService,
  propertyService,
  vehicleService,
  tokenStore,
} from '../services/api'

const AppContext = createContext(null)

const DEFAULT_USER = {
  id:           null,
  name:         '',
  email:        '',
  mobile:       '',
  gender:       '',
  dob:          '',
  location:     '',
  state:        '',
  city:         '',
  pincode:      '',
  occupation:   '',
  photo:        null,
  role:         'free',
  isPremium:    false,
  subscription: 'inactive',
  loggedIn:     false,
}

// ── Normalize API response → unified app user shape ───────────────────────────
const normalizeUser = (u) => {
  const isPremium = u.is_premium === true || u.ispremium === true || false
  return {
    id:           u.id           || null,
    name:         u.name         || '',
    email:        u.email        || '',
    mobile:       u.phone        || u.mobile || '',
    gender:       u.gender       || '',
    dob:          u.dob          || '',
    location:     u.location     || '',
    state:        u.state        || '',
    city:         u.city         || '',
    pincode:      u.pincode      || '',
    occupation:   u.occupation   || '',
    photo:        u.avatar_b64   || u.avatarb64 || null,
    isPremium,
    role:         isPremium ? 'premium' : 'free',
    subscription: isPremium ? 'active'  : 'inactive',
    loggedIn:     true,
  }
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_USER_KEY = 'userData'

function saveUserToStorage(user) {
  try { localStorage.setItem(LS_USER_KEY, JSON.stringify(user)) } catch {}
}

function clearUserFromStorage() {
  try { localStorage.removeItem(LS_USER_KEY) } catch {}
}

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.loggedIn ? parsed : null
  } catch { return null }
}

// ── blob URL → base64 data URI (for avatar upload) ────────────────────────────
async function blobUrlToBase64(blobUrl) {
  if (!blobUrl) return undefined
  if (blobUrl.startsWith('data:')) return blobUrl
  try {
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch { return undefined }
}

export function AppProvider({ children }) {
  // ── Hydrate user from localStorage on first render ────────────────────────
  const [user, setUser] = useState(() => loadUserFromStorage() ?? DEFAULT_USER)

  const [properties,      setProperties]      = useState([])
  const [vehicles,        setVehicles]        = useState([])
  const [loading,         setLoading]         = useState(false)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  // ── Re-hydrate tokenStore from localStorage on mount ─────────────────────
  // tokenStore already reads localStorage on module load, but this effect
  // acts as a safety net for cases where the module loaded before the token
  // was written (e.g. SSR hydration edge cases).
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken && !tokenStore.get()) {
      tokenStore.set(storedToken)
    }
    // If user is marked loggedIn but no token exists, clear the stale session
    const storedUser = loadUserFromStorage()
    if (storedUser?.loggedIn && !tokenStore.get()) {
      clearUserFromStorage()
      setUser(DEFAULT_USER)
    }
  }, [])

  const notify = useCallback(
    (message, severity = 'success') => setToast({ open: true, message, severity }),
    [],
  )
  const closeToast = useCallback(
    () => setToast((p) => ({ ...p, open: false })),
    [],
  )

  // ── Fetch public listings on mount ────────────────────────────────────────
  useEffect(() => {
    setListingsLoading(true)
    Promise.allSettled([
      vehicleService.getAll(),
      propertyService.getAll(),
    ]).then(([vRes, pRes]) => {
      if (vRes.status === 'fulfilled') setVehicles(vRes.value)
      if (pRes.status === 'fulfilled') setProperties(pRes.value)
    }).finally(() => setListingsLoading(false))
  }, [])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      try {
        // authService.login already calls tokenStore.set(access_token) internally
        const responseData = await authService.login({ email, password })
        console.log('Login response:', responseData)

        const normalizedUser = normalizeUser(responseData.user ?? {})
        setUser(normalizedUser)
        saveUserToStorage(normalizedUser)

        notify(`Welcome back, ${normalizedUser.name || email}!`)
        return normalizedUser
      } finally {
        setLoading(false)
      }
    },
    [notify],
  )

  const register = useCallback(
    async ({
      name, email, password, mobile,
      gender, dob, occupation,
      location, state, city, pincode, photo,
    }) => {
      setLoading(true)
      try {
        const avatar_b64 = await blobUrlToBase64(photo)

        await authService.register({
          name,
          email,
          password,
          phone:      mobile     || undefined,
          gender:     gender     || undefined,
          dob:        dob        || undefined,
          occupation: occupation || undefined,
          avatar_b64: avatar_b64 || undefined,
          location:   location   || undefined,
          state:      state      || undefined,
          city:       city       || undefined,
          pincode:    pincode    || undefined,
        })

        // Login immediately after register to get the token
        const responseData = await authService.login({ email, password })
        const normalizedUser = normalizeUser(responseData.user ?? {})
        setUser(normalizedUser)
        saveUserToStorage(normalizedUser)
        notify('Account created successfully!')

        return normalizedUser
      } finally {
        setLoading(false)
      }
    },
    [notify],
  )

  const logout = useCallback(async () => {
    try { await authService.logout() } catch {}
    // authService.logout already calls tokenStore.clear()
    setUser(DEFAULT_USER)
    clearUserFromStorage()
    notify('Logged out', 'info')
  }, [notify])

  // ── Listings ──────────────────────────────────────────────────────────────
  const addVehicle = useCallback(
    async (payload) => {
      if (!user.isPremium) {
        notify('Upgrade to Premium to post vehicle listings', 'warning')
        return false
      }
      const newVehicle = await vehicleService.add(payload)
      setVehicles((prev) => [newVehicle, ...prev])
      notify('Vehicle listing posted!')
      return true
    },
    [user.isPremium, notify],
  )

  const addProperty = useCallback(
    async (payload) => {
      if (!user.isPremium) {
        notify('Upgrade to Premium to post property listings', 'warning')
        return false
      }
      const newProperty = await propertyService.add(payload)
      setProperties((prev) => [newProperty, ...prev])
      notify('Property listing posted!')
      return true
    },
    [user.isPremium, notify],
  )

  const deleteVehicle = useCallback(
    async (id) => {
      await vehicleService.deleteOne(id)
      setVehicles((prev) => prev.filter((v) => v.id !== id))
      notify('Vehicle listing deleted', 'info')
    },
    [notify],
  )

  const deleteProperty = useCallback(
    async (id) => {
      await propertyService.deleteOne(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
      notify('Property listing deleted', 'info')
    },
    [notify],
  )

  const refreshListings = useCallback(async () => {
    setListingsLoading(true)
    Promise.allSettled([
      vehicleService.getAll(),
      propertyService.getAll(),
    ]).then(([vRes, pRes]) => {
      if (vRes.status === 'fulfilled') setVehicles(vRes.value)
      if (pRes.status === 'fulfilled') setProperties(pRes.value)
    }).finally(() => setListingsLoading(false))
  }, [])

  const upgradePremium = useCallback(() => {
    setUser((prev) => {
      const updated = {
        ...prev,
        isPremium:    true,
        role:         'premium',
        subscription: 'active',
      }
      saveUserToStorage(updated)
      return updated
    })
    notify('Premium subscription activated!')
  }, [notify])

  const updateProfile = useCallback(
    (data) => {
      setUser((prev) => {
        const updated = { ...prev, ...data }
        saveUserToStorage(updated)
        return updated
      })
      notify('Profile updated')
    },
    [notify],
  )

  const value = useMemo(
    () => ({
      user,
      properties,
      vehicles,
      loading,
      listingsLoading,
      login,
      logout,
      register,
      upgradePremium,
      updateProfile,
      addVehicle,
      addProperty,
      deleteVehicle,
      deleteProperty,
      refreshListings,
      notify,
    }),
    [
      user, properties, vehicles, loading, listingsLoading,
      login, logout, register, upgradePremium, updateProfile,
      addVehicle, addProperty, deleteVehicle, deleteProperty,
      refreshListings, notify,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: '14px' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  )
}

export const useAppState = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used inside <AppProvider>')
  return ctx
}