
// // src/hooks/useAppState.jsx
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react'
// import { Alert, Snackbar } from '@mui/material'
// import {
//   authService,
//   propertyService,
//   vehicleService,
//   tokenStore,
// } from '../services/api'


// const AppContext = createContext(null)


// const DEFAULT_USER = {
//   id:           null,
//   name:         '',
//   email:        '',
//   mobile:       '',
//   gender:       '',
//   dob:          '',
//   location:     '',
//   state:        '',
//   city:         '',
//   pincode:      '',
//   occupation:   '',
//   photo:        null,
//   role:         'free',
//   isPremium:    false,
//   subscription: 'inactive',
//   loggedIn:     false,
// }


// // ── Normalize API user object → app user shape ────────────────────────────────
// // API response fields (FastAPI / snake_case):
// //   id, name, email, phone, gender, dob, location, state, city,
// //   pincode, occupation, avatar_b64, is_premium
// const normalizeUser = (u) => ({
//   id:           u.id           ?? null,
//   name:         u.name         || '',
//   email:        u.email        || '',
//   mobile:       u.phone        || '',
//   gender:       u.gender       || '',
//   dob:          u.dob          || '',
//   location:     u.location     || '',
//   state:        u.state        || '',
//   city:         u.city         || '',
//   pincode:      u.pincode      || '',
//   occupation:   u.occupation   || '',
//   photo:        u.avatar_b64   || null,
//   isPremium:    u.is_premium   || false,
//   role:         u.is_premium   ? 'premium' : 'free',
//   subscription: u.is_premium   ? 'active'  : 'inactive',
//   loggedIn:     true,
// })


// // ── blob/object URL → base64 data URI ────────────────────────────────────────
// // RegisterPage's PhotoPicker uses FileReader and already produces a data: URI,
// // so this function short-circuits immediately in that case.
// // Only used as a fallback for blob: URLs (e.g. from react-dropzone).
// async function blobUrlToBase64(blobUrl) {
//   if (!blobUrl)                    return undefined
//   if (blobUrl.startsWith('data:')) return blobUrl   // already a data URI, pass through
//   try {
//     const response = await fetch(blobUrl)
//     const blob     = await response.blob()
//     return new Promise((resolve) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result)
//       reader.readAsDataURL(blob)
//     })
//   } catch {
//     return undefined  // skip gracefully if conversion fails
//   }
// }


// // ── Provider ──────────────────────────────────────────────────────────────────
// export function AppProvider({ children }) {
//   const [user,            setUser]            = useState(DEFAULT_USER)
//   const [properties,      setProperties]      = useState([])
//   const [vehicles,        setVehicles]        = useState([])
//   const [loading,         setLoading]         = useState(false)
//   const [listingsLoading, setListingsLoading] = useState(true)
//   const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })


//   const notify = useCallback(
//     (message, severity = 'success') =>
//       setToast({ open: true, message, severity }),
//     [],
//   )
//   const closeToast = useCallback(
//     () => setToast((p) => ({ ...p, open: false })),
//     [],
//   )


//   // ── Fetch public listings on mount ─────────────────────────────────────────
//   useEffect(() => {
//     setListingsLoading(true)
//     Promise.allSettled([
//       vehicleService.getAll(),
//       propertyService.getAll(),
//     ]).then(([vRes, pRes]) => {
//       if (vRes.status === 'fulfilled') setVehicles(vRes.value)
//       if (pRes.status === 'fulfilled') setProperties(pRes.value)
//     }).finally(() => setListingsLoading(false))
//   }, [])


//   // ── Auth ───────────────────────────────────────────────────────────────────
//   const login = useCallback(
//     async ({ email, password }) => {
//       setLoading(true)
//       try {
//         const responseData = await authService.login({ email, password })
//         const normalized   = normalizeUser(responseData.user ?? {})
//         setUser(normalized)
//         notify(`Welcome back, ${normalized.name || email}!`)
//       } finally {
//         setLoading(false)
//       }
//     },
//     [notify],
//   )


//   /**
//    * register
//    *
//    * API contract (FastAPI /v1/api/auth/register):
//    *   REQUIRED : name, email, password
//    *   OPTIONAL : phone, gender, dob, occupation, avatar_b64,
//    *              location, state, city, pincode
//    *
//    * FIX: `name` is trimmed here as a second safety net in addition to
//    * the trim already done inside authService.register. This ensures that
//    * even if an empty string slips through form validation, the API never
//    * receives `name: ""` which Pydantic rejects as "Field required".
//    */
//   const register = useCallback(
//     async ({
//       name, email, password, mobile,
//       gender, dob, occupation,
//       location, state, city, pincode, photo,
//     }) => {
//       setLoading(true)
//       try {
//         // photo from RegisterPage's PhotoPicker is already a base64 data URI.
//         // blobUrlToBase64 passes data: URIs through unchanged; converts blob: if needed.
//         const avatar_b64 = await blobUrlToBase64(photo || undefined)

//         await authService.register({
//           name:       (name  ?? '').trim(),   // ← FIX: trim before sending
//           email:      (email ?? '').trim(),
//           password,
//           phone:      mobile     || undefined,
//           gender:     gender     || undefined,
//           dob:        dob        || undefined,
//           occupation: occupation || undefined,
//           avatar_b64: avatar_b64 || undefined,
//           location:   location   || undefined,
//           state:      state      || undefined,
//           city:       city       || undefined,
//           pincode:    pincode    || undefined,
//         })

//         // Auto-login after successful registration
//         const responseData = await authService.login({ email, password })
//         setUser(normalizeUser(responseData.user ?? {}))
//         notify('Account created successfully!')
//       } finally {
//         setLoading(false)
//       }
//     },
//     [notify],
//   )


//   const logout = useCallback(async () => {
//     await authService.logout()
//     setUser(DEFAULT_USER)
//     notify('Logged out', 'info')
//   }, [notify])


//   // ── Listings ───────────────────────────────────────────────────────────────
//   const addVehicle = useCallback(
//     async (payload) => {
//       if (!user.isPremium) {
//         notify('Upgrade to Premium to post vehicle listings', 'warning')
//         return false
//       }
//       const newVehicle = await vehicleService.add(payload)
//       setVehicles((prev) => [newVehicle, ...prev])
//       notify('Vehicle listing posted!')
//       return true
//     },
//     [user.isPremium, notify],
//   )


//   const addProperty = useCallback(
//     async (payload) => {
//       if (!user.isPremium) {
//         notify('Upgrade to Premium to post property listings', 'warning')
//         return false
//       }
//       const newProperty = await propertyService.add(payload)
//       setProperties((prev) => [newProperty, ...prev])
//       notify('Property listing posted!')
//       return true
//     },
//     [user.isPremium, notify],
//   )


//   const deleteVehicle = useCallback(
//     async (id) => {
//       await vehicleService.deleteOne(id)
//       setVehicles((prev) => prev.filter((v) => v.id !== id))
//       notify('Vehicle listing deleted', 'info')
//     },
//     [notify],
//   )


//   const deleteProperty = useCallback(
//     async (id) => {
//       await propertyService.deleteOne(id)
//       setProperties((prev) => prev.filter((p) => p.id !== id))
//       notify('Property listing deleted', 'info')
//     },
//     [notify],
//   )


//   const refreshListings = useCallback(() => {
//     setListingsLoading(true)
//     Promise.allSettled([
//       vehicleService.getAll(),
//       propertyService.getAll(),
//     ]).then(([vRes, pRes]) => {
//       if (vRes.status === 'fulfilled') setVehicles(vRes.value)
//       if (pRes.status === 'fulfilled') setProperties(pRes.value)
//     }).finally(() => setListingsLoading(false))
//   }, [])


//   // Demo-only: activate premium locally until real payment endpoint exists
//   const upgradePremium = useCallback(() => {
//     setUser((prev) => ({
//       ...prev,
//       isPremium:    true,
//       role:         'premium',
//       subscription: 'active',
//     }))
//     notify('Premium subscription activated!')
//   }, [notify])


//   const updateProfile = useCallback(
//     (data) => {
//       setUser((prev) => ({ ...prev, ...data }))
//       notify('Profile updated')
//     },
//     [notify],
//   )


//   const value = useMemo(
//     () => ({
//       user,
//       properties,
//       vehicles,
//       loading,
//       listingsLoading,
//       login,
//       logout,
//       register,
//       upgradePremium,
//       updateProfile,
//       addVehicle,
//       addProperty,
//       deleteVehicle,
//       deleteProperty,
//       refreshListings,
//       notify,
//     }),
//     [
//       user, properties, vehicles, loading, listingsLoading,
//       login, logout, register, upgradePremium, updateProfile,
//       addVehicle, addProperty, deleteVehicle, deleteProperty,
//       refreshListings, notify,
//     ],
//   )


//   return (
//     <AppContext.Provider value={value}>
//       {children}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3500}
//         onClose={closeToast}
//       >
//         <Alert
//           onClose={closeToast}
//           severity={toast.severity}
//           variant="filled"
//           sx={{ borderRadius: '14px' }}
//         >
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </AppContext.Provider>
//   )
// }


// export const useAppState = () => {
//   const ctx = useContext(AppContext)
//   if (!ctx) throw new Error('useAppState must be used inside <AppProvider>')
//   return ctx
// }




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
  id: null,
  name: '',
  email: '',
  mobile: '',
  gender: '',
  dob: '',
  location: '',
  state: '',
  city: '',
  pincode: '',
  occupation: '',
  photo: null,
  role: 'free',
  isPremium: false,
  subscription: 'inactive',
  loggedIn: false,
}

// API returns avatarb64 (no underscore), ispremium (no underscore)
const normalizeUser = (u) => ({
  id:           u.id           || null,
  name:         u.name         || '',
  email:        u.email        || '',
  mobile:       u.phone        || '',
  gender:       u.gender       || '',
  dob:          u.dob          || '',
  location:     u.location     || '',
  state:        u.state        || '',
  city:         u.city         || '',
  pincode:      u.pincode      || '',
  occupation:   u.occupation   || '',
  photo:        u.avatarb64    || null,       // ← correct API field name
  isPremium:    u.ispremium    || false,       // ← correct API field name
  role:         u.ispremium    ? 'premium' : 'free',
  subscription: u.ispremium    ? 'active'  : 'inactive',
  loggedIn:     true,
})

// react-dropzone gives blob URLs; API needs base64 data URIs
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
  } catch {
    return undefined
  }
}

export function AppProvider({ children }) {
  const [user,            setUser]            = useState(DEFAULT_USER)
  const [properties,      setProperties]      = useState([])
  const [vehicles,        setVehicles]        = useState([])
  const [loading,         setLoading]         = useState(false)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const notify = useCallback(
    (message, severity = 'success') =>
      setToast({ open: true, message, severity }),
    [],
  )
  const closeToast = useCallback(
    () => setToast((p) => ({ ...p, open: false })),
    [],
  )

  // ── Fetch public listings on mount ─────────────────────────────────────────
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

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      try {
        // API expects { identifier, password } — NOT { email, password }
        const responseData = await authService.login({ email, password })
        setUser(normalizeUser(responseData.user ?? {}))
        notify(`Welcome back, ${responseData.user?.name || email}!`)
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

        const responseData = await authService.login({ email, password })
        setUser(normalizeUser(responseData.user ?? {}))
        notify('Account created successfully!')
      } finally {
        setLoading(false)
      }
    },
    [notify],
  )

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(DEFAULT_USER)
    notify('Logged out', 'info')
  }, [notify])

  // ── Listings ───────────────────────────────────────────────────────────────
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
    setUser((prev) => ({
      ...prev,
      isPremium:    true,
      role:         'premium',
      subscription: 'active',
    }))
    notify('Premium subscription activated!')
  }, [notify])

  const updateProfile = useCallback(
    (data) => {
      setUser((prev) => ({ ...prev, ...data }))
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