
# Learner Credential Wallet

A cross-platform (iOS / Android) mobile wallet for **W3C Verifiable Credentials** and **Open Badges v3**. It lets a learner receive, store, verify, and selectively share digital academic credentials — entirely on-device, under their own cryptographic keys.

Built with **Expo SDK 53**, **React Native 0.79.6**, **React 19**, and an **encrypted Realm** database.

---

## Table of Contents

1. [What It Does](#1-what-it-does)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Project Structure](#4-project-structure)
5. [Data Model (UML Class Diagram)](#5-data-model-uml-class-diagram)
6. [Application Lifecycle (State Machine)](#6-application-lifecycle-state-machine)
7. [Navigation Map](#7-navigation-map)
8. [State Management](#8-state-management)
9. [Core Workflows (Sequence Diagrams)](#9-core-workflows-sequence-diagrams)
10. [Security Model](#10-security-model)
11. [External Services](#11-external-services)
12. [Deep Links](#12-deep-links)
13. [Getting Started](#13-getting-started)
14. [Testing](#14-testing)
15. [Known Issues](#15-known-issues)

---

## 1. What It Does

| Capability | Description |
|---|---|
| **Receive** | Accepts credentials via deep link, QR code, VC-API exchange, or file/PNG import |
| **Verify** | Cryptographically verifies signatures and checks the issuer against known DID registries |
| **Store** | Persists credentials in an AES-encrypted Realm database on the device only |
| **Organize** | Multiple *profiles*, each with its own DID and its own credential set |
| **Share** | Verifiable Presentations, QR codes, public links, PDF export, LinkedIn |
| **Backup** | Full wallet or per-profile JSON export via the native share sheet |

**Key principle:** there is no server-side account. Private keys and credentials never leave the device unless the user explicitly shares them.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Runtime | React Native 0.79.6, React 19, Hermes |
| Framework | Expo SDK 53 (dev-client, bare workflow via prebuild) |
| Language | TypeScript 5.8 |
| State | Redux Toolkit + React-Redux 9 |
| Database | Realm 20.1.0 (AES-256 encrypted) |
| Navigation | React Navigation 6 (stack + bottom tabs) |
| Key storage | `expo-secure-store` (Keychain / Keystore) + `react-native-keychain` for biometrics |
| Crypto / VC | `@digitalcredentials/*` — `vc`, `verifier-core`, `ssi`, `did-method-key`, `vpqr`, `ezcap` |
| Signature suites | Ed25519Signature2020, EdDSA-RDFC-2022 |
| Camera | `react-native-vision-camera` 4.7.1 (QR scanning) |
| UI | React Native Elements, React Native Paper, custom theming |

> **Architecture note:** the New Architecture (Fabric/TurboModules) is **disabled** — `newArchEnabled=false` in both `android/gradle.properties` and the `expo-build-properties` plugin. Several native dependencies do not yet support it.

---

## 3. System Architecture

```mermaid
graph TB
    subgraph Presentation["🖼️ Presentation Layer"]
        SC["Screens<br/><i>app/screens</i>"]
        CP["Components<br/><i>app/components</i>"]
        NV["Navigation<br/><i>app/navigation</i>"]
        HK["Hooks<br/><i>app/hooks</i>"]
    end

    subgraph StateL["🔄 State Layer"]
        RS["Redux Store<br/><i>app/store</i>"]
        SL["Slices<br/>wallet · credential · did<br/>profile · credentialFoyer"]
        SF["Selector Factories"]
    end

    subgraph Domain["⚙️ Domain / Business Logic"]
        VC["Credential Ops<br/><i>validate · present · composeVp</i>"]
        DID["DID & Keys<br/><i>did.ts</i>"]
        EX["Exchange Protocols<br/><i>exchanges · credentialRequest</i>"]
        IO["Import / Export<br/><i>import · export · shareData</i>"]
        SH["Sharing<br/><i>publicLink · svgToPdf · vpqr</i>"]
    end

    subgraph Data["💾 Data Layer"]
        DA["DatabaseAccess<br/><i>encryption gatekeeper</i>"]
        MD["Realm Models<br/>CredentialRecord · DidRecord · ProfileRecord"]
        SS["SecureStore<br/><i>key material</i>"]
        FS["FileSystem<br/><i>salt · exports</i>"]
    end

    subgraph External["🌐 External Services"]
        IS["Issuers<br/><i>VC-API</i>"]
        RG["DID Registries"]
        VP["VerifierPlus"]
        WAS["Wallet Attached Storage"]
    end

    SC --> CP
    SC --> HK
    NV --> SC
    HK --> RS
    RS --> SL
    SL --> SF
    SL --> VC
    SL --> IO
    VC --> DID
    EX --> VC
    SH --> VC
    VC --> DA
    IO --> DA
    DA --> MD
    DA --> SS
    DA --> FS
    EX -.HTTPS.-> IS
    VC -.HTTPS.-> RG
    SH -.HTTPS.-> VP
    SH -.HTTPS.-> WAS

    style Presentation fill:#1e3a5f,stroke:#4a90d9,color:#fff
    style StateL fill:#4a3060,stroke:#9b6dc7,color:#fff
    style Domain fill:#1f4d3d,stroke:#4caf82,color:#fff
    style Data fill:#5c3a1e,stroke:#d99a4a,color:#fff
    style External fill:#4a2020,stroke:#d95a5a,color:#fff
```

**Dependency rule:** dependencies point downward. Screens never touch Realm directly — every read/write goes through a Redux thunk, which calls a model static method, which calls `DatabaseAccess.withInstance()`.

---

## 4. Project Structure

```
learner-credential-wallet/
├── App.tsx                    # Root: Redux Provider → ThemeProvider → AppNavigation
├── index.js                   # Entry: polyfills, global Realm, registerRootComponent
├── shim.js                    # Node-API polyfills (Buffer, process, crypto)
├── crypto-polyfill.js         # crypto.getRandomValues / pbkdf2 shims
├── app.config.js              # Expo config + wallet config + feature flags
│
└── app/
    ├── assets/                # Icons, splash, fonts
    ├── components/            # 27 reusable UI components
    ├── hooks/                 # 14 custom hooks
    ├── init/                  # logger.ts, registries.ts (startup side effects)
    ├── lib/                   # 45 modules — the domain layer
    ├── mock/                  # Fixtures for tests / dev
    ├── model/                 # Realm schemas + DatabaseAccess
    ├── navigation/            # 11 navigators
    ├── screens/               # 26 screens
    ├── store/                 # Redux store, 5 slices, selector factories
    ├── styles/                # Theme system (light/dark)
    └── types/                 # Shared TypeScript types
```

### The `lib/` domain layer, grouped by concern

| Concern | Modules |
|---|---|
| **Credential lifecycle** | `validate` · `verifiableObject` · `credentialHash` · `credentialValidityPeriod` · `credentialSecurity` · `credentialName` |
| **DID & keys** | `did` · `biometrics` · `registerWallet` |
| **Presentation** | `present` · `composeVp` · `credentialsFromPresentation` · `credentialsFromVpqr` |
| **Exchange** | `exchanges` · `credentialRequest` · `interactionUrl` · `handleZcapRequest` · `walletRequestApi` |
| **Sharing** | `publicLink` · `shareData` · `shareRequest` · `svgToPdf` · `selectCredentials` · `credentialMatching` |
| **Storage** | `export` · `import` · `parseWallet` · `asyncStorage` · `cache` · `walletAttachedStorage` |
| **Support** | `error` · `text` · `time` · `encode` · `decode` · `dynamicStyles` · `globalModal` |

---

## 5. Data Model (UML Class Diagram)

```mermaid
classDiagram
    class DatabaseAccess {
        <<singleton>>
        -Realm realm$
        +withInstance(callback)$ Promise~T~
        +initialize(passphrase)$ Promise~void~
        +unlock(passphrase)$ Promise~void~
        +unlockWithBiometrics()$ Promise~void~
        +lock()$ Promise~void~
        +reset()$ Promise~void~
        +isUnlocked()$ Promise~bool~
        +isInitialized()$ Promise~bool~
        +enableBiometrics()$ Promise~void~
        -encryptionKey()$ Int8Array
        -salt()$ string
        -config()$ Realm.Configuration
    }

    class ProfileRecord {
        <<Realm.Object>>
        +ObjectId _id
        +Date createdAt
        +Date updatedAt
        +string profileName
        +ObjectId didRecordId
        +addProfileRecord(params)$
        +getAllProfileRecords()$
        +updateProfileRecord(raw)$
        +deleteProfileRecord(raw)$
        +exportProfileRecord(raw)$
        +importProfileRecord(data)$
        +asRaw() ProfileRecordRaw
    }

    class CredentialRecord {
        <<Realm.Object>>
        +ObjectId _id
        +Date createdAt
        +Date updatedAt
        +string rawCredential
        +ObjectId profileRecordId
        +get credential() IVerifiableCredential
        +addCredentialRecord(params)$
        +getAllCredentialRecords()$
        +deleteCredentialRecord(raw)$
        +asRaw() CredentialRecordRaw
    }

    class DidRecord {
        <<Realm.Object>>
        +ObjectId _id
        +Date createdAt
        +Date updatedAt
        +string rawDidDocument
        +string rawVerificationKey
        +string rawKeyAgreementKey
        +addDidRecord(params)$
        +getAllDidRecords()$
        +deleteDidRecord(raw)$
        +asRaw() DidRecordRaw
    }

    class PendingCredential {
        <<transient>>
        +string id
        +ApprovalStatus status
        +IVerifiableCredential credential
        +ApprovalMessage messageOverride
    }

    DatabaseAccess ..> ProfileRecord : manages
    DatabaseAccess ..> CredentialRecord : manages
    DatabaseAccess ..> DidRecord : manages
    ProfileRecord "1" --> "1" DidRecord : didRecordId
    ProfileRecord "1" --> "0..*" CredentialRecord : profileRecordId
    PendingCredential ..> CredentialRecord : becomes on accept
```

### Notes on the schema

- Relationships are **soft foreign keys** (`ObjectId` fields), not Realm link properties. Joins happen in Redux selector factories such as `makeSelectDidForCredential`.
- `rawCredential`, `rawDidDocument`, and the key fields are stored as **JSON strings**, not nested objects — this keeps the schema stable as VC shapes evolve.
- `PendingCredential` lives only in the `credentialFoyer` Redux slice. It is the staging area between "received" and "accepted".
- Schema version is derived automatically: `schemaVersion = migrations.length` in `app/model/migration.ts`.
- `ObjectId`s are generated from `crypto.randomBytes(12)` rather than Realm's default, to avoid a `crypto.getRandomValues` path that is unreliable on React Native.

---

## 6. Application Lifecycle (State Machine)

`AppNavigation` is a pure function of two booleans from the `wallet` slice — `isInitialized` and `isUnlocked`:

```mermaid
stateDiagram-v2
    [*] --> Loading: App launch

    Loading --> Setup: !isInitialized && !isUnlocked
    Loading --> Login: isInitialized && !isUnlocked
    Loading --> Root: isInitialized && isUnlocked
    Loading --> Restart: needsRestart

    Setup: SetupNavigation
    Setup --> Login: passphrase created<br/>DB initialized + locked

    Login: LoginScreen
    Login --> Root: unlock(passphrase)<br/>or biometrics
    Login --> Setup: reset wallet (destructive)

    Root: RootNavigation
    Root --> Login: lock()
    Root --> Restart: restore from backup

    Restart: RestartScreen
    Restart --> [*]: app must be relaunched

    note right of Setup
        PBKDF2-SHA512(passphrase, salt, 10k)
        creates the Realm encryption key
    end note
```

Implementation — `app/navigation/AppNavigation/AppNavigation.tsx`:

```tsx
if (needsRestart)                       return <RestartScreen />
else if (isUnlocked && isInitialized)   return <RootNavigation />
else if (!isUnlocked && isInitialized)  return <LoginScreen />
else if (!isUnlocked && !isInitialized) return <SetupNavigation />
else                                    return null
```

---

## 7. Navigation Map

```mermaid
graph TD
    A["App.tsx"] --> B["Provider (Redux)"]
    B --> C["ThemeProvider"]
    C --> D["AppNavigation<br/><i>NavigationContainer + deepLinkConfig</i>"]

    D --> E["SetupNavigation"]
    D --> F["LoginScreen"]
    D --> G["RestartScreen"]
    D --> H["RootNavigation (Stack)"]

    H --> I["HomeNavigation (Bottom Tabs)"]
    H --> J["QRScreen"]
    H --> K["VerificationStatusScreen"]
    H --> L["AcceptCredentialsNavigation"]
    H --> M["ExchangeCredentialsNavigation<br/><i>modal</i>"]
    H --> N["ProfileSelectionScreen"]
    H --> O["CredentialSelectionScreen"]
    H --> P["ViewSourceScreen"]
    H --> Q["DebugScreen"]

    I --> R["🎓 CredentialNavigation<br/>HomeScreen · CredentialScreen<br/>DetailsScreen · IssuerInfoScreen"]
    I --> S["📤 ShareNavigation<br/>ShareHomeScreen<br/>PresentationPreviewScreen"]
    I --> T["➕ AddNavigation<br/>AddScreen (foyer)<br/>ApproveCredentialsScreen"]
    I --> U["⚙️ SettingsNavigation<br/>ManageProfilesScreen · HelpScreen<br/>RestoreWalletScreen · DeveloperScreen"]

    style D fill:#1e3a5f,stroke:#4a90d9,color:#fff
    style H fill:#4a3060,stroke:#9b6dc7,color:#fff
    style I fill:#1f4d3d,stroke:#4caf82,color:#fff
```

---

## 8. State Management

Five Redux Toolkit slices. `serializableCheck` is disabled because Realm `ObjectId`s and `Date`s flow through actions.

```mermaid
graph LR
    subgraph Store["Redux Store"]
        W["<b>wallet</b><br/>isUnlocked · isInitialized<br/>biometrics · theme · globalModal"]
        C["<b>credential</b><br/>rawCredentialRecords"]
        DD["<b>did</b><br/>rawDidRecords"]
        P["<b>profile</b><br/>rawProfileRecords"]
        F["<b>credentialFoyer</b><br/>pendingCredentials<br/>selectedExchangeCredentials"]
    end

    subgraph Factories["Selector Factories"]
        S1["makeSelectDidForCredential"]
        S2["makeSelectProfileFromCredential"]
        S3["makeSelectProfilesWithCredentials"]
        S4["makeSelectDidFromProfile"]
        S5["makeSelectProfileForPendingCredentials"]
    end

    C --> S1
    DD --> S1
    C --> S2
    P --> S2
    P --> S3
    C --> S3
    P --> S4
    DD --> S4
    F --> S5

    style Store fill:#4a3060,stroke:#9b6dc7,color:#fff
    style Factories fill:#1f4d3d,stroke:#4caf82,color:#fff
```

Because the Realm records are flat and use soft foreign keys, the selector factories are where the object graph is actually assembled. `getAllRecords()` is the thunk that rehydrates all three record slices after unlock.

---

## 9. Core Workflows (Sequence Diagrams)

### 9.1 Wallet Setup and Unlock

```mermaid
sequenceDiagram
    actor User
    participant UI as SetupNavigation
    participant WS as wallet slice
    participant DB as DatabaseAccess
    participant FS as FileSystem
    participant SS as SecureStore
    participant R as Realm

    User->>UI: Enter passphrase
    UI->>WS: dispatch(initialize({passphrase, enableBiometrics}))
    WS->>DB: initialize(passphrase)
    DB->>FS: generateSecureRandom(64) → write salt<br/>(edu-wallet-salt)
    DB->>DB: unlock(passphrase)
    DB->>FS: read salt
    DB->>DB: pbkdf2Sync(passphrase, salt, 10000, 32, SHA-512)
    DB->>SS: store key hex @ privileged_key<br/>status = unlocked
    DB->>R: Realm.open({encryptionKey, schema, schemaVersion})
    R-->>DB: encrypted Realm created
    DB->>DB: lock()
    WS->>WS: createProfile("Default")
    WS-->>UI: isInitialized = true
    UI-->>User: → LoginScreen

    Note over User,R: Later sessions
    User->>UI: Passphrase or biometric
    UI->>WS: dispatch(unlock)
    WS->>DB: unlock(passphrase)
    DB->>R: open with derived key
    alt wrong passphrase
        R-->>DB: decryption error
        DB->>DB: lock()
        DB-->>UI: throw
    else correct
        WS->>WS: getAllRecords()
        WS-->>UI: isUnlocked = true → RootNavigation
    end
```

### 9.2 Receiving a Credential (Deep Link / VC-API)

```mermaid
sequenceDiagram
    actor User
    participant OS as OS / Browser
    participant DL as deepLinkConfig
    participant PS as ProfileSelectionScreen
    participant AC as ApproveCredentialsScreen
    participant CR as credentialRequest
    participant PR as present.ts
    participant ISS as Issuer (VC-API)
    participant V as validate.ts
    participant FY as credentialFoyer
    participant DB as Realm

    User->>OS: Tap dccrequest://request?...
    OS->>DL: Linking event
    DL->>DL: classify URL<br/>(legacy · interaction · request)
    DL->>PS: navigate ProfileSelectionScreen
    User->>PS: Choose profile
    PS->>AC: rawProfileRecord + credentialRequestParams

    AC->>CR: requestCredential(params, didRecord)
    CR->>PR: createVerifiablePresentation(DID, challenge)
    PR->>PR: sign with Ed25519 key from DidRecord
    CR->>ISS: POST vc_request_url { VP }
    ISS-->>CR: Verifiable Credential(s)
    CR->>V: verifyVerifiableObject()
    V->>V: verifier-core + known DID registries
    V-->>AC: verification result

    AC->>FY: stageCredentials(credentials)
    FY->>FY: content hash → detect duplicates
    FY-->>User: Show Pending / PendingDuplicate

    User->>AC: Accept
    AC->>FY: acceptPendingCredentials({profileRecordId})
    FY->>DB: CredentialRecord.addCredentialRecord()
    DB-->>FY: stored (encrypted)
    FY-->>User: "Added to Wallet"
```

### 9.3 Credential Verification

```mermaid
sequenceDiagram
    participant UI as VerificationStatusScreen
    participant H as useVerifyCredential
    participant V as validate.ts
    participant REG as DCC Known Registries
    participant VC as verifier-core
    participant DID as DID Resolver

    UI->>H: verify(credentialRecord)
    H->>V: verifyCredential(credential)
    V->>REG: GET known-did-registries.json
    REG-->>V: registry list
    V->>VC: verifyCredential({credential, knownDIDRegistries})
    VC->>DID: resolve issuer DID
    DID-->>VC: DID Document + public key
    VC->>VC: verify proof signature
    VC->>VC: check validity period
    VC->>VC: check revocation / status
    VC->>VC: check issuer registry membership
    VC-->>V: { verified, log[], results[] }
    V->>V: verified = log.every(check => check.valid)
    V-->>UI: render VerificationCard badges
```

The final `verified` flag is recomputed locally from the log rather than trusted directly — every individual check must pass.

### 9.4 Sharing a Credential

```mermaid
sequenceDiagram
    actor User
    participant SH as ShareHomeScreen
    participant CV as composeVp / present
    participant QR as vpqr
    participant PL as publicLink
    participant VP as VerifierPlus
    participant SD as shareData

    User->>SH: Select credential(s) + method

    alt QR code
        SH->>CV: createVerifiablePresentation()
        CV->>QR: toQrCode(vp)
        QR-->>User: CBOR-LD QR on screen
    else Public link
        SH->>PL: createPublicLinkFor(record)
        PL->>CV: sign VP
        PL->>VP: POST /api/credentials { vp }
        VP-->>PL: { view, get, unshare } URLs
        PL-->>User: shareable https link
    else Send / file
        SH->>CV: createVerifiablePresentation()
        SH->>SD: shareData("presentation.json", vp)
        SD-->>User: native share sheet
    else PDF
        SH->>SH: svgToPdf → react-native-html-to-pdf
        SH-->>User: PDF via share sheet
    end
```

### 9.5 Backup and Restore

```mermaid
sequenceDiagram
    actor User
    participant S as SettingsNavigation
    participant EX as export.ts
    participant PR as ProfileRecord
    participant SD as shareData
    participant FS as FileSystem
    participant IM as import.ts
    participant PW as parseWallet

    rect rgb(30,58,95)
    Note over User,FS: Export
    User->>S: "Backup my wallet"
    S->>EX: exportWallet()
    EX->>PR: getAllProfileRecords()
    loop each profile
        EX->>PR: exportProfileRecord()<br/>(profile + DID + credentials)
    end
    EX->>SD: shareData("Wallet Backup.json", json)
    SD->>FS: write to DocumentDirectoryPath
    SD-->>User: native share sheet
    end

    rect rgb(31,77,61)
    Note over User,PW: Import
    User->>S: "Restore"
    S->>IM: pickAndReadFile()
    IM->>IM: DocumentPicker → RNFS.readFile
    alt PNG Open Badge
        IM->>IM: scan PNG bytes for<br/>"openbadgecredential" JSON
    else JSON
        IM->>IM: read UTF-8
    end
    IM->>PW: parseWalletContents(data)
    PW->>PR: importProfileRecord()
    PR-->>User: import report<br/>(success / duplicate / failed)
    end
```

---

## 10. Security Model

```mermaid
graph TB
    PP["User Passphrase<br/><i>never persisted</i>"]
    SALT["Salt — 64 random bytes<br/><i>DocumentDirectory/edu-wallet-salt</i>"]
    KDF["PBKDF2-HMAC-SHA512<br/>10,000 iterations → 32 bytes"]
    KEY["Encryption Key (hex)<br/><i>expo-secure-store: privileged_key</i>"]
    BIO["Biometric Keychain<br/><i>react-native-keychain</i>"]
    REALM["Encrypted Realm<br/><i>AES-256</i>"]
    DIDK["Ed25519 + X25519 private keys<br/><i>inside DidRecord</i>"]

    PP --> KDF
    SALT --> KDF
    KDF --> KEY
    KEY -.optional.-> BIO
    BIO -.unlock.-> KEY
    KEY --> REALM
    REALM --> DIDK

    style PP fill:#4a2020,stroke:#d95a5a,color:#fff
    style KEY fill:#5c3a1e,stroke:#d99a4a,color:#fff
    style REALM fill:#1f4d3d,stroke:#4caf82,color:#fff
```

| Control | Implementation |
|---|---|
| Key derivation | PBKDF2-HMAC-SHA512, 10,000 iterations, 32-byte output |
| Salt | 64 cryptographically random bytes, generated once at setup |
| Database encryption | Realm AES-256 via `encryptionKey` in the Realm config |
| Key storage | `expo-secure-store` → iOS Keychain / Android Keystore |
| Biometrics | Optional; the derived key is stored behind a biometric-gated keychain entry |
| Passphrase | Never written to disk — exists only as a function argument |
| Lock | Drops the in-memory Realm reference and clears the key from SecureStore |
| Signing keys | Ed25519 (`did:key`), generated from 32 bytes of secure random per profile |

Documented invariants in `DatabaseAccess.ts`:

> 1. Never store/persist the passphrase.
> 2. Never store the generated key anywhere but SecureStorage.
> 3. Never hold onto the Realm instance — do all work inside the `withInstance` callback.

**Threat model caveats.** This is a device-local wallet. It protects credentials at rest against someone with filesystem access, but not against a compromised OS, a rooted/jailbroken device, or a user who exports an unencrypted backup. Backups produced by `exportWallet()` are **plaintext JSON containing private keys** — anyone holding that file controls those DIDs.

---

## 11. External Services

| Service | URL | Purpose |
|---|---|---|
| VerifierPlus | `https://verifierplus.org` | Hosts public shareable links for credentials |
| DCC Known Registries | `digitalcredentials.github.io/dcc-known-registries` | Issuer trust list used during verification |
| DCC Pilot / Sandbox / Community / DCC Registry | `digitalcredentials.github.io/*-registry` | Individual issuer registries |
| Wallet Attached Storage | `https://storage.dcc.did.coop` | Optional remote credential storage (zcap-authorized) |
| Registration | `https://lcw.app/register-wallet.html` | Wallet registration handoff |

All are configurable in `app.config.js`. **If you fork this wallet, point `VERIFIER_INSTANCE_URL` at your own verifier instance.**

---

## 12. Deep Links

| Scheme | Example | Handler |
|---|---|---|
| `dccrequest://request` | `dccrequest://request?issuer=…&vc_request_url=…` | Credential issuance |
| `dccrequest://present` | `dccrequest://present?…` | Presentation request |
| `interaction:` | `interaction:/…` | VC-API exchange |
| `org.dcconsortium://` | legacy | Legacy request format |
| `https://lcw.app/request` | universal link | Credential issuance |
| `https://lcw.app/mobile` | universal app link | Generic app open |

Routing lives in `app/lib/deepLinkConfig.ts`, which classifies each incoming URL into one of three paths before handing off to React Navigation:

```
isLegacyCredentialRequest(url) → goToCredentialFoyer(params)
isInteractionUrl(url)          → redirectInteractionUrl(url)
url.includes('request=')       → redirectRequestRoute(url)
otherwise                      → React Navigation linking
```

---

## 13. Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ (tested on 24) |
| JDK | **21** (Android Studio's bundled JBR works) |
| Android SDK | compileSdk 35, minSdk 29, buildTools 34.0.0 |
| Xcode | 15+ (macOS only, for iOS) |
| Gradle | 8.13 (via wrapper) |

> ⚠️ **JDK 21 is required.** Gradle 8.13 / React Native 0.79 do not support JDK 25. If your `JAVA_HOME` points at a newer JDK, override it:
>
> ```bash
> # macOS / Linux
> export JAVA_HOME="/path/to/jdk-21"
> # Windows (PowerShell)
> $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
> ```

### Install

```bash
npm install          # runs patch-package via postinstall
```

The `patches/` directory contains required fixes to third-party packages — do not skip `postinstall`.

### Generate native projects

`android/` and `ios/` are **gitignored**; they are generated by Expo prebuild:

```bash
npm run prebuild:android
npm run prebuild:ios
```

### Run

```bash
npm run android      # expo run:android — builds and installs the dev client
npm run ios          # expo run:ios (macOS only)
npm start            # Metro only, for an already-installed dev client
```

This app uses **expo-dev-client**, so it cannot run in Expo Go — a native build is mandatory.

#### Faster emulator builds

By default both `x86_64` and `arm64-v8a` are compiled. For an x86_64 emulator, restrict the ABI in `android/gradle.properties`:

```properties
reactNativeArchitectures=x86_64
```

This roughly halves build time and avoids compiling native code you cannot run.

### Code quality

```bash
npm run lint         # prettier --check + tsc --noEmit
npm run lint:fix     # prettier --write + typecheck
npm run compile      # tsc --noEmit only
```

A Husky `pre-commit` hook runs `lint-staged` (prettier) on staged JS/TS files.

---

## 14. Testing

```bash
npm test             # jest + node test runner
npm run test-jest    # Jest (jest-expo preset)
npm run test-node    # node --test with tsx
npm run coverage     # coverage report
npm run test:ui      # Maestro E2E
```

| Layer | Tool | Location |
|---|---|---|
| Unit / component | Jest + `@testing-library/react-native` | `test/` |
| Node-side logic | `node --test` + tsx | `test-node/` |
| End-to-end | Maestro | `.maestro/` |

---

## 15. Known Issues

### `ninja: manifest 'build.ninja' still dirty after 100 tries`

Occurs while building `react-native-vision-camera`'s C++ on Windows. Causes and fixes:

1. **Cloud-synced folder** (OneDrive, Dropbox, Google Drive). The sync client rewrites file mtimes mid-build, so ninja keeps re-detecting a dirty manifest. Move the project outside the synced folder, or pause syncing during builds.
2. **Unnecessary ABI.** Set `reactNativeArchitectures=x86_64` as above.
3. **Stale CMake cache.** `rm -rf node_modules/react-native-vision-camera/android/.cxx`

### `Tried to access a JS module before the React instance was fully set up`

Thrown from `CameraDevicesManager.kt` at startup. `react-native-vision-camera` 4.7.1 emits `availableDevicesChanged` before the bridge finishes initializing, on the old architecture. It is non-fatal — the app recovers and Metro continues bundling — but it surfaces as a red-box crash in dev builds.

### `expo-system-ui: The current activity is no longer available`

Follow-on noise from the above crash/restart cycle, not an independent defect.
