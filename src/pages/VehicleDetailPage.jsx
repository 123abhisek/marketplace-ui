// src/pages/VehicleDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// Icons
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

// Services & Helpers
import { vehicleService } from "../services/api";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";
import { canViewPremiumDetails, getDisplayCity } from "../utils/permissions";
import BookNowButton from "../components/BookNowButton";
import {
  VEHICLE_CATEGORY_CONFIG,
  normalizeVehicleCategory,
} from "../config/vehicleFields";

// Theme constants inspired by NoBroker reference
const BRAND_RED = "#FD3752";
const BRAND_RED_HOVER = "#E02640";
const BRAND_GREEN = "#00A36C";
const TEXT_MAIN = "#222222";
const TEXT_MUTED = "#666666";
const BORDER_COLOR = "#E2E8F0";
const BG_PAGE = "#F4F5F7";
const PLACEHOLDER = "https://placehold.co/800x500/e2e8f0/94a3b8?text=Vehicle+Photo";

const VEHICLE_AMENITY_LABELS = {
  clear_title: "Clear Title / Hypothecation Free / NOC Ready",
  rc_original: "Original RC Book Available",
  insurance_active: "Valid Insurance Available",
  service_history: "Complete Service History Available",
  road_tax_paid: "Lifetime / Up-to-date Road Tax Paid",
  spare_key: "Original Spare / Duplicate Key Available",
  accidental_free: "Non-Accidental Body & Engine",
  battery_warranty: "Battery Under Warranty",
  loan_pending: "Vehicle Loan Pending",
};

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppState();

  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [userLocationInput, setUserLocationInput] = useState("");
  const [directionsResult, setDirectionsResult] = useState(null);

  const ownerId = vehicle?.user_id || vehicle?.owner_id || vehicle?.owner?.id;
  const isPremium = canViewPremiumDetails(user, ownerId);

  const fetchVehicle = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await vehicleService.getOne(id);
      console.log("Vehicle details fetched:", res);
      const vehData = res?.data ?? res;
      setVehicle(vehData);

      // Load real similar vehicles from DB
      try {
        const allRes = await vehicleService.getAll({ limit: 10 });
        const allList = allRes?.data ?? allRes;
        if (Array.isArray(allList)) {
          const sim = allList.filter((v) => v.id !== id);
          setSimilarVehicles(sim.slice(0, 3));
        }
      } catch {
        // ignore similar fetch error
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load vehicle details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchVehicle]);

  const images = (() => {
    const imgs = vehicle?.images || [];
    const src = Array.isArray(imgs) && imgs.length > 0 ? imgs : [PLACEHOLDER];
    return src.map((img) =>
      !img || typeof img !== "string"
        ? PLACEHOLDER
        : img.startsWith("data:") || img.startsWith("http")
        ? img
        : PLACEHOLDER
    );
  })();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: vehicle?.title,
        text: `Check out "${vehicle?.title}" on EasyDeal!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      alert("Listing link copied to clipboard!");
    }
  };

  const handleDirections = () => {
    if (!userLocationInput.trim()) return;
    const dest = encodeURIComponent(
      vehicle?.local_address
        ? `${vehicle.local_address}, ${getDisplayCity(vehicle)}`
        : vehicle?.location || getDisplayCity(vehicle) || "Bengaluru"
    );
    const origin = encodeURIComponent(userLocationInput.trim());
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`, "_blank");
    setDirectionsResult(`Google Maps opened for directions from ${userLocationInput.trim()}.`);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh", pb: 10 }}>
        {/* 1. Header Bar Skeleton */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: `1px solid ${BORDER_COLOR}`,
            px: { xs: 2, sm: 3, md: 5 },
            py: 1.6,
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: "10px", flexShrink: 0 }} />
                <Box sx={{ flex: 1, maxWidth: 450 }}>
                  <Skeleton variant="text" width="85%" height={28} />
                  <Skeleton variant="text" width="55%" height={20} />
                </Box>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 2, sm: 3 }}
                sx={{ flexWrap: "wrap" }}
              >
                <Box sx={{ textAlign: "right" }}>
                  <Skeleton variant="text" width={110} height={30} />
                  <Skeleton variant="text" width={75} height={18} />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ height: 35, my: "auto" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Skeleton variant="text" width={80} height={24} />
                  <Skeleton variant="text" width={60} height={18} />
                </Box>
                <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: "8px" }} />
              </Stack>
            </Stack>
          </Container>
        </Paper>

        <Container maxWidth="xl" sx={{ mt: 2.5, px: { xs: 2, sm: 3, md: 4 } }}>
          {/* 2. Breadcrumbs Skeleton */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
            <Skeleton variant="text" width={50} height={18} />
            <Skeleton variant="text" width={12} height={18} />
            <Skeleton variant="text" width={110} height={18} />
            <Skeleton variant="text" width={12} height={18} />
            <Skeleton variant="text" width={160} height={18} />
          </Stack>

          {/* 3. Hero Section Skeleton */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            {/* Gallery Skeleton */}
            <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, overflow: "hidden" }}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: { xs: 280, sm: 380, md: 450 } }}
                />
                <Box sx={{ p: 1.5, display: "flex", gap: 1.5, borderTop: `1px solid ${BORDER_COLOR}`, bgcolor: "#FAFAFA" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="rounded" width={72} height={52} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Key Specs Matrix & CTA Skeleton */}
            <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff", height: "100%" }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  {/* 2x4 Matrix Skeleton */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      mb: 2.5,
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1.8,
                          borderRight: i % 2 === 0 ? `1px solid ${BORDER_COLOR}` : "none",
                          borderBottom: i < 6 ? `1px solid ${BORDER_COLOR}` : "none",
                        }}
                      >
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Skeleton variant="circular" width={24} height={24} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="75%" height={18} />
                            <Skeleton variant="text" width="50%" height={14} />
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Box>

                  {/* CTA Buttons Skeleton */}
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5}>
                      <Skeleton variant="rounded" width="50%" height={48} sx={{ borderRadius: "8px" }} />
                      <Skeleton variant="rounded" width="50%" height={48} sx={{ borderRadius: "8px" }} />
                    </Stack>
                  </Stack>

                  {/* Discrepancy Box Skeleton */}
                  <Skeleton variant="rounded" height={68} sx={{ borderRadius: "10px" }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 4. Two-Column Main Body Skeleton */}
          <Grid container spacing={3}>
            {/* Left Column Skeleton */}
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
              {/* Overview Card Skeleton */}
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Skeleton variant="text" width={220} height={30} sx={{ mb: 0.5 }} />
                  <Skeleton variant="rounded" width={44} height={4} sx={{ mb: 3 }} />
                  <Grid container spacing={2.5}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <Grid key={i} size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Skeleton variant="circular" width={24} height={24} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" height={16} />
                            <Skeleton variant="text" width="65%" height={22} />
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Description Card Skeleton */}
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Skeleton variant="text" width={180} height={30} sx={{ mb: 0.5 }} />
                  <Skeleton variant="rounded" width={44} height={4} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="96%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </CardContent>
              </Card>

              {/* Map Card Skeleton */}
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Skeleton variant="text" width={160} height={30} sx={{ mb: 0.5 }} />
                  <Skeleton variant="rounded" width={44} height={4} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={40} sx={{ borderRadius: "8px", mb: 2 }} />
                  <Skeleton variant="rounded" height={300} sx={{ borderRadius: "12px" }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Right Sidebar Skeleton */}
            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Stack spacing={3}>
                {/* Owner Profile Card Skeleton */}
                <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Skeleton variant="circular" width={44} height={44} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="70%" height={20} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                    <Skeleton variant="text" width="30%" height={16} />
                    <Skeleton variant="text" width="60%" height={22} sx={{ mt: 0.5 }} />
                  </CardContent>
                </Card>

                {/* Similar Items Skeleton */}
                <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      {[0, 1, 2].map((i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.2, border: `1px solid ${BORDER_COLOR}`, borderRadius: "10px" }}>
                          <Skeleton variant="rounded" width={85} height={75} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="80%" height={18} />
                            <Skeleton variant="text" width="50%" height={15} />
                            <Skeleton variant="text" width="60%" height={18} sx={{ mt: 0.8 }} />
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Support Card Skeleton */}
                <Card elevation={0} sx={{ borderRadius: "14px", bgcolor: "#0F172A", p: 2.5 }}>
                  <Skeleton variant="text" width={180} height={24} sx={{ bgcolor: "rgba(255,255,255,0.15)", mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={16} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                  <Skeleton variant="text" width="75%" height={16} sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
                  <Skeleton variant="rounded" height={36} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ minHeight: "70vh", bgcolor: BG_PAGE, py: 6 }}>
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{ borderRadius: "14px", mb: 3 }}
            action={
              <Button size="small" color="inherit" onClick={fetchVehicle} sx={{ fontWeight: 700 }}>
                Retry
              </Button>
            }
          >
            {error || "Vehicle not found."}
          </Alert>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: "10px", color: BRAND_RED, fontWeight: 700 }}
          >
            Go Back
          </Button>
        </Container>
      </Box>
    );
  }

  // Real Dynamic Values (No dummy fallbacks)
  const displayCity = getDisplayCity(vehicle);
  const fullAddress = vehicle.local_address
    ? `${vehicle.local_address}, ${displayCity}`
    : vehicle.location || displayCity;
  const displayAddress = isPremium ? fullAddress : displayCity;

  const priceVal = Number(vehicle.price || 0);
  const priceFormatted = priceVal ? formatCurrency(priceVal) : "Price on Request";
  const contactNumber = vehicle.contact || vehicle.owner?.phone || "";
  const whatsappUrl = contactNumber
    ? `https://wa.me/91${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi! I am interested in your vehicle "${vehicle.title}" on EasyDeal.`
      )}`
    : null;

  const category = vehicle.category || vehicle.vehicle_type || "Vehicle";
  const kmFormatted = vehicle.km_driven
    ? `${Number(vehicle.km_driven).toLocaleString("en-IN")} km`
    : null;
  const yearText = vehicle.year ? `Year ${vehicle.year}` : null;
  const postedDate = vehicle.created_at
    ? new Date(vehicle.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // 100% Real Dynamic Key Specs for the 2x4 Matrix
  const matrixCells = [
    {
      title: category,
      sub: "Vehicle Category",
      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.brand && {
      title: vehicle.brand,
      sub: "Make / Brand",
      icon: <KeyRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.model && {
      title: vehicle.model,
      sub: "Model / Variant",
      icon: <DirectionsCarRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.year && {
      title: `Year ${vehicle.year}`,
      sub: "Model Year",
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    kmFormatted && {
      title: kmFormatted,
      sub: "Kilometers Driven",
      icon: <SpeedRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.fuel_type && {
      title: vehicle.fuel_type,
      sub: "Fuel Type",
      icon: <LocalGasStationRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.transmission && {
      title: vehicle.transmission,
      sub: "Transmission",
      icon: <TuneRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.ownership && {
      title: vehicle.ownership,
      sub: "Ownership",
      icon: <AssignmentIndRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.insurance_validity && {
      title: vehicle.insurance_validity,
      sub: "Insurance Status",
      icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.color && {
      title: vehicle.color,
      sub: "Vehicle Color",
      icon: <PaletteRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.state && {
      title: vehicle.state,
      sub: "Registration State",
      icon: <ShieldRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    vehicle.rto_code && {
      title: vehicle.rto_code,
      sub: "RTO Authority",
      icon: <ShieldRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    postedDate && {
      title: postedDate,
      sub: "Posted On",
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
  ].filter(Boolean);

  // Even-numbered count for clean 2-column grid layout
  const displayCells = matrixCells.length > 0 ? (matrixCells.length % 2 === 1 ? matrixCells.slice(0, matrixCells.length - 1) : matrixCells) : [];

  // 100% Dynamic Overview Items Array (strictly based on actual vehicle DB columns)
  const overviewItems = [
    { label: "Vehicle Category", value: category, icon: <DirectionsCarRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Brand / Manufacturer", value: vehicle.brand, icon: <KeyRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Model / Variant", value: vehicle.model, icon: <DirectionsCarRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Manufacturing Year", value: vehicle.year ? `Year ${vehicle.year}` : null, icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Kilometers Driven", value: kmFormatted, icon: <SpeedRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Fuel Type", value: vehicle.fuel_type, icon: <LocalGasStationRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Transmission", value: vehicle.transmission, icon: <TuneRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Ownership History", value: vehicle.ownership, icon: <AssignmentIndRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Insurance Status", value: vehicle.insurance_validity, icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Vehicle Color", value: vehicle.color, icon: <PaletteRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Registered State", value: vehicle.state, icon: <ShieldRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "RTO Registration Code", value: vehicle.rto_code, icon: <ShieldRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    {
      label: "Registration Number",
      value: isPremium
        ? vehicle.vehicle_number || "Available with Seller"
        : vehicle.rto_code
        ? `${vehicle.rto_code} •••• (Locked)`
        : "Locked (Upgrade to View)",
      icon: <DescriptionRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} />,
      isLocked: !isPremium,
    },
    { label: "Asking Price", value: priceFormatted, icon: <KeyRoundedIcon sx={{ fontSize: 22, color: BRAND_GREEN }} />, isHighlight: true },
    { label: "City", value: displayCity, icon: <PlaceRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Inspection Address", value: displayAddress, icon: <PlaceRoundedIcon sx={{ fontSize: 22, color: BRAND_RED }} />, isAddress: true },
    { label: "Seller Contact", value: isPremium ? (contactNumber || "Available with Seller") : "Locked (Premium Members Only)", icon: <PhoneRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Listing Status", value: vehicle.status ? vehicle.status.toUpperCase() : "APPROVED", icon: <CheckCircleRoundedIcon sx={{ fontSize: 22, color: BRAND_GREEN }} /> },
    { label: "Listed On", value: postedDate, icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    {
      label: "Last Updated",
      value: vehicle.updated_at
        ? new Date(vehicle.updated_at).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null,
      icon: <UpdateRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} />,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <>
      <Helmet>
        <title>{vehicle.title || "Vehicle"} | EasyDeal</title>
        <meta
          name="description"
          content={`${vehicle.title} in ${displayAddress}. ${priceFormatted}. Verified listing on EasyDeal.`}
        />
        <meta property="og:title" content={`${vehicle.title} | EasyDeal`} />
        <meta property="og:description" content={`${vehicle.title} in ${displayAddress}`} />
      </Helmet>

      <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh", pb: 10 }}>
        {/* ── 1. TOP STICKY HEADER BAR ── */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#fff",
            borderBottom: `1px solid ${BORDER_COLOR}`,
            px: { xs: 2, sm: 3, md: 5 },
            py: 1.6,
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              {/* Left Title & Category box */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "10px",
                    border: `1.5px solid ${BORDER_COLOR}`,
                    bgcolor: "#FAF5FF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <DirectionsCarRoundedIcon sx={{ fontSize: 24, color: BRAND_RED }} />
                  <Typography
                    sx={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      color: TEXT_MAIN,
                      textTransform: "uppercase",
                      lineHeight: 1,
                      mt: 0.2,
                    }}
                  >
                    {category}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1rem", sm: "1.15rem" },
                      color: TEXT_MAIN,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {vehicle.title}
                  </Typography>
                  <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.2 }}>
                    <PlaceRoundedIcon sx={{ fontSize: 15, color: TEXT_MUTED }} />
                    <Typography noWrap sx={{ fontSize: "0.82rem", color: TEXT_MUTED, fontWeight: 500 }}>
                      {displayAddress}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Right KPI Stat Blocks */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{
                  flexWrap: "wrap",
                  alignSelf: { xs: "stretch", md: "center" },
                  justifyContent: { xs: "space-between", md: "flex-end" },
                  borderTop: { xs: `1px solid ${BORDER_COLOR}`, md: "none" },
                  pt: { xs: 1.2, md: 0 },
                }}
              >
                {/* Price block */}
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "1.2rem", sm: "1.35rem" },
                      color: TEXT_MAIN,
                      lineHeight: 1.1,
                    }}
                  >
                    {priceFormatted}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: BRAND_GREEN,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.3,
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                    }}
                  >
                    Verified Price
                  </Typography>
                </Box>

                {kmFormatted && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ height: 35, my: "auto" }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_MAIN }}>
                        {kmFormatted}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: TEXT_MUTED, fontWeight: 600 }}>
                        Kilometers Driven
                      </Typography>
                    </Box>
                  </>
                )}

                {yearText && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ height: 35, my: "auto" }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_MAIN }}>
                        {yearText}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: TEXT_MUTED, fontWeight: 600 }}>
                        Model Year
                      </Typography>
                    </Box>
                  </>
                )}

                {/* Top Action CTA */}
                {/* <Button
                  variant="contained"
                  onClick={() => {
                    document.getElementById("booking-cta-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  sx={{
                    bgcolor: BRAND_RED,
                    color: "#fff",
                    fontWeight: 800,
                    borderRadius: "8px",
                    px: 2.5,
                    py: 1,
                    fontSize: "0.85rem",
                    boxShadow: "0 4px 12px rgba(253,55,82,0.25)",
                    "&:hover": { bgcolor: BRAND_RED_HOVER },
                  }}
                >
                  Book Test Drive
                </Button> */}
              </Stack>
            </Stack>
          </Container>
        </Paper>

        <Container maxWidth="xl" sx={{ mt: 2.5, px: { xs: 2, sm: 3, md: 4 } }}>
          {/* ── 2. BREADCRUMBS ── */}
          <Breadcrumbs
            separator="›"
            sx={{
              fontSize: "0.82rem",
              color: TEXT_MUTED,
              mb: 2.5,
              "& .MuiBreadcrumbs-li": { display: "inline-flex", alignItems: "center" },
            }}
          >
            <Link component={RouterLink} to="/" underline="hover" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/explore" underline="hover" color="inherit">
              Vehicles in {displayCity}
            </Link>
            <Link component={RouterLink} to="/explore" underline="hover" color="inherit">
              {category}
            </Link>
            <Typography color="text.primary" sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
              {vehicle.title}
            </Typography>
          </Breadcrumbs>

          {/* ── 3. HERO SECTION ── */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            {/* Left side: Photo Gallery */}
            <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "14px",
                  border: `1px solid ${BORDER_COLOR}`,
                  overflow: "hidden",
                  bgcolor: "#fff",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 280, sm: 380, md: 460, lg: 500 },
                    bgcolor: "#0F172A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: isPremium && images.length > 0 ? "zoom-in" : "default",
                  }}
                  onClick={() => {
                    if (isPremium && images.length > 0) setLightboxOpen(true);
                  }}
                >
                  {isPremium ? (
                    <>
                      {/* Ambient blurred backdrop so letterbox areas blend with photo colors */}
                      <Box
                        component="img"
                        src={images[activeImg] || PLACEHOLDER}
                        alt=""
                        aria-hidden="true"
                        sx={{
                          position: "absolute",
                          inset: -20,
                          width: "calc(100% + 40px)",
                          height: "calc(100% + 40px)",
                          objectFit: "cover",
                          filter: "blur(30px) brightness(0.65)",
                          opacity: 0.65,
                          transform: "scale(1.1)",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />

                      {/* Main sharp vehicle image - fitted completely to screen without cropping */}
                      <Box
                        component="img"
                        src={images[activeImg] || PLACEHOLDER}
                        alt={vehicle.title}
                        sx={{
                          position: "relative",
                          zIndex: 2,
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </>
                  ) : (
                    // Non-Premium Lock Banner
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        backgroundImage: `url(${PLACEHOLDER})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(15,23,42,0.85)",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                      <Stack
                        spacing={2}
                        alignItems="center"
                        sx={{ position: "relative", zIndex: 2, px: 3, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            bgcolor: "rgba(253,55,82,0.15)",
                            color: BRAND_RED,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <LockRoundedIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={800} sx={{ color: "#fff" }}>
                            Vehicle Photos Locked for Free Users
                          </Typography>
                          <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: 400, mt: 0.5 }}>
                            Upgrade to EasyDeal Premium to unlock HD vehicle photos, owner phone number & exact inspection address.
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          component={RouterLink}
                          to="/subscription"
                          startIcon={<WorkspacePremiumRoundedIcon />}
                          sx={{
                            bgcolor: BRAND_RED,
                            color: "#fff",
                            fontWeight: 800,
                            px: 3,
                            py: 1,
                            borderRadius: "8px",
                            "&:hover": { bgcolor: BRAND_RED_HOVER },
                          }}
                        >
                          Unlock with Premium — ₹299
                        </Button>
                      </Stack>
                    </Box>
                  )}

                  {/* Overlaid Top-Left: Photos & Location Buttons */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 16, left: 16, zIndex: 5 }}
                  >
                    {isPremium ? (
                      <Chip
                        icon={<CameraAltRoundedIcon sx={{ fontSize: "16px !important", color: "#fff" }} />}
                        label={`Photos (${images.length})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxOpen(true);
                        }}
                        clickable
                        sx={{
                          bgcolor: "rgba(0,0,0,0.65)",
                          backdropFilter: "blur(6px)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<LockRoundedIcon sx={{ fontSize: "15px !important", color: "#F59E0B" }} />}
                        label="Photos Protected"
                        sx={{
                          bgcolor: "rgba(0,0,0,0.75)",
                          backdropFilter: "blur(6px)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          border: "1px solid rgba(245,158,11,0.4)",
                        }}
                      />
                    )}
                    <Chip
                      icon={<MyLocationRoundedIcon sx={{ fontSize: "16px !important", color: "#fff" }} />}
                      label="Location"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("location-map-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      sx={{
                        bgcolor: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    />
                  </Stack>

                  {/* Overlaid Top-Right: Fullscreen, Shortlist & Share */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 16, right: 16, zIndex: 5 }}
                  >
                    {isPremium && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxOpen(true);
                        }}
                        title="View Fullscreen"
                        sx={{
                          bgcolor: "rgba(0,0,0,0.65)",
                          backdropFilter: "blur(6px)",
                          color: "#fff",
                          p: 1,
                          "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                        }}
                      >
                        <ZoomInRoundedIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setShortlisted(!shortlisted);
                      }}
                      sx={{
                        bgcolor: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(6px)",
                        color: shortlisted ? BRAND_RED : "#fff",
                        p: 1,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                      }}
                    >
                      {shortlisted ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                      sx={{
                        bgcolor: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        p: 1,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                      }}
                    >
                      <ShareRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Overlaid Bottom-Left: Verified badge */}
                  <Box sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 5 }}>
                    <Chip
                      label="✔ EasyDeal Verified Vehicle"
                      sx={{
                        bgcolor: BRAND_GREEN,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        borderRadius: "6px",
                      }}
                    />
                  </Box>

                  {/* Previous / Next Navigation Arrows */}
                  {isPremium && images.length > 1 && (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImg((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                        }}
                        sx={{
                          position: "absolute",
                          left: 12,
                          zIndex: 6,
                          bgcolor: "rgba(255,255,255,0.85)",
                          color: "#1E293B",
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        <ChevronLeftRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImg((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                        }}
                        sx={{
                          position: "absolute",
                          right: 12,
                          zIndex: 6,
                          bgcolor: "rgba(255,255,255,0.85)",
                          color: "#1E293B",
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        <ChevronRightRoundedIcon />
                      </IconButton>
                    </>
                  )}
                </Box>

                {/* Thumbnails strip */}
                {isPremium && images.length > 1 && (
                  <Box
                    sx={{
                      p: 1.5,
                      display: "flex",
                      gap: 1.5,
                      overflowX: "auto",
                      borderTop: `1px solid ${BORDER_COLOR}`,
                      bgcolor: "#F8FAFC",
                    }}
                  >
                    {images.map((img, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setActiveImg(idx)}
                        component="img"
                        src={img}
                        alt={`thumb-${idx}`}
                        sx={{
                          width: 76,
                          height: 54,
                          borderRadius: "8px",
                          objectFit: "contain",
                          bgcolor: "#0F172A",
                          cursor: "pointer",
                          border: activeImg === idx ? `2px solid ${BRAND_RED}` : `1px solid ${BORDER_COLOR}`,
                          opacity: activeImg === idx ? 1 : 0.65,
                          p: 0.3,
                          transition: "all .15s",
                          flexShrink: 0,
                          "&:hover": { opacity: 1, transform: "scale(1.04)" },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Right side: Specifications Box (NoBroker dynamic matrix & CTAs) */}
            <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "14px",
                  border: `1px solid ${BORDER_COLOR}`,
                  bgcolor: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  {/* Clean 2-column Key Specs Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      mb: 2.5,
                    }}
                  >
                    {displayCells.map((cell, idx) => {
                      const isEven = idx % 2 === 0;
                      const isLastRow = idx >= displayCells.length - (displayCells.length % 2 === 0 ? 2 : 1);
                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.8,
                            borderRight: isEven ? `1px solid ${BORDER_COLOR}` : "none",
                            borderBottom: !isLastRow ? `1px solid ${BORDER_COLOR}` : "none",
                          }}
                        >
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            {cell.icon}
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                noWrap
                                sx={{ fontWeight: 800, fontSize: "0.92rem", color: TEXT_MAIN, lineHeight: 1.2 }}
                              >
                                {cell.title}
                              </Typography>
                              <Typography noWrap sx={{ fontSize: "0.72rem", color: TEXT_MUTED, mt: 0.2 }}>
                                {cell.sub}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* CTAs Section: Contact & Test Drive with Floating Badge */}
                  <Stack id="booking-cta-section" spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5}>
                      {/* WhatsApp / Contact Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={isPremium ? <WhatsAppIcon /> : <PhoneRoundedIcon />}
                        href={isPremium && whatsappUrl ? whatsappUrl : undefined}
                        target={isPremium && whatsappUrl ? "_blank" : undefined}
                        onClick={
                          !isPremium
                            ? () => navigate("/subscription")
                            : !whatsappUrl
                            ? () => alert("Seller phone number not provided.")
                            : undefined
                        }
                        sx={{
                          bgcolor: BRAND_RED,
                          color: "#fff",
                          fontWeight: 800,
                          py: 1.4,
                          fontSize: "0.9rem",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(253,55,82,0.25)",
                          "&:hover": { bgcolor: BRAND_RED_HOVER },
                        }}
                      >
                        {isPremium ? "Contact / WhatsApp" : "Unlock Contact (₹299)"}
                      </Button>

                      {/* Book Inspection / Test Drive with Verified Availability pill */}
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -9,
                            right: 14,
                            zIndex: 2,
                            bgcolor: "#000",
                            color: "#fff",
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            px: 1,
                            py: 0.2,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                            letterSpacing: "0.02em",
                          }}
                        >
                          <CheckCircleRoundedIcon sx={{ fontSize: 10, color: BRAND_GREEN }} />
                          Verified
                        </Box>

                        <BookNowButton
                          vehicleId={vehicle.id}
                          vehicle={vehicle}
                          amount={vehicle.price || 1}
                          label="Book Test Drive"
                        />
                      </Box>
                    </Stack>
                  </Stack>

                  {/* Discrepancy report box */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.8,
                      bgcolor: "#F8FAFC",
                      borderRadius: "10px",
                      border: `1px solid ${BORDER_COLOR}`,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: TEXT_MAIN, mb: 1 }}>
                      Report listing discrepancy
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                      {["Vehicle Sold", "Incorrect Specs", "Wrong Price"].map((reportReason, idx) => (
                        <Button
                          key={idx}
                          size="small"
                          variant="outlined"
                          onClick={() => alert(`Feedback registered for "${reportReason}". EasyDeal team will review this listing.`)}
                          sx={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: TEXT_MUTED,
                            borderColor: BORDER_COLOR,
                            bgcolor: "#fff",
                            borderRadius: "6px",
                            py: 0.4,
                            px: 1.2,
                            textTransform: "none",
                            "&:hover": { borderColor: BRAND_RED, color: BRAND_RED },
                          }}
                        >
                          {reportReason}
                        </Button>
                      ))}
                    </Stack>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── 4. TWO-COLUMN MAIN BODY ── */}
          <Grid container spacing={3}>
            {/* ══════════ LEFT COLUMN ══════════ */}
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
              {/* 4a. Overview Section - 100% Dynamic data */}
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                      Vehicle Overview & Specifications
                    </Typography>
                    <Box sx={{ width: 44, height: 3.5, bgcolor: BRAND_RED, mt: 1, borderRadius: "2px" }} />
                  </Box>

                  <Grid container spacing={2.5}>
                    {overviewItems.map((item, idx) => (
                      <Grid key={idx} size={{ xs: 12, sm: item.isAddress ? 12 : 6 }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                          <Box sx={{ flex: 1, pr: 2 }}>
                            <Typography sx={{ fontSize: "0.82rem", color: TEXT_MUTED }}>
                              {item.label}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                color: item.isHighlight ? BRAND_GREEN : TEXT_MAIN,
                                mt: 0.2,
                              }}
                            >
                              {item.value}
                            </Typography>
                            {item.isAddress && !isPremium && (
                              <Typography sx={{ fontSize: "0.75rem", color: "#B45309", mt: 0.3 }}>
                                🔒 Exact inspection address protected.{" "}
                                <Link component={RouterLink} to="/subscription" sx={{ color: BRAND_RED, fontWeight: 700 }}>
                                  Upgrade to view full address
                                </Link>
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* 4b. Verified Specifications, Documents & Features (Dynamic Details) */}
              {(() => {
                const details = vehicle.details || {};
                const amenitiesObj = details.amenities || {};
                const customFieldsArr = Array.isArray(details.custom_fields) ? details.custom_fields : [];
                const canonicalCat = normalizeVehicleCategory(vehicle.category);
                const catConfig = VEHICLE_CATEGORY_CONFIG[canonicalCat] || { specificFields: [] };

                // 1. Category Specific Fields
                const activeSpecificFields = (catConfig.specificFields || [])
                  .map((f) => {
                    const val = details[f.name];
                    if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
                      return null;
                    }
                    return {
                      name: f.name,
                      label: f.label,
                      type: f.type,
                      value: val,
                    };
                  })
                  .filter(Boolean);

                // 2. Legal Checklist
                const activeAmenities = Object.entries(amenitiesObj)
                  .filter(([key, val]) => (val === "Yes" || val === "No") && key !== "loan_pending_amount")
                  .map(([key, val]) => ({
                    key,
                    label: VEHICLE_AMENITY_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    value: val,
                    amount: key === "loan_pending" ? amenitiesObj.loan_pending_amount : null,
                  }));

                // 3. Custom Fields
                const validCustomFields = customFieldsArr.filter((f) => f && f.label && (f.value === "Yes" || f.value === "No"));

                if (activeSpecificFields.length === 0 && activeAmenities.length === 0 && validCustomFields.length === 0) {
                  return null;
                }

                return (
                  <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                          Verified Specifications, Documents & Features
                        </Typography>
                        <Box sx={{ width: 44, height: 3.5, bgcolor: BRAND_RED, mt: 1, borderRadius: "2px" }} />
                      </Box>

                      <Stack spacing={3.5}>
                        {/* 1. Category-Specific Fields */}
                        {activeSpecificFields.length > 0 && (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: TEXT_MAIN, mb: 1.5 }}>
                              {canonicalCat} Specifications
                            </Typography>
                            <Grid container spacing={1.5}>
                              {activeSpecificFields.map((field) => (
                                <Grid size={{ xs: 12, sm: field.type === "multiselect" ? 12 : 6 }} key={field.name}>
                                  <Box
                                    sx={{
                                      p: 1.4,
                                      borderRadius: "10px",
                                      background: field.value === "Yes" ? "#F0FDF4" : "#F8FAFC",
                                      border: `1px solid ${field.value === "Yes" ? "#BBF7D0" : BORDER_COLOR}`,
                                      display: "flex",
                                      alignItems: field.type === "multiselect" ? "flex-start" : "center",
                                      justifyContent: "space-between",
                                      flexDirection: field.type === "multiselect" ? "column" : "row",
                                      gap: 1.5,
                                    }}
                                  >
                                    <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: TEXT_MAIN }}>
                                      {field.label}
                                    </Typography>

                                    {field.type === "yesno" ? (
                                      <Stack direction="row" spacing={0.6} alignItems="center">
                                        {field.value === "Yes" ? (
                                          <>
                                            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#059669" }} />
                                            <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", color: "#059669" }}>
                                              Yes
                                            </Typography>
                                          </>
                                        ) : (
                                          <>
                                            <CancelRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                            <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#64748B" }}>
                                              No
                                            </Typography>
                                          </>
                                        )}
                                      </Stack>
                                    ) : field.type === "multiselect" ? (
                                      <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ gap: 0.8, mt: 0.5 }}>
                                        {field.value.map((item, i) => (
                                          <Chip
                                            key={i}
                                            label={item}
                                            size="small"
                                            sx={{
                                              bgcolor: "#EDE9FE",
                                              color: "#6D28D9",
                                              fontWeight: 700,
                                              fontSize: "0.74rem",
                                              borderRadius: "6px",
                                            }}
                                          />
                                        ))}
                                      </Stack>
                                    ) : (
                                      <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: "#0F172A" }}>
                                        {field.value}
                                      </Typography>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* 2. Legal Checklist */}
                        {activeAmenities.length > 0 && (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: TEXT_MAIN, mb: 1.5 }}>
                              Legal Documents & Verification Checklist
                            </Typography>
                            <Grid container spacing={1.5}>
                              {activeAmenities.map((item) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={item.key}>
                                  <Box
                                    sx={{
                                      p: 1.4,
                                      borderRadius: "10px",
                                      background: item.value === "Yes" ? "#F0FDF4" : "#F8FAFC",
                                      border: `1px solid ${item.value === "Yes" ? "#BBF7D0" : BORDER_COLOR}`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 1.5,
                                    }}
                                  >
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                      <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: TEXT_MAIN }}>
                                        {item.label}
                                      </Typography>
                                      {item.key === "loan_pending" && item.value === "Yes" && item.amount && (
                                        <Typography sx={{ fontWeight: 700, fontSize: "0.76rem", color: "#B45309", mt: 0.25 }}>
                                          Loan balance: {formatCurrency(item.amount)}
                                        </Typography>
                                      )}
                                    </Box>

                                    <Stack direction="row" spacing={0.6} alignItems="center">
                                      {item.value === "Yes" ? (
                                        <>
                                          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#059669" }} />
                                          <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", color: "#059669" }}>
                                            Yes
                                          </Typography>
                                        </>
                                      ) : (
                                        <>
                                          <CancelRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                          <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#64748B" }}>
                                            No
                                          </Typography>
                                        </>
                                      )}
                                    </Stack>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* 3. Custom Fields */}
                        {validCustomFields.length > 0 && (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: TEXT_MAIN, mb: 1.5 }}>
                              Additional Vehicle Features & Options
                            </Typography>
                            <Grid container spacing={1.5}>
                              {validCustomFields.map((field, idx) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                  <Box
                                    sx={{
                                      p: 1.4,
                                      borderRadius: "10px",
                                      background: field.value === "Yes" ? "#F0FDF4" : "#F8FAFC",
                                      border: `1px solid ${field.value === "Yes" ? "#BBF7D0" : BORDER_COLOR}`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 1.5,
                                    }}
                                  >
                                    <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: TEXT_MAIN, flex: 1 }}>
                                      {field.label}
                                    </Typography>
                                    <Stack direction="row" spacing={0.6} alignItems="center">
                                      {field.value === "Yes" ? (
                                        <>
                                          <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#059669" }} />
                                          <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", color: "#059669" }}>
                                            Yes
                                          </Typography>
                                        </>
                                      ) : (
                                        <>
                                          <CancelRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                          <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#64748B" }}>
                                            No
                                          </Typography>
                                        </>
                                      )}
                                    </Stack>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* 4c. Description Section (Rendered only if description exists) */}
              {vehicle.description && (
                <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                        About This Vehicle
                      </Typography>
                      <Box sx={{ width: 44, height: 3.5, bgcolor: BRAND_RED, mt: 1, borderRadius: "2px" }} />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.92rem",
                        color: "#475569",
                        lineHeight: 1.8,
                        maxHeight: showFullDesc ? "none" : 120,
                        overflow: "hidden",
                        position: "relative",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {vehicle.description}
                    </Typography>

                    {vehicle.description.length > 200 && (
                      <Button
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        sx={{
                          color: BRAND_RED,
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          p: 0,
                          mt: 1.5,
                          textTransform: "none",
                        }}
                      >
                        {showFullDesc ? "Show Less ⤓" : "Show More ⌄"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 4c. Location & Directions Section */}
              <Card
                id="location-map-section"
                elevation={0}
                sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                      Inspection Location & Map
                    </Typography>
                    <Box sx={{ width: 44, height: 3.5, bgcolor: BRAND_RED, mt: 1, borderRadius: "2px" }} />
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <PlaceRoundedIcon sx={{ color: BRAND_RED, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: TEXT_MAIN }}>
                      {displayAddress}
                    </Typography>
                  </Stack>

                  {/* Directions input bar */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 2.5 }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Enter starting location to get directions to ${displayCity}...`}
                      value={userLocationInput}
                      onChange={(e) => setUserLocationInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDirections()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NavigationRoundedIcon sx={{ fontSize: 18, color: BRAND_RED }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          fontSize: "0.88rem",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleDirections}
                      sx={{
                        bgcolor: BRAND_RED,
                        color: "#fff",
                        fontWeight: 800,
                        px: 3,
                        py: 1,
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        "&:hover": { bgcolor: BRAND_RED_HOVER },
                      }}
                    >
                      Get Directions
                    </Button>
                  </Stack>

                  {directionsResult && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: "8px", fontSize: "0.85rem" }}>
                      {directionsResult}
                    </Alert>
                  )}

                  {/* Google Maps View */}
                  <Box
                    sx={{
                      height: 320,
                      borderRadius: "12px",
                      border: `1px solid ${BORDER_COLOR}`,
                      overflow: "hidden",
                      bgcolor: "#E2E8F0",
                      position: "relative",
                    }}
                  >
                    <iframe
                      title="Vehicle Location Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${encodeURIComponent(displayAddress)}&output=embed`}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ══════════ RIGHT SIDEBAR ══════════ */}
            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Stack spacing={3}>
                {/* 4d. Verified Seller / Owner Profile Card */}
                <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: BRAND_RED, width: 44, height: 44, fontWeight: 800 }}>
                        {vehicle.owner?.name ? vehicle.owner.name[0].toUpperCase() : <PersonRoundedIcon />}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontWeight: 800, fontSize: "0.95rem", color: TEXT_MAIN }}>
                          {vehicle.owner?.name || "Verified Vehicle Owner"}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <VerifiedRoundedIcon sx={{ fontSize: 14, color: BRAND_GREEN }} />
                          <Typography sx={{ fontSize: "0.75rem", color: BRAND_GREEN, fontWeight: 700 }}>
                            {vehicle.status === "approved" ? "Verified Seller" : "Active Member"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography sx={{ fontSize: "0.8rem", color: TEXT_MUTED, mb: 1 }}>
                      Seller Contact:
                    </Typography>
                    {isPremium ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneRoundedIcon sx={{ fontSize: 18, color: BRAND_GREEN }} />
                        <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: TEXT_MAIN }}>
                          {contactNumber || "Available with EasyDeal"}
                        </Typography>
                      </Stack>
                    ) : (
                      <Box sx={{ p: 1.2, bgcolor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                        <Typography sx={{ fontSize: "0.75rem", color: "#B45309", fontWeight: 700 }}>
                          🔒 Contact number hidden for free users
                        </Typography>
                        <Button
                          size="small"
                          component={RouterLink}
                          to="/subscription"
                          sx={{ p: 0, mt: 0.3, color: BRAND_RED, fontWeight: 800, fontSize: "0.75rem" }}
                        >
                          Upgrade to view phone number ›
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* 4e. Similar Vehicles Card - Real Dynamic Database Results */}
                {similarVehicles.length > 0 && (
                  <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff" }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: TEXT_MAIN, mb: 2 }}>
                        More Vehicles in {displayCity}
                      </Typography>

                      <Stack spacing={2}>
                        {similarVehicles.map((sim, i) => (
                          <Box
                            key={i}
                            component={RouterLink}
                            to={`/vehicle/${sim.id}`}
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              p: 1.2,
                              borderRadius: "10px",
                              border: `1px solid ${BORDER_COLOR}`,
                              textDecoration: "none",
                              color: "inherit",
                              transition: "all .18s ease",
                              "&:hover": { borderColor: BRAND_RED, bgcolor: "#FAFAFA" },
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                Array.isArray(sim.images) && sim.images[0]
                                  ? sim.images[0]
                                  : PLACEHOLDER
                              }
                              alt={sim.title}
                              sx={{
                                width: 85,
                                height: 75,
                                borderRadius: "8px",
                                objectFit: "cover",
                                flexShrink: 0,
                                bgcolor: "#E2E8F0",
                              }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                noWrap
                                sx={{ fontSize: "0.85rem", fontWeight: 800, color: TEXT_MAIN }}
                              >
                                {sim.title}
                              </Typography>
                              <Typography
                                noWrap
                                sx={{ fontSize: "0.75rem", color: TEXT_MUTED, mt: 0.2 }}
                              >
                                {getDisplayCity(sim)}
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mt: 0.8 }}
                              >
                                <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: BRAND_RED }}>
                                  {sim.price ? formatCurrency(sim.price) : "On Request"}
                                </Typography>
                                <Typography sx={{ fontSize: "0.72rem", color: TEXT_MUTED, fontWeight: 600 }}>
                                  {sim.km_driven ? `${Number(sim.km_driven).toLocaleString("en-IN")} km` : sim.category || "Verified"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>
                        ))}
                      </Stack>

                      <Button
                        fullWidth
                        component={RouterLink}
                        to="/explore"
                        sx={{
                          mt: 2,
                          bgcolor: "#F1F5F9",
                          color: TEXT_MAIN,
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          borderRadius: "8px",
                          py: 1,
                          "&:hover": { bgcolor: "#E2E8F0" },
                        }}
                      >
                        Explore All Vehicles in {displayCity}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* 4f. EasyDeal Automotive On-Ground Support Card */}
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "14px",
                    background: "#0F172A",
                    color: "#fff",
                    p: 2.5,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <SupportAgentRoundedIcon sx={{ fontSize: 26, color: "#14B8A6" }} />
                    <Typography variant="subtitle1" fontWeight={800}>
                      EasyDeal On-Ground Support
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.6, mb: 2 }}>
                    Need assistance inspecting this vehicle or verifying registration documents? Our verified field agents are available to assist you.
                  </Typography>
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/contact"
                    variant="outlined"
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.25)",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      borderRadius: "8px",
                      "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
                    }}
                  >
                    Contact Helpdesk (+91 8088185203)
                  </Button>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Fullscreen Image Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(10, 15, 29, 0.96)",
            backdropFilter: "blur(16px)",
            color: "#fff",
            borderRadius: { xs: 0, sm: "16px" },
            m: { xs: 0, sm: 2 },
            height: { xs: "100%", sm: "90vh" },
            maxHeight: "94vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          },
        }}
      >
        {/* Header bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.12)" }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#F1F5F9" }}>
            {vehicle?.title} ({activeImg + 1} / {images.length})
          </Typography>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        {/* Dialog Main Image Area */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1, sm: 2 },
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={images[activeImg] || PLACEHOLDER}
            alt={vehicle?.title}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />

          {images.length > 1 && (
            <>
              <IconButton
                onClick={() => setActiveImg((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                sx={{
                  position: "absolute",
                  left: 16,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                }}
              >
                <ChevronLeftRoundedIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={() => setActiveImg((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                sx={{
                  position: "absolute",
                  right: 16,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                }}
              >
                <ChevronRightRoundedIcon fontSize="large" />
              </IconButton>
            </>
          )}
        </Box>

        {/* Thumbnails at bottom of Lightbox */}
        {images.length > 1 && (
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              gap: 1.2,
              justifyContent: "center",
              overflowX: "auto",
              bgcolor: "rgba(0,0,0,0.5)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {images.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={img}
                alt=""
                onClick={() => setActiveImg(idx)}
                sx={{
                  width: 64,
                  height: 48,
                  objectFit: "contain",
                  bgcolor: "#0F172A",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: idx === activeImg ? `2px solid ${BRAND_RED}` : "1px solid rgba(255,255,255,0.2)",
                  opacity: idx === activeImg ? 1 : 0.6,
                  transition: "all 0.15s ease",
                  "&:hover": { opacity: 1 },
                }}
              />
            ))}
          </Box>
        )}
      </Dialog>
    </>
  );
}
