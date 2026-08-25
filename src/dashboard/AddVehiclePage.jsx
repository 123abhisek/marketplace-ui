
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import SaveRoundedIcon           from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon      from '@mui/icons-material/ArrowBackRounded'
import { useAppState }           from '../hooks/useAppState'
import { extractError }          from '../utils/mappers'
import { filesToBase64, revokePreviewUrls } from '../utils/imageUtils'
import { vehicleService }        from '../services/api'
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
  const { user, addVehicle, notify } = useAppState()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)

  const [files, setFiles]           = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError]     = useState('')
  const [imageError, setImageError] = useState('')
  const [loadingEdit, setLoadingEdit] = useState(isEditMode)

  const filesRef = useRef(files)
  useEffect(() => { filesRef.current = files }, [files])

  useEffect(() => {
    return () => revokePreviewUrls(filesRef.current.map(f => f.preview))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { control, handleSubmit, reset } = useForm({
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

  // Load existing vehicle data when in edit mode
  const loadForEdit = useCallback(async () => {
    if (!editId) return
    setLoadingEdit(true)
    try {
      const res = await vehicleService.getOne(editId)
      const v = res?.data ?? res
      if (v) {
        reset({
          title:          v.title         || '',
          vehicleNumber:  v.vehicle_number || '',
          brand:          v.brand          || '',
          model:          v.model          || '',
          year:           String(v.year    || ''),
          state:          v.state          || '',
          rtoCode:        v.rto_code       || '',
          kmDriven:       String(v.km_driven || ''),
          location:       v.location       || '',
          expectedPrice:  String(v.price   || ''),
          contactNumber:  v.contact        || '',
        })
        if (Array.isArray(v.images) && v.images.length > 0) {
          const existingImgItems = v.images
            .filter(img => img && typeof img === 'string')
            .map(img => ({ file: null, preview: img, existing: true }))
          setFiles(existingImgItems)
        }
      }
    } catch (err) {
      setApiError('Failed to load vehicle for editing: ' + (err?.message || ''))
    } finally {
      setLoadingEdit(false)
    }
  }, [editId, reset])

  useEffect(() => {
    if (isEditMode) loadForEdit()
  }, [isEditMode, loadForEdit])

  // ── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setImageError('')
    setApiError('')

    // ── 40MB File Size Guard ──
    const MAX_SIZE_BYTES = 40 * 1024 * 1024
    const newFiles = files.filter(f => f.file !== null && !f.existing)
    const rawFiles = newFiles
      .map(f => (typeof f === 'object' && f.file instanceof File ? f.file : f))
      .filter(Boolean)

    const oversized = rawFiles.find(f => f.size > MAX_SIZE_BYTES)
    if (oversized) {
      setImageError('Please upload images below 40MB size.')
      return
    }

    setSubmitting(true)

    try {
      const existingUrls = files.filter(f => f.existing).map(f => f.preview)
      const base64Images = await filesToBase64(rawFiles)
      const allImages = [...existingUrls, ...base64Images]


      const payload = {
        title:          data.title,
        brand:          data.brand,
        model:          data.model,
        year:           data.year,
        price:          parseFloat(data.expectedPrice) || 0,
        contact:        data.contactNumber,
        location:       data.location,
        vehicle_number: data.vehicleNumber,
        rto_code:       data.rtoCode,
        km_driven:      data.kmDriven,
        state:          data.state,
        images:         allImages,
      }

      if (isEditMode) {
        await vehicleService.update(editId, payload)
        notify('Vehicle updated successfully! ✏️', 'success')
      } else {
        await addVehicle({ ...data, images: base64Images })
        notify('Vehicle listing posted!', 'success')
      }

      if (user?.role === 'admin') navigate('/admin/listings')
      else if (user?.role === 'seller') navigate('/seller/listings')
      else navigate('/dashboard/my-listings')
    } catch (err) {
      setApiError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setApiError('')
    setImageError('')
    navigate(-1)
  }

  // Show loading spinner while fetching edit data
  if (loadingEdit) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Stack spacing={3}>

      {/* ── Page header ── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            {isEditMode ? '✏️ Edit Vehicle' : 'Add Vehicle'}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            {isEditMode ? 'Update the details for your vehicle listing' : 'List your second-hand vehicle for sale'}
          </Typography>
        </Box>
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
                title="Vehicle Photos (Optional)"
                description="Upload exterior and interior photos (optional) — drag & drop supported"
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
                onSizeError={setImageError}
                label="Upload Vehicle Photos (Optional)"
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
              {submitting
                ? isEditMode ? 'Updating…' : 'Posting…'
                : isEditMode ? '✏️ Update Vehicle' : 'Post Vehicle Listing'}
            </Button>
          </Box>

        </Stack>
      </form>
    </Stack>
  )
}