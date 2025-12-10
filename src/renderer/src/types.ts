export type {
  DotStyle,
  ECC,
  CornersStyle,
  QRSettings,
  QRCodeData,
  SaveStatus
} from '../../shared/types'
export {
  DOT_STYLES,
  DOT_STYLE_LABELS,
  ECC_LEVELS,
  CORNERS_STYLES,
  CORNERS_STYLE_LABELS,
  QR_SIZE,
  SAVE_STATUSES,
  SAVE_STATUS_LABELS
} from '../../shared/types'
import type { QRSettings } from '../../shared/types'

export interface CanvasProps {
  data: string
  settings: QRSettings
}

export interface ControlPanelProps {
  settings: QRSettings
  onSettingChange: <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => void
}

export interface InputAreaProps {
  value: string
  onChange: (v: string) => void
  onGenerate: () => void
  disabled?: boolean
}
