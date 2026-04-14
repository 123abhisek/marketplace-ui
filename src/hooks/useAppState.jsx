// src/hooks/useAppState.jsx
import { createContext, useContext, useMemo, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { propertyMock, vehicleMock } from '../data/mockData'
import { authService, tokenStore } from '../services/api'

const AppContext = createContext(null)

// ── Empty user shape ───────────────────────────────────────────────────────────
const emptyUser = {
  id:          null,
  name:        '',
  email:       '',
  phone:       '',
  mobile:      '',     // alias — kept for UI compatibility
  gender:      '',
  dob:         '',
  occupation:  '',
  avatar_url:  '',
  photo:       null,   // alias — kept for UI compatibility
  location:    '',
  state:       '',
  city:        '',
  pincode:     '',
  isPremium:   false,
  subscription: 'inactive',
  loggedIn:    false,
}

// ── Map API user object → app user shape ───────────────────────────────────────
// Works for both the login response's `user` field and the /auth/me response.
function mapApiUser(me) {
  return {
    id:          me.id,
    name:        me.name        || '',
    email:       me.email       || '',
    phone:       me.phone       || '',
    mobile:      me.phone       || '',     // alias for UI fields named "mobile"
    gender:      me.gender      || '',
    dob:         me.dob         || '',
    occupation:  me.occupation  || '',
    avatar_url:  me.avatar_url  || '',
    photo:       me.avatar_url  || null,   // alias for Avatar / PhotoPicker
    location:    me.location    || '',
    state:       me.state       || '',
    city:        me.city        || '',
    pincode:     me.pincode     || '',
    isPremium:   Boolean(me.is_premium),
    subscription: me.is_premium ? 'active' : 'inactive',
    loggedIn:    true,
  }
}

// ── Extract human-readable error from Axios error ─────────────────────────────
function apiError(err, fallback = 'Something went wrong.') {
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) {
    // FastAPI validation error: show field + message
    const d = detail[0]
    const field = d.loc?.[d.loc.length - 1]
    return field ? `${field}: ${d.msg}` : d.msg
  }
  return err?.message || fallback
}

export function AppProvider({ children }) {
  const [user, setUser]             = useState(emptyUser)
  const [loading, setLoading]       = useState(false)
  const [properties, setProperties] = useState(propertyMock)
  const [vehicles, setVehicles]     = useState(vehicleMock)
  const [toast, setToast]           = useState({ open: false, message: '', severity: 'success' })

  const notify = (message, severity = 'success') =>
    setToast({ open: true, message, severity })

  const closeToast = () => setToast((p) => ({ ...p, open: false }))

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  // POST /auth/login → response includes { access_token, user } 
  // No separate /auth/me call needed anymore.
  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const response = await authService.login({ email, password })
      // Store JWT
      tokenStore.set(response.access_token)
      // Use the user object from the login response directly
      setUser(mapApiUser(response.user))
      notify(`Welcome back, ${response.user.name}!`)
      return { success: true }
    } catch (err) {
      const msg = apiError(err, 'Invalid email or password.')
      notify(msg, 'error')
      tokenStore.clear()
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  // ── REGISTER ───────────────────────────────────────────────────────────────
  // POST /auth/register — sends ALL profile fields in one JSON request.
  // Backend returns user object (no token), so we auto-login afterwards.
  const register = async (formData) => {
    setLoading(true)
    try {
      // Step 1 — register with all fields
      await authService.register({
        email:       formData.email       || '',
        password:    formData.password    || '',
        name:        formData.name        || '',
        gender:      formData.gender      || '',
        dob:         formData.dob         || null,
        occupation:  formData.occupation  || '',
        // photo preview is a local blob URL — send as avatar_url
        // In production replace with an uploaded CDN URL
        avatar_url:  formData.photo       || '',
        location:    formData.location    || '',
        state:       formData.state       || '',
        city:        formData.city        || '',
        pincode:     formData.pincode     || '',
        phone:       formData.mobile      || formData.phone || '',
      })

      // Step 2 — auto-login to get access_token + full user
      const loginResponse = await authService.login({
        email:    formData.email,
        password: formData.password,
      })
      tokenStore.set(loginResponse.access_token)
      setUser(mapApiUser(loginResponse.user))

      notify(`Account created! Welcome, ${loginResponse.user.name}!`)
      return { success: true }
    } catch (err) {
      const msg = apiError(err, 'Registration failed. Email may already be in use.')
      notify(msg, 'error')
      tokenStore.clear()
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = () => {
    tokenStore.clear()
    setUser(emptyUser)
    notify('Logged out successfully.', 'info')
  }

  // ── REFRESH current user from server ──────────────────────────────────────
  // Call this after any server-side changes (e.g., premium upgrade webhook).
  const refreshUser = async () => {
    try {
      const me = await authService.me()
      setUser(mapApiUser(me))
    } catch {
      // Token expired — force logout
      logout()
    }
  }

  // ── PREMIUM UPGRADE (client-side demo) ─────────────────────────────────────
  // In production: trigger a server-side payment webhook, then call refreshUser()
  const upgradePremium = async () => {
    // Optimistic update — replace with: await paymentApi.createOrder(); refreshUser()
    setUser((p) => ({ ...p, isPremium: true, subscription: 'active' }))
    notify('Premium subscription activated!')
  }

  // ── PROFILE UPDATE (local only — add a PUT /auth/me endpoint to persist) ──
  const updateProfile = (data) => {
    setUser((p) => ({ ...p, ...data }))
    notify('Profile updated.')
  }

  // ── LISTINGS ───────────────────────────────────────────────────────────────
  const addProperty = (payload) => {
    if (!user.isPremium) {
      notify('Upgrade to Premium to post property listings.', 'warning')
      return false
    }
    setProperties((p) => [{ ...payload, id: Date.now(), ownerId: user.id }, ...p])
    notify('Property listing added.')
    return true
  }

  const addVehicle = (payload) => {
    if (!user.isPremium) {
      notify('Upgrade to Premium to post vehicle listings.', 'warning')
      return false
    }
    setVehicles((p) => [{ ...payload, id: Date.now(), ownerId: user.id }, ...p])
    notify('Vehicle listing added.')
    return true
  }

  const value = useMemo(
    () => ({
      user, loading, properties, vehicles,
      login, logout, register, refreshUser,
      upgradePremium, updateProfile,
      addProperty, addVehicle, notify,
    }),
    [user, loading, properties, vehicles],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: '14px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,.14)',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext)