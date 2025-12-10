import type { CornersStyle } from '@renderer/types'

export interface ComposeOptions {
  backgroundColor: string
  cornersStyle: CornersStyle
}

const DEFAULT_SELECTOR = '#qr-container canvas'

export const getQrCanvas = (selector: string = DEFAULT_SELECTOR): HTMLCanvasElement | null => {
  return document.querySelector(selector) as HTMLCanvasElement | null
}

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  a.click()
  URL.revokeObjectURL(url)
}

export const composeWithBackground = (
  qrCanvas: HTMLCanvasElement,
  { backgroundColor, cornersStyle }: ComposeOptions
): HTMLCanvasElement => {
  const { width: w, height: h } = qrCanvas
  const out = Object.assign(document.createElement('canvas'), {
    width: w,
    height: h
  })
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

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number
): Promise<Blob | null> => {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export const exportPNG = async (
  options: ComposeOptions,
  selector: string = DEFAULT_SELECTOR
): Promise<void> => {
  const canvas = getQrCanvas(selector)
  if (!canvas) return

  const composed = composeWithBackground(canvas, options)
  const blob = await canvasToBlob(composed, 'image/png')
  if (blob) downloadBlob(blob, `qrcode-${Date.now()}.png`)
}

export const copyQrToClipboard = async (
  options: ComposeOptions,
  selector: string = DEFAULT_SELECTOR
): Promise<void> => {
  const canvas = getQrCanvas(selector)
  if (!canvas) return

  const composed = composeWithBackground(canvas, options)
  const blob = await canvasToBlob(composed, 'image/png')
  if (!blob) return

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
  } catch {
    // Silently ignore copy failures
  }
}

export const printQr = (options: ComposeOptions, selector: string = DEFAULT_SELECTOR): void => {
  const canvas = getQrCanvas(selector)
  if (!canvas) return

  const composed = composeWithBackground(canvas, options)
  const dataUrl = composed.toDataURL('image/png')

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  if (iframe.contentDocument) {
    iframe.contentDocument.open()
    iframe.contentDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              img {
                max-width: 100%;
                max-height: 100vh;
                display: block;
                margin: auto;
                page-break-inside: avoid;
              }
            }
            @page { margin: 0.5in; }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="QR Code" />
        </body>
      </html>
    `)
    iframe.contentDocument.close()

    const img = iframe.contentDocument.querySelector('img')
    if (img) {
      img.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print()
          setTimeout(() => document.body.removeChild(iframe), 1000)
        }, 100)
      }
    }
  }
}
