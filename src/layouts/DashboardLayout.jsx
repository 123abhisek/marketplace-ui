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

import { Stack, Box, Chip, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { isUserPremium } from "../utils/permissions";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
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
  const isPremium = isUserPremium(user);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo & Account Status Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
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
            sx={{ height: 38, width: "auto", objectFit: "contain" }}
          />
        </Stack>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-slate-900">EasyDeal</p>
            {isPremium ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow-xs">
                ⭐ PRO
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-200">
                FREE
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-500 truncate">
            {isPremium ? "Premium Account" : "Standard Account"}
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
                badge={!isPremium ? "PRO" : null}
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
      {!isPremium ? (
        <div className="border-t border-slate-200 p-4">
          <RouterLink to="/subscription" className="block no-underline">
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/80 p-3.5 hover:border-amber-400 transition-all shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <WorkspacePremiumRoundedIcon sx={{ fontSize: 14 }} />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-amber-900">Unlock Premium</p>
                </div>
                <span className="text-[11px] font-black text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-full border border-amber-200">
                  ₹299
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium mb-2.5">
                Unlock seller phone numbers, HD photos & instant site visits.
              </p>
              <div className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold shadow-xs transition flex items-center justify-center gap-1">
                <span>Upgrade Now</span>
                <span>→</span>
              </div>
            </div>
          </RouterLink>
        </div>
      ) : (
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-500/5 border border-teal-300 p-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 14 }} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-wider text-teal-900">Premium Member</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-teal-800 font-medium">
              All owner contacts, HD photos & site visit bookings are unlocked.
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
            <div className="flex flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
                    aria-label="Open sidebar"
                  >
                    <MenuRoundedIcon sx={{ fontSize: 20 }} />
                  </button>

                  <div className="min-w-0">
                    <h1 className="truncate text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                      {title}
                    </h1>
                    {sub ? (
                      <Typography
                        sx={{
                          display: { xs: "none", sm: "block" },
                          mt: 0.5,
                          fontSize: "0.875rem",
                          color: "#64748B",
                        }}
                      >
                        {sub}
                      </Typography>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {!isUserPremium(user) && (
                    <Button
                      component={RouterLink}
                      to="/subscription"
                      size="small"
                      variant="contained"
                      startIcon={<WorkspacePremiumRoundedIcon sx={{ color: "#F59E0B !important", fontSize: "16px !important" }} />}
                      sx={{
                        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                        color: "#fff",
                        borderRadius: "10px",
                        fontWeight: 800,
                        fontSize: { xs: "0.74rem", sm: "0.8rem" },
                        px: { xs: 1.3, sm: 2 },
                        py: 0.8,
                        textTransform: "none",
                        boxShadow: "0 2px 10px rgba(15,23,42,0.15)",
                        "&:hover": { background: "#0F172A", transform: "translateY(-1px)" },
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Upgrade to </Box>Premium
                    </Button>
                  )}

                  <Box sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                    <button
                      type="button"
                      className="relative h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                      aria-label="Notifications"
                    >
                      <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                  </Box>

                  <Link
                    to="/dashboard/profile"
                    className={`inline-flex items-center gap-2 sm:gap-3 rounded-xl border ${
                      isUserPremium(user) ? "border-amber-300 bg-amber-50/40" : "border-slate-200 bg-white"
                    } px-2.5 py-1.5 sm:px-3 sm:py-2 transition hover:bg-slate-50`}
                  >
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${
                      isUserPremium(user) ? "bg-amber-500 text-white shadow-xs" : "bg-slate-200 text-slate-700"
                    }`}>
                      {isUserPremium(user) ? (
                        <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <PersonRoundedIcon sx={{ fontSize: 18 }} />
                      )}
                    </div>
                    <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {user?.name || "My Account"}
                      </p>
                      <p className={`text-xs font-bold leading-tight ${isUserPremium(user) ? "text-amber-700" : "text-slate-500"}`}>
                        {isUserPremium(user) ? "⭐ Premium Plan" : "Free Plan"}
                      </p>
                    </Box>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 pb-24 sm:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
