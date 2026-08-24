// // src/pages/seller/SellerOverviewPage.jsx
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Grid,
//   LinearProgress,
//   Stack,
//   Typography,
// } from "@mui/material";
// import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
// import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
// import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
// import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
// import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
// import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
// import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
// import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
// import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
// import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
// import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import KPICard from "../../components/analytics/KPICard";
// import ExecutiveSummaryBar from "../../components/analytics/ExecutiveSummaryBar";
// import ReportFilters from "../../components/analytics/ReportFilters";
// import { BI_COLORS, formatINR, formatCompactINR } from "../../components/analytics/analyticsData";
// import { propertyService, vehicleService } from "../../services/api";
// import api from "../../services/api";
// import { useAppState } from "../../hooks/useAppState";

// export default function SellerOverviewPage() {
//   const { user } = useAppState();
//   const [properties, setProperties] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [dateRange, setDateRange] = useState("This Month");
//   const [category, setCategory] = useState("all");
//   const [aggregation, setAggregation] = useState("Monthly");

//   const loadSellerData = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const [propRes, vehRes] = await Promise.allSettled([
//         propertyService.myListings(),
//         vehicleService.myListings(),
//       ]);

//       if (propRes.status === "fulfilled") {
//         setProperties(Array.isArray(propRes.value) ? propRes.value : []);
//       }
//       if (vehRes.status === "fulfilled") {
//         setVehicles(Array.isArray(vehRes.value) ? vehRes.value : []);
//       }
//     } catch (err) {
//       setError(err?.message || "Failed to load seller analytics.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadSellerData();
//   }, [loadSellerData]);

//   const totalProps = properties.length;
//   const totalVehs = vehicles.length;
//   const totalListings = totalProps + totalVehs;
//   const pendingCount =
//     properties.filter((p) => String(p.status).toLowerCase() === "pending").length +
//     vehicles.filter((v) => String(v.status).toLowerCase() === "pending").length;
//   const approvedCount = Math.max(0, totalListings - pendingCount);

//   const totalPropertyValue = useMemo(
//     () => properties.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
//     [properties]
//   );
//   const totalVehicleValue = useMemo(
//     () => vehicles.reduce((sum, v) => sum + (Number(v.price) || 0), 0),
//     [vehicles]
//   );
//   const totalPortfolioValue = totalPropertyValue + totalVehicleValue || 18500000;

//   const trafficChartData = useMemo(() => {
//     const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
//     return months.map((m, idx) => ({
//       month: m,
//       views: Math.round(180 + idx * 85 + (idx % 2) * 20),
//       inquiries: Math.round(24 + idx * 12 + (idx % 3) * 4),
//     }));
//   }, []);

//   const listingCategoryData = useMemo(
//     () => [
//       { name: "Properties", value: totalProps || 6, color: BI_COLORS.property },
//       { name: "Vehicles", value: totalVehs || 4, color: BI_COLORS.vehicle },
//       { name: "Pending Review", value: pendingCount || 1, color: BI_COLORS.gst },
//     ],
//     [totalProps, totalVehs, pendingCount]
//   );

//   return (
//     <Box sx={{ minHeight: "100vh", background: BI_COLORS.pageBg, p: { xs: 2, md: 3.5 } }}>
//       <Box sx={{ maxWidth: 1600, mx: "auto" }}>
//         <Stack spacing={3}>
//           {/* ── Top Header & Global Date/Category Filters ── */}
//           <ReportFilters
//             title="Seller Analytics Dashboard"
//             subtitle="Power BI Intelligence • Inventory Performance & Lead Conversion"
//             dateRange={dateRange}
//             setDateRange={setDateRange}
//             category={category}
//             setCategory={setCategory}
//             aggregation={aggregation}
//             setAggregation={setAggregation}
//             onRefresh={loadSellerData}
//             onExport={() => window.print()}
//             loading={loading}
//           />

//           {error && <Alert severity="error" sx={{ borderRadius: "15px" }}>{error}</Alert>}
//           {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

//           {/* ── Executive Performance Summary Bar ── */}
//           <ExecutiveSummaryBar />

//           {/* ── 5 Seller Primary KPI Cards with Mini Sparklines ── */}
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} lg={2.4}>
//               <KPICard
//                 title="Gross Sales / Bookings"
//                 value="₹3,40,000"
//                 growth={18.4}
//                 comparison="+₹45k vs last month"
//                 sparkColor="#10B981"
//                 sparkline={[{ v: 180 }, { v: 220 }, { v: 260 }, { v: 300 }, { v: 340 }]}
//                 icon={<CurrencyRupeeRoundedIcon />}
//                 color="#10B981"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} lg={2.4}>
//               <KPICard
//                 title="Inquiries & Leads"
//                 value="142"
//                 growth={14.5}
//                 comparison="Direct buyer calls"
//                 sparkColor="#2563EB"
//                 sparkline={[{ v: 80 }, { v: 95 }, { v: 110 }, { v: 125 }, { v: 142 }]}
//                 icon={<ConfirmationNumberRoundedIcon />}
//                 color="#2563EB"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} lg={2.4}>
//               <KPICard
//                 title="Portfolio Asset Value"
//                 value={formatCompactINR(totalPortfolioValue)}
//                 growth={9.2}
//                 comparison="Total active listed assets"
//                 sparkColor="#0F766E"
//                 sparkline={[{ v: 120 }, { v: 140 }, { v: 160 }, { v: 175 }, { v: 185 }]}
//                 icon={<StorefrontRoundedIcon />}
//                 color="#0F766E"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} lg={2.4}>
//               <KPICard
//                 title="Lead Conversion Rate"
//                 value="32.5%"
//                 growth={3.8}
//                 comparison="Top Tier Performance"
//                 sparkColor="#6366F1"
//                 sparkline={[{ v: 26 }, { v: 28 }, { v: 29 }, { v: 31 }, { v: 32.5 }]}
//                 icon={<TrendingUpRoundedIcon />}
//                 color="#6366F1"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} lg={2.4}>
//               <KPICard
//                 title="Active Live Listings"
//                 value={totalListings || 10}
//                 growth={12.0}
//                 comparison={`${approvedCount || 9} Live, ${pendingCount || 1} Review`}
//                 sparkColor="#F59E0B"
//                 sparkline={[{ v: 4 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 10 }]}
//                 icon={<WorkspacePremiumRoundedIcon />}
//                 color="#F59E0B"
//               />
//             </Grid>
//           </Grid>

//           {/* ── CHARTS ROW: Traffic Trajectory & Inventory Breakdown ── */}
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} lg={8}>
//               <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={1.5} mb={2.5}>
//                     <Box>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <ShowChartRoundedIcon sx={{ color: BI_COLORS.property }} />
//                         <Typography sx={{ color: BI_COLORS.navy, fontSize: 18, fontWeight: 900 }}>
//                           Buyer Engagement & Traffic Trajectory
//                         </Typography>
//                       </Stack>
//                       <Typography sx={{ color: BI_COLORS.neutral, fontSize: 12.5, mt: 0.3 }}>
//                         Monthly customer impressions and direct inquiry volume on your listings
//                       </Typography>
//                     </Box>
//                     <Chip label="Seller Insights" size="small" sx={{ color: BI_COLORS.property, background: "rgba(15,118,110,.1)", fontWeight: 800 }} />
//                   </Stack>

//                   <Box sx={{ width: "100%", height: 280 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                         <defs>
//                           <linearGradient id="sellerViews" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor={BI_COLORS.property} stopOpacity={0.4} />
//                             <stop offset="95%" stopColor={BI_COLORS.property} stopOpacity={0.0} />
//                           </linearGradient>
//                           <linearGradient id="sellerInquiries" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor={BI_COLORS.gst} stopOpacity={0.4} />
//                             <stop offset="95%" stopColor={BI_COLORS.gst} stopOpacity={0.0} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
//                         <XAxis dataKey="month" tick={{ fontSize: 12, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
//                         <YAxis tick={{ fontSize: 12, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
//                         <RechartsTooltip contentStyle={{ borderRadius: 14, border: `1px solid ${BI_COLORS.border}` }} />
//                         <Legend />
//                         <Area type="monotone" dataKey="views" name="Listing Impressions" stroke={BI_COLORS.property} strokeWidth={3} fill="url(#sellerViews)" />
//                         <Area type="monotone" dataKey="inquiries" name="Buyer Inquiries" stroke={BI_COLORS.gst} strokeWidth={3} fill="url(#sellerInquiries)" />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} lg={4}>
//               <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)", height: "100%" }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
//                     <PieChartRoundedIcon sx={{ color: BI_COLORS.users }} />
//                     <Typography sx={{ color: BI_COLORS.navy, fontSize: 18, fontWeight: 900 }}>
//                       Inventory Mix
//                     </Typography>
//                   </Stack>
//                   <Typography sx={{ color: BI_COLORS.neutral, fontSize: 12.5, mb: 2 }}>
//                     Active assets categorized
//                   </Typography>

//                   <Box sx={{ width: "100%", height: 200 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie data={listingCategoryData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
//                           {listingCategoryData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Box>

//                   <Stack spacing={1} sx={{ mt: 1 }}>
//                     {listingCategoryData.map((item) => (
//                       <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
//                           <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BI_COLORS.navy }}>{item.name}</Typography>
//                         </Stack>
//                         <Typography sx={{ fontSize: 13, fontWeight: 900, color: BI_COLORS.navy }}>{item.value}</Typography>
//                       </Stack>
//                     ))}
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* ── Active Listings Card with Quick Edit Buttons ── */}
//           <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
//             <CardContent sx={{ p: 3 }}>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
//                   My Active Listings Portfolio
//                 </Typography>
//                 <Button component={RouterLink} to="/seller/listings" size="small" sx={{ fontWeight: 800, color: BI_COLORS.property, textTransform: "none" }}>
//                   Manage All Listings →
//                 </Button>
//               </Stack>

//               <Grid container spacing={2}>
//                 {properties.slice(0, 3).map((item) => (
//                   <Grid item xs={12} md={4} key={item.id}>
//                     <Box sx={{ p: 2.5, borderRadius: "18px", border: `1px solid ${BI_COLORS.border}`, background: "#FCFDFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                       <Box>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//                           <Chip
//                             label={String(item.status || "approved").toUpperCase()}
//                             size="small"
//                             sx={{
//                               fontWeight: 800,
//                               fontSize: "0.68rem",
//                               background: String(item.status).toLowerCase() === "pending" ? "#FEF3C7" : "#DCFCE7",
//                               color: String(item.status).toLowerCase() === "pending" ? "#B45309" : "#166534",
//                             }}
//                           />
//                           <Button
//                             component={RouterLink}
//                             to={`/seller/properties/add?edit=${item.id}`}
//                             size="small"
//                             startIcon={<EditRoundedIcon sx={{ fontSize: 15 }} />}
//                             sx={{
//                               borderRadius: "8px",
//                               fontWeight: 800,
//                               fontSize: "0.74rem",
//                               color: BI_COLORS.vehicle,
//                               background: "rgba(37,99,235,0.08)",
//                               "&:hover": { background: "rgba(37,99,235,0.15)" },
//                             }}
//                           >
//                             Edit
//                           </Button>
//                         </Stack>
//                         <Typography variant="subtitle1" fontWeight={800} color={BI_COLORS.navy} noWrap>
//                           🏢 {item.title}
//                         </Typography>
//                         <Typography variant="body2" color={BI_COLORS.neutral} sx={{ fontSize: "0.82rem" }}>
//                           📍 {item.location || "Karnataka"}
//                         </Typography>
//                       </Box>
//                       <Typography variant="subtitle2" fontWeight={900} color={BI_COLORS.property} mt={1.5}>
//                         ₹{Number(item.price || 0).toLocaleString("en-IN")}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 ))}

//                 {vehicles.slice(0, 3).map((item) => (
//                   <Grid item xs={12} md={4} key={item.id}>
//                     <Box sx={{ p: 2.5, borderRadius: "18px", border: `1px solid ${BI_COLORS.border}`, background: "#FCFDFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                       <Box>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//                           <Chip
//                             label={String(item.status || "approved").toUpperCase()}
//                             size="small"
//                             sx={{
//                               fontWeight: 800,
//                               fontSize: "0.68rem",
//                               background: String(item.status).toLowerCase() === "pending" ? "#FEF3C7" : "#DCFCE7",
//                               color: String(item.status).toLowerCase() === "pending" ? "#B45309" : "#166534",
//                             }}
//                           />
//                           <Button
//                             component={RouterLink}
//                             to={`/seller/vehicles/add?edit=${item.id}`}
//                             size="small"
//                             startIcon={<EditRoundedIcon sx={{ fontSize: 15 }} />}
//                             sx={{
//                               borderRadius: "8px",
//                               fontWeight: 800,
//                               fontSize: "0.74rem",
//                               color: BI_COLORS.vehicle,
//                               background: "rgba(37,99,235,0.08)",
//                               "&:hover": { background: "rgba(37,99,235,0.15)" },
//                             }}
//                           >
//                             Edit
//                           </Button>
//                         </Stack>
//                         <Typography variant="subtitle1" fontWeight={800} color={BI_COLORS.navy} noWrap>
//                           🚗 {item.title}
//                         </Typography>
//                         <Typography variant="body2" color={BI_COLORS.neutral} sx={{ fontSize: "0.82rem" }}>
//                           📍 {item.location || "Karnataka"}
//                         </Typography>
//                       </Box>
//                       <Typography variant="subtitle2" fontWeight={900} color={BI_COLORS.property} mt={1.5}>
//                         ₹{Number(item.price || 0).toLocaleString("en-IN")}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             </CardContent>
//           </Card>
//         </Stack>
//       </Box>
//     </Box>
//   );
// }









// src/pages/seller/SellerOverviewPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import KPICard from "../../components/analytics/KPICard";
import ExecutiveSummaryBar from "../../components/analytics/ExecutiveSummaryBar";
import ReportFilters from "../../components/analytics/ReportFilters";
import { BI_COLORS, formatINR, formatCompactINR } from "../../components/analytics/analyticsData";
import { propertyService, vehicleService } from "../../services/api";
import api from "../../services/api";
import { useAppState } from "../../hooks/useAppState";

export default function SellerOverviewPage() {
  const { user } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [properties, setProperties] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("This Month");
  const [category, setCategory] = useState("all");
  const [aggregation, setAggregation] = useState("Monthly");

  const loadSellerData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [propRes, vehRes] = await Promise.allSettled([
        propertyService.myListings(),
        vehicleService.myListings(),
      ]);

      if (propRes.status === "fulfilled") {
        setProperties(Array.isArray(propRes.value) ? propRes.value : []);
      }
      if (vehRes.status === "fulfilled") {
        setVehicles(Array.isArray(vehRes.value) ? vehRes.value : []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load seller analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSellerData();
  }, [loadSellerData]);

  const totalProps = properties.length;
  const totalVehs = vehicles.length;
  const totalListings = totalProps + totalVehs;
  const pendingCount =
    properties.filter((p) => String(p.status).toLowerCase() === "pending").length +
    vehicles.filter((v) => String(v.status).toLowerCase() === "pending").length;
  const approvedCount = Math.max(0, totalListings - pendingCount);

  const totalPropertyValue = useMemo(
    () => properties.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
    [properties]
  );
  const totalVehicleValue = useMemo(
    () => vehicles.reduce((sum, v) => sum + (Number(v.price) || 0), 0),
    [vehicles]
  );
  const totalPortfolioValue = totalPropertyValue + totalVehicleValue || 18500000;

  const trafficChartData = useMemo(() => {
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return months.map((m, idx) => ({
      month: m,
      views: Math.round(180 + idx * 85 + (idx % 2) * 20),
      inquiries: Math.round(24 + idx * 12 + (idx % 3) * 4),
    }));
  }, []);

  const listingCategoryData = useMemo(
    () => [
      { name: "Properties", value: totalProps || 6, color: BI_COLORS.property },
      { name: "Vehicles", value: totalVehs || 4, color: BI_COLORS.vehicle },
      { name: "Pending Review", value: pendingCount || 1, color: BI_COLORS.gst },
    ],
    [totalProps, totalVehs, pendingCount]
  );

  return (
    <Box
      sx={{
        minHeight: "100%",
        background: BI_COLORS.pageBg,
        p: { xs: 1.25, sm: 2, md: 3.5 },
        overflowX: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: "auto", width: "100%" }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          {/* ── Top Header & Global Date/Category Filters ── */}
          <ReportFilters
            title="Seller Analytics Dashboard"
            subtitle="Power BI Intelligence • Inventory Performance & Lead Conversion"
            dateRange={dateRange}
            setDateRange={setDateRange}
            category={category}
            setCategory={setCategory}
            aggregation={aggregation}
            setAggregation={setAggregation}
            onRefresh={loadSellerData}
            onExport={() => window.print()}
            loading={loading}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: "15px", fontSize: { xs: 13, sm: 14 } }}>
              {error}
            </Alert>
          )}
          {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

          {/* ── Executive Performance Summary Bar ── */}
          <ExecutiveSummaryBar />

          {/* ── 5 Seller Primary KPI Cards with Mini Sparklines ── */}
          <Grid container spacing={{ xs: 1.25, sm: 2 }}>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KPICard
                title="Gross Sales / Bookings"
                value="₹3,40,000"
                growth={18.4}
                comparison="+₹45k vs last month"
                sparkColor="#10B981"
                sparkline={[{ v: 180 }, { v: 220 }, { v: 260 }, { v: 300 }, { v: 340 }]}
                icon={<CurrencyRupeeRoundedIcon />}
                color="#10B981"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KPICard
                title="Inquiries & Leads"
                value="142"
                growth={14.5}
                comparison="Direct buyer calls"
                sparkColor="#2563EB"
                sparkline={[{ v: 80 }, { v: 95 }, { v: 110 }, { v: 125 }, { v: 142 }]}
                icon={<ConfirmationNumberRoundedIcon />}
                color="#2563EB"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KPICard
                title="Portfolio Asset Value"
                value={formatCompactINR(totalPortfolioValue)}
                growth={9.2}
                comparison="Total active listed assets"
                sparkColor="#0F766E"
                sparkline={[{ v: 120 }, { v: 140 }, { v: 160 }, { v: 175 }, { v: 185 }]}
                icon={<StorefrontRoundedIcon />}
                color="#0F766E"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KPICard
                title="Lead Conversion Rate"
                value="32.5%"
                growth={3.8}
                comparison="Top Tier Performance"
                sparkColor="#6366F1"
                sparkline={[{ v: 26 }, { v: 28 }, { v: 29 }, { v: 31 }, { v: 32.5 }]}
                icon={<TrendingUpRoundedIcon />}
                color="#6366F1"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KPICard
                title="Active Live Listings"
                value={totalListings || 10}
                growth={12.0}
                comparison={`${approvedCount || 9} Live, ${pendingCount || 1} Review`}
                sparkColor="#F59E0B"
                sparkline={[{ v: 4 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 10 }]}
                icon={<WorkspacePremiumRoundedIcon />}
                color="#F59E0B"
              />
            </Grid>
          </Grid>

          {/* ── CHARTS ROW: Traffic Trajectory & Inventory Breakdown ── */}
          <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  borderRadius: { xs: "16px", md: "20px" },
                  border: `1px solid ${BI_COLORS.border}`,
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
                }}
              >
                <CardContent sx={{ p: { xs: 1.75, sm: 2.5, md: 3 } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={1.25}
                    mb={{ xs: 1.75, sm: 2.5 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ShowChartRoundedIcon sx={{ color: BI_COLORS.property, fontSize: { xs: 20, sm: 24 } }} />
                        <Typography
                          sx={{
                            color: BI_COLORS.navy,
                            fontSize: { xs: 14.5, sm: 18 },
                            fontWeight: 900,
                            lineHeight: 1.3,
                          }}
                        >
                          Buyer Engagement &amp; Traffic Trajectory
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          color: BI_COLORS.neutral,
                          fontSize: { xs: 11, sm: 12.5 },
                          mt: 0.3,
                        }}
                      >
                        Monthly customer impressions and direct inquiry volume on your listings
                      </Typography>
                    </Box>
                    <Chip
                      label="Seller Insights"
                      size="small"
                      sx={{
                        color: BI_COLORS.property,
                        background: "rgba(15,118,110,.1)",
                        fontWeight: 800,
                        alignSelf: { xs: "flex-start", sm: "center" },
                      }}
                    />
                  </Stack>

                  <Box sx={{ width: "100%", height: { xs: 210, sm: 250, md: 280 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={trafficChartData}
                        margin={{ top: 10, right: isMobile ? 0 : 10, left: isMobile ? -30 : -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="sellerViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={BI_COLORS.property} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={BI_COLORS.property} stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="sellerInquiries" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={BI_COLORS.gst} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={BI_COLORS.gst} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: isMobile ? 10 : 12, fill: BI_COLORS.neutral, fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          interval={isMobile ? 1 : 0}
                        />
                        {!isMobile && (
                          <YAxis
                            tick={{ fontSize: 12, fill: BI_COLORS.neutral, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                          />
                        )}
                        <RechartsTooltip contentStyle={{ borderRadius: 14, border: `1px solid ${BI_COLORS.border}`, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 13 }} />
                        <Area
                          type="monotone"
                          dataKey="views"
                          name="Listing Impressions"
                          stroke={BI_COLORS.property}
                          strokeWidth={isMobile ? 2 : 3}
                          fill="url(#sellerViews)"
                        />
                        <Area
                          type="monotone"
                          dataKey="inquiries"
                          name="Buyer Inquiries"
                          stroke={BI_COLORS.gst}
                          strokeWidth={isMobile ? 2 : 3}
                          fill="url(#sellerInquiries)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  borderRadius: { xs: "16px", md: "20px" },
                  border: `1px solid ${BI_COLORS.border}`,
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: { xs: 1.75, sm: 2.5, md: 3 } }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <PieChartRoundedIcon sx={{ color: BI_COLORS.users, fontSize: { xs: 20, sm: 24 } }} />
                    <Typography sx={{ color: BI_COLORS.navy, fontSize: { xs: 14.5, sm: 18 }, fontWeight: 900 }}>
                      Inventory Mix
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: BI_COLORS.neutral, fontSize: { xs: 11, sm: 12.5 }, mb: 2 }}>
                    Active assets categorized
                  </Typography>

                  <Box sx={{ width: "100%", height: { xs: 170, sm: 200 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={listingCategoryData}
                          innerRadius={isMobile ? 45 : 55}
                          outerRadius={isMobile ? 68 : 80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {listingCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {listingCategoryData.map((item) => (
                      <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: { xs: 11.5, sm: 12.5 }, fontWeight: 700, color: BI_COLORS.navy }}>
                            {item.name}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 900, color: BI_COLORS.navy }}>
                          {item.value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Active Listings Card with Quick Edit Buttons ── */}
          <Card
            sx={{
              borderRadius: { xs: "16px", md: "20px" },
              border: `1px solid ${BI_COLORS.border}`,
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            <CardContent sx={{ p: { xs: 1.75, sm: 2.5, md: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1}
                mb={2}
              >
                <Typography sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, fontWeight: 900, color: BI_COLORS.navy }}>
                  My Active Listings Portfolio
                </Typography>
                <Button
                  component={RouterLink}
                  to="/seller/listings"
                  size="small"
                  sx={{ fontWeight: 800, color: BI_COLORS.property, textTransform: "none", pl: 0 }}
                >
                  Manage All Listings →
                </Button>
              </Stack>

              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {properties.slice(0, 3).map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: "18px",
                        border: `1px solid ${BI_COLORS.border}`,
                        background: "#FCFDFF",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} gap={1}>
                          <Chip
                            label={String(item.status || "approved").toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.68rem",
                              background: String(item.status).toLowerCase() === "pending" ? "#FEF3C7" : "#DCFCE7",
                              color: String(item.status).toLowerCase() === "pending" ? "#B45309" : "#166534",
                            }}
                          />
                          <Button
                            component={RouterLink}
                            to={`/seller/properties/add?edit=${item.id}`}
                            size="small"
                            startIcon={<EditRoundedIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 800,
                              fontSize: "0.74rem",
                              color: BI_COLORS.vehicle,
                              background: "rgba(37,99,235,0.08)",
                              flexShrink: 0,
                              "&:hover": { background: "rgba(37,99,235,0.15)" },
                            }}
                          >
                            Edit
                          </Button>
                        </Stack>
                        <Typography variant="subtitle1" fontWeight={800} color={BI_COLORS.navy} noWrap>
                          🏢 {item.title}
                        </Typography>
                        <Typography variant="body2" color={BI_COLORS.neutral} sx={{ fontSize: "0.82rem" }}>
                          📍 {item.location || "Karnataka"}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={900} color={BI_COLORS.property} mt={1.5}>
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>
                ))}

                {vehicles.slice(0, 3).map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: "18px",
                        border: `1px solid ${BI_COLORS.border}`,
                        background: "#FCFDFF",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} gap={1}>
                          <Chip
                            label={String(item.status || "approved").toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.68rem",
                              background: String(item.status).toLowerCase() === "pending" ? "#FEF3C7" : "#DCFCE7",
                              color: String(item.status).toLowerCase() === "pending" ? "#B45309" : "#166534",
                            }}
                          />
                          <Button
                            component={RouterLink}
                            to={`/seller/vehicles/add?edit=${item.id}`}
                            size="small"
                            startIcon={<EditRoundedIcon sx={{ fontSize: 15 }} />}
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 800,
                              fontSize: "0.74rem",
                              color: BI_COLORS.vehicle,
                              background: "rgba(37,99,235,0.08)",
                              flexShrink: 0,
                              "&:hover": { background: "rgba(37,99,235,0.15)" },
                            }}
                          >
                            Edit
                          </Button>
                        </Stack>
                        <Typography variant="subtitle1" fontWeight={800} color={BI_COLORS.navy} noWrap>
                          🚗 {item.title}
                        </Typography>
                        <Typography variant="body2" color={BI_COLORS.neutral} sx={{ fontSize: "0.82rem" }}>
                          📍 {item.location || "Karnataka"}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={900} color={BI_COLORS.property} mt={1.5}>
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}