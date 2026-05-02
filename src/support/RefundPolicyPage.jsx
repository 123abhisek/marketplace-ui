// src/pages/RefundPolicyPage.jsx
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

const C = {
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primaryHover: "#0d6b63",
  primarySoft: "rgba(15,118,110,0.08)",
  border: "rgba(15,23,42,0.08)",
};

const HIGHLIGHTS = [
  {
    icon: <AccessTimeRoundedIcon />,
    title: "7-day refund window",
    desc: "If you are not satisfied with your premium upgrade, you may request a refund within 7 days of payment.",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
    iconColor: "#0369a1",
    iconBg: "rgba(3,105,161,0.10)",
  },
  {
    icon: <WorkspacePremiumRoundedIcon />,
    title: "Applies to premium plans",
    desc: "This refund policy applies to paid premium plan purchases and related upgrade services offered on EasyDeal.",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
    iconColor: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Quick manual review",
    desc: "Refund requests are reviewed by our support team and processed fairly based on payment date and account usage.",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
    iconColor: "#c2410c",
    iconBg: "rgba(194,65,12,0.10)",
  },
];

const SECTIONS = [
  {
    icon: <InfoRoundedIcon />,
    title: "Refund Eligibility",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    points: [
      "Refund requests are accepted for premium plan purchases made on EasyDeal within 7 calendar days from the date of payment.",
      "To be eligible, the request must come from the same account that made the purchase, along with basic payment details for verification.",
      "Refund eligibility may depend on whether the premium benefits were substantially used or consumed during the active period.",
      "EasyDeal reserves the right to review each request individually to ensure fair usage and prevent abuse of the refund process.",
    ],
  },
  {
    icon: <CancelRoundedIcon />,
    title: "When Refunds May Not Apply",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    points: [
      "Requests submitted after the 7-day refund period may not be eligible for a refund.",
      "Refunds may be denied where premium features have been fully utilized, misused, or obtained through policy violations.",
      "Charges arising from third-party banking delays, payment gateway issues, or exchange rate differences are not separately refundable by EasyDeal.",
      "Refunds are not available for accounts suspended due to violations of our Terms of Service or misuse of the platform.",
    ],
  },
  {
    icon: <ReceiptLongRoundedIcon />,
    title: "How to Request a Refund",
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
    points: [
      "To request a refund, contact our support team with your registered email address, payment date, transaction reference, and reason for the request.",
      "Our team may ask for additional details if required to verify account ownership and purchase validity.",
      "Once the request is reviewed and approved, the refund is initiated through the original payment route where possible.",
      "Please ensure your submitted details are accurate to avoid delays in review and processing.",
    ],
  },
  {
    icon: <CurrencyRupeeRoundedIcon />,
    title: "Refund Processing Time",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    points: [
      "Approved refunds are generally initiated within a reasonable business period after review by the support team.",
      "Actual credit timelines may vary depending on your payment provider, bank, card issuer, or payment method.",
      "If you do not receive the refunded amount within the expected period, you should first check with your bank or payment provider.",
      "EasyDeal may provide confirmation once the refund is initiated, but final settlement timing depends on the payment network.",
    ],
  },
  {
    icon: <ReportProblemRoundedIcon />,
    title: "Special Cases & Disputes",
    color: "#be185d",
    bg: "rgba(190,24,93,0.08)",
    points: [
      "If you believe you were charged incorrectly, charged multiple times, or upgraded unintentionally, contact us as soon as possible for priority review.",
      "In special circumstances, EasyDeal may review exceptions beyond the standard policy where warranted by technical error or billing issue.",
      "Submitting false claims, manipulated proof, or repeated abusive refund requests may result in account action.",
      "We aim to resolve billing and refund issues fairly, transparently, and within a reasonable timeframe.",
    ],
  },
  {
    icon: <PolicyRoundedIcon />,
    title: "Contact for Refund Help",
    color: "#0f766e",
    bg: "rgba(15,118,110,0.08)",
    points: [
      "For refund-related assistance, contact our team at support@easydeal.in using your registered EasyDeal email address.",
      "Include purchase date, transaction ID, and your reason for the request so we can review it faster.",
      "Our support team will guide you through the next steps if additional verification is needed.",
      "We recommend reaching out as early as possible within the refund window to avoid delays or ineligibility.",
    ],
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
        py: 0.5,
        borderRadius: "20px",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

function HighlightCard({ icon, title, desc, bg, iconColor, iconBg }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: "24px",
        background: bg,
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
          bgcolor: iconBg,
          display: "grid",
          placeItems: "center",
          color: iconColor,
          "& svg": { fontSize: 22 },
          flexShrink: 0,
          boxShadow: "0 3px 10px rgba(15,23,42,0.07)",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: "0.98rem", color: C.text, lineHeight: 1.35, mb: 0.45 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.84rem", color: C.muted, lineHeight: 1.7 }}>
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

export default function RefundPolicyPage() {
  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* HERO */}
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
          <SectionLabel>Refund Policy</SectionLabel>

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
            Clear Refund Rules for
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Premium Purchases
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: C.muted,
              lineHeight: 1.85,
              mb: 5,
              maxWidth: 570,
              mx: "auto",
            }}
          >
            This Refund Policy explains when refunds may apply, how to request one, and how EasyDeal reviews refund requests for premium plan payments.
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
              { val: "7 Days", label: "Refund request window" },
              { val: "Premium", label: "Eligible purchase type" },
              { val: "Manual", label: "Support review process" },
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
                <Typography sx={{ fontSize: "0.78rem", color: C.muted, mt: 0.4, fontWeight: 600 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* HIGHLIGHTS */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8f9fb" }}>
        <Container maxWidth="lg">
          <Grid container spacing={2.5}>
            {HIGHLIGHTS.map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <HighlightCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: { md: "sticky" }, top: { md: 90 } }}>
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
                  On This Page
                </Typography>

                <Stack spacing={0.9}>
                  {SECTIONS.map((section, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1.5,
                        py: 1.1,
                        borderRadius: "12px",
                        bgcolor: "rgba(15,23,42,0.02)",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "8px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: section.bg,
                          color: section.color,
                          "& svg": { fontSize: 16 },
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: C.text, lineHeight: 1.35 }}>
                        {section.title}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: "22px",
                    background: "linear-gradient(135deg, rgba(187,247,208,0.5), rgba(186,230,253,0.4))",
                    border: "1px solid rgba(255,255,255,0.88)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        bgcolor: "rgba(15,118,110,0.10)",
                        display: "grid",
                        placeItems: "center",
                        color: C.primary,
                        "& svg": { fontSize: 21 },
                      }}
                    >
                      <EmailRoundedIcon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.98rem", color: C.text }}>
                      Need refund help?
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.83rem", color: C.muted, lineHeight: 1.75, mb: 2 }}>
                    Reach us at support@easydeal.in with your registered email and transaction details for refund assistance.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/contact"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      minHeight: 42,
                      bgcolor: C.primary,
                      boxShadow: "none",
                      "&:hover": { bgcolor: C.primaryHover, boxShadow: "none" },
                    }}
                  >
                    Contact Support
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <SectionLabel>Refund Details</SectionLabel>
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
                  Refund Process & Conditions
                </Typography>
                <Typography sx={{ fontSize: "0.93rem", color: C.muted, lineHeight: 1.8 }}>
                  We keep our billing and refund policy as clear and readable as possible so users know exactly what to expect.
                </Typography>
              </Box>

              <Stack spacing={2.5}>
                {SECTIONS.map((section, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: { xs: 2.5, md: 3.25 },
                      borderRadius: "24px",
                      bgcolor: "#ffffff",
                      border: `1px solid ${C.border}`,
                      boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "12px",
                          bgcolor: section.bg,
                          color: section.color,
                          display: "grid",
                          placeItems: "center",
                          "& svg": { fontSize: 21 },
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "1rem", md: "1.08rem" },
                            color: C.text,
                            lineHeight: 1.35,
                          }}
                        >
                          {section.title}
                        </Typography>
                        <Box sx={{ flexShrink: 0, px: 1, py: 0.3, borderRadius: "7px", bgcolor: section.bg }}>
                          <Typography
                            sx={{
                              fontSize: "0.66rem",
                              fontWeight: 800,
                              color: section.color,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>

                    <Stack spacing={1.15}>
                      {section.points.map((point, idx) => (
                        <Stack key={idx} direction="row" spacing={1.1} alignItems="flex-start">
                          <CheckCircleRoundedIcon
                            sx={{ fontSize: 17, color: section.color, mt: "3px", flexShrink: 0 }}
                          />
                          <Typography sx={{ fontSize: "0.88rem", color: C.muted, lineHeight: 1.8 }}>
                            {point}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* RELATED / NOTE */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(160deg, #f0fdf9 0%, #eff6ff 60%, #fdf4ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Blob top="-60px" right="-40px" size={280} color="rgba(196,181,253,0.28)" />
        <Blob bottom="-60px" left="-40px" size={260} color="rgba(187,247,208,0.32)" />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  height: "100%",
                  p: { xs: 3.5, md: 4.5 },
                  borderRadius: "28px",
                  background: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
                  border: "1px solid rgba(255,255,255,0.88)",
                }}
              >
                <SectionLabel>Important Note</SectionLabel>
                <Typography
                  sx={{
                    fontSize: { xs: "1.35rem", md: "1.75rem" },
                    fontWeight: 850,
                    color: C.text,
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    mb: 1.25,
                  }}
                >
                  Refund approval depends on timing and usage
                </Typography>
                <Typography sx={{ fontSize: "0.92rem", color: C.muted, lineHeight: 1.85, mb: 2.5 }}>
                  We review refund requests fairly and in context. Approval may depend on the request date, payment verification, account standing, and whether premium benefits were already significantly used.
                </Typography>
                <Stack spacing={1.15}>
                  {[
                    "Submit requests within 7 days of the original payment date.",
                    "Use your registered EasyDeal email for faster verification.",
                    "Keep your transaction reference ready when contacting support.",
                  ].map((txt, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: 16, color: "#0369a1", mt: "2px", flexShrink: 0 }}
                      />
                      <Typography sx={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.7 }}>
                        {txt}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: "100%",
                  p: { xs: 3.5, md: 4 },
                  borderRadius: "28px",
                  background: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
                  border: "1px solid rgba(255,255,255,0.88)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "16px",
                    bgcolor: "rgba(22,101,52,0.10)",
                    display: "grid",
                    placeItems: "center",
                    color: "#166534",
                    mb: 2.25,
                    boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
                  }}
                >
                  <PolicyRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontWeight: 850, fontSize: "1.15rem", color: C.text, mb: 1 }}>
                  Also review our Terms
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                    color: C.muted,
                    lineHeight: 1.8,
                    flex: 1,
                    mb: 3,
                  }}
                >
                  Our refund process works together with the Terms of Service and Privacy Policy. Review those pages for account, billing, and platform rules.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/terms"
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
                    color: "#166534",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderColor: "rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                    },
                  }}
                >
                  View Terms of Service
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
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
            Need billing support?
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
            Questions About a Payment
            <br />
            or Refund Request?
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
            Contact our support team with your transaction details and we will help you review the next steps quickly.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              component={RouterLink}
              to="/contact"
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
              Contact Support
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