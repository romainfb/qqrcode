import type { ParametersOfHandle } from './types'
import type { AssetManager } from '../assetManager'

export function createAssetHandlers(
  assetManager: AssetManager
): Record<string, ParametersOfHandle[1]> {
  return {
    'asset:saveQR': (_event, dataUrl: string, id: string) => {
      return assetManager.saveQRCode(dataUrl, id)
    },
    'asset:saveCenterImage': (_event, dataUrl: string) => {
      return assetManager.saveCenterImage(dataUrl)
    },
    'asset:load': (_event, path: string) => {
      return assetManager.loadImage(path)
    },
    'asset:delete': (_event, path: string) => {
      assetManager.deleteImage(path)
    }
  }
}
