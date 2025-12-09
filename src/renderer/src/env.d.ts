/// <reference types="vite/client" />

import type { QRCodeData } from '../../shared/types'

declare global {
  interface Window {
    api: {
      history: {
        get: () => Promise<QRCodeData[]>
        add: (item: QRCodeData) => Promise<QRCodeData[]>
        update: (item: QRCodeData) => Promise<QRCodeData[]>
        clear: () => Promise<QRCodeData[]>
      }
      asset: {
        saveQRCode: (dataUrl: string, id: string) => Promise<string>
        saveCenterImage: (dataUrl: string) => Promise<string>
        load: (path: string) => Promise<string>
        delete: (path: string) => Promise<void>
        cleanup: () => Promise<void>
      }
    }
  }
}
