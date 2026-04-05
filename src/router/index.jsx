// src/router/index.jsx
import { Navigate } from 'react-router-dom'

// Layouts
import PublicLayout  from '../layouts/PublicLayout'   // ← has Navbar + Footer
import AuthLayout    from '../layouts/AuthLayout'     // ← new, bare layout
import DashboardLayout from '../layouts/DashboardLayout'

// Public pages
import LandingPage       from '../pages/LandingPage'
import SubscriptionPage  from '../pages/SubscriptionPage'

// Auth pages  (no navbar/footer needed)
import LoginPage    from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

// Dashboard pages
import DashboardHome          from '../dashboard/DashboardHome'
import PropertiesPage         from '../dashboard/PropertiesPage'
import VehiclesPage           from '../dashboard/VehiclesPage'
import AddPropertyPage        from '../dashboard/AddPropertyPage'
import AddVehiclePage         from '../dashboard/AddVehiclePage'
import MyListingsPage         from '../dashboard/MyListingsPage'
import ProfilePage            from '../dashboard/ProfilePage'
import SubscriptionStatusPage from '../dashboard/SubscriptionStatusPage'
import LogoutPage             from '../dashboard/LogoutPage'

const routes = [
  // ── Public pages WITH Navbar + Footer ────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',             element: <LandingPage /> },
      { path: '/subscription', element: <SubscriptionPage /> },
    ],
  },

  // ── Auth pages — NO Navbar, NO Footer ────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── Dashboard ────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true,                  element: <DashboardHome /> },
      { path: 'properties',           element: <PropertiesPage /> },
      { path: 'vehicles',             element: <VehiclesPage /> },
      { path: 'add-property',         element: <AddPropertyPage /> },
      { path: 'add-vehicle',          element: <AddVehiclePage /> },
      { path: 'my-listings',          element: <MyListingsPage /> },
      { path: 'profile',              element: <ProfilePage /> },
      { path: 'subscription',         element: <SubscriptionStatusPage /> },
      { path: 'logout',               element: <LogoutPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]

export default routes