# Phase 1: Repository Intelligence — CryptPad v2026.5.1

## One-Paragraph Hypothesis (to be refined)

CryptPad is a zero-knowledge, end-to-end-encrypted (E2EE) collaborative office suite. It provides a set of web-based applications (Rich Text, Code, Slide, Sheet, Presentation, Form, Kanban, Poll, Diagram/Whiteboard, File, Todo, Calendar) along with a file browser (CryptDrive). A Node.js backend serves static assets, proxies WebSocket-based real-time collaboration via Chainpad/Chainpad-netflux, and provides RPC endpoints for storage, pinning, upload, admin, and quota management. All user content is encrypted client-side before reaching the server; the server persists encrypted blocks and blobs in a flat file store. A separate client-side Web Worker (TypeScript, compiled via Rollup) handles internal state management, localforage-backed caching, and proxy management for the collaborative data structures.

---

## Full Folder Tree (depth-limited, dependency folders collapsed)

```
cryptpad-main/
├── .claude/                          # Claude Code configuration
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   │   └── test-trigger.yml          # CI workflow (trigger)
│   └── FUNDING.yml
├── config/
│   ├── config.example.js             # Template config (340 lines)
│   ├── config.js                     # Active config (fork of example)
│   └── sso.example.js                # SSO template
├── customize.dist/                   # Branding/UI customization entry point
│   ├── src/                          # LESS/CSS sources for theming
│   ├── fonts/
│   ├── images/
│   ├── pages/                        # Static pages (about, features, contact, etc.)
│   ├── translations/
│   ├── index.html, main.js, etc.     # Shell HTML/JS entry points
│   └── application_config.js         # Per-instance app config
├── data/                             # Runtime data (created on start)
│   ├── archive/
│   ├── blobstage/
│   ├── decrees/
│   ├── logs/
│   ├── pins/
│   └── tasks/
├── datastore/                        # Flat-file database (hex-hashed subdirs)
│   ├── 03/, 11/, 13/, 14/, 1b/ ...  # Channel data files (22 subdirs)
│   └── (22 two-hex-char subdirectories)
├── block/                            # Encrypted block storage (E2EE document data)
│   └── placeholder.txt
├── blob/                             # Encrypted blob storage (uploaded files)
│   └── placeholder.txt
├── docs/                             # Pre-existing project docs
│   ├── ARCHITECTURE.md               # Architecture overview (OT, Chainpad)
│   ├── example.nginx.conf            # Production nginx config
│   ├── example-advanced.nginx.conf
│   ├── cryptpad.service              # systemd service file
│   ├── rc.d-cryptpad
│   └── community/
├── lib/                              # Server-side Node.js backend
│   ├── api.js                        # API bootstrap
│   ├── archive-account.js
│   ├── batch-read.js
│   ├── challenge-commands/           # Challenge-based auth (captcha)
│   ├── client/                       # Server-side client abstractions
│   ├── commands/                     # RPC command handlers (core, admin, pin, quota, etc.)
│   ├── common-hash.js
│   ├── common-util.js
│   ├── crypto.js                     # Server-side crypto utilities
│   ├── decrees-core.js, decrees.js   # Admin decree system
│   ├── defaults.js                   # Default config values
│   ├── env.js                        # Environment/configuration loading (449 lines)
│   ├── eviction.js                   # Data eviction
│   ├── historyKeeper.js              # Message history server
│   ├── hk-util.js                    # HistoryKeeper utilities
│   ├── http-commands.js              # HTTP worker command handling
│   ├── http-worker.js                # HTTP worker process entry
│   ├── keys.js                       # Server key management
│   ├── load-config.js                # Config file loader
│   ├── log.js                        # Logging system
│   ├── metadata.js                   # Pad/channel metadata
│   ├── pins.js                       # Pin management
│   ├── plan.js                       # Subscription/plan logic
│   ├── plugin-manager.js             # Plugin system
│   ├── plugins/                      # Installed plugins
│   ├── rpc.js                        # RPC dispatcher (248 lines)
│   ├── schedule.js                   # Scheduled tasks
│   ├── stats.js                      # Statistics
│   ├── storage/                      # Storage backends (file, blob, block, user, etc.)
│   ├── stream-file.js
│   ├── workers/                      # Background worker processes
│   ├── write-queue.js                # Deferred write queue
│   └── (server-side node_modules — dependencies)
├── scripts/                          # Build, test, admin, and maintenance scripts
│   ├── api/                          # API scripts
│   ├── migrations/                   # Data migrations
│   ├── tests/                        # Test scripts
│   ├── translations/                 # Translation linting
│   ├── build.js                      # Build script
│   ├── install.js                    # Install helper
│   ├── TestSelenium.js               # Selenium-based E2E tests
│   ├── runtests.js
│   └── ...
├── src/                              # TypeScript source (compiled to www/common/)
│   ├── common/                       # Shared TS/JS modules (21 modules)
│   │   ├── common-constants.js
│   │   ├── common-util.js
│   │   ├── common-hash.js
│   │   ├── common-realtime.js
│   │   ├── common-credential.js
│   │   ├── common-signing-keys.js
│   │   ├── common-feedback.js
│   │   ├── outer/                    # Outer-frame modules
│   │   ├── onlyoffice/               # OnlyOffice integration
│   │   └── ...
│   ├── messages.js                   # Messages module
│   └── worker/                       # Web Worker (TS, compiled via Rollup)
│       ├── store.ts                  # Worker entry point
│       ├── async-store.js
│       ├── types.ts
│       ├── core/                     # Core worker subsystems
│       ├── components/               # Worker components (account, messaging, migrate)
│       └── modules/                  # Worker modules (mailbox, cursor, support, etc.)
├── www/                              # Client-side web application
│   ├── admin/                        # Admin panel
│   ├── auth/                         # Authentication page
│   ├── block/                        # [UNVERIFIED — purpose unclear from name]
│   ├── bounce/                       # SSO bounce/redirect page
│   ├── calendar/                     # Calendar app
│   ├── checkup/                      # Health check page
│   ├── code/                         # Code editor app (CodeMirror-based)
│   ├── common/                       # Shared client-side JS (67 modules)
│   │   ├── boot.js, boot2.js         # Application bootstrap
│   │   ├── sframe-*.js               # Secure frame framework (inner/outer architecture)
│   │   ├── drive-ui.js               # CryptDrive UI
│   │   ├── common-interface.js       # Shared UI components
│   │   ├── common-ui-elements.js     # Shared UI elements
│   │   ├── common-language.js        # i18n
│   │   ├── common-login.js           # Login UI
│   │   ├── common-notifier.js        # Notification UI
│   │   ├── media-tag.js              # Media tag handling
│   │   ├── toolbar.js                # Shared toolbar
│   │   ├── themes.js                 # Theme management
│   │   ├── outer/                    # Outer-frame logic
│   │   ├── inner/                    # Inner-frame logic
│   │   ├── translations/             # Translation files
│   │   ├── onlyoffice/               # OnlyOffice integration files
│   │   ├── theme/                    # Theme styles
│   │   └── worker.bundle.min.js      # Compiled Web Worker bundle
│   ├── components/                   # Vendored/bundled frontend components (34 libs)
│   ├── contacts/                     # Contacts page
│   ├── convert/                      # File conversion
│   ├── debug/                        # Debug page
│   ├── diagram/                      # Diagram app (Draw.io-based)
│   ├── doc/                          # Rich text document app (CKEditor-based)
│   ├── drive/                        # CryptDrive (file manager) app
│   ├── file/                         # File viewer/upload app
│   ├── form/                         # Form builder app
│   ├── install/                      # Install/pad creation page
│   ├── integration/                  # Integration page
│   ├── kanban/                       # Kanban board app
│   ├── lib/                          # Vendored third-party libraries (21 bundles)
│   ├── login/                        # Login page
│   ├── logout/                       # Logout page
│   ├── main.js                       # Main JS entry point
│   ├── moderation/                   # Moderation tools
│   ├── nextcloud/                    # Nextcloud integration
│   ├── notifications/                # Notifications page
│   ├── pad/                          # Rich text pad (CKEditor inner)
│   ├── poll/                         # Poll/survey app
│   ├── presentation/                 # Slide presentation app
│   ├── profile/                      # User profile page
│   ├── recovery/                     # Account recovery page
│   ├── register/                     # Registration page
│   ├── report/                       # Report/abuse page
│   ├── secureiframe/                 # Secure iframe host
│   ├── settings/                     # Settings page
│   ├── sheet/                        # Spreadsheet app
│   ├── slide/                        # Slide app
│   ├── ssoauth/                      # SSO auth page
│   ├── support/                      # Support page
│   ├── teams/                        # Team management page
│   ├── todo/                         # Todo list app
│   ├── unsafeiframe/                 # Unsafe iframe host
│   ├── web-apps/                     # App registry
│   │   └── apps/api/                 # Web app API
│   └── worker/                       # Client-side worker
├── server.js                         # Node.js server entry point (230 lines)
├── package.json                      # v2026.5.1, AGPL-3.0+
├── tsconfig.json                     # TypeScript config (src → www/common)
├── rollup.config.mjs                 # Rollup bundler config (src/worker → bundle)
├── eslint.config.mjs                 # ESLint flat config
├── .stylelintrc.js                   # Stylelint config
├── Dockerfile                        # Multi-stage Docker build
├── docker-compose.yml
├── docker-entrypoint.sh
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── FUNDING.json
├── LICENSE, LICENSES/
├── REUSE.toml                        # REUSE compliance
├── readme.md                         # Project README
├── screenshot.png, screenshot-suite.png
└── profile.png
```

---

## Monorepo Detection

**CryptPad is NOT a traditional monorepo with multiple independently deployable apps/packages managed by workspace tooling.** It is a **single Node.js application** with the following internal structure:

| Component | Location | Type |
|---|---|---|
| Backend server | `server.js` + `lib/` | Node.js Express HTTP + WebSocket server |
| Client-side apps | `www/<app>/` | Multiple web applications sharing common framework code |
| Shared frontend libs | `www/common/` | Reusable UI framework (secure-frame architecture) |
| Vendored components | `www/components/`, `www/lib/` | Third-party dependencies (symlinked/copied) |
| TypeScript worker | `src/worker/` | Client-side Web Worker (compiled to `www/common/`) |
| Build tooling | `scripts/`, `rollup.config.mjs` | Build scripts + Rollup bundle config |

**Workspace tooling: None.** No pnpm/yarn/npm workspaces, no Lerna, no Nx, no Turborepo. Dependencies are installed: `npm install` at root, with `npm run install:components` that copies certain vendor files into `www/components/`.

---

## Stack Breakdown

### Backend (Server)
| Aspect | Technology | Version |
|---|---|---|
| Runtime | Node.js | LTS (>= 18.x recommended, checked at runtime) |
| Web framework | Express | ~4.22.1 |
| WebSocket | ws (native) | ^8.17.1 |
| Auth tokens | jsonwebtoken (JWT) | ^9.0.3 |
| SAML SSO | @node-saml/node-saml | ^5.1.0 |
| OpenID Connect | openid-client | ^5.7.1 |
| Logging | Custom (`lib/log.js`) | — |
| Templating | Custom (HTML served via `res.sendFile`) | — |
| Compression | connect-gzip-static | ^4.2.1 |
| Proxy | http-proxy-middleware | ^3.0.3 |

### Frontend
| Aspect | Technology | Version |
|---|---|---|
| Loading/AMD | RequireJS | 2.3.7 |
| CSS preprocessor | Less (via RequireLess custom loader) | — |
| UI framework | jQuery + Bootstrap + Alertify | 3.6.0 / 4.0.0 / 1.0.11 |
| Encryption | tweetnacl + tweetnacl-util | ^1.0.3 / ^0.15.1 |
| Collaboration | Chainpad + chainpad-netflux + chainpad-server | ^5.3.x |
| Rich Text | CKEditor 4 | ~4.22.1 (npm:ckeditor4) |
| Code editor | CodeMirror | ^5.19.0 |
| Diagrams | draw.io (vendored fork) | 29.6.7+3 |
| Spreadsheets | Custom (sheet) | — |
| Math rendering | MathJax | 3.0.5 |
| Markdown | marked | ^4.3.0 |
| Media/thumbnails | html2canvas | ^1.4.0 |
| File archive | JSZip | 3.10.1 |
| Drag/drop | dragula, sortablejs | 3.7.2, ^1.6.0 |
| Date picker | Custom (www/lib/datepicker/) | — |
| Calendar | Custom + iCal | — |
| Chart/diagram | Mermaid | (vendored) |

### Build & Tooling
| Aspect | Technology | Version |
|---|---|---|
| Bundler | Rollup | ^4.24.0 |
| TypeScript compiler | TypeScript | ^5.6.2 (for `src/worker/` only) |
| Linter (JS) | ESLint | ^10.0.0 |
| Linter (CSS) | Stylelint | ^16.26.1 |
| Image processing | Sharp | ^0.35.3 |
| Fonts | Inter (via @fontsource), Geist, Open Sans | — |

### Runtime Target
- **Node.js**: >= 18.x (recommended 20.x+ per `defaults.js`)
- **Browser**: `> 0.5%, last 2 versions, Firefox ESR, not dead, not op_mini all`

---

## Entry Points

### Server
- **`server.js`** — Main server process. Creates Express app, loads config, spawns HTTP worker processes via `cluster.fork()`. HTTP workers run `lib/http-worker.js`.
- **`lib/http-worker.js`** — Worker process entry. Handles HTTP requests, runs the RPC dispatcher, manages WebSocket connections.
- **`lib/workers/db-worker.js`** — Database worker process (persistent storage).
- **`lib/workers/index.js`** — Worker index.

### Client-side applications
Each `www/<app>/` directory typically contains:
- **`index.html`** — Entry HTML loaded by the outer secure frame
- **`inner.html`** — Inner secure frame HTML (loaded in sandboxed iframe)
- **`inner.js`** — Inner-frame application logic
- **`main.js`** — Outer-frame page logic (drive-ui integration, toolbar, etc.)
- **`export.js`** — Export logic

### Web Worker (client-side)
- **`src/worker/store.ts`** — TypeScript entry point, compiled via Rollup to `www/common/worker.bundle.js` and `www/common/worker.bundle.min.js`.

### Shared Shell
- **`www/main.js`** — Main shell JS loaded on every page
- **`www/common/boot.js`** — Application boot sequence
- **`www/common/boot2.js`** — Secondary boot (post-authentication)

---

## Build & CI/CD

### npm Scripts
| Script | Command | Purpose |
|---|---|---|
| `start` | `node server.js` | Production start |
| `dev` | `DEV=1 node server.js` | Development mode |
| `build` | `node scripts/build.js` | Build assets |
| `api` | `rollup -c` | Build worker bundle (TypeScript → JS) |
| `lint` | `eslint . && stylelint "..."` | Full lint |
| `test` | `node scripts/TestSelenium.js` | Selenium E2E tests |
| `install:components` | `node scripts/copy-components.js` | Copy vendor files to www/components |

### CI/CD
- **GitHub Actions**: `.github/workflows/test-trigger.yml` — test trigger workflow
- **Docker**: `Dockerfile` (multi-stage, node:lts-alpine base), `docker-compose.yml`
- **NGINX**: Example configs at `docs/example.nginx.conf` and `docs/example-advanced.nginx.conf`

### Bundle Configuration
- **Rollup** (`rollup.config.mjs`): Bundles `src/worker/store.ts` → UMD bundles (pretty + minified). Uses `@rollup/plugin-typescript`, `@rollup/plugin-commonjs`, `@rollup/plugin-node-resolve`, `@rollup/plugin-json`, `@rollup/plugin-terser`.
- **TypeScript** (`tsconfig.json`): Target ES6, strict, compiles `src/**/*` to `www/common/`. Used exclusively for the worker.
- **Main build** (`scripts/build.js`): Likely handles copying/processing of static assets.

---

## Excluded Folders (with reason)
| Folder | Reason |
|---|---|
| `node_modules/` | npm dependencies |
| `www/components/` | Vendored library copies (managed by `install:components`) |
| `www/lib/` | Vendored third-party bundles |
| `.git/` | VCS data |
| `datastore/` | Runtime data (flat-file DB) — structure documented but contents are instance-specific |
| `data/` | Runtime data (pins, logs, tasks, archives) |
| `block/` | Runtime encrypted block storage (empty at framework level) |
| `blob/` | Runtime encrypted blob storage (empty at framework level) |
