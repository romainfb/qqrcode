import { contextBridge, ipcRenderer } from 'electron'
import type { QRCodeData } from '../shared/types'
import type { SecureQROptions, SecureQRResult } from '../shared/secureQR'

contextBridge.exposeInMainWorld('api', {
  history: {
    get: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:get'),
    add: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:add', item),
    update: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:update', item),
    clear: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:clear')
  },
  asset: {
    saveQRCode: (dataUrl: string, id: string): Promise<string> =>
      ipcRenderer.invoke('asset:saveQR', dataUrl, id),
    saveCenterImage: (dataUrl: string): Promise<string> =>
      ipcRenderer.invoke('asset:saveCenterImage', dataUrl),
    load: (path: string): Promise<string> => ipcRenderer.invoke('asset:load', path),
    delete: (path: string): Promise<void> => ipcRenderer.invoke('asset:delete', path),
    cleanup: (): Promise<void> => ipcRenderer.invoke('asset:cleanup')
  },
  secure: {
    generateQR: (options: SecureQROptions): Promise<SecureQRResult> =>
      ipcRenderer.invoke('secure:generateQR', options)
  }
})
