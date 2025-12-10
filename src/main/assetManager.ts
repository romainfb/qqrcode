import { join, resolve } from 'path'
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'
import { bufferToDataUrl, dataUrlToBuffer } from '@shared/dataUrlUtils'

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

  saveQRCode(dataUrl: string, id: string): string {
    const { buffer, extension } = dataUrlToBuffer(dataUrl)
    const filename = `${id}.${extension}`
    const filePath = join(this.qrCodesPath, filename)
    writeFileSync(filePath, buffer)
    return `qr-codes/${filename}`
  }

  saveCenterImage(dataUrl: string): string {
    const { buffer, extension } = dataUrlToBuffer(dataUrl)
    const filename = `${randomUUID()}.${extension}`
    const filePath = join(this.centerImagesPath, filename)
    writeFileSync(filePath, buffer)
    return `center-images/${filename}`
  }

  loadImage(relativePath: string): string {
    const filePath = join(this.assetsPath, relativePath)
    const resolvedPath = resolve(filePath)
    const resolvedAssetsPath = resolve(this.assetsPath)

    if (!resolvedPath.startsWith(resolvedAssetsPath)) {
      throw new Error(`Invalid path: attempting to access files outside assets directory`)
    }

    if (!existsSync(resolvedPath)) {
      throw new Error(`Image not found: ${relativePath}`)
    }
    const buffer = readFileSync(resolvedPath)
    const extension = relativePath.split('.').pop() || 'png'
    return bufferToDataUrl(buffer, extension)
  }

  deleteImage(relativePath: string): void {
    const filePath = join(this.assetsPath, relativePath)
    const resolvedPath = resolve(filePath)
    const resolvedAssetsPath = resolve(this.assetsPath)

    if (!resolvedPath.startsWith(resolvedAssetsPath)) {
      throw new Error(`Invalid path: attempting to access files outside assets directory`)
    }

    if (existsSync(resolvedPath)) {
      unlinkSync(resolvedPath)
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
}
