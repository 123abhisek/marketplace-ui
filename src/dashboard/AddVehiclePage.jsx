
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import SaveRoundedIcon           from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon      from '@mui/icons-material/ArrowBackRounded'
// import { FormInput }             from '../components/FormInput'
// import { ImageUploader }         from '../components/ImageUploader'
// import { PremiumLockCard }       from '../components/PremiumLockCard'
import { useAppState }           from '../hooks/useAppState'
import { extractError }          from '../utils/mappers'
import { filesToBase64, revokePreviewUrls } from '../utils/imageUtils'
import FormInput from '../components/FormInput'
import ImageUploader from '../components/ImageUploader'
import PremiumLockCard from '../components/PremiumLockCard'

// ─────────────────────────────────────────────────────────────────────────────
// Section header sub-component
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box
          sx={{
            width: 34, height: 34, borderRadius: '10px',
            background: '#F5F3FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7C3AED', flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={800} sx={{ color: '#1E293B', fontSize: '0.95rem' }}>
          {title}
        </Typography>
      </Stack>
      {description && (
        <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', ml: '46px' }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function AddVehiclePage() {
  const { user, addVehicle } = useAppState()
  const navigate = useNavigate()

  // files: array of { file: File, preview: string } — shape set by ImageUploader
  const [files, setFiles]           = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError]     = useState('')
  const [imageError, setImageError] = useState('')

  // Bug Fix 1 — use a ref so the unmount cleanup always sees the *latest* files,
  // not the stale closure captured at mount time.
  const filesRef = useRef(files)
  useEffect(() => { filesRef.current = files }, [files])

  // Revoke blob preview URLs only on unmount (empty deps = runs once on unmount)
  useEffect(() => {
    return () => revokePreviewUrls(filesRef.current.map(f => f.preview))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title:          '',
      vehicleNumber:  '',
      brand:          '',
      model:          '',
      year:           '',
      state:          '',
      rtoCode:        '',
      kmDriven:       '',
      location:       '',
      expectedPrice:  '',
      contactNumber:  '',
    },
  })

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    // Bug Fix 6 — block non-premium submit even via keyboard (Enter key)
    if (user.role != "admin") {
      notify("Only admins are allowed to post listings", "warning");
      return;
    }

    // Bug Fix 3 — require at least one image
    if (files.length === 0) {
      setImageError('Please upload at least one photo of the vehicle.')
      return
    }

    setImageError('')
    setApiError('')
    setSubmitting(true)

    try {
      // Bug Fix 2 — safely extract the raw File object.
      // ImageUploader stores { file: File, preview: string }.
      // Guard against plain File objects too (defensive).
      const rawFiles = files
        .map(f => (typeof f === 'object' && f.file instanceof File ? f.file : f))
        .filter(Boolean)

      const base64Images = await filesToBase64(rawFiles)

      const ok = await addVehicle({ ...data, images: base64Images })
      if (ok) navigate('/dashboard/my-listings')
    } catch (err) {
      setApiError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  // Bug Fix 4 — clear errors when user cancels / navigates away
  const handleCancel = () => {
    setApiError('')
    setImageError('')
    navigate(-1)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Stack spacing={3}>

      {/* ── Page header ── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Add Vehicle
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            List your second-hand vehicle for sale
          </Typography>
        </Box>

        {/* <Chip
          label={user.isPremium ? 'Posting Enabled' : 'Premium Required'}
          size="small"
          sx={{
            ml: 'auto', fontWeight: 700, border: 'none',
            background: user.isPremium ? '#ECFDF5' : '#FEF3C7',
            color:      user.isPremium ? '#059669' : '#D97706',
          }}
        /> */}
      </Stack>

      {/* Premium gate card */}
      {/* {!user.isPremium && <PremiumLockCard />} */}

      {/* API error */}
      {apiError && (
        <Alert
          severity="error"
          onClose={() => setApiError('')}
          sx={{ borderRadius: '14px', fontSize: '0.85rem' }}
        >
          {apiError}
        </Alert>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>

          {/* ── Section 1: Vehicle Identity ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
                title="Vehicle Identity"
                description="Registration number, brand, model, and year"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>

                <Grid item xs={12}>
                  <FormInput
                    name="title"
                    label="Listing Title"
                    control={control}
                    rules={{ required: 'Title is required' }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="vehicleNumber"
                    label="Vehicle Registration Number"
                    control={control}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="brand"
                    label="Brand (e.g. Hyundai)"
                    control={control}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormInput
                    name="model"
                    label="Model (e.g. i20)"
                    control={control}
                  />
                </Grid>

                {/* Bug Fix 5 — year numeric + range validation */}
                <Grid item xs={12} sm={4}>
                  <FormInput
                    name="year"
                    label="Year of Manufacture"
                    control={control}
                    rules={{
                      validate: v => {
                        if (!v) return true // optional field
                        const n = parseInt(String(v).trim(), 10)
                        if (isNaN(n) || n < 1900 || n > new Date().getFullYear())
                          return `Enter a valid year between 1900 and ${new Date().getFullYear()}`
                        return true
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormInput
                    name="rtoCode"
                    label="RTO Code (e.g. KA03)"
                    control={control}
                  />
                </Grid>

              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 2: Usage & Location ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🚦</span>}
                title="Usage & Location"
                description="Odometer reading, registered state, and current location"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>

                {/* Bug Fix 5 — kmDriven numeric validation */}
                <Grid item xs={12} sm={4}>
                  <FormInput
                    name="kmDriven"
                    label="KM Driven"
                    control={control}
                    rules={{
                      validate: v => {
                        if (!v) return true // optional field
                        const n = parseFloat(String(v).trim())
                        if (isNaN(n) || n < 0)
                          return 'Enter a valid KM reading (e.g. 45000)'
                        return true
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormInput name="state" label="State" control={control} />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormInput name="location" label="City / Area" control={control} />
                </Grid>

              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 3: Pricing & Contact ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Price & Contact"
                description="Asking price and seller contact number"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="expectedPrice"
                    label="Asking Price"
                    control={control}
                    rules={{
                      required: 'Price is required',
                      validate: v => {
                        const n = parseFloat(String(v ?? '').trim())
                        if (isNaN(n) || n <= 0)
                          return 'Price must be a valid number greater than 0'
                        return true
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="contactNumber"
                    label="Contact Number"
                    control={control}
                    rules={{
                      required: 'Contact is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit mobile number',
                      },
                    }}
                  />
                </Grid>

              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 4: Photos ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📷</span>}
                title="Vehicle Photos"
                description="Upload exterior and interior photos — drag & drop supported"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />

              {/* Bug Fix 3 — show image validation error */}
              {imageError && (
                <Alert
                  severity="warning"
                  onClose={() => setImageError('')}
                  sx={{ mb: 2, borderRadius: '12px', fontSize: '0.83rem' }}
                >
                  {imageError}
                </Alert>
              )}

              <ImageUploader
                value={files}
                onChange={newFiles => {
                  setFiles(newFiles)
                  if (newFiles.length > 0) setImageError('')
                }}
                label="Upload Vehicle Photos"
              />
            </CardContent>
          </Card>

          {/* ── Submit row ── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={handleCancel}
              sx={{
                borderRadius: '12px', fontWeight: 700, color: '#64748B',
                '&:hover': { background: '#F1F5F9' },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!user.role || submitting}
              startIcon={
                submitting
                  ? <CircularProgress size={16} color="inherit" />
                  : <SaveRoundedIcon />
              }
              sx={{
                borderRadius: '12px', fontWeight: 800, px: 4,
                background: 'linear-gradient(135deg, #7C3AED 0%, #4361EE 100%)',
                boxShadow: '0 4px 16px rgba(124,58,237,0.30)',
                '&:hover': { boxShadow: '0 6px 24px rgba(124,58,237,0.40)' },
                '&.Mui-disabled': { opacity: 0.55, background: '#CBD5E1' },
              }}
            >
              {submitting ? 'Posting…' : 'Post Vehicle Listing'}
            </Button>
          </Box>

        </Stack>
      </form>
    </Stack>
  )
}