import type { SimpleStore } from '../store'
import type { QRCodeData } from '@shared/types'
import { MAX_HISTORY_ITEMS } from '@shared/constants'
import type { ParametersOfHandle } from './types'

export function createHistoryHandlers(store: SimpleStore): Record<string, ParametersOfHandle[1]> {
  return {
    'history:get': () => {
      return store.get('history')
    },
    'history:add': (_event, item: QRCodeData) => {
      const history = store.get('history')
      const newHistory = [item, ...history].slice(0, MAX_HISTORY_ITEMS)
      store.set('history', newHistory)
      return newHistory
    },
    'history:update': (_event, item: QRCodeData) => {
      const history = store.get('history')
      const newHistory = history.map((h) => (h.id === item.id ? item : h))
      store.set('history', newHistory)
      return newHistory
    },
    'history:clear': () => {
      store.set('history', [])
      return []
    }
  }
}
