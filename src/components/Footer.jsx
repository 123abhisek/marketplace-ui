// src/components/Footer.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

// ─── Data ─────────────────────────────────────────────────────────────────────

const LINKS = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/dashboard/properties" },
    { label: "Vehicles", href: "/dashboard/vehicles" },
    { label: "Pricing", href: "/subscription" },
    { label: "How it works", href: "/#how-it-works" },
  ],
  Account: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Listings", href: "/dashboard/my-listings" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
  Support: [
    { label: "Help Centre", href: "#" },
    { label: "Report a listing", href: "#" },
    { label: "Refund policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Privacy policy", href: "#" },
  ],
};

const SOCIALS = [
  {
    icon: <FacebookRoundedIcon sx={{ fontSize: 18 }} />,
    href: "#",
    label: "Facebook",
  },
  {
    icon: <InstagramIcon sx={{ fontSize: 18 }} />,
    href: "#",
    label: "Instagram",
  },
  {
    icon: <TwitterIcon sx={{ fontSize: 18 }} />,
    href: "#",
    label: "Twitter / X",
  },
  {
    icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
    href: "#",
    label: "LinkedIn",
  },
  { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, href: "#", label: "YouTube" },
];

const CONTACT = [
  {
    icon: <EmailRoundedIcon sx={{ fontSize: 14 }} />,
    text: "support@easydeal.com",
  },
  { icon: <PhoneRoundedIcon sx={{ fontSize: 14 }} />, text: "+91 98765 43210" },
  {
    icon: <PlaceRoundedIcon sx={{ fontSize: 14 }} />,
    text: "Bengaluru, Karnataka, IN",
  },
];

// ─── Reusable link component ───────────────────────────────────────────────────

function FooterLink({ label, href }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto");
  const sx = {
    fontSize: "0.855rem",
    color: "rgba(255,255,255,0.56)",
    fontWeight: 500,
    textDecoration: "none",
    lineHeight: 1,
    transition: "color .15s ease",
    "&:hover": { color: "#fff" },
  };
  return isExternal ? (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={sx}
    >
      {label}
    </Box>
  ) : (
    <Box component={RouterLink} to={href} sx={sx}>
      {label}
    </Box>
  );
}

// ─── Pre-footer CTA strip ──────────────────────────────────────────────────────

function PreFooterCTA() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg,#0f766e 0%,#0e5a6a 50%,#1e1b4b 100%)",
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      {[
        { top: -60, right: 80, size: 220, opacity: 0.09 },
        { bottom: -40, left: -40, size: 200, opacity: 0.07 },
        { top: "20%", right: "22%", size: 120, opacity: 0.06 },
      ].map((b, i) => (
        <Box
          key={i}
          aria-hidden
          sx={{
            position: "absolute",
            width: b.size,
            height: b.size,
            top: b.top ?? "auto",
            bottom: b.bottom ?? "auto",
            left: b.left ?? "auto",
            right: b.right ?? "auto",
            borderRadius: "50%",
            background: `rgba(255,255,255,${b.opacity})`,
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left copy */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WorkspacePremiumRoundedIcon
                  sx={{ color: "rgba(255,255,255,0.80)", fontSize: 20 }}
                />
                <Chip
                  label="Premium Plan — ₹299"
                  size="small"
                  sx={{
                    height: 26,
                    borderRadius: "999px",
                    fontWeight: 800,
                    fontSize: "0.70rem",
                    background: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                />
              </Stack>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.65rem", md: "2rem" },
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.035em",
                }}
              >
                Unlock the full marketplace
                <br />
                experience today
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "0.89rem",
                  lineHeight: 1.7,
                  maxWidth: 420,
                }}
              >
                Free users see images only. Premium members view prices, contact
                details, and can post their own property and vehicle listings.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ pt: 0.5 }}
              >
                <Button
                  component={RouterLink}
                  to="/subscription"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    borderRadius: "999px",
                    px: 2.8,
                    py: 1.2,
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    background: "#fff",
                    color: "#0f766e",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.92)",
                      boxShadow: "0 14px 36px rgba(0,0,0,0.22)",
                    },
                  }}
                >
                  Get Premium — ₹299
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  sx={{
                    borderRadius: "999px",
                    px: 2.5,
                    py: 1.1,
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    borderColor: "rgba(255,255,255,0.32)",
                    color: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                      background: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Register free
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Right newsletter */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 3, sm: "28px 32px" },
                borderRadius: "24px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#fff",
                  mb: 0.6,
                }}
              >
                Get listing alerts by email
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.60)",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                Subscribe to receive curated property and vehicle updates in
                your city.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <TextField
                  fullWidth
                  placeholder="your@email.com"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon
                          sx={{ fontSize: 16, color: "rgba(255,255,255,0.45)" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "13px",
                      background: "rgba(255,255,255,0.10)",
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.36)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(255,255,255,0.55)",
                      },
                      "& input::placeholder": {
                        color: "rgba(255,255,255,0.38)",
                      },
                    },
                  }}
                />
                <Button
                  endIcon={
                    <SendRoundedIcon sx={{ fontSize: "15px !important" }} />
                  }
                  sx={{
                    flexShrink: 0,
                    borderRadius: "13px",
                    px: 2.2,
                    py: 1,
                    fontWeight: 800,
                    fontSize: "0.83rem",
                    background: "#fff",
                    color: "#0f766e",
                    whiteSpace: "nowrap",
                    "&:hover": { background: "rgba(255,255,255,0.90)" },
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
              <Typography
                sx={{
                  fontSize: "0.69rem",
                  color: "rgba(255,255,255,0.38)",
                  mt: 1.2,
                }}
              >
                No spam. Unsubscribe anytime.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Main footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <>
      <PreFooterCTA />

      <Box
        component="footer"
        sx={{
          background: "#0a0f1e",
          color: "#fff",
        }}
      >
        <Container maxWidth="xl" sx={{ pt: { xs: 7, md: 10 }, pb: 0 }}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            {/* ── Brand column ───────────────────────────────────── */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2.5}>
                {/* Logo */}
                {/* <Stack direction="row" spacing={1.4} alignItems="center">
                  <Box sx={{
                    width: 42, height: 42, borderRadius: '14px',
                    background: 'linear-gradient(135deg,#0f766e,#0e8e7f)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <HomeWorkRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#fff', lineHeight: 1.1 }}>
                      Easydeal
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.40)', fontWeight: 500 }}>
                      Premium Marketplace
                    </Typography>
                  </Box>
                </Stack> */}

                {/* Logo */}
                <Stack direction="row" alignItems="center">
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Easydeal Logo"
                    sx={{
                      height: 65, // adjust as needed
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    fontSize: "0.86rem",
                    color: "rgba(255,255,255,0.52)",
                    lineHeight: 1.78,
                    maxWidth: 320,
                  }}
                >
                  India's subscription-based marketplace for verified property
                  and vehicle listings. Premium members unlock prices, contacts,
                  and posting access for just ₹299.
                </Typography>

                {/* Contact details */}
                <Stack spacing={1.3}>
                  {CONTACT.map((c) => (
                    <Stack
                      key={c.text}
                      direction="row"
                      spacing={1.1}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          color: "#0f766e",
                          display: "flex",
                          flexShrink: 0,
                        }}
                      >
                        {c.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.52)",
                          fontWeight: 500,
                        }}
                      >
                        {c.text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* Social icons */}
                <Stack direction="row" spacing={0.8}>
                  {SOCIALS.map((s) => (
                    <IconButton
                      key={s.label}
                      component="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      size="small"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "11px",
                        color: "rgba(255,255,255,0.50)",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        transition: "all .17s ease",
                        "&:hover": {
                          color: "#fff",
                          background: "#0f766e",
                          border: "1px solid #0f766e",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {s.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* ── Link columns ───────────────────────────────────── */}
            {Object.entries(LINKS).map(([heading, items]) => (
              <Grid item xs={6} sm={4} md={2} key={heading}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.80rem",
                    color: "#fff",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    mb: 2,
                  }}
                >
                  {heading}
                </Typography>
                <Stack spacing={1.5}>
                  {items.map((item) => (
                    <FooterLink
                      key={item.label}
                      label={item.label}
                      href={item.href}
                    />
                  ))}
                </Stack>
              </Grid>
            ))}

            {/* ── App badge column ────────────────────────────────── */}
            <Grid item xs={12} sm={4} md={2}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "0.80rem",
                  color: "#fff",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Discover
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: "Residential", href: "#" },
                  { label: "Commercial", href: "#" },
                  { label: "Agricultural", href: "#" },
                  { label: "Cars", href: "#" },
                  { label: "Bikes", href: "#" },
                ].map((item) => (
                  <FooterLink
                    key={item.label}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* ── Bottom bar ──────────────────────────────────────── */}
          <Divider
            sx={{
              borderColor: "rgba(255,255,255,0.07)",
              mt: { xs: 7, md: 10 },
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ py: 3 }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.36)",
                fontWeight: 500,
              }}
            >
              © 2026 TeamCA Solutions Pvt. Ltd. All rights reserved.
            </Typography>

            <Stack direction="row" spacing={2.5} flexWrap="wrap">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Sitemap",
              ].map((label) => (
                <Box
                  key={label}
                  component="a"
                  href="#"
                  sx={{
                    fontSize: "0.76rem",
                    color: "rgba(255,255,255,0.36)",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "color .15s ease",
                    "&:hover": { color: "rgba(255,255,255,0.75)" },
                  }}
                >
                  {label}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
