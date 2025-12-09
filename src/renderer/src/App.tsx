import { useState, useEffect, useRef, useCallback, JSX } from 'react'
import type { QRSettings, CornersStyle, QRCodeData } from './types'
import InputArea from '@renderer/components/InputArea'
import Canvas from '@renderer/components/Canvas'
import ControlPanel from '@renderer/components/ControlPanel'
import HistoryPanel from '@renderer/components/HistoryPanel'

function App(): JSX.Element {
  const [input, setInput] = useState<string>('')
  const [data, setData] = useState<string>('QQRCode')
  const [settings, setSettings] = useState<QRSettings>({
    ecc: 'M',
    dotStyle: 'dots',
    foregroundColor: '#e5e7eb',
    backgroundColor: '#18181b',
    cornersStyle: 'rounded',
    centerImage: undefined
  })
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pendingSave, setPendingSave] = useState<{ data: string; settings: QRSettings } | null>(
    null
  )
  const getDataUrlRef = useRef<(() => Promise<string>) | null>(null)

  useEffect(() => {
    window.api.history.get().then(setHistory)
  }, [])

  useEffect(() => {
    if (!pendingSave || !getDataUrlRef.current) return

    const saveToHistory = async (): Promise<void> => {
      try {
        const dataUrl = await getDataUrlRef.current?.()
        if (dataUrl) {
          const newItem: QRCodeData = {
            id: crypto.randomUUID(),
            data: pendingSave.data,
            dataUrl,
            settings: { ...pendingSave.settings },
            createdAt: Date.now()
          }
          const newHistory = await window.api.history.add(newItem)
          setHistory(newHistory)
          setSelectedId(newItem.id)
        }
      } catch (error) {
        console.error('Failed to save QR code to history:', error)
      } finally {
        setPendingSave(null)
      }
    }

    saveToHistory()
  }, [pendingSave])

  const onGenerate = (): void => {
    const trimmed = input.trim()
    if (!trimmed) return
    setData(trimmed)
    setPendingSave({ data: trimmed, settings })
  }

  const onQRReady = useCallback((getDataUrl: () => Promise<string>): void => {
    getDataUrlRef.current = getDataUrl
  }, [])

  const onSelectHistory = (item: QRCodeData): void => {
    setData(item.data)
    setSettings(item.settings)
    setInput(item.data)
    setSelectedId(item.id)
  }

  const onCornersStyleChange = (v: CornersStyle): void =>
    setSettings((s) => ({ ...s, cornersStyle: v }))
  const onDotStyleChange = (v: 'dots' | 'square'): void =>
    setSettings((s) => ({ ...s, dotStyle: v }))
  const onEccChange = (v: 'L' | 'M' | 'Q' | 'H'): void => setSettings((s) => ({ ...s, ecc: v }))
  const onForegroundColorChange = (v: string): void =>
    setSettings((s) => ({ ...s, foregroundColor: v }))
  const onBackgroundColorChange = (v: string): void =>
    setSettings((s) => ({ ...s, backgroundColor: v }))
  const onCenterImageChange = (v: string | undefined): void =>
    setSettings((s) => ({ ...s, centerImage: v }))

  const generateDisabled = input.trim().length === 0

  return (
    <section className="h-screen w-screen bg-zinc-800 flex flex-col overflow-hidden">
      <InputArea
        value={input}
        onChange={setInput}
        onGenerate={onGenerate}
        disabled={generateDisabled}
      />
      <div className="flex w-full h-full flex-1">
        <HistoryPanel history={history} onSelect={onSelectHistory} selectedId={selectedId} />
        <div className="flex-1">
          <Canvas data={data} settings={settings} onQRReady={onQRReady} />
        </div>
        <ControlPanel
          cornersStyle={settings.cornersStyle}
          onCornersStyleChange={onCornersStyleChange}
          dotStyle={settings.dotStyle}
          onDotStyleChange={onDotStyleChange}
          ecc={settings.ecc}
          onEccChange={onEccChange}
          foregroundColor={settings.foregroundColor}
          onForegroundColorChange={onForegroundColorChange}
          backgroundColor={settings.backgroundColor}
          onBackgroundColorChange={onBackgroundColorChange}
          centerImage={settings.centerImage}
          onCenterImageChange={onCenterImageChange}
        />
      </div>
    </section>
  )
}

export default App
