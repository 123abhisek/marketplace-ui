// src/components/FeaturedListings.jsx

import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GrassRoundedIcon from "@mui/icons-material/GrassRounded";

import { useAppState } from "../hooks/useAppState";
import { propertyService, vehicleService } from "../services/api";
import { formatCurrency } from "../utils/formatters";

const TYPE = {
  Property: {
    accent: "#5b4cf0",
    accentLight: "rgba(91,76,240,0.09)",
    accentBorder: "rgba(91,76,240,0.18)",
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
    fallback: "linear-gradient(145deg,#ede9ff 0%,#f4f3ff 100%)",
  },
  Vehicle: {
    accent: "#0f766e",
    accentLight: "rgba(15,118,110,0.08)",
    accentBorder: "rgba(15,118,110,0.2)",
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    fallback: "linear-gradient(145deg,#d1fae5 0%,#f0fdf9 100%)",
  },
};

const PROP_TAG = {
  Residential: {
    label: "Residential",
    icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Commercial: {
    label: "Commercial",
    icon: <StorefrontRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Agricultural: {
    label: "Agricultural",
    icon: <GrassRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Site: {
    label: "Site",
    icon: <HomeWorkRoundedIcon sx={{ fontSize: 14 }} />,
  },
  Flat: {
    label: "Flat",
    icon: <ApartmentRoundedIcon sx={{ fontSize: 14 }} />,
  },
};

const TABS = ["All", "Property", "Vehicle"];

/**
 * Normalizes ordinary arrays and typical Axios/API envelope formats:
 * [], { items: [] }, { results: [] }, { data: [] },
 * { data: { items: [] } }, { data: { results: [] } }, etc.
 */
function getList(response) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.items)) return payload.items;

  if (Array.isArray(payload?.results)) return payload.results;

  if (Array.isArray(payload?.data)) return payload.data;

  const nestedPayload = payload?.data;

  if (Array.isArray(nestedPayload?.items)) return nestedPayload.items;

  if (Array.isArray(nestedPayload?.results)) return nestedPayload.results;

  if (Array.isArray(nestedPayload?.data)) return nestedPayload.data;

  return [];
}

function getFirstImage(images) {
  if (Array.isArray(images)) {
    const first = images[0];

    if (typeof first === "string") return first;

    if (first && typeof first === "object") {
      return first.url || first.image_url || first.path || first.src || "";
    }

    return "";
  }

  if (typeof images === "string") return images;

  if (images && typeof images === "object") {
    return images.url || images.image_url || images.path || images.src || "";
  }

  return "";
}

function toCard(raw, kind, fallbackId) {
  const item = raw && typeof raw === "object" ? raw : {};

  if (kind === "Property") {
    const tag = PROP_TAG[item.propertyType] ?? PROP_TAG.Residential;

    const meta = [
      item.area ? `${item.area} sq.ft` : null,
      item.bedrooms ? `${item.bedrooms} BHK` : null,
      item.floor ? `Floor ${item.floor}` : null,
      item.landArea || null,
    ]
      .filter(Boolean)
      .join(" • ");

    return {
      id: item.id ?? item.property_id ?? `property-${fallbackId}`,
      type: "Property",
      tag: tag.label,
      tagIcon: tag.icon,
      title: item.title || item.name || "Property listing",
      location: item.location || item.city || "",
      price: item.expectedPrice ?? item.expected_price ?? item.price,
      meta: meta || item.propertyType || "",
      metaIcon: "sqft",
      isPremiumOnly: Boolean(item.message || item.isPremiumOnly),
      image: getFirstImage(item.images ?? item.image),
    };
  }

  const meta = [
    item.kmDriven
      ? `${Number(item.kmDriven).toLocaleString("en-IN")} km`
      : null,
    item.brand || null,
    item.rtoCode || null,
  ]
    .filter(Boolean)
    .join(" • ");

  return {
    id: item.id ?? item.vehicle_id ?? `vehicle-${fallbackId}`,
    type: "Vehicle",
    tag: item.brand || "Vehicle",
    tagIcon: <DirectionsCarRoundedIcon sx={{ fontSize: 14 }} />,
    title:
      item.title ||
      item.name ||
      `${item.brand || ""} ${item.model || "Vehicle"}`.trim(),
    location: item.location || item.city || "",
    price: item.expectedPrice ?? item.expected_price ?? item.price,
    meta,
    metaIcon: "km",
    isPremiumOnly: Boolean(item.message || item.isPremiumOnly),
    image: getFirstImage(item.images ?? item.image),
  };
}

function MetaPill({ icon, label, bg, color }) {
  if (!label) return null;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{
        px: 1.1,
        py: 0.45,
        minHeight: 28,
        borderRadius: "999px",
        background: bg,
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {icon}
      <Typography
        sx={{
          color,
          fontSize: "0.72rem",
          fontWeight: 700,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

function SkeletonCard() {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 340,
        minHeight: 470,
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{ aspectRatio: "4 / 3" }}
        animation="wave"
      />

      <CardContent sx={{ p: "18px !important" }}>
        <Skeleton variant="text" width="75%" height={24} animation="wave" />
        <Skeleton variant="text" width="40%" height={16} animation="wave" />

        <Stack direction="row" spacing={0.8} sx={{ mt: 2 }}>
          {[78, 68, 56].map((width) => (
            <Skeleton
              key={width}
              variant="rounded"
              width={width}
              height={28}
              animation="wave"
              sx={{ borderRadius: "999px" }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ListingCard({ item, user, isLoggedIn }) {
  const [liked, setLiked] = useState(false);

  const safeItem = item && typeof item === "object" ? item : {};
  const cfg = TYPE[safeItem.type] ?? TYPE.Property;

  const isPremiumUser = Boolean(
    user?.isPremium || user?.is_premium || user?.ispremium,
  );

  const isAdminUser = Boolean(
    user?.role === "admin" ||
      user?.isAdmin === true ||
      user?.is_admin === true,
  );

  const locked =
    !isPremiumUser && !isAdminUser && Boolean(safeItem.isPremiumOnly);

  const detailPath = `/dashboard/${
    safeItem.type === "Property" ? "properties" : "vehicles"
  }/${safeItem.id}`;

  const parts =
    typeof safeItem.meta === "string"
      ? safeItem.meta
          .split("•")
          .map((part) => part.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

  const title = safeItem.title || `${safeItem.type || "Listing"} listing`;

  const priceLabel =
    safeItem.type === "Property" ? "Expected price" : "Asking price";

  const primaryMetaIcon =
    safeItem.metaIcon === "km" ? (
      <SpeedRoundedIcon sx={{ fontSize: 12, color: cfg.accent }} />
    ) : (
      <SquareFootRoundedIcon sx={{ fontSize: 12, color: cfg.accent }} />
    );

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 340,
        minHeight: 470,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(226,232,240,.95)",
        boxShadow: "0 10px 30px rgba(15,23,42,.055)",
        transition: "transform .22s, box-shadow .22s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 22px 50px rgba(15,23,42,.1)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          background: cfg.fallback,
        }}
      >
        {safeItem.image ? (
          <Box
            component="img"
            src={safeItem.image}
            alt={title}
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: cfg.accent,
              opacity: 0.28,
            }}
          >
            {safeItem.type === "Property" ? (
              <HomeWorkRoundedIcon sx={{ fontSize: 68 }} />
            ) : (
              <DirectionsCarRoundedIcon sx={{ fontSize: 68 }} />
            )}
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15,23,42,.48), transparent 62%)",
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          <Chip
            icon={safeItem.tagIcon ?? cfg.icon}
            label={safeItem.tag || safeItem.type || "Listing"}
            size="small"
            sx={{
              height: 28,
              borderRadius: "999px",
              fontWeight: 900,
              background: "rgba(255,255,255,.92)",
              color: cfg.accent,
              border: `1px solid ${cfg.accentBorder}`,
            }}
          />

          <Stack direction="row" spacing={0.7}>
            {safeItem.isPremiumOnly && (
              <Chip
                icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 12 }} />}
                label="Premium"
                size="small"
                sx={{
                  height: 28,
                  borderRadius: "999px",
                  fontWeight: 900,
                  background: "rgba(15,23,42,.78)",
                  color: "#fff",
                }}
              />
            )}

            <IconButton
              size="small"
              onClick={() => setLiked((value) => !value)}
              sx={{
                width: 32,
                height: 32,
                background: "rgba(255,255,255,.92)",
              }}
            >
              {liked ? (
                <FavoriteRoundedIcon sx={{ fontSize: 15, color: "#ef4444" }} />
              ) : (
                <FavoriteBorderRoundedIcon
                  sx={{ fontSize: 15, color: "#64748b" }}
                />
              )}
            </IconButton>
          </Stack>
        </Stack>

        <Chip
          size="small"
          icon={<PlaceRoundedIcon sx={{ fontSize: 13 }} />}
          label={safeItem.location || "Location not available"}
          sx={{
            position: "absolute",
            left: 14,
            bottom: 14,
            maxWidth: "calc(100% - 28px)",
            height: 28,
            borderRadius: "999px",
            background: "rgba(255,255,255,.14)",
            color: "#fff",
            zIndex: 2,
          }}
        />

        {locked && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15,23,42,.16)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Box
              sx={{
                px: 2.3,
                py: 1.8,
                borderRadius: "20px",
                textAlign: "center",
                background: "rgba(255,255,255,.16)",
                border: "1px solid rgba(255,255,255,.2)",
              }}
            >
              <LockRoundedIcon sx={{ color: "#fff", fontSize: 28, mb: 1 }} />
              <Typography
                sx={{ fontSize: ".82rem", fontWeight: 900, color: "#fff" }}
              >
                Premium only
              </Typography>
              <Typography
                sx={{
                  mt: 0.45,
                  fontSize: ".72rem",
                  color: "rgba(255,255,255,.88)",
                }}
              >
                Unlock full details and pricing
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: "18px !important",
        }}
      >
        <Stack spacing={1.2} sx={{ flex: 1 }}>
          <Box>
            <Typography
              sx={{
                mb: 0.8,
                minHeight: "2.64em",
                color: "#0f172a",
                fontWeight: 900,
                fontSize: "1rem",
                lineHeight: 1.32,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                fontSize: ".78rem",
                fontWeight: 800,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              {safeItem.type || "Listing"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={0.75}
            useFlexGap
            sx={{ minHeight: 34 }}
          >
            {parts.length ? (
              parts.map((part, index) => (
                <MetaPill
                  key={`${part}-${index}`}
                  icon={index === 0 ? primaryMetaIcon : null}
                  label={part}
                  bg={cfg.accentLight}
                  color={cfg.accent}
                />
              ))
            ) : (
              <Box sx={{ height: 28 }} />
            )}
          </Stack>

          <Box
            sx={{
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid rgba(226,232,240,.85)",
            }}
          >
            {locked ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: ".72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    Access
                  </Typography>

                  <Typography
                    sx={{
                      color: "#0f172a",
                      fontSize: ".98rem",
                      fontWeight: 900,
                    }}
                  >
                    Premium required
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to="/subscription"
                  size="small"
                  startIcon={<LockRoundedIcon />}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 900,
                    textTransform: "none",
                    background: "linear-gradient(135deg,#7c6cff,#5e87ff)",
                    color: "#fff",
                  }}
                >
                  Unlock ₹299
                </Button>
              </Stack>
            ) : (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: ".7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {priceLabel}
                  </Typography>

                  <Typography
                    sx={{
                      color: cfg.accent,
                      fontWeight: 900,
                      fontSize: "1.16rem",
                    }}
                  >
                    {safeItem.price !== null &&
                    safeItem.price !== undefined &&
                    safeItem.price !== ""
                      ? formatCurrency(safeItem.price)
                      : "—"}
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to={isLoggedIn ? detailPath : "/login"}
                  endIcon={<ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 900,
                    textTransform: "none",
                    color: cfg.accent,
                    background: cfg.accentLight,
                    border: `1px solid ${cfg.accentBorder}`,
                  }}
                >
                  {isLoggedIn ? "View details" : "Login to view"}
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LoginToAccessCard() {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        px: 3,
        textAlign: "center",
        borderRadius: "28px",
        background:
          "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 50%,#eff6ff 100%)",
        border: "1px solid rgba(91,76,240,.16)",
        boxShadow: "0 18px 50px rgba(91,76,240,.08)",
      }}
    >
      <Box
        sx={{
          width: 68,
          height: 68,
          mx: "auto",
          mb: 2,
          borderRadius: "22px",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg,#7c6cff,#5e87ff)",
          color: "#fff",
          boxShadow: "0 12px 28px rgba(91,76,240,.25)",
        }}
      >
        <LockRoundedIcon sx={{ fontSize: 31 }} />
      </Box>

      <Typography
        sx={{
          mb: 0.8,
          color: "#0f172a",
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          fontWeight: 900,
        }}
      >
        Login to access complete listings
      </Typography>

      <Typography
        sx={{
          mb: 2.8,
          mx: "auto",
          maxWidth: 510,
          color: "#64748b",
          fontSize: ".92rem",
          lineHeight: 1.7,
        }}
      >
        Please log in to explore properties and vehicles, view complete listing
        details, check prices, and contact sellers.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        spacing={1.3}
      >
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          startIcon={<LockRoundedIcon />}
          sx={{
            borderRadius: "999px",
            px: 3.2,
            py: 1.15,
            textTransform: "none",
            fontWeight: 900,
            background: "linear-gradient(135deg,#7c6cff,#5e87ff)",
            boxShadow: "0 10px 24px rgba(91,76,240,.24)",
          }}
        >
          Login to explore
        </Button>

        <Button
          component={RouterLink}
          to="/register"
          variant="outlined"
          sx={{
            borderRadius: "999px",
            px: 3,
            py: 1.1,
            textTransform: "none",
            fontWeight: 800,
            color: "#5b4cf0",
            borderColor: "rgba(91,76,240,.28)",
          }}
        >
          Create account
        </Button>
      </Stack>
    </Box>
  );
}

function TabBar({ active, onChange }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {TABS.map((tab) => (
        <Button
          key={tab}
          onClick={() => onChange(tab)}
          size="small"
          sx={{
            borderRadius: "999px",
            px: 2,
            py: 0.75,
            fontWeight: 700,
            background:
              active === tab ? "#0f172a" : "rgba(148,163,184,.1)",
            color: active === tab ? "#fff" : "#475569",
            border:
              active === tab ? "none" : "1px solid rgba(148,163,184,.25)",
          }}
        >
          {tab}
        </Button>
      ))}
    </Stack>
  );
}

export default function FeaturedListings() {
  const { user } = useAppState();

  const isLoggedIn = Boolean(user?.loggedIn || user?.is_logged_in || user?.id);

  const isPremiumUser = Boolean(
    user?.isPremium || user?.is_premium || user?.ispremium,
  );

  const isAdminUser = Boolean(
    user?.role === "admin" ||
      user?.isAdmin === true ||
      user?.is_admin === true,
  );

  const shouldShowPremiumUpsell =
    isLoggedIn && !isPremiumUser && !isAdminUser;

  const [properties, setProperties] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const fetchAll = useCallback(async () => {
    if (!isLoggedIn) {
      setProperties([]);
      setVehicles([]);
      setErrorMsg("");
      setStatus("login");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const [propertyResponse, vehicleResponse] = await Promise.all([
        propertyService.getAll({ limit: 6 }),
        vehicleService.getAll({ limit: 6 }),
      ]);

      const propertyList = getList(propertyResponse);
      const vehicleList = getList(vehicleResponse);

      console.log("Property API raw response:", propertyResponse);
      console.log("Property normalized list:", propertyList);
      console.log("Vehicle API raw response:", vehicleResponse);
      console.log("Vehicle normalized list:", vehicleList);

      setProperties(Array.isArray(propertyList) ? propertyList : []);
      setVehicles(Array.isArray(vehicleList) ? vehicleList : []);
      setStatus("success");
    } catch (error) {
      console.error("Featured listing request failed:", error);

      const responseStatus = error?.response?.status;

      if (responseStatus === 401 || responseStatus === 403) {
        setProperties([]);
        setVehicles([]);
        setStatus("login");
        return;
      }

      const detail = error?.response?.data?.detail;

      setErrorMsg(
        typeof detail === "string"
          ? detail
          : "Unable to load listings right now.",
      );

      setStatus("error");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const safeProperties = Array.isArray(properties) ? properties : [];
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  const propertyCards = safeProperties.map((property, index) =>
    toCard(property, "Property", index),
  );

  const vehicleCards = safeVehicles.map((vehicle, index) =>
    toCard(vehicle, "Vehicle", index),
  );

  const allCards =
    activeTab === "All"
      ? [...propertyCards, ...vehicleCards].slice(0, 8)
      : activeTab === "Property"
        ? propertyCards.slice(0, 8)
        : vehicleCards.slice(0, 8);

  const isLoading = status === "loading";
  const isLoginRequired = status === "login";
  const isError = status === "error";
  const isEmpty = status === "success" && allCards.length === 0;

  return (
    <Box
      id="featured"
      sx={{
        py: { xs: 7, md: 11 },
        background:
          "linear-gradient(180deg,#f8fafc 0%,#fff 55%,#f8fafc 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={2}
          sx={{ mb: { xs: 4, md: 5.5 } }}
        >
          <Box>
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
                  background: "linear-gradient(135deg,#7c6cff,#5e87ff)",
                }}
              />

              <Typography
                sx={{
                  fontSize: ".74rem",
                  fontWeight: 800,
                  color: "#5b4cf0",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                Marketplace Preview
              </Typography>
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: "#0f172a",
                mb: 1.1,
              }}
            >
              Featured listings
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: ".93rem",
                maxWidth: 460,
                lineHeight: 1.7,
              }}
            >
              Properties and vehicles curated for quality. Log in to access
              complete listing information.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <TabBar active={activeTab} onChange={setActiveTab} />

            {isError && (
              <IconButton onClick={fetchAll} title="Retry">
                <RefreshRoundedIcon />
              </IconButton>
            )}

            <Button
              component={RouterLink}
              to={isLoggedIn ? "/dashboard/properties" : "/login"}
              variant="outlined"
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{
                borderRadius: "999px",
                px: 2.4,
                py: 1.05,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {isLoggedIn ? "View all listings" : "Login to access"}
            </Button>
          </Stack>
        </Stack>

        {isError && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: "14px",
              color: "#b91c1c",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography fontSize=".88rem">{errorMsg}</Typography>

            <Button
              size="small"
              onClick={fetchAll}
              startIcon={<RefreshRoundedIcon />}
            >
              Retry
            </Button>
          </Box>
        )}

        {isLoading ? (
          <Grid
            container
            spacing={{ xs: 2.5, sm: 3 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : isLoginRequired ? (
          <LoginToAccessCard />
        ) : isEmpty ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <HomeWorkRoundedIcon
              sx={{ fontSize: 52, color: "#cbd5e1", mb: 2 }}
            />
            <Typography fontWeight={800} color="#475569">
              No listings found
            </Typography>
            <Typography fontSize=".88rem" color="#94a3b8">
              Check back soon — new listings are added daily.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={{ xs: 2.5, sm: 3 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {allCards.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={`${item.type}-${item.id ?? index}`}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <ListingCard
                  item={item}
                  user={user}
                  isLoggedIn={isLoggedIn}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {status === "success" && allCards.length > 0 && (
          <Typography
            sx={{
              mt: 3.5,
              mb: 3,
              textAlign: "center",
              fontSize: ".77rem",
              color: "#94a3b8",
            }}
          >
            {propertyCards.length}{" "}
            {propertyCards.length === 1 ? "property" : "properties"} ·{" "}
            {vehicleCards.length}{" "}
            {vehicleCards.length === 1 ? "vehicle" : "vehicles"} loaded live
            from API
          </Typography>
        )}

        {shouldShowPremiumUpsell && (
          <Box
            sx={{
              mt: 3,
              p: { xs: "28px 24px", md: "32px 40px" },
              borderRadius: "24px",
              background: "#fff",
              border: "1px solid rgba(226,232,240,.9)",
              boxShadow: "0 4px 24px rgba(15,23,42,.06)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Stack spacing={0.7}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <WorkspacePremiumRoundedIcon sx={{ color: "#5b4cf0" }} />
                <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                  Unlock all listing details with Premium
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: ".87rem",
                  maxWidth: 500,
                  lineHeight: 1.68,
                }}
              >
                Upgrade to ₹299 premium to view contact details, pricing, and
                post your own property or vehicle listings.
              </Typography>
            </Stack>

            <Button
              component={RouterLink}
              to="/subscription"
              variant="contained"
              sx={{
                borderRadius: "999px",
                px: 2.6,
                py: 1.1,
                fontWeight: 800,
                whiteSpace: "nowrap",
                background: "linear-gradient(135deg,#7c6cff,#5e87ff)",
              }}
            >
              Get Premium — ₹299
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}