// src/pages/PrivacyPolicyPage.jsx
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import DataUsageRoundedIcon from "@mui/icons-material/DataUsageRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";

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
    icon: <ShieldRoundedIcon />,
    title: "Your data stays protected",
    desc: "We use reasonable security measures to protect account, listing, and contact information.",
    bg: "linear-gradient(135deg, rgba(186,230,253,0.55), rgba(196,181,253,0.35))",
    iconColor: "#0369a1",
    iconBg: "rgba(3,105,161,0.10)",
  },
  {
    icon: <VisibilityRoundedIcon />,
    title: "We explain what we collect",
    desc: "This page clearly outlines what information we collect, why we collect it, and how it is used.",
    bg: "linear-gradient(135deg, rgba(187,247,208,0.55), rgba(254,240,138,0.35))",
    iconColor: "#166534",
    iconBg: "rgba(22,101,52,0.10)",
  },
  {
    icon: <LockRoundedIcon />,
    title: "You stay in control",
    desc: "You can contact us to request updates, corrections, or deletion of your personal information where applicable.",
    bg: "linear-gradient(135deg, rgba(254,215,170,0.55), rgba(251,207,232,0.35))",
    iconColor: "#c2410c",
    iconBg: "rgba(194,65,12,0.10)",
  },
];

const SECTIONS = [
  {
    icon: <InfoRoundedIcon />,
    title: "Information We Collect",
    color: "#0369a1",
    bg: "rgba(3,105,161,0.08)",
    points: [
      "Account details such as your name, email address, phone number, and login credentials when you create an account.",
      "Listing information you submit, including property details, vehicle details, pricing, descriptions, images, and location data.",
      "Communication data when you contact support, send inquiries, or interact with sellers and buyers through the platform.",
      "Technical information such as browser type, device information, IP address, approximate location, and usage logs for performance and security.",
    ],
  },
  {
    icon: <DataUsageRoundedIcon />,
    title: "How We Use Your Information",
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
    points: [
      "To create and manage your account and enable you to post, browse, and manage listings.",
      "To verify accounts, review listings, prevent misuse, improve platform safety, and reduce fraudulent activity.",
      "To process premium upgrades, billing-related actions, and customer support requests.",
      "To improve user experience, platform features, search quality, and site performance based on usage patterns.",
    ],
  },
  {
    icon: <VisibilityRoundedIcon />,
    title: "What Information May Be Visible",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    points: [
      "Listing details you intentionally publish, such as photos, descriptions, category, and pricing, may be visible to platform users.",
      "We do not publicly display sensitive account information such as passwords or private payment details.",
      "Contact information is only shared in accordance with the product flow and account permissions configured on the platform.",
      "You are responsible for the accuracy and appropriateness of the content you choose to publish in your listings.",
    ],
  },
  {
    icon: <LockRoundedIcon />,
    title: "Data Security",
    color: "#be185d",
    bg: "rgba(190,24,93,0.08)",
    points: [
      "We apply administrative, technical, and operational safeguards designed to protect personal information from unauthorized access or misuse.",
      "Access to sensitive systems and information is restricted to authorized personnel who need it to operate or support the platform.",
      "While we strive to protect your information, no online transmission or storage method can be guaranteed to be completely secure.",
      "Users should also help protect their own accounts by using strong passwords and not sharing login credentials.",
    ],
  },
  {
    icon: <GavelRoundedIcon />,
    title: "Sharing & Legal Compliance",
    color: "#a16207",
    bg: "rgba(161,98,7,0.08)",
    points: [
      "We may share information with trusted service providers who help us operate payments, communications, hosting, moderation, and support functions.",
      "We may disclose information when required by law, lawful request, regulatory obligation, or to protect platform integrity and user safety.",
      "We do not sell personal information as a standalone commercial product.",
      "Any third-party access is limited to the extent reasonably necessary to support the service or meet legal obligations.",
    ],
  },
  {
    icon: <PolicyRoundedIcon />,
    title: "Your Rights & Contact",
    color: "#0f766e",
    bg: "rgba(15,118,110,0.08)",
    points: [
      "You may contact us to review, update, or request deletion of certain personal information, subject to legal and operational requirements.",
      "You may close your account by contacting support or using available account management settings, where provided.",
      "We may retain certain records for fraud prevention, dispute handling, compliance, or backup purposes where necessary.",
      "For any privacy questions, contact our team at support@easydeal.in and we will respond within a reasonable time.",
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

function PolicyCard({ icon, title, desc, bg, iconColor, iconBg }) {
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

export default function PrivacyPolicyPage() {
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
          <SectionLabel>Privacy Policy</SectionLabel>

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
            Your Privacy
            <br />
            <Box component="span" sx={{ color: C.primary }}>
              Matters to Us
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
            This Privacy Policy explains how EasyDeal collects, uses, stores, and protects information when you use our platform to browse, buy, sell, or manage listings.
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
              { val: "Transparent", label: "Collection & usage" },
              { val: "Protected", label: "Security practices" },
              { val: "Updated", label: "Last reviewed policy" },
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
                <PolicyCard {...item} />
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

                <Stack spacing={1}>
                  {SECTIONS.map((section, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 1.5,
                        py: 1.2,
                        borderRadius: "12px",
                        bgcolor: "rgba(15,23,42,0.02)",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "9px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: section.bg,
                          color: section.color,
                          "& svg": { fontSize: 17 },
                          flexShrink: 0,
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: C.text, lineHeight: 1.35 }}>
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
                      Privacy questions?
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.84rem", color: C.muted, lineHeight: 1.75, mb: 2 }}>
                    Contact us at support@easydeal.in for privacy concerns, data corrections, or account-related information requests.
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
                <SectionLabel>Policy Details</SectionLabel>
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
                  How EasyDeal Handles Data
                </Typography>
                <Typography sx={{ fontSize: "0.93rem", color: C.muted, lineHeight: 1.8 }}>
                  We aim to keep this policy readable, practical, and aligned with how users actually interact with the platform.
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

      {/* Important note */}
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
                  Policy updates may happen as the platform evolves
                </Typography>
                <Typography sx={{ fontSize: "0.92rem", color: C.muted, lineHeight: 1.85, mb: 2.5 }}>
                  We may update this Privacy Policy from time to time to reflect product changes, legal requirements, safety improvements, or operational updates. Continued use of the platform after an update means you accept the revised policy.
                </Typography>

                <Stack spacing={1.15}>
                  {[
                    "Review this page periodically for the latest version.",
                    "Material updates may also be reflected through platform notices or communications.",
                    "Questions about changes can always be sent to our support team.",
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
                  Need the Terms too?
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
                  Privacy Policy and Terms of Service work together. Review both documents to understand your rights, responsibilities, and platform rules.
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
            Need help with privacy?
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
            Questions About Your Data
            <br />
            or Account Information?
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.72)",
              mb: 5,
              maxWidth: 460,
              mx: "auto",
              lineHeight: 1.85,
            }}
          >
            Reach out to our team for privacy concerns, account questions, or support-related clarifications.
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
    </Box>
  );
}