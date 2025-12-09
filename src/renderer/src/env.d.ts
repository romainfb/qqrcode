/// <reference types="vite/client" />

import type { QRCodeData } from '../../shared/types'

declare global {
  interface Window {
    api: {
      history: {
        get: () => Promise<QRCodeData[]>
        add: (item: QRCodeData) => Promise<QRCodeData[]>
        clear: () => Promise<QRCodeData[]>
      }
    }
  }
}
