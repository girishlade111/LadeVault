/* Install the LadeVault mark into the app's live asset paths.
 *
 * The app does NOT read from brand/. It serves:
 *   - logo:    /customize/CryptPad_logo.svg, _hero.svg (azure), _grey.svg (grey)
 *   - favicon: /customize/favicon/main-favicon*.{png,ico} + alt-favicon*.{png,ico}
 *   - root:    /customize/favicon.ico
 * all resolved from ./customize.dist/. This script overwrites every one of those
 * targets with the new glyph so the running app shows it. Re-run after editing
 * build-logo.js (colors/paths live there; this file reuses that geometry).
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const CUSTOMIZE = path.join(ROOT, 'customize.dist');
const FAVDIR = path.join(CUSTOMIZE, 'favicon');

// ---- brand palette (same as build-logo.js) ----
const C = {
    hi: '#33A1FF', brand: '#0087FF', lo: '#0067CC',
    back: '#0059B8', fold: '#0061C4', innerShadow: '#003E80',
};

// ---- glyph geometry (shared with build-logo.js) ----
const FRONT = [
    'M168,156', 'Q168,132 192,132', 'L300,132', 'L344,176', 'L344,300',
    'C344,342 322,372 256,398', 'C190,372 168,342 168,300', 'Z',
].join(' ');
const FLAP = 'M300,132 L300,176 L344,176 Z';
const SEAM = 'M168,252 C168,252 344,252 344,252';

// Full-detail glyph in an arbitrary fill scheme (lets us make an azure and a grey variant).
function glyph(scheme) {
    const s = scheme;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${s.hi}"/>
      <stop offset="0.55" stop-color="${s.brand}"/>
      <stop offset="1" stop-color="${s.lo}"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.30" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="${s.innerShadow}" stop-opacity="0.30"/>
    </linearGradient>
    <clipPath id="clip"><path d="${FRONT}"/></clipPath>
  </defs>
  <path d="${FRONT}" transform="translate(-17,-15)" fill="${s.back}"/>
  <path d="${FRONT}" fill="url(#face)"/>
  <path d="${SEAM}" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="6" stroke-linecap="round" clip-path="url(#clip)"/>
  <path d="${FLAP}" fill="${s.fold}"/>
  <path d="${FRONT}" fill="url(#edge)"/>
</svg>`;
}

// Simplified glyph (no seam) for small favicon sizes and .ico entries.
function glyphSimple(s) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${s.hi}"/>
      <stop offset="1" stop-color="${s.lo}"/>
    </linearGradient>
  </defs>
  <path d="${FRONT}" transform="translate(-19,-17)" fill="${s.back}"/>
  <path d="${FRONT}" fill="url(#face)"/>
  <path d="${FLAP}" fill="${s.fold}"/>
</svg>`;
}

const GREY = { hi: '#C4C4C4', brand: '#9E9E9E', lo: '#7A7A7A', back: '#6E6E6E', fold: '#767676', innerShadow: '#4A4A4A' };

const azureSvg = glyph(C);
const azureSimpleSvg = glyphSimple(C);
const greySvg = glyph(GREY);

// ---- helpers ----
async function renderPng(svg, size, dest) {
    const buf = await sharp(Buffer.from(svg), { density: Math.max(72, Math.round(size / 512 * 384)) })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer();
    fs.writeFileSync(dest, buf);
    return buf;
}
async function renderIcoBuffer(svg) {
    const sizes = [16, 32, 48];
    const entries = [];
    for (const sz of sizes) {
        const buf = await sharp(Buffer.from(svg), { density: Math.max(72, Math.round(sz / 512 * 384)) })
            .resize(sz, sz, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png().toBuffer();
        entries.push({ size: sz, buf });
    }
    const header = Buffer.alloc(6);
    header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
    const dir = Buffer.alloc(16 * entries.length);
    let offset = 6 + dir.length;
    const blobs = [];
    entries.forEach((e, i) => {
        const b = i * 16;
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b);
        dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
        dir.writeUInt16LE(1, b + 4); dir.writeUInt16LE(32, b + 6);
        dir.writeUInt32LE(e.buf.length, b + 8);
        dir.writeUInt32LE(offset, b + 12);
        offset += e.buf.length; blobs.push(e.buf);
    });
    return Buffer.concat([header, dir, ...blobs]);
}

(async () => {
    // 1) Logo SVGs (icon-only, app renders these directly). Keep _hero == main.
    fs.writeFileSync(path.join(CUSTOMIZE, 'CryptPad_logo.svg'), azureSvg);
    fs.writeFileSync(path.join(CUSTOMIZE, 'CryptPad_logo_hero.svg'), azureSvg);
    fs.writeFileSync(path.join(CUSTOMIZE, 'CryptPad_logo_grey.svg'), greySvg);
    console.log('logos: CryptPad_logo.svg, _hero.svg, _grey.svg');

    // 2) Every favicon variant -> same LadeVault mark (main-* and alt-*, all app suffixes).
    const files = fs.readdirSync(FAVDIR);
    const pngTargets = files.filter(f => /^(main|alt)-favicon.*\.png$/.test(f));
    const icoTargets = files.filter(f => /^(main|alt)-favicon.*\.ico$/.test(f));
    const icoBuf = await renderIcoBuffer(azureSimpleSvg);
    for (const f of pngTargets) {
        await renderPng(azureSvg, 512, path.join(FAVDIR, f));
    }
    for (const f of icoTargets) {
        fs.writeFileSync(path.join(FAVDIR, f), icoBuf);
    }
    console.log(`favicons: ${pngTargets.length} PNG + ${icoTargets.length} ICO replaced`);

    // 3) Root favicon.ico served at /customize/favicon.ico
    fs.writeFileSync(path.join(CUSTOMIZE, 'favicon.ico'), icoBuf);
    console.log('root: customize.dist/favicon.ico');

    console.log('done. LadeVault mark installed into live app paths.');
})();
