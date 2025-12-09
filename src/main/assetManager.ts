import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, readdirSync } from 'fs'
import { randomUUID } from 'crypto'

export class AssetManager {
  private readonly assetsPath: string
  private readonly qrCodesPath: string
  private readonly centerImagesPath: string

  constructor(userDataPath: string) {
    this.assetsPath = join(userDataPath, 'assets')
    this.qrCodesPath = join(this.assetsPath, 'qr-codes')
    this.centerImagesPath = join(this.assetsPath, 'center-images')
    this.ensureDirectories()
  }

  private ensureDirectories(): void {
    if (!existsSync(this.assetsPath)) {
      mkdirSync(this.assetsPath, { recursive: true })
    }
    if (!existsSync(this.qrCodesPath)) {
      mkdirSync(this.qrCodesPath, { recursive: true })
    }
    if (!existsSync(this.centerImagesPath)) {
      mkdirSync(this.centerImagesPath, { recursive: true })
    }
  }

  private dataUrlToBuffer(dataUrl: string): { buffer: Buffer; extension: string } {
    const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      throw new Error('Invalid data URL format')
    }
    const extension = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')
    return { buffer, extension }
  }

  private bufferToDataUrl(buffer: Buffer, extension: string): string {
    const base64 = buffer.toString('base64')
    return `data:image/${extension};base64,${base64}`
  }

  saveQRCode(dataUrl: string, id: string): string {
    const { buffer, extension } = this.dataUrlToBuffer(dataUrl)
    const filename = `${id}.${extension}`
    const filePath = join(this.qrCodesPath, filename)
    writeFileSync(filePath, buffer)
    return `qr-codes/${filename}`
  }

  saveCenterImage(dataUrl: string): string {
    const { buffer, extension } = this.dataUrlToBuffer(dataUrl)
    const filename = `${randomUUID()}.${extension}`
    const filePath = join(this.centerImagesPath, filename)
    writeFileSync(filePath, buffer)
    return `center-images/${filename}`
  }

  loadImage(relativePath: string): string {
    const filePath = join(this.assetsPath, relativePath)
    if (!existsSync(filePath)) {
      throw new Error(`Image not found: ${relativePath}`)
    }
    const buffer = readFileSync(filePath)
    const extension = relativePath.split('.').pop() || 'png'
    return this.bufferToDataUrl(buffer, extension)
  }

  deleteImage(relativePath: string): void {
    const filePath = join(this.assetsPath, relativePath)
    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }
  }

  cleanup(usedPaths: string[]): void {
    const usedSet = new Set(usedPaths)

    const qrCodeFiles = readdirSync(this.qrCodesPath)
    for (const file of qrCodeFiles) {
      const relativePath = `qr-codes/${file}`
      if (!usedSet.has(relativePath)) {
        this.deleteImage(relativePath)
      }
    }

    const centerImageFiles = readdirSync(this.centerImagesPath)
    for (const file of centerImageFiles) {
      const relativePath = `center-images/${file}`
      if (!usedSet.has(relativePath)) {
        this.deleteImage(relativePath)
      }
    }
  }
}