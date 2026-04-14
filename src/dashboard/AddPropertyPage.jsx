
// src/dashboard/AddPropertyPage.jsx
import { useState }      from 'react'
import { useForm }       from 'react-hook-form'
import { useNavigate }   from 'react-router-dom'
import {
  Alert, Box, Button, Card, CardContent, Chip,
  CircularProgress, Divider, Grid, Stack, Typography,
} from '@mui/material'
import AddHomeRoundedIcon    from '@mui/icons-material/AddHomeRounded'
import SaveRoundedIcon       from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon  from '@mui/icons-material/ArrowBackRounded'
import FormInput             from '../components/FormInput'
import SelectInput           from '../components/SelectInput'
import ImageUploader         from '../components/ImageUploader'
import PremiumLockCard       from '../components/PremiumLockCard'
import { useAppState }       from '../hooks/useAppState'
import { propertyService }   from '../services/api'
import { extractError }      from '../utils/mappers'

const PROPERTY_TYPES = [
  { label: 'Residential',  value: 'Residential' },
  { label: 'Commercial',   value: 'Commercial' },
  { label: 'Agricultural', value: 'Agricultural' },
  { label: 'Site',         value: 'Site' },
  { label: 'Flat',         value: 'Flat' },
]

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box sx={{
          width: 34, height: 34, borderRadius: '10px', background: '#EEF2FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#4361EE', flexShrink: 0,
        }}>
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

export default function AddPropertyPage() {
  const { user, notify }    = useAppState()
  const navigate            = useNavigate()
  const [files,     setFiles]     = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [apiError,  setApiError]  = useState('')

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      title: '', propertyType: '', location: '', apartmentName: '',
      floor: '', rooms: '', bedrooms: '', area: '', landArea: '',
      cropsGrown: '', expectedPrice: '', rentLease: '', contactNumber: '',
    },
  })
  const propType = watch('propertyType')

  const onSubmit = async (data) => {
    if (!user.isPremium) {
      notify('Upgrade to Premium to post listings', 'warning')
      return
    }
    setSubmitting(true)
    setApiError('')
    try {
      await propertyService.add({
        ...data,
        images: files.map((f) => f.preview),
      })
      notify('Property listing posted!')
      navigate('/dashboard/my-listings')
    } catch (err) {
      setApiError(extractError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: '12px', color: '#64748B', fontWeight: 700, fontSize: '0.82rem',
            '&:hover': { background: '#F1F5F9' },
          }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={900}
            sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
            Add Property
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Fill in the details to create a new listing
          </Typography>
        </Box>
        <Chip
          label={user.isPremium ? 'Posting Enabled' : 'Premium Required'}
          size="small"
          sx={{
            ml: 'auto', fontWeight: 700, border: 'none',
            background: user.isPremium ? '#ECFDF5' : '#FEF3C7',
            color:      user.isPremium ? '#059669' : '#D97706',
          }}
        />
      </Stack>

      {/* ── Premium Lock ── */}
      {!user.isPremium && <PremiumLockCard />}

      {/* ── API Error ── */}
      {apiError && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}
          onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>

          {/* ── Section 1: Basic Info ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<AddHomeRoundedIcon sx={{ fontSize: 18 }} />}
                title="Basic Information"
                description="Property title, type, and location details"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <FormInput name="title" label="Listing Title *" control={control}
                    rules={{ required: 'Title is required' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectInput name="propertyType" label="Property Type *" control={control}
                    rules={{ required: 'Property type is required' }} options={PROPERTY_TYPES} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="location" label="Location / Address" control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="apartmentName" label="Apartment / Society Name" control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="contactNumber" label="Contact Number *" control={control}
                    rules={{ required: 'Contact number is required' }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 2: Property Details ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📐</span>}
                title="Property Details"
                description="Dimensions, rooms, and structural information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                {(propType === 'Flat' || propType === 'Residential') && (
                  <>
                    <Grid item xs={6} sm={4}>
                      <FormInput name="floor"    label="Floor"    control={control} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <FormInput name="rooms"    label="Rooms"    control={control} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <FormInput name="bedrooms" label="Bedrooms" control={control} />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <FormInput name="area"     label="Built-up Area (sq.ft)"   control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="landArea" label="Land Area (e.g. 2 Acres)" control={control} />
                </Grid>
                {propType === 'Agricultural' && (
                  <Grid item xs={12}>
                    <FormInput name="cropsGrown" label="Crops Grown" control={control} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 3: Pricing ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Pricing & Terms"
                description="Expected price and rental / lease information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <FormInput name="expectedPrice" label="Expected Price (₹) *" control={control}
                    rules={{ required: 'Price is required' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="rentLease" label="Rent / Lease Details" control={control} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 4: Images ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🖼️</span>}
                title="Property Images"
                description="Upload multiple photos to attract buyers (drag & drop supported)"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <ImageUploader value={files} onChange={setFiles} label="Upload Property Photos" />
            </CardContent>
          </Card>

          {/* ── Submit ── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={() => navigate(-1)}
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
              disabled={!user.isPremium || submitting}
              startIcon={
                submitting
                  ? <CircularProgress size={16} color="inherit" />
                  : <SaveRoundedIcon />
              }
              sx={{
                borderRadius: '12px', fontWeight: 800,
                background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                boxShadow: '0 4px 16px rgba(67,97,238,0.30)', px: 4,
                '&:hover': { boxShadow: '0 6px 24px rgba(67,97,238,0.40)' },
                '&.Mui-disabled': { opacity: 0.55, background: '#CBD5E1' },
              }}
            >
              {submitting ? 'Posting…' : 'Post Property Listing'}
            </Button>
          </Box>

        </Stack>
      </form>
    </Stack>
  )
}