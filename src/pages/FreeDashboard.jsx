
// src/pages/FreeDashboard.jsx
import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

const UI = {
  bg: "#F5F7FB",
  shell: "#FCFDFF",
  rail: "#F7F9FC",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAFC",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.12)",
  text: "#111827",
  muted: "#667085",
  faint: "#98A2B3",
  primary: "#0F766E",
  primarySoft: "rgba(15,118,110,0.10)",
  primaryBorder: "rgba(15,118,110,0.18)",
  blue: "#2563EB",
  blueSoft: "rgba(37,99,235,0.10)",
  gold: "#C98A00",
  goldSoft: "rgba(201,138,0,0.10)",
  purple: "#7C3AED",
  purpleSoft: "rgba(124,58,237,0.10)",
  success: "#16A34A",
  successSoft: "rgba(22,163,74,0.10)",
  warning: "#D97706",
  warningSoft: "rgba(217,119,6,0.10)",
  danger: "#DC2626",
  dangerSoft: "rgba(220,38,38,0.10)",
  shadowSm: "0 2px 10px rgba(15,23,42,0.04)",
  shadowMd: "0 10px 32px rgba(15,23,42,0.06)",
};

const shellSx = {
  borderRadius: { xs: "24px", md: "32px" },
  background: UI.shell,
  border: `1px solid ${UI.border}`,
  boxShadow: "0 24px 64px rgba(15,23,42,0.08)",
  overflow: "hidden",
};

const cardSx = {
  borderRadius: "22px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

const softCardSx = {
  borderRadius: "20px",
  border: `1px solid ${UI.border}`,
  background: UI.surfaceSoft,
  boxShadow: "none",
};

const sectionLabelSx = {
  fontSize: "0.74rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: UI.faint,
};

function NavItem({ icon, label, active = false }) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        px: 1.4,
        py: 1.15,
        borderRadius: "16px",
        background: active ? "#fff" : "transparent",
        border: active ? `1px solid ${UI.border}` : "1px solid transparent",
        boxShadow: active ? UI.shadowSm : "none",
        color: active ? UI.text : UI.muted,
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          background: active ? UI.primarySoft : "transparent",
          color: active ? UI.primary : UI.faint,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: "0.88rem", fontWeight: active ? 800 : 700 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function SummaryCard({ icon, label, value, tone, soft, sub }) {
  return (
    <Card sx={{ ...cardSx, height: "100%" }}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1.25}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              background: soft,
              color: tone,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: "1.6rem",
              lineHeight: 1,
              fontWeight: 900,
              color: UI.text,
              letterSpacing: "-0.03em",
            }}
          >
            {value}
          </Typography>
          <Box>
            <Typography sx={{ fontSize: "0.82rem", color: UI.muted, fontWeight: 700 }}>
              {label}
            </Typography>
            {sub ? (
              <Typography sx={{ mt: 0.45, fontSize: "0.72rem", color: tone, fontWeight: 800 }}>
                {sub}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusChip({ status }) {
  const map = {
    Delivered: {
      color: UI.success,
      bg: UI.successSoft,
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
    },
    Pending: {
      color: UI.warning,
      bg: UI.warningSoft,
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />,
    },
    Shipped: {
      color: UI.blue,
      bg: UI.blueSoft,
      icon: <LocalShippingRoundedIcon sx={{ fontSize: 14 }} />,
    },
    Returned: {
      color: UI.purple,
      bg: UI.purpleSoft,
      icon: <ReplayRoundedIcon sx={{ fontSize: 14 }} />,
    },
    Cancelled: {
      color: UI.danger,
      bg: UI.dangerSoft,
      icon: <LockRoundedIcon sx={{ fontSize: 14 }} />,
    },
  };

  const item = map[status] || map.Pending;

  return (
    <Chip
      size="small"
      icon={item.icon}
      label={status}
      sx={{
        height: 28,
        borderRadius: "999px",
        fontWeight: 800,
        fontSize: "0.72rem",
        color: item.color,
        background: item.bg,
        border: "none",
      }}
    />
  );
}

function OrderCard({ order }) {
  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  background: UI.surfaceSoft,
                  border: `1px solid ${UI.border}`,
                  display: "grid",
                  placeItems: "center",
                  color: UI.primary,
                  flexShrink: 0,
                }}
              >
                {order.category === "Property" ? (
                  <HomeWorkRoundedIcon sx={{ fontSize: 28 }} />
                ) : (
                  <DirectionsCarRoundedIcon sx={{ fontSize: 28 }} />
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    color: UI.text,
                    fontWeight: 800,
                    lineHeight: 1.35,
                  }}
                >
                  {order.name}
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: "0.78rem", color: UI.muted }}>
                  Order ID: {order.id} · {order.category}
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: "0.78rem", color: UI.muted }}>
                  Delivery: {order.deliveryDate}
                </Typography>
              </Box>
            </Stack>

            <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={0.8}>
              <StatusChip status={order.status} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, color: UI.text }}>
                ₹{order.price}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <LinearProgress
              variant="determinate"
              value={order.progress}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                backgroundColor: UI.surfaceSoft,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  backgroundColor:
                    order.status === "Delivered"
                      ? UI.success
                      : order.status === "Shipped"
                      ? UI.blue
                      : order.status === "Pending"
                      ? UI.warning
                      : UI.purple,
                },
              }}
            />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                size="small"
                sx={{
                  minHeight: 36,
                  px: 1.6,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  color: UI.text,
                  background: UI.surfaceSoft,
                  border: `1px solid ${UI.border}`,
                }}
              >
                Track
              </Button>
              <Button
                size="small"
                sx={{
                  minHeight: 36,
                  px: 1.6,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  color: UI.text,
                  background: "#fff",
                  border: `1px solid ${UI.border}`,
                }}
              >
                Invoice
              </Button>
              <Button
                size="small"
                sx={{
                  minHeight: 36,
                  px: 1.6,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  color: UI.primary,
                  background: UI.primarySoft,
                }}
              >
                Buy Again
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AddressCard({ item }) {
  return (
    <Card sx={{ ...cardSx, height: "100%" }}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={item.type}
                size="small"
                sx={{
                  height: 24,
                  borderRadius: "999px",
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  color: UI.blue,
                  background: UI.blueSoft,
                }}
              />
              {item.default ? (
                <Chip
                  label="Default"
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "999px",
                    fontWeight: 800,
                    fontSize: "0.68rem",
                    color: UI.success,
                    background: UI.successSoft,
                  }}
                />
              ) : null}
            </Stack>

            <Button
              size="small"
              sx={{
                minWidth: 0,
                px: 1,
                fontSize: "0.75rem",
                fontWeight: 800,
                color: UI.primary,
                textTransform: "none",
              }}
            >
              Edit
            </Button>
          </Stack>

          <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: UI.text }}>
            {item.name}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: UI.muted, lineHeight: 1.7 }}>
            {item.address}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 700 }}>
            {item.phone} · {item.pincode}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ pt: 0.8 }}>
            <Button
              size="small"
              sx={{
                minHeight: 34,
                px: 1.4,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                color: UI.text,
                background: UI.surfaceSoft,
                border: `1px solid ${UI.border}`,
              }}
            >
              Delete
            </Button>
            {!item.default ? (
              <Button
                size="small"
                sx={{
                  minHeight: 34,
                  px: 1.4,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  color: UI.primary,
                  background: UI.primarySoft,
                }}
              >
                Set Default
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PaymentCard({ item }) {
  return (
    <Card sx={{ ...cardSx, height: "100%" }}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1.4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                background: item.highlight ? UI.primarySoft : UI.surfaceSoft,
                color: item.highlight ? UI.primary : UI.text,
                display: "grid",
                placeItems: "center",
              }}
            >
              {item.icon}
            </Box>

            {item.default ? (
              <Chip
                size="small"
                label="Default"
                sx={{
                  height: 24,
                  borderRadius: "999px",
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  color: UI.success,
                  background: UI.successSoft,
                }}
              />
            ) : null}
          </Stack>

          <Box>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: UI.text }}>
              {item.title}
            </Typography>
            <Typography sx={{ mt: 0.35, fontSize: "0.78rem", color: UI.muted, lineHeight: 1.6 }}>
              {item.subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              sx={{
                minHeight: 34,
                px: 1.4,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                color: UI.text,
                background: UI.surfaceSoft,
                border: `1px solid ${UI.border}`,
              }}
            >
              Manage
            </Button>
            <Button
              size="small"
              sx={{
                minHeight: 34,
                px: 1.4,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                color: UI.primary,
                background: UI.primarySoft,
              }}
            >
              Secure
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductCard({ item }) {
  return (
    <Card sx={{ ...cardSx, height: "100%" }}>
      <CardContent sx={{ p: 1.7 }}>
        <Stack spacing={1.2}>
          <Box
            sx={{
              height: 126,
              borderRadius: "16px",
              background: item.bg,
              display: "grid",
              placeItems: "center",
              border: `1px solid ${UI.border}`,
            }}
          >
            {item.icon}
          </Box>

          <Box>
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: UI.text }}>
              {item.title}
            </Typography>
            <Typography sx={{ mt: 0.35, fontSize: "0.76rem", color: UI.muted, lineHeight: 1.55 }}>
              {item.sub}
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ fontSize: "0.92rem", fontWeight: 900, color: UI.text }}>
                ₹{item.price}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: item.stockColor, fontWeight: 800 }}>
                {item.stock}
              </Typography>
            </Box>

            <IconButton
              size="small"
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                background: UI.surfaceSoft,
                border: `1px solid ${UI.border}`,
              }}
            >
              <FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                color: UI.text,
                background: UI.surfaceSoft,
                border: `1px solid ${UI.border}`,
              }}
            >
              Remove
            </Button>
            <Button
              fullWidth
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                color: "#fff",
                background: UI.text,
                "&:hover": { background: "#0b1220" },
              }}
            >
              Move to cart
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SettingRow({ icon, title, value, action = "Edit" }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.4,
        borderBottom: `1px solid ${UI.border}`,
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "12px",
            background: UI.surfaceSoft,
            border: `1px solid ${UI.border}`,
            color: UI.faint,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.86rem", color: UI.text, fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "0.76rem", color: UI.muted, lineHeight: 1.6 }}>
            {value}
          </Typography>
        </Box>
      </Stack>

      <Button
        size="small"
        sx={{
          minWidth: 0,
          px: 1,
          fontSize: "0.75rem",
          fontWeight: 800,
          color: UI.primary,
          textTransform: "none",
        }}
      >
        {action}
      </Button>
    </Stack>
  );
}

function BottomNavButton({ icon, label, active = false }) {
  return (
    <Stack spacing={0.4} alignItems="center" sx={{ flex: 1, py: 0.8 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          color: active ? UI.primary : UI.faint,
          background: active ? UI.primarySoft : "transparent",
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: active ? 800 : 700,
          color: active ? UI.text : UI.muted,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function FreeDashboard() {
  const { user, logout, upgradePremium, properties = [], vehicles = [] } = useAppState();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [tab, setTab] = useState(0);

  const initials = useMemo(() => {
    const name = user?.name?.trim() || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0]?.[0]?.toUpperCase() || "U";
  }, [user?.name]);

  const orders = [
    {
      id: "ED-20481",
      name: "2BHK Apartment Booking Lead",
      category: "Property",
      price: "12,500",
      deliveryDate: "18 May 2026",
      status: "Shipped",
      progress: 72,
    },
    {
      id: "ED-20479",
      name: "Used Hyundai i20 Seller Package",
      category: "Vehicle",
      price: "8,999",
      deliveryDate: "Delivered on 13 May 2026",
      status: "Delivered",
      progress: 100,
    },
    {
      id: "ED-20465",
      name: "Premium Seller Visibility Upgrade",
      category: "Property",
      price: "299",
      deliveryDate: "Awaiting activation",
      status: "Pending",
      progress: 36,
    },
  ];

  const addresses = [
    {
      type: "Home",
      default: true,
      name: user?.name || "EasyDeal User",
      address: "12/A Residency Layout, Indiranagar, Bengaluru, Karnataka",
      phone: user?.phone || user?.mobile || "+91 98765 43210",
      pincode: "560038",
    },
    {
      type: "Work",
      default: false,
      name: user?.name || "EasyDeal User",
      address: "4th Floor, MG Road Business Hub, Bengaluru, Karnataka",
      phone: user?.phone || user?.mobile || "+91 98765 43210",
      pincode: "560001",
    },
  ];

  const payments = [
    {
      title: "Visa ending in 2244",
      subtitle: "Saved card · Expires 08/28",
      default: true,
      highlight: true,
      icon: <CreditCardRoundedIcon sx={{ fontSize: 22 }} />,
    },
    {
      title: "UPI · easydeal@oksbi",
      subtitle: "Primary UPI ID for quick checkout",
      default: false,
      highlight: false,
      icon: <PaymentsRoundedIcon sx={{ fontSize: 22 }} />,
    },
    {
      title: "Wallet balance",
      subtitle: "₹1,240 cashback available",
      default: false,
      highlight: false,
      icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />,
    },
  ];

  const wishlist = [
    {
      title: "Toyota Glanza 2022",
      sub: "Petrol · 14,000 km · Bengaluru",
      price: "6,85,000",
      stock: "In stock",
      stockColor: UI.success,
      bg: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(15,118,110,0.08) 100%)",
      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 42, color: UI.blue }} />,
    },
    {
      title: "3BHK Flat in Whitefield",
      sub: "Ready to move · 1650 sq ft",
      price: "89,00,000",
      stock: "3 offers live",
      stockColor: UI.primary,
      bg: "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(201,138,0,0.08) 100%)",
      icon: <HomeWorkRoundedIcon sx={{ fontSize: 42, color: UI.primary }} />,
    },
    {
      title: "Royal Enfield Meteor",
      sub: "2023 model · Single owner",
      price: "1,95,000",
      stock: "Price drop",
      stockColor: UI.warning,
      bg: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(37,99,235,0.08) 100%)",
      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 42, color: UI.purple }} />,
    },
    {
      title: "Plot near Sarjapur",
      sub: "1200 sq ft · Gated layout",
      price: "42,00,000",
      stock: "Limited availability",
      stockColor: UI.danger,
      bg: "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(201,138,0,0.08) 100%)",
      icon: <HomeWorkRoundedIcon sx={{ fontSize: 42, color: UI.gold }} />,
    },
  ];

  const completion = 78;

  const topSections = [
    "Overview",
    "Orders",
    "Addresses",
    "Payments",
    "Wishlist",
    "Settings",
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: UI.bg, py: { xs: 1.5, md: 3 }, pb: { xs: 10, md: 3 } }}>
      <Container maxWidth="xl">
        <Box sx={shellSx}>
          <Grid container sx={{ minHeight: { md: "calc(100vh - 56px)" } }}>
            
            <Grid item xs={12} md={9} lg={9.4}>
              <Box sx={{ p: { xs: 1.4, sm: 2, md: 2.5 } }}>
                {!isMdUp ? (
                  <Box
                    sx={{
                      ...cardSx,
                      px: 1.4,
                      py: 1.2,
                      mb: 1.6,
                      boxShadow: "none",
                    }}
                  >
                    {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.1} alignItems="center">
                        <IconButton
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          <MenuRoundedIcon sx={{ fontSize: 20, color: UI.text }} />
                        </IconButton>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 900,
                            color: UI.text,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          My Account
                        </Typography>
                      </Stack> 

                       <Stack direction="row" spacing={1}>
                        <IconButton
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          <SearchRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
                        </IconButton>
                        <IconButton
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          <NotificationsRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
                        </IconButton>
                      </Stack>
                    </Stack> */}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      ...cardSx,
                      px: { xs: 1.5, sm: 2.1 },
                      py: 1.3,
                      mb: 2.1,
                      boxShadow: "none",
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "1.3rem", sm: "1.5rem" },
                            fontWeight: 900,
                            color: UI.text,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          Hello, {user?.name?.split?.(" ")?.[0] || "there"}
                        </Typography>
                        <Typography sx={{ mt: 0.45, fontSize: "0.84rem", color: UI.muted, fontWeight: 600 }}>
                          Manage your orders, addresses, payments, and preferences in one place.
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            display: { xs: "none", sm: "flex" },
                            alignItems: "center",
                            gap: 1,
                            px: 1.4,
                            minHeight: 42,
                            borderRadius: "14px",
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                            color: UI.faint,
                            minWidth: 180,
                          }}
                        >
                          <SearchRoundedIcon sx={{ fontSize: 18 }} />
                          <Typography sx={{ fontSize: "0.82rem", color: UI.faint, fontWeight: 700 }}>
                            Search orders
                          </Typography>
                        </Box>

                        <IconButton
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "14px",
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          <TuneRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                )}

                <Card sx={{ ...cardSx, mb: 2.2, overflow: "hidden" }}>
                  <Box
                    sx={{
                      px: { xs: 1.8, sm: 2.4 },
                      py: { xs: 2.1, sm: 2.5 },
                      background:
                        "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(37,99,235,0.08) 56%, rgba(201,138,0,0.08) 100%)",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2.2}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent="space-between"
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.8}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        sx={{ minWidth: 0 }}
                      >
                        <Avatar
                          src={user?.photo || undefined}
                          sx={{
                            width: { xs: 78, sm: 90 },
                            height: { xs: 78, sm: 90 },
                            border: "4px solid #fff",
                            boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
                            bgcolor: UI.surfaceSoft,
                            color: UI.text,
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: "1.4rem", sm: "1.55rem" },
                                fontWeight: 900,
                                color: UI.text,
                                lineHeight: 1.05,
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {user?.name || "EasyDeal User"}
                            </Typography>

                            <Chip
                              icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: "14px !important" }} />}
                              label={user?.isPremium ? "Gold Member" : "Free Member"}
                              sx={{
                                height: 28,
                                borderRadius: "999px",
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                color: user?.isPremium ? UI.gold : UI.muted,
                                background: user?.isPremium ? UI.goldSoft : UI.surface,
                                border: `1px solid ${UI.border}`,
                              }}
                            />
                          </Stack>

                          <Stack spacing={0.7} sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <EmailRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                              <Typography sx={{ fontSize: "0.82rem", color: UI.muted, fontWeight: 700 }}>
                                {user?.email || "email@example.com"}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PhoneRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                              <Typography sx={{ fontSize: "0.82rem", color: UI.muted, fontWeight: 700 }}>
                                {user?.phone || user?.mobile || "+91 98765 43210"}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PlaceRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                              <Typography sx={{ fontSize: "0.82rem", color: UI.muted, fontWeight: 700 }}>
                                Bengaluru, Karnataka, India
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: "row", sm: "row" }}
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ width: { xs: "100%", md: "auto" } }}
                      >
                        <Button
                          startIcon={<EditRoundedIcon sx={{ fontSize: 18 }} />}
                          sx={{
                            minHeight: 44,
                            px: 2,
                            borderRadius: "14px",
                            textTransform: "none",
                            fontWeight: 800,
                            color: UI.text,
                            background: "#fff",
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          Edit Profile
                        </Button>

                        {!user?.isPremium ? (
                          <Button
                            onClick={upgradePremium}
                            startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                              minHeight: 44,
                              px: 2,
                              borderRadius: "14px",
                              textTransform: "none",
                              fontWeight: 800,
                              color: "#fff",
                              background: UI.primary,
                              "&:hover": { background: "#0c615b" },
                            }}
                          >
                            Upgrade
                          </Button>
                        ) : null}

                        <Button
                          onClick={logout}
                          startIcon={<LogoutRoundedIcon sx={{ fontSize: 18 }} />}
                          sx={{
                            minHeight: 44,
                            px: 2,
                            borderRadius: "14px",
                            textTransform: "none",
                            fontWeight: 800,
                            color: UI.muted,
                            background: "#fff",
                            border: `1px solid ${UI.border}`,
                          }}
                        >
                          Logout
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Card>

                <Card sx={{ ...cardSx, mb: 2.2, overflow: "hidden" }}>
                  <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant={isSmUp ? "scrollable" : "scrollable"}
                    scrollButtons="auto"
                    sx={{
                      px: 1,
                      "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: 999,
                        backgroundColor: UI.primary,
                      },
                      "& .MuiTab-root": {
                        textTransform: "none",
                        minHeight: 56,
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        color: UI.muted,
                      },
                      "& .Mui-selected": {
                        color: UI.text,
                      },
                    }}
                  >
                    {topSections.map((item) => (
                      <Tab key={item} label={item} />
                    ))}
                  </Tabs>
                </Card>

                <Grid container spacing={2.2}>
                  <Grid item xs={12}>
                    <Grid container spacing={2.2}>
                      <Grid item xs={6} sm={4} lg={2.4}>
                        <SummaryCard
                          icon={<ShoppingBagRoundedIcon sx={{ fontSize: 22 }} />}
                          label="Total Orders"
                          value="24"
                          tone={UI.primary}
                          soft={UI.primarySoft}
                          sub="3 active now"
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} lg={2.4}>
                        <SummaryCard
                          icon={<FavoriteBorderRoundedIcon sx={{ fontSize: 22 }} />}
                          label="Wishlist Items"
                          value={wishlist.length}
                          tone={UI.purple}
                          soft={UI.purpleSoft}
                          sub="2 price drops"
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} lg={2.4}>
                        <SummaryCard
                          icon={<StorefrontRoundedIcon sx={{ fontSize: 22 }} />}
                          label="Cart Items"
                          value="3"
                          tone={UI.blue}
                          soft={UI.blueSoft}
                          sub="Ready to checkout"
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} lg={2.4}>
                        <SummaryCard
                          icon={<LocationOnRoundedIcon sx={{ fontSize: 22 }} />}
                          label="Saved Addresses"
                          value={addresses.length}
                          tone={UI.warning}
                          soft={UI.warningSoft}
                          sub="1 default"
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} lg={2.4}>
                        <SummaryCard
                          icon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: 22 }} />}
                          label="Wallet / Rewards"
                          value="₹1,240"
                          tone={UI.success}
                          soft={UI.successSoft}
                          sub="Cashback available"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} xl={8}>
                    <Stack spacing={2.2}>
                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.3 } }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography sx={sectionLabelSx}>Active orders</Typography>
                              <Typography
                                sx={{
                                  mt: 0.55,
                                  fontSize: "1.12rem",
                                  color: UI.text,
                                  fontWeight: 900,
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                Track, invoice, reorder
                              </Typography>
                            </Box>

                            <Button
                              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
                              sx={{
                                minHeight: 40,
                                px: 1.6,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.primary,
                                background: UI.primarySoft,
                              }}
                            >
                              View all orders
                            </Button>
                          </Stack>

                          <Stack spacing={1.4}>
                            {orders.map((order) => (
                              <OrderCard key={order.id} order={order} />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.3 } }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography sx={sectionLabelSx}>Wishlist</Typography>
                              <Typography
                                sx={{
                                  mt: 0.55,
                                  fontSize: "1.12rem",
                                  color: UI.text,
                                  fontWeight: 900,
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                Favorites and saved items
                              </Typography>
                            </Box>

                            <Button
                              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
                              sx={{
                                minHeight: 40,
                                px: 1.6,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.text,
                                background: UI.surfaceSoft,
                                border: `1px solid ${UI.border}`,
                              }}
                            >
                              View full wishlist
                            </Button>
                          </Stack>

                          <Grid container spacing={1.8}>
                            {wishlist.map((item) => (
                              <Grid item xs={12} sm={6} lg={3} key={item.title}>
                                <ProductCard item={item} />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.3 } }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography sx={sectionLabelSx}>Addresses</Typography>
                              <Typography
                                sx={{
                                  mt: 0.55,
                                  fontSize: "1.12rem",
                                  color: UI.text,
                                  fontWeight: 900,
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                Manage delivery and billing locations
                              </Typography>
                            </Box>

                            <Button
                              sx={{
                                minHeight: 40,
                                px: 1.6,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: "#fff",
                                background: UI.text,
                              }}
                            >
                              Add address
                            </Button>
                          </Stack>

                          <Grid container spacing={1.8}>
                            {addresses.map((item, index) => (
                              <Grid item xs={12} md={6} key={`${item.type}-${index}`}>
                                <AddressCard item={item} />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.3 } }}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                          >
                            <Box>
                              <Typography sx={sectionLabelSx}>Payments</Typography>
                              <Typography
                                sx={{
                                  mt: 0.55,
                                  fontSize: "1.12rem",
                                  color: UI.text,
                                  fontWeight: 900,
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                Cards, UPI, wallet and secure checkout
                              </Typography>
                            </Box>

                            <Button
                              sx={{
                                minHeight: 40,
                                px: 1.6,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.primary,
                                background: UI.primarySoft,
                              }}
                            >
                              Add payment method
                            </Button>
                          </Stack>

                          <Grid container spacing={1.8}>
                            {payments.map((item) => (
                              <Grid item xs={12} sm={6} lg={4} key={item.title}>
                                <PaymentCard item={item} />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} xl={4}>
                    <Stack spacing={2.2}>
                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                          <Typography sx={sectionLabelSx}>Profile strength</Typography>
                          <Typography
                            sx={{
                              mt: 0.8,
                              fontSize: "1.05rem",
                              fontWeight: 900,
                              color: UI.text,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            Complete your account for better trust
                          </Typography>

                          <Box sx={{ mt: 1.8 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.7 }}>
                              <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 700 }}>
                                Completion
                              </Typography>
                              <Typography sx={{ fontSize: "0.78rem", color: UI.primary, fontWeight: 800 }}>
                                {completion}%
                              </Typography>
                            </Stack>

                            <LinearProgress
                              variant="determinate"
                              value={completion}
                              sx={{
                                height: 8,
                                borderRadius: 999,
                                backgroundColor: UI.surfaceSoft,
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 999,
                                  backgroundColor: UI.primary,
                                },
                              }}
                            />
                          </Box>

                          <Stack spacing={1.1} sx={{ mt: 1.8 }}>
                            {[
                              "Photo uploaded",
                              "Phone verified",
                              "Address added",
                              "Payment method saved",
                            ].map((item) => (
                              <Stack key={item} direction="row" spacing={1} alignItems="center">
                                <CheckCircleRoundedIcon sx={{ fontSize: 17, color: UI.success }} />
                                <Typography sx={{ fontSize: "0.82rem", color: UI.text, fontWeight: 700 }}>
                                  {item}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                          <Typography sx={sectionLabelSx}>Rewards & wallet</Typography>
                          <Typography
                            sx={{
                              mt: 0.8,
                              fontSize: "1.2rem",
                              fontWeight: 900,
                              color: UI.text,
                              letterSpacing: "-0.03em",
                            }}
                          >
                            ₹1,240 available
                          </Typography>
                          <Typography sx={{ mt: 0.7, fontSize: "0.82rem", color: UI.muted, lineHeight: 1.65 }}>
                            Cashback, coupons, and wallet balance ready for your next checkout.
                          </Typography>

                          <Grid container spacing={1.5} sx={{ mt: 0.6 }}>
                            <Grid item xs={6}>
                              <Box sx={{ ...softCardSx, p: 1.6 }}>
                                <Typography sx={{ fontSize: "0.74rem", color: UI.muted, fontWeight: 700 }}>
                                  Coupons
                                </Typography>
                                <Typography sx={{ mt: 0.65, fontSize: "1.15rem", fontWeight: 900, color: UI.text }}>
                                  6
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ ...softCardSx, p: 1.6 }}>
                                <Typography sx={{ fontSize: "0.74rem", color: UI.muted, fontWeight: 700 }}>
                                  Reward points
                                </Typography>
                                <Typography sx={{ mt: 0.65, fontSize: "1.15rem", fontWeight: 900, color: UI.text }}>
                                  420
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Button
                            fullWidth
                            sx={{
                              mt: 1.6,
                              minHeight: 42,
                              borderRadius: "14px",
                              textTransform: "none",
                              fontWeight: 800,
                              color: UI.primary,
                              background: UI.primarySoft,
                            }}
                          >
                            View offers
                          </Button>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                          <Typography sx={sectionLabelSx}>Preferences</Typography>

                          <Box sx={{ mt: 1.2 }}>
                            <SettingRow
                              icon={<NotificationsRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Notifications"
                              value="Email, SMS and push alerts enabled"
                            />
                            <SettingRow
                              icon={<LanguageRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Language"
                              value="English"
                            />
                            <SettingRow
                              icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Currency"
                              value="INR"
                            />
                            <SettingRow
                              icon={<DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Theme"
                              value="Light mode"
                            />
                          </Box>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                          <Typography sx={sectionLabelSx}>Security</Typography>

                          <Box sx={{ mt: 1.2 }}>
                            <SettingRow
                              icon={<LockRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Password"
                              value="Last changed 18 days ago"
                              action="Change"
                            />
                            <SettingRow
                              icon={<SecurityRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Two-factor authentication"
                              value="Disabled"
                              action="Enable"
                            />
                            <SettingRow
                              icon={<DevicesRoundedIcon sx={{ fontSize: 18 }} />}
                              title="Active devices"
                              value="2 devices signed in"
                              action="Manage"
                            />
                          </Box>
                        </CardContent>
                      </Card>

                      <Card sx={cardSx}>
                        <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                          <Typography sx={sectionLabelSx}>Support</Typography>

                          <Stack spacing={1.1} sx={{ mt: 1.4 }}>
                            <Button
                              fullWidth
                              startIcon={<HelpOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
                              sx={{
                                justifyContent: "space-between",
                                minHeight: 46,
                                px: 1.6,
                                borderRadius: "14px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.text,
                                background: UI.surfaceSoft,
                                border: `1px solid ${UI.border}`,
                              }}
                            >
                              Help Center
                            </Button>

                            <Button
                              fullWidth
                              startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
                              sx={{
                                justifyContent: "space-between",
                                minHeight: 46,
                                px: 1.6,
                                borderRadius: "14px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.text,
                                background: UI.surfaceSoft,
                                border: `1px solid ${UI.border}`,
                              }}
                            >
                              Live Chat
                            </Button>

                            <Button
                              fullWidth
                              startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
                              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
                              sx={{
                                justifyContent: "space-between",
                                minHeight: 46,
                                px: 1.6,
                                borderRadius: "14px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: UI.primary,
                                background: UI.primarySoft,
                              }}
                            >
                              Raise complaint
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>

                      {!user?.isPremium ? (
                        <Card
                          sx={{
                            ...cardSx,
                            background:
                              "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(15,118,110,0.08) 100%)",
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
                            <Typography sx={sectionLabelSx}>Subscription</Typography>
                            <Typography
                              sx={{
                                mt: 0.8,
                                fontSize: "1.26rem",
                                fontWeight: 900,
                                color: UI.text,
                                letterSpacing: "-0.03em",
                              }}
                            >
                              Unlock Premium for ₹299
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.75,
                                fontSize: "0.82rem",
                                color: UI.muted,
                                lineHeight: 1.65,
                              }}
                            >
                              Post unlimited listings, get better visibility, and connect with buyers faster.
                            </Typography>

                            <Stack spacing={1} sx={{ mt: 1.6 }}>
                              {[
                                "Unlimited posting access",
                                "Priority listing visibility",
                                "Premium account badge",
                              ].map((item) => (
                                <Stack key={item} direction="row" spacing={1} alignItems="center">
                                  <CheckCircleRoundedIcon sx={{ fontSize: 17, color: UI.primary }} />
                                  <Typography sx={{ fontSize: "0.82rem", color: UI.text, fontWeight: 700 }}>
                                    {item}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>

                            <Button
                              fullWidth
                              onClick={upgradePremium}
                              startIcon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />}
                              sx={{
                                mt: 1.8,
                                minHeight: 46,
                                borderRadius: "14px",
                                textTransform: "none",
                                fontWeight: 800,
                                color: "#fff",
                                background: UI.purple,
                                "&:hover": { background: "#6d28d9" },
                              }}
                            >
                              Upgrade now
                            </Button>
                          </CardContent>
                        </Card>
                      ) : null}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
