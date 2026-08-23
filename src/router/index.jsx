import { Navigate } from "react-router-dom";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardGate from "../layouts/DashboardGate";
import SellerGate from "../layouts/SellerGate";
import SellerLayout from "../layouts/SellerLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminGate from "../layouts/AdminGate";

/* Public Pages */
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import FAQPage from "../pages/FAQPage";
import ContactPage from "../pages/ContactPage";
import ExplorePage from "../pages/ExplorePage";
import SubscriptionPage from "../pages/SubscriptionPage";
import PropertyDetailPage from "../pages/PropertyDetailPage";
import VehicleDetailPage from "../pages/VehicleDetailPage";

/* Auth */
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

/* Dashboard */
import DashboardHome from "../dashboard/DashboardHome";
import ProfilePage from "../dashboard/ProfilePage";
import SubscriptionStatusPage from "../dashboard/SubscriptionStatusPage";
import LogoutPage from "../dashboard/LogoutPage";
import MyBookingsPage from "../dashboard/MyBookingsPage";
import MyListingsPage from "../dashboard/MyListingsPage";
import PropertiesPage from "../dashboard/PropertiesPage";
import VehiclesPage from "../dashboard/VehiclesPage";

/* Add listing pages — available to ALL users */
import AddPropertyPage from "../dashboard/AddPropertyPage";
import AddVehiclePage from "../dashboard/AddVehiclePage";

/* Support */
import PrivacyPolicyPage from "../support/PrivacyPolicyPage";
import RefundPolicyPage from "../support/RefundPolicyPage";
import TermsOfServicePage from "../support/TermsOfServicePage";

/* Seller Pages */
import SellerOverviewPage from "../pages/seller/SellerOverviewPage";
import SellerListingsPage from "../pages/seller/SellerListingsPage";
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";
import SellerReportsPage from "../pages/seller/SellerReportsPage";
import SellerRequest from "../dashboard/SellerRequest";

/* Admin */
import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminListingsPage from "../pages/admin/AdminListingsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminApprovalsPage from "../pages/admin/AdminApprovalsPage";
import AdminSellerRequests from "../pages/admin/AdminSellerRequests";

/* Free dashboard redirects for backward compat */
import FreeDashboard from "../pages/FreeDashboard";
import PremiumDashboard from "../pages/PremiumDashboard";

export const routes = [
  /*
   * Public routes
   */
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/explore", element: <ExplorePage /> },
      { path: "/subscription", element: <SubscriptionPage /> },
      { path: "/properties/:id", element: <PropertyDetailPage /> },
      { path: "/vehicles/:id", element: <VehicleDetailPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsOfServicePage /> },
      { path: "/refund-policy", element: <RefundPolicyPage /> },
    ],
  },

  /*
   * Authentication routes
   */
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  /*
   * Unified dashboard — ALL authenticated users
   */
  {
    path: "/dashboard",
    element: (
      <DashboardGate>
        <DashboardLayout />
      </DashboardGate>
    ),
    handle: { title: "Dashboard", sub: "Welcome back to your EasyDeal Hub" },
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      {
        path: "home",
        element: <DashboardHome />,
        handle: { title: "Dashboard", sub: "Welcome back to your EasyDeal Hub" },
      },
      {
        path: "premium",
        element: <PremiumDashboard />,
        handle: { title: "Premium Dashboard", sub: "Access premium features and insights" },
      },
      {
        path: "properties",
        element: <PropertiesPage />,
        handle: { title: "Properties", sub: "Browse all property listings" },
      },
      {
        path: "properties/:id",
        element: <PropertyDetailPage />,
        handle: { title: "Property Details", sub: "View property information" },
      },
      {
        path: "vehicles",
        element: <VehiclesPage />,
        handle: { title: "Vehicles", sub: "Browse all vehicle listings" },
      },
      {
        path: "vehicles/:id",
        element: <VehicleDetailPage />,
        handle: { title: "Vehicle Details", sub: "View vehicle information" },
      },
      {
        path: "my-listings",
        element: <MyListingsPage />,
        handle: { title: "My Listings", sub: "Manage your listings" },
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
        handle: { title: "My Bookings", sub: "Track all your bookings" },
      },
      {
        path: "add-property",
        element: <AddPropertyPage />,
        handle: { title: "Add Property", sub: "List a property for sale or rent" },
      },
      {
        path: "add-vehicle",
        element: <AddVehiclePage />,
        handle: { title: "Add Vehicle", sub: "List a vehicle for sale" },
      },
      {
        path: "profile",
        element: <ProfilePage />,
        handle: { title: "Profile", sub: "Manage your account" },
      },
      {
        path: "subscription",
        element: <SubscriptionStatusPage />,
        handle: { title: "Subscription", sub: "Manage your subscription" },
      },
      {
        path: "become-seller",
        element: <SellerRequest />,
        handle: { title: "Verified Seller", sub: "Apply for verified seller status" },
      },
      {
        path: "logout",
        element: <LogoutPage />,
        handle: { title: "Logout", sub: "Sign out from your account" },
      },
    ],
  },

  /*
   * Seller routes — dedicated seller panel
   */
  {
    path: "/seller",
    element: <SellerGate />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          {
            path: "overview",
            element: <SellerOverviewPage />,
            handle: { title: "Seller Overview", sub: "Seller analytics and performance" },
          },
          {
            path: "properties/add",
            element: <AddPropertyPage />,
            handle: { title: "Add Property", sub: "List a property for sale or rent" },
          },
          {
            path: "vehicles/add",
            element: <AddVehiclePage />,
            handle: { title: "Add Vehicle", sub: "List a vehicle for sale" },
          },
          {
            path: "listings",
            element: <SellerListingsPage />,
            handle: { title: "Seller Listings", sub: "Manage your seller listings" },
          },
          {
            path: "orders",
            element: <SellerOrdersPage />,
            handle: { title: "Seller Orders", sub: "Manage seller orders & bookings" },
          },
          {
            path: "reports",
            element: <SellerReportsPage />,
            handle: { title: "Seller Reports", sub: "Seller analytics and performance" },
          },
        ],
      },
    ],
  },

  /*
   * Backward compatibility redirects
   */
  {
    path: "/free-dashboard",
    element: <Navigate to="/dashboard/home" replace />,
  },
  {
    path: "/free-dashboard/*",
    element: <Navigate to="/dashboard/home" replace />,
  },

  /*
   * Admin routes — protected by AdminGate (admin role only)
   */
  {
    path: "/admin",
    element: <AdminGate />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: <AdminOverviewPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "approvals", element: <AdminApprovalsPage /> },
          { path: "properties/add", element: <AddPropertyPage /> },
          { path: "vehicles/add", element: <AddVehiclePage /> },
          { path: "listings", element: <AdminListingsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "seller-requests", element: <AdminSellerRequests /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
    ],
  },

  /*
   * Fallback route
   */
  { path: "*", element: <Navigate to="/" replace /> },
];

export default routes;
