import { useEffect, useRef } from 'react'
import type { CanvasProps } from '@renderer/types'
import QRCodeStyling from 'qr-code-styling'

function Canvas({ data, settings }: CanvasProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  const SIZE = 400

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    const qrConfig: any = {
      width: SIZE,
      height: SIZE,
      data,
      qrOptions: {
        errorCorrectionLevel: settings.ecc
      },
      dotsOptions: {
        type: settings.dotStyle,
        color: settings.foregroundColor
      },
      cornersSquareOptions: {
        type: settings.cornersStyle === 'rounded' ? 'extra-rounded' : 'square',
        color: settings.foregroundColor
      },
      cornersDotOptions: {
        type: settings.cornersStyle === 'rounded' ? 'dot' : 'square',
        color: settings.foregroundColor
      },
      backgroundOptions: {
        color: 'transparent'
      }
    }

    if (settings.centerImage) {
      qrConfig.image = settings.centerImage
      qrConfig.imageOptions = {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 8
      }
    }

    const qr = new QRCodeStyling(qrConfig)
    qrRef.current = qr
    qr.append(containerRef.current)
  }, [data, settings])

  return (
    <section
      className={'w-full h-full flex items-center justify-center'}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div ref={containerRef} />
    </section>
  )
}

export default Canvas
