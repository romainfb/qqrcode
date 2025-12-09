export type DotStyle = 'dots' | 'square'
export type ECC = 'L' | 'M' | 'Q' | 'H'
export type CornersStyle = 'square' | 'rounded'

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

