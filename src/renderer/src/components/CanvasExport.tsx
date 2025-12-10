import type { CornersStyle } from '@renderer/types'
import { exportPNG, copyQrToClipboard, printQr } from '@renderer/lib/canvasExport'
import { JSX } from 'react'

interface CanvasExportProps {
  backgroundColor: string
  cornersStyle: CornersStyle
}

function CanvasExport({ backgroundColor, cornersStyle }: CanvasExportProps): JSX.Element {
  const options = { backgroundColor, cornersStyle }

  const onExportPNG = (): Promise<void> => exportPNG(options)
  const onCopy = (): Promise<void> => copyQrToClipboard(options)
  const onPrint = (): void => printQr(options)

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
