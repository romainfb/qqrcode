/**
 * Service YeetFile pour l'hébergement de contenu chiffré
 * API compatible avec le format YeetFile réel
 */

const YEETFILE_API_URL = 'https://yeetfileforqqrcode.thibaultpauljack.uno/api/send/text'

export type ExpirationTime = '5m' | '30m' | '1h' | '1d'

export interface YeetFilePayload {
  name: string
  salt: number[]
  downloads: number
  expiration: ExpirationTime
  text: number[]
  size: number
}

export interface YeetFileResponse {
  id: string
}

/**
 * Convertit Uint8Array en number[] pour la compatibilité YeetFile
 */
function toNumberArray(data: Uint8Array): number[] {
  return Array.from(data)
}

/**
 * Construit le payload YeetFile
 */
function buildYeetFilePayload(
  encryptedName: string,
  salt: Uint8Array,
  encryptedText: Uint8Array,
  expiration: ExpirationTime,
  downloads: number
): YeetFilePayload {
  const textArray = toNumberArray(encryptedText)
  const saltArray = toNumberArray(salt)

  return {
    name: encryptedName,
    salt: saltArray,
    downloads,
    expiration,
    text: textArray,
    size: textArray.length
  }
}

/**
 * Envoie du contenu chiffré à YeetFile
 * @param encryptedName - Nom chiffré encodé en hexadécimal
 * @param salt - Salt utilisé pour la dérivation (Uint8Array)
 * @param encryptedText - Texte chiffré (Uint8Array)
 * @param expiration - Durée de vie du lien
 * @param downloads - Nombre de lectures autorisées
 * @returns ID du contenu hébergé (format: "text_xxx")
 */
export async function uploadToYeetFile(
  encryptedName: string,
  salt: Uint8Array,
  encryptedText: Uint8Array,
  expiration: ExpirationTime = '30m',
  downloads: number = 1
): Promise<string> {
  const payload = buildYeetFilePayload(encryptedName, salt, encryptedText, expiration, downloads)

  try {
    const response = await fetch(YEETFILE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`YeetFile API error (${response.status}): ${errorText}`)
    }

    const data: YeetFileResponse = await response.json()

    if (!data.id) {
      throw new Error('YeetFile did not return an ID')
    }

    return data.id
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Échec de l'upload YeetFile: ${error.message}`)
    }
    throw new Error("Échec de l'upload YeetFile: erreur inconnue")
  }
}
