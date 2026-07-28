# Phase 3: Data Flow & State Analysis — CryptPad v2026.5.1

## 1. Authentication Flow

```
[Login Page] → [Outer Frame: common-login.js] → [Crypto Key Derivation] → [RPC: login] → [Server: lib/commands/login.js] → [JWT Token] → [Session Cookie]
```

### Detailed Trace:
1. **User navigates** to `https://instance/login/` → loads `www/login/index.html` → boot via `www/common/boot.js` → `www/common/boot2.js`
2. **Login form** rendered by `www/common/common-login.js` (570 lines). User enters username + password.
3. **Key derivation**: Password is hashed client-side via PBKDF2 (in `cryptpad-common.js` and common-hash functions) to produce:
   - **Login key** (sent to server for authentication — zero-knowledge proof, password never sent in plaintext)
   - **Encryption key** (never leaves client — used to encrypt/decrypt all user content)
4. **RPC call** via `lib/rpc.js` → `lib/http-commands.js` → WebSocket → server validates credentials
5. **Server response**: JWT session token (lib/commands/login.js), stored in session cookie
6. **Registration**: Similar flow via `common-login.js` + `www/register/` → server creates user record with hashed login proof

### MFA/2FA:
- `www/common/inner/mfa.js` (334 lines): TOTP-based 2FA enrollment
- QR code generation for authenticator app
- Backup codes displayed during enrollment
- MFA token validated during login via `lib/challenge-commands/`

### SSO:
- SAML (`@node-saml/node-saml`) and OpenID Connect (`openid-client`) supported
- Routes through `www/ssoauth/` → `lib/http-commands.js` → SAML assertion validation
- SSO users mapped to local CryptPad accounts

### Session:
- JWT-signed session tokens via `jsonwebtoken`
- Session stored in HTTP-only cookie
- Server validates on each WebSocket message

---

## 2. Encryption/Decryption Flow (E2EE)

```
[User Content] → [Inner Frame: sframe-chainpad-netflux-inner.js] → [Outer Frame: sframe-common-outer.js] → [Web Worker: src/worker/store.ts] → [Encrypted via Nacl] → [WebSocket] → [Server] → [Flat File: datastore/ or block/ or blob/]
```

### Key Hierarchy:
```
Master Password
       ↓ (PBKDF2)
User Login Key (sent to server for auth)
User Encryption Key (NEVER leaves client)
       ↓ (HKDF-like derivation per document)
Document Key (unique per pad, derived from document ID + user key)
       ↓
Nacl SecretBox (XSalsa20-Poly1305) key for document content
Nacl SecretBox key for document metadata
Nacl SecretBox key for uploaded file blocks
```

### Encryption Layers:
1. **Channel messages** (collaboration operations): Encrypted per-document key via `tweetnacl secretbox`
2. **Document snapshots** (full state): Encrypted via `tweetnacl secretbox` before persisting to `block/` storage
3. **File blobs** (uploaded files): Encrypted via random key per file; key encrypted with user's document key. Stored in `blob/` storage
4. **Metadata** (titles, owners): Encrypted separately via metadata-specific keys. Stored via RPC in `datastore/`

### Who does encryption:
- **Web Worker** (`src/worker/`): A TypeScript-based client-side worker compiled via Rollup. Core crypto operations happen here (encrypt/decrypt channel operations, manage document keys)
- **Outer Frame** (`www/common/sframe-common-outer.js`): Mediates encryption requests, manages key cache
- **Inner Frame** (`www/common/sframe-common.js`): The sandboxed iframe where app logic runs; communicates encrypted operations to outer frame via `wire.js` (postMessage RPC)
- **media-tag.js**: Custom HTML element that performs streaming decryption of encrypted media files in-browser

### Zero-Knowledge Property:
The server NEVER has access to encryption keys. It stores:
- Encrypted blocks (content) — utterly opaque
- Encrypted blobs (files) — utterly opaque  
- Encrypted channel messages — utterly opaque
- Metadata — encrypted with metadata-specific keys the server doesn't have

---

## 3. Real-Time Collaboration Flow (ChainPad OT)

```
[User types in Editor]
    ↓
[Inner Frame: app-specific editor (CKEditor/CodeMirror/custom)]
    ↓  (operation captured)
[ChainPad OT: chainpad-netflux]
    ↓
[sframe-chainpad-netflux-inner.js] — wraps operation in postMessage
    ↓
[sframe-chainpad-netflux-outer.js] — receives postMessage, opens WebSocket
    ↓
[WebSocket]
    ↓
[Server: historyKeeper.js] — validates, persists, broadcasts
    ↓  (broadcast)
[All other connected clients receive operation]
    ↓
[ChainPad applies OT patch to local document]
    ↓
[Editor updates UI]
```

### Architecture Details:

**Client Side:**
- Each document type (pad, code, slide, sheet, form, kanban, etc.) uses ChainPad's OT algorithm for real-time conflict resolution
- ChainPad is a custom OT system designed for collaborative editing with:
  - **Add operations** (insert text/content)
  - **Remove operations** (delete text/content)
  - **Checkpoint operations** (full-state snapshots)
- Operations are protected by the **Paddington Checkpoint System**: periodic full-content checkpoints that allow new clients to sync quickly and prevent unbounded operation history growth

**sframe Architecture:**
- **Inner frame** (`sframe-boot2.js` → `sframe-chainpad-netflux-inner.js`): Sandboxed iframe containing the actual editor. Has NO direct network access. Communicates via postMessage to:
- **Outer frame** (`sframe-boot.js` → `sframe-chainpad-netflux-outer.js`): The host page with WebSocket access. Acts as a proxy/relay for the inner frame's network operations
- **wire.js** (185 lines): The postMessage RPC protocol bridge between inner and outer frames

**Server Side:**
- `historyKeeper.js`: The message relay server. Receives messages on WebSocket, validates them, persists to `datastore/` channel files, broadcasts to all connected clients on the same channel
- `hk-util.js`: Utilities for history keeper (message validation, channel management, rate limiting)
- Each document = one "channel". Channel history is stored as ordered messages in `datastore/<hash-prefix>/`

### Snapshot System:
- Periodic full-state snapshots ("checkpoints") stored in `block/` storage
- Snapshots are the encrypted full document state
- New clients receive the latest snapshot + subsequent operations to catch up

---

## 4. File Upload/Download Flow

### Upload:
```
[User selects file in editor]
    ↓
[Inner Frame: sframe-common-file.js (785 lines)]
    ↓  (encrypt file content with random key)
[File split into chunks]
    ↓  (each chunk encrypted)
[Outer Frame: outer/upload.js (244 lines)]
    ↓  (chunked upload with progress)
[RPC: UPLOAD_CHUNK commands]
    ↓
[Server: lib/commands/upload.js] 
    ↓
[Stored in blob/ storage as encrypted chunks]
    ↓
[Reference (encrypted key + hash) returned to client]
```

### Download:
```
[User opens pad with file]
    ↓
[Inner Frame requests file]
    ↓
[RPC: GET_BLOB / GET_BLOCK]
    ↓
[Server reads from blob/ or block/]
    ↓
[Encrypted data returned to client]
    ↓
[Outer Frame receives encrypted data]
    ↓
[media-tag.js or sframe-common-file.js decrypts in browser]
    ↓
[Blob URL created for display (URL.createObjectURL)]
    ↓
[Rendered as image/audio/video/PDF in editor]
```

### Blob vs Block:
| Aspect | Blob | Block |
|--------|------|-------|
| Contents | User-uploaded files (images, PDFs, audio, video) | Document state snapshots/checkpoints |
| Path | `blob/` | `block/` |
| Key Management | Per-file random key, separately encrypted | Per-channel key derived from document key chain |
| Access Pattern | Write-once, read-many | Many writers (collaborative editing), periodic reads |
| Chunking | Chunked upload for large files | Single-block per checkpoint |

---

## 5. State Management

### Client-Side State Architecture:
```
┌─────────────────────────────────────────────────────────┐
│                   OUTER FRAME (host page)                │
│  www/common/sframe-common-outer.js (2631 lines)          │
│  - User session state (logged in / out)                  │
│  - RPC proxy (all server communication)                  │
│  - Drive/document listing cache                          │
│  - Cross-tab sync via BroadcastChannel                   │
│  - Team membership state                                 │
│  - Notification state (unread count, list)               │
│  - Local-store: IndexedDB wrapper (outer/local-store.js) │
│         ↓ postMessage (wire.js RPC)                      │
├─────────────────────────────────────────────────────────┤
│              WEB WORKER (separate thread)                │
│  src/worker/store.ts (compiled to www/common/....)        │
│  - Cryptography operations (encrypt/decrypt)             │
│  - Proxy/replica management for chainpad documents       │
│  - Key caching and derivation                            │
│  - Module system:                                        │
│    ├── core/ → Connectors, StoreRPC, Interfaces          │
│    ├── components/ → Account, Drive, Pad, Form, Roster   │
│    └── modules/ → Mailbox, Cursor, Messenger, Calendar,  │
│                   Support, Team, Todo, Notification       │
│         ↑ postMessage (worker-channel.js)                │
├─────────────────────────────────────────────────────────┤
│              INNER FRAME (sandboxed iframe)              │
│  www/common/sframe-common.js (1089 lines)                 │
│  - Application-specific state (editor content, cursor)   │
│  - Toolbar state (buttons, modes)                        │
│  - Chat/messenger state                                  │
│  - No direct network or crypto access                    │
└─────────────────────────────────────────────────────────┘
```

### Persistence Layers:
| Layer | Technology | What's Stored |
|-------|-----------|---------------|
| Session | Cookie (HTTP-only) | User session token |
| Local config | localStorage | Language preference, theme, sidebar width, etc. |
| Offline cache | IndexedDB (via local-store.js) | Cached drive listings, metadata, user settings |
| In-memory | Map/closure vars | Key cache, current document state, cursors |
| Server | datastore/ (flat file) | Channel history (operations) |
| Server | block/ (flat file) | Document snapshots |
| Server | blob/ (flat file) | Uploaded files |
| Server | data/ (flat file) | Pins, logs, decrees |

### Cross-Tab Synchronization:
- Uses `BroadcastChannel` API (`sframe-common-outer.js`)
- Tabs broadcast: login/logout events, drive state changes, notification updates
- Receiving tabs reconcile local state without server round-trip

---

## 6. Server Request Flow (RPC Call)

```
[Client needs to perform operation]
    ↓
[Inner Frame: sframe-common.js]
    ↓  (postMessage RPC via wire.js)
[Outer Frame: sframe-common-outer.js]
    ↓  (selects RPC command)
[WebSocket to server]
    ↓
[Server accepts WebSocket message]
    ↓
[historyKeeper.js or http-commands.js dispatches based on message type]
    ↓  (if file/RPC operation)
[http-worker.js handles HTTP request] (or direct WebSocket handler)
    ↓
[rpc.js (248 lines) — routes to appropriate command handler]
    ↓
[Specific command handler in lib/commands/:]
    ├── core.js — core operations (create pad, write message, get history)
    ├── metadata.js or lib/metadata.js — metadata CRUD
    ├── upload.js — file/blob upload
    ├── pin.js — pin management
    ├── settings.js — user settings
    ├── register.js — registration
    ├── login.js — authentication / quota
    └── admin* — admin operations
    ↓
[lib/storage/file.js (1492 lines) — the core datastore engine]
    ├── read/write channel data (datastore/)
    ├── read/write blocks (block/)
    ├── read/write blobs (blob/)
    └── read/write pins (data/pins/)
    ↓
[Response flows back through same path]
    ↓
[Client receives result]
```

### Key Server Files:
| File | Lines | Role |
|------|-------|------|
| `server.js` | 230 | Main entry: Express app, config, process forking |
| `lib/http-worker.js` | — | Worker process: HTTP request handling |
| `lib/historyKeeper.js` | — | WebSocket message relay for real-time ops |
| `lib/rpc.js` | 248 | RPC command router |
| `lib/commands/core.js` | — | Core document operations |
| `lib/storage/file.js` | 1492 | Flat-file database engine |
| `lib/load-config.js` | — | Configuration loader |

---

## 7. Metadata Flow

```
[User creates/edits document]
    ↓
[Inner Frame: metadata-manager.js (229 lines)]
    ↓  (encrypt metadata with metadata key)
[Outer Frame: sframe-common-outer.js]
    ↓  (RPC: SET_METADATA)
[Server: lib/metadata.js]
    ↓  (persists encrypted metadata)
[datastore/ — encrypted metadata keyed by channel ID]
```

### What's tracked per document:
| Metadata Field | Client Encrypted? | Stored Where |
|---------------|-------------------|-------------|
| Title | Yes | datastore/ via RPC |
| Owner | Yes | datastore/ via RPC |
| Tags | Yes | datastore/ via RPC |
| Created date | Yes | datastore/ via RPC |
| Last modified | Yes | datastore/ via RPC |
| Expiration date | Yes | datastore/ via RPC |
| Template flag | Yes | datastore/ via RPC |
| Password hash | Yes | datastore/ via RPC |

### Metadata Encryption:
- Metadata has its own encryption keys, derived from the user's chain
- The server stores only encrypted metadata blobs
- The client reads all metadata, decrypts what it has keys for, displays filtered results
- The Drive UI (`www/common/drive-ui.js`, 5821 lines) aggregates and displays this metadata as the file browser

---

## Summary Data Flow Diagram (Text)

```
USER (Browser)                    SERVER (Node.js)
│                                     │
├─ Login ────(hashed proof)──────►  Validate ───► Session
│                                     │
├─ Create Pad ────(encrypted)────►  Create Channel ───► datastore/
│                                     │
├─ Type ────(encrypted op)──────►  historyKeeper ───► Broadcast
│  (ChainPad OT)                       │                  │
│  Wire.js (postMessage)               ▼                  ▼
│  Inner⇄Outer frames               All Other Clients
│  Web Worker (crypto)             (via WebSocket)
│                                     │
├─ Upload File ────(encrypted)────►  Store Blob ───► blob/
│                                     │
├─ Save Snapshot ────(encrypted)──►  Store Block ───► block/
│                                     │
├─ View Drive ────(encrypted)─────►  List Metadata ───► datastore/
│  (decrypt locally)                    │
│                                     │
└─ Edit Together ────(encrypted op)◄── Broadcast (all users)
```
