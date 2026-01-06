/**
 * Tests pour la fonctionnalité QR Code Sécurisé
 * Validation du chiffrement et de l'API YeetFile
 */

import {
  encryptContent,
  generateSecureName,
  toHexString
} from '../src/shared/encryption'
import { uploadToYeetFile } from '../src/shared/yeetfile'
import { generateSecureQRCode } from '../src/shared/secureQR'

/**
 * Test : Chiffrement de base
 */
export async function testEncryption(): Promise<void> {
  const content = 'Message secret de test'
  const password = 'motdepasse123'

  const encrypted = await encryptContent(content, password)

  if (
    encrypted.ciphertext.length === 0 ||
    encrypted.salt.length !== 32 ||
    encrypted.iv.length !== 12
  ) {
    throw new Error('Échec du test de chiffrement')
  }
}

/**
 * Test : Génération de nom unique
 */
export function testNameGeneration(): void {
  const name1 = generateSecureName()
  const name2 = generateSecureName()

  if (name1 === name2 || !/^[0-9a-f]{8}$/.test(name1)) {
    throw new Error('Échec du test de génération de nom')
  }
}

/**
 * Test : Upload vers YeetFile (nécessite connexion internet)
 */
export async function testYeetFileUpload(): Promise<void> {
  const content = "Test d'upload - " + new Date().toISOString()
  const password = 'test1234'

  const encrypted = await encryptContent(content, password)
  const encryptedNameHex = toHexString(encrypted.ciphertext).substring(0, 16)

  const id = await uploadToYeetFile(
    encryptedNameHex,
    encrypted.salt,
    encrypted.ciphertext,
    '5m',
    1
  )

  if (!id.startsWith('text_')) {
    throw new Error('Format ID YeetFile invalide')
  }
}

/**
 * Test : Génération complète de QR code sécurisé
 */
export async function testCompleteSecureQR(): Promise<void> {
  const result = await generateSecureQRCode({
    content: 'Test complet - ' + Date.now(),
    password: 'secure123',
    expiration: '30m',
    downloads: 1
  })

  if (!result.url || !result.name || result.expiration !== '30m' || result.downloads !== 1) {
    throw new Error('Échec du test de génération complète')
  }
}

/**
 * Test : Validation des contraintes
 */
export async function testValidation(): Promise<void> {
  // Mot de passe trop court
  try {
    await generateSecureQRCode({
      content: 'Test',
      password: '123',
      expiration: '5m'
    })
    throw new Error('Mot de passe court non rejeté')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('au moins')) {
      throw error
    }
  }

  // Contenu vide
  try {
    await generateSecureQRCode({
      content: '',
      password: 'test1234',
      expiration: '5m'
    })
    throw new Error('Contenu vide non rejeté')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('vide')) {
      throw error
    }
  }
}

/**
 * Exécution de tous les tests
 */
export async function runAllTests(): Promise<void> {
  await testEncryption()
  testNameGeneration()
  await testValidation()
  await testYeetFileUpload()
  await testCompleteSecureQR()
}


