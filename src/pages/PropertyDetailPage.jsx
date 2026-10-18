// src/pages/PropertyDetailPage.jsx
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
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NavigationRoundedIcon from "@mui/icons-material/NavigationRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import BathtubRoundedIcon from "@mui/icons-material/BathtubRounded";
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

// Services & Helpers
import { propertyService } from "../services/api";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";
import { canViewPremiumDetails, getDisplayCity } from "../utils/permissions";
import {
  formatLandArea,
  formatBuiltupArea,
  parseAreaAndUnit,
  getLandConversionsPreview,
} from "../utils/landUnits";
import BookNowButton from "../components/BookNowButton";
import {
  CATEGORY_CONFIG,
  AMENITY_GROUPS,
  AMENITIES_DICTIONARY,
  normalizePropertyType,
} from "../config/propertyFields";

// Theme constants inspired by NoBroker reference
const BRAND_RED = "#FD3752";
const BRAND_RED_HOVER = "#E02640";
const BRAND_GREEN = "#00A36C";
const TEXT_MAIN = "#222222";
const TEXT_MUTED = "#666666";
const BORDER_COLOR = "#E2E8F0";
const BG_PAGE = "#F4F5F7";
const PLACEHOLDER = "https://placehold.co/800x500/e2e8f0/94a3b8?text=Property+Photo";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppState();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [shortlisted, setShortlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [userLocationInput, setUserLocationInput] = useState("");
  const [directionsResult, setDirectionsResult] = useState(null);

  const ownerId = property?.user_id || property?.owner_id || property?.owner?.id;
  const isPremium = canViewPremiumDetails(user, ownerId);

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await propertyService.getOne(id);
      console.log("Property details:-", res);
      const propData = res?.data ?? res;
      setProperty(propData);

      // Load real similar properties from DB
      try {
        const allRes = await propertyService.getAll({ limit: 10 });
        const allList = allRes?.data ?? allRes;
        if (Array.isArray(allList)) {
          const sim = allList.filter((p) => p.id !== id);
          setSimilarProperties(sim.slice(0, 3));
        }
      } catch {
        // ignore
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load property details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProperty]);

  const images = (() => {
    const imgs = property?.images || [];
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
        title: property?.title,
        text: `Check out "${property?.title}" on EasyDeal!`,
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
      property?.local_address
        ? `${property.local_address}, ${getDisplayCity(property)}`
        : property?.location || getDisplayCity(property) || "Bengaluru"
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

  if (error || !property) {
    return (
      <Box sx={{ minHeight: "70vh", bgcolor: BG_PAGE, py: 6 }}>
        <Container maxWidth="md">
          <Alert
            severity="error"
            sx={{ borderRadius: "14px", mb: 3 }}
            action={
              <Button size="small" color="inherit" onClick={fetchProperty} sx={{ fontWeight: 700 }}>
                Retry
              </Button>
            }
          >
            {error || "Property not found."}
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
  const displayCity = getDisplayCity(property);
  const fullAddress = property.local_address
    ? `${property.local_address}, ${displayCity}`
    : property.location || displayCity;
  const displayAddress = isPremium ? fullAddress : displayCity;

  const priceVal = Number(property.price || 0);
  const priceFormatted = priceVal ? formatCurrency(priceVal) : "Price on Request";
  const contactNumber = property.contact || property.owner?.phone || "";
  const whatsappUrl = contactNumber
    ? `https://wa.me/91${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi! I am interested in your listing "${property.title}" on EasyDeal.`
      )}`
    : null;

  const rentLeaseType = property.rent_lease || "Sale";
  const isRent = String(rentLeaseType).toLowerCase() === "rent";
  const isLease = String(rentLeaseType).toLowerCase() === "lease";

  // Land measurements (dynamically parsed)
  const landParsed = parseAreaAndUnit(property.land_area);
  const landEquivalent = property.land_area
    ? getLandConversionsPreview(landParsed.value, landParsed.unit)
    : null;

  const areaText = formatBuiltupArea(property.area) || formatLandArea(property.land_area);

  // Dynamic posted date
  const postedDate = property.created_at
    ? new Date(property.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // 100% Real Dynamic Key Specs for the Matrix
  const matrixCells = [
    property.property_type && {
      title: property.property_type,
      sub: "Property Type",
      icon: <HomeWorkRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    {
      title: isRent ? "Rent" : isLease ? "Lease" : "Sale",
      sub: "Transaction Type",
      icon: <KeyRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    (property.bedrooms || property.rooms) && {
      title: property.bedrooms
        ? `${property.bedrooms} Bedroom${property.bedrooms > 1 ? "s" : ""}`
        : `${property.rooms} Total Rooms`,
      sub: property.bedrooms ? "No. of Bedrooms" : "Rooms",
      icon: <BedRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.bathrooms && {
      title: `${property.bathrooms} Bathroom${property.bathrooms > 1 ? "s" : ""}`,
      sub: "Bathrooms",
      icon: <BathtubRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.furnishing && {
      title: property.furnishing,
      sub: "Furnishing Status",
      icon: <WeekendRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.facing && {
      title: `${property.facing} Facing`,
      sub: "Facing Direction",
      icon: <ExploreRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.parking && {
      title: property.parking,
      sub: "Parking Space",
      icon: <LocalParkingRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.water_supply && {
      title: property.water_supply,
      sub: "Water Supply",
      icon: <WaterDropRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.property_age && {
      title: property.property_age,
      sub: "Property Age",
      icon: <UpdateRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    areaText && {
      title: areaText,
      sub: property.area ? "Built-up Area" : "Land Measurement",
      icon: <SquareFootRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.apartment_name && {
      title: property.apartment_name,
      sub: "Society / Project",
      icon: <HomeRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.floor && {
      title: `Floor ${property.floor}`,
      sub: "Floor Level",
      icon: <LayersRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.rent_advance_amount && {
      title: formatCurrency(property.rent_advance_amount),
      sub: "Rent Advance Deposit",
      icon: <KeyRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.lease_duration_years && {
      title: `${property.lease_duration_years} Years`,
      sub: "Lease Duration",
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    property.crops_grown && {
      title: property.crops_grown,
      sub: "Crops Grown",
      icon: <AgricultureRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
    postedDate && {
      title: postedDate,
      sub: "Posted On",
      icon: <CalendarMonthRoundedIcon sx={{ fontSize: 24, color: TEXT_MUTED }} />,
    },
  ].filter(Boolean);

  // 100% Dynamic Overview Items Array (Strictly real data only)
  const overviewItems = [
    { label: "Property Type", value: property.property_type, icon: <HomeWorkRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Transaction Type", value: rentLeaseType, icon: <KeyRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Apartment / Society Name", value: property.apartment_name, icon: <HomeRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Floor Level", value: property.floor ? `Floor ${property.floor}` : null, icon: <LayersRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Bedrooms", value: property.bedrooms ? `${property.bedrooms} Bedroom${property.bedrooms > 1 ? "s" : ""}` : null, icon: <BedRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Bathrooms", value: property.bathrooms ? `${property.bathrooms} Bathroom${property.bathrooms > 1 ? "s" : ""}` : null, icon: <BathtubRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Total Rooms", value: property.rooms ? `${property.rooms} Rooms` : null, icon: <MeetingRoomRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Furnishing Status", value: property.furnishing, icon: <WeekendRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Facing Direction", value: property.facing ? `${property.facing} Facing` : null, icon: <ExploreRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Parking Space", value: property.parking, icon: <LocalParkingRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Water Supply", value: property.water_supply, icon: <WaterDropRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Property Age", value: property.property_age, icon: <UpdateRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Built-up Area", value: formatBuiltupArea(property.area), icon: <SquareFootRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Land Area", value: formatLandArea(property.land_area), icon: <AgricultureRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Land Regional Units", value: landEquivalent, icon: <AgricultureRoundedIcon sx={{ fontSize: 22, color: BRAND_GREEN }} />, isHighlight: true },
    { label: "Dimensions & Plot Details", value: property.additional_dimensions_details, icon: <SquareFootRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Rent Advance Amount", value: property.rent_advance_amount ? formatCurrency(property.rent_advance_amount) : null, icon: <KeyRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Lease Duration", value: property.lease_duration_years ? `${property.lease_duration_years} Years` : null, icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Crops Grown", value: property.crops_grown, icon: <AgricultureRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "City", value: displayCity, icon: <PlaceRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "State", value: property.state, icon: <PlaceRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Address / Locality", value: displayAddress, icon: <PlaceRoundedIcon sx={{ fontSize: 22, color: BRAND_RED }} />, isAddress: true },
    { label: "Contact Phone", value: isPremium ? (contactNumber || "Available with Seller") : "Locked (Premium Members Only)", icon: <PhoneRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    { label: "Listing Status", value: property.status ? property.status.toUpperCase() : "APPROVED", icon: <CheckCircleRoundedIcon sx={{ fontSize: 22, color: BRAND_GREEN }} /> },
    { label: "Posted On", value: postedDate, icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} /> },
    {
      label: "Last Updated",
      value: property.updated_at
        ? new Date(property.updated_at).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null,
      icon: <UpdateRoundedIcon sx={{ fontSize: 22, color: TEXT_MUTED }} />,
    },
  ].filter((item) => Boolean(item.value));

  // Dynamic nearby search chips
  const relatedSearchChips = [
    `${displayCity} City Center`,
    `${property.property_type || "Properties"} in ${displayCity}`,
    property.apartment_name ? `${property.apartment_name}` : null,
    `${rentLeaseType} Listings in ${displayCity}`,
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{property.title || "Property"} | EasyDeal</title>
        <meta
          name="description"
          content={`${property.title} in ${displayAddress}. ${priceFormatted}. Verified listing on EasyDeal.`}
        />
        <meta property="og:title" content={`${property.title} | EasyDeal`} />
        <meta property="og:description" content={`${property.title} in ${displayAddress}`} />
      </Helmet>

      <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh", pb: 10 }}>
        {/* ── 1. TOP HEADER BAR ── */}
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
              {/* Left Title & Property Type box */}
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
                  <HomeRoundedIcon sx={{ fontSize: 24, color: BRAND_RED }} />
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
                    {isRent ? "Rent" : isLease ? "Lease" : "Sale"}
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
                    {property.title}
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
                    {isRent ? "Monthly Rent" : isLease ? "Lease Amount" : "Expected Price"}
                  </Typography>
                </Box>

                {areaText && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ height: 35, my: "auto" }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_MAIN }}>
                        {areaText}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: TEXT_MUTED, fontWeight: 600 }}>
                        {property.area ? "Builtup Area" : "Land Area"}
                      </Typography>
                    </Box>
                  </>
                )}

                {(property.rent_advance_amount || property.lease_duration_years) && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ height: 35, my: "auto" }} />
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_MAIN }}>
                        {property.rent_advance_amount
                          ? formatCurrency(property.rent_advance_amount)
                          : `${property.lease_duration_years} Yrs`}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: TEXT_MUTED, fontWeight: 600 }}>
                        {property.rent_advance_amount ? "Advance Deposit" : "Lease Term"}
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
                  Schedule Visit
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
              Properties in {displayCity}
            </Link>
            {property.property_type && (
              <Link component={RouterLink} to="/explore" underline="hover" color="inherit">
                {property.property_type}
              </Link>
            )}
            <Typography color="text.primary" sx={{ fontSize: "0.82rem", fontWeight: 700 }}>
              {property.title}
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
                    height: { xs: 280, sm: 380, md: 450 },
                    bgcolor: "#1E293B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {isPremium ? (
                    <Box
                      component="img"
                      src={images[activeImg] || PLACEHOLDER}
                      alt={property.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ) : (
                    // Non-Premium Lock Banner (Preserves user privacy requirements)
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
                            Photos & Seller Contact Protected
                          </Typography>
                          <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: 400, mt: 0.5 }}>
                            Upgrade to EasyDeal Premium to unlock full photo gallery, verified owner phone number & exact street address.
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

                  {/* Overlaid Top-Left: Photos count & Map location */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 16, left: 16, zIndex: 5 }}
                  >
                    {isPremium ? (
                      <Chip
                        icon={<CameraAltRoundedIcon sx={{ fontSize: "16px !important", color: "#fff" }} />}
                        label={`Photos (${images.length})`}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.65)",
                          backdropFilter: "blur(6px)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.75rem",
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
                      label="Location Map"
                      onClick={() => {
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

                  {/* Overlaid Top-Right: Shortlist & Share */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ position: "absolute", top: 16, right: 16, zIndex: 5 }}
                  >
                    <IconButton
                      onClick={() => setShortlisted(!shortlisted)}
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
                      onClick={handleShare}
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

                  {/* Overlaid Bottom-Left: Verified status */}
                  <Box sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 5 }}>
                    <Chip
                      label={property.status ? `✔ ${property.status.toUpperCase()}` : "✔ VERIFIED"}
                      sx={{
                        bgcolor: BRAND_GREEN,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        borderRadius: "6px",
                      }}
                    />
                  </Box>

                  {/* Previous / Next Arrows */}
                  {isPremium && images.length > 1 && (
                    <>
                      <IconButton
                        onClick={() => setActiveImg((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        sx={{
                          position: "absolute",
                          left: 12,
                          bgcolor: "rgba(255,255,255,0.8)",
                          color: "#1E293B",
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        <ChevronLeftRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setActiveImg((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        sx={{
                          position: "absolute",
                          right: 12,
                          bgcolor: "rgba(255,255,255,0.8)",
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
                      bgcolor: "#FAFAFA",
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
                          width: 72,
                          height: 52,
                          borderRadius: "8px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border: activeImg === idx ? `2px solid ${BRAND_RED}` : `1px solid ${BORDER_COLOR}`,
                          opacity: activeImg === idx ? 1 : 0.65,
                          transition: "all .15s",
                          flexShrink: 0,
                          "&:hover": { opacity: 1 },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>

              {/* Related tags bar */}
              {/* {relatedSearchChips.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: "#fff",
                    borderRadius: "10px",
                    border: `1px solid ${BORDER_COLOR}`,
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: TEXT_MAIN, flexShrink: 0 }}>
                    Searches:
                  </Typography>
                  {relatedSearchChips.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      component={RouterLink}
                      to="/explore"
                      clickable
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        bgcolor: "#F1F5F9",
                        color: TEXT_MAIN,
                        borderRadius: "6px",
                        "&:hover": { bgcolor: "#E2E8F0" },
                      }}
                    />
                  ))}
                </Stack>
              )} */}
            </Grid>

            {/* Right side: Specifications Box (NoBroker matrix & CTAs) */}
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
                  {/* Dynamic Key Specs Grid */}
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
                    {matrixCells.map((cell, idx) => {
                      const isEven = idx % 2 === 0;
                      const isLastRow = idx >= matrixCells.length - (matrixCells.length % 2 === 0 ? 2 : 1);
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

                  {/* CTAs Section: Contact & Schedule Visit */}
                  <Stack id="booking-cta-section" spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5}>
                      {/* WhatsApp / Contact Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={isPremium ? <WhatsAppIcon /> : <PhoneRoundedIcon />}
                        href={isPremium && whatsappUrl ? whatsappUrl : undefined}
                        target={isPremium && whatsappUrl ? "_blank" : undefined}
                        onClick={!isPremium ? () => navigate("/subscription") : !whatsappUrl ? () => alert("Phone not provided") : undefined}
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

                      {/* Schedule Visit with Verified Availability pill */}
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
                          propertyId={property.id}
                          property={property}
                          amount={property.price || 1}
                          label="Schedule Visit"
                        />
                      </Box>
                    </Stack>
                  </Stack>

                  {/* Feedback Report options */}
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
                      {["Rented / Sold Out", "Incorrect Price", "Wrong Location"].map((reportReason, idx) => (
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
              {/* 4a. Overview Section - 100% Real Dynamic fields */}
              <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                      Property Overview & Specifications
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
                                🔒 Exact street address protected.{" "}
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

              {/* 4a.2 Category Specifics, Amenities & Custom Fields */}
              {(() => {
                const details = property.details;
                if (!details || typeof details !== "object") return null;

                const canonicalCat = normalizePropertyType(property.property_type);
                const catCfg = CATEGORY_CONFIG[canonicalCat] || CATEGORY_CONFIG["Residential"];
                const amenities = details.amenities || {};
                const customFields = Array.isArray(details.custom_fields) ? details.custom_fields : [];

                // Filter specific fields with real values
                const activeSpecificFields = (catCfg.specificFields || []).map((f) => {
                  const rawVal = details[f.name];
                  if (rawVal === undefined || rawVal === null || rawVal === "" || (Array.isArray(rawVal) && rawVal.length === 0)) {
                    return null;
                  }
                  return { ...f, value: rawVal };
                }).filter(Boolean);

                // Collect amenity groups that have at least one specified value
                const activeAmenityGroups = Object.keys(AMENITY_GROUPS).map((groupId) => {
                  const gDef = AMENITY_GROUPS[groupId];
                  const configuredAmenities = catCfg.amenities?.[groupId] || [];

                  const activeItems = configuredAmenities.map((item) => {
                    const val = amenities[item.key];
                    if (val === undefined || val === null || val === "") return null;
                    const def = AMENITIES_DICTIONARY[item.key] || { defaultLabel: item.key };
                    const label = item.labelOverride || def.defaultLabel;
                    return {
                      key: item.key,
                      label,
                      value: val,
                      amount: item.key === "loan_pending" ? amenities.loan_pending_amount : null,
                    };
                  }).filter(Boolean);

                  if (activeItems.length === 0) return null;
                  return { ...gDef, items: activeItems };
                }).filter(Boolean);

                // Filter active custom fields
                const activeCustomFields = customFields.filter(
                  (f) => f && f.label && f.value !== undefined && f.value !== null && f.value !== ""
                );

                const hasAnyData =
                  activeSpecificFields.length > 0 ||
                  activeAmenityGroups.length > 0 ||
                  activeCustomFields.length > 0;

                if (!hasAnyData) return null;

                return (
                  <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                          Verified Amenities & Detailed Specifications
                        </Typography>
                        <Box sx={{ width: 44, height: 3.5, bgcolor: BRAND_RED, mt: 1, borderRadius: "2px" }} />
                      </Box>

                      <Stack spacing={3}>
                        {/* 1. Category Specific Fields */}
                        {activeSpecificFields.length > 0 && (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: TEXT_MAIN, mb: 1.5 }}>
                              {canonicalCat} Specifications
                            </Typography>
                            <Grid container spacing={2}>
                              {activeSpecificFields.map((field) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: "10px",
                                      background: "#F8FAFC",
                                      border: `1px solid ${BORDER_COLOR}`,
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "0.78rem", color: TEXT_MUTED, mb: 0.5 }}>
                                      {field.label}
                                    </Typography>
                                    {field.type === "multiselect" ? (
                                      <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ gap: 0.8 }}>
                                        {field.value.map((item, idx) => (
                                          <Chip
                                            key={idx}
                                            label={item}
                                            size="small"
                                            sx={{
                                              fontWeight: 700,
                                              fontSize: "0.76rem",
                                              background: "#ECFDF5",
                                              color: "#059669",
                                              border: "1px solid #A7F3D0",
                                            }}
                                          />
                                        ))}
                                      </Stack>
                                    ) : field.type === "yesno" ? (
                                      <Stack direction="row" spacing={0.8} alignItems="center">
                                        {field.value === "Yes" ? (
                                          <>
                                            <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "#059669" }} />
                                            <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#059669" }}>
                                              Yes
                                            </Typography>
                                          </>
                                        ) : (
                                          <>
                                            <CancelRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                                            <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#64748B" }}>
                                              No
                                            </Typography>
                                          </>
                                        )}
                                      </Stack>
                                    ) : (
                                      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: TEXT_MAIN }}>
                                        {String(field.value)}
                                      </Typography>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* 2. Amenity Groups (U, A, N, F, L) */}
                        {activeAmenityGroups.map((group) => (
                          <Box key={group.id}>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: TEXT_MAIN, mb: 1.5 }}>
                              {group.title}
                            </Typography>
                            <Grid container spacing={1.5}>
                              {group.items.map((item) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={item.key}>
                                  <Box
                                    sx={{
                                      p: 1.4,
                                      borderRadius: "10px",
                                      background: item.value === "Yes" ? "#F0FDFA" : "#F8FAFC",
                                      border: `1px solid ${item.value === "Yes" ? "#CCFBF1" : BORDER_COLOR}`,
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
                        ))}

                        {/* 3. Custom Fields */}
                        {activeCustomFields.length > 0 && (
                          <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: TEXT_MAIN, mb: 1.5 }}>
                              Additional Property Features
                            </Typography>
                            <Grid container spacing={1.5}>
                              {activeCustomFields.map((field, idx) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                  <Box
                                    sx={{
                                      p: 1.4,
                                      borderRadius: "10px",
                                      background: field.value === "Yes" ? "#F0FDFA" : "#F8FAFC",
                                      border: `1px solid ${field.value === "Yes" ? "#CCFBF1" : BORDER_COLOR}`,
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

              {/* 4b. Description Section (Rendered only if description exists) */}
              {property.description && (
                <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, mb: 3 }}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_MAIN, lineHeight: 1 }}>
                        About This Property
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
                      {property.description}
                    </Typography>

                    {property.description.length > 200 && (
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
                      Location & Map
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
                      title="Property Location Map"
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
                        {property.owner?.name ? property.owner.name[0].toUpperCase() : <PersonRoundedIcon />}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontWeight: 800, fontSize: "0.95rem", color: TEXT_MAIN }}>
                          {property.owner?.name || "Verified Listing Owner"}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <VerifiedRoundedIcon sx={{ fontSize: 14, color: BRAND_GREEN }} />
                          <Typography sx={{ fontSize: "0.75rem", color: BRAND_GREEN, fontWeight: 700 }}>
                            {property.status === "approved" ? "Verified Seller" : "Active Member"}
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

                {/* 4e. Similar Properties Card - Real Dynamic Database Results */}
                {similarProperties.length > 0 && (
                  <Card elevation={0} sx={{ borderRadius: "14px", border: `1px solid ${BORDER_COLOR}`, bgcolor: "#fff" }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: TEXT_MAIN, mb: 2 }}>
                        More Properties in {displayCity}
                      </Typography>

                      <Stack spacing={2}>
                        {similarProperties.map((sim, i) => (
                          <Box
                            key={i}
                            component={RouterLink}
                            to={`/property/${sim.id}`}
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
                                  {sim.area ? `${sim.area}` : sim.property_type || "Verified"}
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
                        Explore All Properties in {displayCity}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* 4f. EasyDeal Support & Verification Guarantee */}
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
                    Have questions or need assistance visiting this property? Our verified field agents are available to assist you.
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
    </>
  );
}
