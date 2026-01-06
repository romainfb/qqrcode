/**
 * Composant SecureQRPanel
 * Interface pour configurer et générer des QR codes sécurisés
 */

import { JSX, useState } from 'react'
import { MIN_PASSWORD_LENGTH, MIN_DOWNLOADS, MAX_DOWNLOADS } from '../../../shared/constants'

const EXPIRATION_LABELS: Record<'5m' | '30m' | '1h' | '1d', string> = {
  '5m': '5 minutes',
  '30m': '30 minutes',
  '1h': '1 heure',
  '1d': '1 jour'
}

export interface SecureQRPanelProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  password: string
  onPasswordChange: (password: string) => void
  expiration: '5m' | '30m' | '1h' | '1d'
  onExpirationChange: (expiration: '5m' | '30m' | '1h' | '1d') => void
  downloads: number
  onDownloadsChange: (downloads: number) => void
}


export default function SecureQRPanel({
  isEnabled,
  onToggle,
  password,
  onPasswordChange,
  expiration,
  onExpirationChange,
  downloads,
  onDownloadsChange
}: SecureQRPanelProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="p-4 bg-zinc-900 rounded-lg space-y-4">
      {/* Toggle principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">🔐 QR Code Sécurisé</span>
          <span className="text-xs text-gray-500 bg-zinc-800 px-2 py-0.5 rounded">
            Zero-Knowledge
          </span>
        </div>
        <button
          onClick={() => onToggle(!isEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-600'
          }`}
          aria-label="Activer QR code sécurisé"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Options (affichées uniquement si activé) */}
      {isEnabled && (
        <div className="space-y-3 pt-2 border-t border-zinc-700">
          {/* Mot de passe */}
          <div className="space-y-1.5">
            <label htmlFor="secure-password" className="block text-xs font-medium text-gray-300">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                id="secure-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder={`Minimum ${MIN_PASSWORD_LENGTH} caractères`}
                className="w-full px-3 py-2 pr-10 bg-zinc-800 text-gray-200 text-sm rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
                minLength={MIN_PASSWORD_LENGTH}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-xs"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Le serveur ne reçoit jamais votre mot de passe
            </p>
          </div>

          {/* Expiration */}
          <div className="space-y-1.5">
            <label htmlFor="secure-expiration" className="block text-xs font-medium text-gray-300">
              Expiration
            </label>
            <select
              id="secure-expiration"
              value={expiration}
              onChange={(e) =>
                onExpirationChange(e.target.value as '5m' | '30m' | '1h' | '1d')
              }
              className="w-full px-3 py-2 bg-zinc-800 text-gray-200 text-sm rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
            >
              {Object.entries(EXPIRATION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre de lectures */}
          <div className="space-y-1.5">
            <label htmlFor="secure-downloads" className="block text-xs font-medium text-gray-300">
              Nombre de lectures autorisées
            </label>
            <input
              id="secure-downloads"
              type="number"
              min={MIN_DOWNLOADS}
              max={MAX_DOWNLOADS}
              value={downloads}
              onChange={(e) => onDownloadsChange(Math.max(MIN_DOWNLOADS, parseInt(e.target.value) || MIN_DOWNLOADS))}
              className="w-full px-3 py-2 bg-zinc-800 text-gray-200 text-sm rounded border border-zinc-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Info */}
          <div className="text-xs text-gray-500 bg-zinc-800 p-3 rounded border border-zinc-700">
            <p className="font-medium text-gray-400 mb-1">ℹ️ Comment ça marche ?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Votre contenu est chiffré localement</li>
              <li>Il est hébergé sur YeetFile (zero-knowledge)</li>
              <li>Le QR code pointe vers un lien sécurisé</li>
              <li>Seul le mot de passe déchiffre le contenu</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

