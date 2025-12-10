import type { CornersStyle } from '@renderer/types'

interface CanvasExportProps {
  backgroundColor: string
  cornersStyle: CornersStyle
}

function CanvasExport({ backgroundColor, cornersStyle }: CanvasExportProps): JSX.Element {
  const getCanvas = (): HTMLCanvasElement | null =>
    document.querySelector('#qr-container canvas') as HTMLCanvasElement | null

  const download = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: filename })
    a.click()
    URL.revokeObjectURL(url)
  }

  const composeWithBackground = (qrCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const { width: w, height: h } = qrCanvas
    const out = Object.assign(document.createElement('canvas'), { width: w, height: h })
    const ctx = out.getContext('2d')!
    const radius = cornersStyle === 'rounded' ? Math.round(Math.min(w, h) * 0.08) : 0

    ctx.beginPath()
    ctx.roundRect(0, 0, w, h, radius)
    ctx.fillStyle = backgroundColor
    ctx.fill()
    if (radius > 0) ctx.clip()
    ctx.drawImage(qrCanvas, 0, 0)
    return out
  }

  const exportPNG = async (): Promise<void> => {
    const canvas = getCanvas()
    if (!canvas) return

    const composed = composeWithBackground(canvas)
    const blob = await new Promise<Blob | null>((resolve) => composed.toBlob(resolve, 'image/png'))
    if (blob) download(blob, `qrcode-${Date.now()}.png`)
  }

  const copyToClipboard = async (): Promise<void> => {
    const canvas = getCanvas()
    if (!canvas) return

    const composed = composeWithBackground(canvas)
    const blob = await new Promise<Blob | null>((resolve) => composed.toBlob(resolve, 'image/png'))
    if (!blob) return

    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    } catch {
      // Copie non supportée
    }
  }

  return (
    <section className="w-full h-12 flex items-center justify-center gap-3 bg-black border-zinc-800">
      <button
        onClick={exportPNG}
        className="px-3 py-2 text-sm rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        Exporter PNG
      </button>
      <button
        onClick={copyToClipboard}
        className="px-3 py-2 text-sm rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        Copier
      </button>
    </section>
  )
}

export default CanvasExport
