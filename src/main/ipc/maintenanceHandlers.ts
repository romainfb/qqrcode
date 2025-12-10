import type { ParametersOfHandle } from './types'
import type { SimpleStore } from '../store'
import type { AssetManager } from '../assetManager'

export function createMaintenanceHandlers(
  store: SimpleStore,
  assetManager: AssetManager
): Record<string, ParametersOfHandle[1]> {
  return {
    'asset:cleanup': () => {
      const history = store.get('history')
      const usedPaths: string[] = []

      for (const item of history) {
        usedPaths.push(item.imagePath)
        if (item.settings.centerImagePath) {
          usedPaths.push(item.settings.centerImagePath)
        }
      }

      assetManager.cleanup(usedPaths)
    }
  }
}
