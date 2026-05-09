// src/pages/ContactPage.jsx
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

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

const C = {
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.08)",
  primaryBorder: "rgba(15,118,110,0.16)",
  border: "rgba(15,23,42,0.08)",
  white: "#ffffff",
  surface: "#f8f9fb",
};

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "premium", label: "Premium Billing" },
  { value: "listing", label: "Listing Issue" },
  { value: "report", label: "Report a User / Listing" },
  { value: "technical", label: "Technical Problem" },
  { value: "other", label: "Something Else" },
];

const CONTACT_CARDS = [
  {
    icon: <EmailRoundedIcon />,
    label: "Email Us",
    value: "support@easydeal.in",
    sub: "We usually reply within 24 hours.",
    color: "#0369a1",
    iconBg: "rgba(3,105,161,0.10)",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.30))",
  },
  {
    icon: <PhoneRoundedIcon />,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Sat, 9 AM to 6 PM IST",
    color: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.28))",
  },
  {
    icon: <LocationOnRoundedIcon />,
    label: "Office",
    value: "Bengaluru, Karnataka",
    sub: "560001, India",
    color: "#c2410c",
    iconBg: "rgba(194,65,12,0.10)",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.28))",
  },
  {
    icon: <AccessTimeRoundedIcon />,
    label: "Support Hours",
    value: "Mon–Sat",
    sub: "9:00 AM – 6:00 PM IST",
    color: "#7c3aed",
    iconBg: "rgba(124,58,237,0.10)",
    bg: "linear-gradient(135deg, rgba(196,181,253,0.55), rgba(254,202,202,0.28))",
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

const ALT_OPTIONS = [
  {
    icon: <EmailRoundedIcon sx={{ fontSize: 28 }} />,
    title: "Email Support",
    desc: "Write to us for account, billing, listing, or partnership queries. Best for detailed issues that need a full explanation.",
    badge: "24h reply",
    iconColor: "#0369a1",
    iconBg: "rgba(3,105,161,0.10)",
    badgeColor: "#0369a1",
    badgeBg: "rgba(3,105,161,0.10)",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
  },
  {
    icon: <ChatRoundedIcon sx={{ fontSize: 28 }} />,
    title: "Live Chat",
    desc: "Need a quick answer? Chat with our team during support hours for faster guidance on common questions.",
    badge: "Mon–Sat 9–6",
    iconColor: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
    badgeColor: "#166534",
    badgeBg: "rgba(22,101,52,0.10)",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
  },
  {
    icon: <HelpOutlineRoundedIcon sx={{ fontSize: 28 }} />,
    title: "FAQ Help Center",
    desc: "Explore quick answers, platform rules, and buying and selling guidance without waiting for a reply.",
    badge: "Instant answers",
    iconColor: "#c2410c",
    iconBg: "rgba(194,65,12,0.10)",
    badgeColor: "#c2410c",
    badgeBg: "rgba(194,65,12,0.10)",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
    to: "/faq",
  },
];

const SOCIALS = [
  {
    icon: <InstagramIcon />,
    label: "Instagram",
    color: "#be185d",
    bg: "rgba(190,24,93,0.10)",
  },
  {
    icon: <TwitterIcon />,
    label: "Twitter",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.10)",
  },
  {
    icon: <LinkedInIcon />,
    label: "LinkedIn",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.10)",
  },
];

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
        py: 0.55,
        borderRadius: "999px",
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
        fontSize: { xs: "1.85rem", md: "2.45rem" },
        fontWeight: 900,
        color: C.text,
        lineHeight: 1.15,
        letterSpacing: "-0.03em",
        textAlign: center ? "center" : "left",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function StatPill({ value, label }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.35rem", md: "1.55rem" },
          fontWeight: 900,
          color: C.text,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: "0.78rem",
          color: C.muted,
          fontWeight: 700,
          lineHeight: 1.45,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function ContactInfoCard({ item }) {
  return (
    <Box
      sx={{
        height: "100%",
        p: { xs: 3, md: 3.5 },
        borderRadius: "26px",
        background: item.bg,
        border: "1px solid rgba(255,255,255,0.86)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1.15,
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 38px rgba(15,23,42,0.09)",
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          bgcolor: "rgba(255,255,255,0.78)",
          display: "grid",
          placeItems: "center",
          color: item.color,
          boxShadow: "0 6px 18px rgba(15,23,42,0.07)",
          "& svg": { fontSize: 24 },
        }}
      >
        {item.icon}
      </Box>

      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.faint,
        }}
      >
        {item.label}
      </Typography>

      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 800,
          color: C.text,
          lineHeight: 1.35,
          maxWidth: "18ch",
        }}
      >
        {item.value}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.82rem",
          color: C.muted,
          lineHeight: 1.65,
          maxWidth: "24ch",
        }}
      >
        {item.sub}
      </Typography>
    </Box>
  );
}

function QuickLinkCard({ item }) {
  return (
    <Box
      component={RouterLink}
      to={item.to}
      sx={{
        textDecoration: "none",
        height: "100%",
        p: 1.8,
        borderRadius: "16px",
        bgcolor: "#fff",
        border: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1,
        transition: "all 0.18s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          bgcolor: item.bg,
          borderColor: "rgba(15,23,42,0.06)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
        },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          bgcolor: item.bg,
          color: item.color,
          display: "grid",
          placeItems: "center",
          "& svg": { fontSize: 18 },
        }}
      >
        {item.icon}
      </Box>

      <Typography
        sx={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.35,
        }}
      >
        {item.label}
      </Typography>
    </Box>
  );
}

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

  const { user } = useAppState();
  const isLoggedIn = Boolean(user?.loggedIn);

  const inputSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "16px",
        bgcolor: "#ffffff",
        fontSize: "0.92rem",
        "& fieldset": {
          borderColor: C.border,
          borderWidth: "1.5px",
        },
        "&:hover fieldset": {
          borderColor: "rgba(15,23,42,0.18)",
        },
        "&.Mui-focused fieldset": {
          borderColor: C.primary,
          borderWidth: "1.5px",
        },
      },
      "& .MuiInputLabel-root": {
        fontSize: "0.88rem",
        color: C.muted,
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: C.primary,
      },
      "& .MuiFormHelperText-root": {
        ml: 0.5,
        mt: 0.8,
      },
    }),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
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
    <Box sx={{ bgcolor: C.surface, overflowX: "hidden" }}>
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
        <Blob top="10px" right="-60px" size={260} color="rgba(196,181,253,0.30)" />
        <Blob bottom="-60px" left="38%" size={220} color="rgba(187,247,208,0.35)" />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <SectionLabel>Get in Touch</SectionLabel>

          <SectionHeading center sx={{ mb: 2 }}>
            We&apos;d Love to
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Hear From You
            </Box>
          </SectionHeading>

          <Typography
            sx={{
              fontSize: { xs: "0.96rem", md: "1.04rem" },
              color: C.muted,
              lineHeight: 1.9,
              mb: 5,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            Have a question, issue, or just want to say hello? Our team is here to help with listings,
            premium plans, billing, and platform support.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 0 }}
            divider={<Box sx={{ width: "1px", bgcolor: C.border, display: { xs: "none", sm: "block" } }} />}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "24px",
              border: `1px solid ${C.border}`,
              boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
              px: { xs: 2.5, sm: 0 },
              py: { xs: 3, sm: 2.75 },
              maxWidth: 680,
              mx: "auto",
            }}
          >
            <StatPill value="24h" label="Average response time" />
            <StatPill value="98%" label="Satisfaction rate" />
            <StatPill value="247" label="Online support available" />
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: C.surface }}>
        <Container maxWidth="lg">
          <Grid container spacing={2.5} justifyContent="center">
            {CONTACT_CARDS.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i} sx={{ display: "flex" }}>
                <ContactInfoCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{ xs: 4, md: 5 }}
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item xs={12} md={7} sx={{ display: "flex" }}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ textAlign: "center", mb: 4.5 }}>
                  <SectionLabel>Send a Message</SectionLabel>
                  <SectionHeading center sx={{ mb: 1 }}>
                    How Can We Help You?
                  </SectionHeading>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: C.muted,
                      lineHeight: 1.8,
                      maxWidth: 560,
                      mx: "auto",
                    }}
                  >
                    Fill in the form below and our team will get back to you as soon as possible.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "32px",
                    overflow: "hidden",
                    bgcolor: "#ffffff",
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 18px 48px rgba(15,23,42,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      px: { xs: 2.2, md: 3.25 },
                      py: { xs: 2.2, md: 2.75 },
                      background:
                        "linear-gradient(135deg, rgba(15,118,110,0.08), rgba(186,230,253,0.34))",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <Grid container spacing={1.5} justifyContent="center">
                      {[
                        { value: "24h", label: "Average Reply" },
                        { value: "Mon–Sat", label: "Support Window" },
                        { value: "Fast Help", label: "Billing · Listings · Tech" },
                      ].map((item, i) => (
                        <Grid item xs={12} sm={4} key={i} sx={{ display: "flex" }}>
                          <Box
                            sx={{
                              width: "100%",
                              minHeight: 88,
                              borderRadius: "18px",
                              bgcolor: "rgba(255,255,255,0.72)",
                              border: "1px solid rgba(255,255,255,0.7)",
                              px: 2,
                              py: 1.5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                color: C.faint,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                mb: 0.4,
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: item.value === "Fast Help" ? "0.82rem" : "1rem",
                                fontWeight: 800,
                                color: C.text,
                                lineHeight: 1.35,
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                      p: { xs: 2.5, md: 3.25 },
                    }}
                  >
                    <Grid container spacing={2.2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            mb: 0.8,
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            color: C.text,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          Full Name
                        </Typography>
                        <TextField
                          fullWidth
                          name="name"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          required
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              borderRadius: "18px",
                              bgcolor: "#f8fafc",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              py: 1.7,
                            },
                            "& .MuiInputLabel-root": {
                              display: "none",
                            },
                            "& .MuiFormHelperText-root": {
                              mt: 0.9,
                              textAlign: "center",
                              fontSize: "0.76rem",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            mb: 0.8,
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            color: C.text,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          Email Address
                        </Typography>
                        <TextField
                          fullWidth
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={form.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          required
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              borderRadius: "18px",
                              bgcolor: "#f8fafc",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              py: 1.7,
                            },
                            "& .MuiInputLabel-root": {
                              display: "none",
                            },
                            "& .MuiFormHelperText-root": {
                              mt: 0.9,
                              textAlign: "center",
                              fontSize: "0.76rem",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            mb: 0.8,
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            color: C.text,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          Phone Number
                        </Typography>
                        <TextField
                          fullWidth
                          name="phone"
                          placeholder="Optional"
                          value={form.phone}
                          onChange={handleChange}
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              borderRadius: "18px",
                              bgcolor: "#f8fafc",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              py: 1.7,
                            },
                            "& .MuiInputLabel-root": {
                              display: "none",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          sx={{
                            mb: 0.8,
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            color: C.text,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          Subject
                        </Typography>
                        <TextField
                          select
                          fullWidth
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              borderRadius: "18px",
                              bgcolor: "#f8fafc",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              py: 1.7,
                            },
                            "& .MuiInputLabel-root": {
                              display: "none",
                            },
                          }}
                        >
                          {SUBJECTS.map((s) => (
                            <MenuItem key={s.value} value={s.value} sx={{ fontSize: "0.9rem" }}>
                              {s.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            mb: 0.8,
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            color: C.text,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textAlign: "center",
                          }}
                        >
                          Your Message
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message || `${form.message.length} characters`}
                          placeholder="Tell us how we can help. The more detail you provide, the faster we can assist you."
                          sx={{
                            ...inputSx,
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              borderRadius: "22px",
                              bgcolor: "#f8fafc",
                              alignItems: "flex-start",
                            },
                            "& textarea.MuiInputBase-input": {
                              textAlign: "left",
                              py: 0,
                            },
                            "& .MuiInputLabel-root": {
                              display: "none",
                            },
                            "& .MuiFormHelperText-root": {
                              mt: 0.9,
                              textAlign: "center",
                              fontSize: "0.76rem",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            mt: 0.5,
                            p: { xs: 2, md: 2.4 },
                            borderRadius: "22px",
                            background:
                              "linear-gradient(135deg, rgba(240,253,249,0.95), rgba(239,246,255,0.95))",
                            border: `1px solid ${C.primaryBorder || "rgba(15,118,110,0.18)"}`,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              color: C.muted,
                              lineHeight: 1.7,
                              mb: 2,
                              maxWidth: 460,
                              mx: "auto",
                            }}
                          >
                            Please include enough detail so we can resolve your issue faster.
                          </Typography>

                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendRoundedIcon />}
                            sx={{
                              minHeight: 54,
                              minWidth: { xs: "100%", sm: 260 },
                              px: 4.5,
                              borderRadius: "16px",
                              textTransform: "none",
                              fontWeight: 800,
                              fontSize: "1rem",
                              bgcolor: C.primary,
                              boxShadow: "0 10px 28px rgba(15,118,110,0.24)",
                              "&:hover": {
                                bgcolor: C.primaryHover,
                                boxShadow: "0 14px 36px rgba(15,118,110,0.32)",
                              },
                              "&.Mui-disabled": {
                                bgcolor: "rgba(15,118,110,0.45)",
                                color: "#fff",
                              },
                            }}
                          >
                            {loading ? "Sending..." : "Send Message"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: "flex" }}>
              <Box
                sx={{
                  width: "100%",
                  position: { md: "sticky" },
                  top: { md: 90 },
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Box
                    sx={{
                      width: "100%",
                      p: { xs: 2.5, md: 3 },
                      borderRadius: "28px",
                      bgcolor: "#ffffff",
                      border: `1px solid ${C.border}`,
                      boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: C.faint,
                        mb: 2.2,
                      }}
                    >
                      Quick Links
                    </Typography>

                    <Grid container spacing={1.4} justifyContent="center">
                      {QUICK_LINKS.map((item, i) => (
                        <Grid item xs={6} key={i} sx={{ display: "flex" }}>
                          <QuickLinkCard item={item} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      p: 3,
                      borderRadius: "28px",
                      background: "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(186,230,253,0.4))",
                      border: "1px solid rgba(255,255,255,0.88)",
                      textAlign: "center",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
                    }}
                  >
                    <Stack spacing={1.35} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "15px",
                          bgcolor: "rgba(22,101,52,0.10)",
                          display: "grid",
                          placeItems: "center",
                          color: "#166534",
                          "& svg": { fontSize: 22 },
                        }}
                      >
                        <SupportAgentRoundedIcon />
                      </Box>

                      <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text }}>
                        What to expect
                      </Typography>

                      {[
                        "We read every message personally.",
                        "First response usually within 24 hours.",
                        "Complex issues are typically resolved in 48–72 hours.",
                        "You’ll receive follow-ups until the issue is solved.",
                      ].map((txt, i) => (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                          justifyContent="center"
                          sx={{ maxWidth: 330 }}
                        >
                          <CheckCircleRoundedIcon
                            sx={{ fontSize: 16, color: "#166534", mt: "2px", flexShrink: 0 }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              color: C.muted,
                              lineHeight: 1.65,
                              textAlign: "left",
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
                      width: "100%",
                      p: 3,
                      borderRadius: "28px",
                      background: "linear-gradient(135deg, rgba(196,181,253,0.45), rgba(254,202,202,0.30))",
                      border: "1px solid rgba(255,255,255,0.88)",
                      textAlign: "center",
                      boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.text, mb: 0.5 }}>
                      Follow EasyDeal
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: C.muted, lineHeight: 1.7, mb: 2.2 }}>
                      Stay updated with the latest listings, platform tips, and product news.
                    </Typography>

                    <Stack direction="row" spacing={1.2} justifyContent="center">
                      {SOCIALS.map((s, i) => (
                        <Box
                          key={i}
                          title={s.label}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "14px",
                            bgcolor: s.bg,
                            display: "grid",
                            placeItems: "center",
                            color: s.color,
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                            "& svg": { fontSize: 20 },
                            "&:hover": {
                              transform: "translateY(-2px) scale(1.04)",
                              boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
                            },
                          }}
                        >
                          {s.icon}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 11 },
          background: "linear-gradient(160deg, #f0fdf9 0%, #eff6ff 60%, #fdf4ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Blob top="-60px" right="-40px" size={280} color="rgba(196,181,253,0.28)" />
        <Blob bottom="-60px" left="-40px" size={260} color="rgba(187,247,208,0.32)" />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 6.5 }}>
            <SectionLabel>Other Ways to Reach Us</SectionLabel>
            <SectionHeading center sx={{ mb: 1.5 }}>
              Pick What Works Best for You
            </SectionHeading>
            <Typography
              sx={{
                fontSize: "1rem",
                color: C.muted,
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.85,
              }}
            >
              Whether you prefer chat, email, or self-service help, we’ve got every support channel covered.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {ALT_OPTIONS.map((card, i) => (
              <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    p: { xs: 3.5, md: 4 },
                    borderRadius: "28px",
                    background: card.bg,
                    border: "1px solid rgba(255,255,255,0.88)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 16px 44px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2} sx={{ mb: 2.4 }}>
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        borderRadius: "17px",
                        bgcolor: card.iconBg,
                        display: "grid",
                        placeItems: "center",
                        color: card.iconColor,
                        boxShadow: "0 6px 18px rgba(15,23,42,0.07)",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.5,
                        borderRadius: "999px",
                        bgcolor: card.badgeBg,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          color: card.badgeColor,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {card.badge}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography sx={{ fontWeight: 800, fontSize: "1.08rem", color: C.text, mb: 1 }}>
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      color: C.muted,
                      lineHeight: 1.8,
                      flex: 1,
                      maxWidth: "30ch",
                      mb: 3,
                    }}
                  >
                    {card.desc}
                  </Typography>

                  <Button
                    component={card.to ? RouterLink : "button"}
                    to={card.to}
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "15px !important" }} />}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                      minHeight: 42,
                      px: 2.8,
                      borderColor: "rgba(255,255,255,0.85)",
                      bgcolor: "rgba(255,255,255,0.66)",
                      color: card.iconColor,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.92)",
                        borderColor: "rgba(255,255,255,0.95)",
                        boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
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
            Ready to start?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.85rem", md: "2.7rem" },
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
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
              color: "rgba(255,255,255,0.76)",
              mb: 5,
              maxWidth: 460,
              mx: "auto",
              lineHeight: 1.85,
            }}
          >
            {isLoggedIn
              ? "Explore listings, manage your account, and keep moving with confidence on EasyDeal."
              : "Join thousands of happy users, sign up free, and get live in minutes."}
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
                  fontWeight: 800,
                  fontSize: "1rem",
                  bgcolor: "#ffffff",
                  color: C.primary,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
                  "&:hover": {
                    bgcolor: "#f0fdf9",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Create Free Account
              </Button>
            )}

            <Button
              component={RouterLink}
              to="/faq"
              variant="outlined"
              sx={{
                minHeight: 52,
                px: 4,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
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
            fontWeight: 700,
            fontSize: "0.9rem",
            bgcolor: "#ffffff",
            color: C.text,
            border: "1.5px solid rgba(22,101,52,0.18)",
            boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
            "& .MuiAlert-icon": { color: "#166534" },
          }}
        >
          Message sent! We&apos;ll get back to you within 24 hours.
        </Alert>
      </Snackbar>
    </Box>
  );
}