// src/components/SelectInput.jsx
import { Controller } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'

export default function SelectInput({
  name,
  control,
  label,
  options = [],
  rules,
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
          select
          fullWidth
          disabled={disabled}
          label={label}
          InputLabelProps={{
            shrink: Boolean(field.value) || Boolean(placeholder),
          }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || " "}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: "54px",
              minHeight: "54px",
              borderRadius: "12px",
            },
            "& .MuiSelect-select": {
              height: "54px !important",
              minHeight: "54px !important",
              display: "flex",
              alignItems: "center",
              py: "0 !important",
              boxSizing: "border-box",
            },
            ...sx,
          }}
          SelectProps={{
            displayEmpty: Boolean(placeholder),
            renderValue: (selected) => {
              if (!selected || selected === "") {
                return placeholder ? (
                  <span style={{ color: "#94a3b8" }}>{placeholder}</span>
                ) : null;
              }
              const matched = options.find((opt) => String(opt.value) === String(selected));
              return matched ? matched.label : selected;
            },
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 320,
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                },
              },
            },
          }}
          {...props}
        >
          {placeholder && (
            <MenuItem value="" disabled sx={{ color: "#94a3b8" }}>
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
