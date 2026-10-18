// src/dashboard/DashboardHome.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";
import { isUserPremium } from "../utils/permissions";

// ── Weekly bar chart (Ref 4 — Knowledge dashboard) ────────────────────────────
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVITY = [3, 7, 4, 9, 6, 5, 8];
const todayIdx = (() => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
})();

function ActivityChart() {
  const max = Math.max(...ACTIVITY);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: { xs: 0.5, sm: 1 },
        height: 100,
        mt: 2.5,
      }}
    >
      {ACTIVITY.map((v, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: `${Math.max((v / max) * 80, 10)}px`,
              background:
                i === todayIdx
                  ? "linear-gradient(180deg, #4361EE 0%, #7C3AED 100%)"
                  : "rgba(67, 97, 238, 0.12)",
              borderRadius: "8px 8px 4px 4px",
              transition: "height 0.4s ease, background 0.2s",
              cursor: "pointer",
              "&:hover": {
                background: "linear-gradient(180deg, #4361EE 0%, #7C3AED 100%)",
                opacity: 0.85,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: i === todayIdx ? 700 : 400,
              color: i === todayIdx ? "#4361EE" : "#CBD5E1",
              letterSpacing: "-0.01em",
            }}
          >
            {WEEK_LABELS[i]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Stat card (Ref 1 — smmplanner top metrics) ────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  iconColor,
  iconBg,
  trend,
  trendPositive = true,
}) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 36px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1.5}
        >
          {/* Icon box */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          {/* Trend badge */}
          {trend && (
            <Chip
              icon={
                <TrendingUpRoundedIcon
                  sx={{
                    fontSize: "13px !important",
                    color: `${trendPositive ? "#10B981" : "#EF4444"} !important`,
                  }}
                />
              }
              label={trend}
              size="small"
              sx={{
                height: 24,
                background: trendPositive ? "#ECFDF5" : "#FEF2F2",
                color: trendPositive ? "#10B981" : "#EF4444",
                fontWeight: 700,
                fontSize: "0.7rem",
                border: "none",
              }}
            />
          )}
        </Stack>

        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            color: "#1E293B",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            mb: 0.75,
            fontSize: { xs: "1.75rem", sm: "2rem" },
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 500 }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

// ── Compact listing row (Ref 1 — table rows with avatars) ─────────────────────
function ListingRow({ item, type, locked, last }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.5,
          px: 1.5,
          borderRadius: "14px",
          transition: "background 0.15s",
          cursor: "pointer",
          "&:hover": { background: "#F8FAFC" },
        }}
      >
        {/* Type icon */}
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            background: type === "property" ? "#EEF2FF" : "#F5F3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {type === "property" ? (
            <ApartmentRoundedIcon sx={{ fontSize: 20, color: "#4361EE" }} />
          ) : (
            <DirectionsCarRoundedIcon sx={{ fontSize: 20, color: "#7C3AED" }} />
          )}
        </Box>

        {/* Title + location */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#1E293B",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
            }}
          >
            {item.title}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", mt: 0.25 }}>
            {item.location}
          </Typography>
        </Box>

        {/* Price + type chip */}
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "#4361EE",
              filter: locked ? "blur(5px)" : "none",
              userSelect: locked ? "none" : "auto",
              lineHeight: 1.2,
            }}
          >
            {formatCurrency(item.expectedPrice)}
          </Typography>
          <Chip
            label={
              type === "property"
                ? item.propertyType || "Property"
                : item.brand || "Vehicle"
            }
            size="small"
            sx={{
              height: 20,
              fontSize: "0.62rem",
              fontWeight: 700,
              mt: 0.25,
              background: type === "property" ? "#EEF2FF" : "#F5F3FF",
              color: type === "property" ? "#4361EE" : "#7C3AED",
              border: "none",
            }}
          />
        </Box>
      </Box>
      {!last && <Divider sx={{ mx: 1.5, opacity: 0.6 }} />}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user, properties = [], vehicles = [] } = useAppState();
  const isPremium = isUserPremium(user);

  const myProperties = properties.filter((p) => p.ownerId === user?.id);
  const myVehicles = vehicles.filter((v) => v.ownerId === user?.id);

  const recentListings = [
    ...properties.slice(0, 3).map((p) => ({ ...p, _type: "property" })),
    ...vehicles.slice(0, 2).map((v) => ({ ...v, _type: "vehicle" })),
  ].slice(0, 5);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const premiumFeatures = [
    "View full owner phone numbers & direct WhatsApp",
    "Browse high-resolution photo galleries & virtual tours",
    "Book on-site property visits & vehicle test drives",
    "Direct on-ground verified agent assistance",
  ];

  return (
    <Stack spacing={3}>
      {/* ── Page Header ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-end" }}
        gap={1}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ color: "#1E293B", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Good{" "}
            {(() => {
              const hour = new Date().getHours();

              if (hour >= 5 && hour < 12) return "morning";
              if (hour >= 12 && hour < 17) return "afternoon";
              if (hour >= 17 && hour < 21) return "evening";
              return "night";
            })()}
            , {user.name?.split(" ")[0]} 👋
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "0.875rem", mt: 0.5 }}>
            {todayStr}
          </Typography>
        </Box>
        {!isPremium && (
          <Button
            component={RouterLink}
            to="/subscription"
            variant="contained"
            size="small"
            startIcon={<WorkspacePremiumRoundedIcon sx={{ color: "#F59E0B !important" }} />}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "0.8rem",
              boxShadow: "0 4px 16px rgba(15,23,42,0.2)",
              whiteSpace: "nowrap",
              py: 1,
              px: 2,
              alignSelf: { xs: "flex-start", sm: "auto" },
              "&:hover": { background: "#0F172A", transform: "translateY(-1px)" },
            }}
          >
            Upgrade to Premium — ₹299
          </Button>
        )}
      </Stack>

      {/* ── Tailored Experience Banner (Free vs Premium) ── */}
      {!isPremium ? (
        <Card
          sx={{
            borderRadius: "22px",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F766E 100%)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(15,23,42,0.18)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, position: "relative", zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: "16px !important", color: "#F59E0B !important" }} />}
                      label="FREE PLAN ACTIVE"
                      size="small"
                      sx={{
                        bgcolor: "rgba(245,158,11,0.18)",
                        color: "#FCD34D",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        border: "1px solid rgba(245,158,11,0.35)",
                      }}
                    />
                    <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 600 }}>
                      Limited Mode (Owner contact & photos hidden)
                    </Typography>
                  </Stack>

                  <Typography variant="h5" fontWeight={900} sx={{ color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
                    Unlock Seller Phone Numbers, HD Photos & Direct Site Visits
                  </Typography>

                  <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", maxWidth: 640 }}>
                    As a free member, you can browse listings by city. Upgrade to EasyDeal Premium to contact owners directly on WhatsApp/Phone, see full address landmarks, and schedule on-site visits.
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2.5 }} sx={{ pt: 0.5 }}>
                    {[
                      "Direct WhatsApp & Phone Numbers",
                      "Full HD Photos & Gallery",
                      "Book On-Site Visits & Test Drives",
                    ].map((feat) => (
                      <Stack key={feat} direction="row" spacing={0.8} alignItems="center">
                        <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#10B981" }} />
                        <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                          {feat}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: "left", md: "right" } }}>
                <Stack spacing={1.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase" }}>
                      Special Member Offer
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ color: "#FCD34D", letterSpacing: "-0.03em" }}>
                      ₹299
                      <Typography component="span" sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, ml: 0.5 }}>
                        / month
                      </Typography>
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/subscription"
                    variant="contained"
                    size="medium"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                      color: "#fff",
                      borderRadius: "12px",
                      fontWeight: 900,
                      fontSize: "0.88rem",
                      px: 3,
                      py: 1.2,
                      boxShadow: "0 6px 20px rgba(245,158,11,0.4)",
                      "&:hover": { background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)" },
                    }}
                  >
                    Upgrade to Premium
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            borderRadius: "22px",
            background: "linear-gradient(135deg, #0F766E 0%, #0D9488 50%, #115E59 100%)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(15,118,110,0.22)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: "relative", zIndex: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#FCD34D",
                    flexShrink: 0,
                  }}
                >
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={900} sx={{ color: "#fff", letterSpacing: "-0.02em" }}>
                      ⭐ Premium Account Active
                    </Typography>
                    <Chip
                      label="UNLIMITED ACCESS"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.68rem",
                        height: 20,
                      }}
                    />
                  </Stack>
                  <Typography sx={{ color: "rgba(255,255,255,0.88)", fontSize: "0.82rem", mt: 0.3 }}>
                    All owner phone numbers, high-resolution galleries, full addresses, and direct site visit bookings are active.
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={RouterLink}
                to="/dashboard/properties"
                variant="contained"
                size="small"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  background: "#fff",
                  color: "#0F766E",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  px: 2.5,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": { background: "#F0FDFA" },
                  whiteSpace: "nowrap",
                  alignSelf: { xs: "flex-start", sm: "center" },
                }}
              >
                Browse Listings
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ── Stat Cards ── */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Properties"
            value={properties.length}
            icon={<ApartmentRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#4361EE"
            iconBg="#EEF2FF"
            trend="+12%"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Vehicles"
            value={vehicles.length}
            icon={<DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#7C3AED"
            iconBg="#F5F3FF"
            trend="+8%"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            label="My Listings"
            value={myProperties.length + myVehicles.length}
            icon={<ListAltRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor="#10B981"
            iconBg="#ECFDF5"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
          <StatCard
            label={isPremium ? "Premium Membership" : "Current Plan"}
            value={isPremium ? "PRO ⭐" : "FREE"}
            icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />}
            iconColor={isPremium ? "#F59E0B" : "#64748B"}
            iconBg={isPremium ? "#FFFBEB" : "#F8FAFC"}
            trend={isPremium ? "ACTIVE" : "UPGRADE"}
            trendPositive={isPremium}
          />
        </Grid>
      </Grid>

      {/* ── Middle Row: Activity Chart + Subscription Card ── */}
      <Grid container spacing={2.5}>
        {/* Activity Chart (Ref 4 — Knowledge bar chart) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{ color: "#1E293B", letterSpacing: "-0.02em" }}
                  >
                    Weekly Activity
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#94A3B8", mt: 0.25 }}
                  >
                    Listing interactions this week
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4361EE, #7C3AED)",
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    Views
                  </Typography>
                </Stack>
              </Stack>
              <ActivityChart />

              {/* Summary row */}
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  mt: 2.5,
                  pt: 2,
                  borderTop: "1px solid rgba(226,232,240,0.7)",
                }}
              >
                {[
                  {
                    label: "Total Views",
                    value: ACTIVITY.reduce((a, b) => a + b, 0),
                  },
                  {
                    label: "Peak Day",
                    value: WEEK_LABELS[ACTIVITY.indexOf(Math.max(...ACTIVITY))],
                  },
                  { label: "Today", value: ACTIVITY[todayIdx] },
                ].map((s) => (
                  <Box key={s.label}>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "#1E293B",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              borderRadius: "20px",
              height: "100%",
              background: isPremium
                ? "linear-gradient(145deg, #0F766E 0%, #115E59 60%, #042F2E 100%)"
                : "#ffffff",
              boxShadow: isPremium
                ? "0 12px 40px rgba(15,118,110,0.3)"
                : "0 2px 20px rgba(15,23,42,0.07)",
              color: isPremium ? "#fff" : "inherit",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            {isPremium && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    left: -20,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              </>
            )}

            <CardContent
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "14px",
                  background: isPremium
                    ? "rgba(255,255,255,0.18)"
                    : "#FFFBEB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  backdropFilter: "blur(8px)",
                }}
              >
                <WorkspacePremiumRoundedIcon
                  sx={{
                    fontSize: 26,
                    color: isPremium ? "#FCD34D" : "#F59E0B",
                  }}
                />
              </Box>

              <Typography
                fontWeight={900}
                sx={{
                  fontSize: "1.15rem",
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                  color: isPremium ? "#fff" : "#1E293B",
                }}
              >
                {isPremium ? "⭐ Premium Active" : "Upgrade to Premium"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.82rem",
                  opacity: isPremium ? 0.85 : undefined,
                  color: isPremium ? "#fff" : "#64748B",
                  mb: 2.5,
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                {isPremium
                  ? "You have full, unrestricted access to all marketplace features."
                  : "Get full listing details, direct owner contacts, and HD photos."}
              </Typography>

              {/* Features list */}
              <Stack spacing={1} sx={{ mb: 2.5 }}>
                {premiumFeatures.map((f) => (
                  <Stack
                    key={f}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    {isPremium ? (
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 16, color: "#34D399" }}
                      />
                    ) : (
                      <LockRoundedIcon
                        sx={{ fontSize: 14, color: "#CBD5E1" }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: isPremium
                          ? "rgba(255,255,255,0.9)"
                          : "#64748B",
                        fontWeight: isPremium ? 600 : 400,
                      }}
                    >
                      {f}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {!isPremium ? (
                <Button
                  component={RouterLink}
                  to="/subscription"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
                    borderRadius: "12px",
                    fontWeight: 800,
                    py: 1.25,
                    boxShadow: "0 4px 20px rgba(15,118,110,0.3)",
                    "&:hover": { boxShadow: "0 6px 28px rgba(15,118,110,0.4)" },
                  }}
                >
                  Upgrade — ₹299
                </Button>
              ) : (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.95)",
                      fontWeight: 800,
                    }}
                  >
                    All marketplace features unlocked ✨
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Recent Listings ── */}
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography
                fontWeight={800}
                sx={{ color: "#1E293B", letterSpacing: "-0.02em" }}
              >
                Recent Listings
              </Typography>
              <Typography
                sx={{ fontSize: "0.78rem", color: "#94A3B8", mt: 0.25 }}
              >
                {isPremium
                  ? "Full details unlocked for all listings"
                  : "Photos & owner phone numbers unlocked with Premium Plan"}
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/dashboard/properties"
              size="small"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontWeight: 700,
                color: "#0F766E",
                fontSize: "0.8rem",
                minWidth: "auto",
              }}
            >
              View all
            </Button>
          </Stack>

          {recentListings.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  background: "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <ListAltRoundedIcon sx={{ fontSize: 28, color: "#CBD5E1" }} />
              </Box>
              <Typography fontWeight={700} sx={{ color: "#1E293B" }}>
                No listings yet
              </Typography>
              <Typography
                sx={{ fontSize: "0.82rem", color: "#94A3B8", mt: 0.5 }}
              >
                Add your property and vehicle listings to start receiving inquiries.
              </Typography>
            </Box>
          ) : (
            <Stack>
              {recentListings.map((item, i) => (
                <ListingRow
                  key={item.id}
                  item={item}
                  type={item._type}
                  locked={!isPremium}
                  last={i === recentListings.length - 1}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
