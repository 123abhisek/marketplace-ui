// src/dashboard/ProfilePage.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
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
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import StarsRoundedIcon from '@mui/icons-material/StarsRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FormInput from '../components/FormInput'
import SelectInput from '../components/SelectInput'
import ImageUploader from '../components/ImageUploader'
import { useAppState } from '../hooks/useAppState'
import { locationService } from '../services/api'

const UI = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  border: 'rgba(226, 232, 240, 0.9)',
  borderStrong: 'rgba(203, 213, 225, 0.8)',
  text: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
  primary: '#0F766E',
  primaryDark: '#0b5f59',
  primarySoft: 'rgba(15, 118, 110, 0.08)',
  primaryBorder: 'rgba(15, 118, 110, 0.20)',
  premium: '#D97706',
  premiumSoft: 'rgba(217, 119, 6, 0.10)',
  premiumBorder: 'rgba(217, 119, 6, 0.22)',
  shadowSm: '0 4px 20px rgba(15, 23, 42, 0.04)',
  shadowMd: '0 10px 30px rgba(15, 23, 42, 0.07)',
}

const cardSx = {
  borderRadius: '24px',
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            background: UI.primarySoft,
            color: UI.primary,
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
              fontSize: '1.02rem',
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              sx={{
                mt: 0.35,
                fontSize: '0.82rem',
                color: UI.muted,
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

function MetricStatCard({ icon, value, label, subtext, tone = 'teal' }) {
  const tones = {
    teal: {
      bg: 'rgba(15, 118, 110, 0.09)',
      color: '#0F766E',
      badgeBg: '#ECFDF5',
      badgeColor: '#059669',
    },
    amber: {
      bg: 'rgba(217, 119, 6, 0.10)',
      color: '#D97706',
      badgeBg: '#FFFBEB',
      badgeColor: '#B45309',
    },
    blue: {
      bg: 'rgba(37, 99, 235, 0.09)',
      color: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeColor: '#1D4ED8',
    },
    purple: {
      bg: 'rgba(124, 58, 237, 0.09)',
      color: '#7C3AED',
      badgeBg: '#F5F3FF',
      badgeColor: '#6D28D9',
    },
  }

  const currentTone = tones[tone] || tones.teal

  return (
    <Card
      sx={{
        ...cardSx,
        p: 2.2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: UI.shadowMd,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: currentTone.bg,
            color: currentTone.color,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </Box>

        {subtext && (
          <Chip
            size="small"
            label={subtext}
            sx={{
              height: 22,
              borderRadius: '999px',
              fontSize: '0.68rem',
              fontWeight: 800,
              background: currentTone.badgeBg,
              color: currentTone.badgeColor,
              border: `1px solid ${currentTone.bg}`,
            }}
          />
        )}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.45rem', sm: '1.65rem' },
            fontWeight: 900,
            color: UI.text,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontSize: '0.8rem',
            fontWeight: 700,
            color: UI.muted,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user = {}, properties = [], vehicles = [], updateProfile } = useAppState()

  const [files, setFiles] = useState(
    user.photo ? [{ name: 'profile-photo', preview: user.photo }] : [],
  )
  const [submitting, setSubmitting] = useState(false)
  const [showUploader, setShowUploader] = useState(false)

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      name: user.name || '',
      gender: user.gender || '',
      dob: user.dob ? String(user.dob).split('T')[0] : '',
      location: user.location || user.address || user.local_address || '',
      address: user.address || user.location || user.local_address || '',
      state: user.state || '',
      city: user.city || '',
      pincode: user.pincode || '',
      occupation: user.occupation || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
    },
  })

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      const userAddress = user.location || user.address || user.local_address || ''
      reset({
        name: user.name || '',
        gender: user.gender || '',
        dob: user.dob ? String(user.dob).split('T')[0] : '',
        location: userAddress,
        address: userAddress,
        state: user.state || '',
        city: user.city || '',
        pincode: user.pincode || '',
        occupation: user.occupation || '',
        email: user.email || '',
        mobile: user.mobile || user.phone || '',
      })
      if (user.photo || user.avatar_url || user.avatar_b64) {
        setFiles([{ name: 'profile-photo', preview: user.photo || user.avatar_url || user.avatar_b64 }])
      }
    }
  }, [user, reset])

  const values = watch()

  // ── Address & Location API Integration ──
  const [states, setStates] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [districts, setDistricts] = useState([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [subdistricts, setSubdistricts] = useState([])
  const [locationSearchQuery, setLocationSearchQuery] = useState('')
  const [locationSearchResults, setLocationSearchResults] = useState([])
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [pincodeStatus, setPincodeStatus] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const lastLookedUpPincode = useRef('')

  // 1. Fetch States on Mount from Location API
  useEffect(() => {
    let mounted = true
    setLoadingStates(true)
    locationService
      .getStates()
      .then((data) => {
        if (!mounted) return
        const list = Array.isArray(data) ? data : data?.data || []
        setStates(list)
      })
      .catch((err) => {
        console.warn('Failed to load states:', err)
      })
      .finally(() => {
        if (mounted) setLoadingStates(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  // 2. Fetch Districts whenever selected state changes
  const selectedState = values.state || 'Karnataka'
  useEffect(() => {
    let mounted = true
    setLoadingDistricts(true)
    locationService
      .getDistricts(selectedState)
      .then((data) => {
        if (!mounted) return
        const list = Array.isArray(data) ? data : data?.data || []
        setDistricts(list)
      })
      .catch((err) => {
        console.warn('Failed to load districts:', err)
        if (mounted) setDistricts([])
      })
      .finally(() => {
        if (mounted) setLoadingDistricts(false)
      })
    return () => {
      mounted = false
    }
  }, [selectedState])

  // 3. Fetch Sub-districts / Taluks whenever selected city / district changes
  const selectedCity = values.city || ''
  useEffect(() => {
    if (!selectedCity || !districts.length) {
      setSubdistricts([])
      return
    }
    const matchedDist = districts.find(
      (d) => d.name?.toLowerCase() === String(selectedCity).toLowerCase()
    )
    if (!matchedDist?.code) {
      setSubdistricts([])
      return
    }
    let mounted = true
    locationService
      .getSubdistricts(matchedDist.code)
      .then((data) => {
        if (!mounted) return
        const list = Array.isArray(data) ? data : data?.data || []
        setSubdistricts(list)
      })
      .catch(() => {
        if (mounted) setSubdistricts([])
      })
    return () => {
      mounted = false
    }
  }, [selectedCity, districts])

  // 4. Instant Global Location Search (Official LGD API)
  useEffect(() => {
    const q = locationSearchQuery.trim()
    if (q.length < 2) {
      setLocationSearchResults([])
      setSearchingLocation(false)
      return
    }
    const timer = setTimeout(async () => {
      setSearchingLocation(true)
      try {
        const res = await locationService.search(q)
        const data = res?.data || res
        const resObj = data?.results || {}
        const items = []
        ;(resObj.districts || []).forEach((d) => {
          items.push({
            id: `district-${d.code}`,
            type: 'District',
            name: d.name,
            stateCode: d.state_code,
            districtCode: d.code,
            displayName: `${d.name} (District)`,
          })
        })
        ;(resObj.subdistricts || []).forEach((s) => {
          items.push({
            id: `subdistrict-${s.code}`,
            type: 'Taluk / Locality',
            name: s.name,
            stateCode: s.state_code,
            districtCode: s.district_code,
            displayName: `${s.name} (Taluk / Area)`,
          })
        })
        ;(resObj.blocks || []).forEach((b) => {
          items.push({
            id: `block-${b.code}`,
            type: 'Block',
            name: b.name,
            stateCode: b.state_code,
            districtCode: b.district_code,
            displayName: `${b.name} (Block)`,
          })
        })
        setLocationSearchResults(items.slice(0, 15))
      } catch {
        setLocationSearchResults([])
      } finally {
        setSearchingLocation(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [locationSearchQuery])

  const handleSelectSearchResult = (item) => {
    if (!item) return
    if (item.stateCode) {
      const matchState = states.find((s) => String(s.code) === String(item.stateCode))
      if (matchState) {
        setValue('state', matchState.name, { shouldValidate: true, shouldDirty: true })
      }
    }
    if (item.type === 'District') {
      setValue('city', item.name, { shouldValidate: true, shouldDirty: true })
    } else {
      const existing = watch('location') || ''
      if (!existing || existing.toLowerCase() === 'bengaluru' || existing.toLowerCase() === 'karnataka') {
        setValue('location', item.name, { shouldValidate: true, shouldDirty: true })
      } else if (!existing.toLowerCase().includes(item.name.toLowerCase())) {
        setValue('location', `${item.name}, ${existing}`, { shouldValidate: true, shouldDirty: true })
      }
      if (item.districtCode) {
        const matchDist = districts.find((d) => String(d.code) === String(item.districtCode))
        if (matchDist) {
          setValue('city', matchDist.name, { shouldValidate: true, shouldDirty: true })
        }
      }
    }
    setLocationSearchQuery('')
    setLocationSearchResults([])
  }

  // 5. Postal Pincode Lookup API
  const handlePincodeLookup = useCallback(async (pinCodeToLookup) => {
    const pin = String(pinCodeToLookup || '').replace(/\D/g, '').slice(0, 6)
    if (pin.length !== 6) {
      setPincodeStatus(null)
      return
    }
    setPincodeLoading(true)
    try {
      const res = await locationService.lookupPincode(pin)
      if (res && res.success) {
        if (res.state) {
          setValue('state', res.state, { shouldValidate: true, shouldDirty: true })
        }
        if (res.city || res.district) {
          setValue('city', res.city || res.district, { shouldValidate: true, shouldDirty: true })
        }
        setPincodeStatus({
          verified: true,
          message: `Verified: ${res.city || res.district}, ${res.state}`,
          postOffices: res.post_offices || [],
        })
      } else {
        setPincodeStatus({ verified: false, message: 'PIN code not recognized', postOffices: [] })
      }
    } catch {
      setPincodeStatus(null)
    } finally {
      setPincodeLoading(false)
    }
  }, [setValue])

  const currentPincode = values.pincode
  useEffect(() => {
    const clean = String(currentPincode || '').replace(/\D/g, '')
    if (clean.length === 6 && clean !== lastLookedUpPincode.current) {
      lastLookedUpPincode.current = clean
      handlePincodeLookup(clean)
    }
  }, [currentPincode, handlePincodeLookup])

  // 6. GPS Location Detection
  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await res.json()
          const addr = data?.address || {}
          const state = addr.state || ''
          const city = addr.city || addr.town || addr.district || addr.county || ''
          const pincode = addr.postcode || ''
          const suburb = addr.suburb || addr.neighbourhood || addr.road || ''

          if (state) setValue('state', state, { shouldValidate: true, shouldDirty: true })
          if (city) setValue('city', city, { shouldValidate: true, shouldDirty: true })
          if (pincode) setValue('pincode', pincode.replace(/\D/g, '').slice(0, 6), { shouldValidate: true, shouldDirty: true })
          if (suburb) {
            const currentLoc = watch('location') || ''
            if (!currentLoc) {
              setValue('location', `${suburb}, ${city}`, { shouldValidate: true, shouldDirty: true })
            }
          }
        } catch (err) {
          console.warn('GPS reverse geocode error:', err)
        } finally {
          setGeoLoading(false)
        }
      },
      (err) => {
        console.warn('GPS error:', err)
        setGeoLoading(false)
      },
      { timeout: 10000 }
    )
  }

  const handleAddLocalityToAddress = (localityName) => {
    const currentLoc = watch('location') || ''
    if (!currentLoc || currentLoc.trim().toLowerCase() === 'bengaluru' || currentLoc.trim().toLowerCase() === 'karnataka') {
      setValue('location', localityName, { shouldValidate: true, shouldDirty: true })
    } else if (!currentLoc.toLowerCase().includes(localityName.toLowerCase())) {
      setValue('location', `${localityName}, ${currentLoc}`, { shouldValidate: true, shouldDirty: true })
    }
  }

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

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
      values.location || values.address,
      values.state,
      values.city,
      values.pincode,
      values.occupation,
      values.email,
      values.mobile,
      files[0]?.preview || user.photo,
    ]
    const done = fields.filter((item) => String(item || '').trim()).length
    return Math.round((done / fields.length) * 100)
  }, [values, files, user.photo])

  const userPropertiesCount = useMemo(() => {
    return properties.filter(
      (p) => p.userId === user?.id || p.user_id === user?.id || p.owner_id === user?.id,
    ).length
  }, [properties, user?.id])

  const userVehiclesCount = useMemo(() => {
    return vehicles.filter(
      (v) => v.userId === user?.id || v.user_id === user?.id || v.owner_id === user?.id,
    ).length
  }, [vehicles, user?.id])

  const isPremium = Boolean(
    user.isPremium || user.is_premium || user.role === 'premium' || user.role === 'admin',
  )
  const isSeller = user.role === 'seller' || user.is_seller

  const profilePhoto = files[0]?.preview || user.photo || user.avatar_url || ''

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const fullAddress = data.location || data.address || ''
      await updateProfile({
        ...data,
        location: fullAddress,
        address: fullAddress,
        photo: files[0]?.preview || user.photo,
      })
      setShowUploader(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ background: UI.bg, minHeight: '100vh', pb: 6 }}>
      <Stack spacing={3}>
        {/* ── Page Greeting & Breadcrumb ── */}
        <Box sx={{ pt: { xs: 1, sm: 2 } }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.45rem', sm: '1.85rem' },
              color: UI.text,
              letterSpacing: '-0.03em',
            }}
          >
            {greeting}, {values.name?.split(' ')[0] || user.name?.split(' ')[0] || 'Member'}! 👋
          </Typography>
          <Typography sx={{ color: UI.muted, fontSize: '0.88rem', mt: 0.35 }}>
            Here is your personal profile, credentials, and account overview
          </Typography>
        </Box>

        {/* ── Prominent Hero Profile Card (Material Design) ── */}
        <Card
          sx={{
            borderRadius: '28px',
            border: `1px solid ${UI.border}`,
            background:
              'linear-gradient(135deg, rgba(240, 253, 250, 0.95) 0%, rgba(255, 255, 255, 1) 45%, rgba(240, 249, 255, 0.95) 100%)',
            boxShadow: UI.shadowMd,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <CardContent sx={{ p: { xs: 2.8, sm: 3.5, md: 4 } }}>
            <Stack
              direction={{ xs: 'column-reverse', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={3}
            >
              {/* Left Info */}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
                  <Chip
                    icon={
                      isPremium ? (
                        <WorkspacePremiumRoundedIcon sx={{ fontSize: '15px !important', color: '#B45309 !important' }} />
                      ) : (
                        <StarsRoundedIcon sx={{ fontSize: '15px !important', color: '#0F766E !important' }} />
                      )
                    }
                    label={isPremium ? '👑 Premium Member' : isSeller ? 'Verified Seller' : 'Active Member'}
                    size="small"
                    sx={{
                      height: 26,
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: isPremium ? UI.premiumSoft : UI.primarySoft,
                      color: isPremium ? UI.premium : UI.primary,
                      border: `1px solid ${isPremium ? UI.premiumBorder : UI.primaryBorder}`,
                    }}
                  />

                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#10B981',
                        boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>
                      Online
                    </Typography>
                  </Stack>
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: '1.6rem', sm: '2.1rem' },
                    fontWeight: 900,
                    color: UI.text,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.1,
                    wordBreak: 'break-word',
                  }}
                >
                  {values.name || user.name || 'Your Name'}
                </Typography>

                <Typography sx={{ mt: 0.6, fontSize: '0.9rem', color: UI.muted, fontWeight: 600 }}>
                  {values.occupation || 'Marketplace Member'} {values.city ? `• ${values.city}` : ''}
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  {!isPremium ? (
                    <Button
                      onClick={() => navigate('/subscription')}
                      variant="contained"
                      startIcon={<WorkspacePremiumRoundedIcon />}
                      sx={{
                        minHeight: 42,
                        px: 2.4,
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        color: '#fff',
                        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
                        boxShadow: '0 6px 16px rgba(15,118,110,0.28)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                        },
                      }}
                    >
                      Upgrade to Premium (₹299)
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/dashboard/subscription')}
                      variant="outlined"
                      startIcon={<CheckCircleRoundedIcon />}
                      sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: UI.primary,
                        borderColor: UI.primaryBorder,
                        background: '#fff',
                      }}
                    >
                      Active Premium Plan
                    </Button>
                  )}

                  <Button
                    onClick={() => navigate('/dashboard/change-password')}
                    variant="outlined"
                    startIcon={<LockResetRoundedIcon />}
                    sx={{
                      minHeight: 42,
                      px: 2,
                      borderRadius: '14px',
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#475569',
                      borderColor: '#CBD5E1',
                      background: '#fff',
                      '&:hover': { background: '#F8FAFC', borderColor: '#94A3B8' },
                    }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Box>

              {/* Right Avatar with Ring */}
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(15,118,110,0.2) 0%, rgba(34,211,238,0.2) 100%)',
                    boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                  }}
                >
                  <Avatar
                    src={profilePhoto}
                    sx={{
                      width: { xs: 90, sm: 110 },
                      height: { xs: 90, sm: 110 },
                      border: '4px solid #fff',
                      background: '#E2E8F0',
                      color: UI.text,
                      fontSize: '2rem',
                      fontWeight: 900,
                    }}
                  >
                    {initials}
                  </Avatar>
                </Box>

                <Tooltip title="Change Profile Picture">
                  <IconButton
                    onClick={() => setShowUploader((prev) => !prev)}
                    sx={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      width: 38,
                      height: 38,
                      borderRadius: '12px',
                      background: UI.text,
                      color: '#fff',
                      border: '2px solid #fff',
                      boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                      '&:hover': { background: '#1E293B' },
                    }}
                  >
                    <CameraAltRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>

            {/* Photo Uploader Dropdown */}
            {showUploader && (
              <Box sx={{ mt: 3, pt: 2.5, borderTop: `1px solid ${UI.border}` }}>
                <ImageUploader
                  value={files}
                  onChange={(f) => {
                    setFiles(f.slice(-1))
                    setShowUploader(false)
                  }}
                  label="Upload High-Resolution Profile Photo (Max 40MB)"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ── 4 Key Metric Stat Cards (Inspired by Reference UI) ── */}
        <Grid container spacing={2.5} alignItems="stretch">
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricStatCard
              icon={<TaskAltRoundedIcon sx={{ fontSize: 24 }} />}
              value={`${completion}%`}
              label="Profile Strength"
              subtext="Progress"
              tone="teal"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricStatCard
              icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 24 }} />}
              value={isPremium ? 'Premium' : 'Free'}
              label="Account Tier"
              subtext={isPremium ? 'Active' : 'Basic'}
              tone="amber"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricStatCard
              icon={<HomeWorkRoundedIcon sx={{ fontSize: 24 }} />}
              value={userPropertiesCount}
              label="Properties Listed"
              subtext="Real Estate"
              tone="blue"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricStatCard
              icon={<DirectionsCarRoundedIcon sx={{ fontSize: 24 }} />}
              value={userVehiclesCount}
              label="Vehicles Listed"
              subtext="Automotive"
              tone="purple"
            />
          </Grid>
        </Grid>

        {/* ── Form & Sidebar Layout ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Left Main Form Column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                {/* 1. Personal Information */}
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <SectionHeader
                      icon={<PersonRoundedIcon sx={{ fontSize: 20 }} />}
                      title="Personal Information"
                      description="Your verified name, gender, date of birth, and profession."
                    />
                    <Divider sx={{ mb: 3, borderColor: UI.border }} />

                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormInput
                          name="name"
                          label="Full Name"
                          control={control}
                          rules={{ required: 'Full name is required' }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
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

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormInput
                          name="dob"
                          label="Date of Birth"
                          type="date"
                          control={control}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormInput
                          name="occupation"
                          label="Occupation / Business"
                          control={control}
                          placeholder="e.g. Real Estate Consultant, Engineer"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* 2. Location & Address (Integrated with India LGD & Postal PIN API) */}
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1.5}
                      sx={{ mb: 2 }}
                    >
                      <SectionHeader
                        icon={<FmdGoodRoundedIcon sx={{ fontSize: 20 }} />}
                        title="Address & Location"
                        description="Auto-detect city, state, and area using India's official directory & postal API."
                      />

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleDetectGPSLocation}
                        disabled={geoLoading}
                        startIcon={
                          geoLoading ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <MyLocationRoundedIcon sx={{ fontSize: 18 }} />
                          )
                        }
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          color: UI.primary,
                          borderColor: UI.primaryBorder,
                          bgcolor: UI.primarySoft,
                          '&:hover': {
                            bgcolor: 'rgba(15, 118, 110, 0.14)',
                            borderColor: UI.primary,
                          },
                        }}
                      >
                        {geoLoading ? 'Detecting GPS…' : 'Use My GPS Location'}
                      </Button>
                    </Stack>
                    <Divider sx={{ mb: 3, borderColor: UI.border }} />

                    {/* Quick Instant Location Search (Official India Directory) */}
                    <Box
                      sx={{
                        p: 2,
                        mb: 2.5,
                        borderRadius: '14px',
                        bgcolor: '#F8FAFC',
                        border: `1px dashed ${UI.border}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <SearchRoundedIcon sx={{ fontSize: 18, color: UI.primary }} />
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: UI.text }}>
                          Quick Location Search (Official Directory)
                        </Typography>
                      </Stack>

                      <Autocomplete
                        freeSolo
                        options={locationSearchResults}
                        getOptionLabel={(opt) =>
                          typeof opt === 'string' ? opt : opt.displayName || opt.name || ''
                        }
                        inputValue={locationSearchQuery}
                        onInputChange={(_, value) => setLocationSearchQuery(value)}
                        onChange={(_, selected) => {
                          if (selected && typeof selected === 'object') {
                            handleSelectSearchResult(selected)
                          }
                        }}
                        loading={searchingLocation}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Type to search any city, town, taluk or district (e.g. Indiranagar, Kumta, Udupi)..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PlaceRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {searchingLocation ? (
                                    <CircularProgress color="inherit" size={16} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                            sx={{
                              bgcolor: '#fff',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                fontSize: '0.86rem',
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id || option.name}
                            sx={{
                              fontSize: '0.86rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1,
                            }}
                          >
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <LocationCityRoundedIcon sx={{ fontSize: 18, color: UI.primary }} />
                              <Typography sx={{ fontWeight: 600, fontSize: '0.86rem' }}>
                                {option.name}
                              </Typography>
                            </Stack>
                            <Chip
                              label={option.type}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                bgcolor: UI.primarySoft,
                                color: UI.primary,
                              }}
                            />
                          </Box>
                        )}
                      />
                    </Box>

                    <Grid container spacing={2.5}>
                      {/* Full Street Address */}
                      <Grid size={{ xs: 12 }}>
                        <FormInput
                          name="location"
                          label="Full Address / Locality / Street"
                          control={control}
                          placeholder="Flat/House No., Building/Apartment Name, Street, Landmark, Area"
                          multiline
                          rows={3}
                          helperText="Enter your complete address or operational locality for buyers to locate you."
                        />
                      </Grid>

                      {/* Locality & Taluks suggestion chips */}
                      {(pincodeStatus?.postOffices?.length > 0 || subdistricts.length > 0) && (
                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              p: 1.8,
                              bgcolor: '#F0FDFA',
                              borderRadius: '12px',
                              border: `1px solid ${UI.primaryBorder}`,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '0.78rem', fontWeight: 800, color: UI.primary, mb: 1 }}
                            >
                              📍{' '}
                              {pincodeStatus?.postOffices?.length > 0
                                ? `Localities found for PIN ${values.pincode} (click to add to address):`
                                : `Sub-districts / Taluks in ${values.city || 'District'} (click to add to address):`}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                              {(pincodeStatus?.postOffices?.length > 0
                                ? pincodeStatus.postOffices
                                : subdistricts.map((s) => s.name)
                              )
                                .slice(0, 16)
                                .map((name) => (
                                  <Chip
                                    key={name}
                                    label={name}
                                    size="small"
                                    icon={<AddRoundedIcon sx={{ fontSize: '14px !important' }} />}
                                    onClick={() => handleAddLocalityToAddress(name)}
                                    clickable
                                    sx={{
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      bgcolor: '#fff',
                                      border: `1px solid ${UI.primaryBorder}`,
                                      color: UI.text,
                                      '&:hover': {
                                        bgcolor: UI.primary,
                                        color: '#fff',
                                        borderColor: UI.primary,
                                        '& .MuiChip-icon': { color: '#fff !important' },
                                      },
                                    }}
                                  />
                                ))}
                            </Stack>
                          </Box>
                        </Grid>
                      )}

                      {/* City / District Dropdown */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Autocomplete
                              freeSolo
                              options={districts.map((d) => d.name)}
                              value={field.value || ''}
                              loading={loadingDistricts}
                              onChange={(_, newValue) => {
                                field.onChange(newValue || '')
                              }}
                              onInputChange={(_, newInputValue) => {
                                field.onChange(newInputValue)
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="City / District"
                                  placeholder="e.g. Bengaluru, Mysuru"
                                  error={!!fieldState.error}
                                  // helperText={
                                  //   fieldState.error?.message ||
                                  //   (districts.length > 0
                                  //     ? `${districts.length} official districts available`
                                  //     : ' ')
                                  // }
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LocationCityRoundedIcon
                                          sx={{ fontSize: 20, color: UI.primary }}
                                        />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <>
                                        {loadingDistricts ? (
                                          <CircularProgress color="inherit" size={18} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      minHeight: '54px',
                                    },
                                  }}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>

                      {/* State Dropdown */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name="state"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Autocomplete
                              freeSolo
                              options={states.map((s) => s.name)}
                              value={field.value || 'Karnataka'}
                              loading={loadingStates}
                              onChange={(_, newValue) => {
                                field.onChange(newValue || '')
                                if (newValue !== field.value) {
                                  setValue('city', '', { shouldValidate: true })
                                }
                              }}
                              onInputChange={(_, newInputValue) => {
                                field.onChange(newInputValue)
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="State"
                                  placeholder="e.g. Karnataka"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message || ' '}
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <MapRoundedIcon sx={{ fontSize: 20, color: UI.muted }} />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <>
                                        {loadingStates ? (
                                          <CircularProgress color="inherit" size={18} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      minHeight: '54px',
                                    },
                                  }}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>

                      {/* Pincode with Auto-Lookup */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name="pincode"
                          control={control}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Pincode"
                              placeholder="e.g. 560068"
                              error={!!fieldState.error || (pincodeStatus && !pincodeStatus.verified)}
                              helperText={
                                fieldState.error?.message ||
                                (pincodeStatus ? (
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      color: pincodeStatus.verified ? '#10B981' : '#EF4444',
                                    }}
                                  >
                                    {pincodeStatus.message}
                                  </Typography>
                                ) : (
                                  'Enter 6 digits to autofill city & state'
                                ))
                              }
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                                field.onChange(val)
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {pincodeLoading ? (
                                      <CircularProgress size={18} color="inherit" />
                                    ) : pincodeStatus?.verified ? (
                                      <CheckCircleRoundedIcon
                                        sx={{ color: '#10B981', fontSize: 20 }}
                                      />
                                    ) : null}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  minHeight: '54px',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* 3. Contact & Communication */}
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <SectionHeader
                      icon={<EmailRoundedIcon sx={{ fontSize: 20 }} />}
                      title="Contact Information"
                      description="Verified contact channels for inquiries and site visits."
                    />
                    <Divider sx={{ mb: 3, borderColor: UI.border }} />

                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormInput
                          name="email"
                          label="Email Address"
                          control={control}
                          rules={{ required: 'Email address is required' }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormInput
                          name="mobile"
                          label="Mobile / WhatsApp Number"
                          control={control}
                          placeholder="+91 9876543210"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* 4. Action / Save Bar */}
                <Card
                  sx={{
                    ...cardSx,
                    p: { xs: 2, sm: 2.5 },
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: UI.primarySoft,
                          color: UI.primary,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <BadgeRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: UI.text }}>
                          Save Profile Updates
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: UI.muted }}>
                          All changes update across your live listings immediately.
                        </Typography>
                      </Box>
                    </Stack>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={<SaveRoundedIcon />}
                      sx={{
                        minHeight: 46,
                        px: 3.5,
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontWeight: 900,
                        fontSize: '0.92rem',
                        color: '#fff',
                        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
                        boxShadow: '0 8px 20px rgba(15,118,110,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                        },
                      }}
                    >
                      {submitting ? 'Saving Changes…' : 'Save Changes'}
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            {/* Right Sidebar Column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={3}>
                {/* Profile Strength Checklist */}
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: UI.text }}>
                          Profile Strength
                        </Typography>
                        <Chip
                          label={`${completion}%`}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            color: UI.primary,
                            background: UI.primarySoft,
                            border: `1px solid ${UI.primaryBorder}`,
                          }}
                        />
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
                            background: 'linear-gradient(90deg, #0F766E 0%, #22D3EE 100%)',
                          },
                        }}
                      />

                      <Typography sx={{ fontSize: '0.8rem', color: UI.muted, lineHeight: 1.5 }}>
                        Complete your contact and location details to establish credibility with prospective buyers.
                      </Typography>

                      <Divider sx={{ borderColor: UI.border }} />

                      <Stack spacing={1.2}>
                        {[
                          { ok: !!values.name, label: 'Full name verified' },
                          { ok: !!values.email, label: 'Email address added' },
                          { ok: !!values.mobile, label: 'Phone number added' },
                          { ok: !!(values.location || values.address), label: 'Street address / locality added' },
                          { ok: !!values.city && !!values.state, label: 'City and state added' },
                          { ok: !!(files[0]?.preview || user.photo), label: 'Profile photo uploaded' },
                        ].map((item) => (
                          <Stack key={item.label} direction="row" spacing={1.2} alignItems="center">
                            <TaskAltRoundedIcon
                              sx={{
                                fontSize: 18,
                                color: item.ok ? '#10B981' : '#CBD5E1',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '0.82rem',
                                color: item.ok ? UI.text : UI.muted,
                                fontWeight: item.ok ? 700 : 500,
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

                {/* Account Security & Quick Actions */}
                <Card sx={cardSx}>
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: UI.text, mb: 2 }}>
                      Security & Quick Access
                    </Typography>

                    <Stack spacing={1.5}>
                      <Button
                        fullWidth
                        onClick={() => navigate('/dashboard/change-password')}
                        startIcon={<LockResetRoundedIcon sx={{ color: UI.primary }} />}
                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          justifyContent: 'space-between',
                          p: 1.6,
                          borderRadius: '14px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: UI.text,
                          background: UI.surfaceSoft,
                          border: `1px solid ${UI.border}`,
                          '&:hover': { background: '#E2E8F0' },
                        }}
                      >
                        Change Password
                      </Button>

                      <Button
                        fullWidth
                        onClick={() => navigate('/dashboard/subscription')}
                        startIcon={<WorkspacePremiumRoundedIcon sx={{ color: UI.premium }} />}
                        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          justifyContent: 'space-between',
                          p: 1.6,
                          borderRadius: '14px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: UI.text,
                          background: UI.surfaceSoft,
                          border: `1px solid ${UI.border}`,
                          '&:hover': { background: '#E2E8F0' },
                        }}
                      >
                        Subscription & Invoices
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Trust & Verification Guarantee */}
                <Card
                  sx={{
                    ...cardSx,
                    p: 2.5,
                    background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
                    borderColor: '#A7F3D0',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <ShieldRoundedIcon sx={{ color: '#059669', fontSize: 26, mt: 0.2 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#065F46' }}>
                        EasyDeal Trusted Profile
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#047857', mt: 0.4, lineHeight: 1.5 }}>
                        Your information is encrypted and securely stored. Only approved contact details are shared with verified buyers.
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </Box>
  )
}