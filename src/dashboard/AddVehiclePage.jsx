
// src/dashboard/AddVehiclePage.jsx
import { useState }              from 'react'
import { useForm }               from 'react-hook-form'
import { useNavigate }           from 'react-router-dom'
import {
  Box, Button, Card, CardContent, Chip,
  Divider, Grid, Stack, Typography,
} from '@mui/material'
import DirectionsCarRoundedIcon  from '@mui/icons-material/DirectionsCarRounded'
import SaveRoundedIcon           from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon      from '@mui/icons-material/ArrowBackRounded'
import FormInput                 from '../components/FormInput'
import ImageUploader             from '../components/ImageUploader'
import PremiumLockCard           from '../components/PremiumLockCard'
import { useAppState }           from '../hooks/useAppState'

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7C3AED',
            flexShrink: 0,
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

export default function AddVehiclePage() {
  const { user, addVehicle } = useAppState()
  const navigate = useNavigate()
  const [files, setFiles]         = useState([])
  const [submitting, setSubmitting] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      vehicleNumber: '',
      brand: '',
      model: '',
      year: '',
      state: '',
      rtoCode: '',
      kmDriven: '',
      location: '',
      expectedPrice: '',
      contactNumber: '',
    },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    const ok = addVehicle({
      ...data,
      images: files.map((f) => f.preview),
    })
    setSubmitting(false)
    if (ok) navigate('/dashboard/my-listings')
  }

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: '12px',
            color: '#64748B',
            fontWeight: 700,
            fontSize: '0.82rem',
            '&:hover': { background: '#F1F5F9' },
          }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Add Vehicle
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            List your second-hand vehicle for sale
          </Typography>
        </Box>
        <Chip
          label={user.isPremium ? 'Posting Enabled' : 'Premium Required'}
          size="small"
          sx={{
            ml: 'auto',
            fontWeight: 700,
            background: user.isPremium ? '#ECFDF5' : '#FEF3C7',
            color: user.isPremium ? '#059669' : '#D97706',
            border: 'none',
          }}
        />
      </Stack>

      {!user.isPremium && <PremiumLockCard />}

      <form onSubmit={handleSubmit(onSubmit)}>
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
                    label="Listing Title *"
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
                  <FormInput name="brand" label="Brand (e.g. Hyundai)" control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="model" label="Model (e.g. i20)" control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="year"  label="Year of Manufacture"  control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="rtoCode" label="RTO Code (e.g. KA03)" control={control} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 2: Usage & Location ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📍</span>}
                title="Usage & Location"
                description="Odometer reading, registered state, and current location"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <FormInput name="kmDriven" label="KM Driven" control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="state"    label="State"     control={control} />
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
                    label="Asking Price (₹) *"
                    control={control}
                    rules={{ required: 'Price is required' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="contactNumber"
                    label="Contact Number *"
                    control={control}
                    rules={{ required: 'Contact is required' }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 4: Photos ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🚗</span>}
                title="Vehicle Photos"
                description="Upload exterior and interior photos (drag & drop supported)"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <ImageUploader value={files} onChange={setFiles} label="Upload Vehicle Photos" />
            </CardContent>
          </Card>

          {/* ── Submit ── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => navigate(-1)}
              sx={{ borderRadius: '12px', fontWeight: 700, color: '#64748B', '&:hover': { background: '#F1F5F9' } }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!user.isPremium || submitting}
              startIcon={<SaveRoundedIcon />}
              sx={{
                borderRadius: '12px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7C3AED 0%, #4361EE 100%)',
                boxShadow: '0 4px 16px rgba(124,58,237,0.30)',
                px: 4,
                '&:hover': { boxShadow: '0 6px 24px rgba(124,58,237,0.40)' },
                '&.Mui-disabled': { opacity: 0.55, background: '#CBD5E1' },
              }}
            >
              {submitting ? 'Submitting...' : 'Post Vehicle Listing'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}