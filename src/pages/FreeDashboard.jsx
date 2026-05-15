
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import { useAppState } from "../hooks/useAppState";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const COLORS = {
  pageBg: "#f5f7fb",
  shell: "#eef2f7",
  surface: "#ffffff",
  surfaceSoft: "#f8fafc",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.12)",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primarySoft: "rgba(15,118,110,0.08)",
  premium: "#5b4cf0",
  premiumSoft: "rgba(91,76,240,0.08)",
  premiumBorder: "rgba(91,76,240,0.18)",
  shadow: "0 10px 30px rgba(15,23,42,0.06)",
  shadowSoft: "0 2px 10px rgba(15,23,42,0.04)",
};

const shellCardSx = {
  borderRadius: "28px",
  background: "rgba(255,255,255,0.72)",
  border: `1px solid ${COLORS.border}`,
  boxShadow: "0 20px 60px rgba(15,23,42,0.06)",
  backdropFilter: "blur(8px)",
};

const cardSx = {
  borderRadius: "22px",
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  boxShadow: COLORS.shadowSoft,
};

const sectionTitleSx = {
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: COLORS.faint,
};

const premiumBtnSx = {
  minHeight: 50,
  px: 2.2,
  borderRadius: "16px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.95rem",
  color: "#fff",
  backgroundColor: COLORS.premium,
  boxShadow: "0 12px 24px rgba(91,76,240,0.22)",
  "&:hover": {
    backgroundColor: "#4c3fe0",
    boxShadow: "0 16px 28px rgba(91,76,240,0.28)",
  },
};

const PREMIUM_PERKS = [
  "Unlimited property listings",
  "Unlimited vehicle listings",
  "Priority search placement",
  "Direct buyer and seller contact",
  "Verified premium seller badge",
];

function LockedCard({ icon, title, desc }) {
  return (
    <Card sx={{ ...cardSx, position: "relative", overflow: "hidden", height: "100%" }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.1, opacity: 0.45 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "14px",
              background: COLORS.surfaceSoft,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.faint,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: "0.96rem", color: COLORS.text }}>
            {title}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: "0.84rem",
            lineHeight: 1.7,
            color: COLORS.muted,
            opacity: 0.58,
            pr: 3,
          }}
        >
          {desc}
        </Typography>
      </CardContent>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(3px)",
          background: "rgba(255,255,255,0.64)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Chip
          icon={<LockRoundedIcon sx={{ fontSize: "15px !important", color: COLORS.premium }} />}
          label="Premium only"
          sx={{
            height: 34,
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "0.75rem",
            color: COLORS.premium,
            background: "#fff",
            border: `1px solid ${COLORS.premiumBorder}`,
            boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
            "& .MuiChip-label": { px: 1.1 },
          }}
        />
      </Box>
    </Card>
  );
}

function DetailRow({ label, value, action, premium }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.4,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <Typography sx={{ fontSize: "0.84rem", color: COLORS.muted, fontWeight: 600 }}>
        {label}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1.1} sx={{ minWidth: 0 }}>
        {premium && (
          <Chip
            size="small"
            label="Premium"
            sx={{
              height: 22,
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "0.66rem",
              color: COLORS.premium,
              background: COLORS.premiumSoft,
              border: `1px solid ${COLORS.premiumBorder}`,
            }}
          />
        )}
        <Typography
          sx={{
            fontSize: "0.84rem",
            color: COLORS.text,
            fontWeight: 700,
            textAlign: "right",
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
        {action ? (
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: COLORS.primary,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {action}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}

export default function FreeDashboard() {
  const { user, logout, upgradePremium, properties = [], vehicles = [] } = useAppState();
  const navigate = useNavigate();

  const initials =
    user?.name
      ?.trim()
      ?.split(" ")
      ?.filter(Boolean)
      ?.slice(0, 2)
      ?.map((part) => part[0]?.toUpperCase())
      ?.join("") || "U";

  return (
    <Box sx={{ minHeight: "100vh", background: COLORS.pageBg, py: { xs: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Box sx={{ ...shellCardSx, p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <Box
            sx={{
              ...cardSx,
              borderRadius: "22px",
              px: { xs: 1.5, sm: 2.2 },
              py: 1.2,
              mb: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                <Box
                  component={RouterLink}
                  to="/"
                  sx={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                >
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Easydeal Logo"
                    sx={{ height: { xs: 34, sm: 38 }, width: "auto", objectFit: "contain" }}
                  />
                </Box>

                <Chip
                  label="Free user"
                  size="small"
                  sx={{
                    height: 26,
                    borderRadius: "999px",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    color: COLORS.muted,
                    background: COLORS.surfaceSoft,
                    border: `1px solid ${COLORS.border}`,
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  onClick={upgradePremium}
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    minHeight: 40,
                    px: 1.8,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.84rem",
                    color: COLORS.text,
                    background: COLORS.surfaceSoft,
                    border: `1px solid ${COLORS.border}`,
                    "&:hover": { background: "#f1f5f9" },
                  }}
                  startIcon={<DiamondRoundedIcon sx={{ fontSize: 17 }} />}
                >
                  Upgrade
                </Button>

                <Avatar
                  src={user?.photo || undefined}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: COLORS.premium,
                    fontWeight: 800,
                    fontSize: "0.9rem",
                  }}
                >
                  {initials}
                </Avatar>

                <Button
                  onClick={logout}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    p: 0,
                    borderRadius: "12px",
                    color: COLORS.muted,
                    background: COLORS.surfaceSoft,
                    border: `1px solid ${COLORS.border}`,
                    "&:hover": { background: "#f8fafc", color: COLORS.text },
                  }}
                >
                  <LogoutRoundedIcon sx={{ fontSize: 18 }} />
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Grid container spacing={2.2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ ...cardSx, overflow: "hidden", height: "100%" }}>
                <Box
                  sx={{
                    height: { xs: 140, sm: 156 },
                    background: "linear-gradient(135deg, #16c2a3 0%, #4f7cff 100%)",
                  }}
                />

                <CardContent
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    pb: 2.5,
                    pt: 0,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row", md: "column" }}
                    spacing={{ xs: 1.6, sm: 1.8, md: 1.6 }}
                    alignItems={{ xs: "flex-start", sm: "flex-end", md: "flex-start" }}
                    sx={{
                      mt: { xs: -4.5, sm: -5.5 },
                    }}
                  >
                    <Avatar
                      src={user?.photo || undefined}
                      sx={{
                        width: { xs: 88, sm: 94 },
                        height: { xs: 88, sm: 94 },
                        border: "4px solid #fff",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
                        bgcolor: COLORS.surfaceSoft,
                        color: COLORS.text,
                        fontWeight: 900,
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </Avatar>

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        pt: { xs: 0, sm: 4.5, md: 0 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "1.75rem", sm: "1.6rem" },
                          lineHeight: 1.05,
                          letterSpacing: "-0.03em",
                          color: COLORS.text,
                          fontWeight: 900,
                          wordBreak: "break-word",
                        }}
                      >
                        {user?.name || "Explorer User"}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: "0.98rem",
                          lineHeight: 1.65,
                          color: COLORS.muted,
                          maxWidth: 26,
                        }}
                      >
                        Browse listings, track your account, and unlock premium posting.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ mt: 2.2, rowGap: 1 }}
                  >
                    <Chip
                      label="Free User"
                      size="small"
                      sx={{
                        height: 28,
                        borderRadius: "999px",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        color: COLORS.muted,
                        background: COLORS.surfaceSoft,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    />
                    <Stack direction="row" spacing={0.6} alignItems="center">
                      <PlaceRoundedIcon sx={{ fontSize: 16, color: COLORS.faint }} />
                      <Typography sx={{ fontSize: "0.84rem", color: COLORS.muted, fontWeight: 600 }}>
                        Bengaluru, India
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    fullWidth
                    onClick={upgradePremium}
                    startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />}
                    sx={{ ...premiumBtnSx, mt: 2.5 }}
                  >
                    Upgrade Premium
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={2.2}>
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Typography sx={sectionTitleSx}>Account overview</Typography>

                    <Box sx={{ mt: 1.2 }}>
                      <DetailRow label="Member name" value={user?.name || "Easydeal user"} action="Edit" />
                      <DetailRow label="Email" value={user?.email || "Not added yet"} action="Edit" />
                      <DetailRow label="Plan type" value="Free access" action="Upgrade" />
                      <DetailRow label="Post property listings" value="Locked" premium />
                      <DetailRow label="Post vehicle listings" value="Locked" premium />
                      <Box sx={{ pt: 1.4 }}>
                        <Typography sx={{ fontSize: "0.78rem", color: COLORS.faint, fontWeight: 700 }}>
                          Free users can browse all listings. Upgrade to publish and get priority visibility.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Grid container spacing={2.2}>
                  {[
                    {
                      label: "Properties available",
                      value: properties.length,
                      icon: <HomeWorkRoundedIcon sx={{ fontSize: 20 }} />,
                      tone: COLORS.primary,
                      soft: COLORS.primarySoft,
                    },
                    {
                      label: "Vehicles available",
                      value: vehicles.length,
                      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />,
                      tone: "#2563eb",
                      soft: "rgba(37,99,235,0.08)",
                    },
                    {
                      label: "Listings you can post",
                      value: "0",
                      sub: "Upgrade required",
                      icon: <LockRoundedIcon sx={{ fontSize: 20 }} />,
                      tone: COLORS.premium,
                      soft: COLORS.premiumSoft,
                    },
                  ].map((item) => (
                    <Grid item xs={12} sm={4} key={item.label}>
                      <Card sx={{ ...cardSx, height: "100%" }}>
                        <CardContent sx={{ p: 2.2 }}>
                          <Stack spacing={1.4}>
                            <Box
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "14px",
                                background: item.soft,
                                color: item.tone,
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              {item.icon}
                            </Box>

                            <Typography
                              sx={{
                                fontSize: "1.7rem",
                                lineHeight: 1,
                                fontWeight: 900,
                                color: COLORS.text,
                              }}
                            >
                              {item.value}
                            </Typography>

                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "0.82rem",
                                  color: COLORS.muted,
                                  fontWeight: 700,
                                  lineHeight: 1.45,
                                }}
                              >
                                {item.label}
                              </Typography>
                              {item.sub ? (
                                <Typography
                                  sx={{
                                    fontSize: "0.72rem",
                                    color: item.tone,
                                    fontWeight: 800,
                                    mt: 0.55,
                                  }}
                                >
                                  {item.sub}
                                </Typography>
                              ) : null}
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <Typography sx={sectionTitleSx}>Browse marketplace</Typography>

                      <Chip
                        label="Open for free users"
                        size="small"
                        sx={{
                          height: 26,
                          borderRadius: "999px",
                          fontWeight: 800,
                          fontSize: "0.7rem",
                          color: COLORS.primary,
                          background: COLORS.primarySoft,
                          border: `1px solid rgba(15,118,110,0.16)`,
                        }}
                      />
                    </Stack>

                    <Grid container spacing={2}>
                      {[
                        {
                          label: "Property listings",
                          count: properties.length,
                          sub: "Flats, houses, plots and rentals",
                          path: "/properties",
                          tone: COLORS.primary,
                          soft: COLORS.primarySoft,
                          icon: <HomeWorkRoundedIcon sx={{ fontSize: 22 }} />,
                        },
                        {
                          label: "Vehicle listings",
                          count: vehicles.length,
                          sub: "Cars, bikes, trucks and more",
                          path: "/vehicles",
                          tone: "#2563eb",
                          soft: "rgba(37,99,235,0.08)",
                          icon: <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />,
                        },
                      ].map((item) => (
                        <Grid item xs={12} sm={6} key={item.label}>
                          <Box
                            onClick={() => navigate(item.path)}
                            sx={{
                              p: 2.1,
                              borderRadius: "18px",
                              border: `1px solid ${COLORS.border}`,
                              background: COLORS.surface,
                              cursor: "pointer",
                              transition: "all .18s ease",
                              "&:hover": {
                                borderColor: item.tone,
                                transform: "translateY(-2px)",
                                boxShadow: COLORS.shadow,
                              },
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                              <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
                                <Box
                                  sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: "14px",
                                    background: item.soft,
                                    color: item.tone,
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  {item.icon}
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      fontSize: "0.95rem",
                                      fontWeight: 800,
                                      color: COLORS.text,
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.78rem",
                                      color: COLORS.muted,
                                      lineHeight: 1.55,
                                    }}
                                  >
                                    {item.count} available · {item.sub}
                                  </Typography>
                                </Box>
                              </Stack>

                              <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: COLORS.faint, flexShrink: 0 }} />
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} sm={6}>
                    <LockedCard
                      icon={<HomeWorkRoundedIcon sx={{ fontSize: 18 }} />}
                      title="Post property listing"
                      desc="Publish your property directly to the marketplace and reach serious buyers faster."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LockedCard
                      icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
                      title="Post vehicle listing"
                      desc="Sell your car, bike, or commercial vehicle with premium seller visibility."
                    />
                  </Grid>
                </Grid>

                <Card
                  sx={{
                    ...cardSx,
                    background: "#fbfbff",
                    border: `1px solid ${COLORS.premiumBorder}`,
                    boxShadow: "0 12px 28px rgba(91,76,240,0.08)",
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.1, sm: 2.6 } }}>
                    <Grid container spacing={2.5} alignItems="center">
                      <Grid item xs={12} md={7}>
                        <Typography sx={sectionTitleSx}>Premium upgrade</Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: { xs: "1.3rem", sm: "1.5rem" },
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            fontWeight: 900,
                            color: COLORS.text,
                          }}
                        >
                          Unlock premium access for ₹299
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: "0.88rem",
                            lineHeight: 1.7,
                            color: COLORS.muted,
                            maxWidth: 58,
                          }}
                        >
                          A one-time upgrade that lets you post listings, get visibility, and connect directly with buyers and sellers.
                        </Typography>

                        <Stack spacing={1.1} sx={{ mt: 2 }}>
                          {PREMIUM_PERKS.map((perk) => (
                            <Stack key={perk} direction="row" spacing={1.2} alignItems="center">
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "999px",
                                  background: COLORS.premiumSoft,
                                  display: "grid",
                                  placeItems: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <CheckRoundedIcon sx={{ fontSize: 13, color: COLORS.premium }} />
                              </Box>
                              <Typography sx={{ fontSize: "0.83rem", color: COLORS.text, fontWeight: 700 }}>
                                {perk}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Box
                          sx={{
                            p: 2.2,
                            borderRadius: "20px",
                            background: "#fff",
                            border: `1px solid ${COLORS.premiumBorder}`,
                            boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.74rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: COLORS.premium,
                            }}
                          >
                            One-time unlock
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.8,
                              fontSize: "2.7rem",
                              lineHeight: 1,
                              letterSpacing: "-0.05em",
                              fontWeight: 900,
                              color: COLORS.text,
                            }}
                          >
                            ₹299
                          </Typography>

                          <Typography sx={{ mt: 0.8, fontSize: "0.82rem", color: COLORS.muted, lineHeight: 1.6 }}>
                            Premium posting and account upgrades activated instantly after payment.
                          </Typography>

                          <Button
                            fullWidth
                            onClick={upgradePremium}
                            startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{ ...premiumBtnSx, mt: 2.2 }}
                          >
                            Upgrade Premium
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}