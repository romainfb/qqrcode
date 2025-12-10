import { app, BrowserWindow, nativeImage } from 'electron'
import { join } from 'path'
import { SimpleStore } from './store'
import { AssetManager } from './assetManager'
import { registerHandlers } from './ipc/registerHandlers'
import { createHistoryHandlers } from './ipc/historyHandlers'
import { createAssetHandlers } from './ipc/assetHandlers'
import { createMaintenanceHandlers } from './ipc/maintenanceHandlers'

let store: SimpleStore
let assetManager: AssetManager

const iconPath = join(__dirname, '../../resources/icon.png')
const iconImage = nativeImage.createFromPath(iconPath)

if (process.platform === 'darwin' && !iconImage.isEmpty()) {
  app.whenReady().then(() => {
    if (app.dock) {
      app.dock.setIcon(iconImage)
    }
  })
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    title: 'QQRCode - Générateur de QR Codes',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    icon: process.platform === 'darwin' ? undefined : iconImage
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(async () => {
  const userDataPath = app.getPath('userData')
  store = new SimpleStore()
  await store.init()
  assetManager = new AssetManager(userDataPath)

  // Register IPC handlers via registry (OCP)
  registerHandlers({
    ...createHistoryHandlers(store),
    ...createAssetHandlers(assetManager),
    ...createMaintenanceHandlers(store, assetManager)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
