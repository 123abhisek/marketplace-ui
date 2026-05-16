import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useAppState } from "../../hooks/useAppState";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

function StatCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              background: bg,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: "1.45rem", fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, mt: 0.3 }}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { properties = [], vehicles = [] } = useAppState();

  const totalUsers = 248;
  const premiumUsers = 61;
  const totalListings = properties.length + vehicles.length;
  const flaggedReports = 12;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Admin Overview
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Monitor users, listings, subscriptions, and moderation activity from one place.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Users"
              value={totalUsers}
              subtitle="Registered members"
              icon={<PeopleAltRoundedIcon />}
              color="#2563eb"
              bg="rgba(37,99,235,0.10)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Listings"
              value={totalListings}
              subtitle="Properties + vehicles"
              icon={<TrendingUpRoundedIcon />}
              color="#0f766e"
              bg="rgba(15,118,110,0.10)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Premium Users"
              value={premiumUsers}
              subtitle="Active premium accounts"
              icon={<WorkspacePremiumRoundedIcon />}
              color="#7c3aed"
              bg="rgba(124,58,237,0.10)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Open Reports"
              value={flaggedReports}
              subtitle="Needs review"
              icon={<NotificationsActiveRoundedIcon />}
              color="#ea580c"
              bg="rgba(234,88,12,0.10)"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={7}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: 2.8 }}>
                <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a", mb: 2 }}>
                  Listing Snapshot
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    {
                      label: "Property listings",
                      value: properties.length,
                      icon: <HomeWorkRoundedIcon sx={{ fontSize: 18 }} />,
                      color: "#0f766e",
                      bg: "rgba(15,118,110,0.10)",
                    },
                    {
                      label: "Vehicle listings",
                      value: vehicles.length,
                      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />,
                      color: "#2563eb",
                      bg: "rgba(37,99,235,0.10)",
                    },
                    {
                      label: "Premium conversions",
                      value: "24.6%",
                      icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />,
                      color: "#7c3aed",
                      bg: "rgba(124,58,237,0.10)",
                    },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        border: "1px solid rgba(15,23,42,0.08)",
                        background: "#fff",
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1.3} alignItems="center">
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "12px",
                              background: item.bg,
                              color: item.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                            {item.label}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a" }}>
                          {item.value}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={cardSx}>
              <CardContent sx={{ p: 2.8 }}>
                <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a", mb: 2 }}>
                  Recent Admin Activity
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    "12 new users signed up today",
                    "5 listings are pending moderation",
                    "2 premium upgrades completed today",
                    "3 reports were resolved by the moderation team",
                  ].map((text, i) => (
                    <Box key={i}>
                      <Typography sx={{ fontSize: "0.86rem", color: "#334155", fontWeight: 600 }}>
                        {text}
                      </Typography>
                      {i < 3 && <Divider sx={{ mt: 1.5, borderColor: "rgba(15,23,42,0.08)" }} />}
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap" }}>
                  <Chip label="Stable platform" sx={{ fontWeight: 700, background: "rgba(15,118,110,0.10)", color: "#0f766e" }} />
                  <Chip label="Low abuse risk" sx={{ fontWeight: 700, background: "rgba(37,99,235,0.10)", color: "#2563eb" }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}