
// src/pages/RegisterPage.jsx
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import MarkunreadMailboxRoundedIcon from "@mui/icons-material/MarkunreadMailboxRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { useAppState } from "../hooks/useAppState";
import { extractError } from "../utils/mappers";

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    label: "Profile",
    sublabel: "Photo & identity",
    icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
  },
  {
    label: "Location",
    sublabel: "Where you are",
    icon: <PlaceRoundedIcon sx={{ fontSize: 16 }} />,
  },
  {
    label: "Account",
    sublabel: "Email & password",
    icon: <LockRoundedIcon sx={{ fontSize: 16 }} />,
  },
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    "& fieldset": { borderColor: "rgba(226,232,240,0.9)" },
    "&:hover fieldset": { borderColor: "#0f766e" },
    "&.Mui-focused fieldset": { borderColor: "#0f766e", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0f766e" },
};

const btnSx = {
  borderRadius: "14px",
  py: 1.5,
  fontWeight: 800,
  fontSize: "0.93rem",
  letterSpacing: "-0.01em",
  background: "linear-gradient(135deg,#0f766e,#0e8e7f)",
  color: "#fff",
  boxShadow: "0 10px 28px rgba(15,118,110,0.26)",
  transition: "all .18s ease",
  "&:hover": {
    background: "linear-gradient(135deg,#0a5c55,#0c7a6e)",
    boxShadow: "0 14px 36px rgba(15,118,110,0.32)",
    transform: "translateY(-1px)",
  },
  "&:active": { transform: "translateY(0)" },
  "&.Mui-disabled": { background: "rgba(15,118,110,0.40)", color: "#fff" },
};

// ─── Password strength ────────────────────────────────────────────────────────
function passwordStrength(pw = "") {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const PW_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const PW_COLORS = ["", "#ef4444", "#f59e0b", "#3b82f6", "#0f766e"];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  return (
    <Stack spacing={2}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
            Step {current + 1} of {STEPS.length}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f766e" }}>
            {Math.round(((current + 1) / STEPS.length) * 100)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((current + 1) / STEPS.length) * 100}
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: "rgba(15,118,110,0.10)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              background: "linear-gradient(90deg,#0f766e,#0e8e7f)",
            },
          }}
        />
      </Box>
      <Stack direction="row" spacing={1}>
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <Stack
              key={step.label}
              direction="row"
              spacing={0.8}
              alignItems="center"
              sx={{
                flex: 1,
                px: 1.3,
                py: 0.8,
                borderRadius: "12px",
                border: active
                  ? "1.5px solid #0f766e"
                  : done
                  ? "1.5px solid rgba(15,118,110,0.25)"
                  : "1.5px solid rgba(226,232,240,0.9)",
                background: active
                  ? "rgba(15,118,110,0.06)"
                  : done
                  ? "rgba(15,118,110,0.03)"
                  : "transparent",
                transition: "all .18s ease",
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done
                    ? "#0f766e"
                    : active
                    ? "rgba(15,118,110,0.12)"
                    : "rgba(226,232,240,0.8)",
                  color: done ? "#fff" : active ? "#0f766e" : "#94a3b8",
                }}
              >
                {done ? (
                  <CheckRoundedIcon sx={{ fontSize: 13 }} />
                ) : (
                  <Typography sx={{ fontSize: "0.67rem", fontWeight: 900, lineHeight: 1 }}>
                    {i + 1}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" }, overflow: "hidden" }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: active || done ? "#0f766e" : "#94a3b8",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

// ─── Reusable controlled field ────────────────────────────────────────────────
function Field({ name, label, control, rules, type = "text", icon, select, options, endAdornment, disabled }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          select={select}
          label={label}
          type={type}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || " "}
          InputProps={{
            startAdornment: icon ? (
              <InputAdornment position="start">
                <Box sx={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>{icon}</Box>
              </InputAdornment>
            ) : undefined,
            endAdornment,
          }}
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
          sx={inputSx}
        >
          {select &&
            options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

// ─── Photo picker ─────────────────────────────────────────────────────────────
function PhotoPicker({ value, onChange, disabled }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ name: file.name, preview: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <Stack alignItems="center" spacing={1.5}>
      <Box
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{ position: "relative", cursor: disabled ? "default" : "pointer", width: 88, height: 88 }}
      >
        <Avatar
          src={value?.preview || undefined}
          sx={{
            width: 88,
            height: 88,
            background: "linear-gradient(135deg,rgba(15,118,110,0.12),rgba(14,77,106,0.12))",
            border: "2px dashed rgba(15,118,110,0.30)",
            fontSize: "2rem",
            color: "#0f766e",
          }}
        >
          {!value?.preview && (
            <CameraAltRoundedIcon sx={{ fontSize: 28, color: "#0f766e", opacity: 0.55 }} />
          )}
        </Avatar>
        {!disabled && (
          <Box
            sx={{
              position: "absolute", bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: "50%",
              background: "#0f766e", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CameraAltRoundedIcon sx={{ fontSize: 13, color: "#fff" }} />
          </Box>
        )}
      </Box>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <Typography sx={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>
        {value?.name ? (
          <span style={{ color: "#0f766e", fontWeight: 700 }}>{value.name}</span>
        ) : (
          "Click to add a profile photo (optional)"
        )}
      </Typography>
    </Stack>
  );
}

// ─── Left brand panel ─────────────────────────────────────────────────────────
function BrandPanel({ step }) {
  const highlights = [
    "Profile photo & personal info",
    "Location for relevant listings",
    "Secure account credentials",
  ];
  const perks = [
    { icon: <HomeWorkRoundedIcon sx={{ fontSize: 16 }} />, text: "Browse property listings" },
    { icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 16 }} />, text: "Upgrade to Premium for ₹299" },
    { icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />, text: "Post your own listings" },
  ];

  return (
    <Box
      sx={{
        flex: "0 0 44%",
        position: "relative",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        p: "48px 44px",
        background: "linear-gradient(155deg,#1e1b4b 0%,#0e4d6a 45%,#0f766e 100%)",
        overflow: "hidden",
      }}
    >
      {[
        { top: -90, right: -70, size: 280, opacity: 0.1 },
        { bottom: -60, left: -50, size: 240, opacity: 0.09 },
        { top: "42%", right: -30, size: 160, opacity: 0.07 },
      ].map((b, i) => (
        <Box
          key={i}
          aria-hidden
          sx={{
            position: "absolute",
            width: b.size, height: b.size,
            top: b.top ?? "auto", bottom: b.bottom ?? "auto",
            left: b.left ?? "auto", right: b.right ?? "auto",
            borderRadius: "50%",
            background: `rgba(255,255,255,${b.opacity})`,
            filter: "blur(2px)", pointerEvents: "none",
          }}
        />
      ))}

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: "14px",
            background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <HomeWorkRoundedIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", color: "#fff", letterSpacing: "-0.02em" }}>
          MarketPlus
        </Typography>
      </Stack>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{ fontWeight: 900, fontSize: "2rem", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em", mb: 1.5 }}
        >
          Join India's<br />fastest-growing<br />marketplace
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: "0.88rem", lineHeight: 1.72, maxWidth: 300 }}>
          Create your free account in 3 quick steps and start browsing thousands of property and vehicle listings today.
        </Typography>
      </Box>

      <Stack spacing={1.2} sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: "0.71rem", fontWeight: 800, color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase", letterSpacing: "0.09em", mb: 0.4,
          }}
        >
          3 steps to get started
        </Typography>
        {highlights.map((text, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <Stack key={i} direction="row" spacing={1.3} alignItems="center">
              <Box
                sx={{
                  width: 26, height: 26, borderRadius: "8px", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "#0f766e" : active ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)",
                  border: active ? "1.5px solid rgba(255,255,255,0.40)" : "1px solid transparent",
                  transition: "all .22s ease",
                }}
              >
                {done ? (
                  <CheckRoundedIcon sx={{ fontSize: 14, color: "#fff" }} />
                ) : (
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 900, color: active ? "#fff" : "rgba(255,255,255,0.35)" }}>
                    {i + 1}
                  </Typography>
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.84rem", fontWeight: active ? 700 : 500,
                  color: done || active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.42)",
                  transition: "color .22s ease",
                }}
              >
                {text}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      <Stack spacing={1.1} sx={{ position: "relative", zIndex: 1, pt: 2, borderTop: "1px solid rgba(255,255,255,0.11)" }}>
        {perks.map((p, i) => (
          <Stack key={i} direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 30, height: 30, borderRadius: "9px", flexShrink: 0,
                background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {p.icon}
            </Box>
            <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
              {p.text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const { register: registerUser } = useAppState();
  const navigate = useNavigate();

  const { control, handleSubmit, trigger, watch, getValues } = useForm({
    defaultValues: {
      name: "",
      gender: "",
      dob: "",
      occupation: "",
      location: "",
      state: "",
      city: "",
      pincode: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const pwValue = watch("password");
  const pwScore = passwordStrength(pwValue);

  const STEP_FIELDS = {
    0: ["name"],
    1: ["location", "state", "city"],
    2: ["email", "mobile", "password", "confirmPassword"],
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data) => {
    setApiErr("");
    setLoading(true);
    try {
      await registerUser({
        name:       (data.name       || "").trim(),
        email:      (data.email      || "").trim(),
        password:   data.password,
        mobile:     data.mobile,
        gender:     data.gender      || "",
        dob:        data.dob         || null,
        occupation: data.occupation  || "",
        location:   data.location    || "",
        state:      data.state       || "",
        city:       data.city        || "",
        pincode:    data.pincode     || "",
        photo:      photo?.preview   || "",
      });
      navigate("/dashboard");
    } catch (err) {
      setApiErr(extractError(err));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // ── Step panels — ALL rendered always, hidden with display:none ──────────────
  // This keeps all fields mounted so react-hook-form never loses their values.
  const step0 = (
    <Stack spacing={2}>
      <PhotoPicker value={photo} onChange={setPhoto} disabled={loading} />
      <Field
        name="name" label="Full name" control={control} disabled={loading}
        rules={{
          required: "Full name is required",
          minLength: { value: 2, message: "At least 2 characters" },
          validate: (v) => (v ?? "").trim().length >= 2 || "At least 2 characters",
        }}
        icon={<PersonRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="gender" label="Gender" control={control} select disabled={loading}
        options={[
          { label: "Male",   value: "male"   },
          { label: "Female", value: "female" },
          { label: "Other",  value: "other"  },
        ]}
      />
      <Field
        name="dob" label="Date of birth" control={control} type="date" disabled={loading}
        icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="occupation" label="Occupation" control={control} disabled={loading}
        icon={<WorkRoundedIcon sx={{ fontSize: 18 }} />}
      />
    </Stack>
  );

  const step1 = (
    <Stack spacing={2}>
      <Field
        name="location" label="Address / locality" control={control} disabled={loading}
        rules={{ required: "Location is required" }}
        icon={<PlaceRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="state" label="State" control={control} disabled={loading}
        rules={{ required: "State is required" }}
        icon={<LocationCityRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="city" label="City" control={control} disabled={loading}
        rules={{ required: "City is required" }}
        icon={<LocationCityRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="pincode" label="Pincode" control={control} disabled={loading}
        rules={{
          pattern: { value: /^[1-9][0-9]{5}$/, message: "Enter a valid 6-digit pincode" },
        }}
        icon={<MarkunreadMailboxRoundedIcon sx={{ fontSize: 18 }} />}
      />
    </Stack>
  );

  const step2 = (
    <Stack spacing={2}>
      <Field
        name="email" label="Email address" control={control} type="email" disabled={loading}
        rules={{
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
        }}
        icon={<EmailRoundedIcon sx={{ fontSize: 18 }} />}
      />
      <Field
        name="mobile" label="Mobile number" control={control} disabled={loading}
        rules={{
          required: "Mobile number is required",
          pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" },
        }}
        icon={<PhoneRoundedIcon sx={{ fontSize: 18 }} />}
      />

      <Box>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              disabled={loading}
              error={!!fieldState.error}
              helperText={fieldState.error?.message || " "}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" disabled={loading} onClick={() => setShowPw((p) => !p)} sx={{ color: "#94a3b8" }}>
                      {showPw ? <VisibilityOffRoundedIcon sx={{ fontSize: 17 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 17 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          )}
        />
        {pwValue && (
          <Stack spacing={0.5} sx={{ mt: -0.5 }}>
            <LinearProgress
              variant="determinate"
              value={(pwScore / 4) * 100}
              sx={{
                height: 4, borderRadius: 999,
                backgroundColor: "rgba(226,232,240,0.8)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  backgroundColor: PW_COLORS[pwScore] || "#94a3b8",
                  transition: "background-color .25s ease",
                },
              }}
            />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: PW_COLORS[pwScore] || "#94a3b8" }}>
              {PW_LABELS[pwScore]}
            </Typography>
          </Stack>
        )}
      </Box>

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Please confirm your password",
          validate: (val) => val === getValues("password") || "Passwords do not match",
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label="Confirm password"
            type={showCpw ? "text" : "password"}
            autoComplete="new-password"
            disabled={loading}
            error={!!fieldState.error}
            helperText={fieldState.error?.message || " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" disabled={loading} onClick={() => setShowCpw((p) => !p)} sx={{ color: "#94a3b8" }}>
                    {showCpw ? <VisibilityOffRoundedIcon sx={{ fontSize: 17 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 17 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        )}
      />
    </Stack>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "#f1f5f9" }}>
      <BrandPanel step={step} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: "32px 20px", sm: "48px 32px", md: "48px 56px" },
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 4, display: { md: "none" } }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "12px", background: "#0f766e",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <HomeWorkRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#0f172a" }}>
            MarketPlus
          </Typography>
        </Stack>

        <Box sx={{ width: "100%", maxWidth: 460 }}>
          {/* Page header */}
          <Box sx={{ mb: 3.5 }}>
            <Chip
              label={`Step ${step + 1} — ${STEPS[step].label}`}
              size="small"
              sx={{
                mb: 1.4, height: 27, borderRadius: "999px",
                fontWeight: 800, fontSize: "0.71rem",
                background: "rgba(15,118,110,0.09)", color: "#0f766e",
                border: "1px solid rgba(15,118,110,0.16)",
              }}
            />
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.55rem", sm: "1.85rem" },
                color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.035em", mb: 0.8,
              }}
            >
              {step === 0 && (<>Your profile<br />& identity</>)}
              {step === 1 && (<>Where are<br />you based?</>)}
              {step === 2 && (<>Create your<br />account</>)}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.87rem", lineHeight: 1.65 }}>
              {step === 0 && "Tell us a little about yourself. Your name and photo appear on your listings."}
              {step === 1 && "Your location helps match you with nearby property and vehicle listings."}
              {step === 2 && "Secure your account. Email, phone, and password are required to continue."}
            </Typography>
          </Box>

          <Box sx={{ mb: 3.5 }}>
            <StepIndicator current={step} />
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(226,232,240,0.8)" }} />

          {apiErr && (
            <Box
              sx={{
                mb: 2.5, px: 2, py: 1.5, borderRadius: "12px",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.20)",
              }}
            >
              <Typography sx={{ fontSize: "0.83rem", color: "#dc2626", fontWeight: 700 }}>
                {apiErr}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* ── KEY FIX: render all steps always, hide with display:none ── */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: step === 0 ? "block" : "none" }}>{step0}</Box>
              <Box sx={{ display: step === 1 ? "block" : "none" }}>{step1}</Box>
              <Box sx={{ display: step === 2 ? "block" : "none" }}>{step2}</Box>
            </Box>

            <Stack direction="row" spacing={1.5}>
              {step > 0 && (
                <Button
                  onClick={prevStep}
                  variant="outlined"
                  disabled={loading}
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{
                    borderRadius: "14px", py: 1.4, px: 2.5,
                    fontWeight: 700, fontSize: "0.88rem",
                    borderColor: "rgba(226,232,240,0.9)", color: "#475569",
                    "&:hover": { borderColor: "#0f766e", color: "#0f766e", background: "rgba(15,118,110,0.03)" },
                  }}
                >
                  Back
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button onClick={nextStep} fullWidth disabled={loading} endIcon={<ArrowForwardRoundedIcon />} sx={btnSx}>
                  Continue to {STEPS[step + 1].label}
                </Button>
              ) : (
                <Button
                  type="submit" fullWidth disabled={loading}
                  endIcon={loading ? <CircularProgress size={17} color="inherit" /> : <CheckRoundedIcon />}
                  sx={btnSx}
                >
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              )}
            </Stack>
          </form>

          <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              Already have an account?
            </Typography>
            <Box
              component={RouterLink}
              to="/login"
              sx={{
                fontSize: "0.82rem", color: "#0f766e", fontWeight: 700,
                textDecoration: "none", "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign in
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}