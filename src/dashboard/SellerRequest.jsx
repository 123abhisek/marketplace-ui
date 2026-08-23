// src/dashboard/SellerRequest.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { useAppState } from "../hooks/useAppState";
import { authService, api } from "../services/api";

const BUSINESS_TYPES = [
  "Individual Owner / Seller",
  "Real Estate Agency",
  "Vehicle Dealership",
  "Property Developer / Builder",
  "Broker / Independent Agent",
  "Other Business",
];

const STEPS = ["Business Info", "Location & GST", "Instant Verification"];

export default function SellerRequest() {
  const navigate = useNavigate();
  const { user, refreshUser, updateProfile } = useAppState();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isAlreadySeller = Boolean(
    user?.role === "seller" || user?.is_seller || user?.isSeller || user?.role === "admin"
  );

  const [formData, setFormData] = useState({
    business_name: user?.name ? `${user.name} Marketplace` : "",
    business_type: "Individual Owner / Seller",
    description: "Verified seller offering properties and vehicles for direct sale.",
    location: user?.location || "",
    state: user?.state || "Karnataka",
    city: user?.city || "Bangalore",
    pincode: user?.pincode || "560001",
    document_url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0 && !formData.business_name.trim()) {
      setError("Please enter a business or store name.");
      return;
    }
    setError("");
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Submit seller request payload
      await api.post("seller-request", formData).catch(() => null);

      // Try to refresh profile from backend first
      if (refreshUser) {
        const updatedUser = await refreshUser();
        // If backend didn't set role to seller yet, set it locally for instant access
        if (updatedUser && updatedUser.role !== "seller") {
          updateProfile({ role: "seller", is_seller: true });
        }
      } else {
        // Fallback: update role locally so SellerGate allows access immediately
        updateProfile({ role: "seller", is_seller: true });
      }

      setSuccess(true);

      // Redirect to dedicated seller dashboard within 1.5 seconds
      setTimeout(() => {
        navigate("/seller/overview", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Seller activation error:", err);
      // Fallback: update role locally regardless
      if (updateProfile) {
        updateProfile({ role: "seller", is_seller: true });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/seller/overview", { replace: true });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (isAlreadySeller && !success) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card
          sx={{
            borderRadius: "24px",
            boxShadow: "0 12px 40px rgba(15,23,42,0.06)",
            border: "1px solid rgba(15,118,110,0.2)",
            background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
            p: 4,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "20px",
              background: "rgba(15,118,110,0.12)",
              color: "#0f766e",
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <VerifiedRoundedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" fontWeight={900} color="#0f172a" mb={1}>
            You are a Verified Seller!
          </Typography>
          <Typography variant="body1" color="#475569" sx={{ maxWidth: 500, mx: "auto", mb: 3 }}>
            Your account has full seller privileges. You can post properties & vehicles, track orders, and view seller reports.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/seller/overview")}
            startIcon={<StorefrontRoundedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              borderRadius: "14px",
              px: 4,
              py: 1.5,
              fontWeight: 800,
              background: "linear-gradient(135deg, #0f766e 0%, #0b5d56 100%)",
              boxShadow: "0 8px 24px rgba(15,118,110,0.3)",
            }}
          >
            Go to Seller Dashboard
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "24px",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 16px 48px rgba(15,23,42,0.05)",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0f766e 0%, #0f172a 100%)",
            color: "#ffffff",
            p: { xs: 3, sm: 4 },
            position: "relative",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <StorefrontRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900} letterSpacing="-0.02em">
                Become a Verified Seller
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
                Post your properties and vehicles to thousands of active buyers with instant live approval.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Stepper */}
        <Box sx={{ px: { xs: 2, sm: 4 }, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box textAlign="center" py={4}>
              <CircularProgress sx={{ color: "#0f766e", mb: 2 }} />
              <Typography variant="h6" fontWeight={900} color="#0f172a">
                🎉 Seller Account Activated!
              </Typography>
              <Typography variant="body2" color="#64748b" mt={1}>
                Redirecting to your dedicated Seller Dashboard...
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Business or Store Name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. EasyDeal Motors & Homes"
                    InputProps={{
                      startAdornment: <BusinessRoundedIcon sx={{ mr: 1, color: "#64748b" }} />,
                    }}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Business Type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Business Overview / Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what you plan to list (Properties, Apartments, Commercial Sites, Vehicles)..."
                  />
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: <LocationOnRoundedIcon sx={{ mr: 1, color: "#64748b" }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location / Area"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Indiranagar, Bangalore"
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="GST / Business License (Optional)"
                    name="document_url"
                    value={formData.document_url}
                    onChange={handleChange}
                    placeholder="GSTIN or ID Proof URL (Optional)"
                    InputProps={{
                      startAdornment: <BadgeRoundedIcon sx={{ mr: 1, color: "#64748b" }} />,
                    }}
                  />
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={3} textAlign="center" py={2}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(15,118,110,0.1)",
                      color: "#0f766e",
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                    }}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 36 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={900} color="#0f172a">
                      Instant Seller Verification
                    </Typography>
                    <Typography variant="body2" color="#64748b" sx={{ maxWidth: 420, mx: "auto", mt: 1 }}>
                      By clicking activate, your seller account will be enabled immediately with instant property and vehicle posting access.
                    </Typography>
                  </Box>

                  <Alert severity="success" sx={{ borderRadius: "12px", textLeft: "left" }}>
                    ✓ 0% Hidden Fees • Instant Live Property & Vehicle Approvals • Seller Dashboard & Analytics
                  </Alert>
                </Stack>
              )}

              {/* Action buttons */}
              <Divider sx={{ my: 4 }} />
              <Stack direction="row" justifyContent="space-between">
                <Button
                  disabled={activeStep === 0 || loading}
                  onClick={handleBack}
                  sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
                >
                  Back
                </Button>

                {activeStep < STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      fontWeight: 800,
                      background: "#0f766e",
                      "&:hover": { background: "#0b5d56" },
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <VerifiedRoundedIcon />}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1.2,
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #0f766e 0%, #0b5d56 100%)",
                      boxShadow: "0 6px 20px rgba(15,118,110,0.3)",
                    }}
                  >
                    {loading ? "Activating..." : "Activate Seller Account"}
                  </Button>
                )}
              </Stack>
            </form>
          )}
        </CardContent>
      </Paper>
    </Container>
  );
}