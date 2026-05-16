// src/router/index.jsx
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGate from "../layouts/DashboardGate";
import PremiumGate from "../layouts/PremiumGate";

import LandingPage from "../pages/LandingPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import FreeDashboard from "../pages/FreeDashboard";

import DashboardHome from "../dashboard/DashboardHome";
import PropertiesPage from "../dashboard/PropertiesPage";
import VehiclesPage from "../dashboard/VehiclesPage";
import AddPropertyPage from "../dashboard/AddPropertyPage";
import AddVehiclePage from "../dashboard/AddVehiclePage";
import MyListingsPage from "../dashboard/MyListingsPage";
import ProfilePage from "../dashboard/ProfilePage";
import SubscriptionStatusPage from "../dashboard/SubscriptionStatusPage";
import LogoutPage from "../dashboard/LogoutPage";

import PropertyDetailPage from "../pages/PropertyDetailPage";
import VehicleDetailPage from "../pages/VehicleDetailPage";
import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import FAQPage from "../pages/FAQPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPolicyPage from "../support/PrivacyPolicyPage";
import TermsOfServicePage from "../support/TermsOfServicePage";
import RefundPolicyPage from "../support/RefundPolicyPage";

import MyBookingsPage from "../dashboard/MyBookingsPage";

const routes = [
  // ── Public pages ─────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsOfServicePage /> },
      { path: "/refund-policy", element: <RefundPolicyPage /> },
      { path: "/subscription", element: <SubscriptionPage /> },
    ],
  },

  // ── Auth pages ────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // ── Free dashboard ────────────────────────────────────────────────
  {
    // element: <DashboardGate />,
    element: <PublicLayout />,
    children: [{ path: "/free-dashboard", element: <FreeDashboard /> }],
  },

  // ── All /dashboard/* ─────────────────────────────────────────────
  {
    path: "/dashboard",
    element: <DashboardGate />,
    children: [
      // Detail pages — any logged-in user (free OR premium)
      { path: "properties/:id", element: <PropertyDetailPage /> },
      { path: "vehicles/:id", element: <VehicleDetailPage /> },

      // ✅ My Bookings — any logged-in user (free OR premium)
      { path: "my-bookings", element: <MyBookingsPage /> },
      // Premium-only pages wrapped in PremiumGate + DashboardLayout
      {
        element: <PremiumGate />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> }, // /dashboard
              { path: "home", element: <DashboardHome /> }, // /dashboard/home  ← alias
              { path: "properties", element: <PropertiesPage /> },
              { path: "vehicles", element: <VehiclesPage /> },
              { path: "add-property", element: <AddPropertyPage /> },
              { path: "add-vehicle", element: <AddVehiclePage /> },
              { path: "my-listings", element: <MyListingsPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "subscription", element: <SubscriptionStatusPage /> },
              { path: "logout", element: <LogoutPage /> },
            ],
          },
        ],
      },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;
