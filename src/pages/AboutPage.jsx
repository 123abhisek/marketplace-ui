// src/pages/AboutPage.jsx
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import RocketLaunchRoundedIcon      from "@mui/icons-material/RocketLaunchRounded";
import HandshakeRoundedIcon         from "@mui/icons-material/HandshakeRounded";
import VerifiedRoundedIcon          from "@mui/icons-material/VerifiedRounded";
import GroupsRoundedIcon            from "@mui/icons-material/GroupsRounded";
import EmojiObjectsRoundedIcon      from "@mui/icons-material/EmojiObjectsRounded";
import StarRoundedIcon              from "@mui/icons-material/StarRounded";
import ArrowForwardRoundedIcon      from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon       from "@mui/icons-material/CheckCircleRounded";
import HomeWorkRoundedIcon          from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon     from "@mui/icons-material/DirectionsCarRounded";
import SupportAgentRoundedIcon      from "@mui/icons-material/SupportAgentRounded";
import SecurityRoundedIcon          from "@mui/icons-material/SecurityRounded";

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.08)",
  border: "rgba(15,23,42,0.08)",
};

// ── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "12,000+", label: "Active Listings" },
  { value: "8,500+", label: "Happy Customers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4", label: "Years in Market" },
];

// ── Values ───────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: <RocketLaunchRoundedIcon />,
    title: "Fast & Simple",
    desc: "Post your property or vehicle in minutes. No paperwork, no delays — just a smooth, fast experience.",
    gradient: "linear-gradient(135deg, rgba(251,207,232,0.6) 0%, rgba(254,240,138,0.4) 100%)",
    iconBg: "rgba(251,207,232,0.9)",
    iconColor: "#be185d",
  },
  {
    icon: <HandshakeRoundedIcon />,
    title: "Trusted Platform",
    desc: "Every listing is reviewed. Every seller is verified. We ensure you deal with real people, every time.",
    gradient: "linear-gradient(135deg, rgba(186,230,253,0.6) 0%, rgba(196,181,253,0.4) 100%)",
    iconBg: "rgba(186,230,253,0.9)",
    iconColor: "#0369a1",
  },
  {
    icon: <EmojiObjectsRoundedIcon />,
    title: "Smart Matching",
    desc: "Our platform connects buyers and sellers intelligently — showing you what you actually want.",
    gradient: "linear-gradient(135deg, rgba(187,247,208,0.6) 0%, rgba(254,240,138,0.4) 100%)",
    iconBg: "rgba(187,247,208,0.9)",
    iconColor: "#166534",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "Secure Deals",
    desc: "Your data is protected with enterprise-grade security. Buy and sell with complete confidence.",
    gradient: "linear-gradient(135deg, rgba(254,215,170,0.6) 0%, rgba(251,207,232,0.4) 100%)",
    iconBg: "rgba(254,215,170,0.9)",
    iconColor: "#c2410c",
  },
];

// ── How it works ─────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Account",
    desc: "Sign up for free in under 60 seconds. No credit card needed to get started.",
    color: "rgba(254,202,202,0.7)",
    border: "rgba(239,68,68,0.15)",
  },
  {
    step: "02",
    title: "Choose a Plan",
    desc: "Upgrade to Premium to unlock the ability to post listings and contact sellers directly.",
    color: "rgba(186,230,253,0.7)",
    border: "rgba(14,165,233,0.15)",
  },
  {
    step: "03",
    title: "Post or Browse",
    desc: "List your property or vehicle with photos, details, and price — or browse thousands of verified listings.",
    color: "rgba(187,247,208,0.7)",
    border: "rgba(34,197,94,0.15)",
  },
  {
    step: "04",
    title: "Connect & Close",
    desc: "Get contacted directly by interested buyers. Negotiate, meet, and seal the deal.",
    color: "rgba(254,240,138,0.7)",
    border: "rgba(234,179,8,0.15)",
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 32 }} />,
    label: "Properties",
    desc: "Apartments, villas, plots & commercial spaces",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.5), rgba(196,181,253,0.3))",
    iconColor: "#0369a1",
  },
  {
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 32 }} />,
    label: "Vehicles",
    desc: "Cars, bikes, trucks & all types of motor vehicles",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(254,240,138,0.3))",
    iconColor: "#166534",
  },
  {
    icon: <SupportAgentRoundedIcon sx={{ fontSize: 32 }} />,
    label: "Support",
    desc: "Dedicated team to assist you at every step",
    bg: "linear-gradient(135deg, rgba(251,207,232,0.5), rgba(254,215,170,0.3))",
    iconColor: "#be185d",
  },
];

// ── Team ─────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Arjun Sharma", role: "Founder & CEO", initials: "AS", color: "#0f766e" },
  { name: "Priya Nair", role: "Head of Product", initials: "PN", color: "#7c3aed" },
  { name: "Rahul Mehta", role: "Lead Engineer", initials: "RM", color: "#0369a1" },
  { name: "Sneha Kapoor", role: "Marketing Director", initials: "SK", color: "#be185d" },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Sold my apartment within 2 weeks of listing on EasyDeal. The process was incredibly smooth.",
    name: "Vikram S.",
    role: "Property Seller",
    stars: 5,
    bg: "linear-gradient(135deg, rgba(186,230,253,0.4), rgba(196,181,253,0.3))",
  },
  {
    quote: "Found my dream car at an unbeatable price. The seller was verified and trustworthy.",
    name: "Ananya R.",
    role: "Vehicle Buyer",
    stars: 5,
    bg: "linear-gradient(135deg, rgba(187,247,208,0.4), rgba(254,240,138,0.3))",
  },
  {
    quote: "EasyDeal's premium plan was worth every rupee. I got 5 serious inquiries in the first day.",
    name: "Mohit D.",
    role: "Premium Seller",
    stars: 5,
    bg: "linear-gradient(135deg, rgba(254,215,170,0.4), rgba(251,207,232,0.3))",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        display: "inline-block",
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.primary,
        bgcolor: C.primarySoft,
        px: 1.5,
        py: 0.5,
        borderRadius: "20px",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

function SectionHeading({ children, sx = {} }) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: "1.75rem", md: "2.25rem" },
        fontWeight: 800,
        color: C.text,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function StarRow({ count = 5 }) {
  return (
    <Stack direction="row" spacing={0.25}>
      {Array.from({ length: count }).map((_, i) => (
        <StarRoundedIcon key={i} sx={{ fontSize: 15, color: "#f59e0b" }} />
      ))}
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          overflow: "hidden",
          background: "linear-gradient(160deg, #ffffff 0%, #f0fdf9 40%, #eff6ff 100%)",
        }}
      >
        {[
          { top: "-80px", left: "-80px", size: 320, color: "rgba(186,230,253,0.35)" },
          { top: "40px", right: "-60px", size: 260, color: "rgba(196,181,253,0.3)" },
          { bottom: "-60px", left: "30%", size: 220, color: "rgba(187,247,208,0.35)" },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(60px)",
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionLabel>About EasyDeal</SectionLabel>
              <SectionHeading sx={{ mb: 2.5 }}>
                India's Smartest
                <br />
                <Box component="span" sx={{ color: C.primary }}>
                  Property & Vehicle
                </Box>{" "}
                Marketplace
              </SectionHeading>
              <Typography sx={{ fontSize: "1rem", color: C.muted, lineHeight: 1.8, mb: 4, maxWidth: 480 }}>
                EasyDeal connects thousands of buyers and sellers across India every day.
                Whether you're looking for your dream home, a reliable vehicle, or want to
                sell what you own — we make every deal easy, safe, and fast.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/subscription"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    bgcolor: C.primary,
                    boxShadow: "0 8px 24px rgba(15,118,110,0.22)",
                    "&:hover": {
                      bgcolor: C.primaryHover,
                      boxShadow: "0 12px 32px rgba(15,118,110,0.3)",
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="outlined"
                  sx={{
                    minHeight: 48,
                    px: 3,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    borderColor: C.border,
                    color: C.text,
                    "&:hover": {
                      borderColor: C.primary,
                      color: C.primary,
                      bgcolor: C.primarySoft,
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {STATS.map((s, i) => (
                  <Grid item xs={6} key={i}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        background:
                          i % 2 === 0
                            ? "linear-gradient(135deg, rgba(186,230,253,0.5), rgba(196,181,253,0.3))"
                            : "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(254,240,138,0.3))",
                        border: "1px solid rgba(255,255,255,0.8)",
                        backdropFilter: "blur(10px)",
                        textAlign: "center",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 32px rgba(15,23,42,0.10)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "1.75rem", md: "2.25rem" },
                          fontWeight: 900,
                          color: C.text,
                          lineHeight: 1.1,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {s.value}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: C.muted,
                          mt: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── WHAT WE DO ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>What We Offer</SectionLabel>
            <SectionHeading sx={{ mb: 1.5 }}>Everything You Need in One Place</SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 520, mx: "auto", lineHeight: 1.8 }}>
              From properties to vehicles, EasyDeal is your one-stop marketplace for buying and selling in India.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {CATEGORIES.map((cat, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    background: cat.bg,
                    border: "1px solid rgba(255,255,255,0.9)",
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.85)",
                      display: "grid",
                      placeItems: "center",
                      mb: 2.5,
                      color: cat.iconColor,
                      boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                    }}
                  >
                    {cat.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: C.text, mb: 1 }}>
                    {cat.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.7 }}>
                    {cat.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── OUR VALUES ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f8f9fb" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Our Values</SectionLabel>
            <SectionHeading sx={{ mb: 1.5 }}>Built on Trust & Simplicity</SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 500, mx: "auto", lineHeight: 1.8 }}>
              Every feature we build starts with a simple question: does this make the deal easier for our users?
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {VALUES.map((v, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: "24px",
                    background: v.gradient,
                    border: "1px solid rgba(255,255,255,0.85)",
                    display: "flex",
                    gap: 2.5,
                    alignItems: "flex-start",
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      bgcolor: v.iconBg,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      color: v.iconColor,
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                      "& svg": { fontSize: 24 },
                    }}
                  >
                    {v.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: C.text, mb: 0.75 }}>
                      {v.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.75 }}>
                      {v.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>How It Works</SectionLabel>
            <SectionHeading sx={{ mb: 1.5 }}>Start Dealing in 4 Simple Steps</SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 480, mx: "auto", lineHeight: 1.8 }}>
              Getting started on EasyDeal is quick and hassle-free. Here's how it works.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {HOW_IT_WORKS.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "24px",
                    bgcolor: step.color,
                    border: `1px solid ${step.border}`,
                    height: "100%",
                    position: "relative",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: "rgba(15,23,42,0.1)",
                      lineHeight: 1,
                      mb: 2,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.step}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.75 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f8f9fb" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Our Team</SectionLabel>
            <SectionHeading sx={{ mb: 1.5 }}>People Behind EasyDeal</SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 460, mx: "auto", lineHeight: 1.8 }}>
              A small, passionate team on a mission to make property and vehicle dealing effortless for every Indian.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {TEAM.map((member, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "24px",
                    bgcolor: "#ffffff",
                    border: `1px solid ${C.border}`,
                    textAlign: "center",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 40px rgba(15,23,42,0.10)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      bgcolor: member.color,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                      mb: 2,
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      boxShadow: `0 8px 24px ${member.color}44`,
                    }}
                  >
                    {member.initials}
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: C.muted, fontWeight: 600 }}>
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Testimonials</SectionLabel>
            <SectionHeading sx={{ mb: 1.5 }}>What People Say About Us</SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 460, mx: "auto", lineHeight: 1.8 }}>
              Thousands of happy customers trust EasyDeal for their most important transactions.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    background: t.bg,
                    border: "1px solid rgba(255,255,255,0.85)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <StarRow count={t.stars} />
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: C.text,
                      lineHeight: 1.8,
                      mt: 2,
                      mb: 3,
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{t.quote}"
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.8)",
                        display: "grid",
                        placeItems: "center",
                        boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
                      }}
                    >
                      <GroupsRoundedIcon sx={{ fontSize: 20, color: C.muted }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: C.text }}>
                        {t.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: C.muted }}>
                        {t.role}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #f0fdf9 0%, #eff6ff 50%, #fdf4ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[
          { top: "-60px", right: "-40px", size: 280, color: "rgba(196,181,253,0.3)" },
          { bottom: "-60px", left: "-40px", size: 260, color: "rgba(187,247,208,0.35)" },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(60px)",
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionLabel>Why EasyDeal</SectionLabel>
              <SectionHeading sx={{ mb: 2 }}>
                Why Thousands Choose
                <Box component="span" sx={{ color: C.primary }}>
                  {" "}
                  EasyDeal
                </Box>
              </SectionHeading>
              <Typography sx={{ fontSize: "0.95rem", color: C.muted, lineHeight: 1.8, mb: 4 }}>
                We've built a platform that works for both buyers and sellers. Fast, transparent,
                and designed from the ground up for the Indian market.
              </Typography>
              <Stack spacing={2}>
                {[
                  "Free to browse — no hidden fees",
                  "Verified listings across all categories",
                  "Premium plan with unlimited postings",
                  "Dedicated customer support team",
                  "Mobile-friendly for on-the-go access",
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ fontSize: 20, color: C.primary, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {[
                  { icon: <VerifiedRoundedIcon />, label: "Verified Listings", val: "100%", bg: "rgba(186,230,253,0.5)", color: "#0369a1" },
                  { icon: <GroupsRoundedIcon />, label: "Active Users", val: "8.5K+", bg: "rgba(196,181,253,0.5)", color: "#7c3aed" },
                  { icon: <HandshakeRoundedIcon />, label: "Deals Closed", val: "6,200+", bg: "rgba(187,247,208,0.5)", color: "#166534" },
                  { icon: <StarRoundedIcon />, label: "Avg. Rating", val: "4.9 ★", bg: "rgba(254,240,138,0.5)", color: "#a16207" },
                ].map((item, i) => (
                  <Grid item xs={6} key={i}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        bgcolor: item.bg,
                        border: "1px solid rgba(255,255,255,0.85)",
                        textAlign: "center",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                        },
                      }}
                    >
                      <Box sx={{ color: item.color, mb: 1, "& svg": { fontSize: 28 } }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontSize: "1.5rem", fontWeight: 900, color: C.text, lineHeight: 1.1 }}>
                        {item.val}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: C.muted, mt: 0.5, fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #0f766e 0%, #0369a1 100%)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {[
          { top: "-40px", left: "-40px", size: 200, color: "rgba(255,255,255,0.06)" },
          { bottom: "-40px", right: "-40px", size: 240, color: "rgba(255,255,255,0.06)" },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(40px)",
              top: b.top,
              bottom: b.bottom,
              left: b.left,
              right: b.right,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.85rem" },
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              mb: 2,
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              mb: 2.5,
            }}
          >
            Join Thousands of Happy
            <br />
            Buyers &amp; Sellers Today
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.75)",
              mb: 5,
              maxWidth: 460,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Create your free account and start browsing or listing in minutes. No credit card required.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minHeight: 52,
                px: 4,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                bgcolor: "#ffffff",
                color: C.primary,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: "#f0fdf9",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                },
              }}
            >
              Create Free Account
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              sx={{
                minHeight: 52,
                px: 4,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                borderColor: "rgba(255,255,255,0.4)",
                color: "#ffffff",
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Talk to Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}