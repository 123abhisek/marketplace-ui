
// src/dashboard/ProfilePage.jsx
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import WorkRoundedIcon from '@mui/icons-material/WorkRounded'
import EventRoundedIcon from '@mui/icons-material/EventRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import FormInput from '../components/FormInput'
import SelectInput from '../components/SelectInput'
import ImageUploader from '../components/ImageUploader'
import { useAppState } from '../hooks/useAppState'

const UI = {
  bg: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  border: 'rgba(15,23,42,0.08)',
  borderStrong: 'rgba(15,23,42,0.12)',
  text: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
  primary: '#0F766E',
  primarySoft: 'rgba(15,118,110,0.08)',
  primaryBorder: 'rgba(15,118,110,0.16)',
  premium: '#B45309',
  premiumSoft: 'rgba(180,83,9,0.10)',
  premiumBorder: 'rgba(180,83,9,0.16)',
  shadowSm: '0 2px 12px rgba(15,23,42,0.04)',
  shadowMd: '0 10px 30px rgba(15,23,42,0.06)',
}

const cardSx = {
  borderRadius: '24px',
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
}

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1.2} alignItems="flex-start">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: UI.surfaceSoft,
            border: `1px solid ${UI.border}`,
            color: UI.text,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: UI.text,
              fontSize: '0.98rem',
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>

          {description ? (
            <Typography
              sx={{
                mt: 0.45,
                fontSize: '0.82rem',
                color: UI.muted,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

function SummaryStat({ label, value, tone = 'default' }) {
  const toneMap = {
    default: {
      color: UI.text,
      bg: UI.surfaceSoft,
      border: UI.border,
    },
    primary: {
      color: UI.primary,
      bg: UI.primarySoft,
      border: UI.primaryBorder,
    },
    premium: {
      color: UI.premium,
      bg: UI.premiumSoft,
      border: UI.premiumBorder,
    },
  }

  const current = toneMap[tone] || toneMap.default

  return (
    <Card
      sx={{
        borderRadius: '18px',
        border: `1px solid ${current.border}`,
        background: current.bg,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: '0.76rem',
            color: UI.muted,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            mt: 0.8,
            fontSize: '1.35rem',
            color: current.color,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '10px',
          background: UI.surfaceSoft,
          border: `1px solid ${UI.border}`,
          color: UI.faint,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.72rem',
            color: UI.faint,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            mt: 0.2,
            fontSize: '0.86rem',
            color: UI.text,
            fontWeight: 700,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {value || 'Not added'}
        </Typography>
      </Box>
    </Stack>
  )
}

export default function ProfilePage() {
  const { user = {}, updateProfile } = useAppState()

  const [files, setFiles] = useState(
    user.photo ? [{ name: 'profile-photo', preview: user.photo }] : [],
  )
  const [submitting, setSubmitting] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: user.name || '',
      gender: user.gender || '',
      dob: user.dob || '',
      location: user.location || '',
      state: user.state || '',
      city: user.city || '',
      pincode: user.pincode || '',
      occupation: user.occupation || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
    },
  })

  const values = watch()

  const initials = useMemo(() => {
    const name = values.name?.trim() || user.name?.trim() || 'User'
    const parts = name.split(' ').filter(Boolean)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return parts[0]?.[0]?.toUpperCase() || 'U'
  }, [values.name, user.name])

  const completion = useMemo(() => {
    const fields = [
      values.name,
      values.gender,
      values.dob,
      values.location,
      values.state,
      values.city,
      values.pincode,
      values.occupation,
      values.email,
      values.mobile,
    ]
    const done = fields.filter((item) => String(item || '').trim()).length
    return Math.round((done / fields.length) * 100)
  }, [values])

  const planLabel = user.isPremium ? 'Premium Member' : 'Free Member'
  const profilePhoto = files[0]?.preview || user.photo || user.avatar_url || ''

  const onSubmit = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    updateProfile({ ...data, photo: files[0]?.preview || user.photo })
    setSubmitting(false)
    setShowUploader(false)
  }

  return (
    <Box sx={{ background: UI.bg, p: { xs: 1, sm: 1.5, md: 2 } }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '1.45rem', md: '1.6rem' },
              fontWeight: 900,
              color: UI.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Profile Settings
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.86rem',
              color: UI.muted,
              lineHeight: 1.6,
            }}
          >
            Manage your profile, contact details, and account information.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={4}>
              <Stack spacing={2.5}>
                <Card sx={{ ...cardSx, overflow: 'hidden', boxShadow: UI.shadowMd }}>
                  <Box
                    sx={{
                      height: { xs: 126, sm: 150 },
                      background:
                        'linear-gradient(135deg, #EEF6FF 0%, #EAFBF5 48%, #F8FAFC 100%)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                          'radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 30%), radial-gradient(circle at left center, rgba(16,185,129,0.12), transparent 28%)',
                      },
                    }}
                  />

                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5 }}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row', lg: 'column' }}
                        spacing={{ xs: 1.5, sm: 1.8, lg: 1.5 }}
                        alignItems={{ xs: 'flex-start', sm: 'flex-end', lg: 'flex-start' }}
                        sx={{ mt: { xs: -4.5, sm: -5, lg: -5 } }}
                      >
                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                          <Avatar
                            src={profilePhoto}
                            sx={{
                              width: { xs: 86, sm: 94 },
                              height: { xs: 86, sm: 94 },
                              border: '4px solid #fff',
                              boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
                              background: '#E2E8F0',
                              color: UI.text,
                              fontSize: '1.8rem',
                              fontWeight: 900,
                            }}
                          >
                            {initials}
                          </Avatar>

                          <Button
                            type="button"
                            onClick={() => setShowUploader((prev) => !prev)}
                            sx={{
                              minWidth: 0,
                              width: 34,
                              height: 34,
                              p: 0,
                              borderRadius: '12px',
                              position: 'absolute',
                              right: -6,
                              bottom: -6,
                              background: UI.text,
                              color: '#fff',
                              border: '2px solid #fff',
                              boxShadow: '0 8px 18px rgba(15,23,42,0.16)',
                              '&:hover': { background: '#1E293B' },
                            }}
                          >
                            <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                            pt: { xs: 0, sm: 3.8, lg: 0 },
                            width: '100%',
                          }}
                        >
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: { xs: '1.3rem', sm: '1.35rem' },
                                  fontWeight: 900,
                                  color: UI.text,
                                  letterSpacing: '-0.03em',
                                  lineHeight: 1.08,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {values.name || 'Your Name'}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.6,
                                  fontSize: '0.84rem',
                                  color: UI.muted,
                                  lineHeight: 1.65,
                                }}
                              >
                                Keep your account details current so buyers and sellers can trust your profile.
                              </Typography>
                            </Box>

                            <Chip
                              icon={
                                <WorkspacePremiumRoundedIcon
                                  sx={{
                                    fontSize: '14px !important',
                                    color: `${user.isPremium ? UI.premium : UI.faint} !important`,
                                  }}
                                />
                              }
                              label={planLabel}
                              size="small"
                              sx={{
                                mt: { xs: 1, sm: 0 },
                                height: 28,
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                background: user.isPremium ? UI.premiumSoft : UI.surfaceSoft,
                                color: user.isPremium ? UI.premium : UI.muted,
                                border: `1px solid ${
                                  user.isPremium ? UI.premiumBorder : UI.border
                                }`,
                              }}
                            />
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack spacing={1.35} sx={{ mt: 2.2 }}>
                        <InfoRow
                          icon={<EmailRoundedIcon sx={{ fontSize: 16 }} />}
                          label="Email"
                          value={values.email || 'email@example.com'}
                        />
                        <InfoRow
                          icon={<PhoneRoundedIcon sx={{ fontSize: 16 }} />}
                          label="Mobile"
                          value={values.mobile || user.phone || 'Add your phone number'}
                        />
                        <InfoRow
                          icon={<FmdGoodRoundedIcon sx={{ fontSize: 16 }} />}
                          label="Location"
                          value={
                            [values.city, values.state].filter(Boolean).join(', ') ||
                            values.location ||
                            'Add your location'
                          }
                        />
                      </Stack>

                      {showUploader ? (
                        <Box sx={{ mt: 2.25 }}>
                          <Divider sx={{ mb: 2, borderColor: UI.border }} />
                          <ImageUploader
                            value={files}
                            onChange={(f) => {
                              setFiles(f.slice(-1))
                              setShowUploader(false)
                            }}
                            label="Choose Profile Photo"
                          />
                        </Box>
                      ) : null}
                    </Box>
                  </CardContent>
                </Card>

                <Grid container spacing={1.6}>
                  <Grid item xs={6} lg={12}>
                    <SummaryStat label="Profile completion" value={`${completion}%`} tone="primary" />
                  </Grid>
                  <Grid item xs={6} lg={12}>
                    <SummaryStat
                      label="Membership"
                      value={user.isPremium ? 'Premium' : 'Free'}
                      tone={user.isPremium ? 'premium' : 'default'}
                    />
                  </Grid>
                </Grid>

                <Card sx={cardSx}>
                  <CardContent sx={{ p: 2.25 }}>
                    <Stack spacing={1.6}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: UI.faint,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          Profile strength
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.8,
                            fontSize: '0.92rem',
                            color: UI.text,
                            fontWeight: 800,
                            lineHeight: 1.45,
                          }}
                        >
                          Complete your details for a stronger marketplace profile.
                        </Typography>
                      </Box>

                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.8 }}
                        >
                          <Typography sx={{ fontSize: '0.78rem', color: UI.muted, fontWeight: 700 }}>
                            Completion
                          </Typography>
                          <Typography sx={{ fontSize: '0.78rem', color: UI.primary, fontWeight: 800 }}>
                            {completion}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={completion}
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            backgroundColor: UI.surfaceSoft,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 999,
                              backgroundColor: UI.primary,
                            },
                          }}
                        />
                      </Box>

                      <Stack spacing={1.1}>
                        {[
                          { ok: !!values.name, label: 'Full name added' },
                          { ok: !!values.email, label: 'Email added' },
                          { ok: !!values.mobile, label: 'Mobile number added' },
                          { ok: !!values.city && !!values.state, label: 'City and state added' },
                        ].map((item) => (
                          <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                            <TaskAltRoundedIcon
                              sx={{
                                fontSize: 17,
                                color: item.ok ? UI.primary : UI.faint,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '0.82rem',
                                color: item.ok ? UI.text : UI.muted,
                                fontWeight: 700,
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Stack spacing={2.5}>
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                    <SectionHeader
                      icon={<PersonRoundedIcon sx={{ fontSize: 18 }} />}
                      title="Personal Information"
                      description="Update your identity details and basic profile information."
                    />

                    <Divider sx={{ mb: 2.8, borderColor: UI.border }} />

                    <Grid container spacing={2.2}>
                      <Grid item xs={12} sm={6}>
                        <FormInput
                          name="name"
                          label="Full Name"
                          control={control}
                          rules={{ required: 'Name is required' }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <SelectInput
                          name="gender"
                          label="Gender"
                          control={control}
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                          ]}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput
                          name="dob"
                          label="Date of Birth"
                          type="date"
                          control={control}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput
                          name="occupation"
                          label="Occupation"
                          control={control}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                    <SectionHeader
                      icon={<FmdGoodRoundedIcon sx={{ fontSize: 18 }} />}
                      title="Location"
                      description="Set your city, state, pincode, and locality details."
                    />

                    <Divider sx={{ mb: 2.8, borderColor: UI.border }} />

                    <Grid container spacing={2.2}>
                      <Grid item xs={12}>
                        <FormInput
                          name="location"
                          label="Full Address / Locality"
                          control={control}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormInput
                          name="state"
                          label="State"
                          control={control}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormInput
                          name="city"
                          label="City"
                          control={control}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormInput
                          name="pincode"
                          label="Pincode"
                          control={control}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                    <SectionHeader
                      icon={<EmailRoundedIcon sx={{ fontSize: 18 }} />}
                      title="Contact Information"
                      description="These details help buyers and sellers reach you easily."
                    />

                    <Divider sx={{ mb: 2.8, borderColor: UI.border }} />

                    <Grid container spacing={2.2}>
                      <Grid item xs={12} sm={6}>
                        <FormInput
                          name="email"
                          label="Email Address"
                          control={control}
                          rules={{ required: 'Email is required' }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormInput
                          name="mobile"
                          label="Mobile Number"
                          control={control}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={cardSx}>
                  <CardContent
                    sx={{
                      p: { xs: 2.2, sm: 2.4 },
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '12px',
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.border}`,
                            color: UI.text,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <BadgeRoundedIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.95rem',
                              color: UI.text,
                              fontWeight: 800,
                              lineHeight: 1.3,
                            }}
                          >
                            Ready to save your updates
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.82rem',
                              color: UI.muted,
                              lineHeight: 1.55,
                            }}
                          >
                            Review your information and save changes to update your profile.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.2}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        <Button
                          type="button"
                          onClick={() => setShowUploader((prev) => !prev)}
                          startIcon={<EditRoundedIcon />}
                          sx={{
                            minHeight: 46,
                            px: 2.2,
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            color: UI.text,
                            background: UI.surfaceSoft,
                            border: `1px solid ${UI.borderStrong}`,
                            '&:hover': { background: '#F1F5F9' },
                          }}
                        >
                          Change Photo
                        </Button>

                        <Button
                          type="submit"
                          variant="contained"
                          disabled={submitting}
                          startIcon={<SaveRoundedIcon />}
                          sx={{
                            minHeight: 46,
                            px: 2.6,
                            borderRadius: '14px',
                            textTransform: 'none',
                            fontWeight: 900,
                            fontSize: '0.9rem',
                            background: UI.text,
                            color: '#fff',
                            boxShadow: '0 12px 24px rgba(15,23,42,0.12)',
                            '&:hover': {
                              background: '#1E293B',
                              boxShadow: '0 16px 28px rgba(15,23,42,0.16)',
                            },
                            '&.Mui-disabled': {
                              background: '#CBD5E1',
                              color: '#fff',
                            },
                          }}
                        >
                          {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </Box>
  )
}