import { ipcMain } from 'electron'

/**
 * Register a set of ipcMain.handle handlers using a simple registry map.
 * Keeps main/index.ts closed to modification when adding new channels.
 */
export function registerHandlers(
  handlers: Record<string, Parameters<typeof ipcMain.handle>[1]>
): void {
  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, handler)
  }
}
