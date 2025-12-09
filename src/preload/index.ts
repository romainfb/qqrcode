import { contextBridge, ipcRenderer } from 'electron'
import type { QRCodeData } from '../shared/types'

contextBridge.exposeInMainWorld('api', {
  history: {
    get: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:get'),
    add: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:add', item),
    update: (item: QRCodeData): Promise<QRCodeData[]> => ipcRenderer.invoke('history:update', item),
    clear: (): Promise<QRCodeData[]> => ipcRenderer.invoke('history:clear')
  }
})
