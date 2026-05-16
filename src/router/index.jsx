
// src/router/index.jsx
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGate from "../layouts/DashboardGate";
import PremiumGate from "../layouts/PremiumGate";
import AdminLayout from "../layouts/AdminLayout";
import AdminGate from "../layouts/AdminGate";

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
import MyBookingsPage from "../dashboard/MyBookingsPage";

import PropertyDetailPage from "../pages/PropertyDetailPage";
import VehicleDetailPage from "../pages/VehicleDetailPage";
import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import FAQPage from "../pages/FAQPage";
import ContactPage from "../pages/ContactPage";
import ExplorePage from "../pages/ExplorePage";

import PrivacyPolicyPage from "../support/PrivacyPolicyPage";
import TermsOfServicePage from "../support/TermsOfServicePage";
import RefundPolicyPage from "../support/RefundPolicyPage";

import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminListingsPage from "../pages/admin/AdminListingsPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

const routes = [
  // ── Public pages ─────────────────────────────────────────────
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
      { path: "/explore", element: <ExplorePage /> },
      { path: "/properties/:id", element: <PropertyDetailPage /> },
      { path: "/vehicles/:id", element: <VehicleDetailPage /> },
    ],
  },

  // ── Auth pages ───────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // ── Logged-in but free user area ─────────────────────────────
  {
    element: <DashboardGate />,
    children: [{ path: "/free-dashboard", element: <FreeDashboard /> }],
  },

  // ── Shared logged-in dashboard routes ────────────────────────
  {
    path: "/dashboard",
    element: <DashboardGate />,
    children: [
      { path: "properties/:id", element: <PropertyDetailPage /> },
      { path: "vehicles/:id", element: <VehicleDetailPage /> },
      { path: "my-bookings", element: <MyBookingsPage /> },

      {
        element: <PremiumGate />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "home", element: <DashboardHome /> },
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

  // ── Admin routes ─────────────────────────────────────────────
  {
    path: "/Welcome back, Admin!",
    element: <AdminGate />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "listings", element: <AdminListingsPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
    ],
  },

  // ── Catch-all ────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;