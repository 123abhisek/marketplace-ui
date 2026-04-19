
// src/router/index.jsx
import { Navigate } from 'react-router-dom'

import PublicLayout    from '../layouts/PublicLayout'
import AuthLayout      from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import DashboardGate   from '../layouts/DashboardGate'

import LandingPage      from '../pages/LandingPage'
import SubscriptionPage from '../pages/SubscriptionPage'
import LoginPage        from '../pages/LoginPage'
import RegisterPage     from '../pages/RegisterPage'
import FreeDashboard    from '../pages/FreeDashboard'

import DashboardHome          from '../dashboard/DashboardHome'
import PropertiesPage         from '../dashboard/PropertiesPage'
import VehiclesPage           from '../dashboard/VehiclesPage'
import AddPropertyPage        from '../dashboard/AddPropertyPage'
import AddVehiclePage         from '../dashboard/AddVehiclePage'
import MyListingsPage         from '../dashboard/MyListingsPage'
import ProfilePage            from '../dashboard/ProfilePage'
import SubscriptionStatusPage from '../dashboard/SubscriptionStatusPage'
import LogoutPage             from '../dashboard/LogoutPage'

// ── Detail pages (new) ────────────────────────────────────────────────────────
import PropertyDetailPage from '../pages/PropertyDetailPage'
import VehicleDetailPage  from '../pages/VehicleDetailPage'

const routes = [
  // ── Public pages WITH Navbar + Footer ────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',             element: <LandingPage /> },
      { path: '/subscription', element: <SubscriptionPage /> },
    ],
  },

  // ── Auth pages ────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── Free dashboard ────────────────────────────────────────────────
  {
    element: <DashboardGate />,
    children: [
      { path: '/free-dashboard', element: <FreeDashboard /> },
    ],
  },

  // ── Detail pages — accessible to any logged-in user ───────────────
  {
    element: <DashboardGate />,
    children: [
      { path: '/dashboard/properties/:id', element: <PropertyDetailPage /> },
      { path: '/dashboard/vehicles/:id',   element: <VehicleDetailPage /> },
    ],
  },

  // ── Premium dashboard ─────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <DashboardGate requirePremium />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true,          element: <DashboardHome /> },
          { path: 'properties',   element: <PropertiesPage /> },
          { path: 'vehicles',     element: <VehiclesPage /> },
          { path: 'add-property', element: <AddPropertyPage /> },
          { path: 'add-vehicle',  element: <AddVehiclePage /> },
          { path: 'my-listings',  element: <MyListingsPage /> },
          { path: 'profile',      element: <ProfilePage /> },
          { path: 'subscription', element: <SubscriptionStatusPage /> },
          { path: 'logout',       element: <LogoutPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]

export default routes