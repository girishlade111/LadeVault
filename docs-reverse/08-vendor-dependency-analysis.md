# Phase 8: Vendor Dependency Analysis — CryptPad v2026.5.1

## 1. Production Dependencies (npm — package.json)

### Communication & Networking:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `ws` | ^8.17.1 | WebSocket server | Low (mature, maintained) |
| `express` | ~4.22.1 | HTTP server framework | Low |
| `netflux-websocket` | ^1.3.0 | WebSocket client transport | Medium (uncommon) |
| `http-proxy-middleware` | ^3.0.3 | HTTP proxy (OnlyOffice) | Low |
| `body-parser` | ^1.20.4 | HTTP body parsing | Low |
| `cookie-parser` | ^1.4.7 | Cookie parsing | Low |
| `connect-gzip-static` | ^4.2.1 | Gzip static serving | Low |

### Real-Time Collaboration (ChainPad ecosystem):
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `chainpad` | ^5.3.1 | CRDT/OT core library | Medium (proprietary, core-critical) |
| `chainpad-crypto` | ^0.3.0 | Cryptographic operations for CP | Medium |
| `chainpad-listmap` | ^1.2.0 | Object-to-channel mapping | Medium |
| `chainpad-netflux` | ^1.3.0 | Network transport abstraction | Medium |
| `chainpad-server` | ^5.3.0 | Server-side CP handling | Medium |
| `hyper-json` | ~1.4.0 | JSON patch operations | Low |
| `nthen` | 0.1.8 | Async sequencing helper | Low |

### Cryptographic:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `tweetnacl` | ^1.0.3 | NaCl crypto (secretbox, sign) | Low (audited, mature) |
| `tweetnacl-util` | ^0.15.1 | Encoding utilities for NaCl | Low |
| `scrypt-async` | 1.2.0 | Password-based key derivation | Medium (v1, async, unmaintained) |
| `jsonwebtoken` | ^9.0.3 | JWT session tokens | Low |
| `notp` | ^2.0.3 | TOTP (MFA) | Medium (unmaintained) |
| `thirty-two` | ^1.0.2 | Base32 encoding (TOTP) | Low |

### Editors & UI:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `ckeditor` (ckeditor4) | ~4.22.1 | Rich text editor | Medium (EOL 2023, no more security patches) |
| `codemirror` | ^5.19.0 | Code editor | Medium (v5, superseded by v6) |
| `drawio` | github:cryptpad/drawio-npm#29.6.7+3 | Diagram editor | Medium (custom fork) |
| `mathjax` | 3.0.5 | Math rendering | Low |
| `alertify.js` | 1.0.11 | Notification toasts | Medium (stale, v1) |
| `bootstrap` | ^4.0.0 | CSS framework | Medium (v4, outdated) |
| `jquery` | 3.6.0 | DOM manipulation (overridden) | Low |
| `dragula` | 3.7.2 | Drag-and-drop | Medium (archived) |
| `croppie` | ^2.5.0 | Image cropping | Low |
| `html2canvas` | ^1.4.0 | Screenshot capture | Low |
| `sortablejs` | ^1.6.0 | Sortable lists | Low |

### Storage & Files:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `localforage` | ^1.5.2 | Client-side IndexedDB wrapper | Low |
| `jszip` | 3.10.1 | ZIP file creation | Low |
| `pako` | ^2.1.0 | Compression (deflate) | Low |
| `file-saver` | 1.3.1 | Client-side file download | Medium (stale) |
| `fs-extra` | ^7.0.0 | Enhanced fs operations | Low |
| `get-folder-size` | ^2.0.1 | Directory size calculation | Low |

### SSO/Auth:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `@node-saml/node-saml` | ^5.1.0 | SAML authentication | Medium (security-sensitive) |
| `openid-client` | ^5.7.1 | OpenID Connect | Low |

### Utilities:
| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `@mcrowe/minibloom` | ^0.2.0 | Bloom filter | Low |
| `pull-stream` | ^3.6.1 | Streaming (pull-based) | Low |
| `stream-to-pull-stream` | ^1.7.2 | Stream adapter | Low |
| `requirejs` | 2.3.7 | AMD module loader | Medium (v2 legacy) |
| `requirejs-plugins` | ^1.0.2 | RequireJS plugins | Low |
| `require-css` | 0.1.10 | CSS loading via RequireJS | Low |
| `bootstrap-tokenfield` | ^0.12.0 | Token input UI | Medium (stale) |
| `open-sans-fontface` | ^1.4.0 | Open Sans font | Low |
| `x2js` | ^3.4.4 | XML↔JSON conversion | Low |
| `json.sortify` | github:cryptpad/JSON.sortify | Deterministic JSON sort | Low (custom fork) |
| `ulimit` | 0.0.2 | Process limits | Low |
| `saferphore` | 0.0.1 | Semaphore | Low |

---

## 2. Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `rollup` | ^4.24.0 | Worker bundle builder |
| `@rollup/plugin-commonjs` | ^28.0.0 | CommonJS→ESM conversion |
| `@rollup/plugin-json` | ^6.1.0 | JSON import |
| `@rollup/plugin-node-resolve` | ^15.3.0 | Node module resolution |
| `@rollup/plugin-terser` | ^1.0.0 | Minification |
| `@rollup/plugin-typescript` | ^12.1.0 | TypeScript compilation |
| `typescript` | ^5.6.2 | TypeScript compiler |
| `tslib` | ^2.7.0 | TypeScript runtime helpers |
| `eslint` | ^10.0.0 | JavaScript linter |
| `eslint-plugin-compat` | ^6.0.1 | Browser compatibility lint |
| `globals` | ^17.3.0 | ESLint globals definitions |
| `stylelint` | ^16.26.1 | CSS/LESS linter |
| `stylelint-config-standard-less` | ^3.0.1 | Stylelint LESS config |
| `sharp` | ^0.35.3 | Image processing (OG images) |
| `geist` | ^1.7.2 | Font package (Geist/Geist Mono) |
| `@fontsource/inter` | ^5.3.0 | Inter font |

---

## 3. Security Overrides

```
"overrides": {
    "minimist": "~1.2.3",
    "minimatch": "~10.2.2",
    "ws": "^8.17.1",
    "jquery": "3.6.0",
    "http-proxy": "npm:http-proxy-3@^1.23.2"
}
```
Overrides address known CVEs:
- **minimist**: Prototype pollution (CVE-2020-7598)
- **minimatch**: ReDoS (CVE-2022-3517)
- **ws**: DoS vulnerability (CVE-2024-37890, etc.)
- **jquery**: Various XSS/CVE fixes (pinned to 3.6.0)
- **http-proxy**: Replaced with maintained fork

---

## 4. Third-Party Code Inventory (Not in npm)

### Direct Vendored/Copied:
- **ChainPad ecosystem**: Core real-time collaboration libraries
- **Keystone** (`lib/keystone/`): Server-side content management (vendored)
- **Restyled** (from www/): Bootstrap/re-style libraries
- **customize.dist/**: Bootstrap-derived LESS/CSS customization framework

### External Services (Integration):
- **OnlyOffice Document Server**: External service for doc/sheet/slide editing
- **Stripe**: Payment processing (subscription/enterprise)
- **Nextcloud**: File storage integration
- **SSO Providers**: SAML/OIDC identity providers

---

## 5. Dependency Risk Assessment

| Risk Level | Count | Key Items |
|------------|-------|-----------|
| **High** | 0 | — |
| **Medium** | 12 | ckeditor4 (EOL), codemirror5 (superseded), bootstrap4, jquery (legacy), scrypt-async (v1, unmaintained), notp (unmaintained), ChainPad ecosystem (proprietary), file-saver (stale), alertify.js (v1), dragula (archived) |
| **Low** | 40+ | All others (mature, maintained) |

**Critical Observations:**
1. **no lockfile** — No `package-lock.json` leads to non-deterministic installs
2. **Legacy module system** — Uses RequireJS (AMD) rather than ESM/CommonJS
3. **No bundled frontend framework** — Vanilla JS + jQuery + Bootstrap, no React/Vue/Svelte
4. **ChainPad is proprietary** — Core real-time collaboration logic is the key architectural dependency; no off-the-shelf alternative exists
5. **ckeditor4 is EOL** — No more security patches, highest-risk dependency
6. **scrypt-async** — Critical for auth; unmaintained v1 library
