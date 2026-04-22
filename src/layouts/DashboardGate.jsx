// // src/layouts/DashboardGate.jsx
// import { Navigate, Outlet } from 'react-router-dom'
// import { useAppState } from '../hooks/useAppState'

// /**
//  * DashboardGate
//  *
//  * Props:
//  *   requirePremium — if true, free users are redirected to /free-dashboard
//  *                    if false (default), just checks loggedIn
//  */
// export default function DashboardGate({ requirePremium = false }) {
//   const { user } = useAppState()

//   // Not logged in → go to login
//   if (!user.loggedIn) {
//     return <Navigate to="/login" replace />
//   }

//   // Premium route but user is free → redirect to free dashboard
//   if (requirePremium && !user.isPremium) {
//     return <Navigate to="/free-dashboard" replace />
//   }

//   // Free dashboard route but user upgraded → send to premium dashboard
//   if (!requirePremium && user.isPremium) {
//     return <Navigate to="/dashboard" replace />
//   }

//   return <Outlet />
// }



// src/layouts/DashboardGate.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'

export default function DashboardGate() {
  const { user } = useAppState()

  if (!user.loggedIn) return <Navigate to="/login" replace />

  return <Outlet />
}   