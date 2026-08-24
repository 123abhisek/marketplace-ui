// src/components/analytics/ExecutiveSummaryBar.jsx
import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function ExecutiveSummaryBar({ liveData }) {
  const kpis = liveData?.kpis;

  const metrics = [
    { label: "Total Revenue", val: kpis?.total_revenue != null ? `₹${Number(kpis.total_revenue).toLocaleString('en-IN')}` : "₹0" },
    { label: "Total Bookings", val: kpis?.total_bookings != null ? `${kpis.total_bookings}` : "0" },
    { label: "GST Collected", val: kpis?.gst_collected != null ? `₹${Number(kpis.gst_collected).toLocaleString('en-IN')}` : "₹0" },
    { label: "Total Customers", val: kpis?.total_customers != null ? `${kpis.total_customers}` : "0" },
    { label: "Active Sellers", val: kpis?.total_sellers != null ? `${kpis.total_sellers}` : "0" },
    { label: "Pending Items", val: kpis?.total_pending != null ? `${kpis.total_pending}` : "0" },
  ];

  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        background: "linear-gradient(135deg, #0F766E 0%, #0D9488 50%, #14B8A6 100%)",
        color: "#FFFFFF",
        boxShadow: "0 8px 28px rgba(15, 118, 110, 0.2)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ lg: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.15)",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF",
              }}
            >
              <InsightsRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 900, color: "#FFFFFF" }}>
                Executive Intelligence Summary
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.8)" }}>
                Live aggregated data from marketplace transactions and registered members
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.5 }}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
          >
            {metrics.map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1,
                  px: 1.5,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.75)", fontWeight: 700 }}>
                  {item.label}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.2 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 13, color: "#A7F3D0" }} />
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, color: "#FFFFFF" }}>
                    {item.val}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

