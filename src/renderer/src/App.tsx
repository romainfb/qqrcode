import { useState } from 'react'
import type { QRSettings, CornersStyle } from './types'
import InputArea from '@renderer/components/InputArea'
import Canvas from '@renderer/components/Canvas'
import ControlPanel from '@renderer/components/ControlPanel'

function App(): React.JSX.Element {
  const [input, setInput] = useState<string>('')
  const [data, setData] = useState<string>('QQRCode')
  const [settings, setSettings] = useState<QRSettings>({
    ecc: 'M',
    dotStyle: 'square',
    foregroundColor: '#e5e7eb',
    backgroundColor: '#18181b',
    cornersStyle: 'square',
    centerImage: undefined
  })

  const onGenerate = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setData(trimmed)
  }

  const onCornersStyleChange = (v: CornersStyle) => setSettings((s) => ({ ...s, cornersStyle: v }))
  const onDotStyleChange = (v: 'dots' | 'square') => setSettings((s) => ({ ...s, dotStyle: v }))
  const onEccChange = (v: 'L' | 'M' | 'Q' | 'H') => setSettings((s) => ({ ...s, ecc: v }))
  const onForegroundColorChange = (v: string) => setSettings((s) => ({ ...s, foregroundColor: v }))
  const onBackgroundColorChange = (v: string) => setSettings((s) => ({ ...s, backgroundColor: v }))
  const onCenterImageChange = (v: string | undefined) => setSettings((s) => ({ ...s, centerImage: v }))

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
        <div className="flex-1">
          <Canvas data={data} settings={settings} />
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
