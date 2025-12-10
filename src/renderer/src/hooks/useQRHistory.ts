import { useCallback, useEffect, useRef, useState } from 'react'
import type { QRCodeData, QRSettings, SaveStatus } from '@renderer/types'
import { AUTO_SAVE_DEBOUNCE_MS, SAVE_STATUS_RESET_DELAY_MS } from '@shared/constants'
import { useDebouncedCallback } from './useDebouncedCallback'

export function useQRHistory(): {
  history: QRCodeData[]
  selectedId: string | null
  saveStatus: SaveStatus
  saveNew: (data: string, settings: QRSettings, getDataUrl: () => Promise<string>) => Promise<void>
  autoSave: (
    data: string,
    settings: QRSettings,
    currentSelectedId: string | null,
    getDataUrl: () => Promise<string>
  ) => void
  selectFromHistory: (item: QRCodeData) => QRCodeData
  clearHistory: () => Promise<void>
} {
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const lastSavedRef = useRef<string | null>(null)

  useEffect(() => {
    window.api.history.get().then(setHistory)
  }, [])

  const saveNew = useCallback(
    async (
      data: string,
      settings: QRSettings,
      getDataUrl: () => Promise<string>
    ): Promise<void> => {
      const canvasDataUrl = await getDataUrl()
      if (!canvasDataUrl) return

      const newId = crypto.randomUUID()
      const imagePath = await window.api.asset.saveQRCode(canvasDataUrl, newId)

      const newItem: QRCodeData = {
        id: newId,
        data,
        imagePath,
        settings: { ...settings },
        createdAt: Date.now()
      }
      const newHistory = await window.api.history.add(newItem)
      setHistory(newHistory)
      setSelectedId(newItem.id)
      lastSavedRef.current = JSON.stringify({ settings, data, selectedId: newItem.id })
    },
    []
  )

  const performAutoSave = useDebouncedCallback(
    async (
      data: string,
      settings: QRSettings,
      currentSelectedId: string,
      currentKey: string,
      getDataUrl: () => Promise<string>
    ) => {
      try {
        const canvasDataUrl = await getDataUrl()
        if (!canvasDataUrl) {
          setSaveStatus('idle')
          return
        }

        const imagePath = await window.api.asset.saveQRCode(canvasDataUrl, currentSelectedId)

        const updatedItem: QRCodeData = {
          id: currentSelectedId,
          data,
          imagePath,
          settings: { ...settings },
          createdAt: Date.now()
        }
        const newHistory = await window.api.history.update(updatedItem)
        setHistory(newHistory)
        lastSavedRef.current = currentKey
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), SAVE_STATUS_RESET_DELAY_MS)
      } catch (error) {
        console.error('Auto-save failed:', error)
        setSaveStatus('idle')
      }
    },
    AUTO_SAVE_DEBOUNCE_MS
  )

  const autoSave = useCallback(
    (
      data: string,
      settings: QRSettings,
      currentSelectedId: string | null,
      getDataUrl: () => Promise<string>
    ): void => {
      if (!currentSelectedId) return

      const currentKey = JSON.stringify({ settings, data, selectedId: currentSelectedId })
      if (lastSavedRef.current === currentKey) return

      setSaveStatus('saving')
      performAutoSave(data, settings, currentSelectedId, currentKey, getDataUrl)
    },
    [performAutoSave]
  )

  const selectFromHistory = useCallback((item: QRCodeData): QRCodeData => {
    lastSavedRef.current = JSON.stringify({
      settings: item.settings,
      data: item.data,
      selectedId: item.id
    })
    setSelectedId(item.id)
    return item
  }, [])

  const clearHistory = useCallback(async (): Promise<void> => {
    await window.api.history.clear()
    await window.api.asset.cleanup()
    setHistory([])
    setSelectedId(null)
    lastSavedRef.current = null
  }, [])

  return {
    history,
    selectedId,
    saveStatus,
    saveNew,
    autoSave,
    selectFromHistory,
    clearHistory
  }
}
