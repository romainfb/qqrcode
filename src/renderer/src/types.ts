export type { DotStyle, ECC, CornersStyle, QRSettings, QRCodeData } from '../../shared/types'
import type { CornersStyle, DotStyle, ECC, QRSettings } from '../../shared/types'

export interface CanvasProps {
  data: string
  settings: QRSettings
}

export interface ControlPanelProps {
  cornersStyle: CornersStyle
  onCornersStyleChange: (v: CornersStyle) => void
  dotStyle: DotStyle
  onDotStyleChange: (v: DotStyle) => void
  ecc: ECC
  onEccChange: (v: ECC) => void
  foregroundColor: string
  onForegroundColorChange: (v: string) => void
  backgroundColor: string
  onBackgroundColorChange: (v: string) => void
  centerImage?: string
  onCenterImageChange: (v: string | undefined) => void
}

export interface InputAreaProps {
  value: string
  onChange: (v: string) => void
  onGenerate: () => void
  disabled?: boolean
}

