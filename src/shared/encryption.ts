/**
 * Module de chiffrement compatible YeetFile
 * Utilise Web Crypto API pour un chiffrement AES-GCM avec dérivation PBKDF2
 */

// Constantes de configuration cryptographique (YeetFile compatible)
const PBKDF2_ITERATIONS = 600000
const PBKDF2_HASH = 'SHA-256'
const AES_ALGORITHM = 'AES-GCM'
const AES_KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits (recommandé pour GCM)
const SALT_LENGTH = 32 // YeetFile standard
const RANDOM_NAME_LENGTH = 4 // 4 bytes = 8 hex chars

/**
 * Récupère l'API crypto appropriée selon l'environnement
 * Single Responsibility: Gestion de la compatibilité crypto multi-environnement
 */
const getCrypto = (): Crypto => {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto
  }
  // Node.js 15+ ou Electron
  return globalThis.crypto || require('crypto').webcrypto
}

export interface EncryptedData {
  ciphertext: Uint8Array
  iv: Uint8Array
  salt: Uint8Array
  key: Uint8Array // La clé dérivée pour l'URL
}

/**
 * Dérive une clé cryptographique à partir d'un mot de passe
 * Open/Closed Principle: Extensible sans modification
 */
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<{ key: CryptoKey; keyBits: Uint8Array }> {
  const cryptoAPI = getCrypto()
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const baseKey = await cryptoAPI.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  const pbkdf2Params = {
    name: 'PBKDF2',
    salt: new Uint8Array(salt) as BufferSource,
    iterations: PBKDF2_ITERATIONS,
    hash: PBKDF2_HASH
  }

  const [keyBits, key] = await Promise.all([
    cryptoAPI.subtle.deriveBits(pbkdf2Params, baseKey, AES_KEY_LENGTH),
    cryptoAPI.subtle.deriveKey(
      pbkdf2Params,
      baseKey,
      { name: AES_ALGORITHM, length: AES_KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    )
  ])

  return { key, keyBits: new Uint8Array(keyBits) }
}

/**
 * Combine l'IV et le ciphertext selon le format YeetFile
 * DRY: Évite la duplication de cette logique
 */
function combineIvAndCiphertext(iv: Uint8Array, ciphertext: Uint8Array): Uint8Array {
  const combined = new Uint8Array(IV_LENGTH + ciphertext.length)
  combined.set(iv, 0)
  combined.set(ciphertext, IV_LENGTH)
  return combined
}

/**
 * Chiffre du contenu avec un mot de passe ET un salt spécifique
 * Compatible avec le format attendu par YeetFile
 * Format final: [IV (12 bytes) | ciphertext]
 */
export async function encryptContentWithSalt(
  content: string,
  password: string,
  salt: Uint8Array
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
  const cryptoAPI = getCrypto()
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(content)

  const iv = cryptoAPI.getRandomValues(new Uint8Array(IV_LENGTH))
  const { key } = await deriveKey(password, salt)

  const ciphertextBuffer = await cryptoAPI.subtle.encrypt(
    { name: AES_ALGORITHM, iv },
    key,
    plaintext
  )

  const ciphertext = new Uint8Array(ciphertextBuffer)
  const combined = combineIvAndCiphertext(iv, ciphertext)

  return { ciphertext: combined, iv }
}

/**
 * Chiffre du contenu avec un mot de passe (génère un nouveau salt)
 * Compatible avec le format attendu par YeetFile
 * Format final: [IV (12 bytes) | ciphertext]
 */
export async function encryptContent(content: string, password: string): Promise<EncryptedData> {
  const cryptoAPI = getCrypto()
  const salt = cryptoAPI.getRandomValues(new Uint8Array(SALT_LENGTH))

  const { ciphertext, iv } = await encryptContentWithSalt(content, password, salt)
  const { keyBits } = await deriveKey(password, salt)

  return { ciphertext, iv, salt, key: keyBits }
}

/**
 * Convertit des bytes en hexadécimal (pour le nom dans YeetFile)
 */
export function toHexString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convertit des bytes en base64url (pour la clé dans l'URL)
 */
export function toBase64Url(bytes: Uint8Array): string {
  const base64 =
    typeof btoa !== 'undefined'
      ? btoa(String.fromCharCode(...bytes))
      : Buffer.from(bytes).toString('base64')

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Génère un nom aléatoire pour YeetFile (8 caractères hex)
 */
export function generateSecureName(): string {
  const cryptoAPI = getCrypto()
  const randomBytes = cryptoAPI.getRandomValues(new Uint8Array(RANDOM_NAME_LENGTH))
  return toHexString(randomBytes)
}

