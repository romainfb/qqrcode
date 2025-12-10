import { useCallback, useEffect } from 'react'
import type { QRCodeData } from '@renderer/types'
import { useServices } from '../hooks/useServices'

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
  const { historyService, assetService } = useServices()

  const loadHistory = useCallback(() => {
    historyService.get().then(setHistory)
  }, [setHistory, historyService])

  const addHistoryItem = useCallback(
    async (item: QRCodeData): Promise<QRCodeData[]> => {
      return await historyService.add(item)
    },
    [historyService]
  )

  const updateHistoryItem = useCallback(
    async (item: QRCodeData): Promise<QRCodeData[]> => {
      return await historyService.update(item)
    },
    [historyService]
  )

  const clearHistory = useCallback(async (): Promise<void> => {
    await historyService.clear()
  }, [historyService])

  const saveQRCodeAsset = useCallback(
    async (dataUrl: string, id: string): Promise<string> => {
      return assetService.saveQRCode(dataUrl, id)
    },
    [assetService]
  )

  const cleanupAssets = useCallback(async (): Promise<void> => {
    await assetService.cleanup()
  }, [assetService])

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
