// src/pages/TermsOfServicePage.jsx
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

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
    icon: <HandshakeRoundedIcon />,
    title: "Fair & transparent rules",
    desc: "Our terms are written in plain language — no legal jargon — so you know exactly what to expect from us and what we expect from you.",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
    iconColor: "#0369a1",
    iconBg: "rgba(3,105,161,0.10)",
  },
  {
    icon: <ShieldRoundedIcon />,
    title: "Platform integrity first",
    desc: "These terms exist to keep EasyDeal safe, trustworthy, and useful for everyone — buyers, sellers, and the broader community.",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
    iconColor: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
  },
  {
    icon: <UpdateRoundedIcon />,
    title: "Terms may be updated",
    desc: "We may revise these terms as the platform evolves. Continued use after changes means you accept the updated terms.",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
    iconColor: "#c2410c",
    iconBg: "rgba(194,65,12,0.10)",
  },
];

const SECTIONS = [
  {
    icon: <InfoRoundedIcon />,
    title: "Acceptance of Terms",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    points: [
      "By accessing or using EasyDeal, you confirm that you have read, understood, and agree to be bound by these Terms of Service.",
      "If you do not agree with any part of these terms, you should discontinue use of the platform immediately.",
      "These terms apply to all users of the platform including visitors, registered users, and premium subscribers.",
      "We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of the revised terms.",
    ],
  },
  {
    icon: <PersonRoundedIcon />,
    title: "User Accounts & Eligibility",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    points: [
      "You must be at least 18 years of age to create an account and use EasyDeal's services.",
      "You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with others.",
      "You agree to provide accurate, complete, and current information during registration and to keep your account details updated.",
      "EasyDeal reserves the right to suspend or terminate accounts that violate these terms, without prior notice where necessary.",
    ],
  },
  {
    icon: <ListAltRoundedIcon />,
    title: "Listing Rules & Content",
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
    points: [
      "All listings must be accurate, truthful, and describe actual items or properties that you legally own or are authorized to sell.",
      "You must not post duplicate, misleading, spam, or fraudulent listings. Violations may result in immediate listing removal.",
      "EasyDeal reviews listings before they go live and reserves the right to reject or remove content that violates these terms.",
      "You retain ownership of the content you post, but grant EasyDeal a license to display it on the platform for the purpose of facilitating transactions.",
    ],
  },
  {
    icon: <WorkspacePremiumRoundedIcon />,
    title: "Premium Plans & Payments",
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    points: [
      "Premium plans provide additional features such as unlimited listings, priority placement, and direct contact access, as described on our pricing page.",
      "All payments are one-time and processed securely through Razorpay. EasyDeal does not store your card or payment details.",
      "Refunds are available within 7 days of purchase if you are not satisfied. Contact support to initiate a refund request.",
      "EasyDeal reserves the right to modify pricing or plan features at any time. Existing purchases are honoured for their stated term.",
    ],
  },
  {
    icon: <ReportProblemRoundedIcon />,
    title: "Prohibited Activities",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    points: [
      "You may not use EasyDeal to post illegal content, conduct fraud, impersonate others, or engage in any activity that violates applicable law.",
      "Scraping, automated data extraction, or reverse engineering of any part of the platform without written permission is strictly prohibited.",
      "Harassment, abuse, or threatening behaviour toward other users, sellers, buyers, or EasyDeal staff will result in immediate account suspension.",
      "You may not attempt to manipulate search rankings, misuse the reporting system, or interfere with the normal operation of the platform.",
    ],
  },
  {
    icon: <BlockRoundedIcon />,
    title: "Disclaimers & Limitation of Liability",
    color: "#be185d",
    bg: "rgba(190,24,93,0.08)",
    points: [
      "EasyDeal is a listing platform only. We do not guarantee the accuracy of listings, the quality of items sold, or the outcome of any transaction.",
      "All transactions between buyers and sellers are conducted independently. EasyDeal is not a party to any transaction and is not responsible for disputes.",
      "To the maximum extent permitted by law, EasyDeal shall not be liable for indirect, incidental, or consequential damages arising from use of the platform.",
      "We make no warranty that the platform will be uninterrupted, error-free, or free from viruses or other harmful components.",
    ],
  },
  {
    icon: <GavelRoundedIcon />,
    title: "Governing Law & Disputes",
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    points: [
      "These terms are governed by the laws of India. Any disputes arising shall be subject to the jurisdiction of courts in Bengaluru, Karnataka.",
      "We encourage users to first attempt to resolve disputes by contacting our support team before pursuing any formal legal action.",
      "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
      "These terms constitute the entire agreement between you and EasyDeal regarding your use of the platform.",
    ],
  },
  {
    icon: <PolicyRoundedIcon />,
    title: "Changes & Contact",
    color: "#0f766e",
    bg: "rgba(15,118,110,0.08)",
    points: [
      "EasyDeal reserves the right to modify, suspend, or discontinue any part of the platform at any time without prior notice.",
      "We may send service-related notices about changes to terms, policies, or significant platform updates via email to your registered address.",
      "For questions, concerns, or clarifications about these Terms of Service, contact us at support@easydeal.in.",
      "We will respond to all terms-related queries within a reasonable timeframe and work to resolve concerns fairly.",
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
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "0.98rem",
            color: C.text,
            lineHeight: 1.35,
            mb: 0.45,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.84rem", color: C.muted, lineHeight: 1.7 }}>
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

export default function TermsOfServicePage() {
  return (
    <Box sx={{ bgcolor: "#f8f9fb", overflowX: "hidden" }}>
      {/* Hero */}
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
          <SectionLabel>Terms of Service</SectionLabel>

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
            Simple Rules for a
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Trusted Platform
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: C.muted,
              lineHeight: 1.85,
              mb: 5,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            These Terms of Service govern your use of EasyDeal. By using our platform, you agree to follow these guidelines to ensure a safe and trustworthy experience for all users.
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
              { val: "8", label: "Sections covered" },
              { val: "Plain", label: "Language used" },
              { val: "India", label: "Governing jurisdiction" },
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

      {/* Highlights */}
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

      {/* Main content */}
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
                      Questions about terms?
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.83rem", color: C.muted, lineHeight: 1.75, mb: 2 }}>
                    Reach us at support@easydeal.in for any clarifications about these Terms of Service.
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

                <Box
                  sx={{
                    mt: 2,
                    p: 2.5,
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, rgba(196,181,253,0.45), rgba(254,202,202,0.3))",
                    border: "1px solid rgba(255,255,255,0.88)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "10px",
                      bgcolor: "rgba(124,58,237,0.10)",
                      display: "grid",
                      placeItems: "center",
                      color: "#7c3aed",
                      "& svg": { fontSize: 19 },
                      flexShrink: 0,
                    }}
                  >
                    <PolicyRoundedIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: C.text, mb: 0.2 }}>
                      Privacy Policy
                    </Typography>
                    <Box
                      component={RouterLink}
                      to="/privacy-policy"
                      sx={{
                        fontSize: "0.78rem",
                        color: "#7c3aed",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Read how we handle your data →
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <SectionLabel>Terms Details</SectionLabel>
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
                  Full Terms & Conditions
                </Typography>
                <Typography sx={{ fontSize: "0.93rem", color: C.muted, lineHeight: 1.8 }}>
                  These terms are effective from the moment you access EasyDeal. Please read them carefully.
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
                        <Box
                          sx={{
                            flexShrink: 0,
                            px: 1,
                            py: 0.3,
                            borderRadius: "7px",
                            bgcolor: section.bg,
                          }}
                        >
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

      {/* Related docs */}
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
                <SectionLabel>Key Reminder</SectionLabel>
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
                  Using EasyDeal means you agree to these terms
                </Typography>
                <Typography sx={{ fontSize: "0.92rem", color: C.muted, lineHeight: 1.85, mb: 2.5 }}>
                  These terms exist to ensure EasyDeal remains a fair, safe, and trustworthy marketplace. By creating an account or posting a listing, you acknowledge and agree to all provisions outlined here.
                </Typography>

                <Stack spacing={1.15}>
                  {[
                    "Continued platform use after updates implies acceptance of the latest terms.",
                    "Violations may result in listing removal, account suspension, or access restriction.",
                    "These terms work in conjunction with our Privacy Policy.",
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
                  background: "linear-gradient(135deg, rgba(196,181,253,0.55), rgba(254,202,202,0.35))",
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
                    bgcolor: "rgba(124,58,237,0.10)",
                    display: "grid",
                    placeItems: "center",
                    color: "#7c3aed",
                    mb: 2.25,
                    boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
                  }}
                >
                  <PolicyRoundedIcon sx={{ fontSize: 28 }} />
                </Box>

                <Typography sx={{ fontWeight: 850, fontSize: "1.15rem", color: C.text, mb: 1 }}>
                  Also read our Privacy Policy
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
                  Our Privacy Policy explains how EasyDeal collects, uses, and protects your personal data. Together with these Terms, it forms the complete agreement between you and us.
                </Typography>

                <Button
                  component={RouterLink}
                  to="/privacy-policy"
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
                    color: "#7c3aed",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      borderColor: "rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                    },
                  }}
                >
                  View Privacy Policy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA banner */}
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
            Create a free account and start browsing or listing today — it takes less than a minute.
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
                  bgcolor: "rgba(255,255,255,0.09)",
                },
              }}
            >
              Contact Support
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}