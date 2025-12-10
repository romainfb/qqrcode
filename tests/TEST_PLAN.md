# Plan de Tests de Comportement - QQRCode

## Stack de tests

- **Framework**: Vitest
- **Mocking**: mock-fs (système de fichiers), vi.fn() (Electron APIs)

---

## Flux Métier à Tester

### 1. Création d'un QR Code

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| BHV-01 | Créer un QR code simple | 1. Saisir une URL<br>2. Générer le QR | QR sauvegardé sur disque, ajouté à l'historique, sélectionné automatiquement |
| BHV-02 | Créer un QR code avec personnalisation | 1. Saisir une URL<br>2. Modifier couleurs/style<br>3. Générer | QR créé avec les settings personnalisés |
| BHV-03 | Créer un QR code avec image centrale | 1. Uploader une image<br>2. Saisir URL<br>3. Générer | Image centre sauvegardée, QR créé avec centerImagePath |

---

### 2. Modification d'un QR Code

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| BHV-04 | Modifier les données d'un QR existant | 1. Sélectionner un QR<br>2. Changer l'URL<br>3. Attendre auto-save | QR mis à jour dans l'historique, nouvelle image générée |
| BHV-05 | Modifier le style d'un QR existant | 1. Sélectionner un QR<br>2. Changer couleur/style<br>3. Attendre auto-save | Settings mis à jour, image régénérée |

---

### 3. Gestion de l'Historique

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| BHV-06 | Historique limité à 3 éléments | 1. Créer 4 QR codes successifs | Seuls les 3 derniers sont conservés, le plus ancien supprimé |
| BHV-07 | Restaurer un QR depuis l'historique | 1. Créer un QR<br>2. Créer un autre QR<br>3. Sélectionner le premier | Settings et données du premier QR restaurés |
| BHV-08 | Vider l'historique | 1. Créer des QR<br>2. Vider l'historique | Historique vide, fichiers orphelins supprimés du disque |

---

### 4. Persistance des Données

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| BHV-09 | Persistance au redémarrage | 1. Créer un QR<br>2. Simuler redémarrage app<br>3. Ouvrir l'app | Historique restauré avec le QR créé |
| BHV-10 | Récupération après corruption | 1. Corrompre le fichier store.json<br>2. Ouvrir l'app | App démarre sans crash, historique vide |

---

### 5. Gestion des Assets

| ID | Scénario | Étapes | Résultat attendu |
|----|----------|--------|------------------|
| BHV-11 | Nettoyage des fichiers orphelins | 1. Créer 4 QR (1 supprimé auto)<br>2. Trigger cleanup | Seuls les fichiers des 3 QR restants existent sur disque |
| BHV-12 | Chargement image QR depuis disque | 1. Créer un QR<br>2. Charger l'image via son path | Image retournée en data URL valide |

---

## Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.spec.ts']
  }
})
```

```bash
npm install -D vitest mock-fs
```

