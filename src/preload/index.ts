import { contextBridge, ipcRenderer } from 'electron'
import type { QRCodeData } from '../shared/types'

contextBridge.exposeInMainWorld('api', {
  history: {
    get: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:get'),
    add: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:add', item),
    update: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:update', item),
    clear: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:clear')
  },
  asset: {
    saveQRCode: (dataUrl: string, id: string): Promise<string> =>
      ipcRenderer.invoke('asset:save-qr', dataUrl, id),
    saveCenterImage: (dataUrl: string): Promise<string> =>
      ipcRenderer.invoke('asset:save-center-image', dataUrl),
    load: (path: string): Promise<string> => ipcRenderer.invoke('asset:load', path),
    delete: (path: string): Promise<void> => ipcRenderer.invoke('asset:delete', path),
    cleanup: (): Promise<void> => ipcRenderer.invoke('asset:cleanup')
  }
})
