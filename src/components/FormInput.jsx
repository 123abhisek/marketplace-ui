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
  placeholder,
  disabled = false,
  sx = {},
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          fullWidth
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          label={label}
          multiline={multiline}
          rows={rows}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ' '}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: multiline ? "auto" : "54px",
              minHeight: multiline ? "auto" : "54px",
              borderRadius: "12px",
            },
            "& .MuiOutlinedInput-input": {
              height: multiline ? "auto" : "54px",
              boxSizing: "border-box",
              py: multiline ? undefined : 0,
            },
            ...sx,
          }}

          {...props}
        />
      )}
    />
  )
}