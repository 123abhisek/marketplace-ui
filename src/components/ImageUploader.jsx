import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { isSupportedImageFile, convertHeicIfNeeded, fileToBase64 } from '../utils/imageUtils'
import { isMobileOrApp } from '../utils/appMode'

const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024 // 40MB

/**
 * Mobile-optimized, touch-friendly Image Uploader.
 * Works seamlessly in Mobile WebViews, Android/iOS browsers, and Desktop.
 *
 * Props:
 *   value       : (string | { file: File, preview: string, existing?: boolean })[]
 *   onChange    : (items) => void
 *   max         : number — maximum images allowed (default 5)
 *   label       : string — button label (default "Add Photos")
 *   onSizeError : (msg: string) => void
 */
export default function ImageUploader({
  value = [],
  onChange,
  max = 5,
  label = 'Add Photos',
  onSizeError,
}) {
  const fileInputRef = useRef(null)
  const [localError, setLocalError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(() => isMobileOrApp())

  useEffect(() => {
    const checkEnvironment = () => {
      const mobileStatus =
        isMobileOrApp() ||
        (typeof window !== 'undefined' && window.innerWidth < 768)
      setIsMobile(mobileStatus)
    }
    checkEnvironment()
    window.addEventListener('resize', checkEnvironment)
    return () => window.removeEventListener('resize', checkEnvironment)
  }, [])

  const handleFiles = async (fileList) => {
    setLocalError('')
    if (onSizeError) onSizeError('')

    if (!fileList || !fileList.length) return
    const rawList = Array.from(fileList)

    // Filter for valid image formats
    const files = rawList.filter((f) => isSupportedImageFile(f))
    if (!files.length) {
      setLocalError('Please select valid image files (JPG, PNG, WEBP, HEIC).')
      return
    }

    // ── 40MB File Size Validation ──────────────────────────────────
    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES)
    if (oversizedFiles.length > 0) {
      const errorMsg = 'Please upload images below 40MB size.'
      setLocalError(errorMsg)
      if (onSizeError) onSizeError(errorMsg)
      return
    }

    const validFiles = files.filter((f) => f.size <= MAX_FILE_SIZE_BYTES)
    if (!validFiles.length) return

    const remainingSlots = max - value.length
    if (remainingSlots <= 0) {
      setLocalError(`You can upload a maximum of ${max} photos.`)
      return
    }

    const toProcess = validFiles.slice(0, remainingSlots)
    setProcessing(true)

    try {
      // Convert Apple HEIC/HEIF files to standard JPEG for immediate preview & upload
      const convertedFiles = await Promise.all(
        toProcess.map(async (file) => {
          return await convertHeicIfNeeded(file)
        })
      )

      const usesObjects = value.some((v) => typeof v === 'object' && v !== null)
      if (usesObjects || value.length === 0) {
        const newItems = convertedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          existing: false,
        }))
        onChange([...value, ...newItems])
      } else {
        const base64s = await Promise.all(convertedFiles.map(fileToBase64))
        onChange([...value, ...base64s])
      }
    } catch (err) {
      console.error('[ImageUploader] Image processing error:', err)
      setLocalError('Failed to process one or more images. Please try again.')
    } finally {
      setProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (indexToRemove) => {
    setLocalError('')
    const updated = value.filter((_, i) => i !== indexToRemove)
    onChange(updated)
  }

  const getPreviewUrl = (item) => {
    if (!item) return ''
    if (typeof item === 'string') return item
    if (item.preview) return item.preview
    if (item.file instanceof File) return URL.createObjectURL(item.file)
    return ''
  }

  const getFileName = (item, index) => {
    if (item?.file?.name) return item.file.name
    if (typeof item === 'string' && item.startsWith('http')) {
      const parts = item.split('/')
      return parts[parts.length - 1] || `Photo ${index + 1}`
    }
    return `Photo ${index + 1}`
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!processing && canAddMore) {
      setDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (processing || !canAddMore) return
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const canAddMore = value.length < max

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── 1. Upload Trigger UI ── */}
      {isMobile ? (
        /* ────────────── ANDROID / MOBILE: ONLY UPLOAD BUTTON ────────────── */
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            background: '#F8FAFC',
            mb: 2.5,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            {/* Counter & Format Info */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhotoLibraryRoundedIcon sx={{ fontSize: 20, color: '#0F766E' }} />
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  {value.length === 0 ? 'No photos selected' : `${value.length} of ${max} photos selected`}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.4 }}>
                Supported formats: JPG, PNG, WEBP, HEIC · Max 40MB per photo
              </Typography>
            </Box>

            {/* Touch-Only Upload Button (No Drag UI) */}
            {canAddMore && (
              <Button
                component="label"
                variant="contained"
                disabled={processing}
                startIcon={
                  processing ? (
                    <CircularProgress size={18} sx={{ color: '#FFFFFF' }} />
                  ) : (
                    <AddPhotoAlternateRoundedIcon sx={{ fontSize: 20 }} />
                  )
                }
                sx={{
                  background: '#0F766E',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1.2,
                  boxShadow: '0 2px 8px rgba(15,118,110,0.25)',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    background: '#0D9488',
                  },
                  '&.Mui-disabled': {
                    background: '#94A3B8',
                    color: '#FFFFFF',
                  },
                }}
              >
                {processing ? 'Optimizing...' : `+ ${label}`}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  style={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                  }}
                  onChange={handleInputChange}
                  onClick={(e) => {
                    e.target.value = null
                  }}
                />
              </Button>
            )}
          </Stack>
        </Box>
      ) : (
        /* ────────────── WEB: UPLOAD / DRAG & DROP ZONE ────────────── */
        canAddMore && (
          <Box
            onClick={() => !processing && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragging ? '#0F766E' : '#CBD5E1'}`,
              borderRadius: '16px',
              p: { xs: 2.5, sm: 4 },
              textAlign: 'center',
              cursor: processing ? 'wait' : 'pointer',
              background: dragging ? 'rgba(15,118,110,0.06)' : '#F8FAFC',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#0F766E',
                background: 'rgba(15,118,110,0.03)',
              },
              mb: 2.5,
              position: 'relative',
            }}
          >
            {processing ? (
              <Box sx={{ py: 1.5 }}>
                <CircularProgress size={32} sx={{ color: '#0F766E', mb: 1.5 }} />
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
                  Optimizing photos...
                </Typography>
              </Box>
            ) : (
              <>
                <CloudUploadRoundedIcon
                  sx={{
                    fontSize: 48,
                    color: '#0F766E',
                    mb: 1.2,
                    opacity: dragging ? 1 : 0.85,
                  }}
                />
                <Typography sx={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                  Click to upload or drag and drop photos here
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.6 }}>
                  {value.length === 0
                    ? `Upload up to ${max} photos`
                    : `${value.length} of ${max} photos added`} · Supports JPG, PNG, WEBP, HEIC (Max 40MB per photo)
                </Typography>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              style={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              onChange={handleInputChange}
              onClick={(e) => {
                e.target.value = null
              }}
            />
          </Box>
        )
      )}

      {/* ── 2. Error Message Alert ── */}
      {localError && (
        <Alert
          severity="warning"
          onClose={() => setLocalError('')}
          sx={{
            mb: 2.5,
            borderRadius: '12px',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          {localError}
        </Alert>
      )}

      {/* ── 3. Selected Photos Responsive Grid ── */}
      {value.length > 0 && (
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: 2,
            }}
          >
            {value.map((item, index) => {
              const previewUrl = getPreviewUrl(item)
              const fileName = getFileName(item, index)
              const isCover = index === 0

              return (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    border: isCover ? '2px solid #0F766E' : '1.5px solid #E2E8F0',
                    boxShadow: isCover
                      ? '0 4px 12px rgba(15,118,110,0.15)'
                      : '0 2px 6px rgba(15,23,42,0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {/* Photo Thumbnail */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '80%', // 4:3 ratio
                      background: '#F1F5F9',
                    }}
                  >
                    <Box
                      component="img"
                      src={previewUrl}
                      alt={`Photo ${index + 1}`}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>

                  {/* Cover Badge on 1st Photo */}
                  {isCover && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#0F766E',
                        color: '#FFFFFF',
                        px: 1,
                        py: 0.3,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.4,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 12 }} />
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: 0.3 }}>
                        COVER
                      </Typography>
                    </Box>
                  )}

                  {/* High-Contrast Delete / Remove Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove photo ${index + 1}`}
                    sx={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      background: 'rgba(15,23,42,0.75)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        background: '#EF4444',
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>

                  {/* File Label / Index Footer */}
                  <Box sx={{ p: 1, background: '#FFFFFF' }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#334155',
                      }}
                    >
                      {fileName}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}