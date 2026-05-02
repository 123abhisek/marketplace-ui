// src/pages/HowItWorksPage.jsx
import { useState } from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import ConnectWithoutContactRoundedIcon from "@mui/icons-material/ConnectWithoutContactRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.08)",
  border: "rgba(15,23,42,0.08)",
};

// ── Seller steps ──────────────────────────────────────────────────────────────
const SELLER_STEPS = [
  {
    step: "01",
    icon: <PersonAddAlt1RoundedIcon />,
    title: "Create Your Account",
    desc: "Sign up for free in under 60 seconds. Just your name, email, and a password — you're in.",
    color: "rgba(254,202,202,0.65)",
    iconBg: "rgba(239,68,68,0.12)",
    iconColor: "#dc2626",
    border: "rgba(239,68,68,0.12)",
  },
  {
    step: "02",
    icon: <WorkspacePremiumRoundedIcon />,
    title: "Upgrade to Premium",
    desc: "Get a Premium plan for just ₹299 to unlock the ability to post unlimited listings and get priority visibility.",
    color: "rgba(196,181,253,0.55)",
    iconBg: "rgba(124,58,237,0.12)",
    iconColor: "#7c3aed",
    border: "rgba(124,58,237,0.12)",
  },
  {
    step: "03",
    icon: <AddPhotoAlternateRoundedIcon />,
    title: "Post Your Listing",
    desc: "Add photos, description, price, and location. Your listing goes live instantly and reaches thousands of buyers.",
    color: "rgba(186,230,253,0.65)",
    iconBg: "rgba(3,105,161,0.12)",
    iconColor: "#0369a1",
    border: "rgba(3,105,161,0.12)",
  },
  {
    step: "04",
    icon: <ConnectWithoutContactRoundedIcon />,
    title: "Connect & Close the Deal",
    desc: "Interested buyers contact you directly. Negotiate, meet, and seal the deal — completely on your terms.",
    color: "rgba(187,247,208,0.65)",
    iconBg: "rgba(22,101,52,0.12)",
    iconColor: "#166534",
    border: "rgba(22,101,52,0.12)",
  },
];

// ── Buyer steps ───────────────────────────────────────────────────────────────
const BUYER_STEPS = [
  {
    step: "01",
    icon: <SearchRoundedIcon />,
    title: "Browse Listings",
    desc: "Search thousands of verified property and vehicle listings across India — completely free, no account needed.",
    color: "rgba(254,240,138,0.65)",
    iconBg: "rgba(161,98,7,0.10)",
    iconColor: "#a16207",
    border: "rgba(234,179,8,0.15)",
  },
  {
    step: "02",
    icon: <FilterListRoundedIcon />,
    title: "Filter & Shortlist",
    desc: "Use smart filters — price range, location, type, year — to zero in on exactly what you're looking for.",
    color: "rgba(254,215,170,0.65)",
    iconBg: "rgba(194,65,12,0.10)",
    iconColor: "#c2410c",
    border: "rgba(234,88,12,0.12)",
  },
  {
    step: "03",
    icon: <FavoriteBorderRoundedIcon />,
    title: "Save Your Favourites",
    desc: "Bookmark listings you love and compare them side by side before making a decision.",
    color: "rgba(251,207,232,0.65)",
    iconBg: "rgba(190,24,93,0.10)",
    iconColor: "#be185d",
    border: "rgba(190,24,93,0.12)",
  },
  {
    step: "04",
    icon: <ChatBubbleOutlineRoundedIcon />,
    title: "Contact the Seller",
    desc: "Reach out to verified sellers directly. Ask questions, schedule a visit, and close the deal confidently.",
    color: "rgba(186,230,253,0.65)",
    iconBg: "rgba(3,105,161,0.12)",
    iconColor: "#0369a1",
    border: "rgba(3,105,161,0.12)",
  },
];

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <FlashOnRoundedIcon />,
    title: "Lightning Fast",
    desc: "Post or find a listing in minutes, not hours.",
    bg: "linear-gradient(135deg, rgba(254,240,138,0.5), rgba(254,215,170,0.4))",
    iconColor: "#a16207",
  },
  {
    icon: <VerifiedUserRoundedIcon />,
    title: "Verified Listings",
    desc: "Every listing is reviewed before going live.",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(186,230,253,0.4))",
    iconColor: "#166534",
  },
  {
    icon: <SecurityRoundedIcon />,
    title: "100% Secure",
    desc: "Your data and transactions are fully protected.",
    bg: "linear-gradient(135deg, rgba(196,181,253,0.5), rgba(251,207,232,0.4))",
    iconColor: "#7c3aed",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "24/7 Support",
    desc: "Our team is always here to help you out.",
    bg: "linear-gradient(135deg, rgba(254,202,202,0.5), rgba(251,207,232,0.4))",
    iconColor: "#dc2626",
  },
  {
    icon: <TrendingUpRoundedIcon />,
    title: "High Visibility",
    desc: "Premium listings get 10x more views instantly.",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.5), rgba(196,181,253,0.4))",
    iconColor: "#0369a1",
  },
  {
    icon: <StarRoundedIcon />,
    title: "Top Rated",
    desc: "4.9★ average rating from 8,500+ happy users.",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.5), rgba(254,240,138,0.4))",
    iconColor: "#c2410c",
  },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is it free to browse listings?",
    a: "Yes! Browsing all property and vehicle listings is completely free — no account needed.",
  },
  {
    q: "Do I need an account to contact sellers?",
    a: "You need to be logged in to contact a seller. Creating an account is free and takes less than a minute.",
  },
  {
    q: "What does the Premium plan include?",
    a: "Premium lets you post unlimited listings, get priority placement in search results, and access direct seller contact details.",
  },
  {
    q: "How are listings verified?",
    a: "Every listing is reviewed by our team before it goes live. We check details, photos, and seller identity.",
  },
  {
    q: "Can I post both properties and vehicles?",
    a: "Absolutely. With a Premium account, you can post listings in both categories with no restrictions.",
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

function SectionHeading({ children, center = false, sx = {} }) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: "1.75rem", md: "2.25rem" },
        fontWeight: 800,
        color: C.text,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        textAlign: center ? "center" : "left",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function Blob({ top, left, right, bottom, size, color }) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(70px)",
        top,
        left,
        right,
        bottom,
        pointerEvents: "none",
      }}
    />
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "contained" : "outlined"}
      sx={{
        minHeight: 46,
        px: 3.5,
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.9rem",
        ...(active
          ? {
              bgcolor: C.primary,
              color: "#fff",
              boxShadow: "0 8px 24px rgba(15,118,110,0.22)",
              "&:hover": { bgcolor: C.primaryHover },
            }
          : {
              borderColor: C.border,
              color: C.muted,
              bgcolor: "transparent",
              "&:hover": { borderColor: C.primary, color: C.primary, bgcolor: C.primarySoft },
            }),
      }}
    >
      {children}
    </Button>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      onClick={() => setOpen((v) => !v)}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "18px",
        bgcolor: open ? C.primarySoft : "#ffffff",
        border: `1px solid ${open ? "rgba(15,118,110,0.18)" : C.border}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(15,118,110,0.2)",
          bgcolor: open ? C.primarySoft : "rgba(15,23,42,0.02)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: C.text }}>
          {q}
        </Typography>
        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 22,
            color: open ? C.primary : C.faint,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease, color 0.2s ease",
          }}
        />
      </Stack>

      {open && (
        <Typography sx={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.8, mt: 1.5 }}>
          {a}
        </Typography>
      )}
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const [tab, setTab] = useState("seller");
  const steps = tab === "seller" ? SELLER_STEPS : BUYER_STEPS;

  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 9, md: 13 },
          pb: { xs: 9, md: 13 },
          overflow: "hidden",
          background: "linear-gradient(160deg, #ffffff 0%, #f0fdf9 45%, #eff6ff 100%)",
        }}
      >
        <Blob top="-80px" left="-80px" size={320} color="rgba(186,230,253,0.38)" />
        <Blob top="20px" right="-60px" size={260} color="rgba(196,181,253,0.3)" />
        <Blob bottom="-60px" left="35%" size={220} color="rgba(187,247,208,0.35)" />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <SectionLabel>How It Works</SectionLabel>
          <SectionHeading center sx={{ mb: 2.5 }}>
            Simple Steps to Your
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Next Great Deal
            </Box>
          </SectionHeading>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: C.muted,
              lineHeight: 1.85,
              mb: 5,
              maxWidth: 540,
              mx: "auto",
            }}
          >
            Whether you're buying or selling a property or vehicle, EasyDeal makes the entire
            process smooth, transparent, and incredibly fast — from signup to deal done.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 0 }}
            divider={<Box sx={{ width: "1px", bgcolor: C.border, display: { xs: "none", sm: "block" } }} />}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "20px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
              px: { xs: 3, sm: 0 },
              py: { xs: 3, sm: 2.5 },
              maxWidth: 640,
              mx: "auto",
            }}
          >
            {[
              { val: "60 secs", label: "To create an account" },
              { val: "₹299", label: "Premium plan, once" },
              { val: "2 mins", label: "To post a listing" },
            ].map((s, i) => (
              <Box key={i} sx={{ flex: 1, textAlign: "center", px: 3 }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: C.text,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.val}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: C.muted, mt: 0.4, fontWeight: 600 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── TABBED STEPS ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <SectionLabel>Step by Step</SectionLabel>
            <SectionHeading center sx={{ mb: 3 }}>
              Are You a{" "}
              <Box component="span" sx={{ color: C.primary }}>
                Buyer or Seller?
              </Box>
            </SectionHeading>

            <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
              <TabButton active={tab === "seller"} onClick={() => setTab("seller")}>
                🏷️ &nbsp; I'm a Seller
              </TabButton>
              <TabButton active={tab === "buyer"} onClick={() => setTab("buyer")}>
                🔍 &nbsp; I'm a Buyer
              </TabButton>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={`${tab}-${i}`}>
                <Box
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "24px",
                    bgcolor: s.color,
                    border: `1px solid ${s.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: 12,
                      fontSize: "5rem",
                      fontWeight: 900,
                      color: "rgba(15,23,42,0.06)",
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {s.step}
                  </Typography>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      bgcolor: s.iconBg,
                      display: "grid",
                      placeItems: "center",
                      mb: 2.5,
                      color: s.iconColor,
                      "& svg": { fontSize: 24 },
                      boxShadow: "0 4px 12px rgba(15,23,42,0.07)",
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </Box>

                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text, mb: 1, lineHeight: 1.3 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.855rem", color: C.muted, lineHeight: 1.78, flex: 1 }}>
                    {s.desc}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2.5,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      bgcolor: "rgba(255,255,255,0.7)",
                      px: 1.25,
                      py: 0.4,
                      borderRadius: "8px",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: C.muted,
                        letterSpacing: "0.06em",
                      }}
                    >
                      STEP {s.step}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              component={RouterLink}
              to={tab === "seller" ? "/subscription" : "/register"}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minHeight: 52,
                px: 4.5,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                bgcolor: C.primary,
                boxShadow: "0 8px 28px rgba(15,118,110,0.25)",
                "&:hover": {
                  bgcolor: C.primaryHover,
                  boxShadow: "0 12px 36px rgba(15,118,110,0.32)",
                },
              }}
            >
              {tab === "seller" ? "Start Selling Today" : "Start Browsing Now"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f8f9fb" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Categories</SectionLabel>
            <SectionHeading center sx={{ mb: 1.5 }}>
              What Can You Buy & Sell?
            </SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 460, mx: "auto", lineHeight: 1.8 }}>
              EasyDeal covers two major categories with thousands of verified listings updated daily.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                icon: <HomeWorkRoundedIcon sx={{ fontSize: 40 }} />,
                label: "Properties",
                iconColor: "#0369a1",
                bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
                items: ["Apartments & Flats", "Independent Houses & Villas", "Plots & Land", "Commercial Spaces", "PG & Rentals"],
              },
              {
                icon: <DirectionsCarRoundedIcon sx={{ fontSize: 40 }} />,
                label: "Vehicles",
                iconColor: "#166534",
                bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
                items: ["Cars — New & Used", "Bikes & Scooters", "Trucks & Commercial", "Electric Vehicles", "Spare Parts & Accessories"],
              },
            ].map((cat, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Box
                  sx={{
                    p: { xs: 3.5, md: 5 },
                    borderRadius: "28px",
                    background: cat.bg,
                    border: "1px solid rgba(255,255,255,0.9)",
                    height: "100%",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 16px 44px rgba(15,23,42,0.09)" },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        width: 68,
                        height: 68,
                        borderRadius: "18px",
                        bgcolor: "rgba(255,255,255,0.85)",
                        display: "grid",
                        placeItems: "center",
                        color: cat.iconColor,
                        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                        flexShrink: 0,
                      }}
                    >
                      {cat.icon}
                    </Box>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>
                      {cat.label}
                    </Typography>
                  </Stack>

                  <Stack spacing={1.25}>
                    {cat.items.map((item, j) => (
                      <Stack key={j} direction="row" spacing={1.25} alignItems="center">
                        <CheckCircleRoundedIcon sx={{ fontSize: 17, color: cat.iconColor, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: "0.9rem", color: C.text, fontWeight: 500 }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Why EasyDeal</SectionLabel>
            <SectionHeading center sx={{ mb: 1.5 }}>
              Built for Speed, Trust & Simplicity
            </SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 480, mx: "auto", lineHeight: 1.8 }}>
              Every feature is designed to make your buying or selling experience as smooth as possible.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "22px",
                    background: f.bg,
                    border: "1px solid rgba(255,255,255,0.88)",
                    display: "flex",
                    gap: 2.25,
                    alignItems: "flex-start",
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 14px 36px rgba(15,23,42,0.09)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "13px",
                      bgcolor: "rgba(255,255,255,0.82)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      color: f.iconColor,
                      "& svg": { fontSize: 22 },
                      boxShadow: "0 3px 10px rgba(15,23,42,0.07)",
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text, mb: 0.6 }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.86rem", color: C.muted, lineHeight: 1.75 }}>
                      {f.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(160deg, #f0fdf9 0%, #eff6ff 60%, #fdf4ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Blob top="-60px" right="-40px" size={280} color="rgba(196,181,253,0.28)" />
        <Blob bottom="-60px" left="-40px" size={260} color="rgba(187,247,208,0.32)" />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading center sx={{ mb: 1.5 }}>
              Common Questions
            </SectionHeading>
            <Typography sx={{ fontSize: "1rem", color: C.muted, lineHeight: 1.8 }}>
              Everything you need to know before you get started on EasyDeal.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </Stack>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.9rem", color: C.muted }}>
              Still have questions?{" "}
              <Box
                component={RouterLink}
                to="/contact"
                sx={{
                  color: C.primary,
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Contact our support team →
              </Box>
            </Typography>
          </Box>
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
          { top: "-50px", left: "-50px", size: 220, color: "rgba(255,255,255,0.06)" },
          { bottom: "-50px", right: "-50px", size: 260, color: "rgba(255,255,255,0.06)" },
          { top: "50%", left: "50%", size: 180, color: "rgba(255,255,255,0.04)" },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(50px)",
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
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              mb: 2,
            }}
          >
            Ready? Let's Go.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.75rem", md: "2.6rem" },
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              mb: 2.5,
            }}
          >
            Your Next Deal is Just
            <br />
            a Few Clicks Away
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.72)",
              mb: 5,
              maxWidth: 440,
              mx: "auto",
              lineHeight: 1.85,
            }}
          >
            Join thousands of buyers and sellers on EasyDeal. Sign up free and start today.
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
                boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
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
              to="/subscription"
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
                  bgcolor: "rgba(255,255,255,0.09)",
                },
              }}
            >
              View Premium Plans
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}