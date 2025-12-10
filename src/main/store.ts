import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { readFile } from 'fs/promises'
import type { QRCodeData } from '@shared/types'

interface StoreData {
  history: QRCodeData[]
}

class SimpleStore {
  private readonly filePath: string
  private data: StoreData
  private isLoaded: boolean = false

  constructor() {
    const userDataPath = app.getPath('userData')
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true })
    }
    this.filePath = join(userDataPath, 'store.json')
    this.data = { history: [] }
  }

  async init(): Promise<void> {
    if (this.isLoaded) return
    this.data = await this.load()
    this.isLoaded = true
  }

  get<K extends keyof StoreData>(key: K): StoreData[K] {
    return this.data[key]
  }

  set<K extends keyof StoreData>(key: K, value: StoreData[K]): void {
    this.data[key] = value
    this.save()
  }

  private async load(): Promise<StoreData> {
    try {
      if (existsSync(this.filePath)) {
        const content = await readFile(this.filePath, 'utf-8')
        return JSON.parse(content)
      }
    } catch (err) {
      console.error('Failed to load store.json:', err)
    }
    return { history: [] }
  }

  private save(): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.data, null, 2))
    } catch (err) {
      console.error('Failed to save store.json:', err)
    }
  }
}

export { SimpleStore }
