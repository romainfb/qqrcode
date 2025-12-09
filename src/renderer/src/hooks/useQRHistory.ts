import { useState, useEffect, useRef, useCallback } from 'react'
import type { QRCodeData, QRSettings } from '@renderer/types'

interface UseQRHistoryOptions {
  getDataUrl: () => Promise<string>
}

export function useQRHistory({ getDataUrl }: UseQRHistoryOptions) {
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string | null>(null)

  useEffect(() => {
    window.api.history.get().then(setHistory)
  }, [])

  const saveNew = useCallback(async (data: string, settings: QRSettings) => {
    const dataUrl = await getDataUrl()
    if (!dataUrl) return

    const newItem: QRCodeData = {
      id: crypto.randomUUID(),
      data,
      dataUrl,
      settings: { ...settings },
      createdAt: Date.now()
    }
    const newHistory = await window.api.history.add(newItem)
    setHistory(newHistory)
    setSelectedId(newItem.id)
    lastSavedRef.current = JSON.stringify({ settings, data, selectedId: newItem.id })
  }, [getDataUrl])

  const autoSave = useCallback((data: string, settings: QRSettings) => {
    if (!selectedId) return

    const currentKey = JSON.stringify({ settings, data, selectedId })
    if (lastSavedRef.current === currentKey) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSaveStatus('saving')

    debounceRef.current = setTimeout(async () => {
      try {
        const dataUrl = await getDataUrl()
        if (!dataUrl || !selectedId) return

        const updatedItem: QRCodeData = {
          id: selectedId,
          data,
          dataUrl,
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
  }, [selectedId, getDataUrl])

  const selectFromHistory = useCallback((item: QRCodeData) => {
    lastSavedRef.current = JSON.stringify({ settings: item.settings, data: item.data, selectedId: item.id })
    setSelectedId(item.id)
    return item
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
    selectFromHistory
  }
}

