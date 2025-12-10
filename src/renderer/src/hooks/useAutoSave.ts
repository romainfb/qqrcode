import { useCallback } from 'react'
import type { QRCodeData, QRSettings, SaveStatus } from '@renderer/types'
import { AUTO_SAVE_DEBOUNCE_MS, SAVE_STATUS_RESET_DELAY_MS } from '@shared/constants'
import { useDebouncedCallback } from './useDebouncedCallback'

export function useAutoSave(params: {
  setHistory: React.Dispatch<React.SetStateAction<QRCodeData[]>>
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>
  lastSavedRef: React.MutableRefObject<string | null>
  saveQRCodeAsset: (dataUrl: string, id: string) => Promise<string>
  updateHistoryItem: (item: QRCodeData) => Promise<QRCodeData[]>
}): {
  autoSave: (
    data: string,
    settings: QRSettings,
    selectedId: string | null,
    getDataUrl: () => Promise<string>
  ) => void
} {
  const { setHistory, setSaveStatus, lastSavedRef, saveQRCodeAsset, updateHistoryItem } = params

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

        const imagePath = await saveQRCodeAsset(canvasDataUrl, currentSelectedId)

        const updatedItem: QRCodeData = {
          id: currentSelectedId,
          data,
          imagePath,
          settings: { ...settings },
          createdAt: Date.now()
        }
        const newHistory = await updateHistoryItem(updatedItem)
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
      selectedId: string | null,
      getDataUrl: () => Promise<string>
    ): void => {
      if (!selectedId) return

      const currentKey = JSON.stringify({ settings, data, selectedId })
      if (lastSavedRef.current === currentKey) return

      setSaveStatus('saving')
      performAutoSave(data, settings, selectedId, currentKey, getDataUrl)
    },
    [lastSavedRef, performAutoSave, setSaveStatus]
  )

  return { autoSave }
}
