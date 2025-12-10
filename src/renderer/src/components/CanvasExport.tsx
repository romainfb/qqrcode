import type { CornersStyle } from '@renderer/types'
import { JSX } from 'react'

interface CanvasExportProps {
  backgroundColor: string
  cornersStyle: CornersStyle
  onExportPNG: () => Promise<void>
  onCopy: () => Promise<void>
  onPrint: () => void
}

function CanvasExport({
  backgroundColor,
  cornersStyle,
  onExportPNG,
  onCopy,
  onPrint
}: CanvasExportProps): JSX.Element {
  // UI only: options are displayed for information or potential future use; logic is injected via props callbacks
  void backgroundColor
  void cornersStyle

  const buttonClassName =
    'flex-1 min-w-0 px-3 py-2 text-sm rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 transition-colors whitespace-nowrap overflow-hidden text-ellipsis'

  return (
    <section className="w-full h-12 flex items-center justify-center gap-3 bg-black border-zinc-800">
      <button onClick={onExportPNG} className={buttonClassName} title="Exporter PNG">
        Exporter PNG
      </button>
      <button onClick={onCopy} className={buttonClassName} title="Copier">
        Copier
      </button>
      <button onClick={onPrint} className={buttonClassName} title="Imprimer">
        Imprimer
      </button>
    </section>
  )
}

export default CanvasExport
