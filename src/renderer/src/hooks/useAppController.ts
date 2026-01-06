import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from './useToast'
import { useQRHistory, useQRSettings, useSecureQR } from './index'
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
  const { generateSecureQR } = useSecureQR()

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

    let finalContent = trimmed

    // Mode sécurisé activé
    if (settings.isSecure && settings.securePassword) {
      // Validation du mot de passe
      if (settings.securePassword.length < 4) {
        addToast('Mot de passe trop court (minimum 4 caractères)', 'error')
        return
      }

      try {
        addToast('🔐 Chiffrement en cours...', 'info')

        const result = await generateSecureQR({
          content: trimmed,
          password: settings.securePassword,
          expiration: settings.secureExpiration || '30m',
          downloads: settings.secureDownloads || 1
        })

        if (result) {
          finalContent = result.url
          addToast(
            `✅ QR sécurisé généré (expire: ${result.expiration}, ${result.downloads} lecture${result.downloads > 1 ? 's' : ''})`,
            'success'
          )
        } else {
          addToast('❌ Échec de la génération sécurisée', 'error')
          return
        }
      } catch (error) {
        console.error('Secure QR generation failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        addToast(`❌ Erreur: ${errorMessage}`, 'error')
        return
      }
    }

    setQrContent(finalContent)

    // Slight delay to ensure Canvas has rendered updated content before saving
    setTimeout(async (): Promise<void> => {
      try {
        if (getDataUrlRef.current) {
          await saveNew(finalContent, settings, getDataUrlRef.current)
          // Toast uniquement pour le mode normal
          if (!settings.isSecure) {
            addToast('QR code généré !', 'success')
          }
        }
      } catch (error) {
        console.error('Failed to save QR code to history:', error)
        addToast('Erreur lors de la génération', 'error')
      }
    }, 100)
  }, [input, saveNew, settings, addToast, generateSecureQR])

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
