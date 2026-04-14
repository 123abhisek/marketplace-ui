
// src/dashboard/ProfilePage.jsx
import { useState }             from 'react'
import { useForm }              from 'react-hook-form'
import {
  Avatar, Box, Button, Card, CardContent,
  Chip, Divider, Grid, Stack, Typography,
} from '@mui/material'
import SaveRoundedIcon          from '@mui/icons-material/SaveRounded'
import CameraAltRoundedIcon     from '@mui/icons-material/CameraAltRounded'
import PersonRoundedIcon        from '@mui/icons-material/PersonRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import EmailRoundedIcon         from '@mui/icons-material/EmailRounded'
import FormInput                from '../components/FormInput'
import SelectInput              from '../components/SelectInput'
import ImageUploader            from '../components/ImageUploader'
import { useAppState }          from '../hooks/useAppState'

function SectionHeader({ icon, title, description, accentColor = '#4361EE', accentBg = '#EEF2FF' }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: accentBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
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

export default function ProfilePage() {
  const { user, updateProfile } = useAppState()
  const [files, setFiles]       = useState(
    user.photo ? [{ name: 'profile-photo', preview: user.photo }] : [],
  )
  const [submitting, setSubmitting] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name:       user.name       || '',
      gender:     user.gender     || '',
      dob:        user.dob        || '',
      location:   user.location   || '',
      state:      user.state      || '',
      city:       user.city       || '',
      pincode:    user.pincode    || '',
      occupation: user.occupation || '',
      email:      user.email      || '',
      mobile:     user.mobile     || user.phone || '',
    },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    updateProfile({ ...data, photo: files[0]?.preview || user.photo })
    setSubmitting(false)
    setShowUploader(false)
  }

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Box>
        <Typography variant="h5" fontWeight={900} sx={{ color: '#1E293B', letterSpacing: '-0.03em' }}>
          Profile Settings
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8', mt: 0.25 }}>
          Update your personal information and account details
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>

          {/* ── Avatar Card ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                {/* Avatar */}
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar
                    src={files[0]?.preview || user.photo || user.avatar_url}
                    sx={{
                      width: 88,
                      height: 88,
                      background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      boxShadow: '0 8px 28px rgba(67,97,238,0.28)',
                      border: '3px solid #fff',
                      outline: '2px solid rgba(67,97,238,0.2)',
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box
                    onClick={() => setShowUploader(!showUploader)}
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: '#4361EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid #fff',
                      boxShadow: '0 2px 8px rgba(67,97,238,0.35)',
                      '&:hover': { background: '#2D44C4' },
                      transition: 'background 0.15s',
                    }}
                  >
                    <CameraAltRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
                  </Box>
                </Box>

                {/* User info */}
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={900} sx={{ fontSize: '1.15rem', color: '#1E293B', letterSpacing: '-0.02em' }}>
                    {user.name || 'Your Name'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5} flexWrap="wrap" useFlexGap>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <EmailRoundedIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        {user.email || 'email@example.com'}
                      </Typography>
                    </Stack>
                    <Chip
                      label={user.isPremium ? '✓ Premium Member' : 'Free Member'}
                      size="small"
                      icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: '13px !important', color: `${user.isPremium ? '#F59E0B' : '#94A3B8'} !important` }} />}
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: user.isPremium ? '#FFFBEB' : '#F1F5F9',
                        color: user.isPremium ? '#D97706' : '#64748B',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Typography sx={{ fontSize: '0.78rem', color: '#CBD5E1', mt: 0.5 }}>
                    Click the camera icon to update your profile photo
                  </Typography>
                </Box>
              </Stack>

              {/* Collapsible uploader */}
              {showUploader && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2.5, opacity: 0.6 }} />
                  <ImageUploader
                    value={files}
                    onChange={(f) => { setFiles(f.slice(-1)); setShowUploader(false) }}
                    label="Choose Profile Photo"
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* ── Section 1: Personal Info ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<PersonRoundedIcon sx={{ fontSize: 18 }} />}
                title="Personal Information"
                description="Your name, gender, date of birth, and occupation"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <FormInput name="name" label="Full Name" control={control} rules={{ required: 'Name is required' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectInput
                    name="gender"
                    label="Gender"
                    control={control}
                    options={[
                      { label: 'Male',   value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other',  value: 'other' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="dob"        label="Date of Birth" type="date" control={control} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="occupation" label="Occupation"    control={control} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 2: Location ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📍</span>}
                title="Location"
                description="Your current city, state, and pincode"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <FormInput name="location" label="Full Address / Locality" control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="state"   label="State"   control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="city"    label="City"    control={control} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormInput name="pincode" label="Pincode" control={control} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 3: Contact ── */}
          <Card sx={{ borderRadius: '20px', boxShadow: '0 2px 20px rgba(15,23,42,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<EmailRoundedIcon sx={{ fontSize: 18 }} />}
                title="Contact Information"
                description="Email and mobile number (used by buyers to reach you)"
                accentColor="#10B981"
                accentBg="#ECFDF5"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <FormInput
                    name="email"
                    label="Email Address"
                    control={control}
                    rules={{ required: 'Email is required' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormInput name="mobile" label="Mobile Number" control={control} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Save Button ── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={<SaveRoundedIcon />}
              sx={{
                borderRadius: '12px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)',
                boxShadow: '0 4px 16px rgba(67,97,238,0.30)',
                px: 4,
                py: 1.25,
                '&:hover': { boxShadow: '0 6px 24px rgba(67,97,238,0.40)' },
              }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  )
}