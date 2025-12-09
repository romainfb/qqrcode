// QR Code options
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

export const QR_SIZE = 400

// Save status
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
  centerImage?: string
}

export interface QRCodeData {
  id: string
  data: string
  dataUrl: string
  settings: QRSettings
  createdAt: number
}
