import { useEffect, useRef, JSX } from 'react'
import type { CanvasProps } from '@renderer/types'
import QRCodeStyling from 'qr-code-styling'

interface CanvasPropsWithCallback extends CanvasProps {
  onQRReady?: (getDataUrl: () => Promise<string>) => void
}

function Canvas({ data, settings, onQRReady }: CanvasPropsWithCallback): JSX.Element {
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

    // Notifie le parent avec une fonction pour obtenir le dataUrl
    if (onQRReady) {
      onQRReady(async () => {
        if (!qrRef.current) return ''
        const blob = await qrRef.current.getRawData('png')
        if (!(blob instanceof Blob)) return ''
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      })
    }
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

