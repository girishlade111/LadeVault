# Phase 10: Output Compilation — CryptPad v2026.5.1

## Deliverables Index

| # | Document | Lines | Focus |
|---|----------|-------|-------|
| 01 | `01-repository-intelligence.md` | ~400 | Folder tree, stack, entry points, tooling |
| 02 | `lib-analysis.json` | 1026 | 55 lib/ files analyzed |
| 03 | `src-analysis.json` | 596 | 54 src/ files analyzed |
| 04 | `www-common-analysis.json` | 2015 | ~220 www/common/ files analyzed |
| 05 | `www-apps-analysis.json` | 543 | 16 apps + 19 utilities analyzed |
| 06 | `03-data-flow-analysis.md` | ~300 | 7 data flow diagrams |
| 07 | `04-configuration-security.md` | ~400 | Config, CSP, access control, abuse prevention |
| 08 | `05-integration-api-surface.md` | ~400 | RPC, wire.js, worker, external integrations |
| 09 | `06-build-deployment.md` | ~300 | Build pipeline, Docker, ports, CI/CD |
| 10 | `07-testing-quality.md` | ~200 | Test infra, linting, quality gaps |
| 11 | `08-vendor-dependency-analysis.md` | ~300 | 50+ dependencies, risk assessment |
| 12 | `09-gap-analysis-rebuild-recommendations.md` | ~250 | 13 gaps, 3 rebuild paths, recommendations |

**Total: ~6,500 lines across 12 files**

---

## Platform Summary

| Attribute | Value |
|-----------|-------|
| **Name** | CryptPad |
| **Version** | 2026.5.1 |
| **License** | AGPL-3.0+ |
| **Language** | JavaScript (95%) + TypeScript (5% — worker only) |
| **Runtime** | Node.js 18+ LTS |
| **Module System** | RequireJS AMD (client) + CommonJS (server) |
| **Bundler** | Rollup (worker only) |
| **Database** | Flat-file NDJSON (no SQL, no MongoDB) |
| **Real-Time Protocol** | ChainPad CRDT over WebSocket |
| **Encryption** | E2EE via TweetNaCl (X25519 + XSalsa20-Poly1305) |
| **Authentication** | Zero-knowledge password proof + PBKDF2 |
| **Frontend** | Vanilla JS + jQuery 3 + Bootstrap 4 |
| **Editors** | CKEditor 4, CodeMirror 5, OnlyOffice (external) |
| **Testing** | Server integration tests + Selenium E2E |
| **CI/CD** | None |
| **Deployment** | Bare metal or Docker |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Tab                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            OUTER FRAME (host page)                │   │
│  │  - Network access (WebSocket to server)           │   │
│  │  - DOM access (full page)                        │   │
│  │  - IndexedDB (localforage)                       │   │
│  │  - BroadcastChannel (cross-tab sync)              │   │
│  │  - Web Worker (crypto, proxy mgmt)                │   │
│  └──────────┬───────────────┬───────────────────────┘   │
│             │ postMessage   │ postMessage                │
│  ┌──────────▼──────────┐ ┌─▼─────────────────────────┐  │
│  │  INNER FRAME         │ │     WEB WORKER             │  │
│  │  (sandboxed iframe)  │ │  - Crypto (NaCl)           │  │
│  │  - No network access │ │  - Proxy management        │  │
│  │  - App-specific UI   │ │  - Channel connectors      │  │
│  │  - Editor instance   │ │  - State (drive, pad, etc) │  │
│  └─────────────────────┘ └──────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ WebSocket
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER (Node.js)                      │
│                                                          │
│  ┌────────────┐  ┌───────────┐  ┌────────────────────┐  │
│  │  Express    │  │ WebSocket  │  │  HistoryKeeper     │  │
│  │  HTTP/HTTPS │  │  Server    │  │  (channel routing) │  │
│  └─────┬──────┘  └─────┬─────┘  └─────────┬──────────┘  │
│        │               │                   │              │
│  ┌─────▼───────────────▼───────────────────▼──────────┐  │
│  │              COMMAND HANDLERS (lib/commands/)       │  │
│  │  CRUD · Metadata · Pins · Teams · Admin · Auth    │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                                │
│  ┌───────────────────────▼────────────────────────────┐  │
│  │              STORAGE LAYER                          │  │
│  │  datastore/ (NDJSON logs) · blob/ (files) ·        │  │
│  │  block/ (snapshots) · data/ (pins, metadata)       │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Key Architectural Numbers

| Category | Count | Detail |
|----------|-------|--------|
| Source files (JS) | ~500 | lib/ (150) + www/ (~300) + src/ (50) |
| TypeScript files | ~20 | src/worker/ (bundle goes to 1) |
| Apps | 16 | pad, code, slide, doc, sheet, kanban, whiteboard, diagram, form, poll, drive, teams, contacts, calendar, file, slide |
| Server-side files | ~80 | lib/ + storage + commands |
| RPC commands | ~40 | CREATE, WRITE, GET, SET, etc. |
| Production deps | 50 | See `package.json` |
| Translation files | ~80 | messages.{lang}.json |
| Docker volumes | 5 | blob, block, customize, data, datastore |
| Security layers | 8 | CSP → sframe → X-Frame → Headers → Auth → E2EE → Rate limit → Sandbox |

---

## Critical Paths

### Request Flow (Read Pad):
```
Browser → GET /pad/#/mypad
  → Server serves index.html (external)
  → Bootloader loads app-specific main.js (AMD)
  → Outer frame creates inner frame (sframe)
  → Inner frame creates WebSocket connection (proxied via outer)
  → Channel CREATEd or JOINed
  → Operations synced via ChainPad CRDT
  → Document decrypted in worker with TweetNaCl
  → UI rendered in inner frame
```

### Data at Rest:
```
Channel operations → NDJSON file in datastore/
Encrypted file upload → blob/{channel}/{random-hash}
Snapshot → block/{channel}/{hash}
Metadata → data/metadata/{channel}
Pins → data/pins/{user}
```

---

## Key Files to Read Next (for a Rebuilder)

| Priority | File | Why |
|----------|------|-----|
| 1 | `lib/rpc.js` | Core RPC dispatch — heart of server |
| 2 | `www/common/wire.js` | Inner↔Outer frame protocol |
| 3 | `lib/commands/core.js` | Channel command implementation |
| 4 | `src/worker/store.ts` | Worker state machine |
| 5 | `config/config.example.js` | All configuration options |
| 6 | `www/common/sframe-common.js` | Inner frame app framework |
| 7 | `www/common/sframe-common-outer.js` | Outer frame shell |
| 8 | `lib/history-keeper.js` | WebSocket message router |
| 9 | `lib/storage/file.js` | File-based persistence |
| 10 | `lib/load-config.js` | Config loading chain |
