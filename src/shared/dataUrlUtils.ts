/**
 * Utilities for converting between data URLs, Buffers, and Blobs
 */

export interface ParsedDataUrl {
  buffer: Buffer
  extension: string
}

/**
 * Allowed image formats for security (SEC-003: whitelist approach)
 */
const ALLOWED_FORMATS = ['png', 'jpeg', 'jpg', 'gif', 'webp'] as const
type AllowedFormat = (typeof ALLOWED_FORMATS)[number]

/**
 * Convert a data URL to a Buffer
 * @param dataUrl - Data URL to convert (e.g., "data:image/png;base64,...")
 * @returns Parsed buffer and extension
 * @throws Error if format is invalid or not allowed
 */
export function dataUrlToBuffer(dataUrl: string): ParsedDataUrl {
  // SEC-003: Use strict regex with whitelist of allowed formats
  const matches = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/)
  if (!matches) {
    throw new Error('Invalid data URL format')
  }

  const extension = matches[1]
  if (!ALLOWED_FORMATS.includes(extension as AllowedFormat)) {
    throw new Error(`Unsupported image format: ${extension}`)
  }

  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')
  return { buffer, extension }
}

/**
 * Convert a Buffer to a data URL
 * @param buffer - Buffer containing image data
 * @param extension - Image extension (e.g., 'png', 'jpeg')
 * @returns Data URL string
 */
export function bufferToDataUrl(buffer: Buffer, extension: string): string {
  const base64 = buffer.toString('base64')
  return `data:image/${extension};base64,${base64}`
}

/**
 * Convert a Blob to a data URL (browser-side)
 * @param blob - Blob to convert
 * @returns Promise resolving to data URL string
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
