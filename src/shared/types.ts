export const DOT_STYLES = ['dots', 'square'] as const
export type DotStyle = (typeof DOT_STYLES)[number]

export const DOT_STYLE_LABELS: Record<DotStyle, string> = {
  dots: 'Points',
  square: 'Carré'
}

export const ECC_LEVELS = ['L', 'M', 'Q', 'H'] as const
export type ECC = (typeof ECC_LEVELS)[number]

export const CORNERS_STYLES = ['square', 'rounded'] as const
export type CornersStyle = (typeof CORNERS_STYLES)[number]

export const CORNERS_STYLE_LABELS: Record<CornersStyle, string> = {
  square: 'Carré',
  rounded: 'Arrondi'
}

export { QR_SIZE } from './constants'

export const SAVE_STATUSES = ['idle', 'saving', 'saved'] as const
export type SaveStatus = (typeof SAVE_STATUSES)[number]

export const SAVE_STATUS_LABELS: Record<SaveStatus, string> = {
  idle: '',
  saving: 'Sauvegarde...',
  saved: 'Sauvegardé'
}

export interface QRSettings {
  ecc: ECC
  dotStyle: DotStyle
  foregroundColor: string
  backgroundColor: string
  cornersStyle: CornersStyle
  centerImagePath?: string
  // Secure QR code options
  isSecure?: boolean
  securePassword?: string
  secureExpiration?: '5m' | '30m' | '1h' | '1d'
  secureDownloads?: number
}

export const DEFAULT_QR_SETTINGS: QRSettings = {
  ecc: 'M',
  dotStyle: 'dots',
  foregroundColor: '#e5e7eb',
  backgroundColor: '#18181b',
  cornersStyle: 'rounded',
  centerImagePath: undefined,
  isSecure: false,
  secureExpiration: '30m',
  secureDownloads: 1
}

export interface QRCodeData {
  id: string
  data: string
  imagePath: string
  settings: QRSettings
  createdAt: number
}

export const TOAST_TYPES = ['success', 'error', 'info'] as const
export type ToastType = (typeof TOAST_TYPES)[number]

export interface Toast {
  id: string
  message: string
  type: ToastType
}
