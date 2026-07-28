# Phase 5: Integration & API Surface — CryptPad v2026.5.1

## 1. Client ↔ Server RPC API

### Transport:
- **WebSocket** (primary): All real-time communication via `ws` library
- **HTTP** (fallback): Some operations via HTTP POST endpoints handled by `http-worker.js`
- Single long-lived WebSocket connection per browser tab

### Protocol:
- JSON messages over WebSocket
- Messages include: `[MSG_ID, CHANNEL, CONTENT]` tuple format
- Operations encrypted with document key before sending
- Server authenticates via JWT token in initial handshake

### RPC Command Categories:

**Core Document Operations** (`lib/commands/core.js`):
| Command | Description |
|---------|-------------|
| `CREATE` | Create new pad/channel |
| `WRITE` | Write operation to channel (collaboration) |
| `GET_HISTORY` | Retrieve channel history from datastore |
| `GET_DOCUMENT` | Get latest document state |

**Metadata Operations** (`lib/metadata.js`):
| Command | Description |
|---------|-------------|
| `SET_METADATA` | Save pad metadata (title, tags, owner, expiration) |
| `GET_METADATA` | Retrieve pad metadata |
| `LIST_METADATA` | List all metadata for user's pads |

**File Operations** (`lib/commands/`):
| Command | Description |
|---------|-------------|
| `UPLOAD_CHUNK` | Upload encrypted file chunk |
| `UPLOAD_COMPLETE` | Finalize chunked upload |
| `GET_BLOB` | Download encrypted blob |
| `GET_BLOCK` | Download encrypted block (snapshot) |
| `DELETE_BLOB` | Delete stored blob |

**Account Operations** (`lib/commands/`):
| Command | Description |
|---------|-------------|
| `REGISTER` | Create new account |
| `LOGIN` | Authenticate (zero-knowledge proof) |
| `CHANGE_PASSWORD` | Update password (re-encrypt keys) |
| `DELETE_ACCOUNT` | Delete account and all data |

**Pin Operations** (`lib/pins.js`):
| Command | Description |
|---------|-------------|
| `PIN_CHANNEL` | Pin channel to prevent eviction |
| `UNPIN_CHANNEL` | Remove pin |
| `LIST_PINS` | Get all pinned channels for user |

**Settings/Profile** (`lib/commands/`):
| Command | Description |
|---------|-------------|
| `SETTINGS_GET` | Get user settings |
| `SETTINGS_SET` | Update user settings |
| `PROFILE_GET` | Get user profile |
| `PROFILE_SET` | Update user profile |

**Admin/Moderation** (`lib/commands/admin*.js`):
| Command | Description |
|---------|-------------|
| `ADMIN_RPC` | Execute admin operation (requires signed decree) |
| `MODERATION_REPORT` | Submit abuse report |
| `MODERATION_ACTION` | Apply moderation action (admin only) |

**Notification Operations**:
| Command | Description |
|---------|-------------|
| `NOTIFICATIONS_LIST` | Get notifications list |
| `NOTIFICATIONS_SET_READ` | Mark notification as read |
| `NOTIFICATIONS_DISMISS` | Dismiss notification |

**Team Operations**:
| Command | Description |
|---------|-------------|
| `TEAM_CREATE` | Create team |
| `TEAM_ADD_MEMBER` | Add member to team |
| `TEAM_REMOVE_MEMBER` | Remove member |
| `TEAM_SHARE` | Share document with team |

### Message Flow:
```
Client → WebSocket → historyKeeper.js → (authenticate, validate)
    ↓
Route to specific command handler (lib/commands/*.js)
    ↓
Execute operation (lib/storage/file.js for persistence)
    ↓
Return result via WebSocket
    ↓
Broadcast to all channel subscribers if applicable
```

---

## 2. Inner ↔ Outer Frame API (wire.js Protocol)

### Architecture:
```
┌─────────────────────────────────────┐
│  OUTER FRAME (host page)             │
│  www/common/sframe-common-outer.js   │
│  - Has network/WebSocket access      │
│  - Has DOM access (full page)        │
│  - Has IndexedDB access (local-store)│
│  - Has BroadcastChannel access       │
└──────────────┬──────────────────────┘
               │ postMessage (window.top, target origin)
               │ wire.js protocol: {txid, content, type, ...}
               ▼
┌─────────────────────────────────────┐
│  INNER FRAME (sandboxed iframe)      │
│  www/common/sframe-common.js          │
│  - NO network access                 │
│  - Limited DOM access                │
│  - Application-specific logic        │
│  - Editor instance                   │
└─────────────────────────────────────┘
```

### wire.js Protocol (185 lines):
- Request/Response matching via unique `txid` (transaction ID)
- Timeout mechanism for unanswered requests
- Message origin validation (checks `event.origin` against expected value)
- Generic enough for both RPC calls and event subscriptions

### Key Message Types:

**From Inner → Outer:**
| Message | Purpose |
|---------|---------|
| `RPC_CALL` | Execute server RPC (read/write channel data, metadata, files) |
| `CRYPTO_OP` | Request crypto operation from worker (encrypt/decrypt) |
| `NAVIGATE` | Navigate to different page/pad |
| `OPEN_FILE` | Open file picker |
| `DOWNLOAD_FILE` | Trigger file download |
| `GET_SETTINGS` | Retrieve user settings |
| `SET_TITLE` | Update document title |
| `NOTIFY` | Show notification/badge |

**From Outer → Inner:**
| Message | Purpose |
|---------|---------|
| `RPC_RESULT` | Result of server RPC call |
| `CHANNEL_MESSAGE` | New collaborative operation from other users |
| `STATE_CHANGE` | User state change (login/logout, settings change) |
| `NETWORK_STATUS` | Connection status change |
| `FILE_DATA` | Decrypted file data for display |
| `TITLE_UPDATE` | Title changed by another user |

---

## 3. Web Worker ↔ Main Thread API

### Architecture:
```
┌──────────────────────────────────┐
│  MAIN THREAD (outer frame)        │
│  www/common/outer/worker-channel.js │
│  - RPC-style messaging to worker  │
│  - Request/response with callbacks│
└──────────────┬───────────────────┘
               │ postMessage
               ▼
┌──────────────────────────────────┐
│  WEB WORKER (separate thread)     │
│  src/worker/store.ts               │
│  - Crypto operations              │
│  - Proxy management               │
│  - Modules:                       │
│    ├── components/*               │
│    └── modules/*                  │
└──────────────────────────────────┘
```

### Worker Channel (`outer/worker-channel.js`, 235 lines):
- Message queuing with ordered delivery
- Worker lifecycle management (spawn, crash detection)
- RPC-style request/response with message IDs
- Error propagation: worker errors forwarded to main thread
- Timeout handling for unanswered messages

### Worker Module System:
Worker modules are registered and dispatched by message type:

**Core** (`src/worker/core/`):
- `connectors.js` — chainpad-netflux connector management
- `store-rpc.js` — RPC dispatch within worker
- `interface.js` — internal interfaces
- `logging.js`, `util.js` — utilities

**Components** (`src/worker/components/`):
- `account.js` — user account management
- `drive.js` — CryptDrive state management
- `pad.js` — pad/document state management
- `form.js` — form state management
- `roster.js` — user roster management (who's online)
- `proxy-manager.js` — proxy/channel lifecycle
- `messenger.js` — messenger/chat state

**Modules** (`src/worker/modules/`):
- `mailbox.js` — encrypted mailbox operations
- `cursor.js` — cursor sync module
- `calendar.js` — calendar sync
- `team.js` — team state management
- `support.js` — support/help operations
- `todo.js` — todo list management
- `notification.js` — notification state

---

## 4. External Integrations

### OnlyOffice Integration:
| Component | Purpose |
|-----------|---------|
| `www/common/onlyoffice/inner.js` (4128 lines) | Main OO integration: lifecycle, sync, conversion |
| `www/common/onlyoffice/main.js` (194 lines) | Outer-frame OO bootstrap |
| `www/common/onlyoffice/history.js` (758 lines) | OO document version history |
| `www/common/onlyoffice/ooiframe.js` (173 lines) | OO iframe postMessage protocol |
| `www/common/onlyoffice/base*.js` (3 files) | Per-app-type base config (doc/sheet/slide) |
| `www/common/onlyoffice/broken-formats.js` | Incompatible format list |
| `www/common/onlyoffice/plugins.json` | OO plugins config |

### Nextcloud Integration:
- `www/nextcloud/` — Nextcloud app integration
- Authentication bridge between Nextcloud and CryptPad accounts
- File picker integration

### SSO Integration:
| Protocol | Package | Config |
|----------|---------|--------|
| SAML | `@node-saml/node-saml` | `config/sso.example.js` |
| OpenID Connect | `openid-client` | Same config file |

### Web App Platform:
- `www/web-apps/apps/api/` — API for registering CryptPad as a web app platform
- Allows third-party apps to run inside CryptPad's secure iframe architecture

---

## 5. Cross-Tab Synchronization (BroadcastChannel API)

- `sframe-common-outer.js` manages a `BroadcastChannel` connection
- Events broadcast across tabs:
  - `LOGIN` / `LOGOUT` — user authentication state changes
  - `DRIVE_CHANGE` — drive data modified in one tab
  - `NOTIFICATION_UPDATE` — new notification received
  - `SETTINGS_CHANGE` — user settings updated
- Receiving tabs reconcile their local state without server round-trips
- Uses `BroadcastChannel` API with `localStorage` fallback for older browsers

---

## 6. Plugin & Customization API

### Server Plugin System (`lib/plugin-manager.js`):
- Loads plugins from `lib/plugins/` directory
- Plugin lifecycle hooks for server events

### Client Customization (`customize.dist/`):
- `application_config.js` — per-instance app configuration
- Theme overrides via LESS/CSS
- Custom translation overlays
- Custom static pages served from `/customize/` route
- All customization is static/pre-configured, not runtime-extensible

### Client Extension Points:
- No formal client plugin API exists
- Extension achieved via customization layer (`customize.dist/`)
- App framework (`sframe-app-framework.js`) provides hooks for app lifecycle
- Media-tag supports custom element registration
