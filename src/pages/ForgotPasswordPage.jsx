// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Helmet } from "react-helmet-async";
import { authService } from "../services/api";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#f8fafc",
    "& fieldset": { borderColor: "rgba(226,232,240,0.9)" },
    "&:hover fieldset": { borderColor: "#0f766e" },
    "&.Mui-focused fieldset": { borderColor: "#0f766e", borderWidth: "1.5px" },
  },
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleVerifyEmail = async (data) => {
    setApiError("");
    setLoading(true);
    try {
      await authService.forgotPassword({ email: data.email.trim() });
      setVerifiedEmail(data.email.trim());
      setStep(2);
    } catch (err) {
      setApiError(err.message || "Failed to verify email. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }
    setApiError("");
    setLoading(true);
    try {
      await authService.resetPassword({
        email: verifiedEmail,
        new_password: data.newPassword,
      });
      setStep(3);
    } catch (err) {
      setApiError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot / Reset Password | EasyDeal</title>
        <meta name="description" content="Reset your EasyDeal account password." />
      </Helmet>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
          background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f8fafc 100%)",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
            border: "1px solid rgba(226,232,240,0.8)",
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            {/* Header */}
            <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "18px",
                  background: "rgba(15,118,110,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f766e",
                  mb: 1,
                }}
              >
                {step === 3 ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 32, color: "#10b981" }} />
                ) : (
                  <LockResetRoundedIcon sx={{ fontSize: 32 }} />
                )}
              </Box>

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.4rem", sm: "1.7rem" },
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                }}
              >
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Set New Password"}
                {step === 3 && "Password Reset Complete!"}
              </Typography>

              <Typography sx={{ color: "#64748b", fontSize: "0.88rem", maxWidth: 360 }}>
                {step === 1 && "Enter your registered email address to verify your account."}
                {step === 2 && `Enter a new password for ${verifiedEmail}`}
                {step === 3 && "Your password has been updated successfully. You can now login."}
              </Typography>
            </Stack>

            {apiError && (
              <Alert
                severity="error"
                onClose={() => setApiError("")}
                sx={{ mb: 3, borderRadius: "14px", fontSize: "0.85rem" }}
              >
                {apiError}
              </Alert>
            )}

            {/* STEP 1: Verify Email */}
            {step === 1 && (
              <form onSubmit={handleSubmit(handleVerifyEmail)} noValidate>
                <Stack spacing={2.5}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Registered Email"
                        type="email"
                        autoFocus
                        disabled={loading}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailRoundedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      minHeight: 48,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#fff",
                      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                      boxShadow: "0 4px 14px rgba(15,118,110,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Verify & Continue"}
                  </Button>
                </Stack>
              </form>
            )}

            {/* STEP 2: Set New Password */}
            {step === 2 && (
              <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
                <Stack spacing={2.5}>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="New Password"
                        type={showPw ? "text" : "password"}
                        disabled={loading}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockRoundedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setShowPw((p) => !p)}
                                sx={{ color: "#94a3b8" }}
                              >
                                {showPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Please confirm your new password",
                      validate: (v) => v === watch("newPassword") || "Passwords do not match",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm New Password"
                        type={showConfirmPw ? "text" : "password"}
                        disabled={loading}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockRoundedIcon sx={{ fontSize: 19, color: "#94a3b8" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setShowConfirmPw((p) => !p)}
                                sx={{ color: "#94a3b8" }}
                              >
                                {showConfirmPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      minHeight: 48,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#fff",
                      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                      boxShadow: "0 4px 14px rgba(15,118,110,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Update Password"}
                  </Button>
                </Stack>
              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    minHeight: 48,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    color: "#fff",
                    background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                    boxShadow: "0 4px 14px rgba(15,118,110,0.3)",
                  }}
                >
                  Go to Login
                </Button>
              </Stack>
            )}

            <Divider sx={{ my: 3, borderColor: "rgba(226,232,240,0.8)" }} />

            {/* Back link */}
            <Stack direction="row" justifyContent="center">
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: "#64748b",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  "&:hover": { color: "#0f766e", background: "transparent" },
                }}
              >
                Back to Sign in
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
