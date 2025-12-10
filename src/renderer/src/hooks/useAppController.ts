import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from './useToast'
import { useQRHistory, useQRSettings } from './index'
import type { QRCodeData, QRSettings } from '@renderer/types'

export function useAppController(): {
  input: string
  setInput: (v: string) => void
  qrContent: string
  onQRReady: (getDataUrl: () => Promise<string>) => void
  settings: QRSettings
  updateSetting: <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => void
  setSettings: (s: QRSettings) => void
  history: QRCodeData[]
  selectedId: string | null
  saveStatus: import('@renderer/types').SaveStatus
  onSelectHistory: (item: QRCodeData) => void
  clearHistory: () => Promise<void>
  toasts: import('@shared/types').Toast[]
  removeToast: (id: string) => void
  onGenerate: () => Promise<void>
} {
  const [input, setInput] = useState('')
  const [qrContent, setQrContent] = useState('QQRCode')

  const { settings, setSettings, updateSetting } = useQRSettings()
  const { history, selectedId, saveStatus, saveNew, autoSave, selectFromHistory, clearHistory } =
    useQRHistory()
  const { toasts, addToast, removeToast } = useToast()

  const getDataUrlRef = useRef<(() => Promise<string>) | null>(null)

  // Auto-save orchestration when content/settings/selection changes
  useEffect(() => {
    if (getDataUrlRef.current) {
      autoSave(qrContent, settings, selectedId, getDataUrlRef.current)
    }
  }, [qrContent, settings, selectedId, autoSave])

  const onGenerate = useCallback(async (): Promise<void> => {
    const trimmed = input.trim()
    if (!trimmed) return

    setQrContent(trimmed)

    // Slight delay to ensure Canvas has rendered updated content before saving
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
  }, [input, saveNew, settings, addToast])

  const onQRReady = useCallback((getDataUrl: () => Promise<string>): void => {
    getDataUrlRef.current = getDataUrl
  }, [])

  const onSelectHistory = useCallback(
    (item: QRCodeData): void => {
      const selected = selectFromHistory(item)
      setQrContent(selected.data)
      setSettings(selected.settings)
      setInput(selected.data)
    },
    [selectFromHistory, setSettings]
  )

  return {
    input,
    setInput,
    qrContent,
    onQRReady,
    settings,
    updateSetting,
    setSettings,
    history,
    selectedId,
    saveStatus,
    onSelectHistory,
    clearHistory,
    toasts,
    removeToast,
    onGenerate
  }
}
