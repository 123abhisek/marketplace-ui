// src/utils/imageUtils.js

/**
 * Converts a single File object → base64 data URI string.
 * e.g. "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)   // reader.result = data URI
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

/**
 * Converts an array of File objects → array of base64 data URI strings.
 * Skips any entries that are already valid base64 or https URLs (safe to re-submit).
 * Rejects blob: and http://localhost URLs silently.
 *
 * @param {Array<File|string>} files  — mix of File objects and existing URL strings
 * @returns {Promise<string[]>}
 */
export async function filesToBase64(files = []) {
  if (!files || files.length === 0) return []

  const results = await Promise.allSettled(
    files.map((f) => {
      // Already a valid base64 data URI — keep as-is
      if (typeof f === 'string' && f.startsWith('data:image/')) return Promise.resolve(f)

      // Already a valid https URL (e.g. from a CDN) — keep as-is
      if (typeof f === 'string' && f.startsWith('https://')) return Promise.resolve(f)

      // ❌ blob: URL — created by URL.createObjectURL(), dies on reload
      if (typeof f === 'string' && f.startsWith('blob:')) {
        console.warn('[imageUtils] Rejected blob: URL — use File objects instead.', f)
        return Promise.resolve(null)
      }

      // ❌ localhost URL — only valid in current session
      if (typeof f === 'string' && f.includes('localhost')) {
        console.warn('[imageUtils] Rejected localhost URL.', f)
        return Promise.resolve(null)
      }

      // File object → convert to base64
      if (f instanceof File) return fileToBase64(f)

      // Unknown — skip
      console.warn('[imageUtils] Unrecognized image entry, skipping.', f)
      return Promise.resolve(null)
    })
  )

  return results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value)
}

/**
 * Creates a temporary object URL for previewing images in the UI ONLY.
 * ⚠️  NEVER store this URL in state that gets sent to the API.
 *     Use fileToBase64() for anything that goes to the backend.
 *
 * @param {File} file
 * @returns {string}  blob: URL for <img src> preview only
 */
export function fileToPreviewUrl(file) {
  return URL.createObjectURL(file)
}

/**
 * Revoke all preview blob URLs to free memory.
 * Call this in useEffect cleanup when the form unmounts.
 *
 * @param {string[]} previewUrls
 */
export function revokePreviewUrls(previewUrls = []) {
  previewUrls.forEach(url => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  })
}