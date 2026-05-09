// src/pages/FAQPage.jsx
import { useState } from "react";
import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ContactSupportRoundedIcon from "@mui/icons-material/ContactSupportRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.08)",
  primaryBorder: "rgba(15,118,110,0.18)",
  border: "rgba(15,23,42,0.08)",
};

// ── FAQ Categories ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: "all",
    label: "All Questions",
    icon: <ContactSupportRoundedIcon />,
    color: "#0f766e",
    bg: C.primarySoft,
  },
  {
    key: "account",
    label: "Account",
    icon: <AccountCircleRoundedIcon />,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    key: "premium",
    label: "Premium & Billing",
    icon: <WorkspacePremiumRoundedIcon />,
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
  },
  {
    key: "property",
    label: "Properties",
    icon: <HomeWorkRoundedIcon />,
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
  },
  {
    key: "vehicle",
    label: "Vehicles",
    icon: <DirectionsCarRoundedIcon />,
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
  },
  {
    key: "security",
    label: "Safety & Security",
    icon: <SecurityRoundedIcon />,
    color: "#be185d",
    bg: "rgba(190,24,93,0.08)",
  },
];

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    cat: "account",
    q: "Is it free to create an account on EasyDeal?",
    a: "Yes, creating an account on EasyDeal is completely free. You can sign up with just your name, email, and a password in under 60 seconds. No credit card or payment is required to register.",
  },
  {
    cat: "account",
    q: "Can I browse listings without creating an account?",
    a: "Absolutely. All property and vehicle listings are publicly visible and fully browsable without an account. You only need to create a free account when you want to contact a seller or save listings to favourites.",
  },
  {
    cat: "account",
    q: "How do I reset my password?",
    a: "Go to the Login page and click 'Forgot Password'. Enter your registered email address and we'll send you a secure reset link. The link is valid for 30 minutes.",
  },
  {
    cat: "account",
    q: "Can I change my email address after registration?",
    a: "Yes, you can update your email address from your Profile settings page. You'll need to verify the new email address before the change takes effect.",
  },

  {
    cat: "premium",
    q: "How much does the Premium plan cost?",
    a: "The EasyDeal Premium plan is priced at just ₹299 as a one-time payment. This gives you full access to post unlimited listings across properties and vehicles, with priority visibility in search results.",
  },
  {
    cat: "premium",
    q: "What's included in the Premium plan?",
    a: "Premium includes: unlimited listing postings, priority placement in search, direct access to buyer contact details, ability to add multiple photos per listing, featured badge on all your listings, and dedicated premium support.",
  },
  {
    cat: "premium",
    q: "Is the Premium plan a subscription or one-time payment?",
    a: "It is a one-time payment of ₹299 — there are no recurring monthly charges. You pay once and get full Premium access with no hidden fees.",
  },
  {
    cat: "premium",
    q: "What payment methods are accepted?",
    a: "We accept all major UPI apps (GPay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), and net banking. All payments are processed securely via Razorpay.",
  },
  {
    cat: "premium",
    q: "Can I get a refund if I'm not satisfied?",
    a: "Yes. If you're not satisfied within 7 days of your purchase, contact our support team and we will process a full refund — no questions asked.",
  },

  {
    cat: "property",
    q: "What types of properties can I list on EasyDeal?",
    a: "You can list a wide range of properties including apartments & flats, independent houses & villas, plots & land, commercial spaces (offices, shops, warehouses), and PG accommodations or rental properties.",
  },
  {
    cat: "property",
    q: "How many photos can I add to a property listing?",
    a: "Free users can add up to 3 photos per listing. Premium users can add up to 20 high-resolution photos, giving buyers a much better view of the property.",
  },
  {
    cat: "property",
    q: "How long does it take for my listing to go live?",
    a: "Most listings are reviewed and approved within 2–4 hours. During peak times it may take up to 12 hours. You'll receive an email notification as soon as your listing goes live.",
  },
  {
    cat: "property",
    q: "Can I edit my listing after it's been published?",
    a: "Yes, you can edit your listing at any time from your dashboard. Changes like price, description, and photos are applied immediately without needing re-approval.",
  },

  {
    cat: "vehicle",
    q: "What types of vehicles can I list?",
    a: "EasyDeal supports listings for cars (new & used), bikes & scooters, trucks & commercial vehicles, electric vehicles (EVs), auto-rickshaws, and spare parts & accessories.",
  },
  {
    cat: "vehicle",
    q: "Do I need to provide RC or any documents to list a vehicle?",
    a: "You are not required to upload documents to create a listing. However, we strongly recommend mentioning registration details, fuel type, and service history in your listing to build buyer trust and get quicker responses.",
  },
  {
    cat: "vehicle",
    q: "How do buyers find my vehicle listing?",
    a: "Buyers can search by vehicle type, make, model, year, fuel type, price range, and location. Premium listings appear at the top of relevant search results, giving you significantly more visibility.",
  },

  {
    cat: "security",
    q: "How does EasyDeal verify sellers?",
    a: "All seller accounts go through a basic identity verification during signup. Premium sellers are additionally verified with mobile number OTP. Our team manually reviews all listings before they go live to check for authenticity.",
  },
  {
    cat: "security",
    q: "Is my personal contact information visible to everyone?",
    a: "No. Your phone number and email are never displayed publicly. Only logged-in users can request contact details, and only after the seller has enabled contact sharing. You are always in control.",
  },
  {
    cat: "security",
    q: "How do I report a suspicious listing or user?",
    a: "Every listing has a 'Report' button. Click it, select the reason, and our moderation team will review it within 24 hours. Suspicious accounts are suspended immediately upon confirmation.",
  },
  {
    cat: "security",
    q: "Is my payment information secure?",
    a: "Yes. All payments are handled by Razorpay, a PCI-DSS compliant payment gateway. EasyDeal never stores your card details — all sensitive payment data is handled entirely by Razorpay's secure servers.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function Blob({ top, left, right, bottom, size, color }) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(72px)",
        top,
        left,
        right,
        bottom,
        pointerEvents: "none",
      }}
    />
  );
}

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

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORIES.find((c) => c.key === item.cat);

  return (
    <Box
      onClick={() => setOpen((v) => !v)}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "20px",
        bgcolor: open ? C.primarySoft : "#ffffff",
        border: `1.5px solid ${open ? C.primaryBorder : C.border}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: open ? C.primaryBorder : "rgba(15,23,42,0.14)",
          bgcolor: open ? C.primarySoft : "rgba(15,23,42,0.015)",
          boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              bgcolor: open ? C.primary : "rgba(15,23,42,0.06)",
              color: open ? "#fff" : C.faint,
              display: "grid",
              placeItems: "center",
              fontSize: "0.72rem",
              fontWeight: 800,
              flexShrink: 0,
              mt: "1px",
              transition: "all 0.2s ease",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.9rem", md: "0.97rem" },
                color: open ? C.primary : C.text,
                lineHeight: 1.45,
                transition: "color 0.2s ease",
              }}
            >
              {item.q}
            </Typography>

            {open && (
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: C.muted,
                  lineHeight: 1.85,
                  mt: 1.25,
                }}
              >
                {item.a}
              </Typography>
            )}
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          {cat && (
            <Chip
              label={cat.label}
              size="small"
              sx={{
                display: { xs: "none", md: "flex" },
                height: 24,
                borderRadius: "7px",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: cat.color,
                bgcolor: cat.bg,
                border: "none",
                "& .MuiChip-label": { px: "8px" },
              }}
            />
          )}

          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "9px",
              display: "grid",
              placeItems: "center",
              bgcolor: open ? C.primary : "rgba(15,23,42,0.05)",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <KeyboardArrowDownRoundedIcon
              sx={{
                fontSize: 18,
                color: open ? "#fff" : C.faint,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.22s ease, color 0.2s ease",
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAppState();
  const isLoggedIn = Boolean(user?.loggedIn);

  const filtered = FAQS.filter((f) => {
    const matchesCat = activeCategory === "all" || f.cat === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 9, md: 13 },
          pb: { xs: 8, md: 11 },
          overflow: "hidden",
          background: "linear-gradient(160deg, #ffffff 0%, #f0fdf9 45%, #eff6ff 100%)",
        }}
      >
        <Blob top="-80px" left="-80px" size={320} color="rgba(186,230,253,0.38)" />
        <Blob top="10px" right="-60px" size={260} color="rgba(196,181,253,0.3)" />
        <Blob bottom="-60px" left="38%" size={220} color="rgba(187,247,208,0.35)" />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <SectionLabel>Help Center</SectionLabel>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.9rem", md: "2.8rem" },
              fontWeight: 900,
              color: C.text,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              mb: 2,
            }}
          >
            Frequently Asked
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Questions
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: C.muted,
              lineHeight: 1.85,
              mb: 5,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Find quick answers to the most common questions about buying, selling, accounts, and payments on EasyDeal.
          </Typography>

          <Box
            sx={{
              maxWidth: 540,
              mx: "auto",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 18,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.faint,
                display: "flex",
                pointerEvents: "none",
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box
              component="input"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "100%",
                height: 54,
                pl: "50px",
                pr: 3,
                borderRadius: "16px",
                border: `1.5px solid ${C.border}`,
                bgcolor: "#ffffff",
                fontSize: "0.95rem",
                color: C.text,
                outline: "none",
                boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                fontFamily: "inherit",
                "&:focus": {
                  borderColor: C.primary,
                  boxShadow: `0 4px 24px rgba(15,118,110,0.12)`,
                },
                "&::placeholder": { color: C.faint },
              }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ mt: 4, flexWrap: "wrap", gap: 1.5 }}
          >
            {[
              { val: `${FAQS.length}`, label: "Questions answered" },
              { val: "5", label: "Topic categories" },
              { val: "24h", label: "Support response time" },
            ].map((s, i) => (
              <Stack key={i} direction="row" spacing={0.75} alignItems="center">
                <Typography sx={{ fontSize: "1rem", fontWeight: 900, color: C.primary }}>
                  {s.val}
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", color: C.muted, fontWeight: 500 }}>
                  {s.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── CATEGORY FILTER + FAQS ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  position: { md: "sticky" },
                  top: { md: 90 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.faint,
                    mb: 2,
                  }}
                >
                  Browse by Topic
                </Typography>

                <Stack spacing={0.75}>
                  {CATEGORIES.map((cat) => {
                    const count =
                      cat.key === "all"
                        ? FAQS.length
                        : FAQS.filter((f) => f.cat === cat.key).length;
                    const isActive = activeCategory === cat.key;

                    return (
                      <Box
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          px: 1.75,
                          py: 1.25,
                          borderRadius: "12px",
                          cursor: "pointer",
                          bgcolor: isActive ? cat.bg : "transparent",
                          border: `1px solid ${isActive ? "rgba(15,23,42,0.06)" : "transparent"}`,
                          transition: "all 0.18s ease",
                          "&:hover": {
                            bgcolor: isActive ? cat.bg : "rgba(15,23,42,0.03)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "9px",
                            bgcolor: isActive ? cat.bg : "rgba(15,23,42,0.05)",
                            display: "grid",
                            placeItems: "center",
                            color: isActive ? cat.color : C.faint,
                            "& svg": { fontSize: 17 },
                            flexShrink: 0,
                            transition: "all 0.18s ease",
                          }}
                        >
                          {cat.icon}
                        </Box>

                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? cat.color : C.muted,
                            flex: 1,
                            transition: "all 0.18s ease",
                          }}
                        >
                          {cat.label}
                        </Typography>

                        <Box
                          sx={{
                            minWidth: 24,
                            height: 22,
                            borderRadius: "7px",
                            px: 0.75,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: isActive ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.05)",
                          }}
                        >
                          <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: isActive ? cat.color : C.faint }}>
                            {count}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Box
                  sx={{
                    mt: 4,
                    p: 2.5,
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, rgba(186,230,253,0.5), rgba(196,181,253,0.35))",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <Box sx={{ color: "#0369a1", mb: 1, "& svg": { fontSize: 24 } }}>
                    <SupportAgentRoundedIcon />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: C.text, mb: 0.5 }}>
                    Still need help?
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.7, mb: 2 }}>
                    Our support team replies within 24 hours.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/contact"
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      bgcolor: C.primary,
                      minHeight: 38,
                      boxShadow: "none",
                      "&:hover": { bgcolor: C.primaryHover, boxShadow: "none" },
                    }}
                  >
                    Contact Support
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={9}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
              >
                <Typography sx={{ fontSize: "0.875rem", color: C.muted }}>
                  Showing{" "}
                  <Box component="span" sx={{ fontWeight: 700, color: C.text }}>
                    {filtered.length}
                  </Box>{" "}
                  {filtered.length === 1 ? "question" : "questions"}
                  {activeCategory !== "all" && (
                    <>
                      {" "}in{" "}
                      <Box component="span" sx={{ fontWeight: 700, color: C.primary }}>
                        {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                      </Box>
                    </>
                  )}
                  {searchQuery.trim() !== "" && (
                    <>
                      {" "}for{" "}
                      <Box component="span" sx={{ fontWeight: 700, color: C.primary }}>
                        "{searchQuery}"
                      </Box>
                    </>
                  )}
                </Typography>

                {(searchQuery || activeCategory !== "all") && (
                  <Box
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: C.primary,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Clear filters
                  </Box>
                )}
              </Stack>

              {filtered.length > 0 ? (
                <Stack spacing={1.5}>
                  {filtered.map((item, i) => (
                    <FAQItem key={`${item.cat}-${i}`} item={item} index={i} />
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    py: 10,
                    textAlign: "center",
                    borderRadius: "24px",
                    bgcolor: "rgba(15,23,42,0.02)",
                    border: `1px dashed ${C.border}`,
                  }}
                >
                  <Box sx={{ fontSize: "2.5rem", mb: 2 }}>🔍</Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: C.text, mb: 1 }}>
                    No questions found
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: C.muted, maxWidth: 320, mx: "auto", lineHeight: 1.8 }}>
                    Try a different search term or browse a different category.
                  </Typography>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    variant="outlined"
                    sx={{
                      mt: 3,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: C.border,
                      color: C.muted,
                      "&:hover": { borderColor: C.primary, color: C.primary, bgcolor: C.primarySoft },
                    }}
                  >
                    Show all questions
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── CONTACT OPTIONS ──────────────────────────────────────────────── */}
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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Still Stuck?</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.2rem" },
                fontWeight: 800,
                color: C.text,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              We're Here to Help
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: C.muted, maxWidth: 460, mx: "auto", lineHeight: 1.8 }}>
              Can't find what you're looking for? Our support team is ready to assist you.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: <EmailRoundedIcon sx={{ fontSize: 28 }} />,
                title: "Email Support",
                desc: "Send us a detailed message and we'll get back to you within 24 hours.",
                action: "Send an Email",
                to: "/contact",
                bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
                iconColor: "#0369a1",
                iconBg: "rgba(3,105,161,0.10)",
              },
              {
                icon: <ChatRoundedIcon sx={{ fontSize: 28 }} />,
                title: "Live Chat",
                desc: "Chat in real time with our support team during business hours.",
                action: "Start Chat",
                to: "/contact",
                bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
                iconColor: "#166534",
                iconBg: "rgba(22,101,52,0.10)",
              },
              {
                icon: <ContactSupportRoundedIcon sx={{ fontSize: 28 }} />,
                title: "Help Center",
                desc: "Browse all guides, tutorials, and documentation at your own pace.",
                action: "Browse Guides",
                to: "/contact",
                bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
                iconColor: "#c2410c",
                iconBg: "rgba(194,65,12,0.10)",
              },
            ].map((card, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  sx={{
                    p: { xs: 3.5, md: 4 },
                    borderRadius: "26px",
                    background: card.bg,
                    border: "1px solid rgba(255,255,255,0.88)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 44px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "16px",
                      bgcolor: card.iconBg,
                      display: "grid",
                      placeItems: "center",
                      color: card.iconColor,
                      mb: 2.5,
                      boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: C.text, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.75, flex: 1, mb: 3 }}>
                    {card.desc}
                  </Typography>

                  <Button
                    component={RouterLink}
                    to={card.to}
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "15px !important" }} />}
                    sx={{
                      alignSelf: "flex-start",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      minHeight: 40,
                      px: 2.5,
                      borderColor: "rgba(255,255,255,0.8)",
                      bgcolor: "rgba(255,255,255,0.6)",
                      color: card.iconColor,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                        borderColor: "rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                      },
                    }}
                  >
                    {card.action}
                  </Button>
                </Box>
              </Grid>
            ))}
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
          { top: "-50px", left: "-50px", size: 240, color: "rgba(255,255,255,0.06)" },
          { bottom: "-50px", right: "-50px", size: 280, color: "rgba(255,255,255,0.06)" },
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
              fontSize: "0.76rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              mb: 2,
            }}
          >
            Ready to get started?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.8rem", md: "2.6rem" },
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              mb: 2.5,
            }}
          >
            Join Thousands of Buyers
            <br />
            & Sellers on EasyDeal
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.72)",
              mb: 5,
              maxWidth: 420,
              mx: "auto",
              lineHeight: 1.85,
            }}
          >
            {isLoggedIn
              ? "Explore listings, manage your account, and keep moving with confidence on EasyDeal."
              : "Create your free account today and start browsing or listing in minutes."}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            {!isLoggedIn && (
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
            )}

            <Button
              component={RouterLink}
              to="/how-it-works"
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
              How It Works
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}