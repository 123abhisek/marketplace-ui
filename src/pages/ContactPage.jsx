// src/pages/ContactPage.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
  error: "#dc2626",
};

// ── Constants ─────────────────────────────────────────────────────────────────
const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "premium", label: "Premium & Billing" },
  { value: "listing", label: "Listing Issue" },
  { value: "report", label: "Report a User / Listing" },
  { value: "technical", label: "Technical Problem" },
  { value: "other", label: "Something Else" },
];

const CONTACT_INFO = [
  {
    icon: <EmailRoundedIcon />,
    label: "Email Us",
    value: "support@easydeal.in",
    sub: "We reply within 24 hours",
    color: "#0369a1",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
    iconBg: "rgba(3,105,161,0.10)",
  },
  {
    icon: <PhoneRoundedIcon />,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 9 AM to 6 PM IST",
    color: "#166534",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
    iconBg: "rgba(22,101,52,0.10)",
  },
  {
    icon: <LocationOnRoundedIcon />,
    label: "Office",
    value: "Bengaluru, Karnataka",
    sub: "560001, India",
    color: "#c2410c",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
    iconBg: "rgba(194,65,12,0.10)",
  },
  {
    icon: <AccessTimeRoundedIcon />,
    label: "Support Hours",
    value: "Mon – Sat",
    sub: "9:00 AM – 6:00 PM IST",
    color: "#7c3aed",
    bg: "linear-gradient(135deg, rgba(196,181,253,0.55), rgba(254,202,202,0.35))",
    iconBg: "rgba(124,58,237,0.10)",
  },
];

const QUICK_LINKS = [
  {
    icon: <HelpOutlineRoundedIcon />,
    label: "FAQs",
    to: "/faq",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
  },
  {
    icon: <WorkspacePremiumRoundedIcon />,
    label: "Premium Plans",
    to: "/subscription",
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
  },
  {
    icon: <HomeWorkRoundedIcon />,
    label: "Browse Properties",
    to: "/properties",
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
  },
  {
    icon: <DirectionsCarRoundedIcon />,
    label: "Browse Vehicles",
    to: "/vehicles",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: <ReportProblemRoundedIcon />,
    label: "Report an Issue",
    to: "/faq",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
  },
  {
    icon: <ChatRoundedIcon />,
    label: "How It Works",
    to: "/how-it-works",
    color: "#c2410c",
    bg: "rgba(194,65,12,0.08)",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    bgcolor: "#ffffff",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: C.border, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: "rgba(15,23,42,0.18)" },
    "&.Mui-focused fieldset": { borderColor: C.primary, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.875rem", color: C.muted },
  "& .MuiInputLabel-root.Mui-focused": { color: C.primary },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    }, 1800);
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 9, md: 13 },
          pb: { xs: 8, md: 11 },
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #ffffff 0%, #f0fdf9 45%, #eff6ff 100%)",
        }}
      >
        <Blob
          top="-80px"
          left="-80px"
          size={320}
          color="rgba(186,230,253,0.38)"
        />
        <Blob
          top="10px"
          right="-60px"
          size={260}
          color="rgba(196,181,253,0.3)"
        />
        <Blob
          bottom="-60px"
          left="38%"
          size={220}
          color="rgba(187,247,208,0.35)"
        />

        <Container
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <SectionLabel>Get in Touch</SectionLabel>

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
            We'd Love to
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Hear From You
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
            Have a question, issue, or just want to say hello? Our support team
            is ready to help you — usually within 24 hours.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 0 }}
            divider={
              <Box
                sx={{
                  width: "1px",
                  bgcolor: C.border,
                  display: { xs: "none", sm: "block" },
                }}
              />
            }
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "20px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
              px: { xs: 3, sm: 0 },
              py: { xs: 3, sm: 2.5 },
              maxWidth: 560,
              mx: "auto",
            }}
          >
            {[
              { val: "< 24h", label: "Average response time" },
              { val: "98%", label: "Satisfaction rate" },
              { val: "24/7", label: "Online support available" },
            ].map((s, i) => (
              <Box key={i} sx={{ flex: 1, textAlign: "center", px: 3 }}>
                <Typography
                  sx={{
                    fontSize: "1.45rem",
                    fontWeight: 900,
                    color: C.text,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  {s.val}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: C.muted,
                    mt: 0.4,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── CONTACT INFO CARDS ───────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8f9fb" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2.5}>
            {CONTACT_INFO.map((info, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "24px",
                    background: info.bg,
                    border: "1px solid rgba(255,255,255,0.88)",
                    height: "100%",
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "13px",
                      bgcolor: info.iconBg,
                      display: "grid",
                      placeItems: "center",
                      color: info.color,
                      "& svg": { fontSize: 22 },
                      flexShrink: 0,
                      boxShadow: "0 3px 10px rgba(15,23,42,0.07)",
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: C.faint,
                        mb: 0.25,
                      }}
                    >
                      {info.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.97rem",
                        color: C.text,
                        lineHeight: 1.3,
                        mb: 0.3,
                      }}
                    >
                      {info.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        color: C.muted,
                        lineHeight: 1.6,
                      }}
                    >
                      {info.sub}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CONTACT FORM + SIDEBAR ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 7 }}>
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 4 }}>
                <SectionLabel>Send a Message</SectionLabel>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    fontWeight: 800,
                    color: C.text,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    mb: 1,
                  }}
                >
                  How Can We Help You?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.93rem",
                    color: C.muted,
                    lineHeight: 1.8,
                  }}
                >
                  Fill in the form and we'll get back to you as soon as possible.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number (optional)"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      sx={inputSx}
                    >
                      {SUBJECTS.map((s) => (
                        <MenuItem
                          key={s.value}
                          value={s.value}
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {s.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Your Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      error={!!errors.message}
                      helperText={
                        errors.message || `${form.message.length} characters`
                      }
                      required
                      sx={inputSx}
                      placeholder="Tell us how we can help. The more detail you provide, the faster we can assist you."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SendRoundedIcon />
                        )
                      }
                      sx={{
                        minHeight: 52,
                        px: 4.5,
                        borderRadius: "14px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        bgcolor: C.primary,
                        boxShadow: "0 8px 28px rgba(15,118,110,0.22)",
                        "&:hover": {
                          bgcolor: C.primaryHover,
                          boxShadow: "0 12px 36px rgba(15,118,110,0.3)",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "rgba(15,118,110,0.4)",
                          color: "#fff",
                        },
                      }}
                    >
                      {loading ? "Sending…" : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ position: { md: "sticky" }, top: { md: 90 } }}>
                <Box sx={{ mb: 4 }}>
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
                    Quick Links
                  </Typography>

                  <Grid container spacing={1.25}>
                    {QUICK_LINKS.map((lnk, i) => (
                      <Grid item xs={6} key={i}>
                        <Box
                          component={RouterLink}
                          to={lnk.to}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            p: 1.5,
                            borderRadius: "12px",
                            textDecoration: "none",
                            bgcolor: "rgba(15,23,42,0.02)",
                            border: `1px solid ${C.border}`,
                            transition: "all 0.18s ease",
                            "&:hover": {
                              bgcolor: lnk.bg,
                              borderColor: "rgba(15,23,42,0.06)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 14px rgba(15,23,42,0.07)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "8px",
                              bgcolor: lnk.bg,
                              display: "grid",
                              placeItems: "center",
                              color: lnk.color,
                              "& svg": { fontSize: 16 },
                              flexShrink: 0,
                            }}
                          >
                            {lnk.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: C.text,
                              lineHeight: 1.3,
                            }}
                          >
                            {lnk.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: "22px",
                    background:
                      "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(186,230,253,0.4))",
                    border: "1px solid rgba(255,255,255,0.88)",
                    mb: 3,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "11px",
                        bgcolor: "rgba(22,101,52,0.10)",
                        display: "grid",
                        placeItems: "center",
                        color: "#166534",
                        "& svg": { fontSize: 20 },
                      }}
                    >
                      <SupportAgentRoundedIcon />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: C.text,
                      }}
                    >
                      What to expect
                    </Typography>
                  </Stack>

                  <Stack spacing={1.25}>
                    {[
                      "We read every message personally",
                      "First response within 24 hours",
                      "Complex issues resolved in 48–72 hours",
                      "You'll get a follow-up until it's resolved",
                    ].map((txt, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckCircleRoundedIcon
                          sx={{
                            fontSize: 16,
                            color: "#166534",
                            mt: "2px",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: C.muted,
                            lineHeight: 1.65,
                          }}
                        >
                          {txt}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: "22px",
                    background:
                      "linear-gradient(135deg, rgba(196,181,253,0.45), rgba(254,202,202,0.3))",
                    border: "1px solid rgba(255,255,255,0.88)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.97rem",
                      color: C.text,
                      mb: 0.5,
                    }}
                  >
                    Follow EasyDeal
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: C.muted,
                      mb: 2,
                      lineHeight: 1.7,
                    }}
                  >
                    Stay updated with the latest listings, tips, and news.
                  </Typography>

                  <Stack direction="row" spacing={1.25}>
                    {[
                      {
                        icon: <InstagramIcon />,
                        label: "Instagram",
                        color: "#be185d",
                        bg: "rgba(190,24,93,0.10)",
                      },
                      {
                        icon: <TwitterIcon />,
                        label: "Twitter/X",
                        color: "#0369a1",
                        bg: "rgba(3,105,161,0.10)",
                      },
                      {
                        icon: <LinkedInIcon />,
                        label: "LinkedIn",
                        color: "#7c3aed",
                        bg: "rgba(124,58,237,0.10)",
                      },
                    ].map((s, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "12px",
                          bgcolor: s.bg,
                          display: "grid",
                          placeItems: "center",
                          color: s.color,
                          "& svg": { fontSize: 20 },
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 14px rgba(15,23,42,0.10)",
                          },
                        }}
                        title={s.label}
                      >
                        {s.icon}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── ALTERNATE CONTACT OPTIONS ────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            "linear-gradient(160deg, #f0fdf9 0%, #eff6ff 60%, #fdf4ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Blob
          top="-60px"
          right="-40px"
          size={280}
          color="rgba(196,181,253,0.28)"
        />
        <Blob
          bottom="-60px"
          left="-40px"
          size={260}
          color="rgba(187,247,208,0.32)"
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionLabel>Other Ways to Reach Us</SectionLabel>
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
              Pick What Works Best for You
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: C.muted,
                maxWidth: 460,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Whether you prefer chat, email, or browsing guides — we've got
              every channel covered.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: <EmailRoundedIcon sx={{ fontSize: 28 }} />,
                title: "Email Support",
                desc: "Write us at support@easydeal.in for account, billing, or listing queries.",
                badge: "< 24h reply",
                bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
                iconColor: "#0369a1",
                iconBg: "rgba(3,105,161,0.10)",
                badgeColor: "#0369a1",
                badgeBg: "rgba(3,105,161,0.10)",
              },
              {
                icon: <ChatRoundedIcon sx={{ fontSize: 28 }} />,
                title: "Live Chat",
                desc: "Chat directly with our support team for fast answers during business hours.",
                badge: "Mon–Sat 9–6 PM",
                bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
                iconColor: "#166534",
                iconBg: "rgba(22,101,52,0.10)",
                badgeColor: "#166534",
                badgeBg: "rgba(22,101,52,0.10)",
              },
              {
                icon: <HelpOutlineRoundedIcon sx={{ fontSize: 28 }} />,
                title: "FAQ / Help Center",
                desc: "Find instant answers to the most common questions without waiting.",
                badge: "Instant answers",
                bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
                iconColor: "#c2410c",
                iconBg: "rgba(194,65,12,0.10)",
                badgeColor: "#c2410c",
                badgeBg: "rgba(194,65,12,0.10)",
                to: "/faq",
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
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    sx={{ mb: 2.5 }}
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
                        boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.4,
                        borderRadius: "8px",
                        bgcolor: card.badgeBg,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: card.badgeColor,
                        }}
                      >
                        {card.badge}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: C.text,
                      mb: 1,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: C.muted,
                      lineHeight: 1.75,
                      flex: 1,
                      mb: 3,
                    }}
                  >
                    {card.desc}
                  </Typography>

                  <Button
                    component={card.to ? RouterLink : "button"}
                    to={card.to}
                    variant="outlined"
                    endIcon={
                      <ArrowForwardRoundedIcon
                        sx={{ fontSize: "15px !important" }}
                      />
                    }
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
                    {card.to ? "Browse FAQs" : "Get in Touch"}
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
          {
            top: "-50px",
            left: "-50px",
            size: 240,
            color: "rgba(255,255,255,0.06)",
          },
          {
            bottom: "-50px",
            right: "-50px",
            size: 280,
            color: "rgba(255,255,255,0.06)",
          },
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
            Ready to start?
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
            Start Buying or Selling
            <br />
            on EasyDeal Today
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
            Join thousands of happy users — sign up free and go live in minutes.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
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
              to="/faq"
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
              Browse FAQs
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ── SUCCESS SNACKBAR ─────────────────────────────────────────────── */}
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{
            borderRadius: "14px",
            fontWeight: 600,
            fontSize: "0.9rem",
            bgcolor: "#ffffff",
            color: C.text,
            border: `1.5px solid rgba(22,101,52,0.18)`,
            boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
            "& .MuiAlert-icon": { color: "#166534" },
          }}
        >
          Message sent! We'll get back to you within 24 hours. 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
}