import { useState, useCallback } from 'react'
import type { QRSettings } from '@renderer/types'
import { DEFAULT_QR_SETTINGS } from '@shared/types'

export function useQRSettings(initial?: Partial<QRSettings>): {
  settings: QRSettings
  setSettings: (s: QRSettings) => void
  updateSetting: <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => void
  resetSettings: () => void
} {
  const [settings, setSettings] = useState<QRSettings>({ ...DEFAULT_QR_SETTINGS, ...initial })

  const updateSetting = useCallback(<K extends keyof QRSettings>(key: K, value: QRSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => setSettings(DEFAULT_QR_SETTINGS), [])

  return { settings, setSettings, updateSetting, resetSettings }
}
