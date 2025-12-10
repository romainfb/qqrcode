import { useState, useEffect, useRef, useCallback } from 'react'
import type { QRCodeData, QRSettings } from '@renderer/types'

export function useQRHistory() {
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string | null>(null)

  useEffect(() => {
    window.api.history.get().then(setHistory)
  }, [])

  const saveNew = useCallback(
    async (data: string, settings: QRSettings, getDataUrl: () => Promise<string>) => {
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

  const autoSave = useCallback(
    (
      data: string,
      settings: QRSettings,
      currentSelectedId: string | null,
      getDataUrl: () => Promise<string>
    ) => {
      if (!currentSelectedId) return

      const currentKey = JSON.stringify({ settings, data, selectedId: currentSelectedId })
      if (lastSavedRef.current === currentKey) return

      if (debounceRef.current) clearTimeout(debounceRef.current)
      setSaveStatus('saving')

      debounceRef.current = setTimeout(async () => {
        try {
          const canvasDataUrl = await getDataUrl()
          if (!canvasDataUrl || !currentSelectedId) {
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
          setTimeout(() => setSaveStatus('idle'), 2000)
        } catch (error) {
          console.error('Auto-save failed:', error)
          setSaveStatus('idle')
        }
      }, 1000)
    },
    []
  )

  const selectFromHistory = useCallback((item: QRCodeData) => {
    lastSavedRef.current = JSON.stringify({
      settings: item.settings,
      data: item.data,
      selectedId: item.id
    })
    setSelectedId(item.id)
    return item
  }, [])

  const clearHistory = useCallback(async () => {
    await window.api.history.clear()
    await window.api.asset.cleanup()
    setHistory([])
    setSelectedId(null)
    lastSavedRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
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
