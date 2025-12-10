import { useState, useRef, useCallback, useEffect, JSX } from 'react'
import InputArea from '@renderer/components/InputArea'
import Canvas from '@renderer/components/Canvas'
import ControlPanel from '@renderer/components/ControlPanel'
import HistoryPanel from '@renderer/components/HistoryPanel'
import SaveIndicator from '@renderer/components/SaveIndicator'
import { ToastContainer } from '@renderer/components/Toast'
import { useToast } from './hooks/useToast'
import { useQRSettings, useQRHistory } from './hooks'
import type { QRCodeData } from '@renderer/types'

function App(): JSX.Element {
  const [input, setInput] = useState('')
  const [data, setData] = useState('QQRCode')
  const { settings, setSettings, updateSetting } = useQRSettings()
  const { history, selectedId, saveStatus, saveNew, autoSave, selectFromHistory, clearHistory } =
    useQRHistory()
  const { toasts, addToast, removeToast } = useToast()

  const getDataUrlRef = useRef<(() => Promise<string>) | null>(null)

  // Auto-save quand les settings ou data changent
  useEffect(() => {
    if (getDataUrlRef.current) {
      autoSave(data, settings, selectedId, getDataUrlRef.current)
    }
  }, [data, settings, selectedId, autoSave])

  const onGenerate = async (): Promise<void> => {
    const trimmed = input.trim()
    if (!trimmed) return

    setData(trimmed)

    // Attendre le prochain render pour que le QR soit généré
    setTimeout(async (): Promise<void> => {
      try {
        if (getDataUrlRef.current) {
          await saveNew(trimmed, settings, getDataUrlRef.current)
          addToast('QR code généré !', 'success')
        }
      } catch (error) {
        console.error('Failed to save QR code to history:', error)
        addToast('Erreur lors de la génération', 'error')
      }
    }, 100)
  }

  const onQRReady = useCallback((getDataUrl: () => Promise<string>): void => {
    getDataUrlRef.current = getDataUrl
  }, [])

  const onSelectHistory = (item: QRCodeData): void => {
    const selected = selectFromHistory(item)
    setData(selected.data)
    setSettings(selected.settings)
    setInput(selected.data)
  }

  return (
    <section className="h-screen w-screen bg-zinc-800 flex flex-col overflow-hidden">
      <InputArea
        value={input}
        onChange={setInput}
        onGenerate={onGenerate}
        disabled={!input.trim()}
      />
      <div className="flex w-full h-full flex-1">
        <HistoryPanel
          history={history}
          onSelect={onSelectHistory}
          selectedId={selectedId}
          onClear={clearHistory}
        />
        <div className="flex-1 relative">
          <Canvas data={data} settings={settings} onQRReady={onQRReady} />
          <SaveIndicator status={saveStatus} />
        </div>
        <ControlPanel settings={settings} onSettingChange={updateSetting} />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  )
}

export default App
