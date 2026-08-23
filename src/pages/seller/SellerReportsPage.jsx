// src/pages/seller/SellerReportsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import ReportFilters from "../../components/analytics/ReportFilters";
import ExecutiveSummaryBar from "../../components/analytics/ExecutiveSummaryBar";
import BookingReportView from "../../components/analytics/BookingReportView";
import RevenueReportView from "../../components/analytics/RevenueReportView";
import GSTReportView from "../../components/analytics/GSTReportView";
import ConversionReportView from "../../components/analytics/ConversionReportView";
import { BI_COLORS } from "../../components/analytics/analyticsData";

export default function SellerReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState("This Month");
  const [category, setCategory] = useState("all");
  const [aggregation, setAggregation] = useState("Monthly");
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    const reportNames = [
      "Seller_Inquiries_Bookings_Report",
      "Seller_Revenue_Earnings_Report",
      "Seller_GST_Tax_Statement",
      "Seller_Listing_Conversion_Report",
    ];
    const name = reportNames[activeTab] || "Seller_Report";
    const rows = [
      ["EasyDeal Seller Performance Report"],
      ["Report Name", name],
      ["Date Range", dateRange],
      ["Category", category],
      ["Generated At", new Date().toLocaleString("en-IN")],
      [],
      ["Section", "Status"],
      ["Summary", "Verified Seller Statement"],
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
          {/* ── Top Header & Global Date/Category Filters ── */}
          <ReportFilters
            title="Seller Performance & Financial Reports"
            subtitle="Power BI Seller Intelligence • Sales, Leads, Tax & Conversion Audit"
            dateRange={dateRange}
            setDateRange={setDateRange}
            category={category}
            setCategory={setCategory}
            aggregation={aggregation}
            setAggregation={setAggregation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={() => window.location.reload()}
            onExport={handleExport}
          />

          <ExecutiveSummaryBar />

          {/* ── Tabs for Seller Reports ── */}
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
                <Tab icon={<ConfirmationNumberRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Inquiries & Bookings Report" />
                <Tab icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Revenue & Earnings Report" />
                <Tab icon={<AccountBalanceRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="GST & Tax Statement" />
                <Tab icon={<FilterAltRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Listing Conversion Report" />
              </Tabs>
            </CardContent>
          </Card>

          {activeTab === 0 && <BookingReportView category={category} searchQuery={searchQuery} />}
          {activeTab === 1 && <RevenueReportView category={category} searchQuery={searchQuery} />}
          {activeTab === 2 && <GSTReportView searchQuery={searchQuery} onExportGST={handleExport} />}
          {activeTab === 3 && <ConversionReportView searchQuery={searchQuery} />}
        </Stack>
      </Box>
    </Box>
  );
}
