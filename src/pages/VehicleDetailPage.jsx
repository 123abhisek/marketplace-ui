
// src/pages/VehicleDetailPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { vehicleService } from "../services/api";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";
import BookNowButton from "../components/BookNowButton";

function SpecRow({ label, value, mono }) {
  if (value == null || value === "") return null;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        py: 1.4,
        borderBottom: "1px solid rgba(226,232,240,0.8)",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Typography
        sx={{
          fontSize: "0.83rem",
          color: "#64748b",
          fontWeight: 500,
          flexShrink: 0,
          mr: 2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.86rem",
          color: "#0f172a",
          fontWeight: 700,
          textAlign: "right",
          fontFamily: mono
            ? '"JetBrains Mono","Fira Mono",monospace'
            : "inherit",
          letterSpacing: mono ? "0.05em" : "inherit",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function StatCard({ icon, label, value }) {
  if (!value) return null;

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: 1.4,
        py: 1.6,
        borderRadius: "14px",
        bgcolor: "#fff",
        border: "1.5px solid rgba(226,232,240,0.9)",
        textAlign: "center",
        boxShadow: "0 1px 6px rgba(15,23,42,0.04)",
      }}
    >
      <Box
        sx={{
          color: "#0f766e",
          display: "flex",
          justifyContent: "center",
          mb: 0.6,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: "0.88rem",
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.62rem",
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mt: 0.3,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function PhotoGrid({ images, title, onOpen }) {
  const main = images[0];
  const side = images.slice(1, 5);
  const remaining = images.length - 5;

  if (!images.length) {
    return (
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          aspectRatio: "16/8",
          bgcolor: "#f1f5f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <DirectionsCarRoundedIcon sx={{ fontSize: 80, color: "#cbd5e1" }} />
        <Typography
          sx={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}
        >
          No images available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mb: 4.5,
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: side.length ? "1.4fr 1fr" : "1fr",
          gap: "3px",
          height: { xs: 240, sm: 360, md: 480 },
        }}
      >
        <Box
          sx={{
            borderRadius: side.length ? "20px 0 0 20px" : "20px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => onOpen(0)}
        >
          <Box
            component="img"
            src={main}
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .42s ease",
              "&:hover": { transform: "scale(1.025)" },
            }}
          />
        </Box>

        {side.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateRows:
                side.length > 2 ? "1fr 1fr" : `repeat(${side.length},1fr)`,
              gridTemplateColumns: side.length > 1 ? "1fr 1fr" : "1fr",
              gap: "3px",
            }}
          >
            {side.map((img, i) => (
              <Box
                key={i}
                onClick={() => onOpen(i + 1)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  borderRadius:
                    side.length === 1
                      ? "0 20px 20px 0"
                      : i === 1
                        ? "0 20px 0 0"
                        : i === side.length - 1 && side.length > 2
                          ? "0 0 20px 0"
                          : 0,
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Photo ${i + 2}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform .42s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                {i === side.length - 1 && remaining > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(15,23,42,0.62)",
                      backdropFilter: "blur(3px)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.6rem",
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      +{remaining}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      photos
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {images.length > 1 && (
        <Button
          onClick={() => onOpen(0)}
          startIcon={<GridViewRoundedIcon sx={{ fontSize: 15 }} />}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(226,232,240,0.9)",
            borderRadius: "10px",
            px: 2,
            py: 0.9,
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "#0f172a",
            boxShadow: "0 4px 16px rgba(15,23,42,0.10)",
            "&:hover": { bgcolor: "#fff" },
            transition: "all .18s ease",
          }}
        >
          Show all {images.length} photos
        </Button>
      )}
    </Box>
  );
}

function Lightbox({ images, active, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "rgba(7,11,20,0.96)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 18,
          right: 18,
          bgcolor: "rgba(255,255,255,0.10)",
          color: "#fff",
          borderRadius: "10px",
          "&:hover": { bgcolor: "rgba(255,255,255,0.20)" },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <Box
        sx={{
          position: "absolute",
          top: 22,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "rgba(255,255,255,0.10)",
          borderRadius: "999px",
          px: 2,
          py: 0.5,
        }}
      >
        <Typography sx={{ fontSize: "0.8rem", color: "#fff", fontWeight: 700 }}>
          {active + 1} / {images.length}
        </Typography>
      </Box>

      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ position: "relative", maxWidth: "88vw", maxHeight: "88vh" }}
      >
        <Box
          component="img"
          src={images[active]}
          alt=""
          sx={{
            maxWidth: "88vw",
            maxHeight: "85vh",
            borderRadius: "16px",
            objectFit: "contain",
            display: "block",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              sx={{
                position: "absolute",
                left: -56,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                borderRadius: "12px",
              }}
            >
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              sx={{
                position: "absolute",
                right: -56,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                borderRadius: "12px",
              }}
            >
              <KeyboardArrowRightRoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            overflowX: "auto",
            maxWidth: "80vw",
            pb: 0.5,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt=""
              sx={{
                width: 60,
                height: 44,
                objectFit: "cover",
                borderRadius: "8px",
                flexShrink: 0,
                border:
                  active === i
                    ? "2px solid #fff"
                    : "2px solid rgba(255,255,255,0.25)",
                opacity: active === i ? 1 : 0.55,
                transition: "all .15s ease",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAppState();

  const [vehicle, setVehicle] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);

    vehicleService
      .getOne(id)
      .then((data) => setVehicle(data))
      .catch((err) => {
        if (err?.status === 401) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setError("Could not load vehicle. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [id, logout, navigate]);

  const images = vehicle?.images?.filter(Boolean) ?? [];
  const price = vehicle?.price ?? vehicle?.expected_price;
  const totalImgs = images.length;

  const openLightbox = useCallback((i) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  const prevImg = useCallback(() => {
    setLightboxIdx((p) => (p - 1 + totalImgs) % totalImgs);
  }, [totalImgs]);

  const nextImg = useCallback(() => {
    setLightboxIdx((p) => (p + 1) % totalImgs);
  }, [totalImgs]);

  const colourMap = {
    white: "#f8fafc",
    black: "#0f172a",
    silver: "#94a3b8",
    grey: "#6b7280",
    gray: "#6b7280",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",
    brown: "#92400e",
    maroon: "#7f1d1d",
    gold: "#d97706",
    beige: "#d4c5a9",
    pearl: "#f0ece4",
  };

  const swatchColor =
    colourMap[(vehicle?.colour || "").toLowerCase().trim()] || "#94a3b8";
  const vehicleName = [vehicle?.brand, vehicle?.model, vehicle?.year]
    .filter(Boolean)
    .join(" ");
  const locationStr = [vehicle?.location, vehicle?.city, vehicle?.state]
    .filter(Boolean)
    .join(", ");
  const isNew = vehicle?.condition?.toLowerCase() === "new";
  const ownerId = vehicle?.owner_id ?? vehicle?.owner?.id ?? vehicle?.user_id;
  const isOwner = Boolean(user?.id && ownerId && user.id === ownerId);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress sx={{ color: "#0f766e" }} thickness={3} size={38} />
          <Typography
            sx={{ fontSize: "0.84rem", color: "#94a3b8", fontWeight: 600 }}
          >
            Loading vehicle…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 520, mx: "auto", mt: 10, px: 3 }}>
        <Alert severity="error" sx={{ borderRadius: "14px", mb: 2 }}>
          {error}
        </Alert>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ borderRadius: "10px", color: "#0f766e", fontWeight: 700 }}
        >
          Go back
        </Button>
      </Box>
    );
  }

  if (!vehicle) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          bgcolor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          px: { xs: 2, sm: 4, md: 6 },
          py: 1.2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#475569",
              borderRadius: "10px",
              px: 1.6,
              py: 0.7,
              bgcolor: "rgba(15,23,42,0.04)",
              "&:hover": { bgcolor: "rgba(15,23,42,0.08)", color: "#0f172a" },
            }}
          >
            Back to Listings
          </Button>

          <Stack direction="row" spacing={1}>
            <Tooltip title={saved ? "Saved" : "Save"}>
              <IconButton
                onClick={() => setSaved((p) => !p)}
                size="small"
                sx={{
                  border: "1.5px solid rgba(226,232,240,0.9)",
                  borderRadius: "10px",
                  p: "7px",
                  color: saved ? "#ef4444" : "#94a3b8",
                  "&:hover": {
                    bgcolor: "#fef2f2",
                    color: "#ef4444",
                    borderColor: "#fca5a5",
                  },
                }}
              >
                {saved ? (
                  <FavoriteRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <FavoriteBorderRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton
                size="small"
                sx={{
                  border: "1.5px solid rgba(226,232,240,0.9)",
                  borderRadius: "10px",
                  p: "7px",
                  color: "#94a3b8",
                  "&:hover": {
                    bgcolor: "#f0fdf4",
                    color: "#0f766e",
                    borderColor: "#a7f3d0",
                  },
                }}
              >
                <ShareRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 4, md: 5 },
          pt: 4,
          pb: 12,
        }}
      >
        <Box sx={{ mb: 3.5 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.4 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a" }}
            >
              Available
            </Typography>

            {vehicle.vehicle_type && (
              <Chip
                label={vehicle.vehicle_type}
                size="small"
                sx={{
                  height: 22,
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "0.67rem",
                  bgcolor: "rgba(15,118,110,0.08)",
                  color: "#0f766e",
                  border: "1px solid rgba(15,118,110,0.18)",
                }}
              />
            )}

            {vehicle.condition && (
              <Chip
                label={vehicle.condition}
                size="small"
                sx={{
                  height: 22,
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "0.67rem",
                  bgcolor: isNew
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(59,130,246,0.08)",
                  color: isNew ? "#16a34a" : "#2563eb",
                  border: `1px solid ${isNew ? "rgba(34,197,94,0.20)" : "rgba(59,130,246,0.20)"}`,
                }}
              />
            )}
          </Stack>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" },
              color: "#0f172a",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              mb: 1,
            }}
          >
            {price ? formatCurrency(price) : "—"}
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              color: "#475569",
              mb: 0.8,
              letterSpacing: "-0.01em",
            }}
          >
            {vehicleName || vehicle.title || "Vehicle"}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            sx={{ mb: 0.8, gap: 0.5 }}
          >
            {vehicle.km_driven && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SpeedRoundedIcon sx={{ fontSize: 15, color: "#475569" }} />
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {Number(vehicle.km_driven).toLocaleString("en-IN")} km
                </Typography>
              </Stack>
            )}

            {vehicle.fuel_type && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "#cbd5e1",
                  }}
                />
                <LocalGasStationRoundedIcon
                  sx={{ fontSize: 15, color: "#475569" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {vehicle.fuel_type}
                </Typography>
              </Stack>
            )}

            {vehicle.transmission && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "#cbd5e1",
                  }}
                />
                <SettingsRoundedIcon sx={{ fontSize: 15, color: "#475569" }} />
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {vehicle.transmission}
                </Typography>
              </Stack>
            )}

            {vehicle.year && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    bgcolor: "#cbd5e1",
                  }}
                />
                <CalendarTodayRoundedIcon
                  sx={{ fontSize: 15, color: "#475569" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {vehicle.year}
                </Typography>
              </Stack>
            )}
          </Stack>

          {locationStr && (
            <Stack direction="row" spacing={0.6} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
              <Typography
                sx={{ fontSize: "0.87rem", color: "#64748b", fontWeight: 500 }}
              >
                {locationStr}
              </Typography>
            </Stack>
          )}
        </Box>

        <PhotoGrid
          images={images}
          title={vehicle.title || vehicleName}
          onOpen={openLightbox}
        />

        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} md={7}>
            {(vehicle.km_driven ||
              vehicle.fuel_type ||
              vehicle.transmission ||
              vehicle.year) && (
              <Stack
                direction="row"
                spacing={1.2}
                sx={{ mb: 3.5, flexWrap: "wrap", gap: 1 }}
              >
                <StatCard
                  icon={<SpeedRoundedIcon sx={{ fontSize: 18 }} />}
                  label="KM"
                  value={
                    vehicle.km_driven
                      ? Number(vehicle.km_driven).toLocaleString("en-IN")
                      : null
                  }
                />
                <StatCard
                  icon={<LocalGasStationRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Fuel"
                  value={vehicle.fuel_type}
                />
                <StatCard
                  icon={<SettingsRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Gear"
                  value={vehicle.transmission}
                />
                <StatCard
                  icon={<CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />}
                  label="Year"
                  value={vehicle.year}
                />
              </Stack>
            )}

            {vehicle.description && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#0f172a",
                    mb: 1.5,
                  }}
                >
                  About this vehicle
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.91rem",
                    color: "#475569",
                    lineHeight: 1.85,
                  }}
                >
                  {vehicle.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: "rgba(226,232,240,0.8)", mb: 4 }} />

            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: "18px",
                border: "1.5px solid rgba(226,232,240,0.9)",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  bgcolor: "#f8fafc",
                  borderBottom: "1px solid rgba(226,232,240,0.8)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <DirectionsCarRoundedIcon
                    sx={{ fontSize: 16, color: "#0f766e" }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#0f172a",
                    }}
                  >
                    Vehicle Details
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ px: 2.5, py: 0.5 }}>
                <SpecRow label="Brand" value={vehicle.brand} />
                <SpecRow label="Model" value={vehicle.model} />
                <SpecRow label="Year" value={vehicle.year} />
                <SpecRow label="Vehicle Type" value={vehicle.vehicle_type} />
                <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
                <SpecRow label="Transmission" value={vehicle.transmission} />
                <SpecRow
                  label="KM Driven"
                  value={
                    vehicle.km_driven
                      ? `${Number(vehicle.km_driven).toLocaleString("en-IN")} km`
                      : null
                  }
                />
                <SpecRow label="Condition" value={vehicle.condition} />
                <SpecRow label="Location" value={vehicle.location} />
                <SpecRow label="City" value={vehicle.city} />
                <SpecRow label="State" value={vehicle.state} />
                <SpecRow
                  label="Listed On"
                  value={
                    vehicle.created_at
                      ? new Date(vehicle.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : null
                  }
                />
              </Box>
            </Box>

            {(vehicle.colour || vehicle.vehicle_number || vehicle.rto_code) && (
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "18px",
                  border: "1.5px solid rgba(226,232,240,0.9)",
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.8,
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid rgba(226,232,240,0.8)",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ColorLensRoundedIcon
                      sx={{ fontSize: 16, color: "#0f766e" }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.92rem",
                        color: "#0f172a",
                      }}
                    >
                      Colour & Registration
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ px: 2.5, py: 0.5 }}>
                  {vehicle.colour && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        py: 1.4,
                        borderBottom: "1px solid rgba(226,232,240,0.8)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.83rem",
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        Colour
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "4px",
                            bgcolor: swatchColor,
                            border: "1.5px solid rgba(0,0,0,0.12)",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.86rem",
                            color: "#0f172a",
                            fontWeight: 700,
                          }}
                        >
                          {vehicle.colour}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}

                  <SpecRow
                    label="Vehicle No."
                    value={vehicle.vehicle_number}
                    mono
                  />
                  <SpecRow label="RTO Code" value={vehicle.rto_code} />
                </Box>
              </Box>
            )}

            <Box
              sx={{
                borderRadius: "14px",
                px: 2.5,
                py: 1.8,
                bgcolor: "rgba(15,118,110,0.04)",
                border: "1.5px solid rgba(15,118,110,0.14)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <TrendingUpRoundedIcon
                sx={{ fontSize: 22, color: "#0f766e", flexShrink: 0 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.87rem",
                    fontWeight: 800,
                    color: "#0f766e",
                  }}
                >
                  This vehicle is in high demand
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", color: "#0f766e", opacity: 0.75 }}
                >
                  Viewed 1,840 times this week. Book now.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 72 } }}>
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "22px",
                  border: "1.5px solid rgba(226,232,240,0.9)",
                  boxShadow: "0 8px 40px rgba(15,23,42,0.09)",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    pt: 3,
                    pb: 2.5,
                    borderBottom: "1px solid rgba(226,232,240,0.8)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.65rem",
                          color: "#94a3b8",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          mb: 0.5,
                        }}
                      >
                        Asking Price
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: "2.1rem",
                          color: "#0f172a",
                          letterSpacing: "-0.05em",
                          lineHeight: 1,
                        }}
                      >
                        {price ? formatCurrency(price) : "—"}
                      </Typography>
                    </Box>

                    <Chip
                      label={vehicle.condition || "Used"}
                      size="small"
                      sx={{
                        height: 24,
                        borderRadius: "7px",
                        fontWeight: 800,
                        fontSize: "0.67rem",
                        bgcolor: isNew
                          ? "rgba(34,197,94,0.09)"
                          : "rgba(59,130,246,0.09)",
                        color: isNew ? "#16a34a" : "#2563eb",
                        border: `1px solid ${isNew ? "rgba(34,197,94,0.22)" : "rgba(59,130,246,0.22)"}`,
                      }}
                    />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid rgba(226,232,240,0.8)",
                  }}
                >
                  <Grid container rowSpacing={1.5} columnSpacing={2}>
                    {[
                      {
                        icon: <SpeedRoundedIcon sx={{ fontSize: 14 }} />,
                        label: vehicle.km_driven
                          ? `${Number(vehicle.km_driven).toLocaleString("en-IN")} km`
                          : null,
                      },
                      {
                        icon: (
                          <LocalGasStationRoundedIcon sx={{ fontSize: 14 }} />
                        ),
                        label: vehicle.fuel_type,
                      },
                      {
                        icon: <SettingsRoundedIcon sx={{ fontSize: 14 }} />,
                        label: vehicle.transmission,
                      },
                      {
                        icon: (
                          <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
                        ),
                        label: vehicle.year ? `Year ${vehicle.year}` : null,
                      },
                    ]
                      .filter((d) => d.label)
                      .map((d, i) => (
                        <Grid item xs={6} key={i}>
                          <Stack
                            direction="row"
                            spacing={0.8}
                            alignItems="center"
                          >
                            <Box sx={{ color: "#0f766e", flexShrink: 0 }}>
                              {d.icon}
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                color: "#475569",
                              }}
                            >
                              {d.label}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                  </Grid>
                </Box>

                {vehicle.contact && (
                  <Box
                    sx={{
                      px: 3,
                      py: 2.2,
                      borderBottom: "1px solid rgba(226,232,240,0.8)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.67rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        mb: 1.4,
                      }}
                    >
                      Seller
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#0f766e,#0e9e8d)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(15,118,110,0.25)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: "1rem",
                            color: "#fff",
                          }}
                        >
                          {(vehicle.owner_name || "S")[0].toUpperCase()}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={0.6}
                          alignItems="center"
                        >
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.9rem",
                              color: "#0f172a",
                            }}
                          >
                            {vehicle.owner_name || "Seller"}
                          </Typography>
                          <VerifiedRoundedIcon
                            sx={{ fontSize: 15, color: "#0f766e" }}
                          />
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: "0.77rem",
                            color: "#94a3b8",
                            fontWeight: 500,
                          }}
                        >
                          {vehicle.contact}
                        </Typography>
                      </Box>

                      <Button
                        component="a"
                        href={`tel:${vehicle.contact}`}
                        variant="outlined"
                        size="small"
                        startIcon={<PhoneRoundedIcon sx={{ fontSize: 13 }} />}
                        sx={{
                          borderRadius: "9px",
                          fontSize: "0.73rem",
                          fontWeight: 700,
                          py: 0.7,
                          px: 1.4,
                          borderColor: "rgba(15,118,110,0.3)",
                          color: "#0f766e",
                          "&:hover": {
                            borderColor: "#0f766e",
                            bgcolor: "rgba(15,118,110,0.04)",
                          },
                        }}
                      >
                        Call
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid rgba(226,232,240,0.8)",
                  }}
                >
                  {[
                    {
                      label: "Asking price",
                      value: price ? formatCurrency(price) : "—",
                      color: "#0f172a",
                      bold: false,
                    },
                    {
                      label: "Booking fee",
                      value: "₹1",
                      color: "#0f172a",
                      bold: false,
                    },
                    {
                      label: "Total now",
                      value: "₹1",
                      color: "#0f766e",
                      bold: true,
                    },
                  ].map((r, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: r.bold ? 0 : 0.9 }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.83rem",
                          color: r.bold ? "#0f172a" : "#64748b",
                          fontWeight: r.bold ? 700 : 500,
                        }}
                      >
                        {r.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: r.bold ? "1rem" : "0.83rem",
                          fontWeight: 800,
                          color: r.color,
                        }}
                      >
                        {r.value}
                      </Typography>
                    </Stack>
                  ))}
                </Box>

                <Box sx={{ px: 3, py: 2.5 }}>
                  <BookNowButton
                    vehicleId={vehicle.id || id}
                    amount={100}
                    label="Book This Vehicle"
                    disabled={isOwner}
                    onSuccess={() => navigate("/dashboard/my-bookings")}
                  />

                  {isOwner && (
                    <Typography
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        fontSize: "0.76rem",
                        color: "#94a3b8",
                        fontWeight: 700,
                      }}
                    >
                      You cannot book your own vehicle
                    </Typography>
                  )}

                  {vehicle.contact && (
                    <Button
                      fullWidth
                      component="a"
                      href={`tel:${vehicle.contact}`}
                      variant="outlined"
                      startIcon={<PhoneRoundedIcon />}
                      sx={{
                        mt: 1.3,
                        borderRadius: "13px",
                        py: 1.4,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        borderColor: "rgba(15,118,110,0.3)",
                        color: "#0f766e",
                        "&:hover": {
                          borderColor: "#0f766e",
                          bgcolor: "rgba(15,118,110,0.04)",
                        },
                      }}
                    >
                      Call Seller
                    </Button>
                  )}

                  {!user?.isPremium && (
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 1.5 }}
                    >
                      <WorkspacePremiumRoundedIcon
                        sx={{ fontSize: 13, color: "#7c3aed" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.73rem",
                          color: "#7c3aed",
                          fontWeight: 700,
                        }}
                      >
                        <Box
                          component={RouterLink}
                          to="/subscription"
                          sx={{ color: "inherit", textDecoration: "underline" }}
                        >
                          Upgrade to Premium
                        </Box>{" "}
                        to post listings
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          active={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevImg}
          onNext={nextImg}
        />
      )}
    </Box>
  );
}
