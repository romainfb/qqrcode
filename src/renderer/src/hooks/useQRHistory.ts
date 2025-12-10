import { useCallback, useRef } from 'react'
import type { QRCodeData, QRSettings, SaveStatus } from '@renderer/types'
import { useHistoryState } from './useHistoryState'
import { useHistoryPersistence } from './useHistoryPersistence'
import { useAutoSave } from './useAutoSave'

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
  // State management
  const { history, setHistory, selectedId, setSelectedId, saveStatus, setSaveStatus } =
    useHistoryState()

  // Persistence layer (IPC calls)
  const { addHistoryItem, updateHistoryItem, clearHistory: clearHistoryIPC, saveQRCodeAsset, cleanupAssets } =
    useHistoryPersistence(setHistory)

  // Cache of last saved key to avoid redundant saves
  const lastSavedRef = useRef<string | null>(null)

  // Debounced auto-save orchestrator
  const { autoSave } = useAutoSave({
    setHistory,
    setSaveStatus,
    lastSavedRef,
    saveQRCodeAsset,
    updateHistoryItem
  })

  const saveNew = useCallback(
    async (
      data: string,
      settings: QRSettings,
      getDataUrl: () => Promise<string>
    ): Promise<void> => {
      const canvasDataUrl = await getDataUrl()
      if (!canvasDataUrl) return

      const newId = crypto.randomUUID()
      const imagePath = await saveQRCodeAsset(canvasDataUrl, newId)

      const newItem: QRCodeData = {
        id: newId,
        data,
        imagePath,
        settings: { ...settings },
        createdAt: Date.now()
      }
      const newHistory = await addHistoryItem(newItem)
      setHistory(newHistory)
      setSelectedId(newItem.id)
      lastSavedRef.current = JSON.stringify({ settings, data, selectedId: newItem.id })
    },
    [addHistoryItem, saveQRCodeAsset, setHistory, setSelectedId]
  )

  const selectFromHistory = useCallback((item: QRCodeData): QRCodeData => {
    lastSavedRef.current = JSON.stringify({
      settings: item.settings,
      data: item.data,
      selectedId: item.id
    })
    setSelectedId(item.id)
    return item
  }, [setSelectedId])

  const clearHistory = useCallback(async (): Promise<void> => {
    await clearHistoryIPC()
    await cleanupAssets()
    setHistory([])
    setSelectedId(null)
    lastSavedRef.current = null
  }, [cleanupAssets, clearHistoryIPC, setHistory, setSelectedId])

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
