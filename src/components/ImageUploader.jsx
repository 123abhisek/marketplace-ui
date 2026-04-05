// src/components/ImageUploader.jsx
import { useDropzone } from 'react-dropzone'
import { Box, Chip, Stack, Typography } from '@mui/material'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'

export default function ImageUploader({ value = [], onChange, label = 'Upload images' }) {
  const onDrop = (acceptedFiles) => {
    const next = [
      ...value,
      ...acceptedFiles.map((file) => ({
        name: file.name,
        preview: URL.createObjectURL(file),
      })),
    ]
    onChange(next)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  })

  return (
    <Stack spacing={2}>
      <Box
        {...getRootProps()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition ${
          isDragActive ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 42 }} />
        <Typography fontWeight={700}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          Drag & drop or click to select images
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {value.map((file, index) => (
          <Chip key={`${file.name}-${index}`} label={file.name} />
        ))}
      </Stack>
    </Stack>
  )
}