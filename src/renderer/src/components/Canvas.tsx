import { JSX, useEffect, useRef, useState } from 'react'
import type { CanvasProps } from '@renderer/types'
import { QR_SIZE } from '@shared/types'
import { CENTER_IMAGE_SIZE_RATIO, CENTER_IMAGE_MARGIN } from '@shared/constants'
import QRCodeStyling, { type Options } from 'qr-code-styling'

interface CanvasPropsWithCallback extends CanvasProps {
  onQRReady?: (getDataUrl: () => Promise<string>) => void
}

function Canvas({ data, settings, onQRReady }: CanvasPropsWithCallback): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const [centerImageDataUrl, setCenterImageDataUrl] = useState<string | undefined>()

  useEffect(() => {
    if (settings.centerImagePath) {
      window.api.asset
        .load(settings.centerImagePath)
        .then((d) => setTimeout(() => setCenterImageDataUrl(d), 0))
        .catch(console.error)
    } else {
      // Eviter setState synchrone dans l'effet
      setTimeout(() => setCenterImageDataUrl(undefined), 0)
    }
  }, [settings.centerImagePath])

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    const qrConfig: Partial<Options> = {
      width: QR_SIZE,
      height: QR_SIZE,
      data,
      qrOptions: { errorCorrectionLevel: settings.ecc },
      dotsOptions: { type: settings.dotStyle, color: settings.foregroundColor },
      cornersSquareOptions: {
        type: settings.cornersStyle === 'rounded' ? 'extra-rounded' : 'square',
        color: settings.foregroundColor
      },
      cornersDotOptions: {
        type: settings.cornersStyle === 'rounded' ? 'dot' : 'square',
        color: settings.foregroundColor
      },
      backgroundOptions: { color: 'transparent' }
    }

    if (centerImageDataUrl) {
      qrConfig.image = centerImageDataUrl
      qrConfig.imageOptions = {
        hideBackgroundDots: true,
        imageSize: CENTER_IMAGE_SIZE_RATIO,
        margin: CENTER_IMAGE_MARGIN
      }
    }

    const qr = new QRCodeStyling(qrConfig)
    qrRef.current = qr
    qr.append(containerRef.current)

    onQRReady?.(async () => {
      if (!qrRef.current) return ''
      const blob = await qrRef.current.getRawData('png')
      if (!(blob instanceof Blob)) return ''
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
    })
  }, [data, settings, centerImageDataUrl, onQRReady])

  return (
    <section
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div ref={containerRef} id="qr-container" />
    </section>
  )
}

export default Canvas
