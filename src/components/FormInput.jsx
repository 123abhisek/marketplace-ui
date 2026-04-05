// src/components/FormInput.jsx
import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'

export default function FormInput({
  name,
  control,
  label,
  rules,
  type = 'text',
  multiline = false,
  rows = 1,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          multiline={multiline}
          rows={rows}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ' '}
        />
      )}
    />
  )
}