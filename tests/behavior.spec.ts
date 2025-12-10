import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AssetManager } from '../src/main/assetManager'
import SimpleStore from '../src/main/store'
import type { QRCodeData } from '../src/shared/types'
import {
  VALID_PNG_DATA_URL,
  VALID_JPEG_DATA_URL,
  createMockQRCodeData,
  createMockQRSettings
} from './fixtures'
import * as mockFs from 'mock-fs'
import { existsSync, readdirSync } from 'fs'

const mock = mockFs.default || mockFs

let uuidCounter = 0
vi.mock('crypto', () => ({
  randomUUID: () => `uuid-${++uuidCounter}`
}))

vi.mock('electron', () => ({
  app: {
    getPath: () => '/mock/userdata'
  }
}))

let assetManager: AssetManager
let store: SimpleStore

function setupTest(): void {
  uuidCounter = 0
  mock({
    '/mock/userdata': {}
  })
  assetManager = new AssetManager('/mock/userdata')
  store = new SimpleStore()
}

function cleanupTest(): void {
  mock.restore()
}

describe('Business Flow: QR Code Creation', () => {
  beforeEach(setupTest)
  afterEach(cleanupTest)

  it('BHV-01: Create a simple QR code', () => {
    const qrId = 'uuid-1'
    const url = 'https://example.com'

    const imagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)

    const qrData: QRCodeData = createMockQRCodeData({
      id: qrId,
      data: url,
      imagePath,
      settings: createMockQRSettings()
    })

    store.set('history', [qrData])
    const history = store.get('history')

    expect(imagePath).toBe('qr-codes/uuid-1.png')
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-1.png')).toBe(true)
    expect(history).toHaveLength(1)
    expect(history[0].id).toBe(qrId)
    expect(history[0].data).toBe(url)
  })

  it('BHV-02: Create a QR code with customization', () => {
    const qrId = 'uuid-1'
    const url = 'https://customized.com'
    const customSettings = createMockQRSettings({
      ecc: 'H',
      dotStyle: 'square',
      foregroundColor: '#ff0000',
      backgroundColor: '#000000',
      cornersStyle: 'square'
    })

    const imagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)
    const qrData: QRCodeData = createMockQRCodeData({
      id: qrId,
      data: url,
      imagePath,
      settings: customSettings
    })

    store.set('history', [qrData])
    const history = store.get('history')

    expect(history[0].settings.ecc).toBe('H')
    expect(history[0].settings.dotStyle).toBe('square')
    expect(history[0].settings.foregroundColor).toBe('#ff0000')
    expect(history[0].settings.cornersStyle).toBe('square')
  })

  it('BHV-03: Create a QR code with center image', () => {
    const qrId = 'uuid-1'
    const url = 'https://withlogo.com'

    const centerImagePath = assetManager.saveCenterImage(VALID_JPEG_DATA_URL)
    expect(centerImagePath).toMatch(/^center-images\/uuid-\d+\.jpeg$/)

    const filename = centerImagePath.split('/')[1]
    expect(existsSync(`/mock/userdata/assets/center-images/${filename}`)).toBe(true)

    const imagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)
    const qrData: QRCodeData = createMockQRCodeData({
      id: qrId,
      data: url,
      imagePath,
      settings: createMockQRSettings({ centerImagePath })
    })

    store.set('history', [qrData])
    const history = store.get('history')

    expect(history[0].settings.centerImagePath).toBe(centerImagePath)
    expect(existsSync(`/mock/userdata/assets/center-images/${filename}`)).toBe(true)
  })
})

describe('Business Flow: QR Code Modification', () => {
  beforeEach(setupTest)
  afterEach(cleanupTest)

  it('BHV-04: Update data of an existing QR code', () => {
    const qrId = 'uuid-1'

    const initialPath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)
    const initialQR = createMockQRCodeData({
      id: qrId,
      data: 'https://old-url.com',
      imagePath: initialPath
    })
    store.set('history', [initialQR])

    const newUrl = 'https://new-url.com'
    const newImagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)

    const updatedQR = { ...initialQR, data: newUrl, imagePath: newImagePath }
    store.set('history', [updatedQR])

    const history = store.get('history')
    expect(history[0].data).toBe(newUrl)
    expect(history[0].id).toBe(qrId)
  })

  it('BHV-05: Update style of an existing QR code', () => {
    const qrId = 'uuid-1'

    const initialPath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)
    const initialQR = createMockQRCodeData({
      id: qrId,
      imagePath: initialPath,
      settings: createMockQRSettings({ foregroundColor: '#ffffff' })
    })
    store.set('history', [initialQR])

    const newSettings = createMockQRSettings({
      foregroundColor: '#ff0000',
      dotStyle: 'square'
    })
    const newImagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, qrId)

    const updatedQR = { ...initialQR, settings: newSettings, imagePath: newImagePath }
    store.set('history', [updatedQR])

    const history = store.get('history')
    expect(history[0].settings.foregroundColor).toBe('#ff0000')
    expect(history[0].settings.dotStyle).toBe('square')
  })
})

describe('Business Flow: History Management', () => {
  beforeEach(setupTest)
  afterEach(cleanupTest)

  it('BHV-06: History limited to 3 items', () => {
    const qrs: QRCodeData[] = []

    for (let i = 1; i <= 4; i++) {
      const id = `uuid-${i}`
      const imagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, id)
      qrs.push(
        createMockQRCodeData({
          id,
          data: `https://qr${i}.com`,
          imagePath
        })
      )
    }

    let history: QRCodeData[] = []
    qrs.forEach((qr) => {
      history = [qr, ...history].slice(0, 3)
    })

    store.set('history', history)
    const finalHistory = store.get('history')

    expect(finalHistory).toHaveLength(3)
    expect(finalHistory[0].id).toBe('uuid-4')
    expect(finalHistory[1].id).toBe('uuid-3')
    expect(finalHistory[2].id).toBe('uuid-2')
    expect(finalHistory.find((q) => q.id === 'uuid-1')).toBeUndefined()
  })

  it('BHV-07: Restore QR code from history', () => {
    const qr1Path = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-1')
    const qr1 = createMockQRCodeData({
      id: 'uuid-1',
      data: 'https://first.com',
      imagePath: qr1Path,
      settings: createMockQRSettings({ foregroundColor: '#ff0000' })
    })

    const qr2Path = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-2')
    const qr2 = createMockQRCodeData({
      id: 'uuid-2',
      data: 'https://second.com',
      imagePath: qr2Path,
      settings: createMockQRSettings({ foregroundColor: '#00ff00' })
    })

    store.set('history', [qr2, qr1])

    const history = store.get('history')
    const restored = history.find((q) => q.id === 'uuid-1')!

    expect(restored.data).toBe('https://first.com')
    expect(restored.settings.foregroundColor).toBe('#ff0000')
  })

  it('BHV-08: Clear history', () => {
    const qr1Path = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-1')
    const qr2Path = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-2')
    const centerPath = assetManager.saveCenterImage(VALID_JPEG_DATA_URL)

    const qr1 = createMockQRCodeData({ id: 'uuid-1', imagePath: qr1Path })
    const qr2 = createMockQRCodeData({
      id: 'uuid-2',
      imagePath: qr2Path,
      settings: createMockQRSettings({ centerImagePath: centerPath })
    })

    store.set('history', [qr2, qr1])

    const centerFilename = centerPath.split('/')[1]
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-1.png')).toBe(true)
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-2.png')).toBe(true)
    expect(existsSync(`/mock/userdata/assets/center-images/${centerFilename}`)).toBe(true)

    store.set('history', [])
    assetManager.cleanup([])

    const history = store.get('history')
    expect(history).toHaveLength(0)

    const qrFiles = readdirSync('/mock/userdata/assets/qr-codes')
    const centerFiles = readdirSync('/mock/userdata/assets/center-images')
    expect(qrFiles).toHaveLength(0)
    expect(centerFiles).toHaveLength(0)
  })
})

describe('Business Flow: Data Persistence', () => {
  beforeEach(setupTest)
  afterEach(cleanupTest)

  it('BHV-09: Persistence after restart', () => {
    const qrPath = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-1')
    const qr = createMockQRCodeData({ id: 'uuid-1', imagePath: qrPath })
    store.set('history', [qr])

    const newStore = new SimpleStore()
    const restoredHistory = newStore.get('history')

    expect(restoredHistory).toHaveLength(1)
    expect(restoredHistory[0].id).toBe('uuid-1')
    expect(restoredHistory[0].data).toBe('https://example.com')
  })

  it('BHV-10: Recovery after data corruption', () => {
    mock.restore()
    mock({
      '/mock/userdata': {
        'store.json': '{ invalid json corrupt'
      }
    })

    const corruptedStore = new SimpleStore()
    const history = corruptedStore.get('history')

    expect(history).toEqual([])
  })
})

describe('Business Flow: Asset Management', () => {
  beforeEach(setupTest)
  afterEach(cleanupTest)

  it('BHV-11: Cleanup orphan files', () => {
    const qrs: QRCodeData[] = []
    for (let i = 1; i <= 4; i++) {
      const id = `uuid-${i}`
      const imagePath = assetManager.saveQRCode(VALID_PNG_DATA_URL, id)
      qrs.push(createMockQRCodeData({ id, imagePath }))
    }

    const history = qrs.slice(1, 4)
    store.set('history', history)

    const usedPaths = history.map((q) => q.imagePath)

    assetManager.cleanup(usedPaths)

    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-1.png')).toBe(false)
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-2.png')).toBe(true)
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-3.png')).toBe(true)
    expect(existsSync('/mock/userdata/assets/qr-codes/uuid-4.png')).toBe(true)
  })

  it('BHV-12: Load QR image from disk', () => {
    const qrPath = assetManager.saveQRCode(VALID_PNG_DATA_URL, 'uuid-1')

    const loadedDataUrl = assetManager.loadImage(qrPath)

    expect(loadedDataUrl).toContain('data:image/png;base64,')
    expect(loadedDataUrl.length).toBeGreaterThan(50)
  })
})
