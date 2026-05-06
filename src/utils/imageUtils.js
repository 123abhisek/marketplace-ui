// // src/utils/imageUtils.js

// /**
//  * Converts a single File object → base64 data URI string.
//  * e.g. "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
//  *
//  * @param {File} file
//  * @returns {Promise<string>}
//  */
// export function fileToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onload  = () => resolve(reader.result)   // reader.result = data URI
//     reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
//     reader.readAsDataURL(file)
//   })
// }

// /**
//  * Converts an array of File objects → array of base64 data URI strings.
//  * Skips any entries that are already valid base64 or https URLs (safe to re-submit).
//  * Rejects blob: and http://localhost URLs silently.
//  *
//  * @param {Array<File|string>} files  — mix of File objects and existing URL strings
//  * @returns {Promise<string[]>}
//  */
// export async function filesToBase64(files = []) {
//   if (!files || files.length === 0) return []

//   const results = await Promise.allSettled(
//     files.map((f) => {
//       // Already a valid base64 data URI — keep as-is
//       if (typeof f === 'string' && f.startsWith('data:image/')) return Promise.resolve(f)

//       // Already a valid https URL (e.g. from a CDN) — keep as-is
//       if (typeof f === 'string' && f.startsWith('https://')) return Promise.resolve(f)

//       // ❌ blob: URL — created by URL.createObjectURL(), dies on reload
//       if (typeof f === 'string' && f.startsWith('blob:')) {
//         console.warn('[imageUtils] Rejected blob: URL — use File objects instead.', f)
//         return Promise.resolve(null)
//       }

//       // ❌ localhost URL — only valid in current session
//       if (typeof f === 'string' && f.includes('localhost')) {
//         console.warn('[imageUtils] Rejected localhost URL.', f)
//         return Promise.resolve(null)
//       }

//       // File object → convert to base64
//       if (f instanceof File) return fileToBase64(f)

//       // Unknown — skip
//       console.warn('[imageUtils] Unrecognized image entry, skipping.', f)
//       return Promise.resolve(null)
//     })
//   )

//   return results
//     .filter(r => r.status === 'fulfilled' && r.value !== null)
//     .map(r => r.value)
// }

// /**
//  * Creates a temporary object URL for previewing images in the UI ONLY.
//  * ⚠️  NEVER store this URL in state that gets sent to the API.
//  *     Use fileToBase64() for anything that goes to the backend.
//  *
//  * @param {File} file
//  * @returns {string}  blob: URL for <img src> preview only
//  */
// export function fileToPreviewUrl(file) {
//   return URL.createObjectURL(file)
// }

// /**
//  * Revoke all preview blob URLs to free memory.
//  * Call this in useEffect cleanup when the form unmounts.
//  *
//  * @param {string[]} previewUrls
//  */
// export function revokePreviewUrls(previewUrls = []) {
//   previewUrls.forEach(url => {
//     if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
//   })
// }




// src/utils/imageUtils.js

const SUPPORTED_MIME_TYPES = [
  'data:image/jpeg;base64,',
  'data:image/jpg;base64,',
  'data:image/png;base64,',
  'data:image/webp;base64,',
  'data:image/gif;base64,',
  'data:image/avif;base64,',
]

/**
 * Returns true if the string is a supported base64 data URI.
 * Rejects SVG and other potentially unsafe types.
 * @param {string} str
 * @returns {boolean}
 */
function isSupportedBase64(str) {
  return SUPPORTED_MIME_TYPES.some((prefix) => str.startsWith(prefix))
}

/**
 * Converts a single File object → base64 data URI string.
 * e.g. "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  // ✅ Bug Fix 5: guard against non-File input
  if (!(file instanceof File)) {
    return Promise.reject(new Error(`fileToBase64: expected a File object, got ${typeof file}`))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result) // reader.result = full data URI

    // ✅ Bug Fix 1: reject with a clean Error message, not the raw ProgressEvent
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))

    // readAsDataURL must be called AFTER handlers are assigned
    reader.readAsDataURL(file)
  })
}

/**
 * Converts an array of File objects → array of base64 data URI strings.
 * Skips any entries that are already valid base64 or https URLs (safe to re-submit).
 * Rejects blob:, http://, and localhost URLs with a console warning.
 *
 * @param {Array<File|string>} files  — mix of File objects and existing URL strings
 * @returns {Promise<string[]>}       — always resolves; never rejects
 */
export async function filesToBase64(files = []) {
  if (!files || files.length === 0) return []

  const results = await Promise.allSettled(
    files.map((f) => {
      // ✅ Already a supported base64 data URI — keep as-is
      if (typeof f === 'string' && isSupportedBase64(f)) return Promise.resolve(f)

      // ✅ Bug Fix 4: reject unsupported data: URIs (e.g. data:image/svg+xml — XSS risk)
      if (typeof f === 'string' && f.startsWith('data:')) {
        console.warn('[imageUtils] Rejected unsupported or unsafe data: URI type.', f.slice(0, 50))
        return Promise.resolve(null)
      }

      // ✅ Already a valid https URL (e.g. from a CDN) — keep as-is
      if (typeof f === 'string' && f.startsWith('https://')) return Promise.resolve(f)

      // ❌ blob: URL — created by URL.createObjectURL(), dies on reload
      if (typeof f === 'string' && f.startsWith('blob:')) {
        console.warn('[imageUtils] Rejected blob: URL — use File objects instead.', f)
        return Promise.resolve(null)
      }

      // ✅ Bug Fix 3: also reject plain http:// URLs (non-https), not just localhost
      if (typeof f === 'string' && f.startsWith('http://')) {
        console.warn('[imageUtils] Rejected insecure http:// URL — use https:// or File objects.', f)
        return Promise.resolve(null)
      }

      // ❌ localhost URL — only valid in current session
      if (typeof f === 'string' && f.includes('localhost')) {
        console.warn('[imageUtils] Rejected localhost URL.', f)
        return Promise.resolve(null)
      }

      // ✅ File object → convert to base64
      if (f instanceof File) return fileToBase64(f)

      // Unknown — skip
      console.warn('[imageUtils] Unrecognized image entry, skipping.', f)
      return Promise.resolve(null)
    })
  )

  // ✅ Bug Fix 2: log rejected promises so silent failures become visible
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[imageUtils] Failed to convert file at index ${i}:`, r.reason)
    }
  })

  return results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value)
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
  // ✅ Bug Fix 5: guard prevents silent TypeError crash
  if (!(file instanceof File)) {
    console.error('[imageUtils] fileToPreviewUrl: expected a File object, got', typeof file)
    return ''
  }
  return URL.createObjectURL(file)
}

/**
 * Revoke all preview blob URLs to free memory.
 * Call this in useEffect cleanup when the form unmounts.
 *
 * @param {string[]} previewUrls
 */
export function revokePreviewUrls(previewUrls = []) {
  previewUrls.forEach((url) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  })
}