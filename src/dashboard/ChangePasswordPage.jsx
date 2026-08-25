// src/dashboard/ChangePasswordPage.jsx
import { useState } from "react";
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
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Helmet } from "react-helmet-async";
import { authService } from "../services/api";
import { useAppState } from "../hooks/useAppState";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#f8fafc",
    "& fieldset": { borderColor: "rgba(226,232,240,0.9)" },
    "&:hover fieldset": { borderColor: "#0f766e" },
    "&.Mui-focused fieldset": { borderColor: "#0f766e", borderWidth: "1.5px" },
  },
};

export default function ChangePasswordPage() {
  const { notify } = useAppState();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm({
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setApiError("New passwords do not match");
      return;
    }
    setApiError("");
    setLoading(true);
    try {
      await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      setSuccess(true);
      notify?.("Password changed successfully! 🔒", "success");
      reset();
    } catch (err) {
      setApiError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password | EasyDeal</title>
      </Helmet>

      <Box sx={{ maxWidth: 640, mx: "auto", py: { xs: 2, md: 4 }, px: { xs: 2, sm: 0 } }}>
        <Card
          sx={{
            borderRadius: "24px",
            boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
            border: "1px solid rgba(226,232,240,0.8)",
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  background: "rgba(15,118,110,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f766e",
                  flexShrink: 0,
                }}
              >
                <KeyRoundedIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    color: "#0f172a",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Change Password
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                  Update your account password regularly to keep your account secure
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: "rgba(226,232,240,0.8)" }} />

            {apiError && (
              <Alert
                severity="error"
                onClose={() => setApiError("")}
                sx={{ mb: 3, borderRadius: "14px", fontSize: "0.85rem" }}
              >
                {apiError}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                icon={<CheckCircleRoundedIcon fontSize="inherit" />}
                onClose={() => setSuccess(false)}
                sx={{ mb: 3, borderRadius: "14px", fontSize: "0.85rem" }}
              >
                Your password has been changed successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2.5}>
                <Controller
                  name="currentPassword"
                  control={control}
                  rules={{ required: "Current password is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Current Password"
                      type={showCurrentPw ? "text" : "password"}
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
                              onClick={() => setShowCurrentPw((p) => !p)}
                              sx={{ color: "#94a3b8" }}
                            >
                              {showCurrentPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  )}
                />

                <Controller
                  name="newPassword"
                  control={control}
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "New password must be at least 6 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="New Password"
                      type={showNewPw ? "text" : "password"}
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
                              onClick={() => setShowNewPw((p) => !p)}
                              sx={{ color: "#94a3b8" }}
                            >
                              {showNewPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
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

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      minHeight: 46,
                      px: 3.5,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "#fff",
                      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                      boxShadow: "0 4px 14px rgba(15,118,110,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Save New Password"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
