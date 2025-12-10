import { useState, useCallback } from 'react'
import type { QRSettings } from '@renderer/types'

const DEFAULT_SETTINGS: QRSettings = {
  ecc: 'M',
  dotStyle: 'dots',
  foregroundColor: '#e5e7eb',
  backgroundColor: '#18181b',
  cornersStyle: 'rounded',
  centerImagePath: undefined
}

export function useQRSettings(initial?: Partial<QRSettings>) {
  const [settings, setSettings] = useState<QRSettings>({ ...DEFAULT_SETTINGS, ...initial })

  const updateSetting = useCallback(<K extends keyof QRSettings>(key: K, value: QRSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  return { settings, setSettings, updateSetting, resetSettings }
}
