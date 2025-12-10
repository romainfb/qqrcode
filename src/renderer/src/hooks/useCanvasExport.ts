import { useCallback } from 'react'
import type { CornersStyle } from '@renderer/types'
import { copyQrToClipboard, exportPNG, printQr } from '@renderer/lib/canvasExport'

export interface UseCanvasExportOptions {
  backgroundColor: string
  cornersStyle: CornersStyle
}

export function useCanvasExport(options: UseCanvasExportOptions): {
  onExportPNG: () => Promise<void>
  onCopy: () => Promise<void>
  onPrint: () => void
} {
  const onExportPNG = useCallback(() => exportPNG(options), [options])
  const onCopy = useCallback(() => copyQrToClipboard(options), [options])
  const onPrint = useCallback(() => printQr(options), [options])

  return { onExportPNG, onCopy, onPrint }
}
