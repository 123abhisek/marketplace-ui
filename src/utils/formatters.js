// src/utils/formatters.js
export const formatCurrency = (value) => {
  if (!value) return '₹0'
  const number = String(value).replace(/[^\d]/g, '')
  return `₹${Number(number).toLocaleString('en-IN')}`
}

export const shortLocation = (city, state) =>
  [city, state].filter(Boolean).join(', ')