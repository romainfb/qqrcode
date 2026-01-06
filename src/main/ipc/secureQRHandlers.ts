/**
 * IPC Handlers pour les QR codes sécurisés
 */

import type { IpcMainInvokeEvent } from 'electron'
import {
  generateSecureQRCode,
  type SecureQROptions,
  type SecureQRResult
} from '../../shared/secureQR'

export function createSecureQRHandlers(): Record<
  string,
  (_event: IpcMainInvokeEvent, options: SecureQROptions) => Promise<SecureQRResult>
> {
  return {
    'secure:generateQR': async (_event, options: SecureQROptions): Promise<SecureQRResult> => {
      return await generateSecureQRCode(options)
    }
  }
}

