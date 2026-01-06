/**
 * Générateur de QR code sécurisé
 * Orchestre le chiffrement et l'upload vers YeetFile
 */

import {
  encryptContent,
  encryptContentWithSalt,
  generateSecureName,
  toHexString,
  toBase64Url,
  type EncryptedData
} from './encryption'
import { uploadToYeetFile, type ExpirationTime } from './yeetfile'
import { MIN_PASSWORD_LENGTH } from './constants'

const YEETFILE_BASE_URL = 'https://yeetfileforqqrcode.thibaultpauljack.uno'

export interface SecureQROptions {
  content: string
  password: string
  expiration?: ExpirationTime
  downloads?: number
}

export interface SecureQRResult {
  url: string
  name: string
  expiration: ExpirationTime
  downloads: number
}

/**
 * Valide les options du QR code sécurisé
 * Single Responsibility: Séparation de la validation
 */
function validateSecureQROptions(content: string, password: string): void {
  if (!content?.trim()) {
    throw new Error('Le contenu ne peut pas être vide')
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`)
  }
}

/**
 * Construit l'URL YeetFile complète avec le salt
 */
function buildYeetFileUrl(yeetfileId: string, salt: Uint8Array): string {
  const saltBase64 = toBase64Url(salt)
  return `${YEETFILE_BASE_URL}/send/${yeetfileId}#${saltBase64}`
}

/**
 * Génère un QR code sécurisé par mot de passe
 *
 * Flux complet :
 * 1. Génère un nom aléatoire (8 chars hex)
 * 2. Chiffre le nom avec le mot de passe
 * 3. Chiffre le contenu avec le mot de passe
 * 4. Upload sur YeetFile avec nom chiffré + salt + texte chiffré
 * 5. Construit l'URL : /send/{id}#{key_base64url}
 *
 * @param options - Configuration du QR code sécurisé
 * @returns URL YeetFile complète et métadonnées
 * @throws Error si le chiffrement ou l'upload échoue
 */
export async function generateSecureQRCode(
  options: SecureQROptions
): Promise<SecureQRResult> {
  const { content, password, expiration = '30m', downloads = 1 } = options

  validateSecureQROptions(content, password)

  try {
    const randomName = generateSecureName()
    const encryptedContentData: EncryptedData = await encryptContent(content, password)

    const encryptedNameData = await encryptContentWithSalt(
      randomName,
      password,
      encryptedContentData.salt
    )
    const encryptedNameHex = toHexString(encryptedNameData.ciphertext)

    const yeetfileId = await uploadToYeetFile(
      encryptedNameHex,
      encryptedContentData.salt,
      encryptedContentData.ciphertext,
      expiration,
      downloads
    )

    const url = buildYeetFileUrl(yeetfileId, encryptedContentData.salt)

    return {
      url,
      name: randomName,
      expiration,
      downloads
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Échec de la génération du QR code sécurisé: ${error.message}`)
    }
    throw new Error('Échec de la génération du QR code sécurisé: erreur inconnue')
  }
}

