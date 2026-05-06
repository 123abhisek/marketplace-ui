
// src/components/ImageUploader.jsx
import { useRef, useState } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

// Converts a File → base64 data URI
function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

// Props:
//   value    : string[]  — controlled array of base64 strings
//   onChange : (string[]) => void
//   max      : number    — max images (default 5)
export default function ImageUploader({ value = [], onChange, max = 5 }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const remaining = max - value.length
    const toProcess = files.slice(0, remaining)
    const base64s = await Promise.all(toProcess.map(fileToBase64))
    onChange([...value, ...base64s])
  }

  const handleInputChange = (e) => {
    handleFiles(e.target.files)
    // reset input so same file can be re-selected
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

  return (
    <Box>
      {/* Drop zone */}
      {value.length < max && (
        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragging ? '#0f766e' : 'rgba(148,163,184,0.4)'}`,
            borderRadius: '14px',
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(15,118,110,0.04)' : 'rgba(248,250,252,0.8)',
            transition: 'all .18s ease',
            '&:hover': { borderColor: '#0f766e', background: 'rgba(15,118,110,0.04)' },
            mb: 2,
          }}
        >
          <AddPhotoAlternateRoundedIcon sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
            Click or drag images here
          </Typography>
          <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', mt: 0.5 }}>
            {value.length}/{max} images · JPG, PNG, WEBP
          </Typography>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
        </Box>
      )}

      {/* Preview thumbnails */}
      {value.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {value.map((src, i) => (
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
                src={src}
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
          ))}
        </Stack>
      )}
    </Box>
  )
}