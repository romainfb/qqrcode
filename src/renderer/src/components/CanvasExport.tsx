
import type { CornersStyle } from '@renderer/types'

interface CanvasExportProps {
  backgroundColor: string
  cornersStyle: CornersStyle
}

function CanvasExport({ backgroundColor, cornersStyle }: CanvasExportProps): React.JSX.Element {
  const getCanvas = (): HTMLCanvasElement | null => {
    const container = document.getElementById('qr-container')
    if (!container) return null
    return container.querySelector('canvas') as HTMLCanvasElement | null
  }

  const download = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void => {
    const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2))
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const composeWithBackground = (qrCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const w = qrCanvas.width
    const h = qrCanvas.height
    const out = document.createElement('canvas')
    out.width = w
    out.height = h
    const ctx = out.getContext('2d')!

    const radius = cornersStyle === 'rounded' ? Math.round(Math.min(w, h) * 0.08) : 0

    if (radius > 0) {
      roundRect(ctx, 0, 0, w, h, radius)
      ctx.fillStyle = backgroundColor
      ctx.fill()
      roundRect(ctx, 0, 0, w, h, radius)
      ctx.clip()
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, w, h)
    }

    ctx.drawImage(qrCanvas, 0, 0)
    return out
  }

  const exportPNG = async (): Promise<void> => {
    const canvas = getCanvas()
    if (!canvas) {
      alert("Impossible de trouver le canvas du QR code.")
      return
    }

    const composed = composeWithBackground(canvas)
    const blob: Blob | null = await new Promise((resolve) => composed.toBlob(resolve as BlobCallback, 'image/png'))

    if (!blob) {
      alert('Export PNG échoué.')
      return
    }

    const filename = `qrcode-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
    download(blob, filename)
  }

  const copyToClipboard = async (): Promise<void> => {
    const canvas = getCanvas()
    if (!canvas) {
      alert("Impossible de trouver le canvas du QR code.")
      return
    }

    const composed = composeWithBackground(canvas)
    const blob: Blob | null = await new Promise((resolve) => composed.toBlob(resolve as BlobCallback, 'image/png'))

    if (!blob) {
      alert('Copie échouée: génération PNG impossible.')
      return
    }

    try {
      // @ts-ignore - ClipboardItem support browser dependent
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        // @ts-ignore
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        alert('Image copiée dans le presse-papiers.')
      }
    } catch {
      alert('Copie dans le presse-papiers non supportée.')
    }
  }

  return (
    <section className={'w-full h-12 flex items-center justify-center gap-3 bg-black border-zinc-800'}>
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
