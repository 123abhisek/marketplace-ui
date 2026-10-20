import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { initiateBooking } from "../services/bookingService";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";

export default function BookNowButton({
  propertyId,
  vehicleId,
  property,
  vehicle,
  amount,
  label = "Book a Site Visit",
  disabled = false,
  bookingStatusLoading = false,
  onSuccess,
  onError,
}) {
  const navigate = useNavigate();
  const { user, notify } = useAppState();

  const isPremium = Boolean(
    user?.isPremium ||
    user?.is_premium ||
    user?.role === "premium" ||
    user?.role === "admin" ||
    user?.role === "seller" ||
    user?.is_admin ||
    user?.isAdmin
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastBooked, setLastBooked] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const finalPropertyId = propertyId || property?.id || null;
  const finalVehicleId = vehicleId || vehicle?.id || null;
  const isVehicle = Boolean(finalVehicleId);

  const listingTitle =
    property?.title ||
    vehicle?.title ||
    (isVehicle ? "Vehicle Listing" : "Property Listing");
  const listingLocation = property?.location || vehicle?.location || "";
  const listingPrice = property?.price ?? vehicle?.price;

  const isInvalidProps = useMemo(() => {
    if (!finalPropertyId && !finalVehicleId) return true;
    if (finalPropertyId && finalVehicleId) return true;
    return false;
  }, [finalPropertyId, finalVehicleId]);

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Step 1: When user clicks Book button -> show confirmation modal first
  const handleOpenConfirm = () => {
    if (!user) {
      showToast("Please log in to book this listing.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (!isPremium) {
      showToast(
        "Booking is reserved for Premium members. Please upgrade your plan.",
        "error"
      );
      setTimeout(() => navigate("/subscription"), 1000);
      return;
    }

    if (isInvalidProps) {
      showToast("Pass either propertyId or vehicleId", "error");
      return;
    }

    setConfirmOpen(true);
  };

  // Step 2: When user confirms YES in dialog -> initiate booking
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      const validAmount =
        Number(amount || property?.price || vehicle?.price || 1) || 1;

      const result = await initiateBooking({
        property_id: finalPropertyId,
        vehicle_id: finalVehicleId,
        amount: validAmount,
      });

      setLastBooked(true);
      setBookingResult(result);
      setConfirmOpen(false);
      setSuccessDialogOpen(true);

      const successMsg =
        result?.message ||
        `Successfully booked ${isVehicle ? "vehicle inspection" : "property site visit"}!`;
      showToast(successMsg, "success");
      if (notify) {
        notify(successMsg, "success");
      }

      onSuccess?.(result);
    } catch (error) {
      const message =
        error?.message || error?.detail || "Booking failed. Please try again.";
      showToast(message, "error");
      if (notify) {
        notify(message, "error");
      }
      onError?.(error);
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading
    ? "Processing..."
    : lastBooked
      ? `${label} Again`
      : label;

  if (bookingStatusLoading) {
    return (
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={52}
        sx={{
          borderRadius: "12px",
          transform: "none",
        }}
      />
    );
  }

  if (!isPremium) {
    return (
      <Button
        fullWidth
        variant="outlined"
        onClick={() => navigate("/subscription")}
        startIcon={<LockRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: "12px",
          py: 1.45,
          fontWeight: 800,
          fontSize: "0.95rem",
          textTransform: "none",
          borderColor: "rgba(15,118,110,0.35)",
          color: "#0f766e",
          background: "rgba(15,118,110,0.04)",
          "&:hover": {
            borderColor: "#0f766e",
            background: "rgba(15,118,110,0.08)",
          },
        }}
      >
        {label} (Premium Only)
      </Button>
    );
  }

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        onClick={handleOpenConfirm}
        disabled={disabled || loading || isInvalidProps}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
          )
        }
        sx={{
          borderRadius: "12px",
          py: 1.45,
          fontWeight: 800,
          fontSize: "0.95rem",
          textTransform: "none",
          background: "linear-gradient(135deg, #0f766e, #0d9488)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(15,118,110,0.28)",
          "&:hover": {
            background: "linear-gradient(135deg, #0a5c55, #0f766e)",
          },
          "&.Mui-disabled": {
            background: "#cbd5e1",
            color: "#64748b",
            boxShadow: "none",
          },
        }}
      >
        {buttonText}
      </Button>

      {lastBooked && (
        <Alert
          severity="success"
          sx={{
            mt: 1.2,
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Booking confirmed. You can book again anytime if needed.
        </Alert>
      )}

      {/* ── Confirmation Dialog (Yes or No) ── */}
      <Dialog
        open={confirmOpen}
        onClose={() => !loading && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.16)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            pb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: isVehicle
                  ? "rgba(37, 99, 235, 0.1)"
                  : "rgba(15, 118, 110, 0.1)",
                color: isVehicle ? "#2563EB" : "#0F766E",
                display: "grid",
                placeItems: "center",
              }}
            >
              {isVehicle ? (
                <DirectionsCarRoundedIcon />
              ) : (
                <HomeWorkRoundedIcon />
              )}
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#0F172A" }}
            >
              Confirm Booking
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={() => setConfirmOpen(false)}
            disabled={loading}
            sx={{ color: "#94A3B8" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, py: 1.5 }}>
          <Typography
            sx={{
              color: "#475569",
              fontSize: "0.92rem",
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            Are you sure you want to book a{" "}
            <strong>
              {isVehicle ? "vehicle inspection" : "site visit"}
            </strong>{" "}
            for this listing?
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "14px",
              bgcolor: "#F8FAFC",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <Typography
              sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}
              noWrap
            >
              {listingTitle}
            </Typography>

            {listingLocation && (
              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                sx={{ mt: 0.8, color: "#64748B" }}
              >
                <LocationOnRoundedIcon
                  sx={{ fontSize: 16, color: "#94A3B8" }}
                />
                <Typography
                  sx={{ fontSize: "0.82rem", fontWeight: 600 }}
                  noWrap
                >
                  {listingLocation}
                </Typography>
              </Stack>
            )}

            {listingPrice !== undefined && listingPrice !== null && (
              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                sx={{ mt: 0.8, color: "#0F766E" }}
              >
                <CurrencyRupeeRoundedIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 800 }}>
                  {formatCurrency(listingPrice)}
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 1.5, borderColor: "rgba(15, 23, 42, 0.06)" }} />

            <Stack direction="row" spacing={1} alignItems="flex-start">
              <VerifiedUserRoundedIcon
                sx={{ fontSize: 18, color: "#0F766E", mt: 0.2 }}
              />
              <Typography
                sx={{
                  fontSize: "0.76rem",
                  color: "#64748B",
                  lineHeight: 1.45,
                }}
              >
                Our on-ground executive will coordinate with you and the seller
                to schedule the visit.
              </Typography>
            </Stack>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={loading}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              py: 1,
              color: "#64748B",
              borderColor: "rgba(15, 23, 42, 0.16)",
              "&:hover": {
                borderColor: "#94A3B8",
                bgcolor: "#F8FAFC",
              },
            }}
          >
            No, Cancel
          </Button>

          <Button
            onClick={handleConfirmBooking}
            disabled={loading}
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircleRoundedIcon />
              )
            }
            sx={{
              flex: 1.2,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.88rem",
              py: 1,
              bgcolor: "#0F766E",
              color: "#FFFFFF",
              boxShadow: "0 4px 14px rgba(15, 118, 110, 0.3)",
              "&:hover": {
                bgcolor: "#0D6B63",
              },
            }}
          >
            {loading ? "Booking..." : "Yes, Book Now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Successful Booking Dialog Box ── */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 1.5,
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          },
        }}
      >
        <DialogContent sx={{ px: 2, pt: 3, pb: 2 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "rgba(16, 185, 129, 0.12)",
              color: "#10B981",
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 0 0 10px rgba(16, 185, 129, 0.06)",
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#0F172A", mb: 1 }}
          >
            Booking Confirmed!
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              mb: 2.5,
              px: 1,
            }}
          >
            Your {isVehicle ? "vehicle inspection" : "property site visit"} has
            been successfully booked. Our on-ground support team and the seller
            have been notified.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "14px",
              bgcolor: "#F8FAFC",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.74rem",
                fontWeight: 800,
                color: "#94A3B8",
                textTransform: "uppercase",
              }}
            >
              Listing
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "0.92rem",
                color: "#0F172A",
                mt: 0.2,
              }}
              noWrap
            >
              {listingTitle}
            </Typography>

            {bookingResult?.booking_id && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 1.2 }}
              >
                <Typography sx={{ fontSize: "0.78rem", color: "#64748B" }}>
                  Booking Ref:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#0F766E",
                    fontFamily: "monospace",
                  }}
                >
                  {bookingResult.booking_id}
                </Typography>
              </Stack>
            )}

            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              sx={{ mt: 1.2, color: "#64748B" }}
            >
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: "#0F766E" }}
              />
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>
                Status: Live & Scheduled
              </Typography>
            </Stack>
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{ px: 2, pb: 2, pt: 0, flexDirection: "column", gap: 1 }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setSuccessDialogOpen(false);
              navigate("/dashboard/my-bookings");
            }}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.92rem",
              py: 1.2,
              bgcolor: "#0F766E",
              color: "#FFFFFF",
              boxShadow: "0 8px 20px rgba(15, 118, 110, 0.25)",
              "&:hover": { bgcolor: "#0D6B63" },
            }}
          >
            View My Bookings
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setSuccessDialogOpen(false)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              py: 1,
              color: "#64748B",
              borderColor: "rgba(15, 23, 42, 0.12)",
              "&:hover": { borderColor: "#94A3B8", bgcolor: "#F8FAFC" },
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Toast Notification ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: "12px",
            fontWeight: 700,
            alignItems: "center",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
