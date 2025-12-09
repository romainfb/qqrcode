import { useEffect, useRef } from 'react'
import type { CanvasProps } from '@renderer/types'
import QRCodeStyling from 'qr-code-styling'

function Canvas({ data, settings }: CanvasProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  const SIZE = 400

  const cornersSquareType = settings.cornersStyle === 'rounded' ? 'extra-rounded' : 'square'
  const cornersDotType = settings.cornersStyle === 'rounded' ? 'dot' : 'square'

  useEffect(() => {
    if (!containerRef.current || qrRef.current) return

    const qr = new QRCodeStyling({
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
        type: cornersSquareType as any,
        color: settings.foregroundColor
      },
      cornersDotOptions: {
        type: cornersDotType as any,
        color: settings.foregroundColor
      },
      backgroundOptions: {
        color: 'transparent'
      }
    })

    qrRef.current = qr
    qr.append(containerRef.current)
  }, [])

  useEffect(() => {
    if (!qrRef.current) return

    qrRef.current.update({
      width: SIZE,
      height: SIZE,
      data,
      qrOptions: { errorCorrectionLevel: settings.ecc },
      dotsOptions: { type: settings.dotStyle as any, color: settings.foregroundColor },
      cornersSquareOptions: {
        type: settings.cornersStyle === 'rounded' ? 'extra-rounded' : 'square',
        color: settings.foregroundColor
      },
      cornersDotOptions: {
        type: settings.cornersStyle === 'rounded' ? 'dot' : 'square',
        color: settings.foregroundColor
      },
      backgroundOptions: { color: 'transparent' }
    } as any)
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
