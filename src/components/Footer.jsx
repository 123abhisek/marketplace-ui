// src/components/Footer.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const LINKS = {
  Marketplace: [
    { label: "Home", href: "/" },
    { label: "Explore Listings", href: "/explore" },
    { label: "Upgrade Premium", href: "/subscription" },
    { label: "Become Seller", href: "/become-seller" },
    { label: "How It Works", href: "/how-it-works" },
  ],
  Account: [
    { label: "Login / Register", href: "/login" },
    { label: "My Dashboard", href: "/dashboard/home" },
    { label: "My Listings", href: "/dashboard/my-listings" },
    { label: "Seller Dashboard", href: "/seller/overview" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#0F172A",
        color: "#F8FAFC",
        pt: { xs: 6, md: 8 },
        pb: 4,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Brand & Client Profile */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 1,
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="/icon.png"
                    alt="EasyDeal"
                    sx={{
                      height: 44,
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={900}
                  letterSpacing="-0.02em"
                  color="#FFFFFF"
                >
                  EasyDeal
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: "#94A3B8", lineHeight: 1.7, fontSize: "0.875rem" }}
              >
                One unified marketplace for buying and selling property, land,
                <br></br>
                and vehicles with premium verification and direct on-ground
                assistance.
              </Typography>

              {/* Client Contact Profile */}
              <Stack spacing={1.2} pt={1}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <PhoneRoundedIcon sx={{ fontSize: 18, color: "#0F766E" }} />
                  <Box
                    component="a"
                    href="tel:8088185203"
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      "&:hover": { color: "#2DD4BF" },
                    }}
                  >
                    Phone: 8088185203
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <WhatsAppIcon sx={{ fontSize: 18, color: "#25D366" }} />
                  <Box
                    component="a"
                    href="https://wa.me/918088185203?text=I%20would%20like%20to%20know%20more%20about%20EasyDeal%20Platform"
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      "&:hover": { color: "#25D366" },
                    }}
                  >
                    WhatsApp: 8088185203
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <EmailRoundedIcon sx={{ fontSize: 18, color: "#0F766E" }} />
                  <Box
                    component="a"
                    href="mailto:Easydealhelpdesk03@gmail.com"
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      "&:hover": { color: "#2DD4BF" },
                    }}
                  >
                    Easydealhelpdesk03@gmail.com
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <LanguageIcon sx={{ fontSize: 18, color: "#0F766E" }} />
                  <Box
                    component="a"
                    href="https://easydealworld.com/"
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      "&:hover": { color: "#2DD4BF" },
                    }}
                  >
                    https://easydealworld.com/
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <InstagramIcon sx={{ fontSize: 18, color: "#E4405F" }} />
                  <Box
                    component="a"
                    href="https://www.instagram.com/easydeal_connect?igsi=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "#CBD5E1",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      "&:hover": { color: "#E4405F" },
                    }}
                  >
                    @easydeal_connect
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          {/* Navigation Links Columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <Grid item xs={12} sm={4} md={2.6} key={category}>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color="#FFFFFF"
                letterSpacing="0.05em"
                textTransform="uppercase"
                mb={2}
              >
                {category}
              </Typography>
              <Stack spacing={1.2}>
                {links.map((link) => (
                  <Box
                    key={link.label}
                    component={RouterLink}
                    to={link.href}
                    sx={{
                      color: "#94A3B8",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      "&:hover": { color: "#38BDF8" },
                    }}
                  >
                    {link.label}
                  </Box>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Direct Assistance Highlight Banner */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(15,118,110,0.15) 0%, rgba(30,41,59,0.8) 100%)",
            border: "1px solid rgba(15,118,110,0.3)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <SupportAgentRoundedIcon
                sx={{ fontSize: 28, color: "#2DD4BF" }}
              />
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="#FFFFFF"
                >
                  Need On-Ground Assistance?
                </Typography>
                <Typography
                  variant="body2"
                  color="#94A3B8"
                  sx={{ fontSize: "0.825rem" }}
                >
                  Call/WhatsApp us at 8088185203 or email
                  Easydealhelpdesk03@gmail.com for direct property & vehicle
                  inspection support.
                </Typography>
              </Box>
            </Stack>
            <Box
              component="a"
              href="tel:8088185203"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "10px",
                background: "#0F766E",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                "&:hover": { background: "#0D6B63" },
              }}
            >
              Call 8088185203
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

        {/* Bottom Developer & Client Copyright Footer */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography
            variant="body2"
            color="#94A3B8"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            © 2026 EasyDeal World. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" color="#64748B">
              Developer Profile:
            </Typography>
            <Box
              component="a"
              href="https://teamca.in"
              target="_blank"
              rel="noreferrer"
              sx={{
                color: "#38BDF8",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              teamca.in
            </Box>
            <IconButton
              component="a"
              href="https://www.instagram.com/teamca_2002?igsi=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
              size="small"
              sx={{ color: "#94A3B8", "&:hover": { color: "#E4405F" } }}
            >
              <InstagramIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
