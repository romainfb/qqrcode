// Fixture: Data URL valide pour PNG 1x1 pixel rouge
export const VALID_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

// Fixture: Data URL valide pour JPEG 1x1 pixel
export const VALID_JPEG_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q=='

// Fixture: Créer un QRCodeData mock
import type { QRCodeData, QRSettings } from '../src/shared/types'
import { DEFAULT_QR_SETTINGS } from '../src/shared/types'

export const createMockQRCodeData = (overrides?: Partial<QRCodeData>): QRCodeData => ({
  id: 'test-id-123',
  data: 'https://example.com',
  imagePath: 'qr-codes/test-id-123.png',
  settings: { ...DEFAULT_QR_SETTINGS },
  createdAt: Date.now(),
  ...overrides
})

export const createMockQRSettings = (overrides?: Partial<QRSettings>): QRSettings => ({
  ...DEFAULT_QR_SETTINGS,
  ...overrides
})
