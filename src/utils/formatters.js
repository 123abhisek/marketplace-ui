
// src/utils/formatters.js

/**
 * Format a number as Indian Rupees.
 * formatCurrency(8500000) → "₹85,00,000"
 * formatCurrency(499)     → "₹499"
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

/**
 * Truncate a string to maxLen characters, appending "…" if cut.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length <= maxLen ? str : `${str.slice(0, maxLen)}…`
}

/**
 * Format a date string/object to "DD MMM YYYY".
 * formatDate("2026-04-19T14:00:00") → "19 Apr 2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return ''
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    }).format(new Date(dateInput))
  } catch {
    return String(dateInput)
  }
}