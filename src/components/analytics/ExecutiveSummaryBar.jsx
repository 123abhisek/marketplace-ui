// src/components/analytics/ExecutiveSummaryBar.jsx
import React from "react";
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { BI_COLORS } from "./analyticsData";

const SUMMARY_METRICS = [
  { label: "Revenue", change: "+18.4%", positive: true },
  { label: "Bookings", change: "+12.6%", positive: true },
  { label: "GST Collected", change: "+15.2%", positive: true },
  { label: "Users Growth", change: "+21.3%", positive: true },
  { label: "Active Sellers", change: "+9.8%", positive: true },
  { label: "Conversion", change: "+1.4%", positive: true },
];

export default function ExecutiveSummaryBar() {
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
                background: "rgba(255, 255, 255, 0.12)",
                display: "grid",
                placeItems: "center",
                color: "#10B981",
              }}
            >
              <InsightsRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 900, color: "#FFFFFF" }}>
                Executive Performance Summary
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.7)" }}>
                Key marketplace metrics compared against previous reporting period
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
          >
            {SUMMARY_METRICS.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  p: 1,
                  px: 1.5,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.65)", fontWeight: 700 }}>
                  {item.label}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.2 }}>
                  <ArrowUpwardRoundedIcon sx={{ fontSize: 14, color: "#10B981" }} />
                  <Typography sx={{ fontSize: "0.86rem", fontWeight: 900, color: "#10B981" }}>
                    {item.change}
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
