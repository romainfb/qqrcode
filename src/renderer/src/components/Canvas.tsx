import { JSX, useEffect, useRef } from 'react'
import type { CanvasProps } from '@renderer/types'
import { QR_SIZE } from '@shared/types'
import { CENTER_IMAGE_SIZE_RATIO, CENTER_IMAGE_MARGIN } from '@shared/constants'
import { useAssetLoader } from '@renderer/hooks/useAssetLoader'
import { blobToDataUrl } from '@shared/dataUrlUtils'
import QRCodeStyling, { type Options } from 'qr-code-styling'

interface CanvasPropsWithCallback extends CanvasProps {
  onQRReady?: (getDataUrl: () => Promise<string>) => void
}

function Canvas({ data, settings, onQRReady }: CanvasPropsWithCallback): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const centerImageDataUrl = useAssetLoader(settings.centerImagePath)

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
      return blobToDataUrl(blob)
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
