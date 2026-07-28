# Phase 9: Gap Analysis & Rebuild Recommendations — CryptPad v2026.5.1

## 1. Architectural Gaps

### Gap 1: Monolithic Server Architecture
**Severity: Medium**
- Single Node.js process handles everything: HTTP, WebSocket, storage, crypto, admin
- No horizontal scaling capability without external session sharing (Redis)
- Worker thread only for client-side crypto, not for server offloading

**Symptom**: Server overload under many concurrent pads; no graceful degradation

### Gap 2: Legacy Module System (RequireJS/AMD)
**Severity: Medium**
- Client-side uses RequireJS AMD loader (v2.3.7, last released 2019)
- No tree-shaking, no code splitting, no dynamic imports
- All ~200 client-side JS files loaded individually over HTTP/2
- No bundle caching strategy beyond HTTP-level

**Symptom**: Slow initial page load; ~30+ HTTP requests for app startup

### Gap 3: No Lockfile
**Severity: High**
- No `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`
- `npm install` produces non-deterministic dependency trees
- CI and production may install different transitive versions

**Symptom**: "Works on my machine" bugs; audit failures from unpinned deps

### Gap 4: Outdated Editor Dependencies
**Severity: High**
- **CKEditor 4** (EOL 2023): Unpatched security vulnerabilities
- **CodeMirror 5** (superseded by CodeMirror 6 in 2023)
- **Bootstrap 4** (end-of-life, replaced by Bootstrap 5 in 2021)
- These three represent ~40% of frontend UI surface area

**Symptom**: Security advisories for CKEditor4; no new features from editors

### Gap 5: Minimal Test Coverage
**Severity: High**
- No unit tests for individual functions/modules
- Integration tests exist only for select server-side RPC commands
- Selenium E2E tests exist but coverage pattern is unclear
- No CI pipeline enforcing test pass/fail

**Symptom**: Regressions in edge cases; manual QA required for releases

### Gap 6: Scrypt-async v1 (Unmaintained)
**Severity: Medium**
- Password-based key derivation uses `scrypt-async` v1 (last updated 2016)
- Core to authentication security — no updates for 10+ years
- Web Crypto API now has built-in PBKDF2/scrypt support

**Symptom**: Potential performance/security improvements locked behind legacy code

### Gap 7: No TypeScript on Server Side
**Severity: Medium**
- `lib/` directory is entirely plain JavaScript (no types)
- `www/` and most of `src/` are also plain JS
- Only the Web Worker (`src/worker/`) uses TypeScript
- 500+ source files with zero type checking

**Symptom**: Runtime type errors; difficult refactoring; unknown function signatures

---

## 2. Security Gaps

### Gap 8: No Dependency Audit Automation
- No `npm audit` step in build/deploy
- Only `overrides` field addresses known CVEs (5 packages)
- SCA (Software Composition Analysis) not integrated

### Gap 9: No Rate Limiting on Auth
- Rate limiting exists for RPC calls but authentication endpoints not explicitly rate-limited
- Password brute-force protection relies on zero-knowledge proof (computational cost), not request throttling

### Gap 10: No Automated Security Scanning
- No SAST/DAST integration
- No CodeQL, Semgrep, or similar static analysis
- No secret scanning in CI

---

## 3. Operational Gaps

### Gap 11: No CI/CD Pipeline
- No GitHub Actions, GitLab CI, or similar
- No automated deployment workflow
- No artifact versioning

### Gap 12: No Health Monitoring
- Node.js server has no built-in metrics endpoint
- No Prometheus/OpenTelemetry integration
- Docker healthcheck is basic (`curl -f http://localhost:3000/`)
- Logging is minimal (configurable `logLevel`, but no structured logging)

### Gap 13: No Migration Support
- Data format migrations are ad-hoc (script-based)
- No database migration framework
- Upgrading between versions requires manual intervention

---

## 4. Rebuild Recommendations

### Recommendation A: Incremental Modernization (Low Risk)
**Timeline: 3-6 months**

1. **Add lockfile** — `npm install --package-lock-only` (immediate, gap 3)
2. **Update editors** — Replace CKEditor4 with TipTap/ProseMirror, CodeMirror5→6 (2 months)
3. **Add CI** — GitHub Actions with lint, test, build (1 week, gap 11)
4. **Add unit tests** — Vitest/Mocha for lib/, chainpad modules (1 month, gap 5)
5. **Replace scrypt-async** — Use Web Crypto API `crypto.subtle.deriveKey` (2 weeks, gap 6)
6. **Upgrade Bootstrap** — Bootstrap 4→5 or replace with Tailwind (1 month)

**Cost**: ~$50-80k engineering time
**Risk**: Low — surgical replacements, no architecture changes

### Recommendation B: Architectural Refactor (Medium Risk)
**Timeline: 6-12 months**

All of A, plus:

1. **ESM migration** — Replace RequireJS with ES modules + Vite bundling (2 months)
2. **TypeScript migration** — Server-side lib/* migration (3 months)
3. **Component-based UI** — Replace jQuery + Bootstrap patterns with React/Vue/Svelte (4 months)
4. **Module bundling** — Code splitting, lazy loading, CSS modules (1 month)
5. **Server modularization** — Separate WebSocket, HTTP, crypto into processes (2 months)

**Cost**: ~$200-300k engineering time
**Risk**: Medium — significant refactoring of ~200 file frontend

### Recommendation C: Full Rebuild (Highest Risk, Best Result)
**Timeline: 12-24 months**

1. **New architecture**: Go/Rust backend + TypeScript React frontend
2. **Same protocol**: Compatible with ChainPad CRDT protocol
3. **Modern stack**: Vite, React, Tailwind, TipTap, CodeMirror6
4. **Full TypeScript**: End-to-end type safety
5. **Microservices**: WebSocket gateway, storage service, auth service
6. **CI/CD + Monitoring**: GitHub Actions, Prometheus, structured logging
7. **Full test coverage**: Unit, integration, E2E, visual regression

**Cost**: ~$500k-1M engineering time
**Risk**: High — protocol compatibility must be maintained for existing data

---

## 5. Recommended Approach

**Path**: Recommendation A first (3-6 months), then evaluate B.

**Rationale**:
- The core real-time collaboration engine (ChainPad) is the unique value — it works well
- The pain points are in the UI layer and tooling, not the protocol
- Incremental modernization delivers value at each step
- Full rebuild risks breaking the CRDT protocol compatibility
- Security gaps (editors, scrypt) need immediate attention regardless

**Immediate Priorities** (Week 1-2):
1. Generate `package-lock.json`
2. Set up GitHub Actions CI
3. Run `npm audit` and resolve findings
4. Start CKEditor4 replacement evaluation
