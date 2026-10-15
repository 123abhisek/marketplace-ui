import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { initiateBooking } from "../services/bookingService";
import { useAppState } from "../hooks/useAppState";

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
  const { user } = useAppState();

  const isPremium = Boolean(
    user?.isPremium ||
    user?.is_premium ||
    user?.role === "premium" ||
    user?.role === "admin" ||
    user?.role === "seller" ||
    user?.is_admin ||
    user?.isAdmin
  );

  const [loading, setLoading] = useState(false);
  const [lastBooked, setLastBooked] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const finalPropertyId = propertyId || property?.id || null;
  const finalVehicleId = vehicleId || vehicle?.id || null;

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

  const handleBookNow = async () => {
    if (!user) {
      showToast("Please log in to book this listing.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (!isPremium) {
      showToast("Booking is reserved for Premium members. Please upgrade your plan.", "error");
      setTimeout(() => navigate("/subscription"), 1000);
      return;
    }

    if (isInvalidProps) {
      showToast("Pass either propertyId or vehicleId", "error");
      return;
    }

    try {
      setLoading(true);

      const validAmount = Number(amount || property?.price || vehicle?.price || 1) || 1;

      const result = await initiateBooking({
        property_id: finalPropertyId,
        vehicle_id: finalVehicleId,
        amount: validAmount,
      });

      setLastBooked(true);
      showToast(result?.message || "Booking confirmed successfully!", "success");

      onSuccess?.(result);
    } catch (error) {
      const message = error?.message || error?.detail || "Booking failed. Please try again.";
      showToast(message, "error");
      onError?.(error);
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
        onClick={handleBookNow}
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
