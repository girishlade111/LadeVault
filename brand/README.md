# LadeVault logo / icon mark

A single abstract glyph: a rounded document sheet with a folded corner (multi-format
document) that tapers to a **shield point** (privacy / vault) and sits on a darker
stacked layer behind it (layered / unified workspace). Monochrome brand azure with one
darker tonal shade for depth — no literal folder, no text, transparent background.

- **Brand color:** `#0087FF` (matches `customize.dist/src/less2/include/colortheme.less`)
- **Depth tone:** `#0067CC` → `#33A1FF` vertical gradient, darker back layer `#0059B8`
- **Finish:** soft vertical gradient + top highlight / bottom inner-shadow edge, fine
  grain clipped to the face (large sizes only)

## Assets

| File | Size | Use |
|------|------|-----|
| `ladevault-logo.svg` | vector | Master, full detail (gradient + grain + seam) |
| `ladevault-logo-1024.png` | 1024×1024 | Master raster, transparent |
| `ladevault-app-512.png` | 512×512 | PWA / web app manifest icon |
| `ladevault-favicon.svg` | vector | Simplified glyph (no grain/seam) for small sizes |
| `favicon/favicon-16.png` | 16×16 | Favicon |
| `favicon/favicon-32.png` | 32×32 | Favicon |
| `favicon/favicon-48.png` | 48×48 | Favicon |
| `favicon/favicon.ico` | 16+32+48 | Bundled `.ico` (PNG-encoded entries) |

Below ~32px the master's inner seam and grain turn to noise, so favicon sizes render
from the simplified `ladevault-favicon.svg` instead (bolder fold, flat 2-stop gradient).

## Rebuild the standalone asset set (in `brand/`)

```bash
node brand/build-logo.js
```

## Install into the live app

The app does **not** read from `brand/`. It serves logos and favicons from
`customize.dist/` (via `/customize/...`). Run the installer to overwrite those:

```bash
node brand/install-logo.js
```

This replaces:
- `customize.dist/CryptPad_logo.svg`, `CryptPad_logo_hero.svg` (azure) and
  `CryptPad_logo_grey.svg` (grey) — the header/footer/loading logos
- every `customize.dist/favicon/main-favicon*.{png,ico}` and `alt-favicon*.{png,ico}`
  (all per-app variants) with the new mark
- `customize.dist/favicon.ico` (root favicon)

After installing, hard-refresh the browser (Ctrl+Shift+R) or clear cache — browsers
cache favicons aggressively, which is usually why the old icon still appears.

Requires Node with the `sharp` package (already a project dependency). Colors and glyph
geometry live at the top of both scripts.
