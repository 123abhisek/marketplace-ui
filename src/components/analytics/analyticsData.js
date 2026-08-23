// src/components/analytics/analyticsData.js

export const formatINR = (val) => {
  const n = Number(val || 0);
  return `₹${n.toLocaleString("en-IN")}`;
};

export const formatCompactINR = (val) => {
  const n = Number(val || 0);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakh`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export const BI_COLORS = {
  property: "#0F766E", // Teal
  vehicle: "#2563EB",  // Blue
  revenue: "#10B981",  // Emerald
  gst: "#F59E0B",      // Amber
  bookings: "#6366F1", // Indigo
  users: "#8B5CF6",    // Violet
  danger: "#EF4444",   // Red
  neutral: "#64748B",  // Slate
  cardBg: "#FFFFFF",
  pageBg: "#F8FAFC",
  border: "rgba(15, 23, 42, 0.08)",
  navy: "#0F172A",
};

// ── Sparklines Data ──
export const SPARKLINE_REVENUE = [
  { v: 820000 }, { v: 890000 }, { v: 940000 }, { v: 910000 },
  { v: 1050000 }, { v: 1120000 }, { v: 1245800 }
];
export const SPARKLINE_BOOKINGS = [
  { v: 890 }, { v: 940 }, { v: 1010 }, { v: 1080 },
  { v: 1140 }, { v: 1190 }, { v: 1248 }
];
export const SPARKLINE_GST = [
  { v: 147600 }, { v: 160200 }, { v: 169200 }, { v: 163800 },
  { v: 189000 }, { v: 201600 }, { v: 224244 }
];
export const SPARKLINE_CONVERSION = [
  { v: 6.2 }, { v: 6.5 }, { v: 6.9 }, { v: 7.1 },
  { v: 7.3 }, { v: 7.5 }, { v: 7.8 }
];
export const SPARKLINE_SELLERS = [
  { v: 270 }, { v: 285 }, { v: 298 }, { v: 312 },
  { v: 325 }, { v: 334 }, { v: 342 }
];

// ── Executive KPIs ──
export const EXECUTIVE_KPIS = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹12,45,800",
    rawVal: 1245800,
    growth: 18.4,
    comparison: "+18.4% compared with previous period",
    sparkline: SPARKLINE_REVENUE,
    color: BI_COLORS.revenue,
    sparkColor: "#10B981",
  },
  {
    id: "bookings",
    title: "Total Bookings / Enquiries",
    value: "1,248",
    rawVal: 1248,
    growth: 12.6,
    comparison: "+12.6% vs previous period",
    sparkline: SPARKLINE_BOOKINGS,
    color: BI_COLORS.bookings,
    sparkColor: "#6366F1",
  },
  {
    id: "gst",
    title: "GST Collected",
    value: "₹2,24,244",
    rawVal: 224244,
    growth: 15.2,
    comparison: "+15.2% vs previous period",
    sparkline: SPARKLINE_GST,
    color: BI_COLORS.gst,
    sparkColor: "#F59E0B",
  },
  {
    id: "conversion",
    title: "Conversion Rate",
    value: "7.8%",
    rawVal: 7.8,
    growth: 1.4,
    comparison: "+1.4% vs previous period",
    sparkline: SPARKLINE_CONVERSION,
    color: BI_COLORS.property,
    sparkColor: "#0F766E",
  },
  {
    id: "sellers",
    title: "Active Sellers",
    value: "342",
    rawVal: 342,
    growth: 9.8,
    comparison: "+9.8% vs previous period",
    sparkline: SPARKLINE_SELLERS,
    color: BI_COLORS.users,
    sparkColor: "#8B5CF6",
  },
];

// ── Report 1: Booking / Enquiry Trend Data ──
export const BOOKING_TREND_DATA = [
  { date: "01 Aug", enquiries: 42, confirmed: 18, completed: 14, cancelled: 3 },
  { date: "05 Aug", enquiries: 58, confirmed: 24, completed: 20, cancelled: 4 },
  { date: "10 Aug", enquiries: 65, confirmed: 30, completed: 25, cancelled: 5 },
  { date: "15 Aug", enquiries: 80, confirmed: 38, completed: 32, cancelled: 6 },
  { date: "20 Aug", enquiries: 95, confirmed: 45, completed: 40, cancelled: 7 },
  { date: "25 Aug", enquiries: 110, confirmed: 54, completed: 48, cancelled: 5 },
  { date: "30 Aug", enquiries: 128, confirmed: 62, completed: 55, cancelled: 4 },
];

export const BOOKING_STATUS_DATA = [
  { name: "Confirmed", value: 580, color: "#10B981" },
  { name: "Pending", value: 340, color: "#F59E0B" },
  { name: "Completed", value: 248, color: "#0F766E" },
  { name: "Cancelled", value: 80, color: "#EF4444" },
];

export const BOOKING_CATEGORY_DATA = [
  { category: "Residential Property", property: 380, vehicle: 0 },
  { category: "Commercial Land", property: 240, vehicle: 0 },
  { category: "Cars & SUVs", property: 0, vehicle: 310 },
  { category: "Commercial Vehicles", property: 0, vehicle: 180 },
  { category: "Two Wheelers", property: 0, vehicle: 138 },
];

export const TOP_SELLERS_BY_BOOKINGS = [
  { name: "Apex Realty Group", bookings: 142, revenue: "₹3,40,000" },
  { name: "Karnataka Auto Hub", bookings: 118, revenue: "₹2,85,000" },
  { name: "Silicon City Properties", bookings: 96, revenue: "₹2,10,000" },
  { name: "Mysore Motors Direct", bookings: 84, revenue: "₹1,75,000" },
  { name: "Greenfield Farmlands", bookings: 72, revenue: "₹1,60,000" },
];

export const RECENT_BOOKINGS_TABLE = [
  { id: "BK-9042", customer: "Rahul Sharma", seller: "Apex Realty", category: "Property", amount: 45000, status: "Confirmed", date: "2026-08-23" },
  { id: "BK-9041", customer: "Priya Nair", seller: "Karnataka Auto", category: "Vehicle", amount: 18500, status: "Completed", date: "2026-08-23" },
  { id: "BK-9040", customer: "Amit Patel", seller: "Silicon City", category: "Property", amount: 62000, status: "Pending", date: "2026-08-22" },
  { id: "BK-9039", customer: "Sunil Hegde", seller: "Mysore Motors", category: "Vehicle", amount: 12000, status: "Confirmed", date: "2026-08-22" },
  { id: "BK-9038", customer: "Sneha Reddy", seller: "Greenfield Farms", category: "Property", amount: 95000, status: "Cancelled", date: "2026-08-21" },
  { id: "BK-9037", customer: "Kiran Kumar", seller: "Apex Realty", category: "Property", amount: 38000, status: "Completed", date: "2026-08-21" },
];

// ── Report 2: Revenue Analytics Data ──
export const REVENUE_TREND_DATA = [
  { month: "Feb", gross: 640000, discounts: 24000, gst: 115200, net: 500800 },
  { month: "Mar", gross: 780000, discounts: 30000, gst: 140400, net: 609600 },
  { month: "Apr", gross: 850000, discounts: 32000, gst: 153000, net: 665000 },
  { month: "May", gross: 920000, discounts: 35000, gst: 165600, net: 719400 },
  { month: "Jun", gross: 1040000, discounts: 42000, gst: 187200, net: 810800 },
  { month: "Jul", gross: 1150000, discounts: 45000, gst: 207000, net: 898000 },
  { month: "Aug", gross: 1245800, discounts: 50000, gst: 224244, net: 971556 },
];

export const REVENUE_BY_CATEGORY = [
  { name: "Properties", revenue: 680000, fill: BI_COLORS.property },
  { name: "Vehicles", revenue: 380000, fill: BI_COLORS.vehicle },
  { name: "Subscriptions", revenue: 145800, fill: BI_COLORS.users },
  { name: "Inspection Services", revenue: 40000, fill: BI_COLORS.gst },
];

export const REVENUE_BREAKDOWN_DONUT = [
  { name: "Property Commissions", value: 680000, color: BI_COLORS.property },
  { name: "Vehicle Transactions", value: 380000, color: BI_COLORS.vehicle },
  { name: "Premium Subscriptions", value: 145800, color: BI_COLORS.users },
  { name: "On-Ground Inspection", value: 40000, color: BI_COLORS.gst },
];

export const TOP_10_SELLERS_REVENUE = [
  { name: "Apex Realty Group", revenue: 285000 },
  { name: "Karnataka Auto Hub", revenue: 210000 },
  { name: "Silicon City Real Estate", revenue: 175000 },
  { name: "Mysore Prime Motors", revenue: 142000 },
  { name: "Greenfield Farmlands", revenue: 115000 },
  { name: "Coastal Horizon Properties", revenue: 98000 },
  { name: "Bangalore Fleet Exchange", revenue: 84000 },
  { name: "Heritage Homes & Villas", revenue: 76000 },
  { name: "Royal Prestige Wheels", revenue: 62000 },
  { name: "Deccan Agriland Developers", revenue: 54000 },
];

export const MONTHLY_REVENUE_COMPARISON = [
  { metric: "Week 1", current: 280000, previous: 240000 },
  { metric: "Week 2", current: 310000, previous: 265000 },
  { metric: "Week 3", current: 340000, previous: 295000 },
  { metric: "Week 4", current: 315800, previous: 270000 },
];

export const REVENUE_TABLE_DATA = [
  { id: "TXN-8812", date: "2026-08-23", customer: "Rahul Sharma", seller: "Apex Realty", category: "Property", gross: 45000, discount: 2000, gst: 7740, net: 35260, status: "Paid" },
  { id: "TXN-8811", date: "2026-08-23", customer: "Priya Nair", seller: "Karnataka Auto", category: "Vehicle", gross: 18500, discount: 500, gst: 3240, net: 14760, status: "Paid" },
  { id: "TXN-8810", date: "2026-08-22", customer: "Amit Patel", seller: "Silicon City", category: "Property", gross: 62000, discount: 3000, gst: 10620, net: 48380, status: "Processing" },
  { id: "TXN-8809", date: "2026-08-22", customer: "Sunil Hegde", seller: "Mysore Motors", category: "Vehicle", gross: 12000, discount: 0, gst: 2160, net: 9840, status: "Paid" },
  { id: "TXN-8808", date: "2026-08-21", customer: "Kiran Kumar", seller: "Apex Realty", category: "Property", gross: 38000, discount: 1500, gst: 6570, net: 29930, status: "Paid" },
];

// ── Report 3: GST Analytics Data ──
export const GST_COLLECTION_TREND = [
  { month: "Feb", taxable: 640000, gst: 115200, cgst: 57600, sgst: 57600, igst: 0 },
  { month: "Mar", taxable: 780000, gst: 140400, cgst: 70200, sgst: 70200, igst: 0 },
  { month: "Apr", taxable: 850000, gst: 153000, cgst: 76500, sgst: 76500, igst: 0 },
  { month: "May", taxable: 920000, gst: 165600, cgst: 79000, sgst: 79000, igst: 7600 },
  { month: "Jun", taxable: 1040000, gst: 187200, cgst: 89000, sgst: 89000, igst: 9200 },
  { month: "Jul", taxable: 1150000, gst: 207000, cgst: 98000, sgst: 98000, igst: 11000 },
  { month: "Aug", taxable: 1245800, gst: 224244, cgst: 105622, sgst: 105622, igst: 13000 },
];

export const GST_BREAKDOWN_DONUT = [
  { name: "CGST (9%)", value: 105622, color: BI_COLORS.property },
  { name: "SGST (9%)", value: 105622, color: BI_COLORS.vehicle },
  { name: "IGST (18%)", value: 13000, color: BI_COLORS.gst },
];

export const GST_BY_CATEGORY_BAR = [
  { category: "Properties", taxable: 680000, gst: 122400 },
  { category: "Vehicles", taxable: 380000, gst: 68400 },
  { category: "Subscriptions", taxable: 145800, gst: 26244 },
  { category: "Value Added", taxable: 40000, gst: 7200 },
];

export const GST_REPORT_TABLE = [
  { invoice: "ED-INV-2026-081", date: "2026-08-23", customer: "Rahul Sharma", taxable: 43000, cgst: 3870, sgst: 3870, igst: 0, totalGst: 7740, total: 50740 },
  { invoice: "ED-INV-2026-080", date: "2026-08-23", customer: "Priya Nair", taxable: 18000, cgst: 1620, sgst: 1620, igst: 0, totalGst: 3240, total: 21240 },
  { invoice: "ED-INV-2026-079", date: "2026-08-22", customer: "Amit Patel", taxable: 59000, cgst: 0, sgst: 0, igst: 10620, totalGst: 10620, total: 69620 },
  { invoice: "ED-INV-2026-078", date: "2026-08-22", customer: "Sunil Hegde", taxable: 12000, cgst: 1080, sgst: 1080, igst: 0, totalGst: 2160, total: 14160 },
  { invoice: "ED-INV-2026-077", date: "2026-08-21", customer: "Kiran Kumar", taxable: 36500, cgst: 3285, sgst: 3285, igst: 0, totalGst: 6570, total: 43070 },
];

// ── Report 4: Conversion Rate Analytics Data ──
export const CONVERSION_FUNNEL_STAGES = [
  { stage: "Platform Visitors", count: 10000, pct: "100%", stepPct: "100%", fill: "#1E293B" },
  { stage: "Listing Views", count: 2500, pct: "25.0%", stepPct: "25.0% of visitors", fill: "#0F766E" },
  { stage: "Enquiries Sent", count: 400, pct: "4.0%", stepPct: "16.0% of views", fill: "#2563EB" },
  { stage: "Contacts / Calls", count: 250, pct: "2.5%", stepPct: "62.5% of enquiries", fill: "#6366F1" },
  { stage: "Bookings Made", count: 100, pct: "1.0%", stepPct: "40.0% of calls", fill: "#F59E0B" },
  { stage: "Completed Transactions", count: 70, pct: "0.7%", stepPct: "70.0% of bookings", fill: "#10B981" },
];

export const CONVERSION_TREND_DATA = [
  { week: "W1 Jul", overallRate: 6.2, enquiryRate: 14.5, bookingRate: 21.0 },
  { week: "W2 Jul", overallRate: 6.5, enquiryRate: 15.0, bookingRate: 22.5 },
  { week: "W3 Jul", overallRate: 6.8, enquiryRate: 15.4, bookingRate: 23.8 },
  { week: "W4 Jul", overallRate: 7.1, enquiryRate: 15.8, bookingRate: 24.2 },
  { week: "W1 Aug", overallRate: 7.3, enquiryRate: 16.0, bookingRate: 24.8 },
  { week: "W2 Aug", overallRate: 7.5, enquiryRate: 16.2, bookingRate: 25.1 },
  { week: "W3 Aug", overallRate: 7.8, enquiryRate: 16.0, bookingRate: 25.0 },
];

export const PROPERTY_VS_VEHICLE_CONVERSION = [
  { stage: "Enquiry %", Property: 18.2, Vehicle: 14.5 },
  { stage: "Contact %", Property: 64.0, Vehicle: 58.5 },
  { stage: "Booking %", Property: 26.5, Vehicle: 22.0 },
  { stage: "Final Deal %", Property: 74.0, Vehicle: 68.0 },
];

export const SELLER_CONVERSION_TABLE = [
  { seller: "Apex Realty Group", views: 1240, enquiries: 240, bookings: 78, completed: 62, rate: "79.5%" },
  { seller: "Karnataka Auto Hub", views: 980, enquiries: 180, bookings: 54, completed: 42, rate: "77.8%" },
  { seller: "Silicon City Real Estate", views: 820, enquiries: 140, bookings: 42, completed: 34, rate: "81.0%" },
  { seller: "Mysore Motors Direct", views: 650, enquiries: 110, bookings: 32, completed: 25, rate: "78.1%" },
  { seller: "Greenfield Farmlands", views: 540, enquiries: 95, bookings: 28, completed: 22, rate: "78.6%" },
];

export const BEST_PERFORMING_LISTINGS = [
  { listing: "Prestige Lakeside 3BHK Apartment", type: "Property", views: 420, enquiries: 94, bookings: 32, rate: "34.0%" },
  { listing: "Toyota Fortuner 4x4 2022", type: "Vehicle", views: 380, enquiries: 78, bookings: 24, rate: "30.8%" },
  { listing: "Brigade Gateway Luxury Penthouse", type: "Property", views: 350, enquiries: 68, bookings: 21, rate: "30.9%" },
  { listing: "Hyundai Creta SX(O) Diesel", type: "Vehicle", views: 310, enquiries: 62, bookings: 19, rate: "30.6%" },
  { listing: "Commercial Plot Main Road Whitefield", type: "Property", views: 290, enquiries: 55, bookings: 18, rate: "32.7%" },
];

// ── Report 5: User & Seller Analytics Data ──
export const USER_GROWTH_TREND = [
  { month: "Feb", totalUsers: 2100, newUsers: 320, activeUsers: 1450 },
  { month: "Mar", totalUsers: 2520, newUsers: 420, activeUsers: 1780 },
  { month: "Apr", totalUsers: 3010, newUsers: 490, activeUsers: 2100 },
  { month: "May", totalUsers: 3580, newUsers: 570, activeUsers: 2540 },
  { month: "Jun", totalUsers: 4240, newUsers: 660, activeUsers: 2980 },
  { month: "Jul", totalUsers: 5010, newUsers: 770, activeUsers: 3560 },
  { month: "Aug", totalUsers: 5890, newUsers: 880, activeUsers: 4180 },
];

export const USER_TYPE_DONUT = [
  { name: "Free Buyers", value: 4250, color: BI_COLORS.vehicle },
  { name: "Premium Subscribers", value: 1298, color: BI_COLORS.users },
  { name: "Verified Sellers", value: 342, color: BI_COLORS.property },
  { name: "Admin Moderators", value: 8, color: BI_COLORS.navy },
];

export const SELLER_GROWTH_TREND = [
  { month: "Feb", registered: 210, approved: 190, pending: 15 },
  { month: "Mar", registered: 240, approved: 220, pending: 12 },
  { month: "Apr", registered: 275, approved: 250, pending: 18 },
  { month: "May", registered: 305, approved: 280, pending: 16 },
  { month: "Jun", registered: 335, approved: 305, pending: 20 },
  { month: "Jul", registered: 360, approved: 325, pending: 22 },
  { month: "Aug", registered: 382, approved: 342, pending: 28 },
];

export const SELLER_REQUEST_STATUS_DONUT = [
  { name: "Approved", value: 342, color: "#10B981" },
  { name: "Pending Review", value: 28, color: "#F59E0B" },
  { name: "Rejected / Suspended", value: 12, color: "#EF4444" },
];

export const TOP_SELLERS_TABLE = [
  { rank: 1, seller: "Apex Realty Group", listings: 38, views: 1240, enquiries: 240, bookings: 78, revenue: "₹3,40,000", rate: "32.5%" },
  { rank: 2, seller: "Karnataka Auto Hub", listings: 32, views: 980, enquiries: 180, bookings: 54, revenue: "₹2,85,000", rate: "30.0%" },
  { rank: 3, seller: "Silicon City Real Estate", listings: 26, views: 820, enquiries: 140, bookings: 42, revenue: "₹2,10,000", rate: "30.0%" },
  { rank: 4, seller: "Mysore Motors Direct", listings: 22, views: 650, enquiries: 110, bookings: 32, revenue: "₹1,75,000", rate: "29.1%" },
  { rank: 5, seller: "Greenfield Farmlands", listings: 18, views: 540, enquiries: 95, bookings: 28, revenue: "₹1,60,000", rate: "29.5%" },
];
