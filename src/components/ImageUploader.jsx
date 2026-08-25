
// src/components/ImageUploader.jsx
import { useRef, useState } from 'react'
import { Alert, Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { isSupportedImageFile, convertHeicIfNeeded, fileToBase64 } from '../utils/imageUtils'

const MAX_FILE_SIZE_BYTES = 40 * 1024 * 1024 // 40MB

// Props:
//   value    : (string | { file: File, preview: string, existing?: boolean })[]
//   onChange : (items) => void
//   max      : number — max images (default 5)
//   onSizeError : (msg: string) => void
export default function ImageUploader({
  value = [],
  onChange,
  max = 5,
  label = "Upload Photos",
  onSizeError,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleFiles = async (fileList) => {
    setLocalError('')
    if (onSizeError) onSizeError('')

    const rawList = Array.from(fileList)
    const files = rawList.filter((f) => isSupportedImageFile(f))
    if (!files.length) return

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

    const remaining = max - value.length
    if (remaining <= 0) return

    const toProcess = validFiles.slice(0, remaining)
    setProcessing(true)

    try {
      // Convert iPhone HEIC/HEIF files to standard JPEG for immediate browser preview & upload
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
      console.error('[ImageUploader] Processing error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleInputChange = (e) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleRemove = (idx) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const getPreviewUrl = (item) => {
    if (!item) return ''
    if (typeof item === 'string') return item
    if (item.preview) return item.preview
    if (item.file instanceof File) return URL.createObjectURL(item.file)
    return ''
  }

  return (
    <Box>
      {/* Drop zone */}
      {value.length < max && (
        <Box
          onClick={() => !processing && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragging ? '#0f766e' : 'rgba(148,163,184,0.4)'}`,
            borderRadius: '14px',
            p: 3,
            textAlign: 'center',
            cursor: processing ? 'wait' : 'pointer',
            background: dragging ? 'rgba(15,118,110,0.04)' : 'rgba(248,250,252,0.8)',
            transition: 'all .18s ease',
            '&:hover': { borderColor: '#0f766e', background: 'rgba(15,118,110,0.04)' },
            mb: 2,
            position: 'relative',
          }}
        >
          {processing ? (
            <Box sx={{ py: 1 }}>
              <CircularProgress size={30} sx={{ color: '#0f766e', mb: 1 }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                Optimizing photos...
              </Typography>
            </Box>
          ) : (
            <>
              <AddPhotoAlternateRoundedIcon sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                Click or drag images here
              </Typography>
              <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', mt: 0.5 }}>
                {value.length}/{max} images · JPG, PNG, WEBP, iPhone (HEIC), DSLR/RAW (Max 40MB)
              </Typography>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif,.HEIC,.HEIF,.dng,.DNG,.cr2,.CR2,.nef,.NEF,.arw,.ARW,.tiff,.TIFF,.bmp,.BMP"
            multiple
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </Box>
      )}


      {/* Local Error Alert */}

      {localError && (
        <Alert
          severity="warning"
          onClose={() => setLocalError('')}
          sx={{ mb: 2, borderRadius: '12px', fontSize: '0.85rem' }}
        >
          {localError}
        </Alert>
      )}

      {/* Preview thumbnails */}
      {value.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {value.map((item, i) => {
            const previewUrl = getPreviewUrl(item)
            return (
              <Box
                key={i}
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(226,232,240,0.9)',
                }}
              >
                <Box
                  component="img"
                  src={previewUrl}
                  alt={`preview-${i}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemove(i)}
                  sx={{
                    position: 'absolute', top: 2, right: 2,
                    width: 20, height: 20,
                    background: 'rgba(15,23,42,0.7)',
                    color: '#fff',
                    '&:hover': { background: 'rgba(239,68,68,0.85)' },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}