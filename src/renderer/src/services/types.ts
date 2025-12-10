import type { QRCodeData } from '@shared/types'

export interface HistoryService {
  get: () => Promise<QRCodeData[]>
  add: (item: QRCodeData) => Promise<QRCodeData[]>
  update: (item: QRCodeData) => Promise<QRCodeData[]>
  clear: () => Promise<QRCodeData[] | void>
}

export interface AssetService {
  saveQRCode: (dataUrl: string, id: string) => Promise<string>
  saveCenterImage: (dataUrl: string) => Promise<string>
  load: (path: string) => Promise<string>
  delete: (path: string) => Promise<void>
  cleanup: () => Promise<void>
}

export interface Services {
  historyService: HistoryService
  assetService: AssetService
}
