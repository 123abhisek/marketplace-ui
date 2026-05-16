
// src/pages/ExplorePage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VillaRoundedIcon from "@mui/icons-material/VillaRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

const COLORS = {
  pageBg: "#f5f7fb",
  surface: "#ffffff",
  surfaceSoft: "#f8fafc",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.12)",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primarySoft: "rgba(15,118,110,0.08)",
  blue: "#2563eb",
  blueSoft: "rgba(37,99,235,0.08)",
  peach: "#ea7a4c",
  peachSoft: "rgba(234,122,76,0.10)",
  gold: "#c7921f",
  goldSoft: "rgba(199,146,31,0.10)",
  shadowSoft: "0 2px 10px rgba(15,23,42,0.04)",
  shadow: "0 14px 36px rgba(15,23,42,0.08)",
};

const cardSx = {
  borderRadius: "22px",
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  boxShadow: COLORS.shadowSoft,
};

const carouselSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Featured properties",
    title: "Find modern homes, plots, and rentals in one place",
    desc: "Browse curated property listings with clean filters and faster discovery.",
    chip: "Property picks",
    accent: COLORS.primary,
  },
  {
    id: 2,
    image:
      "data:image/jpeg;base64,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",
    eyebrow: "Top vehicle deals",
    title: "Explore cars, bikes, and commercial vehicles with ease",
    desc: "Compare options across categories, brands, and price ranges instantly.",
    chip: "Vehicle picks",
    accent: COLORS.blue,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Easydeal marketplace",
    title: "Search smarter across everything you're looking for",
    desc: "One Explore page for both properties and vehicles, designed for quick browsing.",
    chip: "All in one",
    accent: COLORS.peach,
  },
];

function formatPrice(value) {
  const num = Number(value || 0);
  if (!num) return "Price on request";
  return `₹${num.toLocaleString("en-IN")}`;
}

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getImage(item) {
  return (
    item.image ||
    item.images?.[0] ||
    item.photo ||
    item.thumbnail ||
    item.cover ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
  );
}

function getTitle(item) {
  return (
    item.title ||
    item.name ||
    item.propertyTitle ||
    item.vehicleTitle ||
    item.model ||
    "Untitled listing"
  );
}

function getLocation(item) {
  return (
    item.location ||
    item.city ||
    item.address ||
    item.place ||
    item.district ||
    "Location not specified"
  );
}

function getCategory(item, type) {
  return (
    item.category ||
    item.type ||
    item.propertyType ||
    item.vehicleType ||
    (type === "property" ? "Property" : "Vehicle")
  );
}

function getCompany(item, type) {
  return (
    item.company ||
    item.brand ||
    item.make ||
    item.builder ||
    item.ownerCompany ||
    (type === "property" ? "Independent" : "Unspecified")
  );
}

function getPrice(item) {
  return Number(item.price || item.amount || item.rent || item.salePrice || 0);
}

function ListingCard({ item, navigate, index }) {
  const tone = item.itemType === "property" ? COLORS.primary : COLORS.blue;
  const soft = item.itemType === "property" ? COLORS.primarySoft : COLORS.blueSoft;

  return (
    <Card
      sx={{
        ...cardSx,
        height: "100%",
        overflow: "hidden",
        transition: "transform .35s ease, box-shadow .35s ease, border-color .35s ease, opacity .45s ease",
        animation: `fadeUp .45s ease ${index * 0.05}s both`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: COLORS.shadow,
          borderColor: COLORS.borderStrong,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 220,
          overflow: "hidden",
          background: COLORS.surfaceSoft,
        }}
      >
        <Box
          component="img"
          src={getImage(item.raw)}
          alt={getTitle(item.raw)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .6s ease",
            ".MuiCard-root:hover &": {
              transform: "scale(1.04)",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.00) 25%, rgba(15,23,42,0.52) 100%)",
          }}
        />
        <Chip
          label={item.itemType === "property" ? "Property" : "Vehicle"}
          icon={
            item.itemType === "property" ? (
              <HomeWorkRoundedIcon sx={{ fontSize: "16px !important" }} />
            ) : (
              <DirectionsCarRoundedIcon sx={{ fontSize: "16px !important" }} />
            )
          }
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            height: 30,
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "0.72rem",
            color: "#fff",
            background: "rgba(255,255,255,0.16)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.2 }}>
        <Stack spacing={1.15}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 900,
                color: COLORS.text,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                minHeight: 48,
              }}
            >
              {getTitle(item.raw)}
            </Typography>

            <Chip
              label={getCategory(item.raw, item.itemType)}
              size="small"
              sx={{
                flexShrink: 0,
                height: 26,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.68rem",
                color: tone,
                background: soft,
                border: `1px solid ${soft}`,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <PlaceRoundedIcon sx={{ fontSize: 16, color: COLORS.faint }} />
            <Typography sx={{ fontSize: "0.82rem", color: COLORS.muted, fontWeight: 600 }}>
              {getLocation(item.raw)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <BusinessRoundedIcon sx={{ fontSize: 16, color: COLORS.faint }} />
            <Typography sx={{ fontSize: "0.82rem", color: COLORS.muted, fontWeight: 600 }}>
              {getCompany(item.raw, item.itemType)}
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: COLORS.border, my: 0.6 }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: COLORS.faint,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Price
              </Typography>
              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: COLORS.text,
                }}
              >
                {formatPrice(getPrice(item.raw))}
              </Typography>
            </Box>

            <Button
              onClick={() =>
                navigate(item.itemType === "property" ? "/properties" : "/vehicles")
              }
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />}
              sx={{
                minHeight: 42,
                px: 1.8,
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.84rem",
                color: COLORS.text,
                background: COLORS.surfaceSoft,
                border: `1px solid ${COLORS.border}`,
                "&:hover": {
                  background: "#f1f5f9",
                },
              }}
            >
              View
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { properties = [], vehicles = [] } = useAppState();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const allItems = useMemo(() => {
    const mappedProperties = (properties || []).map((item, index) => ({
      id: item.id || item._id || `property-${index}`,
      itemType: "property",
      raw: item,
      createdAt: item.createdAt || item.date || item.postedAt || 0,
    }));

    const mappedVehicles = (vehicles || []).map((item, index) => ({
      id: item.id || item._id || `vehicle-${index}`,
      itemType: "vehicle",
      raw: item,
      createdAt: item.createdAt || item.date || item.postedAt || 0,
    }));

    return [...mappedProperties, ...mappedVehicles];
  }, [properties, vehicles]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    allItems.forEach((item) => {
      const value = getCategory(item.raw, item.itemType);
      if (value) set.add(value);
    });
    return ["all", ...Array.from(set)];
  }, [allItems]);

  const companyOptions = useMemo(() => {
    const set = new Set();
    allItems.forEach((item) => {
      const value = getCompany(item.raw, item.itemType);
      if (value) set.add(value);
    });
    return ["all", ...Array.from(set)];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    let result = [...allItems];
    const searchTerm = normalizeText(search);

    if (searchTerm) {
      result = result.filter((item) => {
        const haystack = [
          getTitle(item.raw),
          getLocation(item.raw),
          getCategory(item.raw, item.itemType),
          getCompany(item.raw, item.itemType),
          item.itemType,
          item.raw.description,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      });
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.itemType === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (item) => getCategory(item.raw, item.itemType) === categoryFilter
      );
    }

    if (companyFilter !== "all") {
      result = result.filter(
        (item) => getCompany(item.raw, item.itemType) === companyFilter
      );
    }

    if (minPrice !== "") {
      result = result.filter((item) => getPrice(item.raw) >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((item) => getPrice(item.raw) <= Number(maxPrice));
    }

    if (sortBy === "priceLowHigh") {
      result.sort((a, b) => getPrice(a.raw) - getPrice(b.raw));
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => getPrice(b.raw) - getPrice(a.raw));
    } else if (sortBy === "nameAZ") {
      result.sort((a, b) => getTitle(a.raw).localeCompare(getTitle(b.raw)));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [
    allItems,
    search,
    typeFilter,
    categoryFilter,
    companyFilter,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setCompanyFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
  };

  const activeSlide = carouselSlides[slideIndex];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: COLORS.pageBg,
        p: { xs: 2, md: 3 },
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes softZoom": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.05)" },
        },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Stack spacing={2.2}>
          {/* Carousel */}
          <Card
            sx={{
              ...cardSx,
              overflow: "hidden",
              animation: "fadeUp .45s ease both",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, sm: 360, md: 390 },
                overflow: "hidden",
              }}
            >
              {carouselSlides.map((slide, index) => (
                <Box
                  key={slide.id}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    opacity: index === slideIndex ? 1 : 0,
                    transform: index === slideIndex ? "scale(1)" : "scale(1.02)",
                    transition: "opacity .6s ease, transform .6s ease",
                    pointerEvents: index === slideIndex ? "auto" : "none",
                  }}
                >
                  <Box
                    component="img"
                    src={slide.image}
                    alt={slide.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      animation: index === slideIndex ? "softZoom 4.5s linear both" : "none",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(15,23,42,0.76) 0%, rgba(15,23,42,0.52) 36%, rgba(15,23,42,0.14) 100%)",
                    }}
                  />
                </Box>
              ))}

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  p: { xs: 2.2, sm: 3.2, md: 4 },
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} md={8}>
                    <Chip
                      label={activeSlide.chip}
                      sx={{
                        height: 30,
                        borderRadius: "999px",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        color: "#fff",
                        background: "rgba(255,255,255,0.14)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.16)",
                      }}
                    />
                    <Typography
                      sx={{
                        mt: 1.5,
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.74)",
                      }}
                    >
                      {activeSlide.eyebrow}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: { xs: "1.55rem", sm: "2rem", md: "2.35rem" },
                        lineHeight: 1.06,
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        color: "#fff",
                        maxWidth: 680,
                      }}
                    >
                      {activeSlide.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1.1,
                        fontSize: "0.92rem",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.78)",
                        maxWidth: 560,
                      }}
                    >
                      {activeSlide.desc}
                    </Typography>

                    <Stack direction="row" spacing={1.1} sx={{ mt: 2.2, flexWrap: "wrap" }}>
                      <Button
                        onClick={() => setTypeFilter("property")}
                        startIcon={<VillaRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          minHeight: 46,
                          px: 2,
                          borderRadius: "15px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          color: COLORS.text,
                          background: "#fff",
                          "&:hover": {
                            background: "#f8fafc",
                          },
                        }}
                      >
                        Explore properties
                      </Button>
                      <Button
                        onClick={() => setTypeFilter("vehicle")}
                        startIcon={<DirectionsBikeRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          minHeight: 46,
                          px: 2,
                          borderRadius: "15px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          color: "#fff",
                          background: "rgba(255,255,255,0.14)",
                          border: "1px solid rgba(255,255,255,0.20)",
                          backdropFilter: "blur(8px)",
                          "&:hover": {
                            background: "rgba(255,255,255,0.20)",
                          },
                        }}
                      >
                        Explore vehicles
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    >
                      <IconButton
                        onClick={() =>
                          setSlideIndex((prev) =>
                            prev === 0 ? carouselSlides.length - 1 : prev - 1
                          )
                        }
                        sx={{
                          width: 44,
                          height: 44,
                          background: "rgba(255,255,255,0.14)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.16)",
                          backdropFilter: "blur(8px)",
                          "&:hover": {
                            background: "rgba(255,255,255,0.22)",
                          },
                        }}
                      >
                        <ChevronLeftRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSlideIndex((prev) => (prev + 1) % carouselSlides.length)
                        }
                        sx={{
                          width: 44,
                          height: 44,
                          background: "rgba(255,255,255,0.14)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.16)",
                          backdropFilter: "blur(8px)",
                          "&:hover": {
                            background: "rgba(255,255,255,0.22)",
                          },
                        }}
                      >
                        <ChevronRightRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: "absolute",
                  left: { xs: 20, sm: 30, md: 34 },
                  bottom: 20,
                  zIndex: 3,
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <Box
                    key={slide.id}
                    onClick={() => setSlideIndex(index)}
                    sx={{
                      width: index === slideIndex ? 28 : 9,
                      height: 9,
                      borderRadius: "999px",
                      background:
                        index === slideIndex
                          ? "#fff"
                          : "rgba(255,255,255,0.44)",
                      transition: "all .25s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Card>

          {/* Search + filters */}
          <Card
            sx={{
              ...cardSx,
              animation: "fadeUp .5s ease .08s both",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 2.4 } }}>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                  spacing={1.2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.35rem", sm: "1.6rem" },
                        fontWeight: 900,
                        color: COLORS.text,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Explore all listings
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: "0.86rem",
                        color: COLORS.muted,
                        fontWeight: 600,
                      }}
                    >
                      Search across both properties and vehicles with filters.
                    </Typography>
                  </Box>

                  <Chip
                    label={`${filteredItems.length} results`}
                    sx={{
                      height: 32,
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "0.74rem",
                      color: COLORS.primary,
                      background: COLORS.primarySoft,
                      border: `1px solid ${COLORS.primarySoft}`,
                    }}
                  />
                </Stack>

                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by title, location, category, company..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ color: COLORS.faint }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                          "& fieldset": { borderColor: COLORS.border },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                      <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        sx={{
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                        }}
                      >
                        <MenuItem value="all">All items</MenuItem>
                        <MenuItem value="property">Properties</MenuItem>
                        <MenuItem value="vehicle">Vehicles</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                      <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                        }}
                      >
                        {categoryOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === "all" ? "All categories" : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <Select
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        sx={{
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                        }}
                      >
                        {companyOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option === "all" ? "All companies" : option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} md={1}>
                    <TextField
                      fullWidth
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                          "& fieldset": { borderColor: COLORS.border },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} md={1}>
                    <TextField
                      fullWidth
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                          "& fieldset": { borderColor: COLORS.border },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={8} md={3}>
                    <FormControl fullWidth>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{
                          minHeight: 52,
                          borderRadius: "16px",
                          background: COLORS.surfaceSoft,
                        }}
                      >
                        <MenuItem value="latest">Sort: Latest</MenuItem>
                        <MenuItem value="priceLowHigh">Price: Low to high</MenuItem>
                        <MenuItem value="priceHighLow">Price: High to low</MenuItem>
                        <MenuItem value="nameAZ">Name: A to Z</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} md={2}>
                    <Button
                      fullWidth
                      onClick={resetFilters}
                      startIcon={<RestartAltRoundedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        minHeight: 52,
                        borderRadius: "16px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.86rem",
                        color: COLORS.text,
                        background: COLORS.surfaceSoft,
                        border: `1px solid ${COLORS.border}`,
                        "&:hover": {
                          background: "#f1f5f9",
                        },
                      }}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<CategoryRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    label={
                      categoryFilter === "all"
                        ? "All categories"
                        : `Category: ${categoryFilter}`
                    }
                    sx={{
                      borderRadius: "999px",
                      fontWeight: 700,
                      background: COLORS.surfaceSoft,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                  <Chip
                    icon={<BusinessRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    label={
                      companyFilter === "all"
                        ? "All companies"
                        : `Company: ${companyFilter}`
                    }
                    sx={{
                      borderRadius: "999px",
                      fontWeight: 700,
                      background: COLORS.surfaceSoft,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                  <Chip
                    icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    label={
                      minPrice || maxPrice
                        ? `Price: ${minPrice || 0} - ${maxPrice || "Any"}`
                        : "Any price"
                    }
                    sx={{
                      borderRadius: "999px",
                      fontWeight: 700,
                      background: COLORS.surfaceSoft,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                  <Chip
                    icon={<ApartmentRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    label={typeFilter === "all" ? "Properties + vehicles" : typeFilter}
                    sx={{
                      borderRadius: "999px",
                      fontWeight: 700,
                      background: COLORS.surfaceSoft,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Grid */}
          {filteredItems.length > 0 ? (
            <Grid container spacing={2}>
              {filteredItems.map((item, index) => (
                <Grid item xs={12} sm={6} lg={4} key={item.id}>
                  <ListingCard item={item} navigate={navigate} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              sx={{
                ...cardSx,
                animation: "fadeUp .55s ease .12s both",
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "1.08rem",
                    fontWeight: 900,
                    color: COLORS.text,
                  }}
                >
                  No matching listings found
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    fontSize: "0.88rem",
                    color: COLORS.muted,
                    fontWeight: 600,
                  }}
                >
                  Try changing your filters or clearing the search.
                </Typography>
                <Button
                  onClick={resetFilters}
                  sx={{
                    mt: 2,
                    minHeight: 44,
                    px: 2,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 800,
                    color: "#fff",
                    background: COLORS.primary,
                    "&:hover": { background: "#0b5f59" },
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Box>
  );
}