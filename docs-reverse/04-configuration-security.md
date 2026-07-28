# Phase 4: Configuration & Security Analysis — CryptPad v2026.5.1

## 1. Configuration System

### Configuration Loading Chain:
```
defaults.js (hardcoded defaults)
    ↓
load-config.js (loads config/)
    ↓
config/config.js (user-provided overrides)
    ↓
env.js (environment variable overrides)
    ↓
Runtime config object
```

### Key Configuration Files:
| File | Purpose |
|------|---------|
| `config/config.example.js` (340 lines) | Documented template with all possible settings |
| `config/config.js` | Active configuration (copy of example with user customizations) |
| `config/sso.example.js` | SSO (SAML/OIDC) configuration template |
| `customize.dist/application_config.js` | Per-instance app enable/disable configuration |
| `.env` (optional) | Environment variable overrides |

### Configuration Categories:

**Server:**
- `httpPort`, `httpSafePort`, `httpUnsafePort` — HTTP server ports
- `httpAddress` — bind address
- `maxUploadSize` — file upload limit (default: 20 MB)
- `maxSlidesPerPresentation` — slide count limit
- `defaultStorageLimit` — per-user storage quota

**Database/Storage:**
- `storagePath` — path to `datastore/`, `block/`, `blob/` directories
- `backupPath`, `backupStore` — backup configuration

**Crypto/Security:**
- `xframe` — iframe embedding restrictions
- `contentSecurity` — CSP header configuration (array of directives)
- `cspHash` — CSP hash for inline scripts
- `useExternalCSP` — boolean to disable automatic CSP assembly
- `sFrameAncestor`, `sFrameAncestorRegex` — allowed ancestors for secure iframes
- `disallowEmbedding` — prevent embedding in iframes on other origins

**Authentication:**
- `smtpCredentials` — email server for password reset
- `sso`, `saml`, `oidc` — SSO provider configs
- `allowRegistration` — enable/disable new user registration
- `accountsBlockList` — blocked email domains
- `loginBlock` — challenge-based auth (captcha) config

**Subscriptions:**
- `plan`, `stripe` — Stripe integration for paid plans
- `defaultPlan`, `plans` — plan definitions and pricing

**Admin:**
- `adminKeys` — admin public keys for decree system
- `restrictAccount`, `restrictRegistration` — access restriction
- `logLevel` — logging verbosity (`info`, `debug`, `warn`, `error`)

**Integration:**
- `nextcloud` — Nextcloud integration settings
- `onlyoffice` — OnlyOffice document server URL and config

### Environment Variables:
- `STORAGE` — override storage path
- `DEV` — enable development mode
- `VERBOSE` — verbose logging
- `ALLOW_UNSAFE_LEGACY_RENEGOTIATION` — TLS renegotiation
- `NODE_ENV` — Node.js environment

---

## 2. Security Architecture

### Defense in Depth Layers:

**Layer 1: Content Security Policy (CSP)**
- Built by `lib/env.js` from `config.contentSecurity` array
- `default-src: 'self'` — strict default
- `script-src: 'self' 'unsafe-eval'` + CSP hash for inline scripts
- `style-src: 'self' 'unsafe-inline'` — required for dynamic styling
- `frame-src: 'self'` + sframe origins — iframe restrictions
- `connect-src: 'self' ws: wss:` — WebSocket restrictions
- CSP hash auto-computed for each request to support the sframe sandbox page
- CSP hash iteration count read from config (`cspHash`)

**Layer 2: Secure Frame (sframe) Architecture**
- All application content loaded in sandboxed iframes
- `www/secureiframe/` hosts the sandboxed iframe pages
- sframe attributes: `allow-same-origin`, `allow-scripts`, `allow-popups`
- NO `allow-forms` in sframe (prevent phishing)
- Inner frame has NO network access — all communication proxied via outer frame
- postMessage origin validation (`wire.js` validates `event.origin`)

**Layer 3: X-Frame-Options / Frame Ancestors**
- Configurable via `xframe`, `sFrameAncestor`, `sFrameAncestorRegex` in config
- Prevents clickjacking by limiting which origins can embed CryptPad

**Layer 4: HTTP Headers**
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS) — configurable
- `Referrer-Policy: same-origin`

**Layer 5: Authentication**
- Password never sent in plaintext — only zero-knowledge proof
- PBKDF2 key derivation on client side
- JWT-signed session tokens
- Optional MFA/TOTP
- Optional SSO (SAML/OIDC)
- Optional captcha challenge (`lib/challenge-commands/`)

**Layer 6: End-to-End Encryption**
- All content encrypted before reaching server
- Server stores only ciphertext — zero knowledge
- Keys derived from user password, never stored server-side
- Per-document encryption keys
- Per-file random encryption keys

**Layer 7: Rate Limiting**
- `lib/rpc.js` — per-IP rate limiting on RPC calls
- `lib/hk-util.js` — channel-level rate limiting for real-time messages
- `lib/eviction.js` — data eviction for resource management
- Upload size limits enforced server-side

**Layer 8: Sandboxing**
- Web Worker (`src/worker/`) runs crypto in isolated thread
- sframe inner frames isolated by origin
- CKEditor/CodeMirror/OO editors run inside sandboxed iframes

---

## 3. Permission & Access Control Model

### Document-Level Permissions:
| Role | Can Read | Can Edit | Can Share | Can Delete |
|------|----------|----------|-----------|------------|
| Owner | ✅ | ✅ | ✅ | ✅ |
| Editor (via link) | ✅ | ✅ | ❌ | ❌ |
| Viewer (via link) | ✅ | ❌ | ❌ | ❌ |
| None (no link) | ❌ | ❌ | ❌ | ❌ |

### Access Controls (via `www/common/inner/access.js`, 1248 lines):
- **Password protection**: Optional password required to view
- **Link expiration**: Time-limited access links
- **Template mode**: Mark document as template (read-only for non-owners)
- **View-only mode**: Disable editing for collaborators
- **Owner management**: Transfer ownership to another user

### Team-Based Permissions:
- Teams managed via `www/teams/` app
- `lib/commands/team.js` — server-side team management
- Team roles: Owner, Admin, Member, Viewer
- Documents can be shared with entire team at once

### Admin Decrees:
- `lib/decrees-core.js`, `lib/decrees.js` — Admin decree system
- Admins can issue cryptographically signed decrees for:
  - Account suspension
  - Content moderation (deletion)
  - Storage quota changes
  - Feature toggles
- Decrees validated via admin public keys in config (`config.adminKeys`)

---

## 4. Plugin System

### Server-Side Plugins:
- `lib/plugin-manager.js` (33 lines) — lightweight plugin loader
- `lib/plugins/` — plugin directory
- Plugins can hook into server events and RPC calls
- No design-time plugins found in this installation

### Client-Side Customization:
- `customize.dist/` directory structure:
  - `application_config.js` — enable/disable apps, set defaults
  - `main.js` — override app shell behavior
  - Custom LESS/CSS themes
  - Custom translation overrides
  - Custom static pages (about, contact, features, terms, privacy, FAQ)
- The `customize.dist/` directory serves as the customization entry point for instance operators

### OnlyOffice Integration:
- External OO Document Server for doc/sheet/slide editing
- `www/common/onlyoffice/` — integration layer (10 files, most notably `inner.js` at 4128 lines)
- File format conversion (import/export) via `x2t` binary
- OO document history viewer for version diff

---

## 5. Abuse Prevention

| Mechanism | Implementation |
|-----------|---------------|
| Rate limiting | `lib/rpc.js` — per-IP RPC throttle |
| Upload limits | `config.maxUploadSize` (default 20 MB) |
| Registration controls | `allowRegistration`, `accountsBlockList` |
| Captcha | `lib/challenge-commands/` — challenge-based auth |
| Content moderation | Admin decrees for content deletion |
| Account suspension | Admin decrees + `restrictAccount` config |
| Data eviction | `lib/eviction.js` — remove stale/unpinned data |
| Channel rate limiting | `lib/hk-util.js` — per-channel message throttle |
