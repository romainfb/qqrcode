import { useState, useEffect, useRef, useCallback } from 'react'
import type { QRCodeData, SaveStatus } from './types'
import InputArea from '@renderer/components/InputArea'
import Canvas from '@renderer/components/Canvas'
import ControlPanel from '@renderer/components/ControlPanel'
import HistoryPanel from '@renderer/components/HistoryPanel'
import SaveIndicator from '@renderer/components/SaveIndicator'
import { ToastContainer, useToast } from '@renderer/components/Toast'
import { useQRSettings } from './hooks'

function App() {
  const [input, setInput] = useState('')
  const [data, setData] = useState('QQRCode')
  const { settings, setSettings, updateSetting } = useQRSettings()
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const { toasts, addToast, removeToast } = useToast()

  const getDataUrlRef = useRef<(() => Promise<string>) | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedSettingsRef = useRef<string | null>(null)

  useEffect(() => {
    window.api.history.get().then(setHistory)
  }, [])

  // Auto-save effect
  useEffect(() => {
    if (!selectedId) return

    const currentSettingsKey = JSON.stringify({ settings, data, selectedId })
    if (lastSavedSettingsRef.current === currentSettingsKey) return

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    setSaveStatus('saving')

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const dataUrl = await getDataUrlRef.current?.()
        if (dataUrl && selectedId) {
          const imagePath = await window.api.asset.saveQRCode(dataUrl, selectedId)
          const updatedItem: QRCodeData = {
            id: selectedId,
            data,
            imagePath,
            settings: { ...settings },
            createdAt: Date.now()
          }
          const newHistory = await window.api.history.update(updatedItem)
          setHistory(newHistory)
          lastSavedSettingsRef.current = currentSettingsKey
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        }
      } catch (error) {
        console.error('Failed to auto-save QR code:', error)
        setSaveStatus('idle')
      }
    }, 1000)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [settings, selectedId, data])

  const onGenerate = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setData(trimmed)

    // Attendre le prochain render pour que le QR soit généré
    setTimeout(async () => {
      try {
        const dataUrl = await getDataUrlRef.current?.()
        if (dataUrl) {
          const newId = crypto.randomUUID()
          const imagePath = await window.api.asset.saveQRCode(dataUrl, newId)
          const newItem: QRCodeData = {
            id: newId,
            data: trimmed,
            imagePath,
            settings: { ...settings },
            createdAt: Date.now()
          }
          const newHistory = await window.api.history.add(newItem)
          setHistory(newHistory)
          setSelectedId(newItem.id)
          lastSavedSettingsRef.current = JSON.stringify({ settings, data: trimmed, selectedId: newItem.id })
          addToast('QR code généré !', 'success')
        }
      } catch (error) {
        console.error('Failed to save QR code to history:', error)
        addToast('Erreur lors de la génération', 'error')
      }
    }, 100)
  }

  const onQRReady = useCallback((getDataUrl: () => Promise<string>) => {
    getDataUrlRef.current = getDataUrl
  }, [])

  const onSelectHistory = (item: QRCodeData) => {
    lastSavedSettingsRef.current = JSON.stringify({ settings: item.settings, data: item.data, selectedId: item.id })
    setData(item.data)
    setSettings(item.settings)
    setInput(item.data)
    setSelectedId(item.id)
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
        <HistoryPanel history={history} onSelect={onSelectHistory} selectedId={selectedId} />
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
