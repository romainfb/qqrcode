# Suivi Corrections Audit - QQRCode

**Date de début:** 10 Décembre 2025
**Statut global:** 🟡 EN COURS

---

## Vue d'ensemble

| Phase | Corrections | Statut | Commits |
|-------|-------------|--------|---------|
| Phase 1: Infrastructure | 7 | ⏳ À faire | 0/1 |
| Phase 2: DRY | 7 | ⏳ À faire | 0/3 |
| Phase 3: Naming | 8 | ⏳ À faire | 0/2 |
| Phase 4: Optimisations | 5 | ⏳ À faire | 0/2 |
| Phase 5: Sécurité & TS | 4 | ⏳ À faire | 0/1 |
| **TOTAL** | **31** | **0/31 ✅** | **0/9** |

---

## Phase 1: Infrastructure ⏳

**Commit prévu**: `refactor: infrastructure - add @shared alias, standardize exports, centralize config`

### Corrections

- [ ] **ARCH-002** - Ajouter alias @shared
  - [ ] tsconfig.web.json
  - [ ] tsconfig.node.json
  - [ ] electron.vite.config.ts

- [ ] **NAMING-004** - Renommer fichiers
  - [ ] canvasExport.ts → CanvasExport.ts
  - [ ] assetManager.ts → AssetManager.ts
  - [ ] Mettre à jour imports

- [ ] **ARCH-008** - Standardiser exports
  - [ ] store.ts: export { SimpleStore }
  - [ ] Mettre à jour imports

- [ ] **DRY-001** - Centraliser types Toast
  - [ ] Ajouter dans shared/types.ts
  - [ ] Supprimer de useToast.ts
  - [ ] Supprimer de Toast.tsx

- [ ] **DRY-006** - Utiliser SaveStatus
  - [ ] useQRHistory.ts: import SaveStatus

- [ ] **DRY-007** - Exporter DEFAULT_SETTINGS
  - [ ] Ajouter dans shared/types.ts
  - [ ] Supprimer de useQRSettings.ts
  - [ ] Mettre à jour tests/fixtures.ts

- [ ] **ARCH-006** - Configuration centralisée
  - [ ] Créer shared/constants.ts
  - [ ] Réexporter QR_SIZE

### Tests Phase 1
- [ ] `npm run typecheck` passe
- [ ] `npm run test` passe

---

## Phase 2: DRY ⏳

### Commit 1: Extract magic numbers
**Commit**: `refactor(dry): extract magic numbers to constants`

- [ ] **NAMING-006** - Extraire magic numbers
  - [ ] main/index.ts
  - [ ] hooks/useQRHistory.ts
  - [ ] components/Canvas.tsx
  - [ ] components/HistoryPanel.tsx
  - [ ] components/Toast.tsx

### Commit 2: Hook useAssetLoader
**Commit**: `refactor(dry): create useAssetLoader hook to eliminate duplication`

- [ ] **DRY-002** - Pattern chargement image
  - [ ] Créer hooks/useAssetLoader.ts
  - [ ] Refactorer Canvas.tsx
  - [ ] Refactorer HistoryPanel.tsx
  - [ ] Refactorer ImageUploader.tsx
  - [ ] Mettre à jour hooks/index.ts

### Commit 3: Utilitaires conversion
**Commit**: `refactor(dry+arch): extract data URL utilities, fix SEC-003 regex`

- [ ] **DRY-004** - Conversion DataURL ↔ Buffer
  - [ ] Créer shared/dataUrlUtils.ts
  - [ ] Refactorer AssetManager.ts

- [ ] **ARCH-004** - Logique métier hors composants
  - [ ] Utiliser blobToDataUrl dans Canvas.tsx

- [ ] **SEC-003** - Regex sécurisé
  - [ ] Whitelist formats images

### Tests Phase 2
- [ ] `npm run typecheck` passe
- [ ] `npm run test` passe
- [ ] Vérifier chargement images

---

## Phase 3: Naming ⏳

### Commit 1: Handlers & IPC
**Commit**: `refactor(naming): standardize handler prefixes and IPC channel names`

- [ ] **NAMING-001** - Prefixes handlers
  - [ ] Vérifier convention on* vs handle*

- [ ] **NAMING-002** - IPC channels
  - [ ] asset:save-qr → asset:saveQR
  - [ ] asset:save-center-image → asset:saveCenterImage
  - [ ] Mettre à jour preload/index.ts

### Commit 2: Variables
**Commit**: `refactor(naming): fix boolean prefixes, acronyms, and generic variable names`

- [ ] **NAMING-003** - Acronymes
  - [ ] Standardiser QR, URL

- [ ] **NAMING-005** - Booléens
  - [ ] Toast.tsx: mounted → isMounted

- [ ] **NAMING-007** - Variable "data"
  - [ ] App.tsx: data → qrContent

- [ ] **NAMING-008** - Variable "d"
  - [ ] Corrigé via useAssetLoader

### Tests Phase 3
- [ ] `npm run typecheck` passe
- [ ] `npm run test` passe

---

## Phase 4: Optimisations ⏳

### Commit 1: Mémoization
**Commit**: `perf(opti): add memoization for callbacks and HistoryItem`

- [ ] **OPTI-002** - Callbacks App.tsx
  - [ ] useCallback pour onSelectHistory

- [ ] **OPTI-003** - Re-renders HistoryPanel
  - [ ] React.memo(HistoryItem)

### Commit 2: Optimisations avancées
**Commit**: `perf(opti): use QR update, debounce hook, async store operations`

- [ ] **OPTI-004** - QRCodeStyling.update()
  - [ ] Refactorer Canvas.tsx

- [ ] **OPTI-005** - Hook debounce
  - [ ] Créer useDebouncedCallback.ts
  - [ ] Refactorer useQRHistory.ts

- [ ] **OPTI-008** - Store async
  - [ ] Modifier store.ts (async load/save)

### Tests Phase 4
- [ ] `npm run typecheck` passe
- [ ] `npm run test` passe
- [ ] Tester auto-save manuellement

---

## Phase 5: Sécurité & TS ⏳

**Commit**: `fix(sec+ts): add path traversal protection, remove unsafe type assertions`

- [ ] **SEC-003** - Regex sécurisé
  - [ ] ✅ Fait en Phase 2

- [ ] **SEC-004** - Path traversal
  - [ ] AssetManager.loadImage: validation chemin
  - [ ] Test avec ../../etc/passwd

- [ ] **TS-002** - Type assertions
  - [ ] CanvasExport.ts: supprimer casts
  - [ ] Vérifier ctx null

- [ ] **TS-007** - Enum pattern
  - [ ] ⚠️ Optionnel - garder actuel

### Tests Phase 5
- [ ] `npm run typecheck` passe
- [ ] `npm run test` passe
- [ ] Test sécurité path traversal

---

## Validation Finale

- [ ] `npm run typecheck` - Aucune erreur TypeScript
- [ ] `npm run test` - Tous les tests passent
- [ ] `npm run build` - Build production réussit
- [ ] Tester manuellement l'application
- [ ] Vérifier que les 31 corrections sont complètes

---

## Notes

*Espace pour documenter les problèmes rencontrés et solutions*

---

## Métriques

- **Temps total estimé:** 4-6 heures
- **Temps réel:** _À remplir_
- **Fichiers modifiés:** _À compter_
- **Lignes ajoutées:** _git diff --stat_
- **Lignes supprimées:** _git diff --stat_
