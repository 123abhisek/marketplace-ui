import { useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  matchRoutes,
} from "react-router-dom";
import { useAppState } from "../hooks/useAppState";
import { routes } from "../router";

import { Stack, Box, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";

const navBaseClass =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all";
const navInactiveClass =
  "text-slate-700 hover:bg-slate-100 hover:text-slate-900";
const navActiveClass = "bg-primary text-white shadow-sm";
const sectionTitleClass =
  "px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400";

function SidebarLink({ to, icon: Icon, label, end = false, onClick, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${navBaseClass} ${isActive ? navActiveClass : navInactiveClass}`
      }
    >
      <Icon sx={{ fontSize: 18 }} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate, user }) {
  const isPremium = user?.isPremium || user?.role === "premium";

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ textDecoration: "none", flexShrink: 0 }}
        >
          <Box
            component="img"
            src="/icon.png"
            alt="EasyDeal"
            sx={{ height: 40, width: "auto", objectFit: "contain" }}
          />
        </Stack>
        <div>
          <p className="text-sm font-semibold text-slate-900">EasyDeal</p>
          <p className="text-xs text-slate-500">
            {isPremium ? "Premium Account" : "My Dashboard"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-6">
          {/* Overview */}
          <div className="space-y-2">
            <p className={sectionTitleClass}>Overview</p>
            <div className="space-y-1.5">
              <SidebarLink
                to="/dashboard/home"
                end
                icon={HomeRoundedIcon}
                label="Dashboard"
                onClick={onNavigate}
              />
              <SidebarLink
                to="/dashboard/my-listings"
                icon={GridViewRoundedIcon}
                label="My Listings"
                onClick={onNavigate}
              />
              <SidebarLink
                to="/dashboard/my-bookings"
                icon={CalendarMonthRoundedIcon}
                label="My Bookings"
                onClick={onNavigate}
              />
            </div>
          </div>

          {/* Add Listing */}
          <div className="space-y-2">
            <p className={sectionTitleClass}>Add Listing</p>
            <div className="space-y-1.5">
              <SidebarLink
                to="/dashboard/add-property"
                icon={ApartmentRoundedIcon}
                label="Add Property"
                onClick={onNavigate}
              />
              <SidebarLink
                to="/dashboard/add-vehicle"
                icon={DirectionsCarRoundedIcon}
                label="Add Vehicle"
                onClick={onNavigate}
              />
            </div>
          </div>

          {/* Browse */}
          <div className="space-y-2">
            <p className={sectionTitleClass}>Browse</p>
            <div className="space-y-1.5">
              <SidebarLink
                to="/dashboard/properties"
                icon={ApartmentRoundedIcon}
                label="Properties"
                onClick={onNavigate}
              />
              <SidebarLink
                to="/dashboard/vehicles"
                icon={DirectionsCarRoundedIcon}
                label="Vehicles"
                onClick={onNavigate}
              />
            </div>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <p className={sectionTitleClass}>Account</p>
            <div className="space-y-1.5">
              <SidebarLink
                to="/dashboard/profile"
                icon={PersonRoundedIcon}
                label="Profile"
                onClick={onNavigate}
              />
              <SidebarLink
                to="/dashboard/subscription"
                icon={CreditCardRoundedIcon}
                label="Subscription"
                onClick={onNavigate}
              />
              {/* <SidebarLink
                to="/dashboard/become-seller"
                icon={VerifiedUserRoundedIcon}
                label="Become Seller"
                onClick={onNavigate}
              /> */}
              <SidebarLink
                to="/dashboard/logout"
                icon={LogoutRoundedIcon}
                label="Logout"
                onClick={onNavigate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium CTA for free users */}
      {!isPremium && (
        <div className="border-t border-slate-200 p-4">
          <RouterLink to="/subscription" className="block no-underline">
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 hover:from-amber-100 hover:to-orange-100 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 16, color: "#b45309" }} />
                <p className="text-sm font-bold text-amber-800">Upgrade to Premium</p>
              </div>
              <p className="text-xs leading-5 text-amber-700">
                View full listing details, images & seller contacts.
              </p>
            </div>
          </RouterLink>
        </div>
      )}

      {isPremium && (
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 p-4">
            <div className="flex items-center gap-2">
              <WorkspacePremiumRoundedIcon sx={{ fontSize: 16, color: "#0f766e" }} />
              <p className="text-sm font-bold text-teal-800">Premium Active</p>
            </div>
            <p className="mt-1 text-xs leading-5 text-teal-600">
              Full access to all listings and seller contacts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageDetails = useMemo(() => {
    const matches = matchRoutes(routes, location.pathname) || [];
    const matchedWithHandle = [...matches]
      .reverse()
      .find((match) => match.route?.handle?.title || match.route?.handle?.sub);

    return matchedWithHandle?.route?.handle || { title: "Dashboard", sub: "" };
  }, [location.pathname]);

  const { title, sub } = pageDetails;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <SidebarContent onNavigate={closeSidebar} user={user} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={closeSidebar}
            />
            <aside className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl">
              <div className="flex items-center justify-end px-4 py-4">
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
                  aria-label="Close sidebar"
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
              <SidebarContent onNavigate={closeSidebar} user={user} />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
                    aria-label="Open sidebar"
                  >
                    <MenuRoundedIcon sx={{ fontSize: 20 }} />
                  </button>

                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      {title}
                    </h1>
                    {sub ? (
                      <p className="mt-1 text-sm text-slate-500">{sub}</p>
                    ) : null}
                  </div>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  <button
                    type="button"
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="Notifications"
                  >
                    <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />
                  </button>

                  <Link
                    to="/dashboard/profile"
                    className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                      <PersonRoundedIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-900">
                        My Account
                      </p>
                      <p className="text-xs text-slate-500">
                        {user?.isPremium || user?.role === "premium"
                          ? "Premium Plan"
                          : "Free Plan"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Quick actions in header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-xl">
                  <SearchRoundedIcon
                    sx={{ fontSize: 18 }}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search listings, bookings, or account details..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Add listing quick buttons — visible to ALL users */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/dashboard/add-property"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    + Property
                  </Link>
                  <Link
                    to="/dashboard/add-vehicle"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    + Vehicle
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
