// src/pages/admin/AdminReportsPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ReportFilters from "../../components/analytics/ReportFilters";
import ExecutiveSummaryBar from "../../components/analytics/ExecutiveSummaryBar";
import BookingReportView from "../../components/analytics/BookingReportView";
import RevenueReportView from "../../components/analytics/RevenueReportView";
import GSTReportView from "../../components/analytics/GSTReportView";
import ConversionReportView from "../../components/analytics/ConversionReportView";
import UserSellerReportView from "../../components/analytics/UserSellerReportView";
import { BI_COLORS } from "../../components/analytics/analyticsData";
import adminOrdersService from "../../services/adminOrdersApi";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState("This Month");
  const [category, setCategory] = useState("all");
  const [aggregation, setAggregation] = useState("Monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [analyticsData, setAnalyticsData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminOrdersService.getAnalyticsSummary();
      const data = res?.data ?? res;
      setAnalyticsData(data);
    } catch (err) {
      console.warn("Failed to fetch analytics summary, trying dashboard-stats fallback:", err);
      try {
        const statsRes = await adminOrdersService.getDashboardStats();
        const stats = statsRes?.data ?? statsRes;
        setAnalyticsData({
          kpis: {
            total_revenue: stats?.total_revenue || 0,
            total_bookings: stats?.total_bookings || 0,
            confirmed_bookings: stats?.total_bookings || 0,
            pending_bookings: 0,
            cancelled_bookings: 0,
            gst_collected: Math.round((stats?.total_revenue || 0) * 0.18),
            conversion_rate: 0,
            total_customers: stats?.total_customers || 0,
            total_sellers: stats?.total_sellers || 0,
            total_properties: stats?.total_properties || 0,
            total_vehicles: stats?.total_vehicles || 0,
            total_pending: stats?.total_pending || 0,
          },
          status_distribution: [],
          category_distribution: [],
          top_sellers: [],
          recent_bookings: [],
        });
      } catch (fallbackErr) {
        console.error("Failed to load dashboard statistics:", fallbackErr);
        setError("Unable to connect to live analytics API.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = analyticsData?.kpis;

  const handleExport = () => {
    const reportNames = [
      "Booking_Enquiry_Report",
      "Revenue_Audit_Report",
      "GST_Tax_Report",
      "Conversion_Funnel_Report",
      "User_Seller_Report",
    ];
    const name = reportNames[activeTab] || "EasyDeal_Report";
    const rows = [
      ["EasyDeal Business Intelligence Report (Live API Data)"],
      ["Report Type", name],
      ["Date Range", dateRange],
      ["Category", category],
      ["Aggregation", aggregation],
      ["Export Date", new Date().toLocaleString("en-IN")],
      [],
      ["Metric", "Value"],
      ["Total Gross Revenue", `₹${kpis?.total_revenue || 0}`],
      ["Total Bookings", `${kpis?.total_bookings || 0}`],
      ["Confirmed Bookings", `${kpis?.confirmed_bookings || 0}`],
      ["Pending Bookings", `${kpis?.pending_bookings || 0}`],
      ["Cancelled Bookings", `${kpis?.cancelled_bookings || 0}`],
      ["GST Collected (18%)", `₹${kpis?.gst_collected || 0}`],
      ["Conversion Rate", `${kpis?.conversion_rate || 0}%`],
      ["Total Customers", `${kpis?.total_customers || 0}`],
      ["Total Sellers", `${kpis?.total_sellers || 0}`],
      ["Total Properties", `${kpis?.total_properties || 0}`],
      ["Total Vehicles", `${kpis?.total_vehicles || 0}`],
      ["Pending Approvals", `${kpis?.total_pending || 0}`],
    ];
    const csvContent = rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: BI_COLORS.pageBg, p: { xs: 2, md: 3.5 } }}>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Stack spacing={3}>
          <ReportFilters
            title="Executive Reports & Intelligence Center"
            subtitle="Power BI Enterprise Reporting Suite • Financials, Tax, Conversion & Growth"
            dateRange={dateRange}
            setDateRange={setDateRange}
            category={category}
            setCategory={setCategory}
            aggregation={aggregation}
            setAggregation={setAggregation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={fetchAnalytics}
            onExport={handleExport}
            loading={loading}
          />

          {error && <Alert severity="warning" sx={{ borderRadius: "14px" }}>{error}</Alert>}
          {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

          <ExecutiveSummaryBar liveData={analyticsData} />

          <Card
            sx={{
              borderRadius: "20px",
              border: `1px solid ${BI_COLORS.border}`,
              background: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            }}
          >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 48,
                  "& .MuiTab-root": {
                    minHeight: 48,
                    fontWeight: 850,
                    textTransform: "none",
                    fontSize: "0.92rem",
                    px: 3,
                    color: BI_COLORS.neutral,
                    "&.Mui-selected": { color: BI_COLORS.navy },
                  },
                  "& .MuiTabs-indicator": { bgcolor: BI_COLORS.navy, height: 3, borderRadius: "3px 3px 0 0" },
                }}
              >
                <Tab icon={<ConfirmationNumberRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Booking / Enquiry Report" />
                <Tab icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Revenue Report" />
                <Tab icon={<AccountBalanceRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="GST Statutory Report" />
                <Tab icon={<FilterAltRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Conversion Report" />
                <Tab icon={<PeopleAltRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="User & Seller Report" />
              </Tabs>
            </CardContent>
          </Card>

          {activeTab === 0 && <BookingReportView data={analyticsData} category={category} searchQuery={searchQuery} />}
          {activeTab === 1 && <RevenueReportView data={analyticsData} category={category} searchQuery={searchQuery} />}
          {activeTab === 2 && <GSTReportView data={analyticsData} searchQuery={searchQuery} onExportGST={handleExport} />}
          {activeTab === 3 && <ConversionReportView data={analyticsData} searchQuery={searchQuery} />}
          {activeTab === 4 && <UserSellerReportView data={analyticsData} searchQuery={searchQuery} />}
        </Stack>
      </Box>
    </Box>
  );
}

