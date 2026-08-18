
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import adminOrdersService from "../../services/adminOrdersApi";

const UI = {
  bg: "#f5f7fb",
  shell: "#fcfdff",
  surface: "#ffffff",
  surfaceSoft: "#f8fafc",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.14)",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  primary: "#0f766e",
  primarySoft: "rgba(15,118,110,0.10)",
  blue: "#2563eb",
  blueSoft: "rgba(37,99,235,0.10)",
  purple: "#7c3aed",
  purpleSoft: "rgba(124,58,237,0.10)",
  shadowSm: "0 2px 10px rgba(15,23,42,0.04)",
  shadowMd: "0 10px 32px rgba(15,23,42,0.06)",
};

const cardSx = {
  borderRadius: "22px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "U";
}

function getTypeConfig(type) {
  const isVehicle = String(type).toLowerCase() === "vehicle";

  return isVehicle
    ? {
        label: "Vehicle",
        icon: <DirectionsCarRoundedIcon sx={{ fontSize: 21 }} />,
        color: UI.blue,
        bg: UI.blueSoft,
      }
    : {
        label: "Property",
        icon: <HomeWorkRoundedIcon sx={{ fontSize: 21 }} />,
        color: UI.primary,
        bg: UI.primarySoft,
      };
}

function StatCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <Card sx={{ ...cardSx, height: "100%" }}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "14px",
              background: bg,
              color,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
          <Typography sx={{ fontSize: "1.7rem", lineHeight: 1, fontWeight: 900, color: UI.text }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: UI.text }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "0.76rem", color: UI.muted, lineHeight: 1.55 }}>
            {subtitle}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon, label, value, noWrap = false }) {
  return (
    <Stack direction="row" spacing={0.8} alignItems="flex-start" sx={{ minWidth: 0 }}>
      {icon && <Box sx={{ color: UI.faint, display: "flex", mt: "2px", flexShrink: 0 }}>{icon}</Box>}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.68rem", color: UI.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </Typography>
        <Typography
          noWrap={noWrap}
          sx={{
            mt: 0.15,
            color: UI.text,
            fontSize: "0.83rem",
            fontWeight: 750,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value || "-"}
        </Typography>
      </Box>
    </Stack>
  );
}

function ListingCard({ item }) {
  const type = getTypeConfig(item.type);

  return (
    <Card
      sx={{
        ...cardSx,
        height: "100%",
        overflow: "hidden",
        transition: "all .18s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: UI.borderStrong,
          boxShadow: UI.shadowMd,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          minHeight: 116,
          background: `linear-gradient(135deg, ${type.bg} 0%, ${UI.surface} 80%)`,
          borderBottom: `1px solid ${UI.border}`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.2}>
          <Box sx={{ minWidth: 0 }}>
            <Chip
              size="small"
              icon={type.icon}
              label={type.label}
              sx={{
                height: 28,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.72rem",
                color: type.color,
                background: UI.surface,
                border: `1px solid ${type.bg}`,
              }}
            />
            <Typography sx={{ mt: 1.25, color: UI.text, fontWeight: 900, fontSize: "1.02rem" }} noWrap>
              {item.title || "Untitled listing"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "15px",
              background: UI.surface,
              color: type.color,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              border: `1px solid ${UI.border}`,
            }}
          >
            {type.icon}
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.45}>
          <Stack direction="row" alignItems="center" spacing={0.65}>
            <LocationOnRoundedIcon sx={{ fontSize: 17, color: UI.faint }} />
            <Typography sx={{ color: UI.muted, fontSize: "0.84rem", fontWeight: 650 }} noWrap>
              {item.location || "Location not provided"}
            </Typography>
          </Stack>

          <Box sx={{ p: 1.25, borderRadius: "15px", background: UI.surfaceSoft, border: `1px solid ${UI.border}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={0.65} alignItems="center">
                <CurrencyRupeeRoundedIcon sx={{ color: type.color, fontSize: 19 }} />
                <Typography sx={{ color: UI.muted, fontSize: "0.75rem", fontWeight: 750 }}>
                  Listed price
                </Typography>
              </Stack>
              <Typography sx={{ color: UI.text, fontSize: "1.03rem", fontWeight: 900 }}>
                {formatMoney(item.price)}
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: UI.border }} />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.15 }}>
            <DetailItem icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} label="Owner" value={item.owner_name} />
            <DetailItem icon={<EmailRoundedIcon sx={{ fontSize: 16 }} />} label="Email" value={item.owner_email} noWrap />
          </Box>

          <DetailItem icon={<CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />} label="Created" value={formatDate(item.created_at)} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadListings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminOrdersService.getProperty_Vehicles_Details();
      const data = response?.data ?? response;
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setListings([]);
      setError(err?.response?.data?.detail || err?.response?.detail || err?.message || "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const counts = useMemo(() => {
    const properties = listings.filter((item) => String(item.type).toLowerCase() === "property").length;
    const vehicles = listings.filter((item) => String(item.type).toLowerCase() === "vehicle").length;
    const totalValue = listings.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    return { all: listings.length, properties, vehicles, totalValue };
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((item) => {
      const matchesType = filter === "ALL" || String(item.type).toUpperCase() === filter;
      if (!matchesType) return false;
      if (!query) return true;

      return [item.title, item.type, item.location, item.owner_name, item.owner_email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [filter, listings, search]);

  const filters = [
    { key: "ALL", label: "All", count: counts.all },
    { key: "PROPERTY", label: "Properties", count: counts.properties },
    { key: "VEHICLE", label: "Vehicles", count: counts.vehicles },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: UI.bg, p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box
        sx={{
          maxWidth: 1500,
          mx: "auto",
          p: { xs: 1.5, sm: 2, md: 2.5 },
          borderRadius: { xs: "24px", md: "30px" },
          background: UI.shell,
          border: `1px solid ${UI.border}`,
          boxShadow: UI.shadowMd,
        }}
      >
        <Stack spacing={2.2}>
          <Card sx={{ ...cardSx, boxShadow: "none" }}>
            <CardContent sx={{ p: { xs: 1.6, sm: 2.2 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" alignItems={{ lg: "center" }} spacing={1.6}>
                  <Box>
                    <Typography sx={{ fontSize: { xs: "1.45rem", sm: "1.85rem" }, fontWeight: 900, color: UI.text, letterSpacing: "-0.03em" }}>
                      Property & Vehicle Listings
                    </Typography>
                    <Typography sx={{ mt: 0.65, color: UI.muted, fontSize: "0.9rem", lineHeight: 1.6 }}>
                      Browse all listings with owner, location, price, type, and creation details.
                    </Typography>
                  </Box>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.1} sx={{ width: { xs: "100%", lg: "auto" } }}>
                    <TextField
                      fullWidth
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search title, type, owner, location"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        minWidth: { lg: 360 },
                        "& .MuiOutlinedInput-root": { borderRadius: "14px", background: UI.surfaceSoft },
                      }}
                    />
                    <Tooltip title="Refresh listings">
                      <IconButton
                        onClick={loadListings}
                        disabled={loading}
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "14px",
                          border: `1px solid ${UI.border}`,
                          background: UI.surfaceSoft,
                        }}
                      >
                        <RefreshRoundedIcon sx={{ fontSize: 18, color: UI.text }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {filters.map((item) => {
                    const selected = filter === item.key;
                    return (
                      <Button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        sx={{
                          minHeight: 36,
                          px: 1.5,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          color: selected ? UI.primary : UI.muted,
                          background: selected ? UI.primarySoft : UI.surfaceSoft,
                          border: `1px solid ${selected ? "rgba(15,118,110,0.18)" : UI.border}`,
                          "&:hover": { background: selected ? UI.primarySoft : UI.surfaceSoft },
                        }}
                      >
                        {item.label} ({item.count})
                      </Button>
                    );
                  })}
                </Stack>

                {!!error && (
                  <Alert severity="warning" sx={{ borderRadius: "16px" }} onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", lg: "repeat(4, minmax(0,1fr))" },
              gap: 1.6,
            }}
          >
            <StatCard title="Total Listings" value={counts.all} subtitle="Properties and vehicles" icon={<Inventory2RoundedIcon sx={{ fontSize: 22 }} />} color={UI.primary} bg={UI.primarySoft} />
            <StatCard title="Properties" value={counts.properties} subtitle="All property listings" icon={<HomeWorkRoundedIcon sx={{ fontSize: 22 }} />} color={UI.primary} bg={UI.primarySoft} />
            <StatCard title="Vehicles" value={counts.vehicles} subtitle="All vehicle listings" icon={<DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />} color={UI.blue} bg={UI.blueSoft} />
            <StatCard title="Listed Value" value={formatMoney(counts.totalValue)} subtitle="Combined listed price" icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 22 }} />} color={UI.purple} bg={UI.purpleSoft} />
          </Box>

          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 1.6, sm: 2.2 } }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: UI.faint }}>
                    Listings
                  </Typography>
                  <Typography sx={{ mt: 0.55, color: UI.text, fontSize: "1.08rem", fontWeight: 900 }}>
                    Showing {filteredListings.length} listing{filteredListings.length === 1 ? "" : "s"}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: UI.border }} />

                {loading ? (
                  <Box sx={{ py: 9, display: "grid", placeItems: "center" }}>
                    <Stack spacing={1.2} alignItems="center">
                      <CircularProgress size={34} sx={{ color: UI.primary }} />
                      <Typography sx={{ color: UI.muted, fontSize: "0.88rem", fontWeight: 700 }}>
                        Loading listings...
                      </Typography>
                    </Stack>
                  </Box>
                ) : filteredListings.length === 0 ? (
                  <Box sx={{ py: 9, textAlign: "center" }}>
                    <Avatar sx={{ mx: "auto", width: 62, height: 62, bgcolor: UI.primarySoft, color: UI.primary }}>
                      <SearchRoundedIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography sx={{ mt: 1.4, color: UI.text, fontWeight: 900 }}>
                      No listings found
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: UI.muted, fontSize: "0.84rem" }}>
                      Try another search term or listing filter.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", lg: "repeat(3, minmax(0,1fr))" },
                      gap: 1.6,
                    }}
                  >
                    {filteredListings.map((item) => (
                      <ListingCard key={item.id} item={item} />
                    ))}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
