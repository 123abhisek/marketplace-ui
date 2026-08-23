// src/components/analytics/KPICard.jsx
import React from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { BI_COLORS } from "./analyticsData";

export default function KPICard({
  title,
  value,
  growth = 0,
  comparison = "vs previous period",
  sparkline = [],
  color = BI_COLORS.revenue,
  sparkColor = "#10B981",
  icon,
}) {
  const isPositive = Number(growth) >= 0;

  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: `1px solid ${BI_COLORS.border}`,
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        background: "#FFFFFF",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          transform: "translateY(-2px)",
          borderColor: "rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              sx={{
                color: BI_COLORS.neutral,
                fontSize: "0.82rem",
                fontWeight: 750,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: BI_COLORS.navy,
                fontSize: "1.75rem",
                fontWeight: 950,
                letterSpacing: "-0.03em",
                mt: 0.5,
              }}
            >
              {value}
            </Typography>
          </Box>

          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                color,
                background: `${color}15`,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mt: 2 }}
        >
          <Stack spacing={0.3}>
            <Stack direction="row" alignItems="center" spacing={0.6}>
              <Chip
                size="small"
                icon={
                  isPositive ? (
                    <ArrowUpwardRoundedIcon sx={{ fontSize: "14px !important", color: "inherit" }} />
                  ) : (
                    <ArrowDownwardRoundedIcon sx={{ fontSize: "14px !important", color: "inherit" }} />
                  )
                }
                label={`${isPositive ? "+" : ""}${growth}%`}
                sx={{
                  height: 22,
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  color: isPositive ? "#166534" : "#991B1B",
                  background: isPositive ? "#DCFCE7" : "#FEE2E2",
                  borderRadius: "6px",
                  "& .MuiChip-icon": { color: isPositive ? "#166534" : "#991B1B" },
                }}
              />
            </Stack>
            <Typography sx={{ color: BI_COLORS.neutral, fontSize: "0.74rem", fontWeight: 600 }}>
              {comparison}
            </Typography>
          </Stack>

          {/* Embedded Mini Sparkline */}
          {sparkline && sparkline.length > 0 && (
            <Box sx={{ width: 90, height: 38, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkline} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`spark_${String(title || "kpi").replace(/[^a-zA-Z0-9]/g, "_")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sparkColor || color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={sparkColor || color} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={sparkColor || color}
                    strokeWidth={2.2}
                    fillOpacity={1}
                    fill={`url(#spark_${String(title || "kpi").replace(/[^a-zA-Z0-9]/g, "_")})`}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

