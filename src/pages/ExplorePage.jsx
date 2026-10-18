import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VillaRoundedIcon from "@mui/icons-material/VillaRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

import { useSearchParams } from "react-router-dom";
import { propertyService, vehicleService } from "../services/api";
import { useAppState } from "../hooks/useAppState";
import { normalizeProperty, normalizeVehicle } from "../utils/mappers";
import PropertyCard from "../components/PropertyCard";
import VehicleCard from "../components/VehicleCard";
import { SearchTrieIndex } from "../utils/searchTrie";

const COLORS = {
  pageBg: "#f8fafc",
  surface: "#ffffff",
  surfaceSoft: "#f1f5f9",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.14)",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primarySoft: "rgba(15,118,110,0.08)",
  blue: "#2563eb",
  blueSoft: "rgba(37,99,235,0.08)",
  purple: "#7c3aed",
  purpleSoft: "rgba(124,58,237,0.08)",
  shadowSoft: "0 2px 12px rgba(15,23,42,0.04)",
  shadow: "0 12px 32px rgba(15,23,42,0.08)",
};

const POPULAR_CITIES = [
  "All",
  "Bengaluru",
  "Dharwad",
  "Hubballi",
  "Mysuru",
  "Belagavi",
  "Mangaluru",
  "Shivamogga",
  "Davangere",
  "Tumakuru",
  "Ballari",
  "Vijayapura",
  "Kalaburagi",
  "Udupi",
];

const PROPERTY_TYPES = [
  { value: "all", label: "All Property Types" },
  { value: "apartments", label: "Apartments & Flats" },
  { value: "houses", label: "Houses & Villas" },
  { value: "land", label: "Plots & Agricultural Land" },
  { value: "commercial", label: "Commercial Properties" },
];

const TRANSACTION_TYPES = [
  { value: "all", label: "All Transactions" },
  { value: "sale", label: "For Sale / Buy" },
  { value: "rent", label: "For Rent" },
  { value: "lease", label: "For Lease" },
];

const BHK_OPTIONS = [
  { value: "all", label: "Any BHK" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4+", label: "4+ BHK" },
];

const FURNISHING_OPTIONS = [
  { value: "all", label: "All Furnishings" },
  { value: "Furnished", label: "Furnished" },
  { value: "Semi-Furnished", label: "Semi-Furnished" },
  { value: "Unfurnished", label: "Unfurnished" },
];

const VEHICLE_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "cars", label: "Cars" },
  { value: "bikes", label: "Bikes & Motorcycles" },
  { value: "scooter", label: "Scooters" },
  { value: "trucks", label: "Commercial & Trucks" },
];

const FUEL_TYPES = [
  { value: "all", label: "All Fuel Types" },
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric / EV" },
  { value: "CNG", label: "CNG" },
];

const TRANSMISSION_OPTIONS = [
  { value: "all", label: "All Transmissions" },
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
];

const CONDITION_OPTIONS = [
  { value: "all", label: "Any Condition" },
  { value: "new", label: "New (1st Owner / Unused)" },
  { value: "used", label: "Used / Pre-Owned" },
];

const carouselSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Featured Properties",
    title: "Find modern homes, plots, and rentals across Karnataka",
    desc: "Browse verified property listings with complete specifications, verified amenities, and direct seller contact.",
    chip: "Property Picks",
    accent: COLORS.primary,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Top Vehicle Deals",
    title: "Explore verified cars, bikes, and commercial vehicles with ease",
    desc: "Compare specifications across categories, transmission, fuel types, and price ranges instantly.",
    chip: "Vehicle Picks",
    accent: COLORS.blue,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "EasyDeal Marketplace",
    title: "Search smarter across everything you need in one place",
    desc: "One unified Explore page for both properties and vehicles, designed for quick discovery and transparent deals.",
    chip: "All in One",
    accent: COLORS.peach,
  },
];

function ListingCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 2px 16px rgba(15,23,42,0.06)",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        width: "100%",
        minHeight: 480,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        animation="wave"
        sx={{ bgcolor: "rgba(226,232,240,0.6)" }}
      />
      <CardContent
        sx={{
          p: 2.2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="75%" height={26} animation="wave" />
          <Skeleton variant="text" width="45%" height={18} animation="wave" />
          <Skeleton variant="rounded" width="100%" height={68} sx={{ borderRadius: "12px" }} animation="wave" />
        </Stack>
        <Box sx={{ mt: "auto", pt: 1.5 }}>
          <Divider sx={{ borderColor: "rgba(15,23,42,0.08)", mb: 1.5 }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Skeleton variant="text" width={40} height={14} animation="wave" />
              <Skeleton variant="text" width={90} height={24} animation="wave" />
            </Box>
            <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: "10px" }} animation="wave" />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function extractList(resVal) {
  if (!resVal) return [];
  const payload = resVal?.data ?? resVal;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.properties)) return payload.properties;
  if (Array.isArray(payload?.vehicles)) return payload.vehicles;
  const nested = payload?.data;
  if (Array.isArray(nested?.items)) return nested.items;
  if (Array.isArray(nested?.results)) return nested.results;
  if (Array.isArray(nested?.data)) return nested.data;
  return [];
}

const ITEMS_PER_PAGE = 9;

export default function ExplorePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshListings } = useAppState();

  // Navigation & URL state
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "latest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Property-specific filters
  const [transactionType, setTransactionType] = useState(searchParams.get("transaction") || "all");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "all");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
  const [furnishing, setFurnishing] = useState(searchParams.get("furnishing") || "all");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");

  // Vehicle-specific filters
  const [vehicleCategory, setVehicleCategory] = useState(searchParams.get("vehicleCategory") || "all");
  const [brand, setBrand] = useState(searchParams.get("brand") || "all");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "all");
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "all");
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "all");
  const [minYear, setMinYear] = useState(searchParams.get("minYear") || "");
  const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") || "");
  const [minKm, setMinKm] = useState(searchParams.get("minKm") || "");
  const [maxKm, setMaxKm] = useState(searchParams.get("maxKm") || "");

  // UI state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCities, setAvailableCities] = useState(POPULAR_CITIES);
  const [slideIndex, setSlideIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state to URL searchParams
  const updateUrlParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Instant DSA Search Input Handler (0ms UI latency + debounced URL sync)
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      updateUrlParams({ search: val });
    }, 300);
  };

  // Sync state from URL params on load / back-forward
  useEffect(() => {
    setTypeFilter(searchParams.get("type") || "all");
    setSearch(searchParams.get("search") || "");
    setCityFilter(searchParams.get("city") || "all");
    setSortBy(searchParams.get("sortBy") || "latest");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setTransactionType(searchParams.get("transaction") || "all");
    setPropertyType(searchParams.get("propertyType") || "all");
    setBedrooms(searchParams.get("bedrooms") || "all");
    setFurnishing(searchParams.get("furnishing") || "all");
    setMinArea(searchParams.get("minArea") || "");
    setMaxArea(searchParams.get("maxArea") || "");
    setVehicleCategory(searchParams.get("vehicleCategory") || "all");
    setBrand(searchParams.get("brand") || "all");
    setModel(searchParams.get("model") || "");
    setCondition(searchParams.get("condition") || "all");
    setFuelType(searchParams.get("fuelType") || "all");
    setTransmission(searchParams.get("transmission") || "all");
    setMinYear(searchParams.get("minYear") || "");
    setMaxYear(searchParams.get("maxYear") || "");
    setMinKm(searchParams.get("minKm") || "");
    setMaxKm(searchParams.get("maxKm") || "");
  }, [searchParams]);

  // Hero carousel auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // ── Initial & Master Listings Data Fetching ─────────────────────────────────
  const fetchListings = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [pRes, vRes] = await Promise.allSettled([
        propertyService.getAll({ limit: 200 }),
        vehicleService.getAll({ limit: 200 }),
      ]);
      const pRaw = pRes.status === "fulfilled" ? extractList(pRes.value) : [];
      const vRaw = vRes.status === "fulfilled" ? extractList(vRes.value) : [];

      const normalizedP = pRaw.map(normalizeProperty);
      const normalizedV = vRaw.map(normalizeVehicle);

      setProperties(normalizedP);
      setVehicles(normalizedV);

      // Collect distinct brands and cities for filter dropdowns
      const brandsSet = new Set();
      normalizedV.forEach((v) => {
        if (v.brand) brandsSet.add(v.brand.trim());
      });
      if (brandsSet.size > 0) {
        setAvailableBrands(["all", ...Array.from(brandsSet).sort()]);
      }

      const citiesSet = new Set(POPULAR_CITIES);
      [...normalizedP, ...normalizedV].forEach((item) => {
        if (item.city) citiesSet.add(item.city.trim());
      });
      setAvailableCities(Array.from(citiesSet));
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(true);
    refreshListings?.();
  }, [fetchListings, refreshListings]);

  // ── DSA: Build Prefix Trie & Inverted Search Index ───────────────────────────
  const searchIndex = useMemo(() => {
    const index = new SearchTrieIndex();

    properties.forEach((p) => {
      index.insert(p.id, "property", p, {
        title: p.title || "",
        brandModel: [p.apartmentName, p.propertyType, p.property_type].filter(Boolean).join(" "),
        location: [p.city, p.location, p.localAddress, p.local_address, p.state].filter(Boolean).join(" "),
        specs: [
          p.bedrooms ? `${p.bedrooms} bhk` : "",
          p.bedrooms ? `${p.bedrooms} bedroom` : "",
          p.bathrooms ? `${p.bathrooms} bath` : "",
          p.furnishing,
          p.facing ? `${p.facing} facing` : "",
          p.rentLease,
          p.propertyType,
          p.area ? `${p.area} sqft` : "",
        ].filter(Boolean).join(" "),
        desc: p.description || "",
      });
    });

    vehicles.forEach((v) => {
      index.insert(v.id, "vehicle", v, {
        title: v.title || "",
        brandModel: [v.brand, v.model].filter(Boolean).join(" "),
        location: [v.city, v.location, v.localAddress, v.local_address, v.state].filter(Boolean).join(" "),
        specs: [
          v.category,
          v.fuelType,
          v.fuel_type,
          v.transmission,
          v.condition,
          v.year ? String(v.year) : "",
          v.kmDriven ? `${v.kmDriven} km` : "",
          v.rtoCode,
          v.ownership,
          v.color,
        ].filter(Boolean).join(" "),
        desc: v.description || "",
      });
    });

    return index;
  }, [properties, vehicles]);

  // ── DSA-Powered Instant Search & Facet Filter Engine ────────────────────────
  const allListings = useMemo(() => {
    // 1. Instant Trie Prefix Lookup & Set Intersection: O(P + min(|S|))
    const trimmedQuery = search.trim();
    const searchScoreMap = trimmedQuery ? searchIndex.search(trimmedQuery) : null;

    // Fast-path: if query has 0 matches in Trie, exit immediately
    if (searchScoreMap && searchScoreMap.size === 0) {
      return [];
    }

    // 2. Filter Properties
    const pItems = [];
    if (typeFilter === "all" || typeFilter === "property") {
      for (let i = 0; i < properties.length; i++) {
        const p = properties[i];
        const id = p.id;

        // Trie match check
        if (searchScoreMap && !searchScoreMap.has(id)) continue;

        // City filter
        if (cityFilter !== "all") {
          const itemCity = (p.city || "").toLowerCase();
          const itemLoc = (p.location || "").toLowerCase();
          const target = cityFilter.toLowerCase();
          if (!itemCity.includes(target) && !itemLoc.includes(target)) continue;
        }

        // Price bounds
        const price = Number(p.price ?? p.expectedPrice ?? p.expected_price ?? 0);
        if (minPrice && price < Number(minPrice)) continue;
        if (maxPrice && price > Number(maxPrice)) continue;

        // Property-specific filters
        if (transactionType !== "all") {
          const trans = (p.rentLease || p.rent_lease || "").toLowerCase();
          if (!trans.includes(transactionType.toLowerCase())) continue;
        }

        if (propertyType !== "all") {
          const pType = (p.propertyType || p.property_type || "").toLowerCase();
          if (!pType.includes(propertyType.toLowerCase())) continue;
        }

        if (bedrooms !== "all") {
          const bedCount = Number(p.bedrooms ?? p.rooms ?? 0);
          if (bedrooms === "4+") {
            if (bedCount < 4) continue;
          } else if (bedCount !== Number(bedrooms)) {
            continue;
          }
        }

        if (furnishing !== "all") {
          const furn = (p.furnishing || "").toLowerCase();
          if (!furn.includes(furnishing.toLowerCase())) continue;
        }

        if (minArea || maxArea) {
          const areaNum = Number(String(p.area || "").replace(/[^\d.]/g, "")) || 0;
          if (minArea && areaNum < Number(minArea)) continue;
          if (maxArea && areaNum > Number(maxArea)) continue;
        }

        pItems.push({
          id: p.id,
          itemType: "property",
          raw: p,
          createdAt: p.createdAt || p.created_at || 0,
          price,
          title: p.title || "",
          searchScore: searchScoreMap ? searchScoreMap.get(id) || 0 : 0,
        });
      }
    }

    // 3. Filter Vehicles
    const vItems = [];
    if (typeFilter === "all" || typeFilter === "vehicle") {
      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        const id = v.id;

        // Trie match check
        if (searchScoreMap && !searchScoreMap.has(id)) continue;

        // City filter
        if (cityFilter !== "all") {
          const itemCity = (v.city || "").toLowerCase();
          const itemLoc = (v.location || "").toLowerCase();
          const target = cityFilter.toLowerCase();
          if (!itemCity.includes(target) && !itemLoc.includes(target)) continue;
        }

        // Price bounds
        const price = Number(v.price ?? v.expectedPrice ?? v.expected_price ?? 0);
        if (minPrice && price < Number(minPrice)) continue;
        if (maxPrice && price > Number(maxPrice)) continue;

        // Vehicle-specific filters
        if (vehicleCategory !== "all") {
          const cat = (v.category || v.vehicleType || v.vehicle_type || "").toLowerCase();
          if (!cat.includes(vehicleCategory.toLowerCase())) continue;
        }

        if (brand !== "all") {
          const vBrand = (v.brand || "").toLowerCase();
          if (!vBrand.includes(brand.toLowerCase())) continue;
        }

        if (model) {
          const vModel = (v.model || "").toLowerCase();
          if (!vModel.includes(model.toLowerCase())) continue;
        }

        if (condition !== "all") {
          const cond = (v.condition || v.ownership || "").toLowerCase();
          if (!cond.includes(condition.toLowerCase())) continue;
        }

        if (fuelType !== "all") {
          const fType = (v.fuelType || v.fuel_type || "").toLowerCase();
          if (!fType.includes(fuelType.toLowerCase())) continue;
        }

        if (transmission !== "all") {
          const trans = (v.transmission || "").toLowerCase();
          if (!trans.includes(transmission.toLowerCase())) continue;
        }

        if (minYear || maxYear) {
          const yearNum = Number(v.year) || 0;
          if (minYear && yearNum < Number(minYear)) continue;
          if (maxYear && yearNum > Number(maxYear)) continue;
        }

        if (minKm || maxKm) {
          const kmNum = Number(String(v.kmDriven || v.km_driven || "").replace(/[^\d.]/g, "")) || 0;
          if (minKm && kmNum < Number(minKm)) continue;
          if (maxKm && kmNum > Number(maxKm)) continue;
        }

        vItems.push({
          id: v.id,
          itemType: "vehicle",
          raw: v,
          createdAt: v.createdAt || v.created_at || 0,
          price,
          title: v.title || "",
          searchScore: searchScoreMap ? searchScoreMap.get(id) || 0 : 0,
        });
      }
    }

    const items = [...pItems, ...vItems];

    // 4. Multi-level Ranking & Sorting (Relevance Score > Price/Date)
    if (searchScoreMap) {
      items.sort((a, b) => {
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore; // Higher relevance first
        }
        if (sortBy === "price_asc" || sortBy === "priceLowHigh") return a.price - b.price;
        if (sortBy === "price_desc" || sortBy === "priceHighLow") return b.price - a.price;
        if (sortBy === "nameAZ") return a.title.localeCompare(b.title);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      if (sortBy === "price_asc" || sortBy === "priceLowHigh") {
        items.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price_desc" || sortBy === "priceHighLow") {
        items.sort((a, b) => b.price - a.price);
      } else if (sortBy === "nameAZ") {
        items.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    return items;
  }, [
    properties,
    vehicles,
    searchIndex,
    search,
    typeFilter,
    cityFilter,
    minPrice,
    maxPrice,
    sortBy,
    transactionType,
    propertyType,
    bedrooms,
    furnishing,
    minArea,
    maxArea,
    vehicleCategory,
    brand,
    model,
    condition,
    fuelType,
    transmission,
    minYear,
    maxYear,
    minKm,
    maxKm,
  ]);

  // Paginated listings
  const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allListings.slice(start, start + ITEMS_PER_PAGE);
  }, [allListings, currentPage]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (cityFilter !== "all") count++;
    if (minPrice || maxPrice) count++;
    if (typeFilter === "property" || typeFilter === "all") {
      if (transactionType !== "all") count++;
      if (propertyType !== "all") count++;
      if (bedrooms !== "all") count++;
      if (furnishing !== "all") count++;
      if (minArea || maxArea) count++;
    }
    if (typeFilter === "vehicle" || typeFilter === "all") {
      if (vehicleCategory !== "all") count++;
      if (brand !== "all") count++;
      if (model) count++;
      if (condition !== "all") count++;
      if (fuelType !== "all") count++;
      if (transmission !== "all") count++;
      if (minYear || maxYear) count++;
      if (minKm || maxKm) count++;
    }
    return count;
  }, [
    search,
    cityFilter,
    minPrice,
    maxPrice,
    typeFilter,
    transactionType,
    propertyType,
    bedrooms,
    furnishing,
    minArea,
    maxArea,
    vehicleCategory,
    brand,
    model,
    condition,
    fuelType,
    transmission,
    minYear,
    maxYear,
    minKm,
    maxKm,
  ]);

  // Handle Type Switch
  const handleTypeChange = (newType) => {
    setTypeFilter(newType);
    setCurrentPage(1);
    updateUrlParams({ type: newType });
  };

  // Clear all filters
  const resetAllFilters = () => {
    setSearch("");
    setCityFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
    setTransactionType("all");
    setPropertyType("all");
    setBedrooms("all");
    setFurnishing("all");
    setMinArea("");
    setMaxArea("");
    setVehicleCategory("all");
    setBrand("all");
    setModel("");
    setCondition("all");
    setFuelType("all");
    setTransmission("all");
    setMinYear("");
    setMaxYear("");
    setMinKm("");
    setMaxKm("");
    setCurrentPage(1);
    setSearchParams(typeFilter !== "all" ? { type: typeFilter } : {}, { replace: true });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const activeSlide = carouselSlides[slideIndex];

  // ── Render Filter Sidebar Content (shared between Desktop & Mobile Drawer) ──
  const renderFilterControls = () => (
    <Stack spacing={2.4}>
      {/* City / Location */}
      <Box>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
          City / Location
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setCurrentPage(1);
              updateUrlParams({ city: e.target.value });
            }}
            startAdornment={
              <InputAdornment position="start">
                <PlaceRoundedIcon sx={{ fontSize: 18, color: COLORS.faint }} />
              </InputAdornment>
            }
            sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
          >
            {availableCities.map((c) => (
              <MenuItem key={c} value={c === "All" ? "all" : c}>
                {c === "All" ? "All Karnataka Cities" : c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Price Range */}
      <Box>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
          Price Range (₹)
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Min ₹"
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setCurrentPage(1);
              updateUrlParams({ minPrice: e.target.value });
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
          />
          <TextField
            size="small"
            placeholder="Max ₹"
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setCurrentPage(1);
              updateUrlParams({ maxPrice: e.target.value });
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
          />
        </Stack>
      </Box>

      {/* ── PROPERTY-SPECIFIC FILTERS ── */}
      {(typeFilter === "property" || typeFilter === "all") && (
        <>
          <Divider sx={{ borderColor: COLORS.border }} />
          <Typography
            sx={{
              fontSize: "0.74rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: COLORS.primary,
            }}
          >
            Property Specifications
          </Typography>

          {/* Transaction Type */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Transaction Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ transaction: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {TRANSACTION_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Property Type */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Property Category
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ propertyType: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {PROPERTY_TYPES.map((pt) => (
                  <MenuItem key={pt.value} value={pt.value}>
                    {pt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Bedrooms / BHK */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Bedrooms (BHK)
            </Typography>
            <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
              {BHK_OPTIONS.map((bhk) => (
                <Chip
                  key={bhk.value}
                  label={bhk.label}
                  size="small"
                  clickable
                  onClick={() => {
                    setBedrooms(bhk.value);
                    setCurrentPage(1);
                    updateUrlParams({ bedrooms: bhk.value });
                  }}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    bgcolor: bedrooms === bhk.value ? COLORS.primary : COLORS.surfaceSoft,
                    color: bedrooms === bhk.value ? "#fff" : COLORS.text,
                    border: `1px solid ${bedrooms === bhk.value ? COLORS.primary : COLORS.border}`,
                    "&:hover": {
                      bgcolor: bedrooms === bhk.value ? "#0b5d56" : "#e2e8f0",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Furnishing */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Furnishing
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={furnishing}
                onChange={(e) => {
                  setFurnishing(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ furnishing: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {FURNISHING_OPTIONS.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Builtup / Land Area */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Area Range (Sq Ft)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Min sqft"
                type="number"
                value={minArea}
                onChange={(e) => {
                  setMinArea(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ minArea: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
              <TextField
                size="small"
                placeholder="Max sqft"
                type="number"
                value={maxArea}
                onChange={(e) => {
                  setMaxArea(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ maxArea: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
            </Stack>
          </Box>
        </>
      )}

      {/* ── VEHICLE-SPECIFIC FILTERS ── */}
      {(typeFilter === "vehicle" || typeFilter === "all") && (
        <>
          <Divider sx={{ borderColor: COLORS.border }} />
          <Typography
            sx={{
              fontSize: "0.74rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: COLORS.purple,
            }}
          >
            Vehicle Specifications
          </Typography>

          {/* Vehicle Category */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Vehicle Category
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={vehicleCategory}
                onChange={(e) => {
                  setVehicleCategory(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ vehicleCategory: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {VEHICLE_CATEGORIES.map((vc) => (
                  <MenuItem key={vc.value} value={vc.value}>
                    {vc.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Make / Brand */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Brand / Make
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ brand: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                <MenuItem value="all">All Brands</MenuItem>
                {availableBrands.filter((b) => b !== "all").map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Model Search */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Vehicle Model
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Creta, Swift, Classic 350"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setCurrentPage(1);
                updateUrlParams({ model: e.target.value });
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
            />
          </Box>

          {/* Fuel Type */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Fuel Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ fuelType: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {FUEL_TYPES.map((ft) => (
                  <MenuItem key={ft.value} value={ft.value}>
                    {ft.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Transmission */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Transmission
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={transmission}
                onChange={(e) => {
                  setTransmission(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ transmission: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {TRANSMISSION_OPTIONS.map((tr) => (
                  <MenuItem key={tr.value} value={tr.value}>
                    {tr.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Condition */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Condition
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ condition: e.target.value });
                }}
                sx={{ borderRadius: "12px", bgcolor: COLORS.surfaceSoft }}
              >
                {CONDITION_OPTIONS.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Manufacturing Year Range */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Manufacturing Year
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Min year"
                type="number"
                value={minYear}
                onChange={(e) => {
                  setMinYear(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ minYear: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
              <TextField
                size="small"
                placeholder="Max year"
                type="number"
                value={maxYear}
                onChange={(e) => {
                  setMaxYear(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ maxYear: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
            </Stack>
          </Box>

          {/* Kilometres Driven Range */}
          <Box>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: COLORS.text, mb: 0.8 }}>
              Kilometres Driven
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Min km"
                type="number"
                value={minKm}
                onChange={(e) => {
                  setMinKm(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ minKm: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
              <TextField
                size="small"
                placeholder="Max km"
                type="number"
                value={maxKm}
                onChange={(e) => {
                  setMaxKm(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ maxKm: e.target.value });
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: COLORS.surfaceSoft } }}
              />
            </Stack>
          </Box>
        </>
      )}

      {/* Clear All Button */}
      <Button
        fullWidth
        onClick={resetAllFilters}
        startIcon={<RestartAltRoundedIcon />}
        sx={{
          borderRadius: "12px",
          minHeight: 40,
          textTransform: "none",
          fontWeight: 800,
          fontSize: "0.84rem",
          color: COLORS.muted,
          bgcolor: COLORS.surfaceSoft,
          border: `1px solid ${COLORS.border}`,
          "&:hover": { bgcolor: "#e2e8f0", color: COLORS.text },
        }}
      >
        Clear All Filters
      </Button>
    </Stack>
  );

  return (
    <>
      <Helmet>
        <title>Explore Verified Properties & Vehicles | EasyDeal</title>
        <meta
          name="description"
          content="Search and filter verified property and vehicle listings across Karnataka with custom price, category, BHK, year, and location filters."
        />
        <link rel="canonical" href="https://easydealworld.com/explore" />
      </Helmet>

      <Box sx={{ minHeight: "100vh", bgcolor: COLORS.pageBg, pb: 8 }}>
        {/* ── Top Hero Carousel Banner ── */}
        <Box sx={{ maxWidth: 1380, mx: "auto", p: { xs: 2, md: 3 } }}>
          <Card
            sx={{
              borderRadius: "24px",
              boxShadow: COLORS.shadowSoft,
              border: `1px solid ${COLORS.border}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box sx={{ position: "relative", height: { xs: 320, sm: 350, md: 380 }, overflow: "hidden" }}>
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
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(15,23,42,0.90) 0%, rgba(15,23,42,0.65) 45%, rgba(15,23,42,0.25) 100%)",
                    }}
                  />
                </Box>
              ))}

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  p: { xs: 2.5, sm: 4, md: 5 },
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Chip
                      label={activeSlide.chip}
                      sx={{
                        height: 28,
                        borderRadius: "999px",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        color: "#fff",
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.22)",
                      }}
                    />
                    <Typography
                      sx={{
                        mt: 1.2,
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.76)",
                      }}
                    >
                      {activeSlide.eyebrow}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: { xs: "1.3rem", sm: "1.85rem", md: "2.35rem" },
                        lineHeight: 1.15,
                        fontWeight: 900,
                        letterSpacing: "-0.03em",
                        color: "#fff",
                        maxWidth: 680,
                      }}
                    >
                      {activeSlide.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.8,
                        fontSize: { xs: "0.82rem", sm: "0.92rem" },
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.85)",
                        maxWidth: 560,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {activeSlide.desc}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: { xs: 1.8, sm: 2.4 }, flexWrap: "wrap", gap: 0.8 }}
                    >
                      <Button
                        onClick={() => handleTypeChange("property")}
                        startIcon={<VillaRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          minHeight: 40,
                          px: 2.2,
                          borderRadius: "14px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          color: COLORS.text,
                          background: "#fff",
                          "&:hover": { background: "#f8fafc" },
                        }}
                      >
                        Explore Properties
                      </Button>
                      <Button
                        onClick={() => handleTypeChange("vehicle")}
                        startIcon={<DirectionsBikeRoundedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          minHeight: 40,
                          px: 2.2,
                          borderRadius: "14px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          color: "#fff",
                          background: "rgba(255,255,255,0.18)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          backdropFilter: "blur(8px)",
                          "&:hover": { background: "rgba(255,255,255,0.28)" },
                        }}
                      >
                        Explore Vehicles
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        onClick={() =>
                          setSlideIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))
                        }
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          background: "rgba(255,255,255,0.18)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.22)",
                          backdropFilter: "blur(8px)",
                          "&:hover": { background: "rgba(255,255,255,0.30)" },
                        }}
                      >
                        <ChevronLeftRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSlideIndex((prev) => (prev + 1) % carouselSlides.length)
                        }
                        size="small"
                        sx={{
                          width: 38,
                          height: 38,
                          background: "rgba(255,255,255,0.18)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.22)",
                          backdropFilter: "blur(8px)",
                          "&:hover": { background: "rgba(255,255,255,0.30)" },
                        }}
                      >
                        <ChevronRightRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* ── Main Explore Interface (Search + Sidebar + Results) ── */}
        <Box sx={{ maxWidth: 1380, mx: "auto", px: { xs: 2, md: 3 } }}>
          {/* Top Bar: Keyword Search, Category Switcher, Sort, and Mobile Filter Toggle */}
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: COLORS.shadowSoft,
              border: `1px solid ${COLORS.border}`,
              p: { xs: 2, sm: 2.5 },
              mb: 3,
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                alignItems={{ xs: "stretch", lg: "center" }}
                justifyContent="space-between"
                spacing={1.8}
              >
                {/* Search input */}
                <TextField
                  fullWidth
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search listings by title, location, model, or keywords..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: COLORS.faint }} />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => handleSearchChange("")}>
                          <CloseRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    flex: { lg: 1 },
                    "& .MuiOutlinedInput-root": {
                      minHeight: 46,
                      borderRadius: "14px",
                      bgcolor: COLORS.surfaceSoft,
                      "& fieldset": { borderColor: COLORS.border },
                    },
                  }}
                />

                {/* Category Switcher Pills */}
                <Stack
                  direction="row"
                  spacing={0.8}
                  sx={{
                    p: 0.5,
                    borderRadius: "16px",
                    bgcolor: COLORS.surfaceSoft,
                    border: `1px solid ${COLORS.border}`,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => handleTypeChange("all")}
                    startIcon={<AppsRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "12px",
                      px: 2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      flex: { xs: 1, sm: "initial" },
                      bgcolor: typeFilter === "all" ? COLORS.surface : "transparent",
                      color: typeFilter === "all" ? COLORS.text : COLORS.muted,
                      boxShadow: typeFilter === "all" ? "0 2px 8px rgba(15,23,42,0.06)" : "none",
                      "&:hover": { bgcolor: COLORS.surface },
                    }}
                  >
                    All
                  </Button>

                  <Button
                    size="small"
                    onClick={() => handleTypeChange("property")}
                    startIcon={<HomeWorkRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "12px",
                      px: 2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      flex: { xs: 1, sm: "initial" },
                      bgcolor: typeFilter === "property" ? COLORS.primary : "transparent",
                      color: typeFilter === "property" ? "#fff" : COLORS.muted,
                      boxShadow: typeFilter === "property" ? "0 2px 8px rgba(15,118,110,0.25)" : "none",
                      "&:hover": {
                        bgcolor: typeFilter === "property" ? "#0b5d56" : COLORS.surface,
                      },
                    }}
                  >
                    Properties
                  </Button>

                  <Button
                    size="small"
                    onClick={() => handleTypeChange("vehicle")}
                    startIcon={<DirectionsCarRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "12px",
                      px: 2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      flex: { xs: 1, sm: "initial" },
                      bgcolor: typeFilter === "vehicle" ? COLORS.purple : "transparent",
                      color: typeFilter === "vehicle" ? "#fff" : COLORS.muted,
                      boxShadow: typeFilter === "vehicle" ? "0 2px 8px rgba(124,58,237,0.25)" : "none",
                      "&:hover": {
                        bgcolor: typeFilter === "vehicle" ? "#6d28d9" : COLORS.surface,
                      },
                    }}
                  >
                    Vehicles
                  </Button>
                </Stack>

                {/* Mobile Filter Toggle & Sort selector */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: "100%", sm: "auto" } }}>
                  {isMobile && (
                    <Badge badgeContent={activeFiltersCount} color="primary" sx={{ flex: 1 }}>
                      <Button
                        fullWidth
                        onClick={() => setMobileDrawerOpen(true)}
                        startIcon={<FilterListRoundedIcon />}
                        sx={{
                          borderRadius: "14px",
                          minHeight: 46,
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.84rem",
                          color: COLORS.text,
                          bgcolor: COLORS.surfaceSoft,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        Filters
                      </Button>
                    </Badge>
                  )}

                  <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 }, flex: { xs: 1, sm: "initial" } }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        updateUrlParams({ sortBy: e.target.value });
                      }}
                      sx={{ borderRadius: "14px", minHeight: 46, bgcolor: COLORS.surfaceSoft }}
                    >
                      <MenuItem value="latest">Sort: Newest First</MenuItem>
                      <MenuItem value="price_asc">Price: Low to High</MenuItem>
                      <MenuItem value="price_desc">Price: High to Low</MenuItem>
                      <MenuItem value="nameAZ">Name: A to Z</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              {/* Active Filter Chips Bar */}
              {activeFiltersCount > 0 && (
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap alignItems="center">
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: COLORS.muted, mr: 0.5 }}>
                    Active Filters:
                  </Typography>

                  {search && (
                    <Chip
                      size="small"
                      label={`Search: "${search}"`}
                      onDelete={() => handleSearchChange("")}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {cityFilter !== "all" && (
                    <Chip
                      size="small"
                      label={`City: ${cityFilter}`}
                      onDelete={() => {
                        setCityFilter("all");
                        updateUrlParams({ city: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {(minPrice || maxPrice) && (
                    <Chip
                      size="small"
                      label={`Price: ₹${minPrice || 0} - ₹${maxPrice || "Any"}`}
                      onDelete={() => {
                        setMinPrice("");
                        setMaxPrice("");
                        updateUrlParams({ minPrice: "", maxPrice: "" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {transactionType !== "all" && (
                    <Chip
                      size="small"
                      label={`Transaction: ${transactionType}`}
                      onDelete={() => {
                        setTransactionType("all");
                        updateUrlParams({ transaction: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {propertyType !== "all" && (
                    <Chip
                      size="small"
                      label={`Property: ${propertyType}`}
                      onDelete={() => {
                        setPropertyType("all");
                        updateUrlParams({ propertyType: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {bedrooms !== "all" && (
                    <Chip
                      size="small"
                      label={`BHK: ${bedrooms}`}
                      onDelete={() => {
                        setBedrooms("all");
                        updateUrlParams({ bedrooms: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {furnishing !== "all" && (
                    <Chip
                      size="small"
                      label={`Furnishing: ${furnishing}`}
                      onDelete={() => {
                        setFurnishing("all");
                        updateUrlParams({ furnishing: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {vehicleCategory !== "all" && (
                    <Chip
                      size="small"
                      label={`Category: ${vehicleCategory}`}
                      onDelete={() => {
                        setVehicleCategory("all");
                        updateUrlParams({ vehicleCategory: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {brand !== "all" && (
                    <Chip
                      size="small"
                      label={`Brand: ${brand}`}
                      onDelete={() => {
                        setBrand("all");
                        updateUrlParams({ brand: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {fuelType !== "all" && (
                    <Chip
                      size="small"
                      label={`Fuel: ${fuelType}`}
                      onDelete={() => {
                        setFuelType("all");
                        updateUrlParams({ fuelType: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  {transmission !== "all" && (
                    <Chip
                      size="small"
                      label={`Transmission: ${transmission}`}
                      onDelete={() => {
                        setTransmission("all");
                        updateUrlParams({ transmission: "all" });
                      }}
                      sx={{ borderRadius: "8px", fontWeight: 700, fontSize: "0.74rem" }}
                    />
                  )}

                  <Button
                    size="small"
                    onClick={resetAllFilters}
                    sx={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: COLORS.primary,
                      textTransform: "none",
                      p: 0,
                      minWidth: "auto",
                      ml: 0.5,
                    }}
                  >
                    Clear All
                  </Button>
                </Stack>
              )}
            </Stack>
          </Card>

          {/* ── Main Content Grid: Sidebar (Desktop) + Results Grid ── */}
          <Grid container spacing={3} alignItems="flex-start">
            {/* Desktop Filter Sidebar */}
            {!isMobile && (
              <Grid size={{ xs: 12, md: 3.8, lg: 3 }}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    boxShadow: COLORS.shadowSoft,
                    border: `1px solid ${COLORS.border}`,
                    p: 2.5,
                    position: "sticky",
                    top: 24,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TuneRoundedIcon sx={{ fontSize: 20, color: COLORS.primary }} />
                      <Typography sx={{ fontSize: "1rem", fontWeight: 900, color: COLORS.text }}>
                        Refine Search
                      </Typography>
                    </Stack>
                    {activeFiltersCount > 0 && (
                      <Chip
                        label={`${activeFiltersCount} active`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          bgcolor: COLORS.primarySoft,
                          color: COLORS.primary,
                        }}
                      />
                    )}
                  </Stack>
                  <Divider sx={{ mb: 2, borderColor: COLORS.border }} />
                  {renderFilterControls()}
                </Card>
              </Grid>
            )}

            {/* Listings Grid */}
            <Grid size={{ xs: 12, md: 8.2, lg: 9 }}>
              {/* Results Heading */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: COLORS.muted }}>
                  Showing{" "}
                  <Typography component="span" sx={{ color: COLORS.text, fontWeight: 900 }}>
                    {allListings.length}
                  </Typography>{" "}
                  verified {typeFilter === "property" ? "properties" : typeFilter === "vehicle" ? "vehicles" : "listings"}
                </Typography>
              </Stack>

              {/* Grid content */}
              {loading ? (
                <Grid container spacing={2.5}>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`skel-${idx}`}>
                      <ListingCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : paginatedListings.length > 0 ? (
                <>
                  <Grid container spacing={2.5} alignItems="stretch">
                    {paginatedListings.map((item) => (
                      <Grid
                        size={{ xs: 12, sm: 6, lg: 4 }}
                        key={`${item.itemType}-${item.id}`}
                        sx={{ display: "flex" }}
                      >
                        {item.itemType === "property" ? (
                          <PropertyCard item={item.raw} />
                        ) : (
                          <VehicleCard item={item.raw} />
                        )}
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 380, left: 0, behavior: "smooth" });
                        }}
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            fontWeight: 800,
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Card
                  sx={{
                    borderRadius: "20px",
                    boxShadow: COLORS.shadowSoft,
                    border: `1px solid ${COLORS.border}`,
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "20px",
                      background: COLORS.surfaceSoft,
                      border: `1px solid ${COLORS.border}`,
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                      mb: 2,
                      color: COLORS.muted,
                    }}
                  >
                    <SearchRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: 900, color: COLORS.text }}>
                    No matching listings found
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: "0.92rem", color: COLORS.muted, maxWidth: 480, mx: "auto" }}>
                    We couldn't find any listings matching your selected filters. Try broadening your search or resetting filters to see more results.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={resetAllFilters}
                    startIcon={<RestartAltRoundedIcon />}
                    sx={{
                      mt: 3,
                      borderRadius: "14px",
                      px: 3,
                      py: 1.2,
                      textTransform: "none",
                      fontWeight: 800,
                      bgcolor: COLORS.primary,
                      "&:hover": { bgcolor: "#0b5d56" },
                    }}
                  >
                    Reset All Filters
                  </Button>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ── Mobile Filter Drawer ── */}
      <Drawer
        anchor="bottom"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            maxHeight: "85vh",
            p: 3,
            bgcolor: COLORS.surface,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TuneRoundedIcon sx={{ fontSize: 22, color: COLORS.primary }} />
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: COLORS.text }}>
              Filter Listings
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2.5, borderColor: COLORS.border }} />

        <Box sx={{ overflowY: "auto", pr: 0.5, pb: 4 }}>
          {renderFilterControls()}
        </Box>

        <Box sx={{ pt: 2, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              resetAllFilters();
              setMobileDrawerOpen(false);
            }}
            sx={{
              borderRadius: "14px",
              minHeight: 46,
              textTransform: "none",
              fontWeight: 800,
              borderColor: COLORS.border,
              color: COLORS.text,
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMobileDrawerOpen(false)}
            sx={{
              borderRadius: "14px",
              minHeight: 46,
              textTransform: "none",
              fontWeight: 800,
              bgcolor: COLORS.primary,
              "&:hover": { bgcolor: "#0b5d56" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
