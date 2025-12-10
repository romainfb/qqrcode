import { useCallback, useEffect } from 'react'
import type { QRCodeData } from '@renderer/types'

export function useHistoryPersistence(
  setHistory: React.Dispatch<React.SetStateAction<QRCodeData[]>>
): {
  loadHistory: () => void
  addHistoryItem: (item: QRCodeData) => Promise<QRCodeData[]>
  updateHistoryItem: (item: QRCodeData) => Promise<QRCodeData[]>
  clearHistory: () => Promise<void>
  saveQRCodeAsset: (dataUrl: string, id: string) => Promise<string>
  cleanupAssets: () => Promise<void>
} {
  const loadHistory = useCallback(() => {
    window.api.history.get().then(setHistory)
  }, [setHistory])

  const addHistoryItem = useCallback(async (item: QRCodeData): Promise<QRCodeData[]> => {
    return await window.api.history.add(item)
  }, [])

  const updateHistoryItem = useCallback(async (item: QRCodeData): Promise<QRCodeData[]> => {
    return await window.api.history.update(item)
  }, [])

  const clearHistory = useCallback(async (): Promise<void> => {
    await window.api.history.clear()
  }, [])

  const saveQRCodeAsset = useCallback(async (dataUrl: string, id: string): Promise<string> => {
    return window.api.asset.saveQRCode(dataUrl, id)
  }, [])

  const cleanupAssets = useCallback(async (): Promise<void> => {
    await window.api.asset.cleanup()
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    loadHistory,
    addHistoryItem,
    updateHistoryItem,
    clearHistory,
    saveQRCodeAsset,
    cleanupAssets
  }
}
