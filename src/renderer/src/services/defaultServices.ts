import type { Services } from './types'

export const defaultServices: Services = {
  historyService: {
    get: () => window.api.history.get(),
    add: (item) => window.api.history.add(item),
    update: (item) => window.api.history.update(item),
    clear: () => window.api.history.clear()
  },
  assetService: {
    saveQRCode: (dataUrl, id) => window.api.asset.saveQRCode(dataUrl, id),
    saveCenterImage: (dataUrl) => window.api.asset.saveCenterImage(dataUrl),
    load: (path) => window.api.asset.load(path),
    delete: (path) => window.api.asset.delete(path),
    cleanup: () => window.api.asset.cleanup()
  }
}
