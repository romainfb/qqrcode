import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { QRCodeData } from '../shared/types'

interface StoreData {
  history: QRCodeData[]
}

class SimpleStore {
  private readonly filePath: string
  private readonly data: StoreData

  constructor() {
    const userDataPath = app.getPath('userData')
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true })
    }
    this.filePath = join(userDataPath, 'store.json')
    this.data = this.load()
  }

  private load(): StoreData {
    try {
      if (existsSync(this.filePath)) {
        return JSON.parse(readFileSync(this.filePath, 'utf-8'))
      }
    } catch (err) {
      console.error('Failed to load store.json:', err)
    }
    return { history: [] }
  }

  private save(): void {
    writeFileSync(this.filePath, JSON.stringify(this.data, null, 2))
  }

  get<K extends keyof StoreData>(key: K): StoreData[K] {
    return this.data[key]
  }

  set<K extends keyof StoreData>(key: K, value: StoreData[K]): void {
    this.data[key] = value
    this.save()
  }
}

export { SimpleStore }
