import { app, BrowserWindow, nativeImage, ipcMain } from 'electron'
import { join } from 'path'
import SimpleStore from './store'
import {QRCodeData} from "../shared/types";

let store: SimpleStore

ipcMain.handle('history:get', () => {
  return store.get('history')
})

ipcMain.handle('history:add', (_event, item: QRCodeData) => {
  const history = store.get('history')
  const newHistory = [item, ...history].slice(0, 3)
  store.set('history', newHistory)
  return newHistory
})

ipcMain.handle('history:clear', () => {
  store.set('history', [])
  return []
})

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
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault()
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  store = new SimpleStore()
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
