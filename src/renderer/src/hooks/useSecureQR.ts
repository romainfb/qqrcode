/**
 * Hook React pour générer des QR codes sécurisés
 */

import { useState, useCallback } from 'react'
import type { SecureQROptions, SecureQRResult } from '../../../shared/secureQR'

interface UseSecureQRResult {
  isGenerating: boolean
  error: string | null
  result: SecureQRResult | null
  generateSecureQR: (options: SecureQROptions) => Promise<SecureQRResult | null>
  clearError: () => void
  clearResult: () => void
}

/**
 * Hook pour gérer la génération de QR codes sécurisés
 *
 * @example
 * ```tsx
 * const { generateSecureQR, isGenerating, error, result } = useSecureQR()
 *
 * const handleGenerate = async () => {
 *   const result = await generateSecureQR({
 *     content: "Mon contenu secret",
 *     password: "motdepasse123",
 *     expiration: "1h",
 *     downloads: 1
 *   })
 *   if (result) {
 *     console.log("URL YeetFile:", result.url)
 *   }
 * }
 * ```
 */
export function useSecureQR(): UseSecureQRResult {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SecureQRResult | null>(null)

  const generateSecureQR = useCallback(
    async (options: SecureQROptions): Promise<SecureQRResult | null> => {
      setIsGenerating(true)
      setError(null)
      setResult(null)

      try {
        const secureResult = await window.api.secure.generateQR(options)
        setResult(secureResult)
        return secureResult
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(errorMessage)
        return null
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  const clearError = useCallback(() => setError(null), [])
  const clearResult = useCallback(() => setResult(null), [])

  return {
    isGenerating,
    error,
    result,
    generateSecureQR,
    clearError,
    clearResult
  }
}

