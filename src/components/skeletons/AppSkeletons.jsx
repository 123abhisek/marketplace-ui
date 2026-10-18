// src/components/skeletons/AppSkeletons.jsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";

const SKELETON_BG = "#F1F5F9";

/**
 * Single Listing Card Skeleton (Property / Vehicle card)
 */
export function CardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        background: "#FFFFFF",
        overflow: "hidden",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 2px 20px rgba(15,23,42,0.04)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        animation="wave"
        sx={{ bgcolor: SKELETON_BG }}
      />

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Skeleton
            variant="rounded"
            height={22}
            width={75}
            animation="wave"
            sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
          />
          <Skeleton
            variant="rounded"
            height={22}
            width={65}
            animation="wave"
            sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
          />
        </Stack>

        <Skeleton
          variant="text"
          height={28}
          width="85%"
          animation="wave"
          sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="circular" width={16} height={16} animation="wave" sx={{ bgcolor: SKELETON_BG }} />
          <Skeleton
            variant="text"
            height={18}
            width="60%"
            animation="wave"
            sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          <Skeleton
            variant="rounded"
            height={24}
            width={70}
            animation="wave"
            sx={{ borderRadius: "8px", bgcolor: SKELETON_BG }}
          />
          <Skeleton
            variant="rounded"
            height={24}
            width={85}
            animation="wave"
            sx={{ borderRadius: "8px", bgcolor: SKELETON_BG }}
          />
          <Skeleton
            variant="rounded"
            height={24}
            width={60}
            animation="wave"
            sx={{ borderRadius: "8px", bgcolor: SKELETON_BG }}
          />
        </Stack>

        <Box sx={{ flexGrow: 1, minHeight: 12 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: "1px solid #F1F5F9" }}>
          <Box>
            <Skeleton
              variant="text"
              height={14}
              width={40}
              animation="wave"
              sx={{ borderRadius: "4px", bgcolor: SKELETON_BG }}
            />
            <Skeleton
              variant="text"
              height={28}
              width={100}
              animation="wave"
              sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
            />
          </Box>
          <Skeleton
            variant="rounded"
            height={36}
            width={88}
            animation="wave"
            sx={{ borderRadius: "10px", bgcolor: SKELETON_BG }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Grid of listing card skeletons
 */
export function CardSkeletonGrid({ count = 6, sm = 6, md = 4, lg = 4, xl = 4 }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} alignItems="stretch">
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={sm} md={md} lg={lg} xl={xl} key={`card-skel-${i}`} sx={{ display: "flex", width: "100%" }}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * KPI / Stat Card Skeleton
 */
export function KPICardSkeleton({ count = 4, sm = 6, md = 4, lg = 2.4 }) {
  return (
    <Grid container spacing={2.2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={sm} md={md} lg={lg} key={`kpi-skel-${i}`}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
              background: "#FFFFFF",
              p: 2.5,
              height: "100%",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ width: "65%" }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={18}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "4px" }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={42}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "6px", mt: 0.5 }}
                />
              </Box>
              <Skeleton
                variant="rounded"
                width={44}
                height={44}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "14px" }}
              />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 2 }}>
              <Box sx={{ width: "50%" }}>
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={22}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "6px", mb: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={14}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "4px" }}
                />
              </Box>
              <Skeleton
                variant="rounded"
                width={90}
                height={38}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "8px" }}
              />
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Table Row Skeleton
 */
export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <TableRow key={`tbl-skel-row-${rIdx}`} sx={{ "& td": { py: 2 } }}>
          {Array.from({ length: columns }).map((_, cIdx) => (
            <TableCell key={`tbl-skel-cell-${rIdx}-${cIdx}`}>
              <Skeleton
                variant="text"
                height={22}
                width={cIdx === 0 ? "80%" : cIdx === columns - 1 ? 60 : `${55 + ((cIdx * 17) % 35)}%`}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "6px" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/**
 * Approval Card Skeleton
 */
export function ApprovalCardSkeleton({ count = 4 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} md={6} key={`approval-skel-${i}`}>
          <Card sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Skeleton
                variant="rounded"
                height={24}
                width={90}
                animation="wave"
                sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
              />
              <Skeleton
                variant="rounded"
                height={24}
                width={120}
                animation="wave"
                sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
              />
            </Stack>

            <Skeleton
              variant="text"
              height={30}
              width="75%"
              animation="wave"
              sx={{ borderRadius: "6px", bgcolor: SKELETON_BG, mb: 1 }}
            />
            <Skeleton
              variant="text"
              height={18}
              width="50%"
              animation="wave"
              sx={{ borderRadius: "4px", bgcolor: SKELETON_BG, mb: 2 }}
            />

            <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
              <Skeleton
                variant="rounded"
                height={26}
                width={80}
                animation="wave"
                sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
              />
              <Skeleton
                variant="rounded"
                height={26}
                width={100}
                animation="wave"
                sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
              />
              <Skeleton
                variant="rounded"
                height={26}
                width={70}
                animation="wave"
                sx={{ borderRadius: "6px", bgcolor: SKELETON_BG }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Skeleton
                variant="rounded"
                height={38}
                width={95}
                animation="wave"
                sx={{ borderRadius: "10px", bgcolor: SKELETON_BG }}
              />
              <Skeleton
                variant="rounded"
                height={38}
                width={95}
                animation="wave"
                sx={{ borderRadius: "10px", bgcolor: SKELETON_BG }}
              />
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * List Item Skeleton
 */
export function ListItemSkeleton({ count = 5 }) {
  return (
    <Stack spacing={1.35}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={`list-skel-${i}`}
          sx={{
            borderRadius: "18px",
            border: "1px solid rgba(15,23,42,0.08)",
            p: 2,
            background: "#FFFFFF",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
            <Stack direction="row" spacing={1.8} alignItems="center">
              <Skeleton
                variant="circular"
                width={46}
                height={46}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, flexShrink: 0 }}
              />
              <Box sx={{ minWidth: 160 }}>
                <Skeleton
                  variant="text"
                  width={140}
                  height={24}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "6px" }}
                />
                <Skeleton
                  variant="text"
                  width={190}
                  height={16}
                  animation="wave"
                  sx={{ bgcolor: SKELETON_BG, borderRadius: "4px", mt: 0.5 }}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Skeleton
                variant="rounded"
                width={80}
                height={26}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "8px" }}
              />
              <Skeleton
                variant="rounded"
                width={90}
                height={26}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "8px" }}
              />
              <Skeleton
                variant="rounded"
                width={70}
                height={34}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "10px" }}
              />
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

/**
 * Form Skeleton
 */
export function FormSkeleton({ title = "Loading form details..." }) {
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Skeleton
              variant="text"
              width={240}
              height={36}
              animation="wave"
              sx={{ bgcolor: SKELETON_BG, borderRadius: "6px" }}
            />
            <Skeleton
              variant="text"
              width={160}
              height={20}
              animation="wave"
              sx={{ bgcolor: SKELETON_BG, borderRadius: "4px", mt: 0.5 }}
            />
          </Box>
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
            animation="wave"
            sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
          />
        </Stack>

        <Card sx={{ borderRadius: "22px", border: "1px solid rgba(15,23,42,0.08)", p: 3 }}>
          <Skeleton
            variant="text"
            width={180}
            height={26}
            animation="wave"
            sx={{ bgcolor: SKELETON_BG, borderRadius: "6px", mb: 2 }}
          />
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ borderRadius: "22px", border: "1px solid rgba(15,23,42,0.08)", p: 3 }}>
          <Skeleton
            variant="text"
            width={160}
            height={26}
            animation="wave"
            sx={{ bgcolor: SKELETON_BG, borderRadius: "6px", mb: 2 }}
          />
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Skeleton
                variant="rounded"
                height={52}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Skeleton
                variant="rounded"
                height={96}
                animation="wave"
                sx={{ bgcolor: SKELETON_BG, borderRadius: "12px" }}
              />
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Box>
  );
}

export default CardSkeletonGrid;
