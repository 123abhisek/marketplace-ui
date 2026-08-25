
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
 * Compresses and resizes an image File using HTML5 canvas before uploading.
 * Converts 10MB+ phone camera pictures down to ~100KB-250KB without visual quality loss.
 *
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} Base64 Data URL
 */
export function compressImageToBase64(file, maxWidth = 1280, maxHeight = 1280, quality = 0.75) {
  if (!(file instanceof File)) {
    return Promise.reject(new Error(`compressImageToBase64: expected a File object, got ${typeof file}`))
  }

  // Non-image files or GIFs (preserve animation)
  if (file.type === 'image/gif') {
    return fileToBase64(file)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => {
        // Fallback to standard base64 if image decoding fails
        fileToBase64(file).then(resolve).catch(reject)
      }
      img.onload = () => {
        try {
          let width = img.width
          let height = img.height

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, width)
          canvas.height = Math.max(1, height)
          const ctx = canvas.getContext('2d')

          // Fill white background for transparent images
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Output as JPEG for high compression
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        } catch (err) {
          // Fallback if canvas fails
          fileToBase64(file).then(resolve).catch(reject)
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Converts a single File object → base64 data URI string with compression.
 * e.g. "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  if (!(file instanceof File)) {
    return Promise.reject(new Error(`fileToBase64: expected a File object, got ${typeof file}`))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

/**
 * Converts an array of File objects → array of compressed base64 data URI strings.
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

      // ✅ File object → compress & convert to base64
      if (f instanceof File) return compressImageToBase64(f)

      // Unknown — skip
      console.warn('[imageUtils] Unrecognized image entry, skipping.', f)
      return Promise.resolve(null)
    })
  )

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