# Phase 7: Testing & Quality — CryptPad v2026.5.1

## 1. Testing Infrastructure

### Test Types:

**Server-Side Integration Tests** (`scripts/tests/`):
| File | Description |
|------|-------------|
| `index.js` | Entry point (requires test-rpc) |
| `test-rpc.js` | RPC command tests (core operations, metadata, pins) |
| `test-scheduler.js` | Scheduler tests |
| `test-plan.js` | Plan/subscription tests |
| `test-pins.js` | Pin/eviction tests |
| `test-metadata.js` | Metadata operations tests |
| `test-mailbox.js` | Mailbox operations tests |
| `test-lkh.js` | Last-known-hash tests |
| `roster.js` | Roster/user management tests |

**Test Data** (`scripts/tests/test-data/`):
- Contains 5 NDJSON files simulating channel operation logs
- 5 matching `.metadata.ndjson` files
- Used by `test-metadata.js` and possibly others

**Selenium/End-to-End Tests** (`scripts/TestSelenium.js`):
- Selenium-based browser integration tests
- Triggered via `npm test`
- Full browser automation testing

### No Unit Tests:
- No Jest files, no test runners for individual functions/modules
- No `__tests__/` directories found
- Testing is integration-focused — requires a running server instance

---

## 2. Linting & Code Quality

| Tool | Version | Purpose | Command |
|------|---------|---------|---------|
| ESLint | ^10.0.0 | JavaScript linting | `npm run lint:js` |
| Stylelint | ^16.26.1 | LESS/CSS linting | `npm run lint:less` |
| TypeScript | ^5.6.2 | Type checking (worker only) | Via Rollup |
| Translation linter | Custom | Validation of i18n files | `npm run lint:translations` |

### Linting Observations:
- No ESLint config file found at root — likely uses ESLint's new flat config (eslint.config.js) or package.json config
- Stylelint uses `stylelint-config-standard-less`
- No Prettier detected (no formatting auto-enforcement)
- No commit hooks (no husky, lint-staged)

---

## 3. Code Quality Observations

### Strengths:
- Consistent C-style formatting across the codebase
- Thorough JSDoc comments (minimal, but present for public APIs)
- Modular architecture with clear separation of concerns
- Data encapsulation via closures (factory functions)
- Explicit error propagation from RPC layer
- Channel-based message model with consistent validation

### Weaknesses:
- No TypeScript in the server-side codebase (JS only for lib/, www/, most of src/ except worker)
- Minimal test coverage relative to codebase size
- No static analysis for client-side code
- Rollup only covers the worker — no bundling/type-checking for the ~200 client-side JS files
- No automated accessibility testing
- No visual regression testing
- No performance benchmarking infrastructure

---

## 4. Translation Quality

- `www/common/translations/` — comprehensive i18n system
- Messages in `messages.json` (English, source of truth)
- ~80 language-specific translation files (`messages.{lang}.json`)
- Translation linter catches missing keys, stale entries
- `unused-translations.js` script for detecting dead translation keys

---

## 5. Accessibility (a11y)
- No dedicated a11y testing infrastructure
- `customize.dist/src/less2/include/accessibility.less` — accessibility-focused styles
- Keyboard navigation: apps support Tab, Enter, Escape
- Screen reader: basic ARIA labels in templates
- ChromeVox/DRM accessibility features documented in code comments
